import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Invoice } from '../../src/services/invoice/index.js';
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

const invoiceId = { businessId: BUSINESS_ID, invoiceID: 'inv-1' };
const invoiceData = {
    currency: 'INR',
    customer_id: 'cust-1',
    deposit_wallet: 'wallet-1',
    discount: 0,
    due_date: '2026-02-01',
    invoice_number: 'INV-1',
    issue_date: '2026-01-01',
    items: [],
    lut_number: '',
    notes: '',
    order_number: '',
    payment_option: [],
    payment_terms: '',
    round_off: false,
};

vi.mock('../../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn().mockImplementation(() => createMockHttpClient()),
}));

vi.mock('../../src/services/invoice/validator.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        createInvoice: vi.fn(),
        listInvoices: vi.fn(),
        invoiceId: vi.fn(),
        updateInvoice: vi.fn(),
        markInvoiceAsPaid: vi.fn(),
        shareInvoice: vi.fn(),
        emailPayload: vi.fn(),
        mapCollection: vi.fn(),
        submitCollection: vi.fn(),
        paymentCollection: vi.fn(),
        paymentSession: vi.fn(),
        sessionId: vi.fn(),
        checkPayment: vi.fn(),
        checkSession: vi.fn(),
        paymentCollectionList: vi.fn(),
        collectionId: vi.fn(),
        walletPaymentCollectionInfo: vi.fn(),
        walletCustomization: vi.fn(),
        revenueGraphFilters: vi.fn(),
        invoicesListResponse: vi.fn(),
        messageResponse: vi.fn(),
    })),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Invoice Service', () => {
    let invoice: Invoice;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            createInvoice: vi.fn(),
            listInvoices: vi.fn(),
            invoiceId: vi.fn(),
            updateInvoice: vi.fn(),
            markInvoiceAsPaid: vi.fn(),
            shareInvoice: vi.fn(),
            emailPayload: vi.fn(),
            mapCollection: vi.fn(),
            submitCollection: vi.fn(),
            paymentCollection: vi.fn(),
            paymentSession: vi.fn(),
            sessionId: vi.fn(),
            checkPayment: vi.fn(),
            checkSession: vi.fn(),
            paymentCollectionList: vi.fn(),
            collectionId: vi.fn(),
            walletPaymentCollectionInfo: vi.fn(),
            walletCustomization: vi.fn(),
            revenueGraphFilters: vi.fn(),
            invoicesListResponse: vi.fn(),
            messageResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        invoice = new Invoice(mockAuth);
        (invoice as any).httpClient = mockHttpClient;
        (invoice as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create an invoice', async () => {
        const response = { invoice_id: 'inv-1' };
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.createInvoice({ businessId: BUSINESS_ID, invoiceData });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/invoice', invoiceData, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should list invoices', async () => {
        const response = { invoices: [], page_meta: { page: 1, limit: 10, total: 0, total_pages: 0 } };
        mockValidator.invoicesListResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.getInvoices({
            businessId: BUSINESS_ID,
            pageNumber: 1,
            pageSize: 10,
            statuses: ['DRAFT'],
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/invoice/list', ['DRAFT'], BUSINESS_HEADERS, {
            page: 1,
            size: 10,
        });
        expect(result.data).toEqual(response);
    });

    it('should get invoice details', async () => {
        const response = { invoice_id: 'inv-1' };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.getInvoiceDetails(invoiceId);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/invoice', BUSINESS_HEADERS, { invoiceID: 'inv-1' });
        expect(result.data).toEqual(response);
    });

    it('should update an invoice', async () => {
        const response = { invoice_id: 'inv-1' };
        mockHttpClient.put.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.updateInvoice({ ...invoiceId, invoiceData: { notes: 'Updated' } });
        expect(mockHttpClient.put).toHaveBeenCalledWith('/invoice', { notes: 'Updated' }, BUSINESS_HEADERS, {
            invoiceID: 'inv-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should delete an invoice', async () => {
        const response = { message: 'Deleted' };
        mockHttpClient.delete.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.deleteInvoice(invoiceId);
        expect(mockHttpClient.delete).toHaveBeenCalledWith('/invoice', BUSINESS_HEADERS, { invoiceID: 'inv-1' });
        expect(result.data).toEqual(response);
    });

    it('should finalise an invoice', async () => {
        const response = { message: 'Finalised' };
        mockValidator.messageResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.finaliseInvoice(invoiceId);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/invoice/finalise', null, BUSINESS_HEADERS, {
            invoiceID: 'inv-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should mark invoice as paid', async () => {
        const response = { message: 'Marked paid' };
        mockValidator.messageResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.markInvoiceAsPaid({
            ...invoiceId,
            payload: { paid_at: '2026-01-15', emails: ['user@example.com'] },
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/invoice/mark-paid',
            { paid_at: '2026-01-15', emails: ['user@example.com'] },
            BUSINESS_HEADERS,
            { invoiceID: 'inv-1' }
        );
        expect(result.data).toEqual(response);
    });

    it('should share an invoice', async () => {
        const response = { message: 'Shared' };
        mockValidator.messageResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.shareInvoice({
            ...invoiceId,
            emails: ['user@example.com'],
            sendEmail: true,
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/invoice/share', ['user@example.com'], BUSINESS_HEADERS, {
            invoiceID: 'inv-1',
            sendEmail: 'true',
        });
        expect(result.data).toEqual(response);
    });

    it('should send invoice reminder', async () => {
        const response = { message: 'Reminder sent' };
        mockValidator.messageResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const payload = { emails: ['user@example.com'] };
        const result = await invoice.sendInvoiceReminder({ ...invoiceId, payload });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/invoice/reminder', payload, BUSINESS_HEADERS, {
            invoiceID: 'inv-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should send payment confirmation', async () => {
        const response = { message: 'Confirmation sent' };
        mockValidator.messageResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const payload = { emails: ['user@example.com'] };
        const result = await invoice.sendPaymentConfirmation({ ...invoiceId, payload });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/invoice/confirmation', payload, BUSINESS_HEADERS, {
            invoiceID: 'inv-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should map collection to invoice', async () => {
        const response = { message: 'Mapped' };
        mockValidator.messageResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.mapCollectionToInvoice({ ...invoiceId, collectionID: 'col-1' });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/invoice/map-collection', null, BUSINESS_HEADERS, {
            invoiceID: 'inv-1',
            collectionID: 'col-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should submit collection', async () => {
        const response = { message: 'Submitted' };
        mockValidator.messageResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const data = { asset_id: 'asset-1', invoice_id: 'inv-1' };
        const result = await invoice.submitCollection({ businessId: BUSINESS_ID, data });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/invoice/collection', data, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should create payment collection', async () => {
        const response = { collection_id: 'col-1' };
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.createPaymentCollection({
            ...invoiceId,
            supportedAssets: ['asset-1'],
            walletID: 'wallet-1',
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith('/invoice/payment-collection', ['asset-1'], BUSINESS_HEADERS, {
            invoiceID: 'inv-1',
            walletID: 'wallet-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should update payment collection', async () => {
        const response = { collection_id: 'col-1' };
        mockHttpClient.put.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.updatePaymentCollection({ ...invoiceId, supportedAssets: ['asset-1'] });
        expect(mockHttpClient.put).toHaveBeenCalledWith('/invoice/payment-collection', ['asset-1'], BUSINESS_HEADERS, {
            invoiceID: 'inv-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should get invoice payment collections', async () => {
        const response = { collections: [] };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.getInvoicePaymentCollections(invoiceId);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/invoice/payment-collection', BUSINESS_HEADERS, {
            invoiceID: 'inv-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should create payment session', async () => {
        const response = { session_id: 'session-1' };
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.createPaymentSession({
            businessId: BUSINESS_ID,
            collectionID: 'col-1',
            assetID: 'asset-1',
            metadata: { key: 'value' },
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/payment-collection/session',
            { key: 'value' },
            BUSINESS_HEADERS,
            { collectionID: 'col-1', assetID: 'asset-1' }
        );
        expect(result.data).toEqual(response);
    });

    it('should get payment session', async () => {
        const response = { session_id: 'session-1' };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.getPaymentSession({ businessId: BUSINESS_ID, sessionID: 'session-1' });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/payment-collection/session', BUSINESS_HEADERS, {
            sessionID: 'session-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should check payment collection', async () => {
        const response = { status: 'CONFIRMED' };
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.checkPaymentCollection({
            businessId: BUSINESS_ID,
            collectionID: 'col-1',
            txHash: 'tx-1',
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/payment-collection/check',
            { tx_hash: 'tx-1' },
            BUSINESS_HEADERS,
            { collectionID: 'col-1' }
        );
        expect(result.data).toEqual(response);
    });

    it('should check payment session', async () => {
        const response = { status: 'CONFIRMED' };
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.checkPaymentSession({
            businessId: BUSINESS_ID,
            sessionID: 'session-1',
            txHash: 'tx-1',
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/payment-collection/session/check',
            { tx_hash: 'tx-1' },
            BUSINESS_HEADERS,
            { sessionID: 'session-1' }
        );
        expect(result.data).toEqual(response);
    });

    it('should list payment collections', async () => {
        const response = { list: [] };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.getPaymentCollectionList({ businessId: BUSINESS_ID, page: 1, size: 10 });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/payment-collection/list', BUSINESS_HEADERS, {
            page: 1,
            size: 10,
            collection_id: undefined,
            reference: undefined,
            wallet_id: undefined,
            status: undefined,
        });
        expect(result.data).toEqual(response);
    });

    it('should get payment collection', async () => {
        const response = { collection_id: 'col-1' };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.getPaymentCollection({ businessId: BUSINESS_ID, collectionID: 'col-1' });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/payment-collection', BUSINESS_HEADERS, {
            collectionID: 'col-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should get collection assets', async () => {
        const response = { assets: [] };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.getCollectionAssets({
            businessId: BUSINESS_ID,
            collectionID: 'col-1',
            network: 'MAIN',
        });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/payment-collection/assets', BUSINESS_HEADERS, {
            collectionID: 'col-1',
            network: 'MAIN',
        });
        expect(result.data).toEqual(response);
    });

    it('should get wallet payment collection info', async () => {
        const response = { wallet_id: 'wallet-1' };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.getWalletPaymentCollectionInfo({
            businessId: BUSINESS_ID,
            walletID: 'wallet-1',
        });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/payment-collection/wallet/info', BUSINESS_HEADERS, {
            walletID: 'wallet-1',
            paymail: undefined,
        });
        expect(result.data).toEqual(response);
    });

    it('should create wallet payment collection customization', async () => {
        const response = { display_name: 'Brand' };
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.createWalletPaymentCollectionCustomization({
            businessId: BUSINESS_ID,
            walletID: 'wallet-1',
            payload: { display_name: 'Brand', logo_url: 'https://logo.png' },
        });
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/payment-collection/wallet/customization',
            { display_name: 'Brand', logo_url: 'https://logo.png' },
            BUSINESS_HEADERS,
            { walletID: 'wallet-1' }
        );
        expect(result.data).toEqual(response);
    });

    it('should update wallet payment collection customization', async () => {
        const response = { display_name: 'Brand' };
        mockHttpClient.patch.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.updateWalletPaymentCollectionCustomization({
            businessId: BUSINESS_ID,
            walletID: 'wallet-1',
            payload: { display_name: 'Brand', logo_url: 'https://logo.png' },
        });
        expect(mockHttpClient.patch).toHaveBeenCalledWith(
            '/payment-collection/wallet/customization',
            { display_name: 'Brand', logo_url: 'https://logo.png' },
            BUSINESS_HEADERS,
            { walletID: 'wallet-1' }
        );
        expect(result.data).toEqual(response);
    });

    it('should get revenue graph', async () => {
        const response = { points: [] };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.getRevenueGraph({
            businessId: BUSINESS_ID,
            period: 'monthly',
            currency: 'INR',
        });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/invoice/revenue', BUSINESS_HEADERS, {
            from: undefined,
            to: undefined,
            currency: 'INR',
            customerID: undefined,
            period: 'monthly',
        });
        expect(result.data).toEqual(response);
    });

    it('should get customer balances', async () => {
        const response = { balances: [] };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await invoice.getCustomerBalances({ businessId: BUSINESS_ID, customerID: 'cust-1' });
        expect(mockHttpClient.get).toHaveBeenCalledWith('/invoice/customer-balances', BUSINESS_HEADERS, {
            from: undefined,
            to: undefined,
            currency: undefined,
            customerID: 'cust-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        await expect(invoice.getInvoiceDetails(invoiceId)).rejects.toThrow(authError);
    });
});
