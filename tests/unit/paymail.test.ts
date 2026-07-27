import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Paymail } from '../../src/services/paymail/index.js';
import { Authentication } from '../../src/services/authentication/index.js';
import { NeucronError } from '../../src/utils/errors/sdk-error.js';
import type {
    CreatePaymailBody,
    CreatePaymailResponse,
    PaymailListBody,
    PaymailListResponse,
    UpdateDefaultPaymailBody,
    UpdateDefaultPaymailResponse,
    DeletePaymailBody,
    DeletePaymailResponse,
} from '../../src/services/paymail/types.js';

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

vi.mock('../../src/services/paymail/validator.js', () => {
    const mockImplementation = () => ({
        createPaymail: vi.fn(),
        createPaymailResponse: vi.fn(),
        paymailList: vi.fn(),
        paymailListResponse: vi.fn(),
        updateDefaultPaymail: vi.fn(),
        updateDefaultPaymailResponse: vi.fn(),
        deletePaymail: vi.fn(),
        deletePaymailResponse: vi.fn(),
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

describe('Paymail Service', () => {
    let paymail: Paymail;
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
            createPaymail: vi.fn(),
            createPaymailResponse: vi.fn(),
            paymailList: vi.fn(),
            paymailListResponse: vi.fn(),
            updateDefaultPaymail: vi.fn(),
            updateDefaultPaymailResponse: vi.fn(),
            deletePaymail: vi.fn(),
            deletePaymailResponse: vi.fn(),
        };

        mockAuth = new Authentication();
        mockAuth.setToken('test-auth-token-123');
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {});
        vi.spyOn(mockAuth, 'getToken').mockReturnValue('test-auth-token-123');

        paymail = new Paymail(mockAuth);
        (paymail as any).httpClient = mockHttpClient;
        (paymail as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Create Paymail', () => {
        const mockData: CreatePaymailBody = {
            walletID: 'wallet-123',
            paymailName: 'testpaymail',
        };
        const mockResponse: CreatePaymailResponse = {
            message: 'Paymail created successfully',
        };

        it('should successfully create paymail', async () => {
            mockValidator.createPaymail.mockReturnValue(true);
            mockValidator.createPaymailResponse.mockReturnValue(mockResponse);
            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 201,
                statusText: 'Created',
            });

            const result = await paymail.createPaymail(mockData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.createPaymail).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/paymail/create',
                null,
                { Authorization: 'test-auth-token-123' },
                { walletID: 'wallet-123', paymailName: 'testpaymail' }
            );
            expect(result.data).toEqual(mockResponse);
        });

        it('should throw error when not authenticated', async () => {
            const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(paymail.createPaymail(mockData)).rejects.toThrow(authError);
            expect(mockHttpClient.post).not.toHaveBeenCalled();
        });
    });

    describe('Paymail List', () => {
        const mockData: PaymailListBody = { walletID: 'wallet-123' };
        const mockResponse: PaymailListResponse = [
            { alias: 'test1', wallet_id: 'wallet-123', is_wallet_default: true },
            { alias: 'test2', wallet_id: 'wallet-456', is_wallet_default: false },
        ];

        it('should successfully fetch paymail list', async () => {
            mockValidator.paymailList.mockReturnValue(true);
            mockValidator.paymailListResponse.mockReturnValue(mockResponse);
            mockHttpClient.get.mockResolvedValue({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await paymail.paymailList(mockData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.paymailList).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                '/paymail/list',
                { Authorization: 'test-auth-token-123' },
                { walletID: 'wallet-123' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('Update Default Paymail', () => {
        const mockData: UpdateDefaultPaymailBody = {
            walletID: 'wallet-123',
            alias: 'primary',
        };
        const mockResponse: UpdateDefaultPaymailResponse = { message: 'Updated successfully' };

        it('should successfully update default paymail', async () => {
            mockValidator.updateDefaultPaymail.mockReturnValue(true);
            mockValidator.updateDefaultPaymailResponse.mockReturnValue(mockResponse);
            mockHttpClient.put.mockResolvedValue({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await paymail.updateDefaultPaymail(mockData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.updateDefaultPaymail).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.put).toHaveBeenCalledWith(
                '/paymail/default',
                null,
                { Authorization: 'test-auth-token-123' },
                { walletID: 'wallet-123', alias: 'primary' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('Delete Paymail', () => {
        const mockData: DeletePaymailBody = { alias: 'oldpaymail' };
        const mockResponse: DeletePaymailResponse = { message: 'Deleted successfully' };

        it('should successfully delete paymail', async () => {
            mockValidator.deletePaymail.mockReturnValue(true);
            mockValidator.deletePaymailResponse.mockReturnValue(mockResponse);
            mockHttpClient.delete.mockResolvedValue({
                data: mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await paymail.deletePaymail(mockData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.deletePaymail).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.delete).toHaveBeenCalledWith(
                '/paymail/delete',
                { Authorization: 'test-auth-token-123' },
                { alias: 'oldpaymail' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });
});
