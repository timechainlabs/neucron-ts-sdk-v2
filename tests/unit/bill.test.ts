import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Bill } from '../../src/services/bill/index.js';
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

const billPayload = {
    additional_charge: {},
    bill_items: [],
    billing_address: {
        designation_supply: '',
        location: '',
        source_of_supply: '',
        warehouse_location: '',
    },
    billing_details: {
        amount_payble: '100',
        bill_date: '2026-01-01',
        billing_number: 'BILL-1',
        due_date: '2026-02-01',
        order_number: 'ORD-1',
        payment_terms: 'NET30',
    },
    currency: 'INR',
    discount: 0,
    other_details: {
        additional_fields: {},
        attachment: { link: '', name: '' },
        lut: '',
        note: '',
    },
    tax_payer_info: { gst_treatment: '', pan: '', tds: '', vat_gstin: '' },
    tax_rate: 0,
    vendor_id: 'vendor-1',
};

vi.mock('../../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn().mockImplementation(function () {
        return createMockHttpClient();
    }),
}));

vi.mock('../../src/services/bill/validator.js', () => ({
    default: vi.fn().mockImplementation(function () {
        return {
            createBill: vi.fn(),
            updateBill: vi.fn(),
            billId: vi.fn(),
            listBills: vi.fn(),
            reviewBill: vi.fn(),
            payBill: vi.fn(),
            mapBillToPayout: vi.fn(),
            acceptVendorInvitation: vi.fn(),
            createBillResponse: vi.fn(),
            updateBillResponse: vi.fn(),
            payBillResponse: vi.fn(),
        };
    }),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Bill Service', () => {
    let bill: Bill;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            createBill: vi.fn(),
            updateBill: vi.fn(),
            billId: vi.fn(),
            listBills: vi.fn(),
            reviewBill: vi.fn(),
            payBill: vi.fn(),
            mapBillToPayout: vi.fn(),
            acceptVendorInvitation: vi.fn(),
            createBillResponse: vi.fn(),
            updateBillResponse: vi.fn(),
            payBillResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        bill = new Bill(mockAuth);
        (bill as any).httpClient = mockHttpClient;
        (bill as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create a bill', async () => {
        const response = { billID: 'bill-1' };
        mockValidator.createBillResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await bill.createBill({ businessId: BUSINESS_ID, payload: billPayload });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor/bill', billPayload, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should update a bill', async () => {
        const response = { message: 'Updated' };
        mockValidator.updateBillResponse.mockReturnValue(response);
        mockHttpClient.put.mockResolvedValue(mockHttpResponse(response));
        const result = await bill.updateBill({ businessId: BUSINESS_ID, billID: 'bill-1', payload: billPayload });
        expect(mockHttpClient.put).toHaveBeenCalledWith('/vendor/bill', billPayload, BUSINESS_HEADERS, {
            billID: 'bill-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should get a bill', async () => {
        const response = { billID: 'bill-1' };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await bill.getBill({ businessId: BUSINESS_ID, billID: 'bill-1' });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/vendor/bill', BUSINESS_HEADERS, { billID: 'bill-1' });
        expect(result.data).toEqual(response);
    });

    it('should list bills', async () => {
        const response = { list: [] };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await bill.listBills({ businessId: BUSINESS_ID, vendorID: 'vendor-1', page: 1, size: 20 });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/vendor/bill/list', BUSINESS_HEADERS, {
            vendorID: 'vendor-1',
            page: 1,
            size: 20,
        });
        expect(result.data).toEqual(response);
    });

    it('should review a bill', async () => {
        const response = { message: 'Reviewed' };
        mockValidator.updateBillResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await bill.reviewBill({ businessId: BUSINESS_ID, billID: 'bill-1', action: 'APPROVE' });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor/bill/review', null, BUSINESS_HEADERS, {
            billID: 'bill-1',
            action: 'APPROVE',
        });
        expect(result.data).toEqual(response);
    });

    it('should confirm a bill', async () => {
        const response = { message: 'Confirmed' };
        mockValidator.updateBillResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await bill.confirmBill({ businessId: BUSINESS_ID, billID: 'bill-1' });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor/bill/confirm', null, BUSINESS_HEADERS, {
            billID: 'bill-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should pay a bill', async () => {
        const payDTO = { asset_id: 'asset-1', sender_wallet_id: 'wallet-1' };
        const response = { payout_id: 'payout-1', txmeta: 'meta' };
        mockValidator.payBillResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await bill.payBill({ businessId: BUSINESS_ID, billID: 'bill-1', payDTO });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor/bill/pay', payDTO, BUSINESS_HEADERS, {
            billID: 'bill-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should map bill to payout', async () => {
        const response = { message: 'Mapped' };
        mockValidator.updateBillResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await bill.mapBillToPayout({
            businessId: BUSINESS_ID,
            billID: 'bill-1',
            payoutID: 'payout-1',
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor/bill/payout', null, BUSINESS_HEADERS, {
            billID: 'bill-1',
            payoutID: 'payout-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should accept vendor invitation', async () => {
        const response = { message: 'Accepted' };
        mockValidator.updateBillResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await bill.acceptVendorInvitation({
            businessId: BUSINESS_ID,
            vendorID: 'vendor-1',
            token: 'token-1',
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/vendor/accept', null, BUSINESS_HEADERS, {
            vendorID: 'vendor-1',
            token: 'token-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        await expect(bill.getBill({ businessId: BUSINESS_ID, billID: 'bill-1' })).rejects.toThrow(authError);
    });
});
