import { HttpClient } from '../../utils/http/http-client.js';
import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';

import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import type {
    CreateUtility,
    CreateUtilityResponse,
    UpdateUtility,
    UpdateUtilityResponse,
    MintUtility,
    MintUtilityResponse,
    RedeemUtility,
    RedeemUtilityResponse,
} from './types.js';
import { Routes } from '../../utils/routes/index.js';
export class Utility {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;
    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }
    async createUtility(options: CreateUtility): Promise<HttpResponse<CreateUtilityResponse>> {
        try {
            this.auth.validate();
            this.validator.createUtility(options);
            const reqPath = Routes.UTILITY.REGISTER;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.post<CreateUtilityResponse>(reqPath, options, headers);
            this.validator.createUtilityResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async updateUtility(options: UpdateUtility): Promise<HttpResponse<UpdateUtilityResponse>> {
        try {
            this.auth.validate();
            this.validator.updateUtility(options);
            const reqPath = Routes.UTILITY.UPDATE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.put<UpdateUtilityResponse>(reqPath, options, headers);
            this.validator.updateUtilityResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async mint(options: MintUtility): Promise<HttpResponse<MintUtilityResponse>> {
        try {
            this.auth.validate();
            this.validator.mintUtility(options);
            const reqPath = Routes.UTILITY.MINT;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.post<MintUtilityResponse>(reqPath, null, headers, params);
            this.validator.mintUtilityResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async redeem(options: RedeemUtility): Promise<HttpResponse<RedeemUtilityResponse>> {
        try {
            this.auth.validate();
            this.validator.redeemUtility(options);
            const reqPath = Routes.UTILITY.REDEEM;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                utxoID: options.utxoID,
            };
            const response = await this.httpClient.post<RedeemUtilityResponse>(reqPath, null, headers, params);
            this.validator.redeemUtilityResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }
}
