import z from 'zod';

const basePaySchema = z.object({
    walletID: z.string().optional(),
    payBody: z.object({
        satoshis: z.number().int().min(1),
    }),
});

export const payWithAddressSchema = basePaySchema.extend({
    payBody: basePaySchema.shape.payBody.extend({
        address: z.string().min(1),
    }),
});

export const payWithEmailSchema = basePaySchema.extend({
    payBody: basePaySchema.shape.payBody.extend({
        email: z.string().email(),
    }),
});

export const payWithPaymailSchema = basePaySchema.extend({
    payBody: basePaySchema.shape.payBody.extend({
        paymail: z.string().min(1),
    }),
});

export const payResponseSchema = z.object({
    txid: z.string().min(1),
});
