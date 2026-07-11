import type { z } from 'zod';
import { fileUploadSchema, textUploadSchema, textArrayUploadSchema, dataIntegrityResponseSchema } from './schema.js';

export type FileUpload = z.infer<typeof fileUploadSchema>;
export type TextUpload = z.infer<typeof textUploadSchema>;
export type TextArrayUpload = z.infer<typeof textArrayUploadSchema>;
export type DataIntegrityResponse = z.infer<typeof dataIntegrityResponseSchema>;
