import type { HttpResponse, QueryParams, IHttpClient } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type {
    ListCustomers,
    CustomersListResponse,
    GetCustomer,
    CreateCustomer,
    UpdateCustomer,
    DeleteCustomer,
    InviteCustomer,
    CustomerResponse,
    DeleteCustomerResponse,
    InviteCustomerResponse,
} from './types.js';

export class Customer {
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = auth.getHttpClient();
    }

    async getCustomers(options: ListCustomers): Promise<HttpResponse<CustomersListResponse>> {
        try {
            this.auth.validate();
            this.validator.listCustomers(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { page: options.page, size: options.size };
            const resp = await this.httpClient.get<CustomersListResponse>(Routes.INVOICE.CUSTOMERS, headers, params);
            this.validator.customersListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getCustomer(options: GetCustomer): Promise<HttpResponse<CustomerResponse>> {
        try {
            this.auth.validate();
            this.validator.getCustomer(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { customerID: options.customerId };
            const resp = await this.httpClient.get<CustomerResponse>(Routes.INVOICE.CUSTOMER, headers, params);
            this.validator.customerResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async createCustomer(options: CreateCustomer): Promise<HttpResponse<CustomerResponse>> {
        try {
            this.auth.validate();
            this.validator.createCustomer(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const resp = await this.httpClient.post<CustomerResponse>(
                Routes.INVOICE.CUSTOMER,
                options.customerData,
                headers
            );
            this.validator.customerResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async updateCustomer(options: UpdateCustomer): Promise<HttpResponse<CustomerResponse>> {
        try {
            this.auth.validate();
            this.validator.updateCustomer(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { customerID: options.customerId };
            const resp = await this.httpClient.put<CustomerResponse>(
                Routes.INVOICE.CUSTOMER,
                options.customerData,
                headers,
                params
            );
            this.validator.customerResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async deleteCustomer(options: DeleteCustomer): Promise<HttpResponse<DeleteCustomerResponse>> {
        try {
            this.auth.validate();
            this.validator.deleteCustomer(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { customerID: options.customerId };
            const resp = await this.httpClient.delete<DeleteCustomerResponse>(Routes.INVOICE.CUSTOMER, headers, params);
            this.validator.deleteCustomerResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async inviteCustomer(options: InviteCustomer): Promise<HttpResponse<InviteCustomerResponse>> {
        try {
            this.auth.validate();
            this.validator.inviteCustomer(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { customerID: options.customerId };
            const resp = await this.httpClient.post<InviteCustomerResponse>(
                Routes.INVOICE.CUSTOMER_INVITE,
                null,
                headers,
                params
            );
            this.validator.inviteCustomerResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
