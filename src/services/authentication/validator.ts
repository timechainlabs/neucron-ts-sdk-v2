import { loginSchema, signUpSchema } from './schema.js';
import { LoginBody, SignUpBody } from './types.js';

export default class Validator {
    sigup(option: SignUpBody) {
        return signUpSchema.parse(option);
    }
    login(option: LoginBody) {
        return loginSchema.parse(option);
    }
}
