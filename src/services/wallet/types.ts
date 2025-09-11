import type { z } from 'zod';
import {
    createWalletResponseSchema,
    createWalletSchema,
    updateDefaultWalletSchema,
    updateDefaultWalletResponseSchema,
    walletListResponseSchema,
    walletAddressSchema,
    createAddressResponseSchema,
    walletAddressListResponseSchema,
} from './schema.js';

export type CreateWalletBody = z.infer<typeof createWalletSchema>;
export type CreateWalletReponse = z.infer<typeof createWalletResponseSchema>;
export type WalletListResponse = z.infer<typeof walletListResponseSchema>;
export type UpdateDefaultWalletBody = z.infer<typeof updateDefaultWalletSchema>;
export type UpdateDefaultWalletResponse = z.infer<typeof updateDefaultWalletResponseSchema>;
export type WalletAddressBody = z.infer<typeof walletAddressSchema>;
export type CreateAddressResponse = z.infer<typeof createAddressResponseSchema>;
export type WalletAddressListResponse = z.infer<typeof walletAddressListResponseSchema>;
