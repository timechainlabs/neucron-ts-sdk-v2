import { z } from 'zod';
import { businessIdSchema, nonEmptyString, pageMetaSchema } from '../../utils/schema/common.js';

export const customerApiSchema = z.object({
    address_details: z
        .object({
            address: z.string().optional(),
            city: z.string().optional(),
            country: z.string().optional(),
            fax_number: z.string().optional(),
            phone_number: z.string().optional(),
            pin_code: z.string().optional(),
            state: z.string().optional(),
        })
        .optional(),
    allow_portal_access: z.boolean().optional(),
    business_details: z
        .object({
            company_name: z.string().optional(),
            display_name: z.string().optional(),
            email: z.string().optional(),
            phone_number: z.string().optional(),
        })
        .optional(),
    contact_persons: z.array(z.record(z.unknown())).default([]),
    created_at: z.string().optional(),
    customer_id: z.string().optional(),
    customer_type: z.enum(['BUSINESS', 'INDIVIDUAL']).optional(),
    individual_details: z.record(z.unknown()).optional(),
    payment_details: z.record(z.unknown()).optional(),
    tax_payer_info: z.record(z.unknown()).optional(),
    team_id: z.string().optional(),
    business_id: z.string().optional(),
    status: z.string().optional(),
    total_invoices: z.number().optional(),
    total_invoiced: z.union([z.number(), z.record(z.number())]).optional(),
    total_outstanding: z.union([z.number(), z.record(z.number())]).optional(),
});

export const listCustomersSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    page: z.number().min(1).optional(),
    size: z.number().min(1).optional(),
});

export const customersListResponseSchema = z.object({
    customers: z.array(customerApiSchema),
    page_meta: pageMetaSchema,
});

export const getCustomerSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    customerId: nonEmptyString,
});

export const createCustomerSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    customerData: customerApiSchema,
});

export const updateCustomerSchema = getCustomerSchema.extend({
    customerData: customerApiSchema,
});

export const deleteCustomerSchema = getCustomerSchema;

export const customerResponseSchema = customerApiSchema.passthrough();
export const deleteCustomerResponseSchema = z.record(z.unknown());
