import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AssetSwap } from '../../src/services/asset-swap/index.js';
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
    HttpClient: vi.fn().mockImplementation(() => createMockHttpClient()),
}));

vi.mock('../../src/services/asset-swap/validator.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        swappableAssetsResponse: vi.fn(),
        swapAssets: vi.fn(),
        swapAssetsResponse: vi.fn(),
        swapRate: vi.fn(),
        swapRateResponse: vi.fn(),
    })),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('AssetSwap Service', () => {
    let assetSwap: AssetSwap;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    const swapPayload = {
        amount: 1,
        from_asset_name: 'BSV',
        from_network_name: 'MAIN',
        to_asset_name: 'MNEE',
        to_network_name: 'MAIN',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            swappableAssetsResponse: vi.fn(),
            swapAssets: vi.fn(),
            swapAssetsResponse: vi.fn(),
            swapRate: vi.fn(),
            swapRateResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        assetSwap = new AssetSwap(mockAuth);
        (assetSwap as any).httpClient = mockHttpClient;
        (assetSwap as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should get swappable assets', async () => {
        const response = { from: [], to: [] };
        mockValidator.swappableAssetsResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

        const result = await assetSwap.getSwappableAssets({ businessId: BUSINESS_ID });

        expect(mockHttpClient.get).toHaveBeenCalledWith('/asset-swap/swappable', BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should swap assets', async () => {
        const options = { businessId: BUSINESS_ID, walletID: 'wallet-1', payload: swapPayload };
        const response = { message: 'Swap initiated' };
        mockValidator.swapAssetsResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));

        const result = await assetSwap.swapAssets(options);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/asset-swap/swap', swapPayload, BUSINESS_HEADERS, {
            walletID: 'wallet-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should get swap rate', async () => {
        const options = { businessId: BUSINESS_ID, payload: swapPayload };
        const response = {
            rate: 1.5,
            minimum_amount: 0.1,
            maximum_amount: 10,
            requested_amount: 1,
            swapped_amount: 1.5,
        };
        mockValidator.swapRateResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));

        const result = await assetSwap.getSwapRate(options);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/asset-swap/rate', swapPayload, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        await expect(assetSwap.getSwappableAssets()).rejects.toThrow(authError);
    });
});
