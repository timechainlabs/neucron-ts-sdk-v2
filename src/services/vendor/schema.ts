import { z } from 'zod';
import { businessIdSchema, messageResponseSchema, nonEmptyString } from '../../utils/schema/common.js';

export const vendorAddressDetailsSchema = z.object({
    address: z.string(),
    city: z.string(),
    country: z.string(),
    fax_number: z.string(),
    phone_number: z.string(),
    pin_code: z.string(),
    state: z.string(),
});

export const vendorContactPersonSchema = z.object({
    department: z.string(),
    designation: z.string(),
    email: z.string(),
    first_name: z.string(),
    language: z.string(),
    last_name: z.string(),
    phone_number: z.string(),
    salulation: z.string(),
    work_number: z.string(),
});

export const vendorPaymentDetailsSchema = z.object({
    currency: z.string(),
    expense_wallet: z.string(),
    opening_balance: z.union([z.number(), z.string()]),
    payment_address: z.string(),
    payment_terms: z.string(),
    place_of_supply: z.string(),
});

export const vendorTaxPayerInfoSchema = z.object({
    gst_treatment: z.string(),
    pan: z.string(),
    tds: z.string(),
    vat_gstin: z.string(),
});

export const vendorUpsertPayloadSchema = z.object({
    address_details: vendorAddressDetailsSchema,
    contact_persons: z.array(vendorContactPersonSchema),
    email: z.string(),
    payment_details: vendorPaymentDetailsSchema,
    phone_number: z.string(),
    tax_payer_info: vendorTaxPayerInfoSchema,
    vendor_name: z.string(),
    vendor_type: z.string(),
});

export const listVendorsSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    page: z.number().min(1).optional(),
    size: z.number().min(1).optional(),
});

export const vendorIdSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    vendorId: nonEmptyString,
});

export const createVendorSchema = vendorIdSchema.omit({ vendorId: true }).extend({
    payload: vendorUpsertPayloadSchema,
});

export const updateVendorSchema = vendorIdSchema.extend({
    payload: vendorUpsertPayloadSchema,
});

export const setVendorSuspensionSchema = vendorIdSchema.extend({
    action: z.enum(['SUSPEND', 'UNSUSPEND']),
});

export const acceptVendorSchema = z.object({
    vendorId: nonEmptyString,
    token: nonEmptyString,
    businessId: z.string().optional(),
});

export const expenseGraphFiltersSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    vendorID: z.string().optional(),
    currency: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    period: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional(),
});

export const payVendorSchema = vendorIdSchema.extend({
    payDTO: z.object({
        amount: z.string().optional(),
        amount_in_fiat: z.number(),
        asset_id: nonEmptyString,
        currency: nonEmptyString,
        schedule_at: z.string().optional(),
        sender_wallet_id: nonEmptyString,
        meta: z.record(z.string(), z.unknown()).optional(),
    }),
});

export const vendorsListResponseSchema = z.record(z.string(), z.unknown());
export const vendorResponseSchema = z.record(z.string(), z.unknown());
export const messageSchema = messageResponseSchema;
export const vendorLedgerResponseSchema = z.record(z.string(), z.unknown());
export const vendorExpenseGraphResponseSchema = z.record(z.string(), z.unknown());
export const vendorExpenseSummaryResponseSchema = z.array(z.record(z.string(), z.unknown()));
