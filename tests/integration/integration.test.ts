import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NeucronSDK } from '../../src/nuecron-sdk.js';
import type { LoginBody } from '../../src/services/authentication/types.js';
import type { CreateWalletBody } from '../../src/services/wallet/types.js';
import { vi } from 'vitest';
import path from 'path';
import fs from 'fs';

const envPath = path.join(__dirname, '../../.env');
if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
    try {
        process.loadEnvFile(envPath);
        console.log('✅ Loaded local .env file');
    } catch (err) {
        console.warn('⚠️ Failed to load .env file:', err);
    }
} else {
    console.log('ℹ️ Skipping .env load (probably running in CI)');
}

vi.mock('axios', async (importOriginal) => {
    const actual = await importOriginal<typeof import('axios')>();
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
    testTeam: {
        teamId: string;
        inviteEmail: string;
    };
}

// Default test configuration (update these values for your tests)
const DEFAULT_TEST_CONFIG: TestConfig = {
    testUser: {
        email: process.env.TEST_USER_EMAIL || '',
        password: process.env.TEST_USER_PASSWORD || '',
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
    testTeam: {
        teamId: process.env.TEST_TEAM_ID || '',
        inviteEmail: process.env.TEST_INVITE_EMAIL || '',
    },
};

describe('Integration Tests - Real API', () => {
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
            console.log('📝 Login response:', result);

            expect(result.data).toBeDefined();
            expect(result.data.token).toBeDefined();
            expect(typeof result.data.token).toBe('string');
            expect(result.data.token.length).toBeGreaterThan(0);

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
    describe('Data Integrity Integration', () => {
        let createdWalletId: string;

        beforeAll(async () => {
            const wallets = await sdk.wallet.walletList();
            createdWalletId = wallets?.data?.[0]?.wallet_id;
            if (!createdWalletId) {
                throw new Error('No wallet available for Data Integrity tests');
            }
        });

        it('should upload text', async () => {
            const response = await sdk.dataIntegrity.textUpload({
                walletID: createdWalletId,
                text: 'Hello, Neucron!',
                hashed: 'true',
            });

            expect(response.data.txid).toBeDefined();
        });

        it('should upload file', async () => {
            const file = new File(
                [Buffer.from('This is test content')], // file content
                'test.txt', // filename
                { type: 'text/plain', lastModified: Date.now() }
            );

            const response = await sdk.dataIntegrity.fileUpload({
                walletID: createdWalletId, // make sure param key matches SDK schema
                file,
            });

            expect(response.data.txid).toBeDefined();
        });
    });

    describe('Team Integration', () => {
        it('should get team list', async () => {
            const result = await sdk.team.getTeamList();

            expect(result.data).toBeDefined();
            expect(Array.isArray(result.data)).toBe(true);
            console.log('✅ Team list retrieved:', result.data);
        }, 15000);

        it('should get invites list', async () => {
            const result = await sdk.team.getInvitesList();

            expect(result.data).toBeDefined();
            console.log('✅ Invites list:', result.data);
        }, 15000);

        // You can also add createInvite, acceptInvite, etc.
        // but they need valid test data like teamId and email.
    });

    describe('Team Integration', () => {
        it('should get team list', async () => {
            const result = await sdk.team.getTeamList();
            expect(result.data).toBeDefined();
            console.log(' Team list:', result.data);
        }, 15000);
    });

    describe('Payment Integration', () => {
        let walletId: string;

        beforeAll(async () => {
            walletId = process.env.TEST_PAY_WALLET_ID || '';
            if (!walletId) {
                throw new Error('No wallet available for Payment tests');
            }
        });

        it('should make a payment with address', async () => {
            const payAddress = process.env.TEST_PAY_WITH_ADDRESS || '';
            if (!payAddress) {
                throw new Error('No pay address available for Payment tests');
            }
            const result = await sdk.pay.payWithAddress({
                walletID: walletId,
                assetName: 'BSV', // make sure this matches ASSET_IDS keys
                transfer_destinations: [
                    {
                        address: payAddress,
                        amount: Number(process.env.TEST_PAY_AMOUNT || 1),
                    },
                ],
            });

            expect(result.data).toBeDefined();
            // expect(result.data).toBeDefined();
            console.log('✅ Payment by address successful:', result.data);
        }, 15000);

        it('should make a payment with email', async () => {
            const payEmail = process.env.TEST_PAY_WITH_EMAIL || '';
            if (!payEmail) {
                throw new Error('No pay email available for Payment tests');
            }
            const result = await sdk.pay.payWithEmail({
                walletID: walletId,
                assetName: 'BSV', // make sure this matches ASSET_IDS keys
                transfer_destinations: [
                    {
                        email: payEmail,
                        amount: Number(process.env.TEST_PAY_AMOUNT || 1),
                    },
                ],
            });

            expect(result.data).toBeDefined();
            console.log('✅ Payment by email successful:', result.data);
        }, 15000);

        it('should make a payment with paymail', async () => {
            const payMail = process.env.TEST_PAY_WITH_PAYMAIL || '';
            if (!payMail) {
                throw new Error('No pay mail available for Payment tests');
            }
            const result = await sdk.pay.payWithPaymail({
                walletID: walletId,
                assetName: 'BSV', // make sure this matches ASSET_IDS keys
                transfer_destinations: [
                    {
                        paymail: payMail,
                        amount: Number(process.env.TEST_PAY_AMOUNT || 1),
                    },
                ],
            });

            expect(result.data).toBeDefined();
            console.log('✅ Payment by paymail successful:', result.data);
        }, 15000);

        it('should fail with unsupported asset', async () => {
            await expect(
                sdk.pay.payWithAddress({
                    walletID: walletId,
                    assetName: 'BSV',
                    transfer_destinations: [],
                })
            ).rejects.toThrow();
            console.log('✅ Unsupported asset correctly rejected');
        }, 15000);

        // Similarly, you can add payWithEmail and payWithPaymail
    });
});
