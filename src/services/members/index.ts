import type { HttpResponse, QueryParams } from '../../utils/http/types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import { buildAuthHeaders } from '../../utils/http/headers.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';
import type {
    GetMembers,
    MembersListResponse,
    CreateInvites,
    CreateInvitesResponse,
    BusinessInvitesListResponse,
    AssignRoles,
    AssignRolesResponse,
    BusinessRemoveMember,
    BusinessRemoveMemberResponse,
} from './types.js';

export class Members {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;

    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async getMembers(options?: GetMembers): Promise<HttpResponse<MembersListResponse>> {
        try {
            this.auth.validate();
            this.validator.getMembers(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const params: QueryParams = {
                memberName: options?.memberName,
                pageNumber: options?.pageNumber,
                limit: options?.limit,
            };
            const resp = await this.httpClient.get<MembersListResponse>(Routes.BUSINESS.MEMBERS, headers, params);
            this.validator.membersListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async createInvites(options: CreateInvites): Promise<HttpResponse<CreateInvitesResponse>> {
        try {
            this.auth.validate();
            this.validator.createInvites(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const resp = await this.httpClient.post<CreateInvitesResponse>(
                Routes.BUSINESS.INVITES,
                options.invites,
                headers
            );
            this.validator.createInvitesResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async getInvites(options?: { businessId?: string }): Promise<HttpResponse<BusinessInvitesListResponse>> {
        try {
            this.auth.validate();
            const headers = buildAuthHeaders(this.auth, { businessId: options?.businessId });
            const resp = await this.httpClient.get<BusinessInvitesListResponse>(Routes.BUSINESS.INVITES, headers);
            this.validator.invitesListResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async assignRoles(options: AssignRoles): Promise<HttpResponse<AssignRolesResponse>> {
        try {
            this.auth.validate();
            this.validator.assignRoles(options);
            const headers = buildAuthHeaders(this.auth, {
                businessId: options.businessId,
                teamId: options.teamID,
            });
            const params: QueryParams = {
                memberID: options.memberID,
                teamID: options.teamID,
            };
            const resp = await this.httpClient.put<AssignRolesResponse>(
                Routes.BUSINESS.ROLE_ASSIGN,
                options.roleIds,
                headers,
                params
            );
            this.validator.assignRolesResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async removeRoles(options: AssignRoles): Promise<HttpResponse<AssignRolesResponse>> {
        try {
            this.auth.validate();
            this.validator.assignRoles(options);
            const headers = buildAuthHeaders(this.auth, {
                businessId: options.businessId,
                teamId: options.teamID,
            });
            const params: QueryParams = {
                memberID: options.memberID,
                teamID: options.teamID,
            };
            const resp = await this.httpClient.put<AssignRolesResponse>(
                Routes.BUSINESS.ROLE_REMOVE,
                options.roleIds,
                headers,
                params
            );
            this.validator.assignRolesResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async removeMember(options: BusinessRemoveMember): Promise<HttpResponse<BusinessRemoveMemberResponse>> {
        try {
            this.auth.validate();
            this.validator.removeMember(options);
            const headers = buildAuthHeaders(this.auth, { businessId: options.businessId });
            const params: QueryParams = { memberID: options.memberID };
            const resp = await this.httpClient.delete<BusinessRemoveMemberResponse>(
                Routes.BUSINESS.MEMBERS,
                headers,
                params
            );
            this.validator.removeMemberResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
