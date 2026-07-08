import {
    listCustomersSchema,
    customersListResponseSchema,
    getCustomerSchema,
    createCustomerSchema,
    updateCustomerSchema,
    deleteCustomerSchema,
    inviteCustomerSchema,
    inviteCustomerResponseSchema,
    customerResponseSchema,
    deleteCustomerResponseSchema,
} from './schema.js';
import type {
    ListCustomers,
    CustomersListResponse,
    GetCustomer,
    CreateCustomer,
    UpdateCustomer,
    DeleteCustomer,
    InviteCustomer,
    CustomerResponse,
    DeleteCustomerResponse,
    InviteCustomerResponse,
} from './types.js';

export default class Validator {
    listCustomers(options: ListCustomers): void {
        listCustomersSchema.parse(options);
    }

    customersListResponse(response: CustomersListResponse): void {
        customersListResponseSchema.parse(response);
    }

    getCustomer(options: GetCustomer): void {
        getCustomerSchema.parse(options);
    }

    createCustomer(options: CreateCustomer): void {
        createCustomerSchema.parse(options);
    }

    updateCustomer(options: UpdateCustomer): void {
        updateCustomerSchema.parse(options);
    }

    deleteCustomer(options: DeleteCustomer): void {
        deleteCustomerSchema.parse(options);
    }

    inviteCustomer(options: InviteCustomer): void {
        inviteCustomerSchema.parse(options);
    }

    customerResponse(response: CustomerResponse): void {
        customerResponseSchema.parse(response);
    }

    deleteCustomerResponse(response: DeleteCustomerResponse): void {
        deleteCustomerResponseSchema.parse(response);
    }

    inviteCustomerResponse(response: InviteCustomerResponse): void {
        inviteCustomerResponseSchema.parse(response);
    }
}
