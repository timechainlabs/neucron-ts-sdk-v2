import { z } from 'zod';
import { businessIdSchema, messageResponseSchema, nonEmptyString, pageMetaSchema } from '../../utils/schema/common.js';

export const getMembersSchema = businessIdSchema.extend({
    memberName: z.string().optional(),
    pageNumber: z.number().min(1).optional(),
    limit: z.number().min(1).optional(),
});

export const memberRoleSchema = z.object({
    role_id: z.string(),
    role_name: z.string(),
    permissions: z.array(z.string()).optional(),
    description: z.string().optional(),
    business_id: z.string().optional(),
});

export const memberSchema = z.object({
    business_id: z.string(),
    team_id: z.string().optional(),
    user_id: z.string(),
    email: z.string(),
    full_name: z.string().optional(),
    is_owner: z.boolean().optional(),
    roles: z.array(memberRoleSchema).optional(),
    status: z.string().optional(),
    avatar: z.string().optional(),
    joined_at: z.string().optional(),
});

export const membersListResponseSchema = z.object({
    list: z.array(memberSchema),
    page_meta: pageMetaSchema,
});

export const createInvitesSchema = businessIdSchema.extend({
    invites: z.array(
        z.object({
            email: z.string().email(),
            role_ids: z.array(nonEmptyString),
        })
    ),
});

export const createInvitesResponseSchema = messageResponseSchema;

export const invitesListResponseSchema = z.array(z.record(z.string(), z.unknown()));

export const assignRolesSchema = businessIdSchema.extend({
    memberID: nonEmptyString,
    roleIds: z.array(nonEmptyString),
    teamID: z.string().optional(),
});

export const assignRolesResponseSchema = messageResponseSchema;

export const removeMemberSchema = businessIdSchema.extend({
    memberID: nonEmptyString,
});

export const removeMemberResponseSchema = messageResponseSchema;
