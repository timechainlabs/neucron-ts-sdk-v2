import z from 'zod';
import {
    createAssetSchema,
    getAssetListSchema,
    getLedgerListSchema,
    mergeAssetSchema,
    mintAssetSchema,
    redeemAssetSchema,
    transferAssetSchema,
    updateAssetSchema,
} from './schema.js';

export type CreateAsset = z.infer<typeof createAssetSchema>;
export type CreateAssetResponse = { assetID: string };

export type UpdateAsset = z.infer<typeof updateAssetSchema>;
export type UpdateAssetResponse = { message: string };

export type MintAsset = z.infer<typeof mintAssetSchema>;
export type MintAssetResponse = unknown;

export type TransferAsset = z.infer<typeof transferAssetSchema>;
export type TransferAssetResponse = unknown;

export type MergeAsset = z.infer<typeof mergeAssetSchema>;
export type MergeAssetResponse = unknown;

export type RedeemAsset = z.infer<typeof redeemAssetSchema>;
export type RedeemAssetResponse = unknown;

export type GetLedgerList = z.infer<typeof getLedgerListSchema>;
export type GetLedgerListResponse = unknown;

export type GetAssetList = z.infer<typeof getAssetListSchema>;
export type GetAssetListResponse = unknown;
