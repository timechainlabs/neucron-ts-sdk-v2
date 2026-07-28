import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient } from '../../src/utils/http/http-client.js';
import { SDK_NAME, SDK_VERSION } from '../../src/utils/version.js';
import pkg from '../../package.json' with { type: 'json' };

describe('SDK version constant', () => {
    it('matches package.json version', () => {
        expect(SDK_VERSION).toBe(pkg.version);
    });
});

describe('HttpClient transport behavior', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        vi.stubGlobal('fetch', fetchMock);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    function jsonResponse(data: unknown, init: ResponseInit = {}) {
        return new Response(JSON.stringify(data), {
            status: init.status ?? 200,
            headers: {
                'content-type': 'application/json',
                ...(init.headers as Record<string, string> | undefined),
            },
        });
    }

    it('sets SDK identification and JSON headers on JSON requests', async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

        const client = new HttpClient('https://example.test/v1');
        await client.post('/pay', { amount: 1 }, { authorization: 'Bearer token' });

        expect(fetchMock).toHaveBeenCalledWith(
            'https://example.test/v1/pay',
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ amount: 1 }),
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'X-Neucron-SDK': `${SDK_NAME}/${SDK_VERSION}`,
                    authorization: 'Bearer token',
                }),
            })
        );
    });

    it('does not set JSON content type for FormData requests', async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
        const form = new FormData();
        form.append('file', new Blob(['hello']), 'hello.txt');

        const client = new HttpClient('https://example.test/v1');
        await client.post('/upload', form, {});

        expect(fetchMock).toHaveBeenCalledWith(
            'https://example.test/v1/upload',
            expect.objectContaining({
                body: form,
                headers: expect.not.objectContaining({ 'Content-Type': 'application/json' }),
            })
        );
    });

    it('appends query params and parses JSON responses', async () => {
        fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }, { headers: { 'x-request-id': 'req_1' } }));

        const client = new HttpClient('https://example.test/v1');
        const res = await client.get('/ping', { authorization: 'Bearer token' }, { page: 1, limit: undefined });

        expect(fetchMock).toHaveBeenCalledWith(
            'https://example.test/v1/ping?page=1',
            expect.objectContaining({ method: 'GET' })
        );
        expect(res).toEqual({
            data: { ok: true },
            headers: expect.objectContaining({ 'x-request-id': 'req_1' }),
            status: 200,
        });
    });

    it('retries GET on 503 and succeeds', async () => {
        fetchMock
            .mockResolvedValueOnce(jsonResponse({ error: 'temporarily unavailable' }, { status: 503 }))
            .mockResolvedValueOnce(jsonResponse({ ok: true }));

        const client = new HttpClient('https://example.test/v1', { retryDelayMs: 1 });
        const res = await client.get('/ping', {});

        expect(res.status).toBe(200);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('does not retry GET on 400', async () => {
        fetchMock.mockResolvedValue(jsonResponse({ error: 'Bad Request' }, { status: 400 }));

        const client = new HttpClient('https://example.test/v1', { retryDelayMs: 1 });
        await expect(client.get('/ping', {})).rejects.toMatchObject({
            name: 'HttpTransportError',
            status: 400,
            data: { error: 'Bad Request' },
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('never retries POST even on 503', async () => {
        fetchMock.mockResolvedValue(jsonResponse({ error: 'Service Unavailable' }, { status: 503 }));

        const client = new HttpClient('https://example.test/v1', { retryDelayMs: 1 });
        await expect(client.post('/pay', {}, {})).rejects.toMatchObject({
            name: 'HttpTransportError',
            status: 503,
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('gives up after maxRetries attempts', async () => {
        fetchMock.mockImplementation(() => Promise.resolve(jsonResponse({ error: 'Bad Gateway' }, { status: 502 })));

        const client = new HttpClient('https://example.test/v1', { maxRetries: 3, retryDelayMs: 1 });
        await expect(client.get('/ping', {})).rejects.toMatchObject({
            name: 'HttpTransportError',
            status: 502,
        });
        expect(fetchMock).toHaveBeenCalledTimes(4); // initial + 3 retries
    });

    it('reports timeouts as transport errors without retrying', async () => {
        vi.useFakeTimers();
        fetchMock.mockImplementation((_url: string, init: RequestInit) => {
            return new Promise((_resolve, reject) => {
                init.signal?.addEventListener('abort', () => {
                    reject(new DOMException('The operation was aborted.', 'AbortError'));
                });
            });
        });

        const client = new HttpClient('https://example.test/v1', { timeoutMs: 5, retryDelayMs: 1 });
        const request = client.get('/slow', {});
        const assertion = expect(request).rejects.toMatchObject({
            name: 'HttpTransportError',
            code: 'ETIMEDOUT',
        });
        await vi.advanceTimersByTimeAsync(5);

        await assertion;
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });
});
