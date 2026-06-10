import {
    billingHistoryResponseSchema,
    creditBalanceResponseSchema,
    requestPlanSchema,
    subscriptionInfoSchema,
    topUpCreditsSchema,
    graphDataResponseSchema,
    paymentHistoryResponseSchema,
    paymentMethodsResponseSchema,
    upgradePlanSchema,
    cancelPlanSchema,
    raisePaymentSchema,
    pricingPlansResponseSchema,
} from './schema.js';
import type {
    BillingHistoryResponse,
    CreditBalanceResponse,
    RequestPlan,
    SubscriptionInfo,
    TopUpCredits,
    GraphDataResponse,
    PaymentHistoryResponse,
    PaymentMethodsResponse,
    UpgradePlan,
    CancelPlan,
    RaisePayment,
    PricingPlansResponse,
} from './types.js';

export default class Validator {
    billingHistoryResponse(response: BillingHistoryResponse): void {
        billingHistoryResponseSchema.parse(response);
    }

    creditBalanceResponse(response: CreditBalanceResponse): void {
        creditBalanceResponseSchema.parse(response);
    }

    requestPlan(options: RequestPlan): void {
        requestPlanSchema.parse(options);
    }

    subscriptionInfo(response: SubscriptionInfo): void {
        subscriptionInfoSchema.parse(response);
    }

    topUpCredits(options: TopUpCredits): void {
        topUpCreditsSchema.parse(options);
    }

    graphDataResponse(response: GraphDataResponse): void {
        graphDataResponseSchema.parse(response);
    }

    paymentHistoryResponse(response: PaymentHistoryResponse): void {
        paymentHistoryResponseSchema.parse(response);
    }

    paymentMethodsResponse(response: PaymentMethodsResponse): void {
        paymentMethodsResponseSchema.parse(response);
    }

    upgradePlan(options: UpgradePlan): void {
        upgradePlanSchema.parse(options);
    }

    cancelPlan(options: CancelPlan): void {
        cancelPlanSchema.parse(options);
    }

    raisePayment(options: RaisePayment): void {
        raisePaymentSchema.parse(options);
    }

    pricingPlansResponse(response: PricingPlansResponse): void {
        pricingPlansResponseSchema.parse(response);
    }
}
