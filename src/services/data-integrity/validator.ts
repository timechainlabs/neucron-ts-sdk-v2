import { normalizeTxidResponse } from '../../utils/schema/normalize.js';
import { fileUploadSchema, fileUploadResponseSchema, textUploadSchema, textUploadResponseSchema } from './schema.js';
import type { FileUpload, FileUploadResponse, TextUpload, TextUploadResponse } from './types.js';

export default class Validator {
    fileUpload(option: FileUpload) {
        return fileUploadSchema.parse(option);
    }
    fileUploadResponse(option: FileUploadResponse) {
        return fileUploadResponseSchema.parse(normalizeTxidResponse(option));
    }
    textUpload(option: TextUpload) {
        return textUploadSchema.parse(option);
    }
    textUploadResponse(option: TextUploadResponse) {
        return textUploadResponseSchema.parse(normalizeTxidResponse(option));
    }
}
