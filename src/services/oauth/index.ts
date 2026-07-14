import type { HttpResponse, QueryParams } from '../../utils/http/types.js';
import type {
    OAuthAuthorizeRequest,
    OAuthAuthorizeResponse,
    OAuthTokenExchangeRequest,
    OAuthTokenResponse,
} from './types.js';
import type { OAuthClientConfig, Config } from '../../config.js';
import { HttpClient } from '../../utils/http/http-client.js';
import { Authentication } from '../authentication/index.js';
import Validator from './validator.js';
import { handleError } from '../../utils/errors/helper.js';
import { Routes } from '../../utils/routes/index.js';

export class OAuth {
    private readonly validator: Validator;
    private readonly httpClient: HttpClient;
    private readonly clientConfig: OAuthClientConfig;

    constructor(
        private readonly auth: Authentication,
        config?: Config
    ) {
        this.validator = new Validator();
        this.httpClient = new HttpClient(config?.baseUrl);
        this.clientConfig = config?.oauth ?? {};
    }

    /**
     * Start the Sign in with Neucron flow.
     * Returns a hosted login URL (`redirect_url`) to send the user's browser to.
     */
    async authorize(options: OAuthAuthorizeRequest): Promise<HttpResponse<OAuthAuthorizeResponse>> {
        try {
            const parsed = this.validator.authorize({
                ...options,
                client_id: options.client_id ?? this.clientConfig.clientId ?? '',
                redirect_uri: options.redirect_uri ?? this.clientConfig.redirectUri ?? '',
                platform: options.platform ?? this.clientConfig.platform ?? '',
            });

            const params: QueryParams = {
                response_type: parsed.response_type,
                client_id: parsed.client_id,
                redirect_uri: parsed.redirect_uri,
                state: parsed.state,
                platform: parsed.platform,
                flow: parsed.flow,
            };

            const resp = await this.httpClient.get<OAuthAuthorizeResponse>(
                Routes.OAUTH.AUTHORIZE,
                { Accept: 'application/json' },
                params
            );
            this.validator.authorizeResponse(resp.data);
            return resp;
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Exchange an authorization code for an access token.
     * Automatically stores the token on the linked Authentication instance.
     */
    async exchangeToken(options: OAuthTokenExchangeRequest): Promise<HttpResponse<OAuthTokenResponse>> {
        try {
            const parsed = this.validator.exchangeToken({
                ...options,
                client_id: options.client_id ?? this.clientConfig.clientId ?? '',
                client_secret: options.client_secret ?? this.clientConfig.clientSecret ?? '',
                redirect_uri: options.redirect_uri ?? this.clientConfig.redirectUri ?? '',
            });

            const params: QueryParams = {
                grant_type: parsed.grant_type,
                code: parsed.code,
                redirect_uri: parsed.redirect_uri,
                client_id: parsed.client_id,
                client_secret: parsed.client_secret,
                state: parsed.state,
            };

            const resp = await this.httpClient.get<OAuthTokenResponse>(Routes.OAUTH.TOKEN, {}, params);
            const data = this.validator.tokenResponse(resp.data);
            this.auth.setToken(data.access_token);
            return { ...resp, data };
        } catch (err) {
            handleError(err);
        }
    }
}

export { generateOAuthState } from './utils.js';
