import z from 'zod';
import { loginSchema, signUpSchema, platform, loginResponseSchema, signUpResponseSchema } from './schema.js';

export type SignUpBody = z.infer<typeof signUpSchema>;
export type SignupResponse = z.infer<typeof signUpResponseSchema>;

export type Platform = z.infer<typeof platform>;
export type LoginBody = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
