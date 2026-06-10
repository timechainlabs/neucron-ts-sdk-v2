import { z } from 'zod';
import { businessIdSchema } from '../../utils/schema/common.js';

export const uploadDocumentSchema = businessIdSchema.extend({
    file: z.instanceof(Blob),
});

export const uploadDocumentResponseSchema = z.object({
    url: z.string().optional(),
});
