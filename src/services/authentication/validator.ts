import { loginSchema, signUpSchema, signUpResponseSchema, loginResponseSchema } from './schema.js';
import type { LoginBody, SignUpBody, LoginResponse, SignupResponse } from './types.js';

export default class Validator {
    signUp(option: SignUpBody) {
        return signUpSchema.parse(option);
    }
    signUpResponse(option: SignupResponse) {
        return signUpResponseSchema.parse(option);
    }
    login(option: LoginBody) {
        return loginSchema.parse(option);
    }
    loginResponse(option: LoginResponse) {
        return loginResponseSchema.parse(option);
    }
}
