import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Customer } from '../../src/services/customer/index.js';
import {
    BUSINESS_HEADERS,
    BUSINESS_ID,
    createMockHttpClient,
    createUnauthorizedError,
    mockHttpResponse,
    setupAuthenticatedAuth,
} from './helpers/service-test-setup.js';

let mockHttpClient: ReturnType<typeof createMockHttpClient>;
let mockValidator: Record<string, ReturnType<typeof vi.fn>>;

vi.mock('../../src/utils/http/http-client.js', () => ({
    HttpClient: vi.fn().mockImplementation(() => createMockHttpClient()),
}));

vi.mock('../../src/services/customer/validator.js', () => ({
    default: vi.fn().mockImplementation(() => ({
        listCustomers: vi.fn(),
        customersListResponse: vi.fn(),
        getCustomer: vi.fn(),
        createCustomer: vi.fn(),
        updateCustomer: vi.fn(),
        deleteCustomer: vi.fn(),
        customerResponse: vi.fn(),
        deleteCustomerResponse: vi.fn(),
    })),
}));

vi.mock('../../src/utils/errors/helper.js', () => ({
    handleError: vi.fn((err) => {
        throw err;
    }),
}));

describe('Customer Service', () => {
    let customer: Customer;
    let mockAuth: ReturnType<typeof setupAuthenticatedAuth>;

    beforeEach(() => {
        vi.clearAllMocks();
        mockHttpClient = createMockHttpClient();
        mockValidator = {
            listCustomers: vi.fn(),
            customersListResponse: vi.fn(),
            getCustomer: vi.fn(),
            createCustomer: vi.fn(),
            updateCustomer: vi.fn(),
            deleteCustomer: vi.fn(),
            customerResponse: vi.fn(),
            deleteCustomerResponse: vi.fn(),
        };
        mockAuth = setupAuthenticatedAuth();
        customer = new Customer(mockAuth);
        (customer as any).httpClient = mockHttpClient;
        (customer as any).validator = mockValidator;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should list customers', async () => {
        const options = { businessId: BUSINESS_ID, page: 1, size: 20 };
        const response = { customers: [], page_meta: { page: 1, limit: 20, total: 0, total_pages: 0 } };
        mockValidator.customersListResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

        const result = await customer.getCustomers(options);

        expect(mockHttpClient.get).toHaveBeenCalledWith('/invoice/customers', BUSINESS_HEADERS, {
            page: 1,
            size: 20,
        });
        expect(result.data).toEqual(response);
    });

    it('should get a customer', async () => {
        const options = { businessId: BUSINESS_ID, customerId: 'cust-1' };
        const response = { customer_id: 'cust-1', contact_persons: [] };
        mockValidator.customerResponse.mockReturnValue(response);
        mockHttpClient.get.mockResolvedValue(mockHttpResponse(response));

        const result = await customer.getCustomer(options);

        expect(mockHttpClient.get).toHaveBeenCalledWith('/invoice/customer', BUSINESS_HEADERS, {
            customerID: 'cust-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should create a customer', async () => {
        const customerData = { customer_type: 'BUSINESS' as const, contact_persons: [] };
        const options = { businessId: BUSINESS_ID, customerData };
        const response = { customer_id: 'cust-2', ...customerData };
        mockValidator.customerResponse.mockReturnValue(response);
        mockHttpClient.post.mockResolvedValue(mockHttpResponse(response));

        const result = await customer.createCustomer(options);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/invoice/customer', customerData, BUSINESS_HEADERS);
        expect(result.data).toEqual(response);
    });

    it('should update a customer', async () => {
        const customerData = { customer_type: 'BUSINESS' as const, contact_persons: [] };
        const options = { businessId: BUSINESS_ID, customerId: 'cust-1', customerData };
        const response = { customer_id: 'cust-1', ...customerData };
        mockValidator.customerResponse.mockReturnValue(response);
        mockHttpClient.put.mockResolvedValue(mockHttpResponse(response));

        const result = await customer.updateCustomer(options);

        expect(mockHttpClient.put).toHaveBeenCalledWith('/invoice/customer', customerData, BUSINESS_HEADERS, {
            customerID: 'cust-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should delete a customer', async () => {
        const options = { businessId: BUSINESS_ID, customerId: 'cust-1' };
        const response = { message: 'Deleted' };
        mockValidator.deleteCustomerResponse.mockReturnValue(response);
        mockHttpClient.delete.mockResolvedValue(mockHttpResponse(response));

        const result = await customer.deleteCustomer(options);

        expect(mockHttpClient.delete).toHaveBeenCalledWith('/invoice/customer', BUSINESS_HEADERS, {
            customerID: 'cust-1',
        });
        expect(result.data).toEqual(response);
    });

    it('should throw when not authenticated', async () => {
        const authError = createUnauthorizedError();
        vi.spyOn(mockAuth, 'validate').mockImplementation(() => {
            throw authError;
        });
        await expect(customer.getCustomers({ businessId: BUSINESS_ID })).rejects.toThrow(authError);
    });
});
