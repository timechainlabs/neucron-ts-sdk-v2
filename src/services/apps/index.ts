import type { HttpResponse, QueryParams } from '../../utils/http/types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type { AppsListResponse, CreateApp, CreateAppResponse, GetAppSecret, AppSecretResponse } from './types.js';

export class Apps {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async getApps(options?: { businessId?: string }): Promise<HttpResponse<AppsListResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const resp = await this.httpClient.get<AppsListResponse>(Routes.APP.LIST, headers);
            this.validator.appsListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async createApp(options: CreateApp): Promise<HttpResponse<CreateAppResponse>> {
        try {
            this.auth.validate();
            this.validator.createApp(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const resp = await this.httpClient.post<CreateAppResponse>(Routes.APP.CREATE, options.appData, headers);
            this.validator.createAppResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getAppSecret(options: GetAppSecret): Promise<HttpResponse<AppSecretResponse>> {
        try {
            this.auth.validate();
            this.validator.getAppSecret(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { appID: options.appId };
            const resp = await this.httpClient.get<AppSecretResponse>(Routes.APP.SECRET, headers, params);
            this.validator.appSecretResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
