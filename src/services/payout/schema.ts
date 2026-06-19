import { z } from 'zod';
import { businessIdSchema, messageResponseSchema, nonEmptyString, pageMetaSchema } from '../../utils/schema/common.js';

export const payoutMetaSchema = z
    .object({
        email: z.string().optional(),
        name: z.string().optional(),
        note: z.string().optional(),
    })
    .passthrough();

export const payoutUpsertPayloadSchema = z.object({
    address: z.string().optional(),
    amount: z.string().optional(),
    amount_in_fiat: z.number().optional(),
    asset_id: z.string().optional(),
    currency: z.string().optional(),
    destination_wallet: z.string().optional(),
    email: z.string().optional(),
    meta: payoutMetaSchema.optional(),
    paymail: z.string().optional(),
    scheduled_at: z.string().optional(),
    wallet_id: z.string().optional(),
});

export const payoutApiModelSchema = z
    .object({
        payout_id: z.string(),
    })
    .passthrough();

export const payoutListResponseSchema = z.object({
    list: z.array(payoutApiModelSchema),
    page_meta: pageMetaSchema.optional(),
});

export const createPayoutSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    payload: payoutUpsertPayloadSchema,
});

export const payoutIdSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    payoutID: nonEmptyString,
});

export const updatePayoutSchema = payoutIdSchema.extend({
    payload: payoutUpsertPayloadSchema,
});

export const listPayoutsSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    status: z.string().optional(),
    reference: z.string().optional(),
    reference_type: z.string().optional(),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).optional(),
});

export const confirmPayoutSchema = payoutIdSchema.extend({
    payload: z.object({
        emails: z.array(z.string()).optional(),
        cc: z.array(z.string()).optional(),
        bcc: z.array(z.string()).optional(),
        note: z.string().optional(),
    }),
});

export const createPayoutRequestPayloadSchema = z.object({
    amount: z.string().optional(),
    amount_in_fiat: z.number().optional(),
    asset_id: z.string().optional(),
    currency: z.string().optional(),
    meta: payoutMetaSchema.optional(),
    receiver_address: z.string().optional(),
    receiver_email: z.string().optional(),
    receiver_paymail: z.string().optional(),
    sender_address: z.string().optional(),
    sender_email: z.string().optional(),
    sender_paymail: z.string().optional(),
});

export const createPayoutRequestSchema = z.object({
    businessId: nonEmptyString,
    teamId: z.string().optional(),
    appSecret: nonEmptyString,
    payload: createPayoutRequestPayloadSchema,
});

export const createPayoutResponseSchema = z.object({ payout_id: z.string() });
export const triggerPayoutResponseSchema = z.object({ tx_link: z.string().optional(), txid: z.string().optional() });
export const confirmPayoutResponseSchema = messageResponseSchema;
