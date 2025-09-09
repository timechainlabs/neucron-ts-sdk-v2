import type z from 'zod';
import { payWithAddressSchema, payWithEmailSchema, payWithPaymailSchema, payResponseSchema } from './schema.js';

export type PayWithAddressBody = z.infer<typeof payWithAddressSchema>;
export type PayWithEmailBody = z.infer<typeof payWithEmailSchema>;
export type PayWithPaymailBody = z.infer<typeof payWithPaymailSchema>;
export type PayResponse = z.infer<typeof payResponseSchema>;
