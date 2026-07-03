import {
    getAddressStateSchema,
    getAddressStateResponseSchema,
    fetchBalanceSchema,
    fetchBalanceResponseSchema,
    systemConfigSchema,
    systemConfigResponseSchema,
    updateSystemConfigSchema,
    updateSystemConfigResponseSchema,
    getCustomersSchema,
    getCustomerResponseSchema,
    deploySchema,
    deployResponseSchema,
    registerSchema,
    registerResponseSchema,
    createRequestSchema,
    createRequestResponseSchema,
    updateRequestSchema,
    updateRequestResponseSchema,
    getRequestSchema,
    getRequestResponseSchema,
    syncTransactionSchema,
    syncTransactionResponseSchema,
    listSyncedTransactionsSchema,
    listSyncedTransactionsResponseSchema,
    triggerSyncForAddressesSchema,
    triggerSyncForAddressesResponseSchema,
    transferSchema,
    transferResponseSchema,
    getUnspentUTXOsSchema,
    getUnspentUTXOsResponseSchema,
    getOutputInfoSchema,
    getOutputInfoResponseSchema,
    getAnalyticsSchema,
    getAnalyticsResponseSchema,
    listDeployedAssetsSchema,
    listDeployedAssetsResponseSchema,
} from './schema.js';
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
    UpdateRequest,
    UpdateRequestResponse,
    GetRequest,
    GetRequestResponse,
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

    updateSystemConfig(params: UpdateSystemConfig) {
        return updateSystemConfigSchema.parse(params);
    }

    updateSystemConfigResponse(response: UpdateSystemConfigResponse) {
        return updateSystemConfigResponseSchema.parse(response);
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

    register(params: Register) {
        return registerSchema.parse(params);
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
        return syncTransactionResponseSchema.parse(response);
    }

    listSyncedTransactions(params: ListSyncedTransactions) {
        return listSyncedTransactionsSchema.parse(params);
    }

    listSyncedTransactionsResponse(response: ListSyncedTransactionsResponse) {
        return listSyncedTransactionsResponseSchema.parse(response);
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
        return getUnspentUTXOsSchema.parse(params);
    }

    getUnspentUTXOResponse(response: GetUnspentUTXOResponse) {
        return getUnspentUTXOsResponseSchema.parse(response);
    }

    getOutputInfo(params: GetOutputInfo) {
        return getOutputInfoSchema.parse(params);
    }

    getOutputInfoResponse(response: GetOutputInfoResponse) {
        return getOutputInfoResponseSchema.parse(response);
    }

    getAnalytics(params: GetAnalytics) {
        return getAnalyticsSchema.parse(params);
    }

    getAnalyticsResponse(response: GetAnalyticsResponse) {
        return getAnalyticsResponseSchema.parse(response);
    }

    listDeployedAssets(params: ListDeployedAssets) {
        return listDeployedAssetsSchema.parse(params);
    }

    listDeployedAssetsResponse(response: ListDeployedAssetsResponse) {
        return listDeployedAssetsResponseSchema.parse(response);
    }
}
