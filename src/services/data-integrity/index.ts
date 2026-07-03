import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import type { FileUpload, FileUploadResponse, TextUpload, TextUploadResponse } from './types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';

export class DataIntegrity {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;
    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async fileUpload(options: FileUpload): Promise<HttpResponse<FileUploadResponse>> {
        try {
            this.auth.validate();
            this.validator.fileUpload(options);
            const reqPath = Routes.DATA_INTEGRITY.FILE_UPLOAD;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                walletID: options.walletID,
            };
            const formData = new FormData();
            formData.append('file', options.file as never);
            const res = await this.httpClient.post<FileUploadResponse>(reqPath, formData, headers, params);
            this.validator.fileUploadResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }
    async textUpload(options: TextUpload): Promise<HttpResponse<TextUploadResponse>> {
        try {
            this.auth.validate();
            this.validator.textUpload(options);
            const reqPath = Routes.DATA_INTEGRITY.TEXT_UPLOAD;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const params: QueryParams = {
                hashed: options.hashed,
                walletID: options.walletID,
            };
            const body = {
                text: options.text,
            };
            const res = await this.httpClient.post<TextUploadResponse>(reqPath, body, headers, params);
            this.validator.textUploadResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }
}
