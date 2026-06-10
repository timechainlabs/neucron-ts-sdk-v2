import type { z } from 'zod';
import {
    permissionsResponseSchema,
    rolesResponseSchema,
    createRoleSchema,
    createRoleResponseSchema,
    updateRoleSchema,
    deleteRoleSchema,
    deleteRoleResponseSchema,
    teamRoleSchema,
} from './schema.js';

export type TeamRole = z.infer<typeof teamRoleSchema>;
export type PermissionsResponse = z.infer<typeof permissionsResponseSchema>;
export type RolesResponse = z.infer<typeof rolesResponseSchema>;
export type CreateRole = z.infer<typeof createRoleSchema>;
export type CreateRoleResponse = z.infer<typeof createRoleResponseSchema>;
export type UpdateRole = z.infer<typeof updateRoleSchema>;
export type DeleteRole = z.infer<typeof deleteRoleSchema>;
export type DeleteRoleResponse = z.infer<typeof deleteRoleResponseSchema>;
