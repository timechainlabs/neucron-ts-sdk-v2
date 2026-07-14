import { z } from 'zod';
import { nonEmptyString, pageMetaSchema } from '../../utils/schema/common.js';

export const billingHistoryItemSchema = z.object({
    id: z.string(),
    amount: z.number(),
    business_id: z.string(),
    user_id: z.string(),
    credit_type: z.string(),
    reason: z.string(),
    created_at: z.string(),
    valid_from: z.string(),
    expires_at: z.string(),
    metadata: z.record(z.string(), z.unknown()),
});

export const billingHistoryResponseSchema = z.object({
    list: z.array(billingHistoryItemSchema),
    page_meta: pageMetaSchema,
});

export const pricingPlanSchema = z.record(z.string(), z.unknown());

export const creditBalanceResponseSchema = z.object({
    plan_balance: z.number(),
    purchased_balance: z.number().optional(),
});

export const requestPlanSchema = z.object({
    plan_id: nonEmptyString,
    auto_pay: z.boolean(),
    provider: z.literal('MANUAL'),
});

export const subscriptionInfoSchema = z.object({
    subscription_id: z.string(),
    business_id: z.string(),
    plan_id: z.string(),
    status: z.enum(['ACTIVE', 'CANCELLED', 'PENDING_PAYMENT']),
    started_at: z.string().optional(),
    expires_at: z.string().optional(),
    created_at: z.string(),
});

export const topUpCreditsSchema = z.object({
    amount: z.number(),
    provider: z.enum(['MANUAL', 'STRIPE', 'PAYPAL']),
});

export const graphDataSchema = z.object({
    date: z.string(),
    used: z.number(),
});

export const paymentHistoryResponseSchema = z.object({
    list: z.array(z.record(z.string(), z.unknown())),
    page_meta: pageMetaSchema,
});

export const paymentMethodSchema = z.object({
    id: z.string(),
    type: z.enum(['card', 'bank_account', 'paypal']),
    details: z.record(z.string(), z.unknown()),
    isDefault: z.boolean(),
});

export const upgradePlanSchema = z.object({
    subscriptionID: nonEmptyString,
    newPlanID: nonEmptyString,
});

export const cancelPlanSchema = z.object({
    subscriptionId: nonEmptyString,
});

export const raisePaymentSchema = z.object({
    invoiceId: nonEmptyString,
});

export const billingInfoResponseSchema = z.record(z.string(), z.unknown());
export const pricingPlansResponseSchema = z.array(pricingPlanSchema);
export const graphDataResponseSchema = z.array(graphDataSchema);
export const invoiceListResponseSchema = z.record(z.string(), z.unknown());
export const paymentMethodsResponseSchema = z.array(paymentMethodSchema);
