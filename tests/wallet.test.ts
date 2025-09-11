import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Wallet } from '../src/services/wallet/index.js';
import { Authentication } from '../src/services/authentication/index.js';
import { NeucronError } from '../src/utils/errors/sdk-error.js';
import type {
    CreateWalletBody,
    CreateWalletReponse,
    UpdateDefaultWalletBody,
    UpdateDefaultWalletResponse,
    WalletListResponse,
    WalletAddressBody,
    CreateAddressResponse,
    WalletAddressListResponse,
} from '../src/services/wallet/types.js';

// Mock the HTTP client
vi.mock('../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn().mockImplementation(() => ({
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    })),
}));

// Mock the validator
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

// Mock error handler
vi.mock('../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Wallet Service', () => {
    let wallet: Wallet;
    let mockAuth: Authentication;
    let mockHttpClient: {
        post: ReturnType<typeof vi.fn>;
        get: ReturnType<typeof vi.fn>;
        put: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };
    let mockValidator: {
        createWallet: ReturnType<typeof vi.fn>;
        createWalletResponse: ReturnType<typeof vi.fn>;
        walletListResponse: ReturnType<typeof vi.fn>;
        updateDefaultWallet: ReturnType<typeof vi.fn>;
        updateDefaultWalletResponse: ReturnType<typeof vi.fn>;
        walletAddress: ReturnType<typeof vi.fn>;
        createAddressResponse: ReturnType<typeof vi.fn>;
        walletAddressListResponse: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Create mock authentication instance
        mockAuth = new Authentication();
        mockAuth.setToken('test-auth-token-123');

        // Mock auth methods
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {});
        vi.spyOn(mockAuth, 'getToken').mockReturnValue('test-auth-token-123');

        // Create wallet instance
        wallet = new Wallet(mockAuth);

        // Get mock instances
        mockHttpClient = (wallet as unknown as { httpClient: typeof mockHttpClient }).httpClient;
        mockValidator = (wallet as unknown as { validator: typeof mockValidator }).validator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Create Wallet', () => {
        const mockCreateWalletData: CreateWalletBody = {
            walletName: 'Test Wallet',
            paymailName: 'testuser',
        };

        const mockCreateWalletResponse: CreateWalletReponse = {
            wallet_id: 'wallet-123',
            paymail_id: 'testuser@paymail.com',
        };

        it('should successfully create a wallet', async () => {
            mockHttpClient.post.mockResolvedValue({
                data: mockCreateWalletResponse,
                status: 201,
                statusText: 'Created',
            });

            const result = await wallet.createWallet(mockCreateWalletData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.createWallet).toHaveBeenCalledWith(mockCreateWalletData);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/wallet/create',
                null,
                { Authorization: 'test-auth-token-123' },
                {
                    walletName: 'Test Wallet',
                    paymailName: 'testuser',
                }
            );
            expect(mockValidator.createWalletResponse).toHaveBeenCalledWith(mockCreateWalletResponse);
            expect(result.data).toEqual(mockCreateWalletResponse);
        });

        it('should throw error when not authenticated', async () => {
            const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(wallet.createWallet(mockCreateWalletData)).rejects.toThrow(authError);
            expect(mockHttpClient.post).not.toHaveBeenCalled();
        });

        it('should handle validation errors', async () => {
            const validationError = new Error('Invalid wallet name');
            mockValidator.createWallet.mockImplementation(() => {
                throw validationError;
            });

            await expect(wallet.createWallet(mockCreateWalletData)).rejects.toThrow(validationError);
            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockHttpClient.post).not.toHaveBeenCalled();
        });

        it('should handle HTTP errors', async () => {
            const httpError = new Error('Network error');
            mockHttpClient.post.mockRejectedValue(httpError);

            await expect(wallet.createWallet(mockCreateWalletData)).rejects.toThrow(httpError);
            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.createWallet).toHaveBeenCalledWith(mockCreateWalletData);
        });
    });

    describe('Wallet List', () => {
        const mockWalletListResponse: WalletListResponse = {
            app_id: null,
            default_paymail_alias: null,
            is_default: true,
            team_id: null,
            user_id: 'user-123',
            wallet_id: 'wallet-1',
            name: 'Test Wallet',
        };

        it('should successfully get wallet list', async () => {
            mockHttpClient.get.mockResolvedValue({
                data: mockWalletListResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await wallet.walletList();

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockHttpClient.get).toHaveBeenCalledWith('/wallet/list', { Authorization: 'test-auth-token-123' });
            expect(mockValidator.walletListResponse).toHaveBeenCalledWith(mockWalletListResponse);
            expect(result.data).toEqual(mockWalletListResponse);
        });

        it('should throw error when not authenticated', async () => {
            const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(wallet.walletList()).rejects.toThrow(authError);
            expect(mockHttpClient.get).not.toHaveBeenCalled();
        });
    });

    describe('Update Default Wallet', () => {
        const mockUpdateDefaultWalletData: UpdateDefaultWalletBody = {
            walletID: 'wallet-123',
        };

        const mockUpdateDefaultWalletResponse: UpdateDefaultWalletResponse = {
            message: 'Default wallet updated successfully',
        };

        it('should successfully update default wallet', async () => {
            mockHttpClient.put.mockResolvedValue({
                data: mockUpdateDefaultWalletResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await wallet.updateDefaultWallet(mockUpdateDefaultWalletData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.updateDefaultWallet).toHaveBeenCalledWith(mockUpdateDefaultWalletData);
            expect(mockHttpClient.put).toHaveBeenCalledWith(
                '/wallet/update-default',
                null,
                { Authorization: 'test-auth-token-123' },
                { walletID: 'wallet-123' }
            );
            expect(mockValidator.updateDefaultWalletResponse).toHaveBeenCalledWith(mockUpdateDefaultWalletResponse);
            expect(result.data).toEqual(mockUpdateDefaultWalletResponse);
        });

        it('should handle validation errors', async () => {
            const validationError = new Error('Invalid wallet ID');
            mockValidator.updateDefaultWallet.mockImplementation(() => {
                throw validationError;
            });

            await expect(wallet.updateDefaultWallet(mockUpdateDefaultWalletData)).rejects.toThrow(validationError);
            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockHttpClient.put).not.toHaveBeenCalled();
        });
    });

    describe('Create Address', () => {
        const mockCreateAddressData: WalletAddressBody = {
            walletID: 'wallet-123',
        };

        const mockCreateAddressResponse: CreateAddressResponse = {
            message: 'Address created successfully',
        };

        it('should successfully create wallet address', async () => {
            mockHttpClient.post.mockResolvedValue({
                data: mockCreateAddressResponse,
                status: 201,
                statusText: 'Created',
            });

            const result = await wallet.createAddress(mockCreateAddressData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.walletAddress).toHaveBeenCalledWith(mockCreateAddressData);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/wallet/address/create',
                null,
                { Authorization: 'test-auth-token-123' },
                { walletID: 'wallet-123' }
            );
            expect(mockValidator.createAddressResponse).toHaveBeenCalledWith(mockCreateAddressResponse);
            expect(result.data).toEqual(mockCreateAddressResponse);
        });

        it('should handle validation errors', async () => {
            const validationError = new Error('Invalid wallet ID');
            mockValidator.walletAddress.mockImplementation(() => {
                throw validationError;
            });

            await expect(wallet.createAddress(mockCreateAddressData)).rejects.toThrow(validationError);
            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockHttpClient.post).not.toHaveBeenCalled();
        });
    });

    describe('Wallet Address List', () => {
        const mockWalletAddressListResponse: WalletAddressListResponse = [
            '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        ];

        it('should successfully get wallet address list', async () => {
            mockHttpClient.get.mockResolvedValue({
                data: mockWalletAddressListResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await wallet.walletAddressList();

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockHttpClient.get).toHaveBeenCalledWith('/wallet/address/list', {
                Authorization: 'test-auth-token-123',
            });
            expect(mockValidator.walletAddressListResponse).toHaveBeenCalledWith(mockWalletAddressListResponse);
            expect(result.data).toEqual(mockWalletAddressListResponse);
        });

        it('should throw error when not authenticated', async () => {
            const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(wallet.walletAddressList()).rejects.toThrow(authError);
            expect(mockHttpClient.get).not.toHaveBeenCalled();
        });
    });

    describe('Integration Tests', () => {
        it('should maintain authentication state across multiple wallet operations', async () => {
            // Mock responses for multiple operations
            const walletListResponse: WalletListResponse = {
                app_id: null,
                default_paymail_alias: null,
                is_default: true,
                team_id: null,
                user_id: 'user-123',
                wallet_id: 'wallet-123',
                name: 'Test Wallet',
            };

            const createAddressResponse: CreateAddressResponse = {
                message: 'Address created successfully',
            };

            mockHttpClient.get.mockResolvedValue({
                data: walletListResponse,
                status: 200,
                statusText: 'OK',
            });

            mockHttpClient.post.mockResolvedValue({
                data: createAddressResponse,
                status: 201,
                statusText: 'Created',
            });

            // Perform multiple operations
            const walletList = await wallet.walletList();
            expect(walletList.data).toEqual(walletListResponse);

            const newAddress = await wallet.createAddress({ walletID: 'wallet-123' });
            expect(newAddress.data).toEqual(createAddressResponse);

            // Verify authentication was checked for both operations
            expect(mockAuth.validate).toHaveBeenCalledTimes(2);
            expect(mockAuth.getToken).toHaveBeenCalledTimes(2);
        });

        it('should handle authentication failure consistently across operations', async () => {
            const authError = new NeucronError('Unauthorized', new Error('Token expired'), { type: 'internal' });
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            // All operations should fail with the same auth error
            await expect(wallet.walletList()).rejects.toThrow(authError);
            await expect(wallet.createWallet({ walletName: 'Test', paymailName: 'test' })).rejects.toThrow(authError);
            await expect(wallet.createAddress({ walletID: 'wallet-123' })).rejects.toThrow(authError);
            await expect(wallet.updateDefaultWallet({ walletID: 'wallet-123' })).rejects.toThrow(authError);
            await expect(wallet.walletAddressList()).rejects.toThrow(authError);

            // No HTTP calls should have been made
            expect(mockHttpClient.get).not.toHaveBeenCalled();
            expect(mockHttpClient.post).not.toHaveBeenCalled();
            expect(mockHttpClient.put).not.toHaveBeenCalled();
        });
    });
});
