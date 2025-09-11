import {
    acceptInviteSchema,
    acceptInviteResponseSchema,
    invitesListResponseSchema,
    createInviteSchema,
    createInviteResponseSchema,
    pendingInviteSchema,
    pendingInvitesResponseSchema,
    teamListResponseSchema,
    memberListSchema,
    memberListResponseSchema,
    updateMemberRoleSchema,
    updateMemberRoleResponseSchema,
    removeMemberSchema,
    removeMemberResponseSchema,
} from './schema.js';
import type {
    AcceptInvite,
    AcceptInviteResponse,
    InvitesListResponse,
    CreateInvite,
    CreateInviteResponse,
    PendingInvites,
    PendingInvitesResponse,
    TeamListResponse,
    MemberList,
    MemberListResponse,
    UpdateMemberRole,
    UpdateMemberRoleResponse,
    RemoveMember,
    RemoveMemberResponse,
} from './types.js';

export default class Validator {
    acceptInvite(invite: AcceptInvite): void {
        acceptInviteSchema.parse(invite);
    }

    acceptInviteResponse(response: AcceptInviteResponse): void {
        acceptInviteResponseSchema.parse(response);
    }

    invitesListResponse(response: InvitesListResponse): void {
        invitesListResponseSchema.parse(response);
    }

    createInvite(invite: CreateInvite): void {
        createInviteSchema.parse(invite);
    }

    createInviteResponse(response: CreateInviteResponse): void {
        createInviteResponseSchema.parse(response);
    }

    pendingInvite(invite: PendingInvites): void {
        pendingInviteSchema.parse(invite);
    }

    pendingInvitesResponse(response: PendingInvitesResponse): void {
        pendingInvitesResponseSchema.parse(response);
    }

    teamListResponse(response: TeamListResponse): void {
        teamListResponseSchema.parse(response);
    }

    memberList(member: MemberList): void {
        memberListSchema.parse(member);
    }

    memberListResponse(response: MemberListResponse): void {
        memberListResponseSchema.parse(response);
    }

    updateMemberRole(member: UpdateMemberRole): void {
        updateMemberRoleSchema.parse(member);
    }

    updateMemberRoleResponse(response: UpdateMemberRoleResponse): void {
        updateMemberRoleResponseSchema.parse(response);
    }

    removeMember(member: RemoveMember): void {
        removeMemberSchema.parse(member);
    }

    removeMemberResponse(response: RemoveMemberResponse): void {
        removeMemberResponseSchema.parse(response);
    }
}
