import z from 'zod';
import {
    createUtilitySchema,
    createUtilityResponseSchema,
    updateUtilitySchema,
    updateUtilityResponseSchema,
    mintUtilitySchema,
    redeemUtilitySchema,
    redeemUtilityResponseSchema,
    mintUtilityResponseSchema,
} from './schema.js';

export type CreateUtility = z.infer<typeof createUtilitySchema>;
export type CreateUtilityResponse = z.infer<typeof createUtilityResponseSchema>;

export type UpdateUtility = z.infer<typeof updateUtilitySchema>;
export type UpdateUtilityResponse = z.infer<typeof updateUtilityResponseSchema>;

export type MintUtility = z.infer<typeof mintUtilitySchema>;
export type MintUtilityResponse = z.infer<typeof mintUtilityResponseSchema>;

export type RedeemUtility = z.infer<typeof redeemUtilitySchema>;
export type RedeemUtilityResponse = z.infer<typeof redeemUtilityResponseSchema>;
