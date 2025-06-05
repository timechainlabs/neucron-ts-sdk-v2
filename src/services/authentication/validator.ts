import { loginSchema, signUpSchema } from './schema';
import { LoginBody, SignUpBody } from './types';

export default class Validator {
    sigup(option: SignUpBody) {
        return signUpSchema.parse(option);
    }
    login(option: LoginBody) {
        return loginSchema.parse(option);
    }
}
