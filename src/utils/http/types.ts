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
    delete<T = unknown>(reqPath: string, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>>;
}

export interface HttpResponse<T> {
    data: T;
    headers: Headers;
    status: number;
}
