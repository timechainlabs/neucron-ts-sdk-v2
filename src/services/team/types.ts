import { z } from 'zod';
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

export type AcceptInvite = z.infer<typeof acceptInviteSchema>;
export type AcceptInviteResponse = z.infer<typeof acceptInviteResponseSchema>;

export type InvitesListResponse = z.infer<typeof invitesListResponseSchema>;

export type CreateInvite = z.infer<typeof createInviteSchema>;
export type CreateInviteResponse = z.infer<typeof createInviteResponseSchema>;

export type PendingInvites = z.infer<typeof pendingInviteSchema>;
export type PendingInvitesResponse = z.infer<typeof pendingInvitesResponseSchema>;

export type TeamListResponse = z.infer<typeof teamListResponseSchema>;

export type MemberList = z.infer<typeof memberListSchema>;
export type MemberListResponse = z.infer<typeof memberListResponseSchema>;

export type UpdateMemberRole = z.infer<typeof updateMemberRoleSchema>;
export type UpdateMemberRoleResponse = z.infer<typeof updateMemberRoleResponseSchema>;

export type RemoveMember = z.infer<typeof removeMemberSchema>;
export type RemoveMemberResponse = z.infer<typeof removeMemberResponseSchema>;
