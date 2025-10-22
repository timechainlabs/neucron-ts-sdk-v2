import {
    getAddressStateSchema,
    getAddressStateResponseSchema,
    fetchBalanceSchema,
    fetchBalanceResponseSchema,
    systemConfigSchema,
    systemConfigResponseSchema,
    getCustomersSchema,
    getCustomerResponseSchema,
    deploySchema,
    deployResponseSchema,
    registerPayloadSchema,
    registerResponseSchema,
    createRequestSchema,
    createRequestResponseSchema,
    updateRequestSchema,
    updateRequestResponseSchema,
    getRequestSchema,
    getRequestResponseSchema,
    syncTransactionSchema,
    syncTransactionResponse,
    triggerSyncForAddressesSchema,
    triggerSyncForAddressesResponseSchema,
    transferSchema,
    transferResponseSchema,
    getUnspentUTXOs,
    getUnspentUTXOResponse,
    getOutputInfoSchema,
    getOutputInfoResponse,
} from './schema.js';
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
    UpdateRequest,
    UpdateRequestResponse,
    GetRequest,
    GetRequestResponse,
    SyncTransaction,
    SyncTransactionResponse,
    TriggerSyncForAddresses,
    TriggerSyncForAddressesResponse,
    Transfer,
    TransferResponse,
    GetUnspentUTXOs,
    GetUnspentUTXOResponse,
    GetOutputInfo,
    GetOutputInfoResponse,
} from './types.js';

export default class Validator {
    getAddressState(params: GetAddressState) {
        return getAddressStateSchema.parse(params);
    }

    getAddressStateResponse(response: GetAddressStateResponse) {
        return getAddressStateResponseSchema.parse(response);
    }

    fetchBalance(params: FetchBalance) {
        return fetchBalanceSchema.parse(params);
    }

    fetchBalanceResponse(response: FetchBalanceResponse) {
        return fetchBalanceResponseSchema.parse(response);
    }

    systemConfig(params: SystemConfig) {
        return systemConfigSchema.parse(params);
    }

    systemConfigResponse(response: SystemConfigResponse) {
        return systemConfigResponseSchema.parse(response);
    }

    getCustomers(params: GetCustomers) {
        return getCustomersSchema.parse(params);
    }

    getCustomersResponse(response: GetCustomersResponse) {
        return getCustomerResponseSchema.parse(response);
    }

    deploy(params: Deploy) {
        return deploySchema.parse(params);
    }

    deployResponse(response: DeployResponse) {
        return deployResponseSchema.parse(response);
    }

    registerPayload(payload: RegisterPayload) {
        return registerPayloadSchema.parse(payload);
    }

    registerResponse(response: RegisterResponse) {
        return registerResponseSchema.parse(response);
    }

    createRequest(params: CreateRequest) {
        return createRequestSchema.parse(params);
    }

    createRequestResponse(response: CreateRequestResponse) {
        return createRequestResponseSchema.parse(response);
    }

    updateRequest(params: UpdateRequest) {
        return updateRequestSchema.parse(params);
    }

    updateRequestResponse(response: UpdateRequestResponse) {
        return updateRequestResponseSchema.parse(response);
    }

    getRequest(params: GetRequest) {
        return getRequestSchema.parse(params);
    }

    getRequestResponse(response: GetRequestResponse) {
        return getRequestResponseSchema.parse(response);
    }

    syncTransaction(params: SyncTransaction) {
        return syncTransactionSchema.parse(params);
    }

    syncTransactionResponse(response: SyncTransactionResponse) {
        return syncTransactionResponse.parse(response);
    }

    triggerSyncForAddresses(params: TriggerSyncForAddresses) {
        return triggerSyncForAddressesSchema.parse(params);
    }

    triggerSyncForAddressesResponse(response: TriggerSyncForAddressesResponse) {
        return triggerSyncForAddressesResponseSchema.parse(response);
    }

    transfer(params: Transfer) {
        return transferSchema.parse(params);
    }

    transferResponse(response: TransferResponse) {
        return transferResponseSchema.parse(response);
    }

    getUnspentUTXOs(params: GetUnspentUTXOs) {
        return getUnspentUTXOs.parse(params);
    }

    getUnspentUTXOResponse(response: GetUnspentUTXOResponse) {
        return getUnspentUTXOResponse.parse(response);
    }

    getOutputInfo(params: GetOutputInfo) {
        return getOutputInfoSchema.parse(params);
    }

    getOutputInfoResponse(response: GetOutputInfoResponse) {
        return getOutputInfoResponse.parse(response);
    }
}
