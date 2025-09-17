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

// Store mock instances to access them in tests
let mockHttpClient: any;
let mockValidator: any;

// Mock the HTTP client
vi.mock('../src/utils/http/http-client.js', () => {
    const mockImplementation = () => ({
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    });
    
    return {
        HttpClient: vi.fn().mockImplementation(mockImplementation),
    };
});

// Mock the validator
vi.mock('../src/services/wallet/validator.js', () => {
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
        default: vi.fn().mockImplementation(mockImplementation),
    };
});

// Mock error handler
vi.mock('../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Wallet Service', () => {
    let wallet: Wallet;
    let mockAuth: Authentication;

    beforeEach(() => {
        // Reset all mocks
        vi.clearAllMocks();

        // Create fresh mock instances
        mockHttpClient = {
            post: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        };
        
        mockValidator = {
            createWallet: vi.fn(),
            createWalletResponse: vi.fn(),
            walletListResponse: vi.fn(),
            updateDefaultWallet: vi.fn(),
            updateDefaultWalletResponse: vi.fn(),
            walletAddress: vi.fn(),
            createAddressResponse: vi.fn(),
            walletAddressListResponse: vi.fn(),
        };

        // Create mock authentication instance
        mockAuth = new Authentication();
        mockAuth.setToken('test-auth-token-123');

        // Mock auth methods
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {});
        vi.spyOn(mockAuth, 'getToken').mockReturnValue('test-auth-token-123');

        // Create wallet instance
        wallet = new Wallet(mockAuth);

        // Manually inject mocks into the wallet service
        if (wallet && typeof wallet === 'object') {
            (wallet as any).httpClient = mockHttpClient;
            (wallet as any).validator = mockValidator;
        }
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
            // Mock validation to pass
            mockValidator.createWallet.mockReturnValue(true);
            mockValidator.createWalletResponse.mockReturnValue(mockCreateWalletResponse);
            
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
            // Mock validation to pass
            mockValidator.createWallet.mockReturnValue(true);
            
            const httpError = new Error('Network error');
            mockHttpClient.post.mockRejectedValue(httpError);

            await expect(wallet.createWallet(mockCreateWalletData)).rejects.toThrow(httpError);
            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.createWallet).toHaveBeenCalledWith(mockCreateWalletData);
        });
    });

    describe('Wallet List', () => {
        const mockWalletListResponse: WalletListResponse = [{
            wallet_id: 'wallet-1',
            app_id: null,
            paymail_alias: null,
            is_default: true,
            team_id: null,
            user_id: 'user-123',
            wallet_name: 'Test Wallet',
        }];

        it('should successfully get wallet list', async () => {
            // Mock validation to pass
            mockValidator.walletListResponse.mockReturnValue(mockWalletListResponse);
            
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
            // Mock validation to pass
            mockValidator.updateDefaultWallet.mockReturnValue(true);
            mockValidator.updateDefaultWalletResponse.mockReturnValue(mockUpdateDefaultWalletResponse);
            
            mockHttpClient.put.mockResolvedValue({
                data: mockUpdateDefaultWalletResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await wallet.updateDefaultWallet(mockUpdateDefaultWalletData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.updateDefaultWallet).toHaveBeenCalledWith(mockUpdateDefaultWalletData);
            expect(mockHttpClient.put).toHaveBeenCalledWith(
                '/wallet/default',
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
            // Mock validation to pass
            mockValidator.walletAddress.mockReturnValue(true);
            mockValidator.createAddressResponse.mockReturnValue(mockCreateAddressResponse);
            
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
            // Mock validation to pass
            mockValidator.walletAddressListResponse.mockReturnValue(mockWalletAddressListResponse);
            
            mockHttpClient.get.mockResolvedValue({
                data: mockWalletAddressListResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await wallet.walletAddressList();

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockHttpClient.get).toHaveBeenCalledWith('/wallet/addresses', {
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
            const walletListResponse: WalletListResponse = [{
            wallet_id: 'wallet-789',
            app_id: null,
            paymail_alias: null,
            is_default: true,
            team_id: null,
            user_id: 'user-123',
            wallet_name: 'Test Wallet',
        }];

            const createAddressResponse: CreateAddressResponse = {
                message: 'Address created successfully',
            };

            // Mock validators
            mockValidator.walletListResponse.mockReturnValue(walletListResponse);
            mockValidator.walletAddress.mockReturnValue(true);
            mockValidator.createAddressResponse.mockReturnValue(createAddressResponse);

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
