import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Assets } from '../../src/services/assets/index.js';
import { Authentication } from '../../src/services/authentication/index.js';
import { NeucronError } from '../../src/utils/errors/sdk-error.js';
import { Balances, BalancesResponse } from '../../src/services/assets/types.js';

let mockHttpClient: any;
let mockValidator: any;

vi.mock('../../src/utils/http/http-client.js', () => {
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

vi.mock('../../src/services/assets/validator.js', () => {
    const mockImplementation = () => ({
        assetDetails: vi.fn(),
        assetDetailsResponse: vi.fn(),
        deleteAsset: vi.fn(),
        deleteAssetResponse: vi.fn(),
        transferAsset: vi.fn(),
        transferAssetResponse: vi.fn(),
        ledgerList: vi.fn(),
        ledgerListResponse: vi.fn(),
        assetList: vi.fn(),
        assetListResponse: vi.fn(),
        ledgerDetails: vi.fn(),
        ledgerDetailsResponse: vi.fn(),
        assetStatsResponse: vi.fn(),
        balances: vi.fn(),
        balancesResponse: vi.fn(),
    });
    return {
        default: vi.fn().mockImplementation(mockImplementation),
    };
});

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Assets Service', () => {
    let assets: Assets;
    let mockAuth: Authentication;

    beforeEach(() => {
        vi.clearAllMocks();

        mockHttpClient = {
            post: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        };

        mockValidator = {
            assetDetails: vi.fn(),
            assetDetailsResponse: vi.fn(),
            deleteAsset: vi.fn(),
            deleteAssetResponse: vi.fn(),
            transferAsset: vi.fn(),
            transferAssetResponse: vi.fn(),
            ledgerList: vi.fn(),
            ledgerListResponse: vi.fn(),
            assetList: vi.fn(),
            assetListResponse: vi.fn(),
            ledgerDetails: vi.fn(),
            ledgerDetailsResponse: vi.fn(),
            assetStatsResponse: vi.fn(),
            balances: vi.fn(),
            balancesResponse: vi.fn(),
        };

        mockAuth = new Authentication();
        mockAuth.setToken('test-auth-token-123');
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {});
        vi.spyOn(mockAuth, 'getToken').mockReturnValue('test-auth-token-123');

        assets = new Assets(mockAuth);
        (assets as any).httpClient = mockHttpClient;
        (assets as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getAssetDetails', () => {
        const mockData = { assetID: 'asset-123' };
        const mockResponse = { id: 'asset-123', name: 'BTC' };

        it('should fetch asset details', async () => {
            mockValidator.assetDetails.mockReturnValue(true);
            mockValidator.assetDetailsResponse.mockReturnValue(mockResponse);
            mockHttpClient.get.mockResolvedValue({ data: mockResponse });

            const result = await assets.getAssetDetails(mockData as any);

            expect(mockValidator.assetDetails).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                '/asset/details',
                { Authorization: 'test-auth-token-123' },
                { assetID: 'asset-123' }
            );
            expect(result.data).toEqual(mockResponse);
        });

        it('should throw if unauthorized', async () => {
            const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(assets.getAssetDetails(mockData as any)).rejects.toThrow(authError);
        });
    });

    describe('deleteAsset', () => {
        const mockData = { assetID: 'asset-123' };
        const mockResponse = { message: 'Deleted' };

        it('should delete asset', async () => {
            mockValidator.deleteAsset.mockReturnValue(true);
            mockValidator.deleteAssetResponse.mockReturnValue(mockResponse);
            mockHttpClient.delete.mockResolvedValue({ data: mockResponse });

            const result = await assets.deleteAsset(mockData as any);

            expect(mockValidator.deleteAsset).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                '/asset/delete',
                { Authorization: 'test-auth-token-123' },
                { assetID: 'asset-123' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('transfer', () => {
        const mockData = { fromWallet: 'w1', toWallet: 'w2', amount: 10 };
        const mockResponse = { txID: 'tx-123' };

        it('should transfer asset', async () => {
            mockValidator.transferAsset.mockReturnValue(true);
            mockValidator.transferAssetResponse.mockReturnValue(mockResponse);
            mockHttpClient.post.mockResolvedValue({ data: mockResponse });

            const result = await assets.transfer(mockData as any);

            expect(mockValidator.transferAsset).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.post).toHaveBeenCalledWith('/asset/transfer', mockData, {
                Authorization: 'test-auth-token-123',
            });
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('getLedgerList', () => {
        const mockData = { walletID: 'wallet-123', status: 'active', pageNumber: 1, pageSize: 10 };
        const mockResponse = [{ id: 'ledger1' }];

        it('should fetch ledger list', async () => {
            mockValidator.ledgerList.mockReturnValue(true);
            mockValidator.ledgerListResponse.mockReturnValue(mockResponse);
            mockHttpClient.post.mockResolvedValue({ data: mockResponse });

            const result = await assets.getLedgerList(mockData as any);

            expect(mockValidator.ledgerList).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/asset/ledgerlist',
                { status: 'active' },
                { Authorization: 'test-auth-token-123' },
                { walletID: 'wallet-123', pageNumber: 1, pageSize: 10 }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('getAssetList', () => {
        const mockData = { walletID: 'wallet-123', pageNumber: 1, pageSize: 5 };
        const mockResponse = [{ id: 'asset1' }];

        it('should fetch asset list', async () => {
            mockValidator.assetList.mockReturnValue(true);
            mockValidator.assetListResponse.mockReturnValue(mockResponse);
            mockHttpClient.get.mockResolvedValue({ data: mockResponse });

            const result = await assets.getAssetList(mockData as any);

            expect(mockValidator.assetList).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                '/asset/assetlist',
                { Authorization: 'test-auth-token-123' },
                {
                    searchQuery: undefined,
                    status: undefined,
                    type: undefined,
                    walletID: 'wallet-123',
                    pageNumber: 1,
                    pageSize: 5,
                }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('getLedgerDetails', () => {
        const mockData = { assetID: 'asset-123' };
        const mockResponse = { id: 'ledger-123', details: 'sample' };

        it('should fetch ledger details', async () => {
            mockValidator.ledgerDetails.mockReturnValue(true);
            mockValidator.ledgerDetailsResponse.mockReturnValue(mockResponse);
            mockHttpClient.get.mockResolvedValue({ data: mockResponse });

            const result = await assets.getLedgerDetails(mockData as any);

            expect(mockValidator.ledgerDetails).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                '/asset/ledger/details',
                { Authorization: 'test-auth-token-123' },
                { assetID: 'asset-123' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('getAssetStats', () => {
        const mockResponse = { total: 5 };

        it('should fetch asset stats', async () => {
            mockValidator.assetStatsResponse.mockReturnValue(mockResponse);
            mockHttpClient.get.mockResolvedValue({ data: mockResponse });

            const result = await assets.getAssetStats();

            expect(mockHttpClient.get).toHaveBeenCalledWith('/asset/assetlist', {
                Authorization: 'test-auth-token-123',
            });
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('getBalances', () => {
        const mockData: Balances = { walletID: 'wallet-123' };
        const mockResponse: BalancesResponse = [{ asset_id: 'ledger-123', sum: 1 }];

        it('should fetch balances', async () => {
            mockValidator.balances.mockReturnValue(true);
            mockValidator.balancesResponse.mockReturnValue(mockResponse);
            mockHttpClient.get.mockResolvedValue({ data: mockResponse });

            const result = await assets.getBalances(mockData as any);

            expect(mockValidator.balances).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                '/asset/balances',
                { Authorization: 'test-auth-token-123' },
                mockData
            );
            expect(result.data).toEqual(mockResponse);
        });

        it('should throw error when not authenticated', async () => {
            const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });

            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(assets.getBalances(mockData as any)).rejects.toThrow(authError);

            // Make sure no HTTP request is made
            expect(mockHttpClient.get).not.toHaveBeenCalled();
        });

        it('should throw error if validator fails', async () => {
            const validationError = new Error('Invalid options');

            mockValidator.balances.mockImplementation(() => {
                throw validationError;
            });

            await expect(assets.getBalances(mockData as any)).rejects.toThrow(validationError);

            // No HTTP request should be made
            expect(mockHttpClient.get).not.toHaveBeenCalled();
        });
    });
});
