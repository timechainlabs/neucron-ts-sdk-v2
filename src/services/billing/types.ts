import type { z } from 'zod';
import {
    billingHistoryResponseSchema,
    billingHistoryItemSchema,
    pricingPlanSchema,
    creditBalanceResponseSchema,
    requestPlanSchema,
    subscriptionInfoSchema,
    topUpCreditsSchema,
    graphDataSchema,
    paymentHistoryResponseSchema,
    paymentMethodSchema,
    upgradePlanSchema,
    cancelPlanSchema,
    raisePaymentSchema,
    billingInfoResponseSchema,
    pricingPlansResponseSchema,
    graphDataResponseSchema,
    invoiceListResponseSchema,
    paymentMethodsResponseSchema,
} from './schema.js';

export type BillingHistoryItem = z.infer<typeof billingHistoryItemSchema>;
export type BillingHistoryResponse = z.infer<typeof billingHistoryResponseSchema>;
export type PricingPlan = z.infer<typeof pricingPlanSchema>;
export type CreditBalanceResponse = z.infer<typeof creditBalanceResponseSchema>;
export type RequestPlan = z.infer<typeof requestPlanSchema>;
export type SubscriptionInfo = z.infer<typeof subscriptionInfoSchema>;
export type TopUpCredits = z.infer<typeof topUpCreditsSchema>;
export type GraphData = z.infer<typeof graphDataSchema>;
export type PaymentHistoryResponse = z.infer<typeof paymentHistoryResponseSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type UpgradePlan = z.infer<typeof upgradePlanSchema>;
export type CancelPlan = z.infer<typeof cancelPlanSchema>;
export type RaisePayment = z.infer<typeof raisePaymentSchema>;
export type BillingInfoResponse = z.infer<typeof billingInfoResponseSchema>;
export type PricingPlansResponse = z.infer<typeof pricingPlansResponseSchema>;
export type GraphDataResponse = z.infer<typeof graphDataResponseSchema>;
export type InvoiceListResponse = z.infer<typeof invoiceListResponseSchema>;
export type PaymentMethodsResponse = z.infer<typeof paymentMethodsResponseSchema>;
