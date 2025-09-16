import z from 'zod';

const basePaySchema = z.object({
    walletID: z.string().optional(),
    assetId: z.string().min(1, 'assetId is required'),
    amount: z.number().int().min(1, 'Amount must be greater than 0'),
});

export const payWithAddressSchema = basePaySchema.extend({
    to: z.object({
        type: z.literal('address'),
        value: z.string().min(1, 'Address is required'),
    }),
});

export const payWithEmailSchema = basePaySchema.extend({
    to: z.object({
        type: z.literal('email'),
        value: z.string().email('Enter a valid email'),
    }),
});

export const payWithPaymailSchema = basePaySchema.extend({
    to: z.object({
        type: z.literal('paymail'),
        value: z.string().min(1, 'Paymail is required'),
    }),
});

export const payResponseSchema = z.object({
    txid: z.string().min(1),
});
