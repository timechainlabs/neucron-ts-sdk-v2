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
    //
    // describe('Payment Integration', () => {
    //     let walletId: string;
    //
    //     beforeAll(async () => {
    //         walletId = process.env.TEST_PAY_WALLET_ID || '';
    //         if (!walletId) {
    //             throw new Error('No wallet available for Payment tests');
    //         }
    //     });
    //
    //     it('should make a payment with address', async () => {
    //         const payAddress = process.env.TEST_PAY_WITH_ADDRESS || '';
    //         if (!payAddress) {
    //             throw new Error('No pay address available for Payment tests');
    //         }
    //         const result = await sdk.pay.payWithAddress({
    //             walletID: walletId,
    //             assetName: 'BSV', // make sure this matches ASSET_IDS keys
    //             transfer_destinations: [
    //                 {
    //                     address: payAddress,
    //                     amount: Number(process.env.TEST_PAY_AMOUNT || 1),
    //                 },
    //             ],
    //         });
    //
    //         expect(result.data).toBeDefined();
    //         // expect(result.data).toBeDefined();
    //         console.log('✅ Payment by address successful:', result.data);
    //     }, 15000);
    //
    //     it('should make a payment with email', async () => {
    //         const payEmail = process.env.TEST_PAY_WITH_EMAIL || '';
    //         if (!payEmail) {
    //             throw new Error('No pay email available for Payment tests');
    //         }
    //         const result = await sdk.pay.payWithEmail({
    //             walletID: walletId,
    //             assetName: 'BSV', // make sure this matches ASSET_IDS keys
    //             transfer_destinations: [
    //                 {
    //                     email: payEmail,
    //                     amount: Number(process.env.TEST_PAY_AMOUNT || 1),
    //                 },
    //             ],
    //         });
    //
    //         expect(result.data).toBeDefined();
    //         console.log('✅ Payment by email successful:', result.data);
    //     }, 15000);
    //
    //     it('should make a payment with paymail', async () => {
    //         const payMail = process.env.TEST_PAY_WITH_PAYMAIL || '';
    //         if (!payMail) {
    //             throw new Error('No pay mail available for Payment tests');
    //         }
    //         const result = await sdk.pay.payWithPaymail({
    //             walletID: walletId,
    //             assetName: 'BSV', // make sure this matches ASSET_IDS keys
    //             transfer_destinations: [
    //                 {
    //                     paymail: payMail,
    //                     amount: Number(process.env.TEST_PAY_AMOUNT || 1),
    //                 },
    //             ],
    //         });
    //
    //         expect(result.data).toBeDefined();
    //         console.log('✅ Payment by paymail successful:', result.data);
    //     }, 15000);
    //
    //     it('should fail with unsupported asset', async () => {
    //         await expect(
    //             sdk.pay.payWithAddress({
    //                 walletID: walletId,
    //                 assetName: 'BSV',
    //                 transfer_destinations: [],
    //             })
    //         ).rejects.toThrow();
    //         console.log('✅ Unsupported asset correctly rejected');
    //     }, 15000);
    // });

    describe('Asset21 Integration', () => {
        let walletId: string;
        let assetID: string;
        let teamID: string;
        let walletAddress: string;
        let requestId: string;

        beforeAll(async () => {
            const walletList = await sdk.wallet.walletList();
            if (walletList.data && walletList.data.length > 0) {
                walletId = walletList.data[0].wallet_id;
                console.log(`📝 Using wallet ID: ${walletId}`);
            } else {
                throw new Error('No wallet available for Asset21 tests');
            }

            const addressList = await sdk.wallet.walletAddressList();
            if (addressList.data && addressList.data.length > 0) {
                walletAddress = addressList.data[0];
                console.log(`📍 Using wallet address: ${walletAddress}`);
            } else {
                throw new Error('No wallet address available for Asset21 tests');
            }

            teamID = process.env.TEST_TEAM_ID || '';
            if (!teamID) {
                const teamList = await sdk.team.getTeamList();
                if (teamList.data && teamList.data.length > 0) {
                    teamID = teamList.data[0].team_id;
                    console.log(`👥 Using team ID: ${teamID}`);
                }
            }
        });

        it('should register a new Asset21 asset', async () => {
            const registerPayload = {
                'X-Neucron-Team-ID': teamID,
                registerPayloadBody: {
                    asset_name: `Test Asset ${Date.now()}`,
                    image_url: 'https://loremflickr.com/400/400',
                    legal_term: 'Test legal terms and conditions',
                    symbol: `TST${Date.now().toString().slice(-4)}`,
                    token_detail: {
                        decimal: 2,
                        feeStructure: [],
                        icon: 'https://avatars.githubusercontent.com/u/87238574',
                        request_config: {
                            min_approval: 0,
                            min_rejection: 0,
                        },
                    },
                    total_supply: 1000000,
                    wallet_id: walletId,
                },
            };

            console.log('🎨 Registering new Asset21...');

            const result = await sdk.asset21.register(registerPayload);

            expect(result.data).toBeDefined();
            expect(result.data.assetID).toBeDefined();
            expect(result.status).toBe(200);

            assetID = result.data.assetID;
            console.log(`✅ Asset registered successfully with ID: ${assetID}`);
        }, 20000);

        it('should deploy the Asset21 asset', async () => {
            if (!assetID) {
                throw new Error('Asset ID not available from registration');
            }

            console.log(`🚀 Deploying Asset21: ${assetID}`);

            const result = await sdk.asset21.deploy({
                assetID: assetID,
                'X-Neucron-Team-ID': teamID,
            });

            expect(result.data).toBeDefined();
            expect(result.data.txid).toBeDefined();
            expect(result.status).toBe(200);

            console.log(`✅ Asset deployed successfully. TXID: ${result.data.txid}`);
        }, 20000);

        it('should get system config for the asset', async () => {
            console.log(`⚙️ Fetching system config for asset: ${assetID}`);

            const result = await sdk.asset21.getSystemConfig({
                assetID: assetID,
            });

            expect(result.data).toBeDefined();
            expect(result.data.assetId).toBe(assetID);
            expect(result.data.decimals).toBeDefined();
            expect(result.data.symbol).toBeDefined();
            expect(result.status).toBe(200);

            console.log(`✅ System config retrieved successfully`);
            console.log(`📊 Symbol: ${result.data.symbol}, Decimals: ${result.data.decimals}`);
        }, 15000);

        it('should create a customer request', async () => {
            console.log(`👤 Creating customer request for asset: ${assetID}`);

            const result = await sdk.asset21.createRequest({
                approvalsRequired: 0,
                assetId: assetID,
                rejectionsRequired: 0,
                requestDetails: {
                    address: walletAddress,
                    email: DEFAULT_TEST_CONFIG.testUser.email,
                    name: `${DEFAULT_TEST_CONFIG.testUser.firstName} ${DEFAULT_TEST_CONFIG.testUser.lastName}`,
                    UtxoId: '',
                    amount: 0,
                },
                state: 'CUSTOMER',
            });

            expect(result.data).toBeDefined();
            expect(result.data.message).toBeDefined();
            expect(result.status).toBe(200);

            console.log(`✅ Customer request created successfully`);
        }, 15000);

        it('should create a mint request', async () => {
            console.log(`💰 Creating mint request for asset: ${assetID}`);

            const result = await sdk.asset21.createRequest({
                approvalsRequired: 0,
                assetId: assetID,
                rejectionsRequired: 0,
                requestDetails: {
                    address: walletAddress,
                    amount: 100,
                },
                state: 'MINT',
            });

            expect(result.data).toBeDefined();
            expect(result.data.message).toBeDefined();
            expect(result.status).toBe(200);

            console.log(`✅ Mint request created successfully`);
        }, 15000);

        it('should get all Asset21 requests', async () => {
            console.log(`📋 Fetching all requests for asset: ${assetID}`);

            const result = await sdk.asset21.getRequest({
                assetID: assetID,
                state: 'MINT',
                status: 'PENDING',
                page: '1',
                size: '10',
            });

            expect(result.data).toBeDefined();
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.status).toBe(200);

            if (result.data.length > 0) {
                requestId = result.data[0].requestId;
                console.log(`✅ Found ${result.data.length} requests`);
                console.log(`📝 First request ID: ${requestId}`);
            }
        }, 15000);

        it('should get all customers for the asset', async () => {
            console.log(`👥 Fetching customers for asset: ${assetID}`);

            const result = await sdk.asset21.getCustomers({
                assetID: assetID,
            });

            expect(result.data).toBeDefined();
            expect(result.status).toBe(200);

            console.log(`✅ Customers list retrieved successfully`);
        }, 15000);

        it('should get address state', async () => {
            console.log(`📍 Fetching address state for asset: ${assetID}`);

            const result = await sdk.asset21.getAddressState({
                assetID: assetID,
            });

            expect(result.data).toBeDefined();
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.status).toBe(200);

            console.log(`✅ Address state retrieved: ${result.data.length} addresses`);
        }, 15000);

        it('should fetch balances for given addresses', async () => {
            console.log(`💵 Fetching balances for addresses`);

            const result = await sdk.asset21.fetchBalance({
                assetID: assetID,
                addresses: [walletAddress],
            });

            expect(result.data).toBeDefined();
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.status).toBe(200);

            if (result.data.length > 0) {
                console.log(`✅ Balance: ${result.data[0].amt} (${result.data[0].precised} precise)`);
            }
        }, 15000);

        it('should sync all transactions', async () => {
            console.log(`🔄 Syncing transactions for asset: ${assetID}`);

            const result = await sdk.asset21.syncTransaction({
                assetID: assetID,
                from: 0,
                limit: 10,
            });

            expect(result.data).toBeDefined();
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.status).toBe(200);

            console.log(`✅ Synced ${result.data.length} transactions`);
        }, 15000);

        it('should get transactions for specific addresses', async () => {
            console.log(`🔍 Fetching transactions for specific addresses`);

            const result = await sdk.asset21.triggerSyncForAddresses({
                assetID: assetID,
                from: 0,
                limit: 10,
                order: 'desc',
                request: [walletAddress],
            });

            expect(result.data).toBeDefined();
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.status).toBe(200);

            console.log(`✅ Found ${result.data.length} transactions for address`);
        }, 15000);

        it('should get all UTXOs by addresses', async () => {
            console.log(`📦 Fetching UTXOs for addresses`);

            const result = await sdk.asset21.getUnspentUTXOs({
                assetID: assetID,
                addresses: [walletAddress],
            });

            expect(result.data).toBeDefined();
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.status).toBe(200);

            console.log(`✅ Found ${result.data.length} UTXOs`);

            if (result.data.length > 0) {
                const firstUtxo = result.data[0];
                console.log(`📍 Sample UTXO outpoint: ${firstUtxo.outpoint}`);
            }
        }, 15000);

        it('should get a particular output info', async () => {
            // First get UTXOs to have a valid outpoint
            const utxos = await sdk.asset21.getUnspentUTXOs({
                assetID: assetID,
                addresses: [walletAddress],
            });

            if (utxos.data && utxos.data.length > 0) {
                const outpoint = utxos.data[0].outpoint;
                console.log(`🔍 Fetching output info for: ${outpoint}`);

                const result = await sdk.asset21.getOutputInfo({
                    outpoint: outpoint,
                });

                expect(result.data).toBeDefined();
                expect(Array.isArray(result.data)).toBe(true);
                expect(result.status).toBe(200);

                console.log(`✅ Output info retrieved successfully`);
            } else {
                console.log('⏭️ Skipping: No UTXOs available to test output info');
            }
        }, 15000);
    });
});
