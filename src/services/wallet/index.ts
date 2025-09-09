import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import type {
    CreateWalletBody,
    CreateWalletReponse,
    UpdateDefaultWalletBody,
    UpdateDefaultWalletResponse,
    WalletListResponse,
    WalletAddressBody,
    CreateAddressResponse,
    WalletAddressListResponse,
} from './types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
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

    async createWallet(options: CreateWalletBody): Promise<HttpResponse<CreateWalletReponse>> {
        try {
            this.auth.validate();
            this.validator.createWallet(options);
            const reqPath = Routes.WALLET.CREATE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletName: options.walletName,
                paymailName: options.paymailName,
            };
            const resp = await this.httpClient.post<CreateWalletReponse>(reqPath, null, headers, params);
            this.validator.createWalletResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async walletList(): Promise<HttpResponse<WalletListResponse>> {
        try {
            this.auth.validate();
            const reqPath = Routes.WALLET.LIST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const resp = await this.httpClient.get<WalletListResponse>(reqPath, headers);
            this.validator.walletListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async updateDefaultWallet(options: UpdateDefaultWalletBody): Promise<HttpResponse<UpdateDefaultWalletResponse>> {
        try {
            this.auth.validate();
            this.validator.updateDefaultWallet(options);
            const reqPath = Routes.WALLET.UPDATE_DEFAULT;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
            };
            const resp = await this.httpClient.put<UpdateDefaultWalletResponse>(reqPath, null, headers, params);
            this.validator.updateDefaultWalletResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async createAddress(options: WalletAddressBody): Promise<HttpResponse<CreateAddressResponse>> {
        try {
            this.auth.validate();
            this.validator.walletAddress(options);
            const reqPath = Routes.WALLET.ADDRESS_CREATE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
            };
            const resp = await this.httpClient.post<CreateAddressResponse>(reqPath, null, headers, params);
            this.validator.createAddressResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async walletAddressList(): Promise<HttpResponse<WalletAddressListResponse>> {
        try {
            this.auth.validate();
            const reqPath = Routes.WALLET.ADDRESS_LIST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const resp = await this.httpClient.get<WalletAddressListResponse>(reqPath, headers);
            this.validator.walletAddressListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
