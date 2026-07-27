import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Members } from '../../src/services/members/index.js';
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

vi.mock('../../src/services/members/validator.js', () => ({
    default: vi.fn().mockImplementation(function () {
        return {
            getMembers: vi.fn(),
            membersListResponse: vi.fn(),
            createInvites: vi.fn(),
            createInvitesResponse: vi.fn(),
            invitesListResponse: vi.fn(),
            assignRoles: vi.fn(),
            assignRolesResponse: vi.fn(),
            removeMember: vi.fn(),
            removeMemberResponse: vi.fn(),
        };
    }),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Members Service', () => {
    let members: Members;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            getMembers: vi.fn(),
            membersListResponse: vi.fn(),
            createInvites: vi.fn(),
            createInvitesResponse: vi.fn(),
            invitesListResponse: vi.fn(),
            assignRoles: vi.fn(),
            assignRolesResponse: vi.fn(),
            removeMember: vi.fn(),
            removeMemberResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        members = new Members(mockAuth);
        (members as any).httpClient = mockHttpClient;
        (members as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getMembers', () => {
        it('should fetch members', async () => {
            const options = { businessId: BUSINESS_ID, pageNumber: 1, limit: 20 };
            const response = { list: [], page_meta: { page: 1, limit: 20, total: 0, total_pages: 0 } };
            mockValidator.membersListResponse.mockReturnValue(response);
            mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

            const result = await members.getMembers(options);

            expect(mockHttpClient.get).toHaveBeenCalledWith('/business/members', BUSINESS_HEADERS, {
                memberName: undefined,
                pageNumber: 1,
                limit: 20,
            });
            expect(result.data).toEqual(response);
        });
    });

    describe('createInvites', () => {
        it('should create invites', async () => {
            const options = {
                businessId: BUSINESS_ID,
                invites: [{ email: 'user@example.com', role_ids: ['role-1'] }],
            };
            const response = { message: 'Invites sent' };
            mockValidator.createInvitesResponse.mockReturnValue(response);
            mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));

            const result = await members.createInvites(options);

            expect(mockHttpClient.post).toHaveBeenCalledWith('/business/invites', options.invites, BUSINESS_HEADERS);
            expect(result.data).toEqual(response);
        });
    });

    describe('getInvites', () => {
        it('should fetch invites', async () => {
            const response = [{ email: 'user@example.com' }];
            mockValidator.invitesListResponse.mockReturnValue(response);
            mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

            const result = await members.getInvites({ businessId: BUSINESS_ID });

            expect(mockHttpClient.get).toHaveBeenCalledWith('/business/invites', BUSINESS_HEADERS);
            expect(result.data).toEqual(response);
        });
    });

    describe('assignRoles', () => {
        it('should assign roles to a member', async () => {
            const options = { businessId: BUSINESS_ID, memberID: 'member-1', roleIds: ['role-1'] };
            const response = { message: 'Roles assigned' };
            mockValidator.assignRolesResponse.mockReturnValue(response);
            mockHttpClient.put.mockResolvedValue(mockHttpResponse(response));

            const result = await members.assignRoles(options);

            expect(mockHttpClient.put).toHaveBeenCalledWith(
                '/business/role/assign',
                options.roleIds,
                BUSINESS_HEADERS,
                { memberID: 'member-1', teamID: undefined }
            );
            expect(result.data).toEqual(response);
        });
    });

    describe('removeRoles', () => {
        it('should remove roles from a member', async () => {
            const options = { businessId: BUSINESS_ID, memberID: 'member-1', roleIds: ['role-1'] };
            const response = { message: 'Roles removed' };
            mockValidator.assignRolesResponse.mockReturnValue(response);
            mockHttpClient.put.mockResolvedValue(mockHttpResponse(response));

            const result = await members.removeRoles(options);

            expect(mockHttpClient.put).toHaveBeenCalledWith(
                '/business/role/remove',
                options.roleIds,
                BUSINESS_HEADERS,
                { memberID: 'member-1', teamID: undefined }
            );
            expect(result.data).toEqual(response);
        });
    });

    describe('removeMember', () => {
        it('should remove a member', async () => {
            const options = { businessId: BUSINESS_ID, memberID: 'member-1' };
            const response = { message: 'Member removed' };
            mockValidator.removeMemberResponse.mockReturnValue(response);
            mockHttpClient.delete.mockResolvedValue(mockHttpResponse(response));

            const result = await members.removeMember(options);

            expect(mockHttpClient.delete).toHaveBeenCalledWith('/business/members', BUSINESS_HEADERS, {
                memberID: 'member-1',
            });
            expect(result.data).toEqual(response);
        });

        it('should throw when not authenticated', async () => {
            const authError = createUnauthorizedError();
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });
            await expect(members.removeMember({ businessId: BUSINESS_ID, memberID: 'member-1' })).rejects.toThrow(
                authError
            );
        });
    });
});
