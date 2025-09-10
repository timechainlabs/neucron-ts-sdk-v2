import { HttpClient } from '../../utils/http/http-client.js';
import type { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';

import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import type {
    TeamListResponse,
    MemberList,
    MemberListResponse,
    AcceptInvite,
    AcceptInviteResponse,
    CreateInvite,
    CreateInviteResponse,
    InvitesListResponse,
    PendingInvitesResponse,
    PendingInvites,
    UpdateMemberRole,
    UpdateMemberRoleResponse,
    RemoveMember,
    RemoveMemberResponse,
} from './types.js';
import { Routes } from '../../utils/routes/index.js';

export class Team {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;
    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async acceptInvite(options: AcceptInvite): Promise<HttpResponse<AcceptInviteResponse>> {
        try {
            this.auth.validate();
            this.validator.acceptInvite(options);
            const reqPath = Routes.TEAM.ACCEPT;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
                'X-Neucron-Team-ID': options['X-Neucron-Team-ID'],
            };
            const res = await this.httpClient.post<AcceptInviteResponse>(reqPath, null, headers);
            this.validator.acceptInviteResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async getInvitesList(): Promise<HttpResponse<InvitesListResponse>> {
        try {
            this.auth.validate();
            const reqPath = Routes.TEAM.INVITES_LIST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const res = await this.httpClient.get<InvitesListResponse>(reqPath, headers);
            this.validator.invitesListResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async createInvite(options: CreateInvite): Promise<HttpResponse<CreateInviteResponse>> {
        try {
            this.auth.validate();
            this.validator.createInvite(options);
            const reqPath = Routes.TEAM.CREATE_INVITE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
                'X-Neucron-Team-ID': options['X-Neucron-Team-ID'],
                'X-Identifier': options['X-Identifier'],
            };
            const params: QueryParams = {
                role: options.role,
            };
            const res = await this.httpClient.post<CreateInviteResponse>(reqPath, options.emails, headers, params);
            this.validator.createInviteResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async getPendingInvites(options: PendingInvites): Promise<HttpResponse<PendingInvitesResponse>> {
        try {
            this.auth.validate();
            this.validator.pendingInvite(options);
            const reqPath = Routes.TEAM.PENDING_INVITES;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
                'X-Neucron-Team-ID': options['X-Neucron-Team-ID'],
            };
            const res = await this.httpClient.get<PendingInvitesResponse>(reqPath, headers);
            this.validator.pendingInvitesResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async getTeamList(): Promise<HttpResponse<TeamListResponse>> {
        try {
            this.auth.validate();
            const reqPath = Routes.TEAM.LIST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const res = await this.httpClient.get<TeamListResponse>(reqPath, headers);
            this.validator.teamListResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async getMemberList(options: MemberList): Promise<HttpResponse<MemberListResponse>> {
        try {
            this.auth.validate();
            this.validator.memberList(options);
            const reqPath = Routes.TEAM.MEMBERS_LIST;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
                'X-Neucron-Team-ID': options['X-Neucron-Team-ID'],
            };
            const params: QueryParams = {
                memberName: options.memberName,
                role: options.role,
                pageNumber: options.pageNumber,
                limit: options.limit,
            };
            const res = await this.httpClient.get<MemberListResponse>(reqPath, headers, params);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async updateMemberRole(options: UpdateMemberRole): Promise<HttpResponse<UpdateMemberRoleResponse>> {
        try {
            this.auth.validate();
            this.validator.updateMemberRole(options);
            const reqPath = Routes.TEAM.UPDATE_ROLE;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
                'X-Neucron-Team-ID': options['X-Neucron-Team-ID'],
            };
            const params: QueryParams = {
                memberID: options.memberID,
                role: options.role,
            };
            const res = await this.httpClient.put<UpdateMemberRoleResponse>(reqPath, null, headers, params);
            this.validator.updateMemberRoleResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }

    async removeMember(options: RemoveMember): Promise<HttpResponse<RemoveMemberResponse>> {
        try {
            this.auth.validate();
            this.validator.removeMember(options);
            const reqPath = Routes.TEAM.REMOVE_MEMBER;
            const headers: Headers = {
                Authorization: this.auth.getToken(),
                'X-Neucron-Team-ID': options['X-Neucron-Team-ID'],
            };
            const params: QueryParams = {
                memberID: options.memberID,
            };
            const res = await this.httpClient.delete<RemoveMemberResponse>(reqPath, headers, params);
            this.validator.removeMemberResponse(res.data);
            return res;
        } catch (err) {
            handleError(err);
        }
    }
}
