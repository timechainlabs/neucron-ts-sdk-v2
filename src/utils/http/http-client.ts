import type { Headers, HttpResponse, IHttpClient, QueryParams } from './types.js';
import { HttpTransportError } from './types.js';
import { BASE_URL } from '../../config.js';
import { SDK_NAME, SDK_VERSION } from '../version.js';

/** Options controlling HTTP transport behavior. */
export interface HttpClientOptions {
    /**
     * Per-request timeout in milliseconds. Applies to every request made by
     * the SDK. Defaults to 30 seconds.
     */
    timeoutMs?: number;
    /**
     * Maximum number of retries for safe (idempotent) requests that fail
     * with a retryable status (408, 429, 502, 503, 504) or a network error.
     * Only GET requests are retried; mutating requests are never retried
     * automatically to avoid duplicate side effects. Defaults to 2.
     */
    maxRetries?: number;
    /** Base delay for exponential backoff between retries. Defaults to 300ms. */
    retryDelayMs?: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 300;

const RETRYABLE_STATUS = new Set([408, 429, 502, 503, 504]);

type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RequestConfig {
    method: RequestMethod;
    url: string;
    data?: unknown;
    headers: Headers;
    params?: QueryParams;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Parse a Retry-After header (seconds or HTTP date) into milliseconds. */
function retryAfterMs(headerValue: string | undefined): number | undefined {
    if (!headerValue) return undefined;
    const seconds = Number(headerValue);
    if (!Number.isNaN(seconds)) return Math.max(0, seconds * 1000);
    const date = Date.parse(headerValue);
    if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
    return undefined;
}

function appendQueryParams(url: string, params?: QueryParams): string {
    if (!params) return url;
    const parsed = new URL(url);
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) parsed.searchParams.set(key, String(value));
    }
    return parsed.toString();
}

function responseHeaders(headers: globalThis.Headers): Headers {
    const result: Headers = {};
    headers.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}

async function parseResponseBody(response: Response): Promise<unknown> {
    if (response.status === 204 || response.status === 205) return undefined;
    const text = await response.text();
    if (!text) return undefined;
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }
    return text;
}

function isAbortError(err: unknown): boolean {
    return err instanceof DOMException && err.name === 'AbortError';
}

// HTTP client implemented with platform-native fetch to keep the SDK runtime dependency surface small.
export class HttpClient implements IHttpClient {
    private globalHeader: Headers;
    private readonly maxRetries: number;
    private readonly retryDelayMs: number;
    private readonly timeoutMs: number;

    constructor(
        private readonly baseUrl: string = BASE_URL,
        options: HttpClientOptions = {}
    ) {
        this.globalHeader = {
            'Content-Type': 'application/json',
        };
        this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
        this.retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
        this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    }

    private async executeRequest<T>(config: RequestConfig): Promise<HttpResponse<T>> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
        const url = appendQueryParams(config.url, config.params);
        const request = { method: config.method.toUpperCase(), url };

        try {
            const init: RequestInit = {
                method: request.method,
                headers: {
                    'X-Neucron-SDK': `${SDK_NAME}/${SDK_VERSION}`,
                    ...config.headers,
                },
                signal: controller.signal,
            };

            if (config.data !== undefined) {
                if (config.data instanceof FormData) {
                    init.body = config.data;
                } else {
                    init.body = JSON.stringify(config.data);
                }
            }

            const response = await fetch(url, init);
            const headers = responseHeaders(response.headers);
            const data = await parseResponseBody(response);

            if (!response.ok) {
                throw new HttpTransportError('Request failed', {
                    status: response.status,
                    data,
                    headers,
                    request,
                });
            }

            return {
                data: data as T,
                headers,
                status: response.status,
            };
        } catch (err) {
            if (err instanceof HttpTransportError) throw err;
            if (isAbortError(err)) {
                throw new HttpTransportError('Request timed out', {
                    code: 'ETIMEDOUT',
                    request,
                    cause: err,
                });
            }
            throw new HttpTransportError('Network error', {
                code: 'ENETWORK',
                request,
                cause: err,
            });
        } finally {
            clearTimeout(timeout);
        }
    }

    private async requestWithRetry<T>(config: RequestConfig, retryable: boolean): Promise<HttpResponse<T>> {
        let attempt = 0;
        while (true) {
            try {
                return await this.executeRequest<T>(config);
            } catch (err) {
                const isTransportError = err instanceof HttpTransportError;
                const status = isTransportError ? err.status : undefined;
                const isNetworkError = isTransportError && status === undefined && err.code !== 'ETIMEDOUT';
                const shouldRetry =
                    retryable &&
                    attempt < this.maxRetries &&
                    (isNetworkError || (status !== undefined && RETRYABLE_STATUS.has(status)));
                if (!shouldRetry) throw err;
                const headerDelay = isTransportError ? retryAfterMs(err.headers?.['retry-after']) : undefined;
                const backoff = headerDelay ?? this.retryDelayMs * 2 ** attempt;
                attempt += 1;
                await sleep(backoff);
            }
        }
    }

    async post<T>(
        reqPath: string,
        data: unknown,
        headers: Headers = {},
        params?: QueryParams
    ): Promise<HttpResponse<T>> {
        return this.requestWithRetry<T>(
            {
                method: 'post',
                url: this.baseUrl + `${reqPath}`,
                data,
                headers: {
                    ...(data instanceof FormData ? {} : this.globalHeader),
                    ...headers,
                },
                params,
            },
            false
        );
    }

    async get<T>(reqPath: string, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>> {
        return this.requestWithRetry<T>(
            {
                method: 'get',
                url: this.baseUrl + `${reqPath}`,
                headers: { ...headers },
                params,
            },
            true
        );
    }

    async put<T>(
        reqPath: string,
        data: unknown,
        headers: Headers = {},
        params?: QueryParams
    ): Promise<HttpResponse<T>> {
        return this.requestWithRetry<T>(
            {
                method: 'put',
                url: this.baseUrl + `${reqPath}`,
                data,
                headers: {
                    ...headers,
                    ...(data instanceof FormData ? {} : this.globalHeader),
                },
                params,
            },
            false
        );
    }

    async patch<T>(
        reqPath: string,
        data: unknown,
        headers: Headers = {},
        params?: QueryParams
    ): Promise<HttpResponse<T>> {
        return this.requestWithRetry<T>(
            {
                method: 'patch',
                url: this.baseUrl + `${reqPath}`,
                data,
                headers: {
                    ...headers,
                    ...(data instanceof FormData ? {} : this.globalHeader),
                },
                params,
            },
            false
        );
    }

    async delete<T>(reqPath: string, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>> {
        return this.requestWithRetry<T>(
            {
                method: 'delete',
                url: this.baseUrl + `${reqPath}`,
                headers: { ...headers },
                params,
            },
            false
        );
    }
}
