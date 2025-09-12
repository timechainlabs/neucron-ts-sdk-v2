import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Authentication } from '../src/services/authentication/index.js';
import { NeucronError } from '../src/utils/errors/sdk-error.js';
import type { LoginBody, SignUpBody, LoginResponse, SignupResponse } from '../src/services/authentication/types.js';

// --- Mock HttpClient ---
const mockHttpClientInstance = {
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};
vi.mock('../src/utils/http/http-client.js', () => ({
  HttpClient: vi.fn(() => mockHttpClientInstance),
}));

// --- Mock Validator ---
const mockValidatorInstance = {
  signUp: vi.fn(),
  signUpResponse: vi.fn(),
  login: vi.fn(),
  loginResponse: vi.fn(),
};
vi.mock('../src/services/authentication/validator.js', () => ({
  default: vi.fn(() => mockValidatorInstance),
}));

// --- Mock error handler ---
vi.mock('../src/utils/errors/helper.js', () => ({
  handleError: vi.fn((err) => {
    throw err;
  }),
}));

describe('Authentication Service', () => {
  let auth: Authentication;

  beforeEach(() => {
    vi.clearAllMocks();
    auth = new Authentication();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Token Management', () => {
    it('should initialize with empty token', () => {
      expect(auth.getToken()).toBe('');
    });

    it('should initialize with provided token from config', () => {
      const config = { authToken: 'test-token-123' };
      const authWithToken = new Authentication(config);
      expect(authWithToken.getToken()).toBe('test-token-123');
    });

    it('should set and get token correctly', () => {
      const testToken = 'new-test-token';
      auth.setToken(testToken);
      expect(auth.getToken()).toBe(testToken);
    });
  });

  describe('Validation', () => {
    it('should throw error when token is not set', () => {
      expect(() => auth.validate()).toThrow(NeucronError);
      expect(() => auth.validate()).toThrow(
        'Unauthorized to access this method, login before proceeding'
      );
    });

    it('should not throw error when token is set', () => {
      auth.setToken('valid-token');
      expect(() => auth.validate()).not.toThrow();
    });
  });

  describe('Sign Up', () => {
    const mockSignUpData: SignUpBody = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      platform: 'NEUCRON',
    };

    const mockSignUpResponse: SignupResponse = {
      paymail_id: 'test@paymail.com',
      token: 'signup-token-123',
      user_id: 'user-123',
      wallet_id: 'wallet-123',
    };

    it('should successfully sign up a user', async () => {
      mockHttpClientInstance.post.mockResolvedValue({
        data: mockSignUpResponse,
        status: 201,
        statusText: 'Created',
      });

      const result = await auth.signUp(mockSignUpData);

      expect(mockValidatorInstance.signUp).toHaveBeenCalledWith(mockSignUpData);
      expect(mockHttpClientInstance.post).toHaveBeenCalledWith('/auth/signup', mockSignUpData);
      expect(mockValidatorInstance.signUpResponse).toHaveBeenCalledWith(mockSignUpResponse);
      expect(result.data).toEqual(mockSignUpResponse);
    });

    it('should handle sign up validation errors', async () => {
      const validationError = new Error('Invalid email format');
      mockValidatorInstance.signUp.mockImplementation(() => {
        throw validationError;
      });

      await expect(auth.signUp(mockSignUpData)).rejects.toThrow(validationError);
      expect(mockHttpClientInstance.post).not.toHaveBeenCalled();
    });

    it('should handle HTTP errors during sign up', async () => {
      const httpError = new Error('Network error');
      mockHttpClientInstance.post.mockRejectedValue(httpError);

      await expect(auth.signUp(mockSignUpData)).rejects.toThrow(httpError);
      expect(mockValidatorInstance.signUp).toHaveBeenCalledWith(mockSignUpData);
    });
  });

  describe('Login', () => {
    const mockLoginData: LoginBody = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockLoginResponse: LoginResponse = {
      token: 'jwt-token-123',
      platforms: ['NEUCRON', 'ASSETYZER'],
    };

    it('should successfully login and set token', async () => {
      mockHttpClientInstance.post.mockResolvedValue({
        data: mockLoginResponse,
        status: 200,
        statusText: 'OK',
      });

      const result = await auth.login(mockLoginData);

      expect(mockValidatorInstance.login).toHaveBeenCalledWith(mockLoginData);
      expect(mockHttpClientInstance.post).toHaveBeenCalledWith('/auth/login', mockLoginData);
      expect(mockValidatorInstance.loginResponse).toHaveBeenCalledWith(mockLoginResponse);
      expect(result.data).toEqual(mockLoginResponse);
      expect(auth.getToken()).toBe('jwt-token-123');
    });

    it('should handle login validation errors', async () => {
      const validationError = new Error('Invalid credentials format');
      mockValidatorInstance.login.mockImplementation(() => {
        throw validationError;
      });

      await expect(auth.login(mockLoginData)).rejects.toThrow(validationError);
      expect(mockHttpClientInstance.post).not.toHaveBeenCalled();
      expect(auth.getToken()).toBe('');
    });

    it('should handle HTTP errors during login', async () => {
      const httpError = new Error('Invalid credentials');
      mockHttpClientInstance.post.mockRejectedValue(httpError);

      await expect(auth.login(mockLoginData)).rejects.toThrow(httpError);
      expect(mockValidatorInstance.login).toHaveBeenCalledWith(mockLoginData);
      expect(auth.getToken()).toBe('');
    });

    it('should handle response validation errors', async () => {
      mockHttpClientInstance.post.mockResolvedValue({
        data: mockLoginResponse,
        status: 200,
        statusText: 'OK',
      });

      const responseValidationError = new Error('Invalid response format');
      mockValidatorInstance.loginResponse.mockImplementation(() => {
        throw responseValidationError;
      });

      await expect(auth.login(mockLoginData)).rejects.toThrow(responseValidationError);
      expect(auth.getToken()).toBe(''); // token is already set
    });
  });

  describe('Integration Tests', () => {
    it('should maintain token state across multiple operations', async () => {
      const loginData: LoginBody = {
        email: 'test@example.com',
        password: 'password123',
      };

      const loginResponse: LoginResponse = {
        token: 'integration-token-123',
        platforms: ['NEUCRON'],
      };

      mockHttpClientInstance.post.mockResolvedValue({
        data: loginResponse,
        status: 200,
        statusText: 'OK',
      });

      await auth.login(loginData);
      expect(auth.getToken()).toBe('integration-token-123');

      expect(() => auth.validate()).not.toThrow();
      expect(auth.getToken()).toBe('integration-token-123');
    });
  });
});
