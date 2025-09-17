import type { z } from 'zod';
import {
    loginSchema,
    signUpSchema,
    platform,
    loginResponseSchema,
    signUpResponseSchema,
    emailExistsSchema,
    emailExistsResponseSchema,
    phoneExistsSchema,
    phoneExistsResponseSchema,
    forgotPasswordSchema,
    forgotPasswordResponseSchema,
    updatePasswordSchema,
    updatePasswordResponseSchema,
    userInfoResponseSchema,
    updateUserSchema,
    updateUserResponseSchema,
} from './schema.js';

export type SignUpBody = z.infer<typeof signUpSchema>;
export type SignupResponse = z.infer<typeof signUpResponseSchema>;

export type Platform = z.infer<typeof platform>;
export type LoginBody = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type EmailExistsBody = z.infer<typeof emailExistsSchema>;
export type EmailExistsResponse = z.infer<typeof emailExistsResponseSchema>;

export type PhoneExistsBody = z.infer<typeof phoneExistsSchema>;
export type PhoneExistsResponse = z.infer<typeof phoneExistsResponseSchema>;

export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
export type ForgotPasswordResponse = z.infer<typeof forgotPasswordResponseSchema>;

export type UpdatePasswordBody = z.infer<typeof updatePasswordSchema>;
export type UpdatePasswordResponse = z.infer<typeof updatePasswordResponseSchema>;

export type UserInfoResponse = z.infer<typeof userInfoResponseSchema>;

export type UpdateUserBody = z.infer<typeof updateUserSchema>;
export type UpdateUserResponse = z.infer<typeof updateUserResponseSchema>;
