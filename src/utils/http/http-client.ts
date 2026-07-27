import axios, { isAxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { Headers, HttpResponse, IHttpClient, QueryParams } from './types.js';
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

//http client with axios
export class HttpClient implements IHttpClient {
    private globalHeader: Record<string, string>;
    private readonly axios: AxiosInstance;
    private readonly maxRetries: number;
    private readonly retryDelayMs: number;

    constructor(
        private readonly baseUrl: string = BASE_URL,
        options: HttpClientOptions = {}
    ) {
        this.globalHeader = {
            'Content-Type': 'application/json',
        };
        this.maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
        this.retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
        this.axios = axios.create({
            timeout: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
            // Custom header (not User-Agent) so it also works in browsers and
            // React Native, where User-Agent is immutable.
            headers: { 'X-Neucron-SDK': `${SDK_NAME}/${SDK_VERSION}` },
        });
    }

    private async requestWithRetry<T>(config: AxiosRequestConfig, retryable: boolean): Promise<HttpResponse<T>> {
        let attempt = 0;
        while (true) {
            try {
                const response = await this.axios.request<T>(config);
                return {
                    data: response.data,
                    headers: response.headers as Headers,
                    status: response.status,
                };
            } catch (err) {
                const status = isAxiosError(err) ? err.response?.status : undefined;
                const isNetworkError = isAxiosError(err) && !err.response && err.code !== 'ECONNABORTED';
                const shouldRetry =
                    retryable &&
                    attempt < this.maxRetries &&
                    (isNetworkError || (status !== undefined && RETRYABLE_STATUS.has(status)));
                if (!shouldRetry) throw err;
                const headerDelay = isAxiosError(err)
                    ? retryAfterMs(err.response?.headers?.['retry-after'] as string | undefined)
                    : undefined;
                const backoff = headerDelay ?? this.retryDelayMs * 2 ** attempt;
                attempt += 1;
                await sleep(backoff);
            }
        }
    }

    async post<T>(reqPath: string, data: unknown, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>> {
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

    async put<T>(reqPath: string, data: unknown, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>> {
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

    async patch<T>(reqPath: string, data: unknown, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>> {
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

    async delete<T>(reqPath: string, headers: Headers, params: QueryParams): Promise<HttpResponse<T>> {
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
