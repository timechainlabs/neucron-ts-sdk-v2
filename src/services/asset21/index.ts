import type { Headers, HttpResponse, QueryParams, IHttpClient } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import type {
    GetAddressState,
    GetAddressStateResponse,
    FetchBalance,
    FetchBalanceResponse,
    SystemConfig,
    SystemConfigResponse,
    UpdateSystemConfig,
    UpdateSystemConfigResponse,
    GetCustomers,
    GetCustomersResponse,
    Deploy,
    DeployResponse,
    Register,
    RegisterResponse,
    CreateRequest,
    CreateRequestResponse,
    GetRequest,
    GetRequestResponse,
    UpdateRequest,
    UpdateRequestResponse,
    SyncTransaction,
    SyncTransactionResponse,
    ListSyncedTransactions,
    ListSyncedTransactionsResponse,
    TriggerSyncForAddresses,
    TriggerSyncForAddressesResponse,
    Transfer,
    TransferResponse,
    GetUnspentUTXOs,
    GetUnspentUTXOResponse,
    GetOutputInfo,
    GetOutputInfoResponse,
    GetAnalytics,
    GetAnalyticsResponse,
    ListDeployedAssets,
    ListDeployedAssetsResponse,
} from './types.js';
import { Routes } from '../../utils/routes/index.js';

interface Asset21Context {
    businessId?: string;
}

function splitAsset21Context<T extends Asset21Context>(options: T) {
    const { businessId, ...rest } = options;
    return { businessId, rest };
}

function buildAsset21Headers(auth: Authentication, context: Asset21Context): Headers {
    return buildAuthHeaders(auth, {
        businessId: context.businessId,
    });
}

export class Assets21 {
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = auth.getHttpClient();
    }

    async getAddressState(options: GetAddressState): Promise<HttpResponse<GetAddressStateResponse>> {
        try {
            this.auth.validate();
            this.validator.getAddressState(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = {
                address: rest.address,
                assetID: rest.assetID,
            };
            const response = await this.httpClient.get<GetAddressStateResponse>(
                Routes.ASSET21.ADDRESS,
                headers,
                params
            );
            this.validator.getAddressStateResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async fetchBalance(options: FetchBalance): Promise<HttpResponse<FetchBalanceResponse>> {
        try {
            this.auth.validate();
            this.validator.fetchBalance(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = { assetID: rest.assetID };

            if (rest.addresses?.length) {
                const response = await this.httpClient.post<FetchBalanceResponse>(
                    Routes.ASSET21.BALANCE,
                    { addresses: rest.addresses },
                    headers,
                    params
                );
                this.validator.fetchBalanceResponse(response.data);
                return response;
            }

            const response = await this.httpClient.get<FetchBalanceResponse>(Routes.ASSET21.BALANCE, headers, {
                ...params,
                address: rest.address,
            });
            this.validator.fetchBalanceResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getSystemConfig(options: SystemConfig): Promise<HttpResponse<SystemConfigResponse>> {
        try {
            this.auth.validate();
            this.validator.systemConfig(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = { assetID: rest.assetID };
            const response = await this.httpClient.get<SystemConfigResponse>(Routes.ASSET21.CONFIG, headers, params);
            this.validator.systemConfigResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async updateSystemConfig(options: UpdateSystemConfig): Promise<HttpResponse<UpdateSystemConfigResponse>> {
        try {
            this.auth.validate();
            this.validator.updateSystemConfig(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = { assetID: rest.assetID };
            const body = {
                fees: rest.fees,
                request_config: rest.request_config,
            };
            const response = await this.httpClient.put<UpdateSystemConfigResponse>(
                Routes.ASSET21.CONFIG,
                body,
                headers,
                params
            );
            this.validator.updateSystemConfigResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getCustomers(options: GetCustomers): Promise<HttpResponse<GetCustomersResponse>> {
        try {
            this.auth.validate();
            this.validator.getCustomers(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = { assetID: rest.assetID };
            const response = await this.httpClient.get<GetCustomersResponse>(Routes.ASSET21.CUSTOMERS, headers, params);
            this.validator.getCustomersResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async register(options: Register): Promise<HttpResponse<RegisterResponse>> {
        try {
            this.auth.validate();
            this.validator.register(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const response = await this.httpClient.post<RegisterResponse>(Routes.ASSET21.REGISTER, rest, headers);
            this.validator.registerResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async deploy(options: Deploy): Promise<HttpResponse<DeployResponse>> {
        try {
            this.auth.validate();
            this.validator.deploy(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = { assetID: rest.assetID };
            const response = await this.httpClient.post<DeployResponse>(Routes.ASSET21.DEPLOY, null, headers, params);
            this.validator.deployResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async listDeployedAssets(options: ListDeployedAssets): Promise<HttpResponse<ListDeployedAssetsResponse>> {
        try {
            this.auth.validate();
            this.validator.listDeployedAssets(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = {
                status: rest.status,
                pageNumber: rest.pageNumber,
                pageSize: rest.pageSize,
            };
            const response = await this.httpClient.get<ListDeployedAssetsResponse>(
                Routes.ASSET.ASSETLIST,
                headers,
                params
            );
            this.validator.listDeployedAssetsResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async createRequest(options: CreateRequest): Promise<HttpResponse<CreateRequestResponse>> {
        try {
            this.auth.validate();
            this.validator.createRequest(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const body = {
                assetId: rest.assetId,
                state: rest.state,
                requestDetails: rest.requestDetails,
                approvalsRequired: rest.approvalsRequired,
                rejectionsRequired: rest.rejectionsRequired,
            };
            const response = await this.httpClient.post<CreateRequestResponse>(Routes.ASSET21.REQUEST, body, headers);
            this.validator.createRequestResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getRequest(options: GetRequest): Promise<HttpResponse<GetRequestResponse>> {
        try {
            this.auth.validate();
            this.validator.getRequest(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = {
                assetID: rest.assetID,
                state: rest.state,
                status: rest.status,
                page: rest.page,
                size: rest.size,
            };
            const response = await this.httpClient.get<GetRequestResponse>(Routes.ASSET21.REQUEST, headers, params);
            this.validator.getRequestResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async updateRequest(options: UpdateRequest): Promise<HttpResponse<UpdateRequestResponse>> {
        try {
            this.auth.validate();
            this.validator.updateRequest(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const body = {
                action: rest.action,
                assetId: rest.assetId,
                requestId: rest.requestId,
            };
            const response = await this.httpClient.put<UpdateRequestResponse>(Routes.ASSET21.REQUEST, body, headers);
            this.validator.updateRequestResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async syncTransaction(options: SyncTransaction): Promise<HttpResponse<SyncTransactionResponse>> {
        try {
            this.auth.validate();
            this.validator.syncTransaction(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const body = {
                assetID: rest.assetID,
                txid: rest.txid,
            };
            const response = await this.httpClient.post<SyncTransactionResponse>(Routes.ASSET21.SYNC, body, headers);
            this.validator.syncTransactionResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async listSyncedTransactions(
        options: ListSyncedTransactions
    ): Promise<HttpResponse<ListSyncedTransactionsResponse>> {
        try {
            this.auth.validate();
            this.validator.listSyncedTransactions(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = {
                assetID: rest.assetID,
                from: rest.from,
                limit: rest.limit,
                action: rest.action,
            };
            const response = await this.httpClient.get<ListSyncedTransactionsResponse>(
                Routes.ASSET21.SYNC,
                headers,
                params
            );
            this.validator.listSyncedTransactionsResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async triggerSyncForAddresses(
        options: TriggerSyncForAddresses
    ): Promise<HttpResponse<TriggerSyncForAddressesResponse>> {
        try {
            this.auth.validate();
            this.validator.triggerSyncForAddresses(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const body = {
                assetID: rest.assetID,
                addresses: rest.addresses,
            };
            const response = await this.httpClient.post<TriggerSyncForAddressesResponse>(
                Routes.ASSET21.SYNC,
                body,
                headers
            );
            this.validator.triggerSyncForAddressesResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async transfer(options: Transfer): Promise<HttpResponse<TransferResponse>> {
        try {
            this.auth.validate();
            this.validator.transfer(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = { assetID: rest.assetID };
            const body = {
                walletID: rest.walletID,
                fromAddress: rest.fromAddress,
                toAddress: rest.toAddress,
                amount: rest.amount,
                tokenAddress: rest.tokenAddress,
                metadata: rest.metadata,
            };
            const response = await this.httpClient.post<TransferResponse>(
                Routes.ASSET21.TRANSFER,
                body,
                headers,
                params
            );
            this.validator.transferResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getUnspentUTXOs(options: GetUnspentUTXOs): Promise<HttpResponse<GetUnspentUTXOResponse>> {
        try {
            this.auth.validate();
            this.validator.getUnspentUTXOs(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = { assetID: rest.assetID };

            if (rest.addresses?.length) {
                const response = await this.httpClient.post<GetUnspentUTXOResponse>(
                    Routes.ASSET21.UTXOS,
                    {
                        addresses: rest.addresses,
                        includeMempool: rest.includeMempool,
                    },
                    headers,
                    params
                );
                this.validator.getUnspentUTXOResponse(response.data);
                return response;
            }

            const response = await this.httpClient.get<GetUnspentUTXOResponse>(Routes.ASSET21.UTXOS, headers, {
                ...params,
                address: rest.address,
            });
            this.validator.getUnspentUTXOResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getOutputInfo(options: GetOutputInfo): Promise<HttpResponse<GetOutputInfoResponse>> {
        try {
            this.auth.validate();
            this.validator.getOutputInfo(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const response = await this.httpClient.get<GetOutputInfoResponse>(
                `${Routes.ASSET21.OUTPOINT}/${rest.outpoint}`,
                headers
            );
            this.validator.getOutputInfoResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getAnalytics(options: GetAnalytics): Promise<HttpResponse<GetAnalyticsResponse>> {
        try {
            this.auth.validate();
            this.validator.getAnalytics(options);
            const { businessId, rest } = splitAsset21Context(options);
            const headers = buildAsset21Headers(this.auth, { businessId });
            const params: QueryParams = {
                assetID: rest.assetID,
                limit: rest.limit,
                graphRange: rest.graphRange,
            };
            const response = await this.httpClient.get<GetAnalyticsResponse>(Routes.ASSET21.ANALYTICS, headers, params);
            this.validator.getAnalyticsResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }
}
