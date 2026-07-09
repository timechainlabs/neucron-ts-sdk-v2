import { normalizeTxidResponse } from '../../utils/schema/normalize.js';
import { fileUploadSchema, textUploadSchema, textArrayUploadSchema, dataIntegrityResponseSchema } from './schema.js';
import type { FileUpload, TextUpload, TextArrayUpload, DataIntegrityResponse } from './types.js';

export default class Validator {
    fileUpload(option: FileUpload) {
        return fileUploadSchema.parse(option);
    }

    textUpload(option: TextUpload) {
        return textUploadSchema.parse(option);
    }

    textArrayUpload(option: TextArrayUpload) {
        return textArrayUploadSchema.parse(option);
    }

    dataIntegrityResponse(option: DataIntegrityResponse) {
        return dataIntegrityResponseSchema.parse(normalizeTxidResponse(option));
    }
}
