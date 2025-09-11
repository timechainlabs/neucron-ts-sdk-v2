# Neucron SDK Testing Guide

This directory contains comprehensive tests for the Neucron TypeScript SDK, including unit tests, integration tests, and test utilities.

## Test Structure

```
tests/
├── README.md                    # This file
├── setup.ts                     # Global test setup and mocks
├── authentication.test.ts       # Authentication service unit tests
├── wallet.test.ts              # Wallet service unit tests
├── neucron-sdk.test.ts         # SDK integration tests
├── integration.test.ts         # Real API integration tests
└── test-config.example.ts      # Example configuration for integration tests
```

## Test Types

### 1. Unit Tests
- **authentication.test.ts**: Tests authentication service methods (login, signup, token management)
- **wallet.test.ts**: Tests wallet service methods (create wallet, list wallets, manage addresses)
- **neucron-sdk.test.ts**: Tests SDK initialization and service integration

### 2. Integration Tests
- **integration.test.ts**: Tests against real API endpoints (requires valid credentials)

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests Once (CI Mode)
```bash
npm run test:run
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests with UI
```bash
npm run test:ui
```

### Run Specific Test Files
```bash
# Run only authentication tests
npm run test authentication.test.ts

# Run only wallet tests
npm run test wallet.test.ts

# Run only integration tests
npm run test integration.test.ts
```

## Integration Tests Setup

Integration tests are **disabled by default** to prevent accidental API calls. To enable them:

### Option 1: Direct Configuration (Recommended)
1. Open `tests/integration.test.ts`
2. Update the `DEFAULT_TEST_CONFIG` object:
   ```typescript
   const DEFAULT_TEST_CONFIG: TestConfig = {
     testUser: {
       email: 'your-actual-test-email@example.com', // Your test account email
       password: 'your-actual-test-password',        // Your test account password
       firstName: 'Test',
       lastName: 'User',
       platform: 'NEUCRON'
     },
     testWallet: {
       walletName: 'Test Wallet SDK',
       paymailName: 'testsdk'
     },
     environment: {
       skipIntegrationTests: false, // Set to false to enable
       logLevel: 'info'
     }
   };
   ```

### Option 2: External Configuration File
1. Copy `test-config.example.ts` to `test-config.ts`:
   ```bash
   cp tests/test-config.example.ts tests/test-config.ts
   ```
2. Update `test-config.ts` with your actual credentials
3. The integration tests will automatically use this configuration

### Environment Variables
You can also control integration tests with environment variables:

```bash
# Skip integration tests
SKIP_INTEGRATION=true npm run test

# Run in CI mode (skips integration tests)
NODE_ENV=ci npm run test
```

## Test Configuration

### Authentication Test Data
The tests use the following test scenarios:

**Valid Login:**
- Email: Your configured test email
- Password: Your configured test password
- Platform: NEUCRON

**Invalid Login:**
- Email: invalid@example.com
- Password: wrongpassword

### Wallet Test Data
The tests create wallets with:
- Wallet Name: "Test Wallet SDK" + timestamp
- Paymail Name: "testsdk" + timestamp

## Test Features

### Unit Tests Cover:
- ✅ Authentication service methods
- ✅ Token management and validation
- ✅ Wallet CRUD operations
- ✅ Error handling and validation
- ✅ HTTP client mocking
- ✅ Service integration

### Integration Tests Cover:
- ✅ Real API authentication
- ✅ Real wallet operations
- ✅ Error handling with real API
- ✅ Performance testing
- ✅ Concurrent request handling
- ✅ Token state management

## Mocking Strategy

The unit tests use Vitest's mocking capabilities to:
- Mock HTTP client requests
- Mock validation functions
- Mock error handlers
- Isolate service logic from external dependencies

## Coverage Reports

After running `npm run test:coverage`, you can find coverage reports in:
- `coverage/index.html` - HTML coverage report
- `coverage/coverage-final.json` - JSON coverage data

## Debugging Tests

### Enable Debug Logging
Update the test configuration to enable debug logging:
```typescript
environment: {
  logLevel: 'debug'
}
```

### Run Single Test
```bash
# Run a specific test case
npm run test -- --reporter=verbose -t "should successfully login"
```

### Debug with VS Code
1. Set breakpoints in your test files
2. Use the "Debug Test" option in VS Code
3. Or add this to your launch.json:
   ```json
   {
     "type": "node",
     "request": "launch",
     "name": "Debug Tests",
     "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
     "args": ["run", "--reporter=verbose"],
     "console": "integratedTerminal"
   }
   ```

## Best Practices

### For Unit Tests:
- Always mock external dependencies
- Test both success and error scenarios
- Verify method calls and parameters
- Test edge cases and validation

### For Integration Tests:
- Use dedicated test accounts
- Clean up created resources when possible
- Handle rate limiting and timeouts
- Test realistic user workflows

### General:
- Keep tests isolated and independent
- Use descriptive test names
- Group related tests in describe blocks
- Add console logs for integration test visibility

## Troubleshooting

### Common Issues:

**"Integration tests are skipped"**
- Update test credentials in integration.test.ts
- Set `skipIntegrationTests: false`
- Ensure email is not the default placeholder

**"Network timeout errors"**
- Check your internet connection
- Verify API endpoints are accessible
- Increase timeout values in test configuration

**"Authentication failed"**
- Verify test credentials are correct
- Check if test account is active
- Ensure platform permissions are correct

**"Wallet creation failed"**
- Ensure you're authenticated first
- Check if paymail name is unique
- Verify wallet name meets requirements

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Add both unit and integration tests for new features
3. Update this README if adding new test types
4. Ensure all tests pass before submitting PRs

## Security Notes

⚠️ **Important Security Reminders:**
- Never commit real credentials to version control
- Use dedicated test accounts, not production accounts
- Add `test-config.ts` to `.gitignore` if using external config
- Regularly rotate test account credentials
- Monitor test account usage for unexpected activity