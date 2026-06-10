import {
    createPayoutSchema,
    payoutIdSchema,
    updatePayoutSchema,
    listPayoutsSchema,
    confirmPayoutSchema,
    createPayoutResponseSchema,
    triggerPayoutResponseSchema,
    confirmPayoutResponseSchema,
    payoutListResponseSchema,
    payoutApiModelSchema,
} from './schema.js';
import type {
    CreatePayout,
    PayoutId,
    UpdatePayout,
    ListPayouts,
    ConfirmPayout,
    CreatePayoutResponse,
    TriggerPayoutResponse,
    ConfirmPayoutResponse,
    PayoutListResponse,
    PayoutApiModel,
} from './types.js';

export default class Validator {
    createPayout(options: CreatePayout): void {
        createPayoutSchema.parse(options);
    }

    payoutId(options: PayoutId): void {
        payoutIdSchema.parse(options);
    }

    updatePayout(options: UpdatePayout): void {
        updatePayoutSchema.parse(options);
    }

    listPayouts(options: ListPayouts): void {
        listPayoutsSchema.parse(options);
    }

    confirmPayout(options: ConfirmPayout): void {
        confirmPayoutSchema.parse(options);
    }

    createPayoutResponse(response: CreatePayoutResponse): void {
        createPayoutResponseSchema.parse(response);
    }

    triggerPayoutResponse(response: TriggerPayoutResponse): void {
        triggerPayoutResponseSchema.parse(response);
    }

    confirmPayoutResponse(response: ConfirmPayoutResponse): void {
        confirmPayoutResponseSchema.parse(response);
    }

    payoutListResponse(response: PayoutListResponse): void {
        payoutListResponseSchema.parse(response);
    }

    payoutResponse(response: PayoutApiModel): void {
        payoutApiModelSchema.parse(response);
    }
}
