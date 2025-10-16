import { HttpClient } from '../../utils/http/http-client.js';
import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';

import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import type {
    GetAddressState,
    GetAddressStateResponse,
    FetchBalance,
    FetchBalanceResponse,
    SystemConfig,
    SystemConfigResponse,
    GetCustomers,
    GetCustomersResponse,
    Deploy,
    DeployResponse,
    RegisterPayload,
    RegisterResponse,
    CreateRequest,
    CreateRequestResponse,
    GetRequest,
    GetRequestResponse,
    UpdateRequest,
    UpdateRequestResponse,
    SyncTransaction,
    SyncTransactionResponse,
    TriggerSyncForAddresses,
    TriggerSyncForAddressesResponse,
    Transfer,
    TransferResponse,
    GetUnspentUTXOs,
    GetUnspentUTXOResponse,
    GetOutputInfoResponse,
    GetOutputInfo,
} from './types.js';
import { Routes } from '../../utils/routes/index.js';

export class Assets21 {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;
    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async getAddressState(options: GetAddressState): Promise<HttpResponse<GetAddressStateResponse>> {
        try {
            this.auth.validate();
            this.validator.getAddressState(options);
            const reqPath = Routes.ASSET21.ADDRESS;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.get<GetAddressStateResponse>(reqPath, headers, params);
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
            const reqPath = Routes.ASSET21.BALANCE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.post<FetchBalanceResponse>(
                reqPath,
                options.addresses,
                headers,
                params
            );
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
            const reqPath = Routes.ASSET21.CONFIG;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.get<SystemConfigResponse>(reqPath, headers, options);
            this.validator.systemConfigResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getCustomers(options: GetCustomers): Promise<HttpResponse<GetCustomersResponse>> {
        try {
            this.auth.validate();
            this.validator.getCustomers(options);
            const reqPath = Routes.ASSET21.CUSTOMERS;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.get<GetCustomersResponse>(reqPath, headers, params);
            this.validator.getCustomersResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async deploy(options: Deploy): Promise<HttpResponse<DeployResponse>> {
        try {
            this.auth.validate();
            this.validator.deploy(options);
            const reqPath = Routes.ASSET21.DEPLOY;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
                'X-Neucron-Team-ID': options['X-Neucron-Team-ID'],
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.post<DeployResponse>(reqPath, params, headers);
            this.validator.deployResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async register(options: RegisterPayload): Promise<HttpResponse<RegisterResponse>> {
        try {
            this.auth.validate();
            this.validator.registerPayload(options);
            const reqPath = Routes.ASSET21.REGISTER;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
                'X-Neucron-Team-ID': options['X-Neucron-Team-ID'],
            };
            const response = await this.httpClient.post<RegisterResponse>(
                reqPath,
                options.registerPayloadBody,
                headers
            );
            this.validator.registerResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async createRequest(options: CreateRequest): Promise<HttpResponse<CreateRequestResponse>> {
        try {
            this.auth.validate();
            this.validator.createRequest(options);
            const reqPath = Routes.ASSET21.REQUEST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.post<CreateRequestResponse>(reqPath, options, headers);
            this.validator.createRequestResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async updateRequest(options: UpdateRequest): Promise<HttpResponse<UpdateRequestResponse>> {
        try {
            this.auth.validate();
            this.validator.updateRequest(options);
            const reqPath = Routes.ASSET21.REQUEST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.put<UpdateRequestResponse>(reqPath, options, headers);
            this.validator.updateRequestResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async getRequest(options: GetRequest): Promise<HttpResponse<GetRequestResponse>> {
        try {
            this.auth.validate();
            this.validator.getRequest(options);
            const reqPath = Routes.ASSET21.REQUEST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
                state: options.state,
                status: options.status,
                page: options.page,
                size: options.size,
            };
            const response = await this.httpClient.get<GetRequestResponse>(reqPath, headers, params);
            this.validator.getRequestResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async syncTransaction(options: SyncTransaction): Promise<HttpResponse<SyncTransactionResponse>> {
        try {
            this.auth.validate();
            this.validator.syncTransaction(options);
            const reqPath = Routes.ASSET21.SYNC;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
                from: options.from,
                limit: options.limit,
            };
            const response = await this.httpClient.get<SyncTransactionResponse>(reqPath, headers, params);
            this.validator.syncTransactionResponse(response.data);
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
            const reqPath = Routes.ASSET21.SYNC;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
                from: options.from,
                limit: options.limit,
                order: options.order,
            };
            const response = await this.httpClient.post<TriggerSyncForAddressesResponse>(
                reqPath,
                options.request,
                headers,
                params
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
            const reqPath = Routes.ASSET21.TRANSFER;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.post<TransferResponse>(reqPath, options.transfer, headers, params);
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
            const reqPath = Routes.ASSET21.UTXOS;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                assetID: options.assetID,
            };
            const response = await this.httpClient.get<GetUnspentUTXOResponse>(reqPath, headers, params);
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
            const reqPath = Routes.ASSET21.OUTPOINT + '/' + options.outpoint;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const response = await this.httpClient.get<GetOutputInfoResponse>(reqPath, headers);
            this.validator.getOutputInfoResponse(response.data);
            return response;
        } catch (error) {
            handleError(error);
        }
    }
}
