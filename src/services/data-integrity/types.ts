import type { z } from 'zod';
import { fileUploadSchema, fileUploadResponseSchema, textUploadSchema, textUploadResponseSchema } from './schema.js';

export type FileUpload = z.infer<typeof fileUploadSchema>;
export type FileUploadResponse = z.infer<typeof fileUploadResponseSchema>;
export type TextUpload = z.infer<typeof textUploadSchema>;
export type TextUploadResponse = z.infer<typeof textUploadResponseSchema>;
