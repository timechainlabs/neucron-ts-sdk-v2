import { z } from 'zod';
import { uploadableFileSchema } from '../../utils/schema/common.js';

export const fileUploadSchema = z.object({
    walletID: z.string().min(1).optional(),
    file: uploadableFileSchema,
});

export const fileUploadResponseSchema = z.object({
    txid: z.string().min(1),
});

export const textUploadSchema = z.object({
    hashed: z.string().min(1),
    walletID: z.string().min(1).optional(),
    text: z.string().min(1),
});

export const textUploadResponseSchema = z.object({
    txid: z.string().min(1),
});
