import { z } from 'zod';

export const fileUploadSchema = z.object({
    walletID: z.string().min(1).optional(),
    file: z.instanceof(File),
});

export const fileUploadResponseSchema = z.object({
    txID: z.string().min(1),
});

export const textUploadSchema = z.object({
    hashed: z.string().min(1),
    walletID: z.string().min(1).optional(),
    text: z.string().min(1),
});

export const textUploadResponseSchema = z.object({
    txID: z.string().min(1),
});
