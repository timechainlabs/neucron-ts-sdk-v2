import type { HttpResponse, QueryParams } from '../../utils/http/types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type {
    BillId,
    CreateBill,
    UpdateBill,
    ListBills,
    ReviewBill,
    PayBill,
    MapBillToPayout,
    AcceptVendorInvitation,
    CreateBillResponse,
    UpdateBillResponse,
    PayBillResponse,
    BillResponse,
    BillsListResponse,
} from './types.js';

export class Bill {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async createBill(options: CreateBill): Promise<HttpResponse<CreateBillResponse>> {
        try {
            this.auth.validate();
            this.validator.createBill(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const resp = await this.httpClient.post<CreateBillResponse>(Routes.VENDOR.BILL, options.payload, headers);
            this.validator.createBillResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async updateBill(options: UpdateBill): Promise<HttpResponse<UpdateBillResponse>> {
        try {
            this.auth.validate();
            this.validator.updateBill(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { billID: options.billID };
            const resp = await this.httpClient.put<UpdateBillResponse>(
                Routes.VENDOR.BILL,
                options.payload,
                headers,
                params
            );
            this.validator.updateBillResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getBill(options: BillId): Promise<HttpResponse<BillResponse>> {
        try {
            this.auth.validate();
            this.validator.billId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { billID: options.billID };
            return await this.httpClient.get<BillResponse>(Routes.VENDOR.BILL, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async listBills(options: ListBills): Promise<HttpResponse<BillsListResponse>> {
        try {
            this.auth.validate();
            this.validator.listBills(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                vendorID: options.vendorID,
                page: options.page,
                size: options.size,
            };
            return await this.httpClient.get<BillsListResponse>(Routes.VENDOR.BILL_LIST, headers, params);
        } catch (err) {
            handleError(err);
        }
    }

    async reviewBill(options: ReviewBill): Promise<HttpResponse<UpdateBillResponse>> {
        try {
            this.auth.validate();
            this.validator.reviewBill(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { billID: options.billID, action: options.action };
            const resp = await this.httpClient.post<UpdateBillResponse>(
                Routes.VENDOR.BILL_REVIEW,
                null,
                headers,
                params
            );
            this.validator.updateBillResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async confirmBill(options: BillId): Promise<HttpResponse<UpdateBillResponse>> {
        try {
            this.auth.validate();
            this.validator.billId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { billID: options.billID };
            const resp = await this.httpClient.post<UpdateBillResponse>(
                Routes.VENDOR.BILL_CONFIRM,
                null,
                headers,
                params
            );
            this.validator.updateBillResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async payBill(options: PayBill): Promise<HttpResponse<PayBillResponse>> {
        try {
            this.auth.validate();
            this.validator.payBill(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { billID: options.billID };
            const resp = await this.httpClient.post<PayBillResponse>(
                Routes.VENDOR.BILL_PAY,
                options.payDTO,
                headers,
                params
            );
            this.validator.payBillResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async mapBillToPayout(options: MapBillToPayout): Promise<HttpResponse<UpdateBillResponse>> {
        try {
            this.auth.validate();
            this.validator.mapBillToPayout(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { billID: options.billID, payoutID: options.payoutID };
            const resp = await this.httpClient.post<UpdateBillResponse>(
                Routes.VENDOR.BILL_PAYOUT,
                null,
                headers,
                params
            );
            this.validator.updateBillResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async acceptVendorInvitation(options: AcceptVendorInvitation): Promise<HttpResponse<UpdateBillResponse>> {
        try {
            this.auth.validate();
            this.validator.acceptVendorInvitation(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { vendorID: options.vendorID, token: options.token };
            const resp = await this.httpClient.post<UpdateBillResponse>(Routes.VENDOR.ACCEPT, null, headers, params);
            this.validator.updateBillResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
