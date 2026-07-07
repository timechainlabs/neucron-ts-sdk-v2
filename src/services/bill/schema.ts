import { z } from 'zod';
import { businessIdSchema, messageResponseSchema, nonEmptyString } from '../../utils/schema/common.js';

export const vendorBillItemSchema = z.object({
    account: z.string(),
    cost_per_unit: z.number(),
    cusotmer: z.string(),
    name: z.string(),
    quantity: z.number(),
    sac_code: z.string(),
    sub_total: z.number(),
    tax_rate: z.number(),
    total: z.number(),
});

export const vendorBillPayloadSchema = z.object({
    additional_charge: z.record(z.number()),
    bill_items: z.array(vendorBillItemSchema),
    billing_address: z.object({
        designation_supply: z.string(),
        location: z.string(),
        source_of_supply: z.string(),
        warehouse_location: z.string(),
    }),
    billing_details: z.object({
        amount_payble: z.string(),
        bill_date: z.string(),
        billing_number: z.string(),
        due_date: z.string(),
        order_number: z.string(),
        payment_terms: z.string(),
    }),
    currency: z.string(),
    discount: z.number(),
    other_details: z.object({
        additional_fields: z.record(z.string()),
        attachment: z.object({ link: z.string(), name: z.string() }),
        lut: z.string(),
        note: z.string(),
    }),
    tax_payer_info: z.object({
        gst_treatment: z.string(),
        pan: z.string(),
        tds: z.string(),
        vat_gstin: z.string(),
    }),
    tax_rate: z.number(),
    vendor_id: z.string(),
    status: z.enum(['DRAFTED', 'UNPROCESSED', 'PENDING_APPROVAL']).optional(),
});

export const billIdSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    billID: nonEmptyString,
});

export const createBillSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    payload: vendorBillPayloadSchema,
});

export const updateBillSchema = billIdSchema.extend({
    payload: vendorBillPayloadSchema,
});

export const listBillsSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    vendorID: z.string().optional(),
    page: z.number().min(1).optional(),
    size: z.number().min(1).optional(),
});

export const reviewBillSchema = billIdSchema.extend({
    action: z.enum(['APPROVE', 'DECLINE']),
});

export const payBillSchema = billIdSchema.extend({
    payDTO: z.object({
        asset_id: nonEmptyString,
        sender_wallet_id: nonEmptyString,
        schedule_at: z.string().optional(),
        meta: z.record(z.unknown()).optional(),
    }),
});

export const mapBillToPayoutSchema = billIdSchema.extend({
    payoutID: nonEmptyString,
});

export const acceptVendorInvitationSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    vendorID: nonEmptyString,
    token: nonEmptyString,
});

export const createBillResponseSchema = z.object({ billID: z.string() });
export const updateBillResponseSchema = messageResponseSchema;
export const payBillResponseSchema = z.object({ payout_id: z.string(), txmeta: z.string() });
export const billResponseSchema = z.record(z.unknown());
export const billsListResponseSchema = z.record(z.unknown());
