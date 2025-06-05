import { HttpClient } from '../../utils/http/http-client.js';
import { Headers, HttpResponse, QueryParams } from '../../utils/http/types.js';
import { Authentication } from '../authentication/index.js';

import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { TeamListResponse, MemberList, MemberListResponse } from './types.js';

export class Team {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;
    constructor(private readonly auth: Authentication) {
        this.validator = new Validator();
        this.httpClient = new HttpClient();
    }

    async getTeamList(): Promise<HttpResponse<TeamListResponse>> {
        try {
            this.auth.validate();
            const reqPath = '/team/list';
            const headers: Headers = {
                Authorization: this.auth.getToken(),
            };
            const res = await this.httpClient.get<TeamListResponse>(reqPath, headers);
            return res;
        } catch (err) {
            handleError(err);
        }
    }
    async getMemberList(options: MemberList): Promise<HttpResponse<MemberListResponse>> {
        try {
            this.auth.validate();
            this.validator.memberList(options);
            const reqPath = '/team/members';
            const headers: Headers = {
                Authorization: this.auth.getToken(),
                'X-Neucron-Team-ID': options.XNeucronTeamID,
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
}
