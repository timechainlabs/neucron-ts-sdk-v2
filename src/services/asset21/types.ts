import type { z } from 'zod';
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
    registerBodySchema,
    transferBodySchema,
    requestDetailsSchema,
} from './schema.js';

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type Register = z.infer<typeof registerSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type GetAddressState = z.infer<typeof getAddressStateSchema>;
export type GetAddressStateResponse = z.infer<typeof getAddressStateResponseSchema>;
export type FetchBalance = z.infer<typeof fetchBalanceSchema>;
export type FetchBalanceResponse = z.infer<typeof fetchBalanceResponseSchema>;
export type SystemConfig = z.infer<typeof systemConfigSchema>;
export type SystemConfigResponse = z.infer<typeof systemConfigResponseSchema>;
export type UpdateSystemConfig = z.infer<typeof updateSystemConfigSchema>;
export type UpdateSystemConfigResponse = z.infer<typeof updateSystemConfigResponseSchema>;
export type GetCustomers = z.infer<typeof getCustomersSchema>;
export type GetCustomersResponse = z.infer<typeof getCustomerResponseSchema>;
export type Deploy = z.infer<typeof deploySchema>;
export type DeployResponse = z.infer<typeof deployResponseSchema>;
export type RequestDetails = z.infer<typeof requestDetailsSchema>;
export type CreateRequest = z.infer<typeof createRequestSchema>;
export type CreateRequestResponse = z.infer<typeof createRequestResponseSchema>;
export type UpdateRequest = z.infer<typeof updateRequestSchema>;
export type UpdateRequestResponse = z.infer<typeof updateRequestResponseSchema>;
export type GetRequest = z.infer<typeof getRequestSchema>;
export type GetRequestResponse = z.infer<typeof getRequestResponseSchema>;
export type SyncTransaction = z.infer<typeof syncTransactionSchema>;
export type SyncTransactionResponse = z.infer<typeof syncTransactionResponseSchema>;
export type ListSyncedTransactions = z.infer<typeof listSyncedTransactionsSchema>;
export type ListSyncedTransactionsResponse = z.infer<typeof listSyncedTransactionsResponseSchema>;
export type TriggerSyncForAddresses = z.infer<typeof triggerSyncForAddressesSchema>;
export type TriggerSyncForAddressesResponse = z.infer<typeof triggerSyncForAddressesResponseSchema>;
export type TransferBody = z.infer<typeof transferBodySchema>;
export type Transfer = z.infer<typeof transferSchema>;
export type TransferResponse = z.infer<typeof transferResponseSchema>;
export type GetUnspentUTXOs = z.infer<typeof getUnspentUTXOsSchema>;
export type GetUnspentUTXOResponse = z.infer<typeof getUnspentUTXOsResponseSchema>;
export type GetOutputInfo = z.infer<typeof getOutputInfoSchema>;
export type GetOutputInfoResponse = z.infer<typeof getOutputInfoResponseSchema>;
export type GetAnalytics = z.infer<typeof getAnalyticsSchema>;
export type GetAnalyticsResponse = z.infer<typeof getAnalyticsResponseSchema>;
export type ListDeployedAssets = z.infer<typeof listDeployedAssetsSchema>;
export type ListDeployedAssetsResponse = z.infer<typeof listDeployedAssetsResponseSchema>;

/** @deprecated Use `Register` instead */
export type RegisterPayload = Register;
