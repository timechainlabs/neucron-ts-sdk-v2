import type { HttpResponse, QueryParams, IHttpClient } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type {
    CreateBusinessBody,
    CreateBusinessResponse,
    GetBusinessDetails,
    BusinessDetailsResponse,
    BusinessListResponse,
    UpdateBusinessDetails,
    UpdateBusinessDetailsResponse,
} from './types.js';

export class Business {
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = auth.getHttpClient();
    }

    async createBusiness(options: CreateBusinessBody): Promise<HttpResponse<CreateBusinessResponse>> {
        try {
            this.auth.validate();
            this.validator.createBusiness(options);
            const headers = buildAuthHeaders(this.auth);
            const resp = await this.httpClient.post<CreateBusinessResponse>(Routes.BUSINESS.CREATE, options, headers);
            this.validator.createBusinessResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getBusinessDetails(options: GetBusinessDetails): Promise<HttpResponse<BusinessDetailsResponse>> {
        try {
            this.auth.validate();
            this.validator.getBusinessDetails(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { businessId: options.businessId };
            const resp = await this.httpClient.get<BusinessDetailsResponse>(Routes.BUSINESS.DETAILS, headers, params);
            this.validator.businessDetailsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getBusinessList(): Promise<HttpResponse<BusinessListResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth);
            const resp = await this.httpClient.get<BusinessListResponse>(Routes.BUSINESS.LIST, headers);
            this.validator.businessListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async updateBusinessDetails(options: UpdateBusinessDetails): Promise<HttpResponse<UpdateBusinessDetailsResponse>> {
        try {
            this.auth.validate();
            this.validator.updateBusinessDetails(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { businessID: options.businessId };
            const resp = await this.httpClient.patch<UpdateBusinessDetailsResponse>(
                Routes.BUSINESS.UPDATE,
                options.data,
                headers,
                params
            );
            this.validator.updateBusinessDetailsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
