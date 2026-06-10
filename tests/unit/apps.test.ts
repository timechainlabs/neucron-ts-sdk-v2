import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Apps } from '../../src/services/apps/index.js';
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
    HttpClient: vi.fn().mockImplementation(() => createMockHttpClient()),
}));

vi.mock('../../src/services/apps/validator.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        appsListResponse: vi.fn(),
        createApp: vi.fn(),
        createAppResponse: vi.fn(),
        getAppSecret: vi.fn(),
        appSecretResponse: vi.fn(),
    })),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Apps Service', () => {
    let apps: Apps;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            appsListResponse: vi.fn(),
            createApp: vi.fn(),
            createAppResponse: vi.fn(),
            getAppSecret: vi.fn(),
            appSecretResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        apps = new Apps(mockAuth);
        (apps as any).httpClient = mockHttpClient;
        (apps as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should list apps', async () => {
        const response = [{ app_id: 'app-1', app_name: 'My App' }];
        mockValidator.appsListResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

        const result = await apps.getApps({ businessId: BUSINESS_ID });

        expect(mockHttpClient.get).toHaveBeenCalledWith('/app/list', BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should create an app', async () => {
        const options = { businessId: BUSINESS_ID, appData: { app_name: 'New App' } };
        const response = { app_id: 'app-2' };
        mockValidator.createAppResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));

        const result = await apps.createApp(options);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/app', options.appData, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should get app secret', async () => {
        const options = { businessId: BUSINESS_ID, appId: 'app-1' };
        const response = { secret: 'secret-key' };
        mockValidator.appSecretResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

        const result = await apps.getAppSecret(options);

        expect(mockHttpClient.get).toHaveBeenCalledWith('/app/secret', BUSINESS_HEADERS, { appID: 'app-1' });
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        await expect(apps.getApps()).rejects.toThrow(authError);
    });
});
