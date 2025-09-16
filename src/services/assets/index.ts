import { HttpClient } from '../../utils/http/http-client.js';
import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';

import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import type {
    AssetDetails,
    AssetDetailsResponse,
    AssetDelete,
    AssetDeleteResponse,
    TransferAsset,
    TransferAssetResponse,
    LedgerList,
    LedgerListResponse,
    AssetList,
    AssetListResponse,
    LedgerDetails,
    LedgerDetailsResponse,
    AssetStatsResponse,
} from './types.js';
import { Routes } from '../../utils/routes/index.js';

export class Assets {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;
    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async getAssetDetails(options: AssetDetails): Promise<HttpResponse<AssetDetailsResponse>> {
        try {
            this.auth.validate();
            this.validator.assetDetails(options);
            const reqPath = Routes.ASSET.DETAILS;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.get<AssetDetailsResponse>(reqPath, headers, params);
            this.validator.assetDetailsResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async deleteAsset(options: AssetDelete): Promise<HttpResponse<AssetDeleteResponse>> {
        try {
            this.auth.validate();
            this.validator.deleteAsset(options);
            const reqPath = Routes.ASSET.DELETE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.delete<AssetDeleteResponse>(reqPath, headers, params);
            this.validator.deleteAssetResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async transfer(options: TransferAsset): Promise<HttpResponse<TransferAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.transferAsset(options);
            const reqPath = Routes.ASSET.TRANSFER;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.post<TransferAssetResponse>(reqPath, options, headers);
            this.validator.transferAssetResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getLedgerList(options: LedgerList): Promise<HttpResponse<LedgerListResponse>> {
        try {
            this.auth.validate();
            this.validator.ledgerList(options);
            const reqPath = Routes.ASSET.LEDGERLIST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const body = { status: options.status };
            const params: QueryParams = {
                walletID: options.walletID,
                pageNumber: options.pageNumber,
                pageSize: options.pageSize,
            };
            const response = await this.httpClient.post<LedgerListResponse>(reqPath, body, headers, params);
            this.validator.ledgerListResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getAssetList(options?: AssetList): Promise<HttpResponse<AssetListResponse>> {
        try {
            this.auth.validate();
            this.validator.assetList(options);
            const reqPath = Routes.ASSET.ASSETLIST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                searchQuery: options?.searchQuery,
                status: options?.status,
                type: options?.type,
                walletID: options?.walletID,
                pageNumber: options?.pageNumber,
                pageSize: options?.pageSize,
            };
            const response = await this.httpClient.get<AssetListResponse>(reqPath, headers, params);
            this.validator.assetListResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getLedgerDetails(options: LedgerDetails): Promise<HttpResponse<LedgerDetailsResponse>> {
        try {
            this.auth.validate();
            this.validator.ledgerDetails(options);
            const reqPath = Routes.ASSET.LEDGER_DETAILS;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.get<LedgerDetailsResponse>(reqPath, headers, params);
            this.validator.ledgerDetailsResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getAssetStats(): Promise<HttpResponse<AssetStatsResponse>> {
        try {
            this.auth.validate();
            const reqPath = Routes.ASSET.ASSETLIST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.get<AssetStatsResponse>(reqPath, headers);
            this.validator.assetStatsResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }
}
