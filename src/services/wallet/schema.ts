import { z } from 'zod';
import { businessIdSchema, networkEnum, pageMetaSchema } from '../../utils/schema/common.js';

const nonEmptyStringLocal = z.string().min(1);
const id = nonEmptyStringLocal;
const message = nonEmptyStringLocal;

const walletIDSchema = z.object({
    walletID: id,
});

const responseMessageSchema = z.object({
    message,
});

export const createWalletSchema = z.object({
    walletName: id,
    paymailName: id.optional(),
    walletType: id.optional(),
    custodianProvider: z.string().optional(),
    customCustodianEndpoint: z.string().optional(),
    provider: z.string().optional(),
    businessId: z.string().optional(),
});

export const createBSVWalletSchema = businessIdSchema.extend({
    walletName: id,
});

export const updateDefaultWalletSchema = walletIDSchema.extend({
    businessId: z.string().optional(),
});

export const walletAddressSchema = z.object({
    walletID: id.optional(),
    network: networkEnum.optional(),
    businessId: z.string().optional(),
});

export const syncAssetSchema = walletIDSchema.extend({
    network: networkEnum,
    businessId: z.string().optional(),
});

export const availableAssetsSchema = businessIdSchema.extend({
    walletID: z.string().optional(),
    offset: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
    chain: z.string().optional(),
    network: networkEnum.optional(),
});

export const walletAssetActionSchema = businessIdSchema.extend({
    walletID: id,
    assetID: id,
});

export const recoverWalletSchema = businessIdSchema.extend({
    walletID: id,
    keyshard: id,
});

export const transactionsSchema = businessIdSchema.extend({
    walletID: id,
    page: z.number().min(1),
    limit: z.number().min(1),
    chain: z.string().optional(),
    network: networkEnum.optional(),
});

export const transactionDetailsSchema = businessIdSchema.extend({
    txid: id,
    chain: id,
    network: networkEnum,
    walletID: id,
});

export const importAssetSchema = businessIdSchema.extend({
    asset_name: id,
    chain: id,
    contract_address: id,
    network: id,
    symbol: id,
    wallet_id: id,
    decimals: z.number(),
});

export const notificationListSchema = businessIdSchema.extend({
    state: z.string().optional(),
    pageNumber: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).optional(),
});

export const markNotificationsReadSchema = z.object({
    notificationIds: z.array(id).min(1),
});

export const notificationSchema = z
    .object({
        notification_id: z.string().optional(),
        title: z.string().optional(),
        message: z.string().optional(),
        type: z.string().optional(),
        state: z.string().optional(),
        created_at: z.string().optional(),
    })
    .passthrough();

export const notificationListResponseSchema = z
    .object({
        notifications: z.array(notificationSchema).optional(),
        list: z.array(notificationSchema).optional(),
    })
    .passthrough();

export const markNotificationsReadResponseSchema = z
    .object({
        message: z.string().optional(),
    })
    .passthrough();

export const createWalletResponseSchema = z.object({
    wallet_id: id.optional(),
    paymail_id: id.optional(),
    message: z.string().optional(),
});

export const walletListResponseSchema = z.array(
    z.object({
        wallet_id: id,
        wallet_name: nonEmptyStringLocal,
        paymail_id: z.string().optional(),
        is_default: z.boolean().optional(),
        paymail_alias: z.string().optional(),
        provider: z.string().optional(),
        wallet_type: z.string().optional(),
        user_id: z.string().optional(),
        neucron_cloud_status: z.string().optional(),
        neucron_cloud_synced: z.boolean().optional(),
        cloud_sync_status: z.string().optional(),
        cloud_synced: z.boolean().optional(),
        cloud_backup_status: z.string().optional(),
        cloud_backup_synced: z.boolean().optional(),
        backup_status: z.string().optional(),
        backup_synced: z.boolean().optional(),
    })
);

export const updateDefaultWalletResponseSchema = responseMessageSchema;

export const createAddressResponseSchema = responseMessageSchema;

export const walletAddressListResponseSchema = z.array(
    z.object({
        wallet_id: z.string(),
        address: z.string(),
        chain: z.string(),
    })
);

export const availableAssetsResponseSchema = z.object({
    list: z.array(z.record(z.string(), z.unknown())),
});

export const transactionsResponseSchema = z.object({
    list: z.array(z.record(z.string(), z.unknown())).default([]),
    page_meta: pageMetaSchema,
});

export const transactionDetailsResponseSchema = z.record(z.string(), z.unknown());
export const syncAssetResponseSchema = z.record(z.string(), z.unknown());
export const importAssetResponseSchema = z.record(z.string(), z.unknown());
