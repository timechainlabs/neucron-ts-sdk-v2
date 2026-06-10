import axios from 'axios';
import type { Headers, HttpResponse, IHttpClient, QueryParams } from './types.js';
import { BASE_URL } from '../../config.js';

//http client wiht axios
export class HttpClient implements IHttpClient {
    private globalHeader: Record<string, string>;
    constructor() {
        this.globalHeader = {
            'Content-Type': 'application/json',
        };
    }
    async post<T>(reqPath: string, data: unknown, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>> {
        const url = BASE_URL + `${reqPath}`;
        const response = await axios.post(url, data, {
            headers: {
                ...headers,
                ...(data instanceof FormData ? {} : this.globalHeader),
            },
            params,
        });
        return {
            data: response.data,
            headers: response.headers as Headers,
            status: response.status,
        };
    }

    async get<T>(reqPath: string, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>> {
        const url = BASE_URL + `${reqPath}`;
        const response = await axios.get(url, {
            headers: {
                ...headers,
            },
            params,
        });
        return {
            data: response.data,
            headers: response.headers as Headers,
            status: response.status,
        };
    }

    async put<T>(reqPath: string, data: unknown, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>> {
        const url = BASE_URL + `${reqPath}`;
        const response = await axios.put(url, data, {
            headers: {
                ...headers,
                ...(data instanceof FormData ? {} : this.globalHeader),
            },
            params,
        });
        return {
            data: response.data,
            headers: response.headers as Headers,
            status: response.status,
        };
    }

    async patch<T>(reqPath: string, data: unknown, headers: Headers, params?: QueryParams): Promise<HttpResponse<T>> {
        const url = BASE_URL + `${reqPath}`;
        const response = await axios.patch(url, data, {
            headers: {
                ...headers,
                ...(data instanceof FormData ? {} : this.globalHeader),
            },
            params,
        });
        return {
            data: response.data,
            headers: response.headers as Headers,
            status: response.status,
        };
    }

    async delete<T>(reqPath: string, headers: Headers, params: QueryParams): Promise<HttpResponse<T>> {
        const url = BASE_URL + `${reqPath}`;
        const response = await axios.delete(url, {
            headers: {
                ...headers,
            },
            params,
        });
        return {
            data: response.data,
            headers: response.headers as Headers,
            status: response.status,
        };
    }
}
