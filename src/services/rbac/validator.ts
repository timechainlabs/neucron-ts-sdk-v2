import {
    permissionsResponseSchema,
    rolesResponseSchema,
    createRoleSchema,
    createRoleResponseSchema,
    updateRoleSchema,
    deleteRoleSchema,
    deleteRoleResponseSchema,
} from './schema.js';
import type {
    PermissionsResponse,
    RolesResponse,
    CreateRole,
    CreateRoleResponse,
    UpdateRole,
    DeleteRole,
    DeleteRoleResponse,
} from './types.js';

export default class Validator {
    permissionsResponse(response: PermissionsResponse): void {
        permissionsResponseSchema.parse(response);
    }

    rolesResponse(response: RolesResponse): void {
        rolesResponseSchema.parse(response);
    }

    createRole(options: CreateRole): void {
        createRoleSchema.parse(options);
    }

    createRoleResponse(response: CreateRoleResponse): void {
        createRoleResponseSchema.parse(response);
    }

    updateRole(options: UpdateRole): void {
        updateRoleSchema.parse(options);
    }

    deleteRole(options: DeleteRole): void {
        deleteRoleSchema.parse(options);
    }

    deleteRoleResponse(response: DeleteRoleResponse): void {
        deleteRoleResponseSchema.parse(response);
    }
}
