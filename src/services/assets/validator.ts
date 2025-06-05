import {
    createAssetSchema,
    transferAssetSchema,
    mintAssetSchema,
    mergeAssetSchema,
    redeemAssetSchema,
    getLedgerListSchema,
    getAssetListSchema,
    updateAssetSchema,
} from './schema.js';
import {
    TransferAsset,
    CreateAsset,
    MintAsset,
    MergeAsset,
    RedeemAsset,
    GetLedgerList,
    GetAssetList,
    UpdateAsset,
} from './types.js';

export default class Validator {
    createAsset(asset: CreateAsset) {
        return createAssetSchema.parse(asset);
    }
    updateAsset(asset: UpdateAsset) {
        return updateAssetSchema.parse(asset);
    }
    mintAsset(options: MintAsset) {
        return mintAssetSchema.parse(options);
    }
    transferAsset(options: TransferAsset) {
        return transferAssetSchema.parse(options);
    }
    mergeAsset(asset: MergeAsset) {
        return mergeAssetSchema.parse(asset);
    }
    redeemAsset(asset: RedeemAsset) {
        return redeemAssetSchema.parse(asset);
    }
    ledgerList(options: GetLedgerList) {
        return getLedgerListSchema.parse(options);
    }

    assetList(options?: GetAssetList) {
        if (options) {
            return getAssetListSchema.parse(options);
        }
    }
}
