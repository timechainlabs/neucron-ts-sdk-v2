import { HttpClient } from '../../utils/http/http-client.js';
import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';

import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import type {
    CreateAsset,
    CreateAssetResponse,
    GetAssetList,
    GetAssetListResponse,
    GetLedgerList,
    GetLedgerListResponse,
    MergeAsset,
    MergeAssetResponse,
    MintAsset,
    MintAssetResponse,
    RedeemAsset,
    RedeemAssetResponse,
    TransferAsset,
    TransferAssetResponse,
    UpdateAsset,
    UpdateAssetResponse,
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
            const reqPath = Routes.ASSET.REGISTER;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };

            const response = await this.httpClient.post<CreateAssetResponse>(reqPath, options, headers);
            return response;
        } catch (error) {
            handleError(error);
        }
    }
    async updateAsset(options: UpdateAsset): Promise<HttpResponse<UpdateAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.updateAsset(options);
            const reqPath = Routes.ASSET.UPDATE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };

            const response = await this.httpClient.put<UpdateAssetResponse>(reqPath, options, headers);
            return response;
        } catch (error) {
            handleError(error);
        }
    }
    async mint(options: MintAsset): Promise<HttpResponse<MintAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.mintAsset(options);
            const reqPath = Routes.ASSET.MINT;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.post<MintAssetResponse>(reqPath, null, headers, params);
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
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async merge(options: MergeAsset): Promise<HttpResponse<MergeAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.mergeAsset(options);
            const reqPath = Routes.ASSET.MERGE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.post<MergeAssetResponse>(reqPath, options, headers);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async redeem(options: RedeemAsset): Promise<HttpResponse<RedeemAssetResponse>> {
        try {
            this.auth.validate();
            this.validator.redeemAsset(options);
            const reqPath = Routes.ASSET.REDEEM;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                utxoID: options.utxoID,
            };
            const response = await this.httpClient.post<RedeemAssetResponse>(reqPath, null, headers, params);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getLedgerList(options: GetLedgerList): Promise<HttpResponse<GetLedgerListResponse>> {
        try {
            this.auth.validate();
            this.validator.ledgerList(options);
            const reqPath = Routes.ASSET.LEDGERLIST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const body = options.status;

            const params: QueryParams = {
                walletID: options.walletID,
                pageNumber: options.pageNumber,
                pageSize: options.pageSize,
            };
            const response = await this.httpClient.post<GetLedgerListResponse>(reqPath, body, headers, params);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getAssetList(options?: GetAssetList): Promise<HttpResponse<GetAssetListResponse>> {
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
                walletID: options?.walletID,
                pageNumber: options?.pageNumber,
                pageSize: options?.pageSize,
            };
            const response = await this.httpClient.get<GetAssetListResponse>(reqPath, headers, params);
            return response;
        } catch (error) {
            handleError(error);
        }
    }
}
