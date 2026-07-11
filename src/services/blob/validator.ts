import {
    uploadDocumentSchema,
    uploadImageSchema,
    uploadDocumentResponseSchema,
    uploadImageResponseSchema,
} from './schema.js';
import type { UploadDocument, UploadImage, UploadDocumentResponse, UploadImageResponse } from './types.js';

export default class Validator {
    uploadDocument(options: UploadDocument): void {
        uploadDocumentSchema.parse(options);
    }

    uploadImage(options: UploadImage): void {
        uploadImageSchema.parse(options);
    }

    uploadDocumentResponse(response: UploadDocumentResponse): void {
        uploadDocumentResponseSchema.parse(response);
    }

    uploadImageResponse(response: UploadImageResponse): void {
        uploadImageResponseSchema.parse(response);
    }
}
