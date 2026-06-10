import { z } from 'zod';
import { businessIdSchema, messageResponseSchema, nonEmptyString, networkEnum } from '../../utils/schema/common.js';

export const swappableAssetEntrySchema = z.object({
    asset_name: z.string(),
    asset_network: z.string(),
});

export const swappableAssetsResponseSchema = z.object({
    from: z.array(swappableAssetEntrySchema),
    to: z.array(swappableAssetEntrySchema),
});

export const swapAssetsRequestSchema = z.object({
    amount: z.number(),
    from_asset_name: nonEmptyString,
    from_network_name: nonEmptyString,
    to_asset_name: nonEmptyString,
    to_network_name: nonEmptyString,
});

export const swapAssetsSchema = businessIdSchema.extend({
    walletID: nonEmptyString,
    payload: swapAssetsRequestSchema,
});

export const swapAssetsResponseSchema = messageResponseSchema;

export const swapRateSchema = businessIdSchema.extend({
    payload: swapAssetsRequestSchema,
});

export const swapRateResponseSchema = z.object({
    maximum_amount: z.number(),
    minimum_amount: z.number(),
    rate: z.number(),
    requested_amount: z.number(),
    swapped_amount: z.number(),
});

export { networkEnum };
