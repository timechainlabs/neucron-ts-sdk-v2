import type { HttpResponse, QueryParams } from '../../utils/http/types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type {
    PermissionsResponse,
    RolesResponse,
    CreateRole,
    CreateRoleResponse,
    UpdateRole,
    DeleteRole,
    DeleteRoleResponse,
} from './types.js';

export class Rbac {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async getPermissions(options?: { businessId?: string }): Promise<HttpResponse<PermissionsResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const resp = await this.httpClient.get<PermissionsResponse>(Routes.BUSINESS.PERMISSIONS, headers);
            this.validator.permissionsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getMemberRole(options?: { businessId?: string }): Promise<HttpResponse<RolesResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const resp = await this.httpClient.get<RolesResponse>(Routes.BUSINESS.ROLE_RESOLVE, headers);
            this.validator.rolesResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getRoles(options?: { businessId?: string }): Promise<HttpResponse<RolesResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const resp = await this.httpClient.get<RolesResponse>(Routes.BUSINESS.ROLES, headers);
            this.validator.rolesResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async createRole(options: CreateRole): Promise<HttpResponse<CreateRoleResponse>> {
        try {
            this.auth.validate();
            this.validator.createRole(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const resp = await this.httpClient.post<CreateRoleResponse>(Routes.BUSINESS.ROLES, options.role, headers);
            this.validator.createRoleResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async updateRole(options: UpdateRole): Promise<HttpResponse<CreateRoleResponse>> {
        try {
            this.auth.validate();
            this.validator.updateRole(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const resp = await this.httpClient.put<CreateRoleResponse>(Routes.BUSINESS.ROLES, options.role, headers);
            this.validator.createRoleResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async deleteRole(options: DeleteRole): Promise<HttpResponse<DeleteRoleResponse>> {
        try {
            this.auth.validate();
            this.validator.deleteRole(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { roleID: options.roleId };
            const resp = await this.httpClient.delete<DeleteRoleResponse>(Routes.BUSINESS.ROLES, headers, params);
            this.validator.deleteRoleResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
