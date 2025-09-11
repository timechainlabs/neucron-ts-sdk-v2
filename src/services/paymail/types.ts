import type { z } from 'zod';
import {
    createPaymailSchema,
    paymailListResponseSchema,
    createPaymailResponseSchema,
    updateDefaultPaymailSchema,
    updateDefaultPaymailResponseSchema,
    deletePaymailSchema,
    deletePaymailResponseSchema,
    paymailListSchema,
} from './schema.js';

export type CreatePaymailBody = z.infer<typeof createPaymailSchema>;
export type CreatePaymailResponse = z.infer<typeof createPaymailResponseSchema>;

export type PaymailListBody = z.infer<typeof paymailListSchema>;
export type PaymailListResponse = z.infer<typeof paymailListResponseSchema>;

export type UpdateDefaultPaymailBody = z.infer<typeof updateDefaultPaymailSchema>;
export type UpdateDefaultPaymailResponse = z.infer<typeof updateDefaultPaymailResponseSchema>;

export type DeletePaymailBody = z.infer<typeof deletePaymailSchema>;
export type DeletePaymailResponse = z.infer<typeof deletePaymailResponseSchema>;
