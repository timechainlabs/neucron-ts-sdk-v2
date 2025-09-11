import { HttpClient } from '../../utils/http/http-client.js';
import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';
import type {
    CreatePaymailBody,
    CreatePaymailResponse,
    PaymailListBody,
    PaymailListResponse,
    UpdateDefaultPaymailBody,
    UpdateDefaultPaymailResponse,
    DeletePaymailBody,
    DeletePaymailResponse,
} from './types.ts';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';

export class Wallet {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;
    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async createPaymail(options: CreatePaymailBody): Promise<HttpResponse<CreatePaymailResponse>> {
        try {
            this.auth.validate();
            this.validator.createPaymail(options);
            const reqPath = Routes.PAYMAIL.CREATE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
                paymailName: options.paymailName,
            };
            const resp = await this.httpClient.post<CreatePaymailResponse>(reqPath, null, headers, params);
            this.validator.createPaymailResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async paymailList(options: PaymailListBody): Promise<HttpResponse<PaymailListResponse>> {
        try {
            this.auth.validate();
            this.validator.paymailList(options);
            const reqPath = Routes.PAYMAIL.LIST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
            };
            const resp = await this.httpClient.get<PaymailListResponse>(reqPath, headers, params);
            this.validator.paymailListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async updateDefaultPaymail(options: UpdateDefaultPaymailBody): Promise<HttpResponse<UpdateDefaultPaymailResponse>> {
        try {
            this.auth.validate();
            this.validator.updateDefaultPaymail(options);
            const reqPath = Routes.PAYMAIL.UPDATE_DEFAULT;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
                alias: options.alias,
            };
            const resp = await this.httpClient.put<UpdateDefaultPaymailResponse>(reqPath, null, headers, params);
            this.validator.updateDefaultPaymailResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async deletePaymail(options: DeletePaymailBody): Promise<HttpResponse<DeletePaymailResponse>> {
        try {
            this.auth.validate();
            this.validator.deletePaymail(options);
            const reqPath = Routes.PAYMAIL.DELETE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                alias: options.alias,
            };
            const resp = await this.httpClient.delete<DeletePaymailResponse>(reqPath, headers, params);
            this.validator.deletePaymailResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
