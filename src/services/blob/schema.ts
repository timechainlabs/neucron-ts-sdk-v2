import { z } from 'zod';
import { businessIdSchema, uploadableFileSchema } from '../../utils/schema/common.js';

export const uploadDocumentSchema = businessIdSchema.extend({
    file: uploadableFileSchema,
});

export const uploadDocumentResponseSchema = z.object({
    url: z.string().optional(),
});
