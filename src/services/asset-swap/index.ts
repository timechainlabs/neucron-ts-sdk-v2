import type { HttpResponse, QueryParams, IHttpClient } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type { SwappableAssetsResponse, SwapAssets, SwapAssetsResponse, SwapRate, SwapRateResponse } from './types.js';

export class AssetSwap {
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = auth.getHttpClient();
    }

    async getSwappableAssets(options?: { businessId?: string }): Promise<HttpResponse<SwappableAssetsResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const resp = await this.httpClient.get<SwappableAssetsResponse>(Routes.ASSET_SWAP.SWAPPABLE, headers);
            this.validator.swappableAssetsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async swapAssets(options: SwapAssets): Promise<HttpResponse<SwapAssetsResponse>> {
        try {
            this.auth.validate();
            this.validator.swapAssets(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { walletID: options.walletID };
            const resp = await this.httpClient.post<SwapAssetsResponse>(
                Routes.ASSET_SWAP.SWAP,
                options.payload,
                headers,
                params
            );
            this.validator.swapAssetsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getSwapRate(options: SwapRate): Promise<HttpResponse<SwapRateResponse>> {
        try {
            this.auth.validate();
            this.validator.swapRate(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const resp = await this.httpClient.post<SwapRateResponse>(Routes.ASSET_SWAP.RATE, options.payload, headers);
            this.validator.swapRateResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
