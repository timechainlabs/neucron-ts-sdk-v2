import type { HttpResponse, QueryParams, IHttpClient } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type {
    CreateInvoice,
    ListInvoices,
    InvoiceId,
    UpdateInvoice,
    MarkInvoiceAsPaid,
    ShareInvoice,
    EmailPayload,
    MapCollection,
    SubmitCollection,
    CreatePublicPaymentCollection,
    PaymentCollection,
    PaymentSession,
    SessionId,
    CheckPayment,
    CheckSession,
    PaymentCollectionList,
    CollectionId,
    WalletPaymentCollectionInfo,
    WalletCustomization,
    RevenueGraphFilters,
    InvoicesListResponse,
    InvoiceResponse,
    InvoiceMessageResponse,
    WalletInfoPayload,
    PaymentCollectionResponse,
} from './types.js';

export class Invoice {
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = auth.getHttpClient();
    }

    async createInvoice(options: CreateInvoice): Promise<HttpResponse<InvoiceResponse>> {
        try {
            this.auth.validate();
            this.validator.createInvoice(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            return await this.httpClient.post<InvoiceResponse>(Routes.INVOICE.CREATE, options.invoiceData, headers);
        } catch (err) {
            handleError(err);
        }
    }

    async getInvoices(options?: ListInvoices): Promise<HttpResponse<InvoicesListResponse>> {
        try {
            this.auth.validate();
            this.validator.listInvoices(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const params: QueryParams = { page: options?.pageNumber, size: options?.pageSize };
            const resp = await this.httpClient.post<InvoicesListResponse>(
                Routes.INVOICE.LIST,
                options?.statuses ?? [],
                headers,
                params
            );
            this.validator.invoicesListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getInvoiceDetails(options: InvoiceId): Promise<HttpResponse<InvoiceResponse>> {
        try {
            this.auth.validate();
            this.validator.invoiceId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID };
            return await this.httpClient.get<InvoiceResponse>(Routes.INVOICE.DETAILS, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async updateInvoice(options: UpdateInvoice): Promise<HttpResponse<InvoiceResponse>> {
        try {
            this.auth.validate();
            this.validator.updateInvoice(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID };
            return await this.httpClient.put<InvoiceResponse>(
                Routes.INVOICE.DETAILS,
                options.invoiceData,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async deleteInvoice(options: InvoiceId): Promise<HttpResponse<InvoiceMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.invoiceId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID };
            return await this.httpClient.delete<InvoiceMessageResponse>(Routes.INVOICE.DETAILS, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async finaliseInvoice(options: InvoiceId): Promise<HttpResponse<InvoiceMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.invoiceId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID };
            const resp = await this.httpClient.post<InvoiceMessageResponse>(
                Routes.INVOICE.FINALISE,
                null,
                headers,
                params
            );
            this.validator.messageResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async markInvoiceAsPaid(options: MarkInvoiceAsPaid): Promise<HttpResponse<InvoiceMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.markInvoiceAsPaid(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID };
            const resp = await this.httpClient.post<InvoiceMessageResponse>(
                Routes.INVOICE.MARK_PAID,
                options.payload,
                headers,
                params
            );
            this.validator.messageResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async shareInvoice(options: ShareInvoice): Promise<HttpResponse<InvoiceMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.shareInvoice(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                invoiceID: options.invoiceID,
                sendEmail: options.sendEmail !== undefined ? String(options.sendEmail) : undefined,
            };
            const resp = await this.httpClient.post<InvoiceMessageResponse>(
                Routes.INVOICE.SHARE,
                options.emails,
                headers,
                params
            );
            this.validator.messageResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async sendInvoiceReminder(
        options: InvoiceId & { payload: EmailPayload }
    ): Promise<HttpResponse<InvoiceMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.invoiceId(options);
            this.validator.emailPayload(options.payload);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID };
            const resp = await this.httpClient.post<InvoiceMessageResponse>(
                Routes.INVOICE.REMINDER,
                options.payload,
                headers,
                params
            );
            this.validator.messageResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async sendPaymentConfirmation(
        options: InvoiceId & { payload: EmailPayload }
    ): Promise<HttpResponse<InvoiceMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.invoiceId(options);
            this.validator.emailPayload(options.payload);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID };
            const resp = await this.httpClient.post<InvoiceMessageResponse>(
                Routes.INVOICE.CONFIRMATION,
                options.payload,
                headers,
                params
            );
            this.validator.messageResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async mapCollectionToInvoice(options: MapCollection): Promise<HttpResponse<InvoiceMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.mapCollection(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID, collectionID: options.collectionID };
            const resp = await this.httpClient.post<InvoiceMessageResponse>(
                Routes.INVOICE.MAP_COLLECTION,
                null,
                headers,
                params
            );
            this.validator.messageResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async submitCollection(options: SubmitCollection): Promise<HttpResponse<InvoiceMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.submitCollection(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const resp = await this.httpClient.post<InvoiceMessageResponse>(
                Routes.INVOICE.COLLECTION,
                options.data,
                headers
            );
            this.validator.messageResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async createPublicPaymentCollection(
        options: CreatePublicPaymentCollection
    ): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.createPublicPaymentCollection(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            return await this.httpClient.post<PaymentCollectionResponse>(
                Routes.PAYMENT_COLLECTION.CREATE,
                options.data,
                headers
            );
        } catch (err) {
            handleError(err);
        }
    }

    async createPaymentCollection(options: PaymentCollection): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.paymentCollection(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID, walletID: options.walletID };
            return await this.httpClient.post<PaymentCollectionResponse>(
                Routes.INVOICE.PAYMENT_COLLECTION,
                options.supportedAssets,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async updatePaymentCollection(options: PaymentCollection): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.paymentCollection(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID };
            return await this.httpClient.put<PaymentCollectionResponse>(
                Routes.INVOICE.PAYMENT_COLLECTION,
                options.supportedAssets,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async getInvoicePaymentCollections(options: InvoiceId): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.invoiceId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { invoiceID: options.invoiceID };
            return await this.httpClient.get<PaymentCollectionResponse>(
                Routes.INVOICE.PAYMENT_COLLECTION,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async createPaymentSession(options: PaymentSession): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.paymentSession(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { collectionID: options.collectionID, assetID: options.assetID };
            return await this.httpClient.post<PaymentCollectionResponse>(
                Routes.PAYMENT_COLLECTION.SESSION,
                options.metadata ?? {},
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async getPaymentSession(options: SessionId): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.sessionId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { sessionID: options.sessionID };
            return await this.httpClient.get<PaymentCollectionResponse>(
                Routes.PAYMENT_COLLECTION.SESSION,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async checkPaymentCollection(options: CheckPayment): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.checkPayment(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { collectionID: options.collectionID };
            const body = options.txHash ? { tx_hash: options.txHash } : null;
            return await this.httpClient.post<PaymentCollectionResponse>(
                Routes.PAYMENT_COLLECTION.CHECK,
                body,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async checkPaymentSession(options: CheckSession): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.checkSession(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { sessionID: options.sessionID };
            const body = options.txHash ? { tx_hash: options.txHash } : null;
            return await this.httpClient.post<PaymentCollectionResponse>(
                Routes.PAYMENT_COLLECTION.SESSION_CHECK,
                body,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async getPaymentCollectionList(options?: PaymentCollectionList): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.paymentCollectionList(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const params: QueryParams = {
                page: options?.page,
                size: options?.size,
                collection_id: options?.collection_id,
                reference: options?.reference,
                wallet_id: options?.wallet_id,
                status: options?.status,
            };
            return await this.httpClient.get<PaymentCollectionResponse>(
                Routes.PAYMENT_COLLECTION.LIST,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async getPaymentCollection(options: CollectionId): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.collectionId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { collectionID: options.collectionID };
            return await this.httpClient.get<PaymentCollectionResponse>(
                Routes.PAYMENT_COLLECTION.DETAILS,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async getCollectionAssets(options: CollectionId): Promise<HttpResponse<PaymentCollectionResponse>> {
        try {
            this.auth.validate();
            this.validator.collectionId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { collectionID: options.collectionID, network: options.network };
            return await this.httpClient.get<PaymentCollectionResponse>(
                Routes.PAYMENT_COLLECTION.ASSETS,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async getWalletPaymentCollectionInfo(
        options?: WalletPaymentCollectionInfo
    ): Promise<HttpResponse<WalletInfoPayload>> {
        try {
            this.auth.validate();
            this.validator.walletPaymentCollectionInfo(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const params: QueryParams = { walletID: options?.walletID, paymail: options?.paymail };
            return await this.httpClient.get<WalletInfoPayload>(Routes.PAYMENT_COLLECTION.WALLET_INFO, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async createWalletPaymentCollectionCustomization(
        options: WalletCustomization
    ): Promise<HttpResponse<WalletInfoPayload>> {
        try {
            this.auth.validate();
            this.validator.walletCustomization(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { walletID: options.walletID };
            return await this.httpClient.post<WalletInfoPayload>(
                Routes.PAYMENT_COLLECTION.WALLET_CUSTOMIZATION,
                options.payload,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async updateWalletPaymentCollectionCustomization(
        options: WalletCustomization
    ): Promise<HttpResponse<WalletInfoPayload>> {
        try {
            this.auth.validate();
            this.validator.walletCustomization(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { walletID: options.walletID };
            return await this.httpClient.patch<WalletInfoPayload>(
                Routes.PAYMENT_COLLECTION.WALLET_CUSTOMIZATION,
                options.payload,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async getRevenueGraph(options?: RevenueGraphFilters): Promise<HttpResponse<unknown>> {
        try {
            this.auth.validate();
            this.validator.revenueGraphFilters(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const params: QueryParams = {
                from: options?.from,
                to: options?.to,
                currency: options?.currency,
                customerID: options?.customerID,
                period: options?.period,
            };
            return await this.httpClient.get<unknown>(Routes.INVOICE.REVENUE, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async getCustomerBalances(options?: RevenueGraphFilters): Promise<HttpResponse<unknown>> {
        try {
            this.auth.validate();
            this.validator.revenueGraphFilters(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const params: QueryParams = {
                from: options?.from,
                to: options?.to,
                currency: options?.currency,
                customerID: options?.customerID,
            };
            return await this.httpClient.get<unknown>(Routes.INVOICE.CUSTOMER_BALANCES, headers, params);
        } catch (err) {
            handleError(err);
        }
    }
}
