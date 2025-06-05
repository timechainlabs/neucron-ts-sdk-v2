import { HttpClient } from '../../utils/http/http-client.js';
import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';
import type {
    CreatePaymailBody,
    CreatePaymailResponse,
    CreateWalletBody,
    CreateWalletReponse,
    ListWalletsResponse,
    PayamailListBody,
    PaymailListResponse,
} from './types.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';

export class Wallet {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;
    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async createWallet(options: CreateWalletBody): Promise<HttpResponse<CreateWalletReponse>> {
        try {
            this.auth.validate();
            this.validator.createWallet(options);
            const reqPath = '/wallet/create';

            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletName: options.walletName,
                paymailName: options.paymailName,
            };
            const resp = await this.httpClient.post<CreateWalletReponse>(reqPath, null, headers, params);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async walletList(): Promise<HttpResponse<ListWalletsResponse>> {
        try {
            this.auth.validate();
            const reqPath = '/wallet/list';
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const resp = await this.httpClient.get<ListWalletsResponse>(reqPath, headers);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async createPaymail(options: CreatePaymailBody): Promise<HttpResponse<CreatePaymailResponse>> {
        try {
            this.auth.validate();
            this.validator.createPaymail(options);
            const reqPath = '/wallet/paymail/create';
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
                paymailName: options.paymailName,
            };
            const resp = await this.httpClient.post<CreatePaymailResponse>(reqPath, null, headers, params);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async paymailList(options: PayamailListBody): Promise<HttpResponse<PaymailListResponse>> {
        try {
            this.auth.validate();
            this.validator.paymailList(options);
            const reqPath = '/wallet/paymail/list';
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
            };
            const resp = await this.httpClient.get<PaymailListResponse>(reqPath, headers, params);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
