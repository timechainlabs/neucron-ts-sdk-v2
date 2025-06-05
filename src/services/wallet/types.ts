import { z } from 'zod';
import { createPaymailSchema, createWalletSchema, paymailListSchema } from './schema.js';

export type CreateWalletBody = z.infer<typeof createWalletSchema>;
export type CreateWalletReponse = {
    paymail_id: string;
    wallet_id: string;
};

export type ListWalletsResponse = {
    wallet_id: string;
    wallet_name: string;
    x_pub: string;
    user_id: string;
    paymail_id: string;
    is_default: boolean;
}[];

type paymailDTO = {
    id: string;
    paymail_id: string;
    xpub_id: string;
    alias: string;
    domain: string;
    user_id: string;
    wallet_id: string;
    is_wallet_default: boolean;
    external_xpub_key: string;
    external_xpub_num: number;
};

export type CreatePaymailBody = z.infer<typeof createPaymailSchema>;
export type CreatePaymailResponse = paymailDTO;

export type PayamailListBody = z.infer<typeof paymailListSchema>;
export type PaymailListResponse = paymailDTO[];
