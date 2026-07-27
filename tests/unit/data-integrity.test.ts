import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DataIntegrity } from '../../src/services/data-integrity/index.js';
import { Authentication } from '../../src/services/authentication/index.js';
import { NeucronError } from '../../src/utils/errors/sdk-error.js';
import type {
    FileUpload,
    TextUpload,
    TextArrayUpload,
    DataIntegrityResponse,
} from '../../src/services/data-integrity/types.js';

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

vi.mock('../../src/services/data-integrity/validator.js', () => {
    const mockImplementation = () => ({
        fileUpload: vi.fn(),
        textUpload: vi.fn(),
        textArrayUpload: vi.fn(),
        dataIntegrityResponse: vi.fn(),
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

describe('DataIntegrity Service', () => {
    let dataIntegrity: DataIntegrity;
    let mockAuth: Authentication;

    const businessHeaders = {
        Authorization: 'test-auth-token-123',
        'X-Identifier': 'NEUCRON',
        'X-Neucron-Business-ID': 'biz-123',
    };

    beforeEach(() => {
        vi.clearAllMocks();

        mockHttpClient = {
            post: vi.fn(),
        };

        mockValidator = {
            fileUpload: vi.fn(),
            textUpload: vi.fn(),
            textArrayUpload: vi.fn(),
            dataIntegrityResponse: vi.fn(),
        };

        mockAuth = new Authentication();
        mockAuth.setToken('test-auth-token-123');

        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {});
        vi.spyOn(mockAuth, 'getToken').mockReturnValue('test-auth-token-123');

        dataIntegrity = new DataIntegrity(mockAuth);
        (dataIntegrity as any).httpClient = mockHttpClient;
        (dataIntegrity as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('fileUpload', () => {
        const mockFile = new Blob(['test content'], { type: 'application/pdf' }) as any;
        const mockData: FileUpload = {
            businessId: 'biz-123',
            file: mockFile,
            walletID: 'wallet-123',
            network: 'MAIN',
        };

        const mockResponse: DataIntegrityResponse = {
            txID: 'tx-123',
        };

        it('should successfully upload a file', async () => {
            mockValidator.fileUpload.mockReturnValue(true);
            mockValidator.dataIntegrityResponse.mockReturnValue({ txID: 'tx-123', txid: 'tx-123' });

            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 200,
            });

            const result = await dataIntegrity.fileUpload(mockData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.fileUpload).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/data-integrity/file',
                expect.any(FormData),
                businessHeaders,
                { walletID: 'wallet-123', network: 'MAIN' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('textUpload', () => {
        const mockData: TextUpload = {
            businessId: 'biz-123',
            hashed: 'false',
            text: 'Hello blockchain!',
            walletID: 'wallet-123',
            network: 'MAIN',
        };

        const mockResponse: DataIntegrityResponse = {
            txID: 'tx-456',
        };

        it('should successfully upload text as text/plain', async () => {
            mockValidator.textUpload.mockReturnValue(true);
            mockValidator.dataIntegrityResponse.mockReturnValue({ txID: 'tx-456', txid: 'tx-456' });

            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 200,
            });

            const result = await dataIntegrity.textUpload(mockData);

            expect(mockValidator.textUpload).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/data-integrity/text',
                'Hello blockchain!',
                { ...businessHeaders, 'Content-Type': 'text/plain' },
                { walletID: 'wallet-123', network: 'MAIN', hashed: 'false' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('textArrayUpload', () => {
        const mockData: TextArrayUpload = {
            businessId: 'biz-123',
            text: ['line one', 'line two'],
            walletID: 'wallet-123',
            network: 'TEST',
        };

        const mockResponse: DataIntegrityResponse = {
            txID: 'tx-789',
        };

        it('should successfully upload a text array', async () => {
            mockValidator.textArrayUpload.mockReturnValue(true);
            mockValidator.dataIntegrityResponse.mockReturnValue({ txID: 'tx-789', txid: 'tx-789' });

            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 200,
            });

            const result = await dataIntegrity.textArrayUpload(mockData);

            expect(mockValidator.textArrayUpload).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/data-integrity/text-array',
                ['line one', 'line two'],
                businessHeaders,
                { walletID: 'wallet-123', network: 'TEST' }
            );
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('authentication', () => {
        it('should throw error when not authenticated', async () => {
            const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(
                dataIntegrity.fileUpload({
                    file: new Blob(['x']) as any,
                })
            ).rejects.toThrow(authError);
            expect(mockHttpClient.post).not.toHaveBeenCalled();
        });
    });
});
