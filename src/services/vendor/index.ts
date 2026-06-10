import type { HttpResponse, QueryParams } from '../../utils/http/types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type {
    ListVendors,
    VendorId,
    CreateVendor,
    UpdateVendor,
    SetVendorSuspension,
    AcceptVendor,
    ExpenseGraphFilters,
    PayVendor,
    VendorsListResponse,
    VendorResponse,
    VendorMessageResponse,
    VendorLedgerResponse,
    VendorExpenseGraphResponse,
    VendorExpenseSummaryResponse,
} from './types.js';

export class Vendor {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async listVendors(options: ListVendors): Promise<HttpResponse<VendorsListResponse>> {
        try {
            this.auth.validate();
            this.validator.listVendors(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { page: options.page, size: options.size };
            return await this.httpClient.get<VendorsListResponse>(Routes.VENDOR.LIST, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async getVendor(options: VendorId): Promise<HttpResponse<VendorResponse>> {
        try {
            this.auth.validate();
            this.validator.vendorId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { vendorID: options.vendorId };
            return await this.httpClient.get<VendorResponse>(Routes.VENDOR.DETAILS, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async createVendor(options: CreateVendor): Promise<HttpResponse<VendorResponse>> {
        try {
            this.auth.validate();
            this.validator.createVendor(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            return await this.httpClient.post<VendorResponse>(Routes.VENDOR.CREATE, options.payload, headers);
        } catch (err) {
            handleError(err);
        }
    }

    async updateVendor(options: UpdateVendor): Promise<HttpResponse<VendorResponse>> {
        try {
            this.auth.validate();
            this.validator.updateVendor(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { vendorID: options.vendorId };
            return await this.httpClient.put<VendorResponse>(Routes.VENDOR.DETAILS, options.payload, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async inviteVendor(options: VendorId): Promise<HttpResponse<VendorMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.vendorId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { vendorID: options.vendorId };
            const resp = await this.httpClient.post<VendorMessageResponse>(Routes.VENDOR.INVITE, null, headers, params);
            this.validator.messageResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async setVendorSuspension(options: SetVendorSuspension): Promise<HttpResponse<VendorMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.setVendorSuspension(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { vendorID: options.vendorId, action: options.action };
            const resp = await this.httpClient.post<VendorMessageResponse>(
                Routes.VENDOR.SUSPENSION,
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

    async deleteVendor(options: VendorId): Promise<HttpResponse<VendorMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.vendorId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { vendorID: options.vendorId };
            return await this.httpClient.delete<VendorMessageResponse>(Routes.VENDOR.DETAILS, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async getVendorLedger(options: VendorId): Promise<HttpResponse<VendorLedgerResponse>> {
        try {
            this.auth.validate();
            this.validator.vendorId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { vendorID: options.vendorId };
            return await this.httpClient.get<VendorLedgerResponse>(Routes.VENDOR.LEDGER, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async acceptVendor(options: AcceptVendor): Promise<HttpResponse<VendorMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.acceptVendor(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { vendorID: options.vendorId, token: options.token };
            const resp = await this.httpClient.post<VendorMessageResponse>(Routes.VENDOR.ACCEPT, null, headers, params);
            this.validator.messageResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getExpenseGraph(options: ExpenseGraphFilters): Promise<HttpResponse<VendorExpenseGraphResponse>> {
        try {
            this.auth.validate();
            this.validator.expenseGraphFilters(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                vendorID: options.vendorID,
                currency: options.currency,
                from: options.from,
                to: options.to,
                period: options.period,
            };
            return await this.httpClient.get<VendorExpenseGraphResponse>(Routes.VENDOR.EXPENSE_GRAPH, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async getExpenseSummary(options: ExpenseGraphFilters): Promise<HttpResponse<VendorExpenseSummaryResponse>> {
        try {
            this.auth.validate();
            this.validator.expenseGraphFilters(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                vendorID: options.vendorID,
                currency: options.currency,
                from: options.from,
                to: options.to,
                period: options.period,
            };
            return await this.httpClient.get<VendorExpenseSummaryResponse>(
                Routes.VENDOR.EXPENSE_SUMMARY,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }

    async payVendor(options: PayVendor): Promise<HttpResponse<VendorMessageResponse>> {
        try {
            this.auth.validate();
            this.validator.payVendor(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { vendorID: options.vendorId };
            return await this.httpClient.post<VendorMessageResponse>(
                Routes.VENDOR.PAY,
                options.payDTO,
                headers,
                params
            );
        } catch (err) {
            handleError(err);
        }
    }
}
