import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Billing } from '../../src/services/billing/index.js';
import {
    AUTH_HEADERS,
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

vi.mock('../../src/services/billing/validator.js', () => ({
    default: vi.fn().mockImplementation(function () {
        return {
            billingHistoryResponse: vi.fn(),
            creditBalanceResponse: vi.fn(),
            requestPlan: vi.fn(),
            subscriptionInfo: vi.fn(),
            topUpCredits: vi.fn(),
            graphDataResponse: vi.fn(),
            paymentHistoryResponse: vi.fn(),
            paymentMethodsResponse: vi.fn(),
            upgradePlan: vi.fn(),
            cancelPlan: vi.fn(),
            raisePayment: vi.fn(),
            pricingPlansResponse: vi.fn(),
        };
    }),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Billing Service', () => {
    let billing: Billing;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            billingHistoryResponse: vi.fn(),
            creditBalanceResponse: vi.fn(),
            requestPlan: vi.fn(),
            subscriptionInfo: vi.fn(),
            topUpCredits: vi.fn(),
            graphDataResponse: vi.fn(),
            paymentHistoryResponse: vi.fn(),
            paymentMethodsResponse: vi.fn(),
            upgradePlan: vi.fn(),
            cancelPlan: vi.fn(),
            raisePayment: vi.fn(),
            pricingPlansResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        billing = new Billing(mockAuth);
        (billing as any).httpClient = mockHttpClient;
        (billing as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should get billing info', async () => {
        const response = { plan: 'premium' };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.getBillingInfo();
        expect(mockHttpClient.get).toHaveBeenCalledWith('/billing', AUTH_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should get billing history', async () => {
        const response = { list: [], page_meta: { page: 1, limit: 10, total: 0, total_pages: 0 } };
        mockValidator.billingHistoryResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.getBillingHistory(1, 10);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/credits/history', AUTH_HEADERS, {
            pageNumber: 1,
            pageSize: 10,
        });
        expect(result.data).toEqual(response);
    });

    it('should get pricing plans', async () => {
        const response = [{ plan_id: 'plan-1' }];
        mockValidator.pricingPlansResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.getPricingPlans();
        expect(mockHttpClient.get).toHaveBeenCalledWith('/subscription/plans', AUTH_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should get credit balance', async () => {
        const response = { plan_balance: 100 };
        mockValidator.creditBalanceResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.getCreditBalance();
        expect(mockHttpClient.get).toHaveBeenCalledWith('/credits/balance', AUTH_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should request a plan', async () => {
        const options = { plan_id: 'plan-1', auto_pay: true, provider: 'MANUAL' as const };
        const response = {
            subscription_id: 'sub-1',
            business_id: 'biz-1',
            plan_id: 'plan-1',
            status: 'ACTIVE' as const,
            created_at: '',
        };
        mockValidator.subscriptionInfo.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.requestPlan(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/subscription/request', options, AUTH_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should get plan status', async () => {
        const response = {
            subscription_id: 'sub-1',
            business_id: 'biz-1',
            plan_id: 'plan-1',
            status: 'ACTIVE' as const,
            created_at: '',
        };
        mockValidator.subscriptionInfo.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.getPlanStatus();
        expect(mockHttpClient.get).toHaveBeenCalledWith('/subscription/status', AUTH_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should upgrade a plan', async () => {
        const options = { subscriptionID: 'sub-1', newPlanID: 'plan-2' };
        const response = {
            subscription_id: 'sub-1',
            business_id: 'biz-1',
            plan_id: 'plan-2',
            status: 'ACTIVE' as const,
            created_at: '',
        };
        mockValidator.subscriptionInfo.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.upgradePlan(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/subscription/upgrade', null, AUTH_HEADERS, {
            subscriptionID: 'sub-1',
            newPlanID: 'plan-2',
        });
        expect(result.data).toEqual(response);
    });

    it('should cancel a plan', async () => {
        const options = { subscriptionId: 'sub-1' };
        const response = {
            subscription_id: 'sub-1',
            business_id: 'biz-1',
            plan_id: 'plan-1',
            status: 'CANCELLED' as const,
            created_at: '',
        };
        mockValidator.subscriptionInfo.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.cancelPlan(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/subscription/cancel', null, AUTH_HEADERS, {
            subscriptionID: 'sub-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should top up credits', async () => {
        const options = { amount: 100, provider: 'MANUAL' as const };
        const response = {
            subscription_id: 'sub-1',
            business_id: 'biz-1',
            plan_id: 'plan-1',
            status: 'ACTIVE' as const,
            created_at: '',
        };
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.creditsTopUp(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/credits/topup', options, AUTH_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should get credits graph', async () => {
        const response = [{ date: '2026-01-01', used: 10 }];
        mockValidator.graphDataResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.getGraph('daily');
        expect(mockHttpClient.get).toHaveBeenCalledWith('/credits/graph', AUTH_HEADERS, { granularity: 'daily' });
        expect(result.data).toEqual(response);
    });

    it('should get payment invoice list', async () => {
        const response = { invoices: [] };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.getInvoiceList(1, 10);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/payment-invoice/list', AUTH_HEADERS, {
            pageNumber: 1,
            pageSize: 10,
        });
        expect(result.data).toEqual(response);
    });

    it('should raise payment for invoice', async () => {
        const options = { invoiceId: 'inv-1' };
        const response = {
            subscription_id: 'sub-1',
            business_id: 'biz-1',
            plan_id: 'plan-1',
            status: 'ACTIVE' as const,
            created_at: '',
        };
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.raisePaymentForInvoice(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/payment-invoice/payment', null, AUTH_HEADERS, {
            invoiceID: 'inv-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should get payment history', async () => {
        const response = { list: [], page_meta: { page: 1, limit: 10, total: 0, total_pages: 0 } };
        mockValidator.paymentHistoryResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.getPaymentHistory('sub-1', 1, 10);
        expect(mockHttpClient.get).toHaveBeenCalledWith('/payment-invoice/payment/history', AUTH_HEADERS, {
            page: 1,
            size: 10,
            subscription_id: 'sub-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should download payment invoice', async () => {
        const response = { pdf: 'data' };
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.downloadInvoice('payment-1');
        expect(mockHttpClient.get).toHaveBeenCalledWith('/business/payment-invoices/payment-1', AUTH_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should get payment methods', async () => {
        const response = [{ id: 'pm-1', type: 'card' as const, details: {}, isDefault: true }];
        mockValidator.paymentMethodsResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.getPaymentMethods();
        expect(mockHttpClient.get).toHaveBeenCalledWith('/billing/payment-methods', AUTH_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should add payment method', async () => {
        const paymentData = { type: 'card', token: 'tok_123' };
        const response = [{ id: 'pm-1', type: 'card' as const, details: {}, isDefault: true }];
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));
        const result = await billing.addPaymentMethod(paymentData);
        expect(mockHttpClient.post).toHaveBeenCalledWith('/billing/payment-methods', paymentData, AUTH_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        await expect(billing.getBillingInfo()).rejects.toThrow(authError);
    });
});
