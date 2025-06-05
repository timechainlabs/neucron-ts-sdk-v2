import { loginSchema, signUpSchema } from './schema.js';
import type { LoginBody, SignUpBody } from './types.js';

export default class Validator {
    sigup(option: SignUpBody) {
        return signUpSchema.parse(option);
    }
    login(option: LoginBody) {
        return loginSchema.parse(option);
    }
}
