import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Business } from '../../src/services/business/index.js';
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

vi.mock('../../src/services/business/validator.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        createBusiness: vi.fn(),
        createBusinessResponse: vi.fn(),
        getBusinessDetails: vi.fn(),
        businessDetailsResponse: vi.fn(),
        businessListResponse: vi.fn(),
        updateBusinessDetails: vi.fn(),
        updateBusinessDetailsResponse: vi.fn(),
    })),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Business Service', () => {
    let business: Business;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            createBusiness: vi.fn(),
            createBusinessResponse: vi.fn(),
            getBusinessDetails: vi.fn(),
            businessDetailsResponse: vi.fn(),
            businessListResponse: vi.fn(),
            updateBusinessDetails: vi.fn(),
            updateBusinessDetailsResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        business = new Business(mockAuth);
        (business as any).httpClient = mockHttpClient;
        (business as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('createBusiness', () => {
        it('should create a business', async () => {
            const options = {
                business_name: 'Acme Corp',
                display_name: 'Acme',
                business_type: 'private',
                business_model: 'b2b',
                business_email: 'billing@acme.com',
                jurisdiction: 'IN',
            };
            const response = { business_id: BUSINESS_ID, data: { business_id: BUSINESS_ID } };
            mockValidator.createBusiness.mockReturnValue(true);
            mockValidator.createBusinessResponse.mockReturnValue(response);
            mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));

            const result = await business.createBusiness(options);

            expect(mockValidator.createBusiness).toHaveBeenCalledWith(options);
            expect(mockHttpClient.post).toHaveBeenCalledWith('/business', options, AUTH_HEADERS);
            expect(result.data).toEqual(response);
        });

        it('should throw when not authenticated', async () => {
            const authError = createUnauthorizedError();
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });
            await expect(business.createBusiness({ business_name: 'Acme' })).rejects.toThrow(authError);
        });
    });

    describe('getBusinessDetails', () => {
        it('should fetch business details', async () => {
            const options = { businessId: BUSINESS_ID };
            const response = { business_id: BUSINESS_ID, business_name: 'Acme' };
            mockValidator.getBusinessDetails.mockReturnValue(true);
            mockValidator.businessDetailsResponse.mockReturnValue(response);
            mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

            const result = await business.getBusinessDetails(options);

            expect(mockValidator.getBusinessDetails).toHaveBeenCalledWith(options);
            expect(mockHttpClient.get).toHaveBeenCalledWith('/business', BUSINESS_HEADERS, {
                businessId: BUSINESS_ID,
            });
            expect(result.data).toEqual(response);
        });

        it('should throw when not authenticated', async () => {
            const authError = createUnauthorizedError();
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });
            await expect(business.getBusinessDetails({ businessId: BUSINESS_ID })).rejects.toThrow(authError);
        });
    });

    describe('getBusinessList', () => {
        it('should fetch business list', async () => {
            const response = [{ business_id: BUSINESS_ID }];
            mockValidator.businessListResponse.mockReturnValue(response);
            mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

            const result = await business.getBusinessList();

            expect(mockHttpClient.get).toHaveBeenCalledWith('/business/list', AUTH_HEADERS);
            expect(result.data).toEqual(response);
        });
    });

    describe('updateBusinessDetails', () => {
        it('should update business details', async () => {
            const options = { businessId: BUSINESS_ID, data: { business_name: 'Updated' } };
            const response = { business_id: BUSINESS_ID, business_name: 'Updated' };
            mockValidator.updateBusinessDetails.mockReturnValue(true);
            mockValidator.updateBusinessDetailsResponse.mockReturnValue(response);
            mockHttpClient.patch.mockResolvedValue(mockHttpResponse(response));

            const result = await business.updateBusinessDetails(options);

            expect(mockHttpClient.patch).toHaveBeenCalledWith('/business/update', options.data, BUSINESS_HEADERS, {
                businessID: BUSINESS_ID,
            });
            expect(result.data).toEqual(response);
        });
    });
});
