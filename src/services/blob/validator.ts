import { uploadDocumentSchema, uploadDocumentResponseSchema } from './schema.js';
import type { UploadDocument, UploadDocumentResponse } from './types.js';

export default class Validator {
    uploadDocument(options: UploadDocument): void {
        uploadDocumentSchema.parse(options);
    }

    uploadDocumentResponse(response: UploadDocumentResponse): void {
        uploadDocumentResponseSchema.parse(response);
    }
}
