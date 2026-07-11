import { z } from 'zod';
import { businessIdSchema, uploadableFileSchema } from '../../utils/schema/common.js';

export const dataIntegrityNetworkEnum = z.enum(['MAIN', 'TEST']);

export const dataIntegrityContextSchema = businessIdSchema.extend({
    appSecret: z.string().optional(),
    network: dataIntegrityNetworkEnum.optional(),
});

export const fileUploadSchema = dataIntegrityContextSchema.extend({
    walletID: z.string().min(1).optional(),
    file: uploadableFileSchema,
});

export const textUploadSchema = dataIntegrityContextSchema.extend({
    hashed: z.string().min(1),
    walletID: z.string().min(1).optional(),
    text: z.string().min(1),
});

export const textArrayUploadSchema = dataIntegrityContextSchema.extend({
    walletID: z.string().min(1).optional(),
    text: z.array(z.string().min(1)).min(1),
});

export const dataIntegrityResponseSchema = z
    .object({
        txID: z.string().optional(),
        txid: z.string().optional(),
    })
    .passthrough();
