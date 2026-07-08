import type { z } from 'zod';
import {
    customerApiSchema,
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

export type CustomerApi = z.infer<typeof customerApiSchema>;
export type ListCustomers = z.infer<typeof listCustomersSchema>;
export type CustomersListResponse = z.infer<typeof customersListResponseSchema>;
export type GetCustomer = z.infer<typeof getCustomerSchema>;
export type CreateCustomer = z.infer<typeof createCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
export type DeleteCustomer = z.infer<typeof deleteCustomerSchema>;
export type InviteCustomer = z.infer<typeof inviteCustomerSchema>;
export type InviteCustomerResponse = z.infer<typeof inviteCustomerResponseSchema>;
export type CustomerResponse = z.infer<typeof customerResponseSchema>;
export type DeleteCustomerResponse = z.infer<typeof deleteCustomerResponseSchema>;
