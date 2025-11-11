import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { Assets21 } from '../../src/services/asset21/index.js';
import { Authentication } from '../../src/services/authentication/index.js';
import Validator from '../../src/services/asset21/validator.js';
import type { IHttpClient } from '../../src/utils/http/types.js';

// Mock modules with factory functions
vi.mock('../../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn().mockImplementation(() => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    })),
}));

vi.mock('../../src/services/asset21/validator.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        // Input validation methods
        getAddressState: vi.fn().mockImplementation((params) => params),
        fetchBalance: vi.fn().mockImplementation((params) => params),
        systemConfig: vi.fn().mockImplementation((params) => params),
        getCustomers: vi.fn().mockImplementation((params) => params),
        deploy: vi.fn().mockImplementation((params) => params),
        registerPayload: vi.fn().mockImplementation((params) => params),
        createRequest: vi.fn().mockImplementation((params) => params),
        updateRequest: vi.fn().mockImplementation((params) => params),
        getRequest: vi.fn().mockImplementation((params) => params),
        syncTransaction: vi.fn().mockImplementation((params) => params),
        triggerSyncForAddresses: vi.fn().mockImplementation((params) => params),
        transfer: vi.fn().mockImplementation((params) => params),
        getUnspentUTXOs: vi.fn().mockImplementation((params) => params),
        getOutputInfo: vi.fn().mockImplementation((params) => params),

        // Response validation methods
        getAddressStateResponse: vi.fn().mockImplementation((response) => response),
        fetchBalanceResponse: vi.fn().mockImplementation((response) => response),
        systemConfigResponse: vi.fn().mockImplementation((response) => response),
        getCustomersResponse: vi.fn().mockImplementation((response) => response),
        deployResponse: vi.fn().mockImplementation((response) => response),
        registerResponse: vi.fn().mockImplementation((response) => response),
        createRequestResponse: vi.fn().mockImplementation((response) => response),
        updateRequestResponse: vi.fn().mockImplementation((response) => response),
        getRequestResponse: vi.fn().mockImplementation((response) => response),
        syncTransactionResponse: vi.fn().mockImplementation((response) => response),
        triggerSyncForAddressesResponse: vi.fn().mockImplementation((response) => response),
        transferResponse: vi.fn().mockImplementation((response) => response),
        getUnspentUTXOResponse: vi.fn().mockImplementation((response) => response),
        getOutputInfoResponse: vi.fn().mockImplementation((response) => response),
    })),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

// Import the actual implementation after setting up mocks
import { handleError } from '../../src/utils/errors/helper.js';

// Mock the validator module
vi.mock('../../src/services/asset21/validator.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        getAddressState: vi.fn(),
        // Add other validator methods as needed
    })),
}));

describe('Assets21 Service', () => {
    let assets21: Assets21;
    let mockAuth: {
        validate: Mock;
        getToken: Mock;
        token: string;
    };
    let mockHttpClient: {
        get: Mock;
        post: Mock;
        put: Mock;
        delete: Mock;
    };
    let mockValidator: InstanceType<typeof Validator>;

    beforeEach(async () => {
        vi.clearAllMocks();

        // Create fresh mocks for each test
        mockAuth = {
            validate: vi.fn(),
            getToken: vi.fn().mockReturnValue('test-token'),
            token: 'test-token',
        };

        // Create mock HttpClient
        mockHttpClient = {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        };

        // Get the mock validator from the factory
        const Validator = (await import('../../src/services/asset21/validator.js')).default;
        mockValidator = new Validator();

        // Create instance with proper type assertion for testing
        assets21 = new Assets21(mockAuth as unknown as Authentication);
        // @ts-expect-error - Mocking private property for testing
        assets21['httpClient'] = mockHttpClient as IHttpClient;
        // @ts-expect-error - Mocking private property for testing
        assets21['validator'] = mockValidator as ValidatorType;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getAddressState', () => {
        const mockOptions = { assetID: 'test-asset-id' };
        const mockResponse = {
            data: { address: 'test-address' },
            status: 200,
            statusText: 'OK',
        };
        const mockHeaders = {
            Authorization: 'test-token',
        };
        const mockParams = {
            assetID: 'test-asset-id',
        };

        beforeEach(() => {
            // Reset all mocks
            vi.clearAllMocks();

            // Set up auth mock
            mockAuth.validate = vi.fn();
            mockAuth.getToken = vi.fn().mockReturnValue('test-token');

            // Set up validator mock
            mockValidator.getAddressState = vi.fn();
            mockValidator.getAddressStateResponse = vi.fn();

            // Set up HTTP client mock
            mockHttpClient.get = vi.fn().mockResolvedValue(mockResponse);
        });

        it('should call getAddressState with correct parameters', async () => {
            const result = await assets21.getAddressState(mockOptions);

            // Verify auth was validated
            expect(mockAuth.validate).toHaveBeenCalled();

            // Verify validator was called with correct params
            expect(mockValidator.getAddressState).toHaveBeenCalledWith(mockOptions);

            // Verify HTTP client was called with correct parameters
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                expect.any(String), // path
                mockHeaders,
                mockParams
            );

            // Verify response validation
            expect(mockValidator.getAddressStateResponse).toHaveBeenCalledWith(mockResponse.data);

            // Verify the response
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            mockHttpClient.get.mockRejectedValueOnce(error);

            await expect(assets21.getAddressState(mockOptions)).rejects.toThrow(error);
            expect(handleError).toHaveBeenCalledWith(error);
        });
    });

    describe('fetchBalance', () => {
        const mockOptions = {
            assetID: 'test-asset-id',
            addresses: ['address1', 'address2'],
        };
        const mockResponse = {
            data: { balance: 100 },
            status: 200,
            statusText: 'OK',
        };
        const mockHeaders = {
            Authorization: 'test-token',
        };
        const mockParams = {
            assetID: 'test-asset-id',
        };

        beforeEach(() => {
            // Reset all mocks
            vi.clearAllMocks();

            // Set up auth mock
            mockAuth.validate = vi.fn();
            mockAuth.getToken = vi.fn().mockReturnValue('test-token');

            // Set up validator mock
            mockValidator.fetchBalance = vi.fn();
            mockValidator.fetchBalanceResponse = vi.fn();

            // Set up HTTP client mock
            mockHttpClient.post = vi.fn().mockResolvedValue(mockResponse);
        });

        it('should call fetchBalance with correct parameters', async () => {
            const result = await assets21.fetchBalance(mockOptions);

            // Verify auth was validated
            expect(mockAuth.validate).toHaveBeenCalled();

            // Verify validator was called with correct params
            expect(mockValidator.fetchBalance).toHaveBeenCalledWith(mockOptions);

            // Verify HTTP client was called with correct parameters
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                expect.any(String), // path
                mockOptions.addresses,
                mockHeaders,
                mockParams
            );

            // Verify response validation
            expect(mockValidator.fetchBalanceResponse).toHaveBeenCalledWith(mockResponse.data);

            // Verify the response
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            mockHttpClient.post.mockRejectedValueOnce(error);

            await expect(assets21.fetchBalance(mockOptions)).rejects.toThrow(error);
            expect(handleError).toHaveBeenCalledWith(error);
        });
    });

    describe('getSystemConfig', () => {
        const mockOptions = { assetID: 'test-asset-id' };
        const mockResponse = {
            data: { config: {} },
            status: 200,
            statusText: 'OK',
        };

        beforeEach(() => {
            // Reset all mocks
            vi.clearAllMocks();

            // Set up auth mock
            mockAuth.validate = vi.fn();
            mockAuth.getToken = vi.fn().mockReturnValue('test-token');

            // Set up validator mock
            mockValidator.systemConfig = vi.fn();
            mockValidator.systemConfigResponse = vi.fn();

            // Set up HTTP client mock
            mockHttpClient.get = vi.fn().mockResolvedValue(mockResponse);
        });

        it('should call getSystemConfig with correct parameters', async () => {
            const result = await assets21.getSystemConfig(mockOptions);

            // Verify auth was validated
            expect(mockAuth.validate).toHaveBeenCalled();

            // Verify validator was called with correct params
            expect(mockValidator.systemConfig).toHaveBeenCalledWith(mockOptions);

            // Verify HTTP client was called with correct parameters
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                expect.any(String), // path
                {}, // The actual implementation passes an empty object for headers
                mockOptions // The actual implementation passes options as params
            );

            // Verify response validation
            expect(mockValidator.systemConfigResponse).toHaveBeenCalledWith(mockResponse.data);

            // Verify the response
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            mockHttpClient.get.mockRejectedValueOnce(error);

            await expect(assets21.getSystemConfig(mockOptions)).rejects.toThrow(error);
            expect(handleError).toHaveBeenCalledWith(error);
        });
    });

    describe('getCustomers', () => {
        const mockOptions = { assetID: 'test-asset-id' };
        const mockResponse = {
            data: { customers: [] },
            status: 200,
            statusText: 'OK',
        };

        const mockParams = {
            assetID: 'test-asset-id',
        };

        beforeEach(() => {
            // Reset all mocks
            vi.clearAllMocks();

            // Set up auth mock
            mockAuth.validate = vi.fn();
            mockAuth.getToken = vi.fn().mockReturnValue('test-token');

            // Set up validator mock
            mockValidator.getCustomers = vi.fn();
            mockValidator.getCustomersResponse = vi.fn();

            // Set up HTTP client mock
            mockHttpClient.get = vi.fn().mockResolvedValue(mockResponse);
        });

        it('should call getCustomers with correct parameters', async () => {
            const result = await assets21.getCustomers(mockOptions);

            // Verify auth was validated
            expect(mockAuth.validate).toHaveBeenCalled();

            // Verify validator was called with correct params
            expect(mockValidator.getCustomers).toHaveBeenCalledWith(mockOptions);

            // Verify HTTP client was called with correct parameters
            expect(mockHttpClient.get).toHaveBeenCalledWith(
                expect.any(String), // path
                {
                    Authorization: 'test-token',
                    'X-Neucron-Team-ID': '',
                },
                mockParams
            );

            // Verify response validation
            expect(mockValidator.getCustomersResponse).toHaveBeenCalledWith(mockResponse.data);

            // Verify the response
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            mockHttpClient.get.mockRejectedValueOnce(error);

            await expect(assets21.getCustomers(mockOptions)).rejects.toThrow(error);
            expect(handleError).toHaveBeenCalledWith(error);
        });
    });

    describe('deploy', () => {
        const mockOptions = {
            assetID: 'test-asset-id',
            'X-Neucron-Team-ID': 'team-id',
        };
        const mockResponse = {
            data: { success: true },
            status: 200,
            statusText: 'OK',
        };
        const mockHeaders = {
            Authorization: 'test-token',
            'X-Neucron-Team-ID': 'team-id',
        };
        const mockParams = {
            assetID: 'test-asset-id',
        };

        beforeEach(() => {
            // Reset all mocks
            vi.clearAllMocks();

            // Set up auth mock
            mockAuth.validate = vi.fn();
            mockAuth.getToken = vi.fn().mockReturnValue('test-token');

            // Set up validator mock
            mockValidator.deploy = vi.fn();
            mockValidator.deployResponse = vi.fn();

            // Set up HTTP client mock
            mockHttpClient.post = vi.fn().mockResolvedValue(mockResponse);
        });

        it('should call deploy with correct parameters', async () => {
            const result = await assets21.deploy(mockOptions);

            // Verify auth was validated
            expect(mockAuth.validate).toHaveBeenCalled();

            // Verify validator was called with correct params
            expect(mockValidator.deploy).toHaveBeenCalledWith(mockOptions);

            // Verify HTTP client was called with correct parameters
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                expect.any(String), // path
                null, // The actual implementation passes null as the body
                mockHeaders,
                mockParams
            );

            // Verify response validation
            expect(mockValidator.deployResponse).toHaveBeenCalledWith(mockResponse.data);

            // Verify the response
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            mockHttpClient.post.mockRejectedValueOnce(error);

            await expect(assets21.deploy(mockOptions)).rejects.toThrow(error);
            expect(handleError).toHaveBeenCalledWith(error);
        });
    });

    describe('register', () => {
        const mockOptions = {
            'X-Neucron-Team-ID': 'team-id',
            registerPayloadBody: {
                symbol: 'TST',
                asset_name: 'Test Asset',
                image_url: 'https://test.com/icon.png',
                legal_term: 'Test legal terms',
                token_detail: {
                    decimal: 8,
                    feeStructure: [{ fee: 0.1, max: 1000, min: 1 }],
                    icon: 'test-icon',
                    request_config: {
                        min_approval: 1,
                        min_rejection: 1,
                    },
                },
                total_supply: 1000000,
                wallet_id: 'test-wallet-id',
            },
        };
        const mockResponse = {
            data: { success: true },
            status: 200,
            statusText: 'OK',
        };
        const mockHeaders = {
            Authorization: 'test-token',
            'X-Neucron-Team-ID': 'team-id',
        };

        beforeEach(() => {
            // Reset all mocks
            vi.clearAllMocks();

            // Set up auth mock
            mockAuth.validate = vi.fn();
            mockAuth.getToken = vi.fn().mockReturnValue('test-token');

            // Set up validator mock
            mockValidator.registerPayload = vi.fn();
            mockValidator.registerResponse = vi.fn();

            // Set up HTTP client mock
            mockHttpClient.post = vi.fn().mockResolvedValue(mockResponse);
        });

        it('should call register with correct parameters', async () => {
            const result = await assets21.register(mockOptions);

            // Verify auth was validated
            expect(mockAuth.validate).toHaveBeenCalled();

            // Verify validator was called with correct params
            expect(mockValidator.registerPayload).toHaveBeenCalledWith(mockOptions);

            // Verify HTTP client was called with correct parameters
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                expect.any(String), // path
                mockOptions.registerPayloadBody,
                mockHeaders
            );

            // Verify response validation
            expect(mockValidator.registerResponse).toHaveBeenCalledWith(mockResponse.data);

            // Verify the response
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            mockHttpClient.post.mockRejectedValueOnce(error);

            await expect(assets21.register(mockOptions)).rejects.toThrow(error);
            expect(handleError).toHaveBeenCalledWith(error);
        });
    });

    describe('createRequest', () => {
        const mockOptions = {
            assetId: 'test-asset-id',
            state: 'MINT' as const,
            approvalsRequired: 1,
            rejectionsRequired: 1,
            requestDetails: {
                UtxoId: 'test-utxo-id',
                address: 'test-address',
                amount: 100,
                email: 'test@example.com',
            },
            'X-Neucron-Team-ID': 'team-id',
        };
        const mockResponse = {
            data: { message: 'Request created' },
            status: 200,
            statusText: 'OK',
        };
        // const mockHeaders = {
        //   Authorization: 'test-token',
        //   'X-Neucron-Team-ID': 'team-id'
        // };

        beforeEach(() => {
            // Reset all mocks
            vi.clearAllMocks();

            // Set up auth mock
            mockAuth.validate = vi.fn();
            mockAuth.getToken = vi.fn().mockReturnValue('test-token');

            // Set up validator mock
            mockValidator.createRequest = vi.fn();
            mockValidator.createRequestResponse = vi.fn();

            // Set up HTTP client mock
            mockHttpClient.post = vi.fn().mockResolvedValue(mockResponse);
        });

        it('should call createRequest with correct parameters', async () => {
            const result = await assets21.createRequest(mockOptions);

            // Verify auth was validated
            expect(mockAuth.validate).toHaveBeenCalled();

            // Verify validator was called with correct params
            expect(mockValidator.createRequest).toHaveBeenCalledWith(mockOptions);

            // Verify HTTP client was called with correct parameters
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                expect.any(String), // path
                {
                    ...mockOptions,
                    'X-Neucron-Team-ID': 'team-id',
                },
                {
                    Authorization: 'test-token',
                }
            );

            // Verify response validation
            expect(mockValidator.createRequestResponse).toHaveBeenCalledWith(mockResponse.data);

            // Verify the response
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            mockHttpClient.post.mockRejectedValueOnce(error);

            await expect(assets21.createRequest(mockOptions)).rejects.toThrow(error);
            expect(handleError).toHaveBeenCalledWith(error);
        });
    });

    describe('updateRequest', () => {
        const mockOptions = {
            action: 'APPROVE',
            assetId: 'test-asset-id',
            requestId: 'req-123',
            'X-Neucron-Team-ID': 'team-id',
        };
        const mockResponse = {
            data: { message: 'Request updated' },
            status: 200,
            statusText: 'OK',
        };

        // const mockHeaders = {
        //   Authorization: 'test-token',
        //   'X-Neucron-Team-ID': 'team-id'
        // };
        // const mockBody = {
        //   action: 'APPROVE',
        //   assetId: 'test-asset-id',
        //   requestId: 'req-123'
        // };

        beforeEach(() => {
            // Reset all mocks
            vi.clearAllMocks();

            // Set up auth mock
            mockAuth.validate = vi.fn();
            mockAuth.getToken = vi.fn().mockReturnValue('test-token');

            // Set up validator mock
            mockValidator.updateRequest = vi.fn();
            mockValidator.updateRequestResponse = vi.fn();

            // Set up HTTP client mock
            mockHttpClient.put = vi.fn().mockResolvedValue(mockResponse);
        });

        it('should call updateRequest with correct parameters', async () => {
            const result = await assets21.updateRequest(mockOptions);

            // Verify auth was validated
            expect(mockAuth.validate).toHaveBeenCalled();

            // Verify validator was called with correct params
            expect(mockValidator.updateRequest).toHaveBeenCalledWith(mockOptions);

            // Verify HTTP client was called with correct parameters
            expect(mockHttpClient.put).toHaveBeenCalledWith(
                '/asset21/request',
                {
                    action: 'APPROVE',
                    assetId: 'test-asset-id',
                    requestId: 'req-123',
                    'X-Neucron-Team-ID': 'team-id',
                },
                {
                    Authorization: 'test-token',
                }
            );

            // Verify response validation
            expect(mockValidator.updateRequestResponse).toHaveBeenCalledWith(mockResponse.data);

            // Verify the response
            expect(result).toEqual(mockResponse);
        });

        it('should handle errors', async () => {
            const error = new Error('Test error');
            mockHttpClient.put.mockRejectedValueOnce(error);

            await expect(assets21.updateRequest(mockOptions)).rejects.toThrow(error);
            expect(handleError).toHaveBeenCalledWith(error);
        });
    });
});
