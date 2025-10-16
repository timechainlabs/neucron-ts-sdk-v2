import type { z } from 'zod';
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

export type GetAddressState = z.infer<typeof getAddressStateSchema>;
export type GetAddressStateResponse = z.infer<typeof getAddressStateResponseSchema>;
export type FetchBalance = z.infer<typeof fetchBalanceSchema>;
export type FetchBalanceResponse = z.infer<typeof fetchBalanceResponseSchema>;
export type SystemConfig = z.infer<typeof systemConfigSchema>;
export type SystemConfigResponse = z.infer<typeof systemConfigResponseSchema>;
export type GetCustomers = z.infer<typeof getCustomersSchema>;
export type GetCustomersResponse = z.infer<typeof getCustomerResponseSchema>;
export type Deploy = z.infer<typeof deploySchema>;
export type DeployResponse = z.infer<typeof deployResponseSchema>;
export type RegisterPayload = z.infer<typeof registerPayloadSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type CreateRequest = z.infer<typeof createRequestSchema>;
export type CreateRequestResponse = z.infer<typeof createRequestResponseSchema>;
export type UpdateRequest = z.infer<typeof updateRequestSchema>;
export type UpdateRequestResponse = z.infer<typeof updateRequestResponseSchema>;
export type GetRequest = z.infer<typeof getRequestSchema>;
export type GetRequestResponse = z.infer<typeof getRequestResponseSchema>;
export type SyncTransaction = z.infer<typeof syncTransactionSchema>;
export type SyncTransactionResponse = z.infer<typeof syncTransactionResponse>;
export type TriggerSyncForAddresses = z.infer<typeof triggerSyncForAddressesSchema>;
export type TriggerSyncForAddressesResponse = z.infer<typeof triggerSyncForAddressesResponseSchema>;
export type Transfer = z.infer<typeof transferSchema>;
export type TransferResponse = z.infer<typeof transferResponseSchema>;
export type GetUnspentUTXOs = z.infer<typeof getUnspentUTXOs>;
export type GetUnspentUTXOResponse = z.infer<typeof getUnspentUTXOResponse>;
export type GetOutputInfo = z.infer<typeof getOutputInfoSchema>;
export type GetOutputInfoResponse = z.infer<typeof getOutputInfoResponse>;
