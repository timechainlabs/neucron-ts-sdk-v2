import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NeucronSDK } from '../../src/neucron-sdk.js';
import type { Config } from '../../src/config.js';
import type { LoginBody, LoginResponse } from '../../src/services/authentication/types.js';
import type { CreateWalletBody, CreateWalletReponse } from '../../src/services/wallet/types.js';

// Store mock instances to access them in tests
let mockAuthHttpClient: any;
let mockWalletHttpClient: any;
let mockAuthValidator: any;
let mockWalletValidator: any;

// Mock all service dependencies
vi.mock('../../src/utils/http/http-client.js', () => {
    const mockImplementation = () => ({
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    });

    return {
        HttpClient: vi.fn().mockImplementation(function () {
            return mockImplementation();
        }),
    };
});

vi.mock('../../src/services/authentication/validator.js', () => {
    const mockImplementation = () => ({
        login: vi.fn(),
        loginResponse: vi.fn(),
        signUp: vi.fn(),
        signUpResponse: vi.fn(),
    });

    return {
        default: vi.fn().mockImplementation(function () {
            return mockImplementation();
        }),
    };
});

vi.mock('../../src/services/wallet/validator.js', () => {
    const mockImplementation = () => ({
        createWallet: vi.fn(),
        createWalletResponse: vi.fn(),
        walletListResponse: vi.fn(),
        updateDefaultWallet: vi.fn(),
        updateDefaultWalletResponse: vi.fn(),
        walletAddress: vi.fn(),
        createAddressResponse: vi.fn(),
        walletAddressListResponse: vi.fn(),
    });

    return {
        default: vi.fn().mockImplementation(function () {
            return mockImplementation();
        }),
    };
});

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('NeucronSDK Integration', () => {
    let sdk: NeucronSDK;

    beforeEach(() => {
        vi.clearAllMocks();

        // Create fresh mock instances
        mockAuthHttpClient = {
            post: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        };

        mockWalletHttpClient = {
            post: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        };

        mockAuthValidator = {
            login: vi.fn(),
            loginResponse: vi.fn(),
            signUp: vi.fn(),
            signUpResponse: vi.fn(),
        };

        mockWalletValidator = {
            createWallet: vi.fn(),
            createWalletResponse: vi.fn(),
            walletListResponse: vi.fn(),
            updateDefaultWallet: vi.fn(),
            updateDefaultWalletResponse: vi.fn(),
            walletAddress: vi.fn(),
            createAddressResponse: vi.fn(),
            walletAddressListResponse: vi.fn(),
        };

        sdk = new NeucronSDK();

        // Manually inject mocks into the SDK services
        if (sdk.auth && typeof sdk.auth === 'object') {
            (sdk.auth as any).httpClient = mockAuthHttpClient;
            (sdk.auth as any).validator = mockAuthValidator;
        }

        if (sdk.wallet && typeof sdk.wallet === 'object') {
            (sdk.wallet as any).httpClient = mockWalletHttpClient;
            (sdk.wallet as any).validator = mockWalletValidator;
        }
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('SDK Initialization', () => {
        it('should initialize without config', () => {
            const newSdk = new NeucronSDK();
            expect(newSdk.auth).toBeDefined();
            expect(newSdk.wallet).toBeDefined();
            expect(newSdk.assets).toBeDefined();
            expect(newSdk.business).toBeDefined();
            expect(newSdk.members).toBeDefined();
            expect(newSdk.rbac).toBeDefined();
            expect(newSdk.apps).toBeDefined();
            expect(newSdk.assetSwap).toBeDefined();
            expect(newSdk.blob).toBeDefined();
            expect(newSdk.invoice).toBeDefined();
            expect(newSdk.customer).toBeDefined();
            expect(newSdk.vendor).toBeDefined();
            expect(newSdk.bill).toBeDefined();
            expect(newSdk.payout).toBeDefined();
            expect(newSdk.billing).toBeDefined();
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
            // Mock validation to pass
            mockAuthValidator.login.mockReturnValue(true);
            mockAuthValidator.loginResponse.mockReturnValue(loginResponse);

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
            // Mock validation to pass
            mockAuthValidator.login.mockReturnValue(true);

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

            // Mock validators to simulate unauthorized errors
            mockWalletValidator.createWallet.mockImplementation(() => {
                throw new Error('Unauthorized');
            });
            mockWalletValidator.walletListResponse.mockImplementation(() => {
                throw new Error('Unauthorized');
            });
            mockWalletValidator.walletAddressListResponse.mockImplementation(() => {
                throw new Error('Unauthorized');
            });

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

            // Mock auth validation and response
            mockAuthValidator.login.mockReturnValue(true);
            mockAuthValidator.loginResponse.mockReturnValue(loginResponse);

            mockAuthHttpClient.post.mockResolvedValue({
                data: loginResponse,
                status: 200,
                statusText: 'OK',
            });

            await sdk.auth.login(loginData);
            expect(sdk.auth.getToken()).toBe('wallet-auth-token-789');

            // Mock wallet validation
            mockWalletValidator.createWallet.mockReturnValue(true);
            mockWalletValidator.createWalletResponse.mockReturnValue(createWalletResponse);

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
                {},
                { Authorization: 'wallet-auth-token-789', 'X-Identifier': 'NEUCRON' },
                {
                    walletName: 'Integration Test Wallet',
                    paymailName: 'integrationtest',
                    walletType: undefined,
                    custodianProvider: undefined,
                    customCustodianEndpoint: undefined,
                    provider: undefined,
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

            // Mock signup validation
            mockAuthValidator.signUp.mockReturnValue(true);
            mockAuthValidator.signUpResponse.mockReturnValue(signUpResponse);

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

            // Mock login validation
            mockAuthValidator.login.mockReturnValue(true);
            mockAuthValidator.loginResponse.mockReturnValue(loginResponse);

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

            // Mock wallet creation validation
            mockWalletValidator.createWallet.mockReturnValue(true);
            mockWalletValidator.createWalletResponse.mockReturnValue(createWalletResponse);

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

            // Mock wallet list validation
            mockWalletValidator.walletListResponse.mockReturnValue(walletListResponse);

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

            // Mock initial login
            mockAuthValidator.login.mockReturnValue(true);
            mockAuthValidator.loginResponse.mockReturnValue(loginResponse);

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

            // Mock re-authentication
            mockAuthValidator.loginResponse.mockReturnValue(newLoginResponse);

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

            // Mock successful wallet list
            mockWalletValidator.walletListResponse.mockReturnValue(walletListResponse);

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
                'X-Identifier': 'NEUCRON',
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle network errors gracefully', async () => {
            // Mock validation to pass
            mockAuthValidator.login.mockReturnValue(true);

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
            mockAuthValidator.login.mockImplementation(() => {
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
