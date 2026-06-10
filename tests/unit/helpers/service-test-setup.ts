import { vi } from 'vitest';
import { Authentication } from '../../../src/services/authentication/index.js';
import { NeucronError } from '../../../src/utils/errors/sdk-error.js';

export const AUTH_TOKEN = 'test-auth-token-123';
export const AUTH_HEADERS = { Authorization: AUTH_TOKEN, 'X-Identifier': 'NEUCRON' };
export const BUSINESS_ID = 'biz-123';
export const BUSINESS_HEADERS = { ...AUTH_HEADERS, 'X-Neucron-Business-ID': BUSINESS_ID };

export function createMockHttpClient() {
    return {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    };
}

export function setupAuthenticatedAuth() {
    const mockAuth = new Authentication();
    mockAuth.setToken(AUTH_TOKEN);
    vi.spyOn(mockAuth, 'validate').mockImplementation(() => {});
    vi.spyOn(mockAuth, 'getToken').mockReturnValue(AUTH_TOKEN);
    return mockAuth;
}

export function createUnauthorizedError() {
    return new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
}

export function mockHttpResponse<T>(data: T) {
    return { data, status: 200, statusText: 'OK' };
}
