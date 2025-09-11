import {
    createWalletSchema,
    updateDefaultWalletSchema,
    walletAddressSchema,
    walletAddressListResponseSchema,
    createWalletResponseSchema,
    walletListResponseSchema,
    updateDefaultWalletResponseSchema,
    createAddressResponseSchema,
} from './schema.js';
import type {
    CreateWalletBody,
    UpdateDefaultWalletBody,
    CreateWalletReponse,
    WalletListResponse,
    UpdateDefaultWalletResponse,
    CreateAddressResponse,
    WalletAddressBody,
    WalletAddressListResponse,
} from './types.js';

export default class Validator {
    createWallet(options: CreateWalletBody) {
        return createWalletSchema.parse(options);
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
}
