import type { z } from 'zod';
import {
    getBusinessDetailsSchema,
    businessDetailsResponseSchema,
    businessListResponseSchema,
    updateBusinessDetailsSchema,
    updateBusinessDetailsResponseSchema,
} from './schema.js';

export type GetBusinessDetails = z.infer<typeof getBusinessDetailsSchema>;
export type BusinessDetailsResponse = z.infer<typeof businessDetailsResponseSchema>;
export type BusinessListResponse = z.infer<typeof businessListResponseSchema>;
export type UpdateBusinessDetails = z.infer<typeof updateBusinessDetailsSchema>;
export type UpdateBusinessDetailsResponse = z.infer<typeof updateBusinessDetailsResponseSchema>;
