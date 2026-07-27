import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BASE_URL, SANDBOX_BASE_URL, resolveBaseUrl } from '../../src/config.js';
import { Authentication } from '../../src/services/authentication/index.js';
import { OAuth } from '../../src/services/oauth/index.js';
import { HttpClient } from '../../src/utils/http/http-client.js';

const mockHttpClientInstance = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
};

vi.mock('../../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn(function HttpClient() {
        return mockHttpClientInstance;
    }),
}));

vi.mock('../../src/services/authentication/validator.js', () => ({
    default: vi.fn(function Validator() {
        return {};
    }),
}));

vi.mock('../../src/services/oauth/validator.js', () => ({
    default: vi.fn(function Validator() {
        return {};
    }),
}));

describe('resolveBaseUrl', () => {
    it('returns production URL by default', () => {
        expect(resolveBaseUrl()).toBe(BASE_URL);
        expect(resolveBaseUrl({})).toBe(BASE_URL);
        expect(resolveBaseUrl({ sandbox: false })).toBe(BASE_URL);
    });

    it('returns sandbox URL when sandbox is true', () => {
        expect(resolveBaseUrl({ sandbox: true })).toBe(SANDBOX_BASE_URL);
        expect(SANDBOX_BASE_URL).toBe('https://dev.neucron.io/v1');
    });

    it('returns custom baseUrl when provided', () => {
        expect(resolveBaseUrl({ baseUrl: 'https://custom.example/v1' })).toBe('https://custom.example/v1');
    });

    it('prefers baseUrl over sandbox', () => {
        expect(
            resolveBaseUrl({
                sandbox: true,
                baseUrl: 'https://custom.example/v1',
            })
        ).toBe('https://custom.example/v1');
    });
});

describe('HttpClient base URL wiring', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('Authentication uses production URL by default', () => {
        new Authentication();
        expect(HttpClient).toHaveBeenCalledWith(BASE_URL, expect.any(Object));
    });

    it('Authentication uses sandbox URL when sandbox is true', () => {
        new Authentication({ sandbox: true });
        expect(HttpClient).toHaveBeenCalledWith(SANDBOX_BASE_URL, expect.any(Object));
    });

    it('Authentication prefers baseUrl over sandbox', () => {
        new Authentication({ sandbox: true, baseUrl: 'https://custom.example/v1' });
        expect(HttpClient).toHaveBeenCalledWith('https://custom.example/v1', expect.any(Object));
    });

    it('OAuth uses the resolved base URL', () => {
        const auth = new Authentication({ sandbox: true });
        vi.clearAllMocks();
        new OAuth(auth, { sandbox: true });
        expect(HttpClient).toHaveBeenCalledWith(SANDBOX_BASE_URL, expect.any(Object));
    });
});
