import {
    getMembersSchema,
    membersListResponseSchema,
    createInvitesSchema,
    createInvitesResponseSchema,
    invitesListResponseSchema,
    assignRolesSchema,
    assignRolesResponseSchema,
    removeMemberSchema,
    removeMemberResponseSchema,
} from './schema.js';
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

export default class Validator {
    getMembers(options?: GetMembers): void {
        if (options) getMembersSchema.parse(options);
    }

    membersListResponse(response: MembersListResponse): void {
        membersListResponseSchema.parse(response);
    }

    createInvites(options: CreateInvites): void {
        createInvitesSchema.parse(options);
    }

    createInvitesResponse(response: CreateInvitesResponse): void {
        createInvitesResponseSchema.parse(response);
    }

    invitesListResponse(response: BusinessInvitesListResponse): void {
        invitesListResponseSchema.parse(response);
    }

    assignRoles(options: AssignRoles): void {
        assignRolesSchema.parse(options);
    }

    assignRolesResponse(response: AssignRolesResponse): void {
        assignRolesResponseSchema.parse(response);
    }

    removeMember(options: BusinessRemoveMember): void {
        removeMemberSchema.parse(options);
    }

    removeMemberResponse(response: BusinessRemoveMemberResponse): void {
        removeMemberResponseSchema.parse(response);
    }
}
