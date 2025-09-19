import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Pay } from '../src/services/pay/index.js';
import { Authentication } from '../src/services/authentication/index.js';
import { NeucronError } from '../src/utils/errors/sdk-error.js';
import type { PayRequestInputTest, PayRequestInput, PayResponse } from '../src/services/pay/types.js';
import { ASSET_IDS } from '../src/utils/constants/asset.js';

// Store mock instances
let mockHttpClient: any;
let mockValidator: any;

function asPayRequestInput(input: PayRequestInputTest): PayRequestInput {
    return input as unknown as PayRequestInput;
}

// Mock HttpClient
vi.mock('../src/utils/http/http-client.js', () => {
    const mockImplementation = () => ({
        post: vi.fn(),
    });

    return {
        HttpClient: vi.fn().mockImplementation(mockImplementation),
    };
});

// Mock Validator
vi.mock('../src/services/pay/validator.js', () => {
    const mockImplementation = () => ({
        payWithAddress: vi.fn(),
        payWithEmail: vi.fn(),
        payWithPaymail: vi.fn(),
        payResponse: vi.fn(),
    });

    return {
        default: vi.fn().mockImplementation(mockImplementation),
    };
});

// Mock error handler
vi.mock('../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Pay Service', () => {
    let pay: Pay;
    let mockAuth: Authentication;

    beforeEach(() => {
        vi.clearAllMocks();

        mockHttpClient = {
            post: vi.fn(),
        };

        mockValidator = {
            payWithAddress: vi.fn(),
            payWithEmail: vi.fn(),
            payWithPaymail: vi.fn(),
            payResponse: vi.fn(),
        };

        mockAuth = new Authentication();
        mockAuth.setToken('test-auth-token-123');

        vi.spyOn(mockAuth, 'validate').mockImplementation(() => { });
        vi.spyOn(mockAuth, 'getToken').mockReturnValue('test-auth-token-123');

        pay = new Pay(mockAuth);
        (pay as any).httpClient = mockHttpClient;
        (pay as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('payWithAddress', () => {
        const mockData: PayRequestInputTest = {
            walletID: 'wallet-123',
            assetName: 'BSV',
            transfer_destinations: [
                { amount: 100, address: '1BitcoinAddressTest' },
            ],
        };

        const mockResponse: PayResponse = [
            'tx-123',
        ];

        it('should successfully execute payWithAddress', async () => {
            mockValidator.payWithAddress.mockReturnValue(true);
            mockValidator.payResponse.mockReturnValue(true);

            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 201,
            });

            const result = await pay.payWithAddress(asPayRequestInput(mockData));

            expect(mockAuth.validate).toHaveBeenCalled();
            expect(mockValidator.payWithAddress).toHaveBeenCalledWith({
                walletID: 'wallet-123',
                asset_id: ASSET_IDS['BSV'],
                transfer_destinations: mockData.transfer_destinations,
            });
            expect(mockHttpClient.post).toHaveBeenCalledWith(
                '/asset/transfer', // from Routes.ASSET.TRANSFER
                {
                    asset_id: ASSET_IDS['BSV'],
                    transfer_destinations: mockData.transfer_destinations,
                },
                { Authorization: 'test-auth-token-123' },
                { walletID: 'wallet-123' }
            );
            expect(mockValidator.payResponse).toHaveBeenCalledWith(mockResponse);
            expect(result.data).toEqual(mockResponse);
        });

        it('should throw error for unsupported asset', async () => {
            const badData: PayRequestInputTest = {
                walletID: 'wallet-123',
                assetName: 'FAKE_ASSET',
                transfer_destinations: [
                    { amount: 50, address: 'fake-address' },
                ],
            };

            await expect(pay.payWithAddress(asPayRequestInput(badData))).rejects.toThrow(
                /Unsupported asset/
            );
            expect(mockHttpClient.post).not.toHaveBeenCalled();
        });

        it('should throw error when not authenticated', async () => {
            const authError = new NeucronError(
                'Unauthorized',
                new Error('No token'),
                { type: 'internal' }
            );
            vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
                throw authError;
            });

            await expect(pay.payWithAddress(asPayRequestInput(mockData))).rejects.toThrow(authError);
            expect(mockHttpClient.post).not.toHaveBeenCalled();
        });
    });

    describe('payWithEmail', () => {
        const mockData: PayRequestInputTest = {
            walletID: 'wallet-123',
            assetName: 'BSV',
            transfer_destinations: [
                { amount: 50, email: 'test@example.com' },
            ],
        };

        const mockResponse: PayResponse = [
            'tx-456',
        ];

        it('should successfully execute payWithEmail', async () => {
            mockValidator.payWithEmail.mockReturnValue(true);
            mockValidator.payResponse.mockReturnValue(true);

            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 201,
            });

            const result = await pay.payWithEmail(asPayRequestInput(mockData));

            expect(mockValidator.payWithEmail).toHaveBeenCalled();
            expect(mockValidator.payResponse).toHaveBeenCalledWith(mockResponse);
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('payWithPaymail', () => {
        const mockData: PayRequestInputTest = {
            walletID: 'wallet-123',
            assetName: 'BSV',
            transfer_destinations: [
                { amount: 75, paymail: 'user@paymail.com' },
            ],
        };

        const mockResponse: PayResponse = [
            'tx-789',
        ];

        it('should successfully execute payWithPaymail', async () => {
            mockValidator.payWithPaymail.mockReturnValue(true);
            mockValidator.payResponse.mockReturnValue(true);

            mockHttpClient.post.mockResolvedValue({
                data: mockResponse,
                status: 201,
            });

            const result = await pay.payWithPaymail(asPayRequestInput(mockData));

            expect(mockValidator.payWithPaymail).toHaveBeenCalled();
            expect(mockValidator.payResponse).toHaveBeenCalledWith(mockResponse);
            expect(result.data).toEqual(mockResponse);
        });
    });
});
