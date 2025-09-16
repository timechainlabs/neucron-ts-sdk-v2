import { HttpClient } from '../../utils/http/http-client.js';
import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';

import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import type {
    CreateAsset,
    CreateAssetResponse,
    UpdateAsset,
    UpdateAssetResponse,
    AssetDetails,
    AssetDetailsResponse,
    AssetDelete,
    AssetDeleteResponse,
    MintAsset,
    MintAssetResponse,
    TransferAsset,
    TransferAssetResponse,
    MergeAsset,
    MergeAssetResponse,
    RedeemAsset,
    RedeemAssetResponse,
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

    async createAsset(options: CreateAsset): Promise<HttpResponse<CreateAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.createAsset(options);
            const reqPath = Routes.UTILITY.REGISTER;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.post<CreateAssetResponse>(reqPath, options, headers);
            this.validator.createAssetResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async updateAsset(options: UpdateAsset): Promise<HttpResponse<UpdateAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.updateAsset(options);
            const reqPath = Routes.UTILITY.UPDATE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.put<UpdateAssetResponse>(reqPath, options, headers);
            this.validator.updateAssetResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
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

    async mint(options: MintAsset): Promise<HttpResponse<MintAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.mintAsset(options);
            const reqPath = Routes.UTILITY.MINT;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.post<MintAssetResponse>(reqPath, null, headers, params);
            this.validator.mintAssetResponse(response.data);
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

    async merge(options: MergeAsset): Promise<HttpResponse<MergeAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.mergeAsset(options);
            const reqPath = Routes.UTILITY.MERGE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
            };
            const response = await this.httpClient.post<MergeAssetResponse>(reqPath, options, headers, params);
            this.validator.mergeAssetResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async redeem(options: RedeemAsset): Promise<HttpResponse<RedeemAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.redeemAsset(options);
            const reqPath = Routes.UTILITY.REDEEM;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                utxoID: options.utxoID,
            };
            const response = await this.httpClient.post<RedeemAssetResponse>(reqPath, null, headers, params);
            this.validator.redeemAssetResponse(response.data);
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
