import type { z } from 'zod';
import {
    payoutUpsertPayloadSchema,
    payoutApiModelSchema,
    payoutListResponseSchema,
    createPayoutSchema,
    payoutIdSchema,
    updatePayoutSchema,
    listPayoutsSchema,
    confirmPayoutSchema,
    createPayoutResponseSchema,
    triggerPayoutResponseSchema,
    confirmPayoutResponseSchema,
    payoutMetaSchema,
} from './schema.js';

export type PayoutMeta = z.infer<typeof payoutMetaSchema>;
export type PayoutUpsertPayload = z.infer<typeof payoutUpsertPayloadSchema>;
export type PayoutApiModel = z.infer<typeof payoutApiModelSchema>;
export type PayoutListResponse = z.infer<typeof payoutListResponseSchema>;
export type CreatePayout = z.infer<typeof createPayoutSchema>;
export type PayoutId = z.infer<typeof payoutIdSchema>;
export type UpdatePayout = z.infer<typeof updatePayoutSchema>;
export type ListPayouts = z.infer<typeof listPayoutsSchema>;
export type ConfirmPayout = z.infer<typeof confirmPayoutSchema>;
export type CreatePayoutResponse = z.infer<typeof createPayoutResponseSchema>;
export type TriggerPayoutResponse = z.infer<typeof triggerPayoutResponseSchema>;
export type ConfirmPayoutResponse = z.infer<typeof confirmPayoutResponseSchema>;
