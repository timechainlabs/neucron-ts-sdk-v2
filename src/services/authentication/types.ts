import z from 'zod';
import { loginSchema, signUpSchema, platform } from './schema';

export type SignUpBody = z.infer<typeof signUpSchema>;
export type SignupResponse = {
    paymail_id: string;
    token: string;
    user_id: string;
    wallet_id: string;
};

export type Platform = z.infer<typeof platform>;
export type LoginBody = z.infer<typeof loginSchema>;
export type LoginResponse = {
    platforms: Platform[];
    token: string;
};
