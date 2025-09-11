import { z } from 'zod';

const nonEmptyString = z.string().min(1);
const responseMessageSchema = z.object({
    message: nonEmptyString,
});

export const createPaymailSchema = z.object({
    walletID: nonEmptyString.optional(),
    paymailName: nonEmptyString,
});

export const createPaymailResponseSchema = responseMessageSchema;

export const paymailListSchema = z.object({
    walletID: nonEmptyString.optional(),
});

export const paymailListResponseSchema = z.array(
    z.object({
        is_wallet_default: z.boolean(),
        alias: nonEmptyString,
        wallet_id: nonEmptyString,
    })
);

export const updateDefaultPaymailSchema = z.object({
    alias: nonEmptyString,
    walletID: nonEmptyString.optional(),
});

export const updateDefaultPaymailResponseSchema = responseMessageSchema;

export const deletePaymailSchema = z.object({
    alias: nonEmptyString,
});

export const deletePaymailResponseSchema = responseMessageSchema;
