import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Vendor } from '../../src/services/vendor/index.js';
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

const vendorPayload = {
    address_details: {
        address: '1 Main St',
        city: 'City',
        country: 'IN',
        fax_number: '',
        phone_number: '123',
        pin_code: '123456',
        state: 'State',
    },
    contact_persons: [],
    email: 'vendor@example.com',
    payment_details: {
        currency: 'INR',
        expense_wallet: 'wallet-1',
        opening_balance: 0,
        payment_address: 'addr',
        payment_terms: 'NET30',
        place_of_supply: 'IN',
    },
    phone_number: '123',
    tax_payer_info: { gst_treatment: 'registered', pan: 'PAN', tds: '', vat_gstin: '' },
    vendor_name: 'Vendor Co',
    vendor_type: 'BUSINESS',
};

vi.mock('../../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn().mockImplementation(function () {
        return createMockHttpClient();
    }),
}));

vi.mock('../../src/services/vendor/validator.js', () => ({
    default: vi.fn().mockImplementation(function () {
        return {
            listVendors: vi.fn(),
            vendorId: vi.fn(),
            createVendor: vi.fn(),
            updateVendor: vi.fn(),
            setVendorSuspension: vi.fn(),
            acceptVendor: vi.fn(),
            expenseGraphFilters: vi.fn(),
            payVendor: vi.fn(),
            messageResponse: vi.fn(),
        };
    }),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Vendor Service', () => {
    let vendor: Vendor;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            listVendors: vi.fn(),
            vendorId: vi.fn(),
            createVendor: vi.fn(),
            updateVendor: vi.fn(),
            setVendorSuspension: vi.fn(),
            acceptVendor: vi.fn(),
            expenseGraphFilters: vi.fn(),
            payVendor: vi.fn(),
            messageResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        vendor = new Vendor(mockAuth);
        (vendor as any).httpClient = mockHttpClient;
        (vendor as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should list vendors', async () => {
        const response = { list: [] };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.listVendors({ businessId: BUSINESS_ID, page: 1, size: 20 });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/vendor/list', BUSINESS_HEADERS, { page: 1, size: 20 });
        expect(result.data).toEqual(response);
    });

    it('should get a vendor', async () => {
        const response = { vendor_id: 'vendor-1' };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.getVendor({ businessId: BUSINESS_ID, vendorId: 'vendor-1' });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/vendor', BUSINESS_HEADERS, { vendorID: 'vendor-1' });
        expect(result.data).toEqual(response);
    });

    it('should create a vendor', async () => {
        const response = { vendor_id: 'vendor-1' };
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.createVendor({ businessId: BUSINESS_ID, payload: vendorPayload });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor', vendorPayload, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should update a vendor', async () => {
        const response = { vendor_id: 'vendor-1' };
        mockHttpClient.put.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.updateVendor({
            businessId: BUSINESS_ID,
            vendorId: 'vendor-1',
            payload: vendorPayload,
        });
        expect(mockHttpClient.put).toHaveBeenCalledWith('/vendor', vendorPayload, BUSINESS_HEADERS, {
            vendorID: 'vendor-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should invite a vendor', async () => {
        const response = { message: 'Invited' };
        mockValidator.messageResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.inviteVendor({ businessId: BUSINESS_ID, vendorId: 'vendor-1' });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor/invite', null, BUSINESS_HEADERS, {
            vendorID: 'vendor-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should set vendor suspension', async () => {
        const response = { message: 'Suspended' };
        mockValidator.messageResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.setVendorSuspension({
            businessId: BUSINESS_ID,
            vendorId: 'vendor-1',
            action: 'SUSPEND',
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor/suspension', null, BUSINESS_HEADERS, {
            vendorID: 'vendor-1',
            action: 'SUSPEND',
        });
        expect(result.data).toEqual(response);
    });

    it('should delete a vendor', async () => {
        const response = { message: 'Deleted' };
        mockHttpClient.delete.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.deleteVendor({ businessId: BUSINESS_ID, vendorId: 'vendor-1' });
        expect(mockHttpClient.delete).toHaveBeenCalledWith('/vendor', BUSINESS_HEADERS, { vendorID: 'vendor-1' });
        expect(result.data).toEqual(response);
    });

    it('should get vendor ledger', async () => {
        const response = { entries: [] };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.getVendorLedger({ businessId: BUSINESS_ID, vendorId: 'vendor-1' });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/vendor/ledger', BUSINESS_HEADERS, { vendorID: 'vendor-1' });
        expect(result.data).toEqual(response);
    });

    it('should accept vendor invitation', async () => {
        const response = { message: 'Accepted' };
        mockValidator.messageResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.acceptVendor({ vendorId: 'vendor-1', token: 'token-1', businessId: BUSINESS_ID });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor/accept', null, BUSINESS_HEADERS, {
            vendorID: 'vendor-1',
            token: 'token-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should get expense graph', async () => {
        const response = { INR: { data_points: [], total_expense: 0 } };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.getExpenseGraph({ businessId: BUSINESS_ID, period: 'monthly' });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/vendor/expense/graph', BUSINESS_HEADERS, {
            vendorID: undefined,
            currency: undefined,
            from: undefined,
            to: undefined,
            period: 'monthly',
        });
        expect(result.data).toEqual(response);
    });

    it('should get expense summary', async () => {
        const response = [
            { vendor_id: 'vendor-1', vendor_name: 'Vendor', total_billed: {}, total_paid: {}, total_unpaid: {} },
        ];
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.getExpenseSummary({ businessId: BUSINESS_ID });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/vendor/expense/summary', BUSINESS_HEADERS, {
            vendorID: undefined,
            currency: undefined,
            from: undefined,
            to: undefined,
            period: undefined,
        });
        expect(result.data).toEqual(response);
    });

    it('should pay a vendor', async () => {
        const payDTO = {
            amount_in_fiat: 100,
            asset_id: 'asset-1',
            currency: 'INR',
            sender_wallet_id: 'wallet-1',
        };
        const response = { message: 'Paid' };
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await vendor.payVendor({ businessId: BUSINESS_ID, vendorId: 'vendor-1', payDTO });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor/pay', payDTO, BUSINESS_HEADERS, {
            vendorID: 'vendor-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        await expect(vendor.listVendors({ businessId: BUSINESS_ID })).rejects.toThrow(authError);
    });
});
