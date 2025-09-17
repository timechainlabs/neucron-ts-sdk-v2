// Example test configuration file
// Copy this file to test-config.ts and update with your actual test credentials
// DO NOT commit test-config.ts to version control

export const TEST_CONFIG = {
    // Test user credentials for authentication tests
    testUser: {
        email: 'your-test-email@example.com',
        password: 'your-test-password',
        firstName: 'Test',
        lastName: 'User',
        platform: 'NEUCRON' as const,
    },

    // Test wallet configuration
    testWallet: {
        walletName: 'Test Wallet SDK',
        paymailName: 'testsdk',
    },

    // API endpoints (if different from default)
    apiConfig: {
        baseUrl: 'https://api.neucron.io', // Update with actual API URL
        timeout: 10000,
    },

    // Test environment settings
    environment: {
        skipIntegrationTests: false, // Set to true to skip real API calls
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    },
};

// Helper function to check if integration tests should run
export const shouldRunIntegrationTests = () => {
    return (
        !TEST_CONFIG.environment.skipIntegrationTests &&
        process.env.NODE_ENV !== 'ci' &&
        process.env.SKIP_INTEGRATION !== 'true'
    );
};
