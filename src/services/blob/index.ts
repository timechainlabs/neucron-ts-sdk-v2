import type { HttpResponse } from '../../utils/http/types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type { UploadDocument, UploadDocumentResponse } from './types.js';

export class Blob {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
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
}
