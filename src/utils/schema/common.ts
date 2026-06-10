import { z } from 'zod';

export const nonEmptyString = z.string().min(1);

export const messageResponseSchema = z.object({
    message: nonEmptyString,
});

export const pageMetaSchema = z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    next_page: z.number().optional(),
    total_pages: z.number(),
});

export const businessIdSchema = z.object({
    businessId: nonEmptyString.optional(),
});

export const networkEnum = z.enum(['MAIN', 'TEST']);
