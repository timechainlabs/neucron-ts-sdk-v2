export type Headers = Record<string, string>;
export type QueryParams = Record<string, string | number | undefined>;

export interface IHttpClient {
    get<T = unknown>(reqPath: string, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>>;
    post<T = unknown>(
        reqPath: string,
        data: unknown,
        headers?: Headers,
        params?: QueryParams
    ): Promise<HttpResponse<T>>;
    put<T = unknown>(reqPath: string, data: unknown, headers?: Headers, params?: QueryParams): Promise<HttpResponse<T>>;
    patch<T = unknown>(
        reqPath: string,
        data: unknown,
        headers?: Headers,
        params?: QueryParams
    ): Promise<HttpResponse<T>>;
    delete<T = unknown>(reqPath: string, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>>;
}

export interface HttpResponse<T> {
    data: T;
    headers: Headers;
    status: number;
}

export class HttpTransportError extends Error {
    public readonly code?: string;
    public readonly status?: number;
    public readonly data?: unknown;
    public readonly headers?: Headers;
    public readonly request?: { method?: string; url?: string };

    constructor(
        message: string,
        options: {
            code?: string;
            status?: number;
            data?: unknown;
            headers?: Headers;
            request?: { method?: string; url?: string };
            cause?: unknown;
        } = {}
    ) {
        super(message);
        this.name = 'HttpTransportError';
        this.code = options.code;
        this.status = options.status;
        this.data = options.data;
        this.headers = options.headers;
        this.request = options.request;
        if (options.cause instanceof Error && options.cause.stack) {
            this.stack = options.cause.stack;
        }
    }
}

export function isHttpTransportError(err: unknown): err is HttpTransportError {
    return (
        err instanceof HttpTransportError ||
        (typeof err === 'object' && err !== null && (err as Error).name === 'HttpTransportError')
    );
}
