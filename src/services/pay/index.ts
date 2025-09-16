import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import type { PayWithAddressBody, PayWithEmailBody, PayWithPaymailBody, PayResponse } from './types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';

export class Pay {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async payWithAddress(options: PayWithAddressBody): Promise<HttpResponse<PayResponse>> {
        try {
            this.auth.validate();
            this.validator.payWithAddress(options);

            const reqPath = Routes.ASSET.TRANSFER;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
            };

            const payload = {
                assetId: options.assetId,
                amount: options.amount,
                to: options.to,
            };

            const res = await this.httpClient.post<PayResponse>(reqPath, payload, headers, params);
            this.validator.payResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async payWithEmail(options: PayWithEmailBody): Promise<HttpResponse<PayResponse>> {
        try {
            this.auth.validate();
            this.validator.payWithEmail(options);

            const reqPath = Routes.ASSET.TRANSFER;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
            };

            const payload = {
                assetId: options.assetId,
                amount: options.amount,
                to: options.to,
            };

            const res = await this.httpClient.post<PayResponse>(reqPath, payload, headers, params);
            this.validator.payResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async payWithPaymail(options: PayWithPaymailBody): Promise<HttpResponse<PayResponse>> {
        try {
            this.auth.validate();
            this.validator.payWithPaymail(options);

            const reqPath = Routes.ASSET.TRANSFER;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
            };

            const payload = {
                assetId: options.assetId,
                amount: options.amount,
                to: options.to,
            };

            const res = await this.httpClient.post<PayResponse>(reqPath, payload, headers, params);
            this.validator.payResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }
}
