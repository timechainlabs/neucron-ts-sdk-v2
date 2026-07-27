import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Team } from '../../src/services/team/index.js';
import { Authentication } from '../../src/services/authentication/index.js';
import { NeucronError } from '../../src/utils/errors/sdk-error.js';

let mockHttpClient: any;
let mockValidator: any;

vi.mock('../../src/utils/http/http-client.js', () => {
    const mockImplementation = () => ({
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    });
    return {
        HttpClient: vi.fn().mockImplementation(function () {
            return mockImplementation();
        }),
    };
});

vi.mock('../../src/services/team/validator.js', () => {
    const mockImplementation = () => ({
        acceptInvite: vi.fn(),
        acceptInviteResponse: vi.fn(),
        invitesListResponse: vi.fn(),
        createInvite: vi.fn(),
        createInviteResponse: vi.fn(),
        pendingInvite: vi.fn(),
        pendingInvitesResponse: vi.fn(),
        teamListResponse: vi.fn(),
        memberList: vi.fn(),
        updateMemberRole: vi.fn(),
        updateMemberRoleResponse: vi.fn(),
        removeMember: vi.fn(),
        removeMemberResponse: vi.fn(),
    });
    return {
        default: vi.fn().mockImplementation(function () {
            return mockImplementation();
        }),
    };
});

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Team Service', () => {
    let team: Team;
    let mockAuth: Authentication;

    beforeEach(() => {
        vi.clearAllMocks();

        mockHttpClient = {
            post: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        };

        mockValidator = {
            acceptInvite: vi.fn(),
            acceptInviteResponse: vi.fn(),
            invitesListResponse: vi.fn(),
            createInvite: vi.fn(),
            createInviteResponse: vi.fn(),
            pendingInvite: vi.fn(),
            pendingInvitesResponse: vi.fn(),
            teamListResponse: vi.fn(),
            memberList: vi.fn(),
            updateMemberRole: vi.fn(),
            updateMemberRoleResponse: vi.fn(),
            removeMember: vi.fn(),
            removeMemberResponse: vi.fn(),
        };

        mockAuth = new Authentication();
        mockAuth.setToken('test-auth-token-123');
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {});
        vi.spyOn(mockAuth, 'getToken').mockReturnValue('test-auth-token-123');

        team = new Team(mockAuth);
        (team as any).httpClient = mockHttpClient;
        (team as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('acceptInvite', () => {
        const mockData = { 'X-Neucron-Team-ID': 'team-123' };
        const mockResponse = { message: 'Invite accepted' };

        it('should successfully accept invite', async () => {
            mockValidator.acceptInvite.mockReturnValue(true);
            mockValidator.acceptInviteResponse.mockReturnValue(mockResponse);
            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await team.acceptInvite(mockData as any);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.acceptInvite).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.post).toHaveBeenCalledWith('/team/accept', null, {
                Authorization: 'test-auth-token-123',
                'X-Neucron-Team-ID': 'team-123',
            });
            expect(result.data).toEqual(mockResponse);
        });

        it('should throw error if not authenticated', async () => {
            const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(team.acceptInvite(mockData as any)).rejects.toThrow(authError);
            expect(mockHttpClient.post).not.toHaveBeenCalled();
        });
    });

    describe('getInvitesList', () => {
        const mockResponse = [{ id: 'invite1' }];

        it('should successfully fetch invites list', async () => {
            mockValidator.invitesListResponse.mockReturnValue(mockResponse);
            mockHttpClient.get.mockResolvedValue({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await team.getInvitesList();

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockHttpClient.get).toHaveBeenCalledWith('/team/invites', {
                Authorization: 'test-auth-token-123',
            });
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('createInvite', () => {
        const mockData = {
            'X-Neucron-Team-ID': 'team-123',
            'X-Identifier': 'identifier',
            emails: ['test@example.com'],
            role: 'admin',
        };
        const mockResponse = { message: 'Invite created' };

        it('should successfully create invite', async () => {
            mockValidator.createInvite.mockReturnValue(true);
            mockValidator.createInviteResponse.mockReturnValue(mockResponse);
            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 201,
                statusText: 'Created',
            });

            const result = await team.createInvite(mockData as any);

            expect(mockValidator.createInvite).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/team/invites',
                ['test@example.com'],
                {
                    Authorization: 'test-auth-token-123',
                    'X-Neucron-Team-ID': 'team-123',
                    'X-Identifier': 'identifier',
                },
                { role: 'admin' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('getPendingInvites', () => {
        const mockData = { 'X-Neucron-Team-ID': 'team-123' };
        const mockResponse = [{ id: 'pending1' }];

        it('should successfully fetch pending invites', async () => {
            mockValidator.pendingInvite.mockReturnValue(true);
            mockValidator.pendingInvitesResponse.mockReturnValue(mockResponse);
            mockHttpClient.get.mockResolvedValue({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await team.getPendingInvites(mockData as any);

            expect(mockValidator.pendingInvite).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.get).toHaveBeenCalledWith('/team/invites/pending', {
                Authorization: 'test-auth-token-123',
                'X-Neucron-Team-ID': 'team-123',
            });
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('getTeamList', () => {
        const mockResponse = [{ id: 'team1' }];

        it('should successfully fetch team list', async () => {
            mockValidator.teamListResponse.mockReturnValue(mockResponse);
            mockHttpClient.get.mockResolvedValue({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await team.getTeamList();

            expect(mockHttpClient.get).toHaveBeenCalledWith('/team/list', {
                Authorization: 'test-auth-token-123',
            });
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('getMemberList', () => {
        const mockData = {
            'X-Neucron-Team-ID': 'team-123',
            memberName: 'Alice',
            role: 'admin',
            pageNumber: 1,
            limit: 10,
        };
        const mockResponse = [{ id: 'member1' }];

        it('should successfully fetch member list', async () => {
            mockValidator.memberList.mockReturnValue(true);
            mockHttpClient.get.mockResolvedValue({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await team.getMemberList(mockData as any);

            expect(mockValidator.memberList).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                '/team/members',
                { Authorization: 'test-auth-token-123', 'X-Neucron-Team-ID': 'team-123' },
                { memberName: 'Alice', role: 'admin', pageNumber: 1, limit: 10 }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('updateMemberRole', () => {
        const mockData = {
            'X-Neucron-Team-ID': 'team-123',
            memberID: 'user123',
            role: 'admin',
        };
        const mockResponse = { message: 'Role updated' };

        it('should successfully update member role', async () => {
            mockValidator.updateMemberRole.mockReturnValue(true);
            mockValidator.updateMemberRoleResponse.mockReturnValue(mockResponse);
            mockHttpClient.put.mockResolvedValue({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await team.updateMemberRole(mockData as any);

            expect(mockValidator.updateMemberRole).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.put).toHaveBeenCalledWith(
                '/team/members/role',
                null,
                { Authorization: 'test-auth-token-123', 'X-Neucron-Team-ID': 'team-123' },
                { memberID: 'user123', role: 'admin' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('removeMember', () => {
        const mockData = {
            'X-Neucron-Team-ID': 'team-123',
            memberID: 'user123',
        };
        const mockResponse = { message: 'Member removed' };

        it('should successfully remove member', async () => {
            mockValidator.removeMember.mockReturnValue(true);
            mockValidator.removeMemberResponse.mockReturnValue(mockResponse);
            mockHttpClient.delete.mockResolvedValue({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await team.removeMember(mockData as any);

            expect(mockValidator.removeMember).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                '/team/remove',
                { Authorization: 'test-auth-token-123', 'X-Neucron-Team-ID': 'team-123' },
                { memberID: 'user123' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });
});
