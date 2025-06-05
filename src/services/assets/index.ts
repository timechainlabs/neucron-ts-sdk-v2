import { HttpClient } from '../../utils/http/http-client';
import { Headers, HttpResponse, QueryParams } from '../../utils/http/types';
import { Authentication } from '../authentication';

import Validator from './validator';
import { handleError } from '../../utils/errors/helper';
import {
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
} from './types';

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
            const reqPath = '/asset/register';
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
            const reqPath = '/asset/update';
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
            const reqPath = '/asset/mint';
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
            const reqPath = '/asset/transfer';
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
            const reqPath = '/asset/merge';
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
            const reqPath = '/asset/redeem';
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
            const reqPath = '/asset/ledgerlist';
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
            const reqPath = '/asset/assetlist';
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
