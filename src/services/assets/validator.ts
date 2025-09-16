import {
    createAssetSchema,
    transferAssetSchema,
    mintAssetSchema,
    redeemAssetSchema,
    ledgerListSchema,
    assetListSchema,
    updateAssetSchema,
    assetDeleteSchema,
    assetDeleteResponseSchema,
    assetDetailsSchema,
    assetDetailsResponseSchema,
    assetStatsResponseSchema,
    ledgerListResponseSchema,
    assetListResponseSchema,
    updateAssetResponseSchema,
    createAssetResponseSchema,
    redeemAssetResponseSchema,
    ledgerDetailsSchema,
    ledgerDetailsResponseSchema,
    mintAssetResponseSchema,
    transferAssetResponseSchema,
} from './schema.js';
import type {
    TransferAsset,
    CreateAsset,
    CreateAssetResponse,
    MintAsset,
    RedeemAsset,
    UpdateAsset,
    UpdateAssetResponse,
    AssetDelete,
    AssetDeleteResponse,
    LedgerList,
    AssetList,
    AssetStatsResponse,
    LedgerListResponse,
    RedeemAssetResponse,
    AssetListResponse,
    MintAssetResponse,
    TransferAssetResponse,
    LedgerDetails,
    LedgerDetailsResponse,
    AssetDetailsResponse,
    AssetDetails,
} from './types.js';

export default class Validator {
    createAsset(asset: CreateAsset) {
        return createAssetSchema.parse(asset);
    }
    createAssetResponse(asset: CreateAssetResponse) {
        return createAssetResponseSchema.parse(asset);
    }
    updateAsset(asset: UpdateAsset) {
        return updateAssetSchema.parse(asset);
    }
    updateAssetResponse(asset: UpdateAssetResponse) {
        return updateAssetResponseSchema.parse(asset);
    }
    assetDetails(asset: AssetDetails) {
        return assetDetailsSchema.parse(asset);
    }
    assetDetailsResponse(asset: AssetDetailsResponse) {
        return assetDetailsResponseSchema.parse(asset);
    }
    deleteAsset(asset: AssetDelete) {
        return assetDeleteSchema.parse(asset);
    }
    deleteAssetResponse(asset: AssetDeleteResponse) {
        return assetDeleteResponseSchema.parse(asset);
    }
    mintAsset(options: MintAsset) {
        return mintAssetSchema.parse(options);
    }
    mintAssetResponse(asset: MintAssetResponse) {
        return mintAssetResponseSchema.parse(asset);
    }
    transferAsset(options: TransferAsset) {
        return transferAssetSchema.parse(options);
    }
    transferAssetResponse(asset: TransferAssetResponse) {
        return transferAssetResponseSchema.parse(asset);
    }
    redeemAsset(asset: RedeemAsset) {
        return redeemAssetSchema.parse(asset);
    }
    redeemAssetResponse(asset: RedeemAssetResponse) {
        return redeemAssetResponseSchema.parse(asset);
    }
    ledgerList(options: LedgerList) {
        return ledgerListSchema.parse(options);
    }
    ledgerListResponse(asset: LedgerListResponse) {
        return ledgerListResponseSchema.parse(asset);
    }
    assetList(options?: AssetList) {
        if (options) {
            return assetListSchema.parse(options);
        }
    }
    assetListResponse(asset: AssetListResponse) {
        return assetListResponseSchema.parse(asset);
    }
    assetStatsResponse(asset: AssetStatsResponse) {
        return assetStatsResponseSchema.parse(asset);
    }
    ledgerDetails(asset: LedgerDetails) {
        return ledgerDetailsSchema.parse(asset);
    }
    ledgerDetailsResponse(asset: LedgerDetailsResponse) {
        return ledgerDetailsResponseSchema.parse(asset);
    }
}
