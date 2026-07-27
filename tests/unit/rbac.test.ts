import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Rbac } from '../../src/services/rbac/index.js';
import {
    BUSINESS_HEADERS,
    BUSINESS_ID,
    createMockHttpClient,
    createUnauthorizedError,
    mockHttpResponse,
    setupAuthenticatedAuth,
} from './helpers/service-test-setup.js';

let mockHttpClient: ReturnType<typeof createMockHttpClient>;
let mockValidator: Record<string, ReturnType<typeof vi.fn>>;

vi.mock('../../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn().mockImplementation(function () {
        return createMockHttpClient();
    }),
}));

vi.mock('../../src/services/rbac/validator.js', () => ({
    default: vi.fn().mockImplementation(function () {
        return {
            permissionsResponse: vi.fn(),
            rolesResponse: vi.fn(),
            createRole: vi.fn(),
            createRoleResponse: vi.fn(),
            updateRole: vi.fn(),
            deleteRole: vi.fn(),
            deleteRoleResponse: vi.fn(),
        };
    }),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Rbac Service', () => {
    let rbac: Rbac;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            permissionsResponse: vi.fn(),
            rolesResponse: vi.fn(),
            createRole: vi.fn(),
            createRoleResponse: vi.fn(),
            updateRole: vi.fn(),
            deleteRole: vi.fn(),
            deleteRoleResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        rbac = new Rbac(mockAuth);
        (rbac as any).httpClient = mockHttpClient;
        (rbac as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should get permissions', async () => {
        const response = ['invoice.read', 'invoice.write'];
        mockValidator.permissionsResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

        const result = await rbac.getPermissions({ businessId: BUSINESS_ID });

        expect(mockHttpClient.get).toHaveBeenCalledWith('/business/permissions', BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should resolve member roles', async () => {
        const response = [{ role_id: 'role-1', role_name: 'Admin', description: '', permissions: [] }];
        mockValidator.rolesResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

        const result = await rbac.getMemberRole({ businessId: BUSINESS_ID });

        expect(mockHttpClient.get).toHaveBeenCalledWith('/business/role/resolve', BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should get roles', async () => {
        const response = [{ role_id: 'role-1', role_name: 'Admin', description: '', permissions: [] }];
        mockValidator.rolesResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

        const result = await rbac.getRoles({ businessId: BUSINESS_ID });

        expect(mockHttpClient.get).toHaveBeenCalledWith('/business/roles', BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should create a role', async () => {
        const options = {
            businessId: BUSINESS_ID,
            role: { role_name: 'Editor', description: 'Editor role', permissions: ['read'] },
        };
        const response = { message: 'Role created' };
        mockValidator.createRoleResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));

        const result = await rbac.createRole(options);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/business/roles', options.role, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should update a role', async () => {
        const options = {
            businessId: BUSINESS_ID,
            roleId: 'role-1',
            role: { role_id: 'role-1', role_name: 'Editor', description: 'Updated', permissions: ['read'] },
        };
        const response = { message: 'Role updated' };
        mockValidator.createRoleResponse.mockReturnValue(response);
        mockHttpClient.put.mockResolvedValue(mockHttpResponse(response));

        const result = await rbac.updateRole(options);

        expect(mockHttpClient.put).toHaveBeenCalledWith('/business/roles', options.role, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should delete a role', async () => {
        const options = { businessId: BUSINESS_ID, roleId: 'role-1' };
        const response = { message: 'Role deleted' };
        mockValidator.deleteRoleResponse.mockReturnValue(response);
        mockHttpClient.delete.mockResolvedValue(mockHttpResponse(response));

        const result = await rbac.deleteRole(options);

        expect(mockHttpClient.delete).toHaveBeenCalledWith('/business/roles', BUSINESS_HEADERS, {
            roleID: 'role-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        await expect(rbac.getPermissions()).rejects.toThrow(authError);
    });
});
