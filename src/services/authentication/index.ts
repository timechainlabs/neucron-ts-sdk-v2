import type { HttpResponse, IHttpClient } from '../../utils/http/types.js';
import type { Config } from '../../config.js';
import type { LoginBody, LoginResponse, SignUpBody, SignupResponse } from './types.js';
import { HttpClient } from '../../utils/http/http-client.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { NeucronError } from '../../utils/errors/sdk-error.js';

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

    public async singUp(option: SignUpBody): Promise<HttpResponse<SignupResponse>> {
        try {
            //throws error if this not passes
            this.validator.sigup(option);
            const reqPath = '/auth/signup';
            const resp = await this.httpClient.post<SignupResponse>(reqPath, option);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    public async login(option: LoginBody): Promise<HttpResponse<LoginResponse>> {
        try {
            //throws error if this not passes
            this.validator.login(option);
            const reqPath = '/auth/login';
            const resp = await this.httpClient.post<LoginResponse>(reqPath, option);
            const data: { token: string } = resp.data as { token: string };
            this.setToken(data.token);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }
}
