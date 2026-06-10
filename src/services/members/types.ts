import type { z } from 'zod';
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

export type GetMembers = z.infer<typeof getMembersSchema>;
export type MembersListResponse = z.infer<typeof membersListResponseSchema>;
export type CreateInvites = z.infer<typeof createInvitesSchema>;
export type CreateInvitesResponse = z.infer<typeof createInvitesResponseSchema>;
export type BusinessInvitesListResponse = z.infer<typeof invitesListResponseSchema>;
export type AssignRoles = z.infer<typeof assignRolesSchema>;
export type AssignRolesResponse = z.infer<typeof assignRolesResponseSchema>;
export type BusinessRemoveMember = z.infer<typeof removeMemberSchema>;
export type BusinessRemoveMemberResponse = z.infer<typeof removeMemberResponseSchema>;
