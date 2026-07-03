import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Assets21 } from '../../src/services/asset21/index.js';
import {
    AUTH_HEADERS,
    BUSINESS_HEADERS,
    BUSINESS_ID,
    createMockHttpClient,
    createUnauthorizedError,
    mockHttpResponse,
    setupAuthenticatedAuth,
} from './helpers/service-test-setup.js';

let mockHttpClient: ReturnType<typeof createMockHttpClient>;
let mockValidator: Record<string, ReturnType<typeof vi.fn>>;

vi.mock('../../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn().mockImplementation(() => createMockHttpClient()),
}));

vi.mock('../../src/services/asset21/validator.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        getAddressState: vi.fn(),
        getAddressStateResponse: vi.fn(),
        fetchBalance: vi.fn(),
        fetchBalanceResponse: vi.fn(),
        systemConfig: vi.fn(),
        systemConfigResponse: vi.fn(),
        updateSystemConfig: vi.fn(),
        updateSystemConfigResponse: vi.fn(),
        getCustomers: vi.fn(),
        getCustomersResponse: vi.fn(),
        register: vi.fn(),
        registerResponse: vi.fn(),
        deploy: vi.fn(),
        deployResponse: vi.fn(),
        listDeployedAssets: vi.fn(),
        listDeployedAssetsResponse: vi.fn(),
        createRequest: vi.fn(),
        createRequestResponse: vi.fn(),
        getRequest: vi.fn(),
        getRequestResponse: vi.fn(),
        updateRequest: vi.fn(),
        updateRequestResponse: vi.fn(),
        syncTransaction: vi.fn(),
        syncTransactionResponse: vi.fn(),
        listSyncedTransactions: vi.fn(),
        listSyncedTransactionsResponse: vi.fn(),
        triggerSyncForAddresses: vi.fn(),
        triggerSyncForAddressesResponse: vi.fn(),
        transfer: vi.fn(),
        transferResponse: vi.fn(),
        getUnspentUTXOs: vi.fn(),
        getUnspentUTXOResponse: vi.fn(),
        getOutputInfo: vi.fn(),
        getOutputInfoResponse: vi.fn(),
        getAnalytics: vi.fn(),
        getAnalyticsResponse: vi.fn(),
    })),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Assets21 Service', () => {
    let assets21: Assets21;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            getAddressState: vi.fn(),
            getAddressStateResponse: vi.fn(),
            fetchBalance: vi.fn(),
            fetchBalanceResponse: vi.fn(),
            systemConfig: vi.fn(),
            systemConfigResponse: vi.fn(),
            updateSystemConfig: vi.fn(),
            updateSystemConfigResponse: vi.fn(),
            getCustomers: vi.fn(),
            getCustomersResponse: vi.fn(),
            register: vi.fn(),
            registerResponse: vi.fn(),
            deploy: vi.fn(),
            deployResponse: vi.fn(),
            listDeployedAssets: vi.fn(),
            listDeployedAssetsResponse: vi.fn(),
            createRequest: vi.fn(),
            createRequestResponse: vi.fn(),
            getRequest: vi.fn(),
            getRequestResponse: vi.fn(),
            updateRequest: vi.fn(),
            updateRequestResponse: vi.fn(),
            syncTransaction: vi.fn(),
            syncTransactionResponse: vi.fn(),
            listSyncedTransactions: vi.fn(),
            listSyncedTransactionsResponse: vi.fn(),
            triggerSyncForAddresses: vi.fn(),
            triggerSyncForAddressesResponse: vi.fn(),
            transfer: vi.fn(),
            transferResponse: vi.fn(),
            getUnspentUTXOs: vi.fn(),
            getUnspentUTXOResponse: vi.fn(),
            getOutputInfo: vi.fn(),
            getOutputInfoResponse: vi.fn(),
            getAnalytics: vi.fn(),
            getAnalyticsResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        assets21 = new Assets21(mockAuth);
        (assets21 as any).httpClient = mockHttpClient;
        (assets21 as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should get address state', async () => {
        const options = { businessId: BUSINESS_ID, address: '1Address', assetID: 'asset-1' };
        const response = { address: '1Address', balance: '1000' };
        mockValidator.getAddressStateResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.getAddressState(options);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/asset21/address', BUSINESS_HEADERS, {
            address: '1Address',
            assetID: 'asset-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should fetch balance via GET for a single address', async () => {
        const options = { address: '1Address', assetID: 'asset-1' };
        const response = { data: { balances: [{ address: '1Address', balance: '1000' }] } };
        mockValidator.fetchBalanceResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.fetchBalance(options);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/asset21/balance', AUTH_HEADERS, {
            assetID: 'asset-1',
            address: '1Address',
        });
        expect(result.data).toEqual(response);
    });

    it('should fetch balance via POST for multiple addresses', async () => {
        const options = { addresses: ['1A', '1B'], assetID: 'asset-1' };
        const response = { data: { balances: [] } };
        mockValidator.fetchBalanceResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.fetchBalance(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/asset21/balance',
            { addresses: ['1A', '1B'] },
            AUTH_HEADERS,
            { assetID: 'asset-1' }
        );
        expect(result.data).toEqual(response);
    });

    it('should get system config', async () => {
        const options = { businessId: BUSINESS_ID, assetID: 'asset-1' };
        const response = { symbol: 'MSC', decimals: 6 };
        mockValidator.systemConfigResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.getSystemConfig(options);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/asset21/config', BUSINESS_HEADERS, { assetID: 'asset-1' });
        expect(result.data).toEqual(response);
    });

    it('should update system config', async () => {
        const options = {
            businessId: BUSINESS_ID,
            assetID: 'asset-1',
            fees: [{ fee: '100', min: '0', max: '1000000' }],
            request_config: { min_approval: 1, min_rejection: 1 },
        };
        const response = { message: 'Configuration has been updated successfully.' };
        mockValidator.updateSystemConfigResponse.mockReturnValue(response);
        mockHttpClient.put.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.updateSystemConfig(options);
        expect(mockHttpClient.put).toHaveBeenCalledWith(
            '/asset21/config',
            { fees: options.fees, request_config: options.request_config },
            BUSINESS_HEADERS,
            { assetID: 'asset-1' }
        );
        expect(result.data).toEqual(response);
    });

    it('should register a token', async () => {
        const payload = {
            asset_name: 'My Stablecoin',
            symbol: 'MSC',
            decimals: 6,
            image_url: 'https://example.com/icon.png',
            legal_term: 'terms',
            wallet_id: 'wal-1',
            network: 'MAIN' as const,
            token_detail: { request_config: { min_approval: 1, min_rejection: 1 } },
        };
        const response = { assetID: 'asset-new' };
        mockValidator.registerResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.register(payload);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/asset21/register', payload, AUTH_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should deploy a token', async () => {
        const options = { businessId: BUSINESS_ID, assetID: 'asset-1' };
        const response = { txid: 'tx-1' };
        mockValidator.deployResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.deploy(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/asset21/deploy', null, BUSINESS_HEADERS, {
            assetID: 'asset-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should list deployed assets', async () => {
        const options = { businessId: BUSINESS_ID, status: 'DEPLOYED', pageNumber: 1, pageSize: 10 };
        const response = { list: [{ asset_id: 'asset-1' }] };
        mockValidator.listDeployedAssetsResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.listDeployedAssets(options);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/asset/assetlist', BUSINESS_HEADERS, {
            status: 'DEPLOYED',
            pageNumber: 1,
            pageSize: 10,
        });
        expect(result.data).toEqual(response);
    });

    it('should create a request', async () => {
        const options = {
            assetId: 'asset-1',
            state: 'MINT' as const,
            requestDetails: { address: '1Customer', amount: '1000000' },
        };
        const response = { message: 'Request created successfully' };
        mockValidator.createRequestResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.createRequest(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/asset21/request',
            {
                assetId: 'asset-1',
                state: 'MINT',
                requestDetails: options.requestDetails,
                approvalsRequired: undefined,
                rejectionsRequired: undefined,
            },
            AUTH_HEADERS
        );
        expect(result.data).toEqual(response);
    });

    it('should sync a transaction', async () => {
        const options = { assetID: 'asset-1', txid: 'tx-abc' };
        const response = [{ txid: 'tx-abc' }];
        mockValidator.syncTransactionResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.syncTransaction(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/asset21/sync',
            { assetID: 'asset-1', txid: 'tx-abc' },
            AUTH_HEADERS
        );
        expect(result.data).toEqual(response);
    });

    it('should list synced transactions', async () => {
        const options = { businessId: BUSINESS_ID, assetID: 'asset-1', from: 0, limit: 1000 };
        const response = [{ txid: 'tx-1' }];
        mockValidator.listSyncedTransactionsResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.listSyncedTransactions(options);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/asset21/sync', BUSINESS_HEADERS, {
            assetID: 'asset-1',
            from: 0,
            limit: 1000,
            action: undefined,
        });
        expect(result.data).toEqual(response);
    });

    it('should trigger sync for addresses', async () => {
        const options = { assetID: 'asset-1', addresses: ['1A', '1B'] };
        const response = [{ txid: 'tx-1' }];
        mockValidator.triggerSyncForAddressesResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.triggerSyncForAddresses(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/asset21/sync',
            { assetID: 'asset-1', addresses: ['1A', '1B'] },
            AUTH_HEADERS
        );
        expect(result.data).toEqual(response);
    });

    it('should transfer tokens', async () => {
        const options = {
            walletID: 'wal-1',
            fromAddress: '1Sender',
            toAddress: '1Receiver',
            amount: '1000000',
            assetID: 'asset-1',
        };
        const response = { success: true, data: { transactionHash: 'tx-1' } };
        mockValidator.transferResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.transfer(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/asset21/transfer',
            {
                walletID: 'wal-1',
                fromAddress: '1Sender',
                toAddress: '1Receiver',
                amount: '1000000',
                tokenAddress: undefined,
                metadata: undefined,
            },
            AUTH_HEADERS,
            { assetID: 'asset-1' }
        );
        expect(result.data).toEqual(response);
    });

    it('should get analytics', async () => {
        const options = { businessId: BUSINESS_ID, assetID: 'asset-1', graphRange: 'month' };
        const response = { total_customers: 42, pending_operations: 3 };
        mockValidator.getAnalyticsResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await assets21.getAnalytics(options);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/asset21/analytics', BUSINESS_HEADERS, {
            assetID: 'asset-1',
            limit: undefined,
            graphRange: 'month',
        });
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        await expect(assets21.getAddressState({ address: '1Address', assetID: 'asset-1' })).rejects.toThrow(authError);
    });
});
