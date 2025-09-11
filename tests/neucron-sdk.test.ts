import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NeucronSDK } from '../src/nuecron-sdk.js';
import type { Config } from '../src/config.js';
import type { LoginBody, LoginResponse } from '../src/services/authentication/types.js';
import type { CreateWalletBody, CreateWalletReponse } from '../src/services/wallet/types.js';

// Mock all service dependencies
vi.mock('../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn().mockImplementation(() => ({
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    })),
}));

vi.mock('../src/services/authentication/validator.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        login: vi.fn(),
        loginResponse: vi.fn(),
        signUp: vi.fn(),
        signUpResponse: vi.fn(),
    })),
}));

vi.mock('../src/services/wallet/validator.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        createWallet: vi.fn(),
        createWalletResponse: vi.fn(),
        walletListResponse: vi.fn(),
        updateDefaultWallet: vi.fn(),
        updateDefaultWalletResponse: vi.fn(),
        walletAddress: vi.fn(),
        createAddressResponse: vi.fn(),
        walletAddressListResponse: vi.fn(),
    })),
}));

vi.mock('../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('NeucronSDK Integration', () => {
    let sdk: NeucronSDK;
    let mockAuthHttpClient: {
        post: ReturnType<typeof vi.fn>;
        get: ReturnType<typeof vi.fn>;
        put: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };
    let mockWalletHttpClient: {
        post: ReturnType<typeof vi.fn>;
        get: ReturnType<typeof vi.fn>;
        put: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        vi.clearAllMocks();
        sdk = new NeucronSDK();

        // Get mock instances from services
        mockAuthHttpClient = (sdk.auth as unknown as { httpClient: typeof mockAuthHttpClient }).httpClient;
        mockWalletHttpClient = (sdk.wallet as unknown as { httpClient: typeof mockWalletHttpClient }).httpClient;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('SDK Initialization', () => {
        it('should initialize without config', () => {
            const newSdk = new NeucronSDK();
            expect(newSdk.auth).toBeDefined();
            expect(newSdk.wallet).toBeDefined();
            expect(newSdk.team).toBeDefined();
            expect(newSdk.assets).toBeDefined();
            expect(newSdk.auth.getToken()).toBe('');
        });

        it('should initialize with config', () => {
            const config: Config = {
                authToken: 'initial-token-123',
            };
            const newSdk = new NeucronSDK(config);
            expect(newSdk.auth.getToken()).toBe('initial-token-123');
        });
    });

    describe('Authentication Flow', () => {
        const loginData: LoginBody = {
            email: 'test@example.com',
            password: 'password123',
        };

        const loginResponse: LoginResponse = {
            token: 'auth-token-456',
            platforms: ['NEUCRON'],
        };

        it('should successfully login and set token', async () => {
            mockAuthHttpClient.post.mockResolvedValue({
                data: loginResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await sdk.auth.login(loginData);

            expect(result.data).toEqual(loginResponse);
            expect(sdk.auth.getToken()).toBe('auth-token-456');
        });

        it('should handle login failure', async () => {
            const loginError = new Error('Invalid credentials');
            mockAuthHttpClient.post.mockRejectedValue(loginError);

            await expect(sdk.auth.login(loginData)).rejects.toThrow(loginError);
            expect(sdk.auth.getToken()).toBe('');
        });
    });

    describe('Wallet Operations with Authentication', () => {
        const createWalletData: CreateWalletBody = {
            walletName: 'Integration Test Wallet',
            paymailName: 'integrationtest',
        };

        const createWalletResponse: CreateWalletReponse = {
            wallet_id: 'wallet-integration-123',
            paymail_id: 'integrationtest@paymail.com',
        };

        it('should fail wallet operations without authentication', async () => {
            // Ensure no token is set
            expect(sdk.auth.getToken()).toBe('');

            // Wallet operations should fail
            await expect(sdk.wallet.createWallet(createWalletData)).rejects.toThrow('Unauthorized');
            await expect(sdk.wallet.walletList()).rejects.toThrow('Unauthorized');
            await expect(sdk.wallet.walletAddressList()).rejects.toThrow('Unauthorized');
        });

        it('should succeed wallet operations after authentication', async () => {
            // First, login to get token
            const loginData: LoginBody = {
                email: 'test@example.com',
                password: 'password123',
            };

            const loginResponse: LoginResponse = {
                token: 'wallet-auth-token-789',
                platforms: ['NEUCRON'],
            };

            mockAuthHttpClient.post.mockResolvedValue({
                data: loginResponse,
                status: 200,
                statusText: 'OK',
            });

            await sdk.auth.login(loginData);
            expect(sdk.auth.getToken()).toBe('wallet-auth-token-789');

            // Now wallet operations should succeed
            mockWalletHttpClient.post.mockResolvedValue({
                data: createWalletResponse,
                status: 201,
                statusText: 'Created',
            });

            const walletResult = await sdk.wallet.createWallet(createWalletData);
            expect(walletResult.data).toEqual(createWalletResponse);

            // Verify the authorization header was sent
            expect(mockWalletHttpClient.post).toHaveBeenCalledWith(
                '/wallet/create',
                null,
                { Authorization: 'wallet-auth-token-789' },
                {
                    walletName: 'Integration Test Wallet',
                    paymailName: 'integrationtest',
                }
            );
        });
    });

    describe('Complete User Journey', () => {
        it('should handle complete user registration and wallet creation flow', async () => {
            // Step 1: User signs up
            const signUpData = {
                email: 'newuser@example.com',
                password: 'securepassword123',
                first_name: 'New',
                last_name: 'User',
                platform: 'NEUCRON' as const,
            };

            const signUpResponse = {
                paymail_id: 'newuser@paymail.com',
                token: 'signup-token-123',
                user_id: 'user-new-123',
                wallet_id: 'wallet-new-123',
            };

            mockAuthHttpClient.post.mockResolvedValueOnce({
                data: signUpResponse,
                status: 201,
                statusText: 'Created',
            });

            const signUpResult = await sdk.auth.signUp(signUpData);
            expect(signUpResult.data).toEqual(signUpResponse);

            // Step 2: User logs in
            const loginData: LoginBody = {
                email: 'newuser@example.com',
                password: 'securepassword123',
            };

            const loginResponse: LoginResponse = {
                token: 'login-token-456',
                platforms: ['NEUCRON'],
            };

            mockAuthHttpClient.post.mockResolvedValueOnce({
                data: loginResponse,
                status: 200,
                statusText: 'OK',
            });

            const loginResult = await sdk.auth.login(loginData);
            expect(loginResult.data).toEqual(loginResponse);
            expect(sdk.auth.getToken()).toBe('login-token-456');

            // Step 3: User creates additional wallet
            const createWalletData: CreateWalletBody = {
                walletName: 'Secondary Wallet',
                paymailName: 'secondary',
            };

            const createWalletResponse: CreateWalletReponse = {
                wallet_id: 'wallet-secondary-789',
                paymail_id: 'secondary@paymail.com',
            };

            mockWalletHttpClient.post.mockResolvedValueOnce({
                data: createWalletResponse,
                status: 201,
                statusText: 'Created',
            });

            const walletResult = await sdk.wallet.createWallet(createWalletData);
            expect(walletResult.data).toEqual(createWalletResponse);

            // Step 4: User lists wallets
            const walletListResponse = {
                app_id: null,
                default_paymail_alias: null,
                is_default: true,
                team_id: null,
                user_id: 'user-new-123',
                wallet_id: 'wallet-secondary-789',
                name: 'Secondary Wallet',
            };

            mockWalletHttpClient.get.mockResolvedValueOnce({
                data: walletListResponse,
                status: 200,
                statusText: 'OK',
            });

            const listResult = await sdk.wallet.walletList();
            expect(listResult.data).toEqual(walletListResponse);

            // Verify all operations used the correct authentication
            expect(sdk.auth.getToken()).toBe('login-token-456');
        });

        it('should handle token expiration and re-authentication', async () => {
            // Initial login
            const loginData: LoginBody = {
                email: 'test@example.com',
                password: 'password123',
            };

            const loginResponse: LoginResponse = {
                token: 'initial-token-123',
                platforms: ['NEUCRON'],
            };

            mockAuthHttpClient.post.mockResolvedValueOnce({
                data: loginResponse,
                status: 200,
                statusText: 'OK',
            });

            await sdk.auth.login(loginData);
            expect(sdk.auth.getToken()).toBe('initial-token-123');

            // Simulate token expiration - wallet operation fails
            const authError = new Error('Token expired');
            mockWalletHttpClient.get.mockRejectedValueOnce(authError);

            await expect(sdk.wallet.walletList()).rejects.toThrow(authError);

            // Re-authenticate with new token
            const newLoginResponse: LoginResponse = {
                token: 'refreshed-token-456',
                platforms: ['NEUCRON'],
            };

            mockAuthHttpClient.post.mockResolvedValueOnce({
                data: newLoginResponse,
                status: 200,
                statusText: 'OK',
            });

            await sdk.auth.login(loginData);
            expect(sdk.auth.getToken()).toBe('refreshed-token-456');

            // Wallet operation should now succeed with new token
            const walletListResponse = {
                app_id: null,
                default_paymail_alias: null,
                is_default: true,
                team_id: null,
                user_id: 'user-123',
                wallet_id: 'wallet-123',
                name: 'Test Wallet',
            };

            mockWalletHttpClient.get.mockResolvedValueOnce({
                data: walletListResponse,
                status: 200,
                statusText: 'OK',
            });

            const listResult = await sdk.wallet.walletList();
            expect(listResult.data).toEqual(walletListResponse);

            // Verify the new token was used
            expect(mockWalletHttpClient.get).toHaveBeenLastCalledWith('/wallet/list', {
                Authorization: 'refreshed-token-456',
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle network errors gracefully', async () => {
            const networkError = new Error('Network connection failed');
            mockAuthHttpClient.post.mockRejectedValue(networkError);

            const loginData: LoginBody = {
                email: 'test@example.com',
                password: 'password123',
            };

            await expect(sdk.auth.login(loginData)).rejects.toThrow(networkError);
            expect(sdk.auth.getToken()).toBe('');
        });

        it('should handle validation errors', async () => {
            const validationError = new Error('Invalid email format');
            const mockValidator = (sdk.auth as unknown as { validator: { login: ReturnType<typeof vi.fn> } }).validator;
            mockValidator.login.mockImplementation(() => {
                throw validationError;
            });

            const loginData: LoginBody = {
                email: 'invalid-email',
                password: 'password123',
            };

            await expect(sdk.auth.login(loginData)).rejects.toThrow(validationError);
            expect(mockAuthHttpClient.post).not.toHaveBeenCalled();
        });
    });
});
