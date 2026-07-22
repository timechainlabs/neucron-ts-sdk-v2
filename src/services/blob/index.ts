import type { HttpResponse, IHttpClient } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type { UploadDocument, UploadDocumentResponse, UploadImage, UploadImageResponse } from './types.js';

export class Blob {
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = auth.getHttpClient();
    }

    async uploadDocument(options: UploadDocument): Promise<HttpResponse<UploadDocumentResponse>> {
        try {
            this.auth.validate();
            this.validator.uploadDocument(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const formData = new FormData();
            formData.append('document', options.file as never);
            const resp = await this.httpClient.post<UploadDocumentResponse>(
                Routes.BLOB.DOCUMENT_UPLOAD,
                formData,
                headers
            );
            this.validator.uploadDocumentResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async uploadImage(options: UploadImage): Promise<HttpResponse<UploadImageResponse>> {
        try {
            this.auth.validate();
            this.validator.uploadImage(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const formData = new FormData();
            formData.append('image', options.file as never);
            const resp = await this.httpClient.post<UploadImageResponse>(Routes.BLOB.IMAGE_UPLOAD, formData, headers);
            this.validator.uploadImageResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
