import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DataIntegrity } from '../../src/services/data-integrity/index.js';
import { Authentication } from '../../src/services/authentication/index.js';
import { NeucronError } from '../../src/utils/errors/sdk-error.js';
import type {
    FileUpload,
    FileUploadResponse,
    TextUpload,
    TextUploadResponse,
} from '../../src/services/data-integrity/types.js';

// Store mock instances
let mockHttpClient: any;
let mockValidator: any;

// Mock HttpClient
vi.mock('../../src/utils/http/http-client.js', () => {
    const mockImplementation = () => ({
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    });

    return {
        HttpClient: vi.fn().mockImplementation(mockImplementation),
    };
});

// Mock Validator
vi.mock('../../src/services/data-integrity/validator.js', () => {
    const mockImplementation = () => ({
        fileUpload: vi.fn(),
        fileUploadResponse: vi.fn(),
        textUpload: vi.fn(),
        textUploadResponse: vi.fn(),
    });

    return {
        default: vi.fn().mockImplementation(mockImplementation),
    };
});

// Mock error handler
vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('DataIntegrity Service', () => {
    let dataIntegrity: DataIntegrity;
    let mockAuth: Authentication;

    beforeEach(() => {
        vi.clearAllMocks();

        mockHttpClient = {
            post: vi.fn(),
        };

        mockValidator = {
            fileUpload: vi.fn(),
            fileUploadResponse: vi.fn(),
            textUpload: vi.fn(),
            textUploadResponse: vi.fn(),
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
        const mockFile = new Blob(['test content'], { type: 'text/plain' }) as any;
        const mockData: FileUpload = {
            file: mockFile,
            walletID: 'wallet-123',
        };

        const mockResponse: FileUploadResponse = {
            txid: 'tx-123',
        };

        it('should successfully upload a file', async () => {
            mockValidator.fileUpload.mockReturnValue(true);
            mockValidator.fileUploadResponse.mockReturnValue(mockResponse);

            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 201,
            });

            const result = await dataIntegrity.fileUpload(mockData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.fileUpload).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/data-integrity/file',
                expect.any(FormData),
                { Authorization: 'test-auth-token-123' },
                { walletID: 'wallet-123' }
            );
            expect(mockValidator.fileUploadResponse).toHaveBeenCalledWith(mockResponse);
            expect(result.data).toEqual(mockResponse);
        });

        it('should accept React Native file objects', async () => {
            const reactNativeFile = {
                uri: 'file:///data/user/0/cache/document.pdf',
                name: 'document.pdf',
                type: 'application/pdf',
            };
            const rnUpload: FileUpload = {
                file: reactNativeFile,
                walletID: 'wallet-123',
            };

            mockValidator.fileUpload.mockReturnValue(true);
            mockValidator.fileUploadResponse.mockReturnValue(mockResponse);
            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 201,
            });

            const result = await dataIntegrity.fileUpload(rnUpload);
            expect(mockValidator.fileUpload).toHaveBeenCalledWith(rnUpload);
            expect(result.data).toEqual(mockResponse);
        });

        it('should throw error when not authenticated', async () => {
            const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(dataIntegrity.fileUpload(mockData)).rejects.toThrow(authError);
            expect(mockHttpClient.post).not.toHaveBeenCalled();
        });
    });

    describe('textUpload', () => {
        const mockData: TextUpload = {
            hashed: 'true',
            text: 'Hello blockchain!',
            walletID: 'wallet-123',
        };

        const mockResponse: TextUploadResponse = {
            txid: 'tx-456',
        };

        it('should successfully upload text', async () => {
            mockValidator.textUpload.mockReturnValue(true);
            mockValidator.textUploadResponse.mockReturnValue(mockResponse);

            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 201,
            });

            const result = await dataIntegrity.textUpload(mockData);

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.textUpload).toHaveBeenCalledWith(mockData);
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/data-integrity/text',
                { text: 'Hello blockchain!' },
                { Authorization: 'test-auth-token-123' },
                { hashed: 'true', walletID: 'wallet-123' }
            );
            expect(mockValidator.textUploadResponse).toHaveBeenCalledWith(mockResponse);
            expect(result.data).toEqual(mockResponse);
        });

        it('should throw error when not authenticated', async () => {
            const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(dataIntegrity.textUpload(mockData)).rejects.toThrow(authError);
            expect(mockHttpClient.post).not.toHaveBeenCalled();
        });
    });
});
