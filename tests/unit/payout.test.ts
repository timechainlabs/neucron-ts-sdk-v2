import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Payout } from '../../src/services/payout/index.js';
import {
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
    HttpClient: vi.fn().mockImplementation(function () {
        return createMockHttpClient();
    }),
}));

vi.mock('../../src/services/payout/validator.js', () => ({
    default: vi.fn().mockImplementation(function () {
        return {
            createPayout: vi.fn(),
            createPayoutRequest: vi.fn(),
            payoutId: vi.fn(),
            updatePayout: vi.fn(),
            listPayouts: vi.fn(),
            confirmPayout: vi.fn(),
            createPayoutResponse: vi.fn(),
            triggerPayoutResponse: vi.fn(),
            confirmPayoutResponse: vi.fn(),
            payoutListResponse: vi.fn(),
            payoutResponse: vi.fn(),
        };
    }),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Payout Service', () => {
    let payout: Payout;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            createPayout: vi.fn(),
            createPayoutRequest: vi.fn(),
            payoutId: vi.fn(),
            updatePayout: vi.fn(),
            listPayouts: vi.fn(),
            confirmPayout: vi.fn(),
            createPayoutResponse: vi.fn(),
            triggerPayoutResponse: vi.fn(),
            confirmPayoutResponse: vi.fn(),
            payoutListResponse: vi.fn(),
            payoutResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        payout = new Payout(mockAuth);
        (payout as any).httpClient = mockHttpClient;
        (payout as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create a payout', async () => {
        const payload = { asset_id: 'asset-1', wallet_id: 'wallet-1' };
        const response = { payout_id: 'payout-1' };
        mockValidator.createPayoutResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await payout.createPayout({ businessId: BUSINESS_ID, payload });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/payout', payload, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should create a direct vendor payout with vendor_id', async () => {
        const payload = {
            amount_in_fiat: 250,
            asset_id: 'asset-1',
            currency: 'USD',
            vendor_id: 'vendor-1',
            wallet_id: 'wallet-1',
        };
        const response = { payout_id: 'payout-vendor-1' };
        mockValidator.createPayoutResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));

        const result = await payout.createPayout({ businessId: BUSINESS_ID, payload });

        expect(mockValidator.createPayout).toHaveBeenCalledWith({ businessId: BUSINESS_ID, payload });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/payout', payload, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should create a payout request', async () => {
        const payload = {
            amount: '100',
            amount_in_fiat: 100,
            asset_id: 'asset-1',
            currency: 'CLP',
            meta: { email: 'user@example.com', name: 'Jane Doe', note: 'Payment' },
            receiver_address: '1ReceiverAddress',
            receiver_email: 'receiver@example.com',
            receiver_paymail: 'receiver@paymail.com',
            sender_address: '1SenderAddress',
            sender_email: 'sender@example.com',
            sender_paymail: 'sender@paymail.com',
        };
        const response = { payout_id: 'payout-request-1' };
        const headers = {
            ...BUSINESS_HEADERS,
            'X-App-Secret': 'app-secret-123',
        };
        mockValidator.createPayoutResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await payout.createPayoutRequest({
            businessId: BUSINESS_ID,
            appSecret: 'app-secret-123',
            payload,
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/payout/request', payload, headers);
        expect(result.data).toEqual(response);
    });

    it('should update a payout', async () => {
        const payload = { asset_id: 'asset-1' };
        const response = { payout_id: 'payout-1' };
        mockValidator.createPayoutResponse.mockReturnValue(response);
        mockHttpClient.put.mockResolvedValue(mockHttpResponse(response));
        const result = await payout.updatePayout({ businessId: BUSINESS_ID, payoutID: 'payout-1', payload });
        expect(mockHttpClient.put).toHaveBeenCalledWith('/payout', payload, BUSINESS_HEADERS, { payoutID: 'payout-1' });
        expect(result.data).toEqual(response);
    });

    it('should list payouts', async () => {
        const response = { list: [{ payout_id: 'payout-1' }] };
        mockValidator.payoutListResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await payout.listPayouts({ businessId: BUSINESS_ID, page: 1, limit: 20 });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/payout/list', BUSINESS_HEADERS, {
            status: undefined,
            reference: undefined,
            reference_type: undefined,
            page: 1,
            limit: 20,
        });
        expect(result.data).toEqual(response);
    });

    it('should trigger a payout', async () => {
        const response = { txid: 'tx-1' };
        mockValidator.triggerPayoutResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await payout.triggerPayout({ businessId: BUSINESS_ID, payoutID: 'payout-1' });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/payout/trigger', null, BUSINESS_HEADERS, {
            payoutID: 'payout-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should get a payout', async () => {
        const response = { payout_id: 'payout-1' };
        mockValidator.payoutResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await payout.getPayout({ businessId: BUSINESS_ID, payoutID: 'payout-1' });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/payout', BUSINESS_HEADERS, { payoutID: 'payout-1' });
        expect(result.data).toEqual(response);
    });

    it('should confirm a payout', async () => {
        const payload = { emails: ['user@example.com'] };
        const response = { message: 'Confirmed' };
        mockValidator.confirmPayoutResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await payout.confirmPayout({
            businessId: BUSINESS_ID,
            payoutID: 'payout-1',
            payload,
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/payout/confirm', payload, BUSINESS_HEADERS, {
            payoutID: 'payout-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        await expect(payout.getPayout({ businessId: BUSINESS_ID, payoutID: 'payout-1' })).rejects.toThrow(authError);
    });
});
