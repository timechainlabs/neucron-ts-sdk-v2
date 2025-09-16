import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NeucronSDK } from '../src/nuecron-sdk.js';
import type { LoginBody } from '../src/services/authentication/types.js';
import type { CreateWalletBody } from '../src/services/wallet/types.js';
import { vi } from "vitest";

vi.mock("axios", async (importOriginal) => {
    const actual = await importOriginal<typeof import("axios")>();
    return {
        ...actual,
        isAxiosError: actual.isAxiosError, // keep the real implementation
    };
});

// Test configuration interface
interface TestConfig {
    testUser: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        platform: 'NEUCRON' | 'ASSETYZER' | 'CERTIFICATE' | 'TICKETING';
    };
    testWallet: {
        walletName: string;
        paymailName: string;
    };
    environment: {
        skipIntegrationTests: boolean;
        logLevel: string;
    };
}

// Default test configuration (update these values for your tests)
const DEFAULT_TEST_CONFIG: TestConfig = {
    testUser: {
        email: 'shubhambhavsar3311@gmail.com', // UPDATE THIS
        password: 'Pass@123', // UPDATE THIS
        firstName: 'Test',
        lastName: 'User',
        platform: 'NEUCRON',
    },
    testWallet: {
        walletName: 'Test Wallet SDK',
        paymailName: 'testsdk',
    },
    environment: {
        skipIntegrationTests: false, // Set to false to enable integration tests
        logLevel: 'info',
    },
};

// Helper to check if we should run integration tests
const shouldRunIntegrationTests = () => {
    return (
        !DEFAULT_TEST_CONFIG.environment.skipIntegrationTests &&
        process.env.NODE_ENV !== 'ci' &&
        process.env.SKIP_INTEGRATION !== 'true'
        // DEFAULT_TEST_CONFIG.testUser.email !== 'your.real.test.email@example.com'
    );
};

// Conditional describe - skip if integration tests are disabled
const describeIntegration = shouldRunIntegrationTests() ? describe : describe.skip;

describeIntegration('Integration Tests - Real API', () => {
    let sdk: NeucronSDK;
    let authToken: string;
    let createdWalletId: string;

    beforeAll(async () => {
        sdk = new NeucronSDK();
        console.log('🧪 Starting integration tests with real API...');
        console.log('📧 Test user email:', DEFAULT_TEST_CONFIG.testUser.email);
    });

    afterAll(async () => {
        console.log('🏁 Integration tests completed');
    });

    describe('Authentication Integration', () => {
        it('should successfully login with real credentials', async () => {
            const loginData: LoginBody = {
                email: DEFAULT_TEST_CONFIG.testUser.email,
                password: DEFAULT_TEST_CONFIG.testUser.password,
            };

            console.log(`🔐 Attempting login for: ${loginData.email}`);

            const result = await sdk.auth.login(loginData);

            expect(result.data).toBeDefined();
            expect(result.data.token).toBeDefined();
            expect(typeof result.data.token).toBe('string');
            expect(result.data.token.length).toBeGreaterThan(0);
            expect(result.data.platforms).toBeDefined();
            expect(Array.isArray(result.data.platforms)).toBe(true);

            authToken = result.data.token;
            console.log('✅ Login successful, token received');
        }, 15000); // 15 second timeout for real API calls

        it('should fail login with invalid credentials', async () => {
            const invalidLoginData: LoginBody = {
                email: 'invalid@example.com',
                password: 'wrongpassword',
            };

            console.log('🔒 Testing login with invalid credentials...');

            await expect(sdk.auth.login(invalidLoginData)).rejects.toThrow();
            console.log('✅ Invalid login correctly rejected');
        }, 15000);

        it('should maintain token state after login', () => {
            expect(sdk.auth.getToken()).toBe(authToken);
            expect(sdk.auth.getToken().length).toBeGreaterThan(0);
            console.log('✅ Token state maintained correctly');
        });
    });

    describe('Wallet Integration', () => {
        it('should get wallet list after authentication', async () => {
            console.log('📋 Fetching wallet list...');

            const result = await sdk.wallet.walletList();

            expect(result.data).toBeDefined();
            expect(Array.isArray(result.data)).toBe(true); // Ensure it's an array
            expect(result.status).toBe(200);

            console.log(`✅ Wallet list retrieved successfully`);
            console.log(`📊 Found ${result.data.length} wallets`);
            if (result.data.length > 0) {
                console.log(`📊 Sample wallet:`, result.data[0]);
            }
        }, 15000);


        it('should create a new wallet', async () => {
            const createWalletData: CreateWalletBody = {
                walletName: `${DEFAULT_TEST_CONFIG.testWallet.walletName}_${Date.now()}`,
                paymailName: `${DEFAULT_TEST_CONFIG.testWallet.paymailName}${Date.now()}`,
            };

            console.log(`💼 Creating wallet: ${createWalletData.walletName}`);

            const result = await sdk.wallet.createWallet(createWalletData);

            expect(result.data).toBeDefined();
            expect(result.data.wallet_id).toBeDefined();
            expect(result.data.paymail_id).toBeDefined();
            expect(result.status).toBe(200);

            createdWalletId = result.data.wallet_id;
            console.log(`✅ Wallet created successfully with ID: ${createdWalletId}`);
            console.log(`📧 Paymail ID: ${result.data.paymail_id}`);
        }, 15000);
        it('should create wallet address', async () => {
            if (!createdWalletId) {
                // Fallback: get wallet ID from existing wallets
                const walletList = await sdk.wallet.walletList();
                if (walletList.data && walletList.data.length > 0) {
                    createdWalletId = walletList.data[0].wallet_id;
                    console.log(`📝 Using existing wallet ID: ${createdWalletId}`);
                } else {
                    throw new Error('No wallet ID available from previous test');
                }
            }

            console.log(`🏠 Creating address for wallet: ${createdWalletId}`);

            const result = await sdk.wallet.createAddress({
                walletID: createdWalletId,
            });

            expect(result.data).toBeDefined();
            expect(result.data.message).toBeDefined();
            expect(result.status).toBe(200);

            console.log(`✅ Address created successfully`);
            console.log(`📍 Response:`, JSON.stringify(result.data, null, 2));
        }, 15000);

        it('should get wallet address list', async () => {
            console.log('📍 Fetching wallet address list...');

            const result = await sdk.wallet.walletAddressList();

            expect(result.data).toBeDefined();
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.status).toBe(200);

            console.log(`✅ Address list retrieved successfully`);
            console.log(`📊 Found ${result.data.length} addresses`);

            if (result.data.length > 0) {
                console.log(`📍 Sample addresses:`, result.data.slice(0, 3));
            }
        }, 15000);

        it('should update default wallet', async () => {
            if (!createdWalletId) {
                // Same fallback logic
                const walletList = await sdk.wallet.walletList();
                if (walletList.data && walletList.data.length > 0) {
                    createdWalletId = walletList.data[0].wallet_id;
                    console.log(`📝 Using existing wallet ID: ${createdWalletId}`);
                } else {
                    throw new Error('No wallet ID available from previous test');
                }
            }

            console.log(`⭐ Setting wallet ${createdWalletId} as default...`);

            const result = await sdk.wallet.updateDefaultWallet({
                walletID: createdWalletId,
            });

            expect(result.data).toBeDefined();
            expect(result.data.message).toBeDefined();
            expect(result.status).toBe(200);

            console.log(`✅ Default wallet updated successfully`);
            console.log(`📝 Message: ${result.data.message}`);
        }, 15000);
    });

    describe('Error Handling Integration', () => {
        it('should handle unauthorized wallet operations', async () => {
            // Create a new SDK instance without authentication
            const unauthenticatedSdk = new NeucronSDK();

            console.log('🚫 Testing unauthorized wallet access...');

            await expect(unauthenticatedSdk.wallet.walletList()).rejects.toThrow();
            console.log('✅ Unauthorized access correctly blocked');
        }, 15000);

        it('should handle invalid wallet operations', async () => {
            console.log('❌ Testing invalid wallet operations...');

            // Try to create wallet with invalid data
            await expect(
                sdk.wallet.createWallet({
                    walletName: '', // Invalid empty name
                    paymailName: '',
                })
            ).rejects.toThrow();

            console.log('✅ Invalid wallet creation correctly rejected');
        }, 15000);
    });

    describe('Performance Tests', () => {
        it('should handle multiple concurrent wallet list requests', async () => {
            console.log('🚀 Testing concurrent wallet list requests...');

            const startTime = Date.now();

            // Make 5 concurrent requests
            const promises = Array(5)
                .fill(null)
                .map(() => sdk.wallet.walletList());
            const results = await Promise.all(promises);

            const endTime = Date.now();
            const duration = endTime - startTime;

            expect(results).toHaveLength(5);
            results.forEach((result) => {
                expect(result.status).toBe(200);
                expect(result.data).toBeDefined();
            });

            console.log(`✅ All 5 concurrent requests completed in ${duration}ms`);
            console.log(`⚡ Average response time: ${duration / 5}ms`);
        }, 30000);
    });
});

// Provide helpful information if integration tests are skipped
if (!shouldRunIntegrationTests()) {
    console.log('\n⚠️  Integration tests are SKIPPED.');
    console.log('ℹ️  To enable integration tests:');
    console.log('   1. Open tests/integration.test.ts');
    console.log('   2. Update DEFAULT_TEST_CONFIG with your real test credentials');
    console.log('   3. Set environment.skipIntegrationTests to false');
    console.log('   4. Run: npm run test integration.test.ts\n');
}
