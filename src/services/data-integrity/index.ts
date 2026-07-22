import type { HttpResponse, QueryParams, IHttpClient } from '../../utils/http/types.js';
import type { FileUpload, TextUpload, TextArrayUpload, DataIntegrityResponse } from './types.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';

function buildDataIntegrityHeaders(auth: Authentication, options: { businessId?: string; appSecret?: string }) {
    return buildAuthHeaders(auth, {
        businessId: options.businessId,
        appSecret: options.appSecret,
    });
}

function buildDataIntegrityParams(options: { walletID?: string; network?: string; hashed?: string }): QueryParams {
    return {
        walletID: options.walletID,
        network: options.network,
        hashed: options.hashed,
    };
}

export class DataIntegrity {
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = auth.getHttpClient();
    }

    async fileUpload(options: FileUpload): Promise<HttpResponse<DataIntegrityResponse>> {
        try {
            this.auth.validate();
            this.validator.fileUpload(options);
            const headers = buildDataIntegrityHeaders(this.auth, options);
            const params = buildDataIntegrityParams(options);
            const formData = new FormData();
            formData.append('file', options.file as never);
            const res = await this.httpClient.post<DataIntegrityResponse>(
                Routes.DATA_INTEGRITY.FILE_UPLOAD,
                formData,
                headers,
                params
            );
            this.validator.dataIntegrityResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async textUpload(options: TextUpload): Promise<HttpResponse<DataIntegrityResponse>> {
        try {
            this.auth.validate();
            this.validator.textUpload(options);
            const headers = {
                ...buildDataIntegrityHeaders(this.auth, options),
                'Content-Type': 'text/plain',
            };
            const params = buildDataIntegrityParams(options);
            const res = await this.httpClient.post<DataIntegrityResponse>(
                Routes.DATA_INTEGRITY.TEXT_UPLOAD,
                options.text,
                headers,
                params
            );
            this.validator.dataIntegrityResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async textArrayUpload(options: TextArrayUpload): Promise<HttpResponse<DataIntegrityResponse>> {
        try {
            this.auth.validate();
            this.validator.textArrayUpload(options);
            const headers = buildDataIntegrityHeaders(this.auth, options);
            const params = buildDataIntegrityParams(options);
            const res = await this.httpClient.post<DataIntegrityResponse>(
                Routes.DATA_INTEGRITY.TEXT_ARRAY_UPLOAD,
                options.text,
                headers,
                params
            );
            this.validator.dataIntegrityResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }
}
