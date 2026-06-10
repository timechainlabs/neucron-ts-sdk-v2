import type { z } from 'zod';
import { uploadDocumentSchema, uploadDocumentResponseSchema } from './schema.js';

export type UploadDocument = z.infer<typeof uploadDocumentSchema>;
export type UploadDocumentResponse = z.infer<typeof uploadDocumentResponseSchema>;
