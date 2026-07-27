import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { HttpClient } from '../../src/utils/http/http-client.js';
import { SDK_NAME, SDK_VERSION } from '../../src/utils/version.js';
import pkg from '../../package.json' with { type: 'json' };

describe('SDK version constant', () => {
    it('matches package.json version', () => {
        expect(SDK_VERSION).toBe(pkg.version);
    });
});

describe('HttpClient transport behavior', () => {
    let requestMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        requestMock = vi.fn();
        vi.spyOn(axios, 'create').mockReturnValue({ request: requestMock } as never);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('sets a default timeout and SDK identification header', () => {
        new HttpClient('https://example.test/v1');
        expect(axios.create).toHaveBeenCalledWith({
            timeout: 30_000,
            headers: { 'X-Neucron-SDK': `${SDK_NAME}/${SDK_VERSION}` },
        });
    });

    it('honors a custom timeout', () => {
        new HttpClient('https://example.test/v1', { timeoutMs: 5000 });
        expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({ timeout: 5000 }));
    });

    it('retries GET on 503 and succeeds', async () => {
        const failure = Object.assign(new Error('Service Unavailable'), {
            isAxiosError: true,
            response: { status: 503, headers: {} },
        });
        requestMock
            .mockRejectedValueOnce(failure)
            .mockResolvedValueOnce({ data: { ok: true }, headers: {}, status: 200 });

        const client = new HttpClient('https://example.test/v1', { retryDelayMs: 1 });
        const res = await client.get('/ping', {});
        expect(res.status).toBe(200);
        expect(requestMock).toHaveBeenCalledTimes(2);
    });

    it('does not retry GET on 400', async () => {
        const failure = Object.assign(new Error('Bad Request'), {
            isAxiosError: true,
            response: { status: 400, headers: {} },
        });
        requestMock.mockRejectedValue(failure);

        const client = new HttpClient('https://example.test/v1', { retryDelayMs: 1 });
        await expect(client.get('/ping', {})).rejects.toThrow('Bad Request');
        expect(requestMock).toHaveBeenCalledTimes(1);
    });

    it('never retries POST even on 503', async () => {
        const failure = Object.assign(new Error('Service Unavailable'), {
            isAxiosError: true,
            response: { status: 503, headers: {} },
        });
        requestMock.mockRejectedValue(failure);

        const client = new HttpClient('https://example.test/v1', { retryDelayMs: 1 });
        await expect(client.post('/pay', {}, {})).rejects.toThrow('Service Unavailable');
        expect(requestMock).toHaveBeenCalledTimes(1);
    });

    it('gives up after maxRetries attempts', async () => {
        const failure = Object.assign(new Error('Bad Gateway'), {
            isAxiosError: true,
            response: { status: 502, headers: {} },
        });
        requestMock.mockRejectedValue(failure);

        const client = new HttpClient('https://example.test/v1', { maxRetries: 3, retryDelayMs: 1 });
        await expect(client.get('/ping', {})).rejects.toThrow('Bad Gateway');
        expect(requestMock).toHaveBeenCalledTimes(4); // initial + 3 retries
    });
});
