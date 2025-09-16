import {
    loginSchema,
    signUpSchema,
    signUpResponseSchema,
    loginResponseSchema,
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
import type {
    LoginBody,
    SignUpBody,
    LoginResponse,
    SignupResponse,
    EmailExistsBody,
    EmailExistsResponse,
    PhoneExistsBody,
    PhoneExistsResponse,
    ForgotPasswordBody,
    ForgotPasswordResponse,
    UpdatePasswordBody,
    UpdatePasswordResponse,
    UserInfoResponse,
    UpdateUserBody,
    UpdateUserResponse,
} from './types.js';

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
    emailExists(option: EmailExistsBody) {
        return emailExistsSchema.parse(option);
    }
    emailExistsResponse(option: EmailExistsResponse) {
        return emailExistsResponseSchema.parse(option);
    }
    phoneExists(option: PhoneExistsBody) {
        return phoneExistsSchema.parse(option);
    }
    phoneExistsResponse(option: PhoneExistsResponse) {
        return phoneExistsResponseSchema.parse(option);
    }
    forgotPassword(option: ForgotPasswordBody) {
        return forgotPasswordSchema.parse(option);
    }
    forgotPasswordResponse(option: ForgotPasswordResponse) {
        return forgotPasswordResponseSchema.parse(option);
    }
    updatePassword(option: UpdatePasswordBody) {
        return updatePasswordSchema.parse(option);
    }
    updatePasswordResponse(option: UpdatePasswordResponse) {
        return updatePasswordResponseSchema.parse(option);
    }
    userInfoResponse(option: UserInfoResponse) {
        return userInfoResponseSchema.parse(option);
    }
    updateUser(option: UpdateUserBody) {
        return updateUserSchema.parse(option);
    }
    updateUserResponse(option: UpdateUserResponse) {
        return updateUserResponseSchema.parse(option);
    }
}
