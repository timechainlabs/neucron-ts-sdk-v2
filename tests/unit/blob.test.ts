import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Blob as BlobService } from '../../src/services/blob/index.js';
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

vi.mock('../../src/services/blob/validator.js', () => ({
    default: vi.fn().mockImplementation(function () {
        return {
            uploadDocument: vi.fn(),
            uploadDocumentResponse: vi.fn(),
        };
    }),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Blob Service', () => {
    let blob: BlobService;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            uploadDocument: vi.fn(),
            uploadDocumentResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        blob = new BlobService(mockAuth);
        (blob as any).httpClient = mockHttpClient;
        (blob as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should upload a document', async () => {
        const file = new globalThis.Blob(['test'], { type: 'application/pdf' });
        const options = { businessId: BUSINESS_ID, file };
        const response = { url: 'https://cdn.example.com/doc.pdf' };
        mockValidator.uploadDocumentResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));

        const result = await blob.uploadDocument(options);

        expect(mockValidator.uploadDocument).toHaveBeenCalledWith(options);
        expect(mockHttpClient.post).toHaveBeenCalledWith(
            '/blob/document/upload',
            expect.any(FormData),
            BUSINESS_HEADERS
        );
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        const file = new globalThis.Blob(['test'], { type: 'application/pdf' });
        await expect(blob.uploadDocument({ businessId: BUSINESS_ID, file })).rejects.toThrow(authError);
    });
});
