import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Utility } from '../src/services/utility/index.js';
import { Authentication } from '../src/services/authentication/index.js';
import { NeucronError } from '../src/utils/errors/sdk-error.js';
import type {
  CreateUtility,
  CreateUtilityResponse,
  UpdateUtility,
  UpdateUtilityResponse,
  MintUtility,
  MintUtilityResponse,
  RedeemUtility,
  RedeemUtilityResponse,
} from '../src/services/utility/types.js';

// Store mock instances
let mockHttpClient: any;
let mockValidator: any;

// Mock HttpClient
vi.mock('../src/utils/http/http-client.js', () => {
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
vi.mock('../src/services/utility/validator.js', () => {
  const mockImplementation = () => ({
    createUtility: vi.fn(),
    createUtilityResponse: vi.fn(),
    updateUtility: vi.fn(),
    updateUtilityResponse: vi.fn(),
    mintUtility: vi.fn(),
    mintUtilityResponse: vi.fn(),
    redeemUtility: vi.fn(),
    redeemUtilityResponse: vi.fn(),
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

describe('Utility Service', () => {
  let utility: Utility;
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
      createUtility: vi.fn(),
      createUtilityResponse: vi.fn(),
      updateUtility: vi.fn(),
      updateUtilityResponse: vi.fn(),
      mintUtility: vi.fn(),
      mintUtilityResponse: vi.fn(),
      redeemUtility: vi.fn(),
      redeemUtilityResponse: vi.fn(),
    };

    mockAuth = new Authentication();
    mockAuth.setToken('test-auth-token-123');

    vi.spyOn(mockAuth, 'validate').mockImplementation(() => { });
    vi.spyOn(mockAuth, 'getToken').mockReturnValue('test-auth-token-123');

    utility = new Utility(mockAuth);
    (utility as any).httpClient = mockHttpClient;
    (utility as any).validator = mockValidator;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Create Utility', () => {
 const mockData: CreateUtility = {
        asset_name: "Utility Token",
        asset_type: "UTILITY", // Required field that was missing
        protocol: "STAS-20",
        symbol: "UTIL",
        image_url: "https://example.com/logo.png",
        total_supply: 1000000,
        legal_term: "Standard legal terms for utility token", // Required field that was missing
        wallet_id: "wallet-123", // Optional but good to include
        expires_at: "2025-12-31T23:59:59.000Z", // Optional ISO datetime
        tokenDetail: { // This is the correct field name, not 'properties'
            name: "Utility Token",
            protocolId: "STAS-20",
            symbol: "UTIL",
            description: "Test utility token for SDK testing",
            image: "https://example.com/logo.png",
            totalSupply: 1000000,
            decimals: 2,
            satsPerToken: 100,
            properties: {
                issuer: {
                    email: "issuer@example.com",
                    governingLaw: "US Law",
                    issuerCountry: "US",
                    jurisdiction: "Delaware",
                    legalForm: "LLC",
                    organisation: "UtilityOrg",
                },
                legal: {
                    licenceId: "LIC-12345",
                    terms: "Standard utility terms",
                },
                meta: {
                    schemaId: "SCHEMA-123",
                    website: "https://utility.org",
                    legal: {
                        terms: "Meta-level terms",
                    },
                    media: [
                        {
                            URI: "https://example.com/media.png",
                            altURI: "https://alt.example.com/media.png",
                            type: "image/png",
                        },
                    ],
                },
            },
        },
    };
    const mockResponse: CreateUtilityResponse = {
      assetID: 'util-123'
    };

    it('should successfully create a utility', async () => {
      mockValidator.createUtility.mockReturnValue(true);
      mockValidator.createUtilityResponse.mockReturnValue(mockResponse);

      mockHttpClient.post.mockResolvedValue({
        data: mockResponse,
        status: 201,
      });

      const result = await utility.createUtility(mockData);

      expect(mockAuth.validate).toHaveBeenCalled();
      expect(mockValidator.createUtility).toHaveBeenCalledWith(mockData);
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/utility/register',
        mockData,
        { Authorization: 'test-auth-token-123' }
      );
      expect(mockValidator.createUtilityResponse).toHaveBeenCalledWith(mockResponse);
      expect(result.data).toEqual(mockResponse);
    });

    it('should throw error when not authenticated', async () => {
      const authError = new NeucronError('Unauthorized', new Error('No token'), { type: 'internal' });
      vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
        throw authError;
      });

      await expect(utility.createUtility(mockData)).rejects.toThrow(authError);
      expect(mockHttpClient.post).not.toHaveBeenCalled();
    });
  });

  describe('Update Utility', () => {
    const mockData: UpdateUtility = {
      asset_id: 'util-123'
    };

    const mockResponse: UpdateUtilityResponse = {
      message: 'Utility updated successfully',
    };

    it('should successfully update a utility', async () => {
      mockValidator.updateUtility.mockReturnValue(true);
      mockValidator.updateUtilityResponse.mockReturnValue(mockResponse);

      mockHttpClient.put.mockResolvedValue({
        data: mockResponse,
        status: 200,
      });

      const result = await utility.updateUtility(mockData);

      expect(mockAuth.validate).toHaveBeenCalled();
      expect(mockValidator.updateUtility).toHaveBeenCalledWith(mockData);
      expect(mockHttpClient.put).toHaveBeenCalledWith(
        '/utility/update',
        mockData,
        { Authorization: 'test-auth-token-123' }
      );
      expect(mockValidator.updateUtilityResponse).toHaveBeenCalledWith(mockResponse);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('Mint Utility', () => {
    const mockData: MintUtility = {
      assetID: 'asset-123',
    };

    const mockResponse: MintUtilityResponse = {
      txID: 'tx-123',
    };

    it('should successfully mint utility', async () => {
      mockValidator.mintUtility.mockReturnValue(true);
      mockValidator.mintUtilityResponse.mockReturnValue(mockResponse);

      mockHttpClient.post.mockResolvedValue({
        data: mockResponse,
        status: 201,
      });

      const result = await utility.mint(mockData);

      expect(mockAuth.validate).toHaveBeenCalled();
      expect(mockValidator.mintUtility).toHaveBeenCalledWith(mockData);
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/utility/mint',
        null,
        { Authorization: 'test-auth-token-123' },
        { assetID: 'asset-123' }
      );
      expect(mockValidator.mintUtilityResponse).toHaveBeenCalledWith(mockResponse);
      expect(result.data).toEqual(mockResponse);
    });
  });

  describe('Redeem Utility', () => {
    const mockData: RedeemUtility = {
      utxoID: 'utxo-123',
    };

    const mockResponse: RedeemUtilityResponse = {
      message: 'Utility redeemed successfully',
    };

    it('should successfully redeem utility', async () => {
      mockValidator.redeemUtility.mockReturnValue(true);
      mockValidator.redeemUtilityResponse.mockReturnValue(mockResponse);

      mockHttpClient.post.mockResolvedValue({
        data: mockResponse,
        status: 201,
      });

      const result = await utility.redeem(mockData);

      expect(mockAuth.validate).toHaveBeenCalled();
      expect(mockValidator.redeemUtility).toHaveBeenCalledWith(mockData);
      expect(mockHttpClient.post).toHaveBeenCalledWith(
        '/utility/redeem',
        null,
        { Authorization: 'test-auth-token-123' },
        { utxoID: 'utxo-123' }
      );
      expect(mockValidator.redeemUtilityResponse).toHaveBeenCalledWith(mockResponse);
      expect(result.data).toEqual(mockResponse);
    });
  });
});
