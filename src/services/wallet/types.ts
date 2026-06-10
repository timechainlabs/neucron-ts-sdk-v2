import type { z } from 'zod';
import {
    createWalletResponseSchema,
    createWalletSchema,
    createBSVWalletSchema,
    updateDefaultWalletSchema,
    updateDefaultWalletResponseSchema,
    walletListResponseSchema,
    walletAddressSchema,
    createAddressResponseSchema,
    walletAddressListResponseSchema,
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

export type CreateWalletBody = z.infer<typeof createWalletSchema>;
export type CreateBSVWalletBody = z.infer<typeof createBSVWalletSchema>;
export type CreateWalletReponse = z.infer<typeof createWalletResponseSchema>;
export type WalletListResponse = z.infer<typeof walletListResponseSchema>;
export type UpdateDefaultWalletBody = z.infer<typeof updateDefaultWalletSchema>;
export type UpdateDefaultWalletResponse = z.infer<typeof updateDefaultWalletResponseSchema>;
export type WalletAddressBody = z.infer<typeof walletAddressSchema>;
export type CreateAddressResponse = z.infer<typeof createAddressResponseSchema>;
export type WalletAddressListResponse = z.infer<typeof walletAddressListResponseSchema>;
export type SyncAsset = z.infer<typeof syncAssetSchema>;
export type SyncAssetResponse = z.infer<typeof syncAssetResponseSchema>;
export type AvailableAssets = z.infer<typeof availableAssetsSchema>;
export type AvailableAssetsResponse = z.infer<typeof availableAssetsResponseSchema>;
export type WalletAssetAction = z.infer<typeof walletAssetActionSchema>;
export type RecoverWallet = z.infer<typeof recoverWalletSchema>;
export type Transactions = z.infer<typeof transactionsSchema>;
export type TransactionsResponse = z.infer<typeof transactionsResponseSchema>;
export type TransactionDetails = z.infer<typeof transactionDetailsSchema>;
export type TransactionDetailsResponse = z.infer<typeof transactionDetailsResponseSchema>;
export type ImportAsset = z.infer<typeof importAssetSchema>;
export type ImportAssetResponse = z.infer<typeof importAssetResponseSchema>;
