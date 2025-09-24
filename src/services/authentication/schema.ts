import { z } from 'zod';

export const platform = z.enum(['ASSETYZER', 'CERTIFICATE', 'TICKETING', 'NEUCRON']);
export const identifier = z.enum(['ASSETYZER', 'NEUCRON']);
export const signUpSchema = z.object({
    country_code: z.string().min(1).optional(),
    email: z.string().email(),
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    password: z.string().min(1),
    phone_number: z.string().min(1).optional(),
    platform: platform,
});

export const signUpResponseSchema = z.object({
    paymail_id: z.string().min(1),
    token: z.string().min(1),
    user_id: z.string().min(1),
    wallet_id: z.string().min(1),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const loginResponseSchema = z.object({
    platforms: z.array(platform).optional().default([]),
    token: z.string().min(1),
});

export const emailExistsSchema = z.object({
    email: z.string().email(),
});

export const emailExistsResponseSchema = z.object({
    exists: z.boolean(),
});

export const phoneExistsSchema = z.object({
    countryCode: z.string().min(1),
    phoneNumber: z.string().min(1),
});

export const phoneExistsResponseSchema = z.object({
    exists: z.boolean(),
});

export const sendVerificationEmailSchema = z.object({
    'X-Identifier': identifier,
    email: z.string().email(),
});

export const sendVerificationEmailResponseSchema = z.object({
    message: z.string().min(1),
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1),
    verifyCode: z.string().min(1),
});

export const verifyEmailResponseSchema = z.object({
    message: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(),
    'X-Identifier': identifier,
});

export const forgotPasswordResponseSchema = z.object({
    message: z.string().min(1),
});

export const updatePasswordSchema = z.object({
    new_password: z.string().min(1),
});

export const updatePasswordResponseSchema = z.object({
    message: z.string().min(1),
});

export const userInfoResponseSchema = z.object({
    aadhar_card: z.string().optional(),
    address: z.string().optional(),
    avatar: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    country_code: z.string().optional(),
    currency: z.string().optional(),
    dob: z.string().optional(),
    email: z.string().email().optional(),
    first_name: z.string().optional(),
    full_name: z.string().optional(),
    gender: z.string().optional(),
    id: z.string().optional(),
    is_aadhar_verified: z.boolean().optional(),
    is_email_verified: z.boolean().optional(),
    is_pan_verified: z.boolean().optional(),
    is_phone_verified: z.boolean().optional(),
    is_upi_verified: z.boolean().optional(),
    language: z.string().optional(),
    last_name: z.string().optional(),
    pan: z.string().optional(),
    phone_number: z.string().optional(),
    pin_code: z.string().optional(),
    platform: z.array(z.string()).optional(),
    upi: z.string().optional(),
    user_name: z.string().optional(),
});

export const updateUserSchema = z.object({
    aadhar_card: z.string().optional(),
    address: z.string().optional(),
    avatar: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    country_code: z.string().optional(),
    currency: z.string().optional(),
    dob: z.string().optional(),
    email: z.string().email().optional(),
    first_name: z.string().optional(),
    gender: z.string().optional(),
    language: z.string().optional(),
    last_name: z.string().optional(),
    pan: z.string().optional(),
    phone_number: z.string().optional(),
    pin_code: z.string().optional(),
    upi: z.string().optional(),
    user_name: z.string().optional(),
});

export const updateUserResponseSchema = z.object({
    message: z.string().min(1),
});
