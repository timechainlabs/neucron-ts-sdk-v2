import { vi } from 'vitest';

// Mock axios globally
vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            post: vi.fn(),
            get: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        })),
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

// Global test configuration
global.console = {
    ...console,
    // Uncomment to ignore specific console methods in tests
    // log: vi.fn(),
    // debug: vi.fn(),
    // info: vi.fn(),
    // warn: vi.fn(),
    // error: vi.fn(),
};
