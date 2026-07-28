import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OAuth } from '../../src/services/oauth/index.js';
import { Authentication } from '../../src/services/authentication/index.js';
import type { OAuthAuthorizeRequest, OAuthTokenExchangeRequest } from '../../src/services/oauth/types.js';

let mockHttpClient: any;
let mockValidator: any;

vi.mock('../../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn(function HttpClient() {
        return mockHttpClient;
    }),
}));

vi.mock('../../src/services/oauth/validator.js', () => ({
    default: vi.fn(function Validator() {
        return mockValidator;
    }),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('OAuth Service', () => {
    let oauth: OAuth;
    let auth: Authentication;

    beforeEach(() => {
        vi.clearAllMocks();

        mockHttpClient = {
            get: vi.fn(),
            post: vi.fn(),
        };

        mockValidator = {
            authorize: vi.fn(),
            authorizeResponse: vi.fn(),
            exchangeToken: vi.fn(),
            tokenResponse: vi.fn(),
            clientInfoResponse: vi.fn(),
        };

        auth = new Authentication();
        oauth = new OAuth(auth, {
            baseUrl: 'https://dev.neucron.io/v1',
            oauth: {
                clientId: 'client-from-config',
                clientSecret: 'secret-from-config',
                redirectUri: 'https://app.example.com/auth/callback',
                platform: 'YourApp',
            },
        });
        (oauth as any).httpClient = mockHttpClient;
        (oauth as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('authorize', () => {
        const request: OAuthAuthorizeRequest = {
            client_id: 'client-123',
            redirect_uri: 'https://app.example.com/auth/callback',
            state: 'state-123',
            platform: 'YourApp',
            flow: 'sign-in',
        };

        it('should fetch the hosted login redirect URL', async () => {
            mockValidator.authorize.mockReturnValue({
                ...request,
                response_type: 'code',
            });
            mockValidator.authorizeResponse.mockReturnValue({
                redirect_url: 'https://dev.neucron.io/login/hosted',
            });

            mockHttpClient.get.mockResolvedValue({
                data: { redirect_url: 'https://dev.neucron.io/login/hosted' },
                status: 200,
            });

            const result = await oauth.authorize(request);

            expect(mockValidator.authorize).toHaveBeenCalledWith({
                ...request,
                client_id: 'client-123',
                redirect_uri: 'https://app.example.com/auth/callback',
                platform: 'YourApp',
            });
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                '/oauth/authorize',
                { Accept: 'application/json' },
                {
                    response_type: 'code',
                    client_id: 'client-123',
                    redirect_uri: 'https://app.example.com/auth/callback',
                    state: 'state-123',
                    platform: 'YourApp',
                    flow: 'sign-in',
                }
            );
            expect(result.data.redirect_url).toBe('https://dev.neucron.io/login/hosted');
        });

        it('should fall back to SDK config defaults', async () => {
            mockValidator.authorize.mockReturnValue({
                response_type: 'code',
                client_id: 'client-from-config',
                redirect_uri: 'https://app.example.com/auth/callback',
                state: 'state-456',
                platform: 'YourApp',
                flow: 'sign-up',
            });
            mockValidator.authorizeResponse.mockReturnValue({
                redirect_url: 'https://dev.neucron.io/login/signup',
            });

            mockHttpClient.get.mockResolvedValue({
                data: { redirect_url: 'https://dev.neucron.io/login/signup' },
                status: 200,
            });

            await oauth.authorize({
                state: 'state-456',
                flow: 'sign-up',
            });

            expect(mockValidator.authorize).toHaveBeenCalledWith({
                state: 'state-456',
                flow: 'sign-up',
                client_id: 'client-from-config',
                redirect_uri: 'https://app.example.com/auth/callback',
                platform: 'YourApp',
            });
        });
    });

    describe('exchangeToken', () => {
        const request: OAuthTokenExchangeRequest = {
            code: 'auth-code-123',
            redirect_uri: 'https://app.example.com/auth/callback',
            client_id: 'client-123',
            client_secret: 'secret-123',
            state: 'state-123',
        };

        it('should exchange the code and store the access token', async () => {
            mockValidator.exchangeToken.mockReturnValue({
                ...request,
                grant_type: 'authorization_code',
            });
            mockValidator.tokenResponse.mockReturnValue({
                access_token: 'access-token-123',
            });

            mockHttpClient.get.mockResolvedValue({
                data: { access_token: 'access-token-123' },
                status: 200,
            });

            const result = await oauth.exchangeToken(request);

            const [path, headers, params] = mockHttpClient.get.mock.calls[0];
            expect(path).toBe('/oauth/token');
            expect(headers).toEqual({ Accept: 'application/json' });
            expect(params).toEqual({
                grant_type: 'authorization_code',
                code: 'auth-code-123',
                redirect_uri: 'https://app.example.com/auth/callback',
                client_id: 'client-123',
                client_secret: 'secret-123',
                state: 'state-123',
            });

            expect(result.data.access_token).toBe('access-token-123');
            expect(auth.getToken()).toBe('access-token-123');
        });
    });

    describe('handleCallback', () => {
        beforeEach(() => {
            mockValidator.exchangeToken.mockReturnValue({
                grant_type: 'authorization_code',
                code: 'auth-code-123',
                redirect_uri: 'https://app.example.com/auth/callback',
                client_id: 'client-from-config',
                client_secret: 'secret-from-config',
                state: 'state-123',
            });
            mockValidator.tokenResponse.mockReturnValue({ access_token: 'access-token-123' });
            mockHttpClient.get.mockResolvedValue({
                data: { access_token: 'access-token-123' },
                status: 200,
            });
        });

        it('should exchange the code when state matches', async () => {
            const result = await oauth.handleCallback({
                code: 'auth-code-123',
                state: 'state-123',
                expectedState: 'state-123',
            });

            expect(result.data.access_token).toBe('access-token-123');
            expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
        });

        it('should reject a mismatched state without exchanging the code', async () => {
            await expect(
                oauth.handleCallback({
                    code: 'auth-code-123',
                    state: 'attacker-state',
                    expectedState: 'state-123',
                })
            ).rejects.toThrow(/state mismatch/i);

            expect(mockHttpClient.get).not.toHaveBeenCalled();
        });

        it('should reject an empty expected state rather than trusting the callback', async () => {
            await expect(
                oauth.handleCallback({
                    code: 'auth-code-123',
                    state: '',
                    expectedState: '',
                })
            ).rejects.toThrow(/state mismatch/i);

            expect(mockHttpClient.get).not.toHaveBeenCalled();
        });
    });

    describe('clientInfo', () => {
        it('should fetch public branding for the configured client', async () => {
            mockValidator.clientInfoResponse.mockReturnValue({
                client_id: 'client-from-config',
                app_name: 'Your App',
            });
            mockHttpClient.get.mockResolvedValue({
                data: { client_id: 'client-from-config', app_name: 'Your App' },
                status: 200,
            });

            const result = await oauth.clientInfo();

            expect(mockHttpClient.get).toHaveBeenCalledWith(
                '/oauth/client-info',
                { Accept: 'application/json' },
                { client_id: 'client-from-config' }
            );
            expect(result.data.app_name).toBe('Your App');
        });
    });
});
