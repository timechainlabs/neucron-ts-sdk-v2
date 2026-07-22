import type { HttpResponse, QueryParams, IHttpClient } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';

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
    Balances,
    BalancesResponse,
    PublicAssetList,
    PublicAssetListResponse,
    OwnedAssetDetails,
    OwnedAssetDetailsResponse,
    EventDetails,
    EventDetailsResponse,
} from './types.js';
import { Routes } from '../../utils/routes/index.js';

export class Assets {
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;
    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = auth.getHttpClient();
    }

    async getAssetDetails(options: AssetDetails): Promise<HttpResponse<AssetDetailsResponse>> {
        try {
            this.auth.validate();
            this.validator.assetDetails(options);
            const headers = buildAuthHeaders(this.auth);
            const params: QueryParams = { assetID: options.assetID };
            const response = await this.httpClient.get<AssetDetailsResponse>(Routes.ASSET.DETAILS, headers, params);
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
            const headers = buildAuthHeaders(this.auth);
            const params: QueryParams = { assetID: options.assetID };
            const response = await this.httpClient.delete<AssetDeleteResponse>(Routes.ASSET.DELETE, headers, params);
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
            const headers = buildAuthHeaders(this.auth);
            const response = await this.httpClient.post<TransferAssetResponse>(Routes.ASSET.TRANSFER, options, headers);
            this.validator.transferAssetResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getLedgerList(options?: LedgerList): Promise<HttpResponse<LedgerListResponse>> {
        try {
            this.auth.validate();
            this.validator.ledgerList(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const body = options?.status ? { status: options.status } : [];
            const params: QueryParams = {
                walletID: options?.walletID,
                pageNumber: options?.pageNumber ?? 1,
                pageSize: options?.pageSize ?? 5,
            };
            const response = await this.httpClient.post<LedgerListResponse>(
                Routes.ASSET.LEDGERLIST,
                body,
                headers,
                params
            );
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
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const params: QueryParams = {
                searchQuery: options?.searchQuery,
                status: options?.status,
                type: options?.type,
                walletID: options?.walletID,
                pageNumber: options?.pageNumber,
                pageSize: options?.pageSize,
            };
            const response = await this.httpClient.get<AssetListResponse>(Routes.ASSET.ASSETLIST, headers, params);
            this.validator.assetListResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getPublicAssetList(options?: PublicAssetList): Promise<HttpResponse<PublicAssetListResponse>> {
        try {
            this.auth.validate();
            this.validator.publicAssetList(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const params: QueryParams = {
                pageSize: options?.pageSize ?? 100,
                searchQuery: options?.searchQuery,
                type: options?.type,
                pageNumber: options?.pageNumber,
                network: options?.network,
                chain: options?.chain,
            };
            const response = await this.httpClient.get<PublicAssetListResponse>(
                Routes.ASSET.PUBLIC_ASSETLIST,
                headers,
                params
            );
            this.validator.publicAssetListResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getLedgerDetails(options: LedgerDetails): Promise<HttpResponse<LedgerDetailsResponse>> {
        try {
            this.auth.validate();
            this.validator.ledgerDetails(options);
            const headers = buildAuthHeaders(this.auth);
            const params: QueryParams = { assetID: options.assetID };
            const response = await this.httpClient.get<LedgerDetailsResponse>(
                Routes.ASSET.LEDGER_DETAILS,
                headers,
                params
            );
            this.validator.ledgerDetailsResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getAssetStats(): Promise<HttpResponse<AssetStatsResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            const response = await this.httpClient.get<AssetStatsResponse>(Routes.ASSET.ASSET_STATS, headers);
            this.validator.assetStatsResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getBalances(options: Balances): Promise<HttpResponse<BalancesResponse>> {
        try {
            this.auth.validate();
            this.validator.balances(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                walletID: options.walletID,
                network: options.network,
                currency: options.currency,
            };
            const response = await this.httpClient.get<BalancesResponse>(Routes.ASSET.BALANCES, headers, params);
            this.validator.balancesResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getOwnedAssetDetails(options: OwnedAssetDetails): Promise<HttpResponse<OwnedAssetDetailsResponse>> {
        try {
            this.auth.validate();
            this.validator.ownedAssetDetails(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = {
                assetID: options.assetID,
                walletID: options.walletID,
            };
            const response = await this.httpClient.get<OwnedAssetDetailsResponse>(
                Routes.ASSET.OWNED_DETAILS,
                headers,
                params
            );
            this.validator.ownedAssetDetailsResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getEventDetails(options: EventDetails): Promise<HttpResponse<EventDetailsResponse>> {
        try {
            this.auth.validate();
            this.validator.eventDetails(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { eventID: options.eventId };
            const response = await this.httpClient.get<EventDetailsResponse>(Routes.EVENT.DETAILS, headers, params);
            this.validator.eventDetailsResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }
}
