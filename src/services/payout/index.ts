import type { HttpResponse, QueryParams } from '../../utils/http/types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type {
    CreatePayout,
    PayoutId,
    UpdatePayout,
    ListPayouts,
    ConfirmPayout,
    CreatePayoutResponse,
    TriggerPayoutResponse,
    ConfirmPayoutResponse,
    PayoutListResponse,
    PayoutApiModel,
} from './types.js';

export class Payout {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async createPayout(options: CreatePayout): Promise<HttpResponse<CreatePayoutResponse>> {
        try {
            this.auth.validate();
            this.validator.createPayout(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const resp = await this.httpClient.post<CreatePayoutResponse>(
                Routes.PAYOUT.CREATE,
                options.payload,
                headers
            );
            this.validator.createPayoutResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async updatePayout(options: UpdatePayout): Promise<HttpResponse<CreatePayoutResponse>> {
        try {
            this.auth.validate();
            this.validator.updatePayout(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { payoutID: options.payoutID };
            const resp = await this.httpClient.put<CreatePayoutResponse>(
                Routes.PAYOUT.DETAILS,
                options.payload,
                headers,
                params
            );
            this.validator.createPayoutResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async listPayouts(options: ListPayouts): Promise<HttpResponse<PayoutListResponse>> {
        try {
            this.auth.validate();
            this.validator.listPayouts(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                status: options.status,
                reference: options.reference,
                reference_type: options.reference_type,
                page: options.page,
                limit: options.limit,
            };
            const resp = await this.httpClient.get<PayoutListResponse>(Routes.PAYOUT.LIST, headers, params);
            this.validator.payoutListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async triggerPayout(options: PayoutId): Promise<HttpResponse<TriggerPayoutResponse>> {
        try {
            this.auth.validate();
            this.validator.payoutId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { payoutID: options.payoutID };
            const resp = await this.httpClient.post<TriggerPayoutResponse>(
                Routes.PAYOUT.TRIGGER,
                null,
                headers,
                params
            );
            this.validator.triggerPayoutResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getPayout(options: PayoutId): Promise<HttpResponse<PayoutApiModel>> {
        try {
            this.auth.validate();
            this.validator.payoutId(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { payoutID: options.payoutID };
            const resp = await this.httpClient.get<PayoutApiModel>(Routes.PAYOUT.DETAILS, headers, params);
            this.validator.payoutResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async confirmPayout(options: ConfirmPayout): Promise<HttpResponse<ConfirmPayoutResponse>> {
        try {
            this.auth.validate();
            this.validator.confirmPayout(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { payoutID: options.payoutID };
            const resp = await this.httpClient.post<ConfirmPayoutResponse>(
                Routes.PAYOUT.CONFIRM,
                options.payload,
                headers,
                params
            );
            this.validator.confirmPayoutResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
