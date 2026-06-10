import type { HttpResponse, QueryParams } from '../../utils/http/types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type {
    BillingInfoResponse,
    BillingHistoryResponse,
    PricingPlansResponse,
    CreditBalanceResponse,
    RequestPlan,
    SubscriptionInfo,
    TopUpCredits,
    GraphDataResponse,
    InvoiceListResponse,
    RaisePayment,
    PaymentHistoryResponse,
    PaymentMethodsResponse,
    UpgradePlan,
    CancelPlan,
} from './types.js';

export class Billing {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async getBillingInfo(): Promise<HttpResponse<BillingInfoResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            return await this.httpClient.get<BillingInfoResponse>(Routes.BILLING.INFO, headers);
        } catch (err) {
            handleError(err);
        }
    }

    async getBillingHistory(pageNumber?: number, pageSize?: number): Promise<HttpResponse<BillingHistoryResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            const params: QueryParams = { pageNumber, pageSize };
            const resp = await this.httpClient.get<BillingHistoryResponse>(
                Routes.BILLING.CREDIT_HISTORY,
                headers,
                params
            );
            this.validator.billingHistoryResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getPricingPlans(): Promise<HttpResponse<PricingPlansResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            const resp = await this.httpClient.get<PricingPlansResponse>(Routes.BILLING.PRICING_PLANS, headers);
            this.validator.pricingPlansResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getCreditBalance(): Promise<HttpResponse<CreditBalanceResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            const resp = await this.httpClient.get<CreditBalanceResponse>(Routes.BILLING.CREDIT_BALANCE, headers);
            this.validator.creditBalanceResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async requestPlan(options: RequestPlan): Promise<HttpResponse<SubscriptionInfo>> {
        try {
            this.auth.validate();
            this.validator.requestPlan(options);
            const headers = buildAuthHeaders(this.auth);
            const resp = await this.httpClient.post<SubscriptionInfo>(Routes.BILLING.REQUEST_PLAN, options, headers);
            this.validator.subscriptionInfo(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getPlanStatus(): Promise<HttpResponse<SubscriptionInfo>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            const resp = await this.httpClient.get<SubscriptionInfo>(Routes.BILLING.PLAN_STATUS, headers);
            this.validator.subscriptionInfo(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async upgradePlan(options: UpgradePlan): Promise<HttpResponse<SubscriptionInfo>> {
        try {
            this.auth.validate();
            this.validator.upgradePlan(options);
            const headers = buildAuthHeaders(this.auth);
            const params: QueryParams = {
                subscriptionID: options.subscriptionID,
                newPlanID: options.newPlanID,
            };
            const resp = await this.httpClient.post<SubscriptionInfo>(
                Routes.BILLING.UPGRADE_PLAN,
                null,
                headers,
                params
            );
            this.validator.subscriptionInfo(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async cancelPlan(options: CancelPlan): Promise<HttpResponse<SubscriptionInfo>> {
        try {
            this.auth.validate();
            this.validator.cancelPlan(options);
            const headers = buildAuthHeaders(this.auth);
            const params: QueryParams = { subscriptionID: options.subscriptionId };
            const resp = await this.httpClient.post<SubscriptionInfo>(
                Routes.BILLING.CANCEL_PLAN,
                null,
                headers,
                params
            );
            this.validator.subscriptionInfo(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async creditsTopUp(options: TopUpCredits): Promise<HttpResponse<SubscriptionInfo>> {
        try {
            this.auth.validate();
            this.validator.topUpCredits(options);
            const headers = buildAuthHeaders(this.auth);
            const resp = await this.httpClient.post<SubscriptionInfo>(Routes.BILLING.CREDITS_TOPUP, options, headers);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getGraph(granularity: string): Promise<HttpResponse<GraphDataResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            const params: QueryParams = { granularity };
            const resp = await this.httpClient.get<GraphDataResponse>(Routes.BILLING.CREDITS_GRAPH, headers, params);
            this.validator.graphDataResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getInvoiceList(page?: number, size?: number): Promise<HttpResponse<InvoiceListResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            const params: QueryParams = { pageNumber: page, pageSize: size };
            return await this.httpClient.get<InvoiceListResponse>(Routes.BILLING.PAYMENT_INVOICE_LIST, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async raisePaymentForInvoice(options: RaisePayment): Promise<HttpResponse<SubscriptionInfo>> {
        try {
            this.auth.validate();
            this.validator.raisePayment(options);
            const headers = buildAuthHeaders(this.auth);
            const params: QueryParams = { invoiceID: options.invoiceId };
            return await this.httpClient.post<SubscriptionInfo>(
                Routes.BILLING.PAYMENT_INVOICE_PAYMENT,
                null,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async getPaymentHistory(
        subscriptionId: string,
        page?: number,
        size?: number
    ): Promise<HttpResponse<PaymentHistoryResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            const params: QueryParams = { page, size, subscription_id: subscriptionId };
            const resp = await this.httpClient.get<PaymentHistoryResponse>(
                Routes.BILLING.PAYMENT_HISTORY,
                headers,
                params
            );
            this.validator.paymentHistoryResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async downloadInvoice(paymentId: string): Promise<HttpResponse<unknown>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            return await this.httpClient.get<unknown>(
                `${Routes.BUSINESS.PAYMENT_INVOICE_DOWNLOAD}/${paymentId}`,
                headers
            );
        } catch (err) {
            handleError(err);
        }
    }

    async getPaymentMethods(): Promise<HttpResponse<PaymentMethodsResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            const resp = await this.httpClient.get<PaymentMethodsResponse>(Routes.BILLING.PAYMENT_METHODS, headers);
            this.validator.paymentMethodsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async addPaymentMethod(paymentData: Record<string, unknown>): Promise<HttpResponse<PaymentMethodsResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            return await this.httpClient.post<PaymentMethodsResponse>(
                Routes.BILLING.PAYMENT_METHODS,
                paymentData,
                headers
            );
        } catch (err) {
            handleError(err);
        }
    }
}
