import { z } from 'zod';

export const createWalletSchema = z.object({
    walletName: z.string().min(1),
    paymailName: z.string().min(1),
});

export const createPaymailSchema = z.object({
    walletID: z.string().min(1),
    paymailName: z.string().min(1),
});

export const paymailListSchema = z.object({
    walletID: z.string().min(1),
});
