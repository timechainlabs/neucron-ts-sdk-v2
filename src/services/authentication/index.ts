import type { HttpResponse, IHttpClient, Headers, QueryParams } from '../../utils/http/types.js';
import type { Config } from '../../config.js';
import type {
    LoginBody,
    LoginResponse,
    SignUpBody,
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
import { HttpClient } from '../../utils/http/http-client.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { NeucronError } from '../../utils/errors/sdk-error.js';
import { Routes } from '../../utils/routes/index.js';

export class Authentication {
    private token: string;
    private readonly validator: Validator;
    private readonly httpClient: IHttpClient;
    constructor(private readonly config?: Config) {
        this.token = config?.authToken ?? '';
        this.httpClient = new HttpClient();
        this.validator = new Validator();
    }
    public getToken(): string {
        return this.token;
    }
    public setToken(token: string) {
        this.token = token;
    }
    public validate() {
        if (!this.token) {
            throw new NeucronError(
                'Unauthorized to access this method, login before proceeding',
                new Error('Unauthorized Access'),
                {
                    type: 'internal',
                }
            );
        }
    }

    public async signUp(option: SignUpBody): Promise<HttpResponse<SignupResponse>> {
        try {
            this.validator.signUp(option);
            const reqPath = Routes.AUTH.SIGNUP;
            const resp = await this.httpClient.post<SignupResponse>(reqPath, option);
            this.validator.signUpResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    public async login(option: LoginBody): Promise<HttpResponse<LoginResponse>> {
        try {
            //throws error if this not passes
            this.validator.login(option);
            const reqPath = Routes.AUTH.LOGIN;
            const resp = await this.httpClient.post<LoginResponse>(reqPath, option);
            const data = this.validator.loginResponse(resp.data);
            this.setToken(data.token);
            // Return validated response
            return { ...resp, data };
        } catch (err) {
            handleError(err);
        }
    }

    async logout() {
        try {
            this.validate();
            this.token = '';
        } catch (err) {
            handleError(err);
        }
    }

    public async emailExists(option: EmailExistsBody): Promise<HttpResponse<EmailExistsResponse>> {
        try {
            this.validator.emailExists(option);
            const reqPath = Routes.AUTH.EMAIL_EXISTS;
            const params: QueryParams = {
                email: option.email,
            };
            const resp = await this.httpClient.post<EmailExistsResponse>(reqPath, null, {}, params);
            this.validator.emailExistsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    public async phoneExists(option: PhoneExistsBody): Promise<HttpResponse<PhoneExistsResponse>> {
        try {
            this.validator.phoneExists(option);
            const reqPath = Routes.AUTH.PHONE_EXISTS;
            const params: QueryParams = {
                countryCode: option.countryCode,
                phoneNumber: option.phoneNumber,
            };
            const resp = await this.httpClient.post<PhoneExistsResponse>(reqPath, null, {}, params);
            this.validator.phoneExistsResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    public async forgotPassword(option: ForgotPasswordBody): Promise<HttpResponse<ForgotPasswordResponse>> {
        try {
            this.validator.forgotPassword(option);
            const reqPath = Routes.AUTH.FORGOT_PASSWORD;
            const headers: Headers = {
                'X-Identifier': option['X-Identifier'],
            };
            const params: QueryParams = {
                email: option.email,
            };
            const resp = await this.httpClient.post<ForgotPasswordResponse>(reqPath, null, headers, params);
            this.validator.forgotPasswordResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async updatePassword(option: UpdatePasswordBody): Promise<HttpResponse<UpdatePasswordResponse>> {
        try {
            this.validate();
            this.validator.updatePassword(option);
            const reqPath = Routes.AUTH.UPDATE_PASSWORD;
            const headers: Headers = {
                Authorization: this.getToken(),
            };
            const resp = await this.httpClient.put<UpdatePasswordResponse>(reqPath, option, headers);
            this.validator.updatePasswordResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async userInfo(): Promise<HttpResponse<UserInfoResponse>> {
        try {
            this.validate();
            const reqPath = Routes.AUTH.USER_INFO;
            const headers: Headers = {
                Authorization: this.getToken(),
            };
            const resp = await this.httpClient.get<UserInfoResponse>(reqPath, headers);
            this.validator.userInfoResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    async updateUser(option: UpdateUserBody): Promise<HttpResponse<UpdateUserResponse>> {
        try {
            this.validate();
            this.validator.updateUser(option);
            const reqPath = Routes.AUTH.UPDATE_USER;
            const headers: Headers = {
                Authorization: this.getToken(),
            };
            const resp = await this.httpClient.put<UpdateUserResponse>(reqPath, option, headers);
            this.validator.updateUserResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
