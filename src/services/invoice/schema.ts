import { z } from 'zod';
import {
    businessIdSchema,
    messageResponseSchema,
    metadataSchema,
    nonEmptyString,
    pageMetaSchema,
} from '../../utils/schema/common.js';

export const createInvoicePayloadSchema = z.object({
    currency: z.string(),
    customer_id: z.string(),
    deposit_wallet: z.string(),
    discount: z.number(),
    due_date: z.string(),
    invoice_number: z.string(),
    issue_date: z.string(),
    items: z.array(
        z.object({
            item_id: z.string().optional(),
            id: z.string().optional(),
            cost_per_unit: z.number(),
            name: z.string(),
            quantity: z.number(),
            sac_code: z.string(),
            tax_rate: z.number(),
        })
    ),
    lut_number: z.string(),
    notes: z.string(),
    order_number: z.string(),
    payment_option: z.array(
        z.object({
            asset_option: z.array(z.object({ asset_id: z.string(), asset_name: z.string() })),
            chain: z.string(),
            network: z.string(),
        })
    ),
    payment_terms: z.string(),
    round_off: z.boolean(),
});

export const invoiceIdSchema = businessIdSchema.extend({
    invoiceID: nonEmptyString,
});

export const createInvoiceSchema = businessIdSchema.extend({
    invoiceData: createInvoicePayloadSchema,
});

export const listInvoicesSchema = businessIdSchema.extend({
    pageNumber: z.number().min(1).optional(),
    pageSize: z.number().min(1).optional(),
    statuses: z.array(z.string()).optional(),
});

export const updateInvoiceSchema = invoiceIdSchema.extend({
    invoiceData: z.record(z.string(), z.unknown()),
});

export const emailPayloadSchema = z.object({
    emails: z.array(z.string()),
    cc: z.array(z.string()).optional(),
    bcc: z.array(z.string()).optional(),
    note: z.string().optional(),
    paid_at: z.string().optional(),
});

export const markInvoiceAsPaidSchema = invoiceIdSchema.extend({
    payload: emailPayloadSchema.extend({ paid_at: z.string() }),
});

export const shareInvoiceSchema = invoiceIdSchema.extend({
    emails: z.array(z.string()),
    sendEmail: z.boolean().optional(),
});

export const mapCollectionSchema = invoiceIdSchema.extend({
    collectionID: nonEmptyString,
});

export const submitCollectionSchema = businessIdSchema.extend({
    data: z.object({ asset_id: z.string(), invoice_id: z.string() }),
});

export const createPublicPaymentCollectionSchema = businessIdSchema.extend({
    data: z.object({
        amount: z.number().optional(),
        currency: z.string().optional(),
        metadata: metadataSchema.optional(),
        wallet_id: z.string(),
    }),
});

export const paymentCollectionSchema = invoiceIdSchema.extend({
    supportedAssets: z.array(z.string()),
    walletID: z.string().optional(),
});

export const paymentSessionSchema = businessIdSchema.extend({
    collectionID: nonEmptyString,
    assetID: nonEmptyString,
    metadata: metadataSchema.optional(),
});

export const sessionIdSchema = businessIdSchema.extend({
    sessionID: nonEmptyString,
});

export const checkPaymentSchema = businessIdSchema.extend({
    collectionID: nonEmptyString,
    txHash: z.string().optional(),
});

export const checkSessionSchema = sessionIdSchema.extend({
    txHash: z.string().optional(),
});

export const paymentCollectionListSchema = businessIdSchema.extend({
    page: z.number().optional(),
    size: z.number().optional(),
    collection_id: z.string().optional(),
    reference: z.string().optional(),
    wallet_id: z.string().optional(),
    status: z.string().optional(),
});

export const collectionIdSchema = businessIdSchema.extend({
    collectionID: nonEmptyString,
    network: z.string().optional(),
});

export const walletPaymentCollectionInfoSchema = businessIdSchema.extend({
    walletID: z.string().optional(),
    paymail: z.string().optional(),
});

export const walletCustomizationSchema = businessIdSchema.extend({
    walletID: nonEmptyString,
    payload: z.object({ display_name: z.string(), logo_url: z.string() }),
});

export const revenueGraphFiltersSchema = businessIdSchema.extend({
    from: z.string().optional(),
    to: z.string().optional(),
    currency: z.string().optional(),
    customerID: z.string().optional(),
    period: z.enum(['weekly', 'monthly', 'quarterly', 'yearly']).optional(),
});

export const invoiceItemSchema = z.record(z.string(), z.unknown());
export const invoicesListResponseSchema = z.object({
    invoices: z.array(invoiceItemSchema),
    page_meta: pageMetaSchema,
});
export const invoiceResponseSchema = invoiceItemSchema;
export const messageSchema = messageResponseSchema;
export const walletInfoPayloadSchema = z.record(z.string(), z.unknown());
export const paymentCollectionResponseSchema = z.record(z.string(), z.unknown());
