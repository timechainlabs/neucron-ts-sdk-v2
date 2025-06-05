import { z } from 'zod';

export const platform = z.enum(['ASSETYZER', 'CERTIFICATE', 'TICKETING', 'NEUCRON']);
export const signUpSchema = z.object({
    country_code: z.string().min(1).optional(),
    email: z.string().email(),
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    password: z.string().min(1),
    phone_number: z.string().min(1).optional(),
    platform: platform,
    redirect_url: z.string().url().optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
