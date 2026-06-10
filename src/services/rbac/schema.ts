import { z } from 'zod';
import { businessIdSchema, messageResponseSchema, nonEmptyString } from '../../utils/schema/common.js';

export const teamRoleSchema = z.object({
    description: z.string(),
    permissions: z.array(z.string()),
    role_id: z.string(),
    role_name: z.string(),
    business_id: z.string().optional(),
    team_id: z.string().optional(),
});

export const permissionsResponseSchema = z.array(z.string());

export const rolesResponseSchema = z.array(teamRoleSchema);

export const createRoleSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    role: z.object({
        role_name: nonEmptyString,
        description: nonEmptyString,
        permissions: z.array(nonEmptyString),
    }),
});

export const createRoleResponseSchema = messageResponseSchema;

export const updateRoleSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    roleId: nonEmptyString,
    role: z.object({
        role_id: nonEmptyString,
        role_name: nonEmptyString,
        description: nonEmptyString,
        permissions: z.array(nonEmptyString),
    }),
});

export const deleteRoleSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    roleId: nonEmptyString,
});

export const deleteRoleResponseSchema = messageResponseSchema;
