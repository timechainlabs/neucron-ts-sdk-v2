import type { z } from 'zod';
import {
    uploadDocumentSchema,
    uploadImageSchema,
    uploadDocumentResponseSchema,
    uploadImageResponseSchema,
} from './schema.js';

export type UploadDocument = z.infer<typeof uploadDocumentSchema>;
export type UploadImage = z.infer<typeof uploadImageSchema>;
export type UploadDocumentResponse = z.infer<typeof uploadDocumentResponseSchema>;
export type UploadImageResponse = z.infer<typeof uploadImageResponseSchema>;
