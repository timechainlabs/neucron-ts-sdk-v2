import z from 'zod';
import {
    createAssetSchema,
    createAssetResponseSchema,
    updateAssetSchema,
    updateAssetResponseSchema,
    assetListSchema,
    ledgerListSchema,
    mergeAssetSchema,
    mintAssetSchema,
    redeemAssetSchema,
    transferAssetSchema,
    redeemAssetResponseSchema,
    mergeAssetResponseSchema,
    mintAssetResponseSchema,
    transferAssetResponseSchema,
    assetDetailsSchema,
    assetDetailsResponseSchema,
    assetDeleteSchema,
    assetDeleteResponseSchema,
    assetStatsResponseSchema,
    ledgerListResponseSchema,
    assetListResponseSchema,
    ledgerDetailsSchema,
    ledgerDetailsResponseSchema,
} from './schema.js';

export type CreateAsset = z.infer<typeof createAssetSchema>;
export type CreateAssetResponse = z.infer<typeof createAssetResponseSchema>;

export type UpdateAsset = z.infer<typeof updateAssetSchema>;
export type UpdateAssetResponse = z.infer<typeof updateAssetResponseSchema>;

export type AssetDetails = z.infer<typeof assetDetailsSchema>;
export type AssetDetailsResponse = z.infer<typeof assetDetailsResponseSchema>;

export type AssetDelete = z.infer<typeof assetDeleteSchema>;
export type AssetDeleteResponse = z.infer<typeof assetDeleteResponseSchema>;

export type MintAsset = z.infer<typeof mintAssetSchema>;
export type MintAssetResponse = z.infer<typeof mintAssetResponseSchema>;

export type TransferAsset = z.infer<typeof transferAssetSchema>;
export type TransferAssetResponse = z.infer<typeof transferAssetResponseSchema>;

export type MergeAsset = z.infer<typeof mergeAssetSchema>;
export type MergeAssetResponse = z.infer<typeof mergeAssetResponseSchema>;

export type RedeemAsset = z.infer<typeof redeemAssetSchema>;
export type RedeemAssetResponse = z.infer<typeof redeemAssetResponseSchema>;

export type LedgerList = z.infer<typeof ledgerListSchema>;
export type LedgerListResponse = z.infer<typeof ledgerListResponseSchema>;

export type AssetList = z.infer<typeof assetListSchema>;
export type AssetListResponse = z.infer<typeof assetListResponseSchema>;

export type LedgerDetails = z.infer<typeof ledgerDetailsSchema>;
export type LedgerDetailsResponse = z.infer<typeof ledgerDetailsResponseSchema>;

export type AssetStatsResponse = z.infer<typeof assetStatsResponseSchema>;
