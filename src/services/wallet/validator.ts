import {
    createWalletSchema,
    createBSVWalletSchema,
    updateDefaultWalletSchema,
    walletAddressSchema,
    walletAddressListResponseSchema,
    createWalletResponseSchema,
    walletListResponseSchema,
    updateDefaultWalletResponseSchema,
    createAddressResponseSchema,
    syncAssetSchema,
    availableAssetsSchema,
    walletAssetActionSchema,
    recoverWalletSchema,
    transactionsSchema,
    transactionDetailsSchema,
    importAssetSchema,
    availableAssetsResponseSchema,
    transactionsResponseSchema,
    transactionDetailsResponseSchema,
    syncAssetResponseSchema,
    importAssetResponseSchema,
} from './schema.js';
import { normalizeTransactionsResponse } from '../../utils/schema/normalize.js';
import type {
    CreateWalletBody,
    CreateBSVWalletBody,
    UpdateDefaultWalletBody,
    CreateWalletReponse,
    WalletListResponse,
    UpdateDefaultWalletResponse,
    CreateAddressResponse,
    WalletAddressBody,
    WalletAddressListResponse,
    SyncAsset,
    SyncAssetResponse,
    AvailableAssets,
    AvailableAssetsResponse,
    WalletAssetAction,
    RecoverWallet,
    Transactions,
    TransactionsResponse,
    TransactionDetails,
    TransactionDetailsResponse,
    ImportAsset,
    ImportAssetResponse,
} from './types.js';

export default class Validator {
    createWallet(options: CreateWalletBody) {
        return createWalletSchema.parse(options);
    }

    createBSVWallet(options: CreateBSVWalletBody) {
        return createBSVWalletSchema.parse(options);
    }

    createWalletResponse(options: CreateWalletReponse) {
        return createWalletResponseSchema.parse(options);
    }

    updateDefaultWallet(options: UpdateDefaultWalletBody) {
        return updateDefaultWalletSchema.parse(options);
    }

    updateDefaultWalletResponse(options: UpdateDefaultWalletResponse) {
        return updateDefaultWalletResponseSchema.parse(options);
    }

    walletListResponse(options: WalletListResponse) {
        return walletListResponseSchema.parse(options);
    }

    walletAddress(options: WalletAddressBody) {
        return walletAddressSchema.parse(options);
    }

    createAddressResponse(options: CreateAddressResponse) {
        return createAddressResponseSchema.parse(options);
    }

    walletAddressListResponse(options: WalletAddressListResponse) {
        return walletAddressListResponseSchema.parse(options);
    }

    syncAsset(options: SyncAsset) {
        return syncAssetSchema.parse(options);
    }

    syncAssetResponse(options: SyncAssetResponse) {
        return syncAssetResponseSchema.parse(options);
    }

    availableAssets(options?: AvailableAssets) {
        if (options) availableAssetsSchema.parse(options);
    }

    availableAssetsResponse(options: AvailableAssetsResponse) {
        return availableAssetsResponseSchema.parse(options);
    }

    walletAssetAction(options: WalletAssetAction) {
        return walletAssetActionSchema.parse(options);
    }

    recoverWallet(options: RecoverWallet) {
        return recoverWalletSchema.parse(options);
    }

    transactions(options: Transactions) {
        return transactionsSchema.parse(options);
    }

    transactionsResponse(options: TransactionsResponse) {
        return transactionsResponseSchema.parse(normalizeTransactionsResponse(options));
    }

    transactionDetails(options: TransactionDetails) {
        return transactionDetailsSchema.parse(options);
    }

    transactionDetailsResponse(options: TransactionDetailsResponse) {
        return transactionDetailsResponseSchema.parse(options);
    }

    importAsset(options: ImportAsset) {
        return importAssetSchema.parse(options);
    }

    importAssetResponse(options: ImportAssetResponse) {
        return importAssetResponseSchema.parse(options);
    }
}
