import type { HttpResponse, QueryParams } from '../../utils/http/types.js';
import type {
    OAuthAuthorizeRequest,
    OAuthAuthorizeResponse,
    OAuthClientInfo,
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
     *
     * Sent as a form POST so the client secret stays out of the URL, where it
     * would otherwise be captured by access logs and proxies.
     */
    async exchangeToken(options: OAuthTokenExchangeRequest): Promise<HttpResponse<OAuthTokenResponse>> {
        try {
            const parsed = this.validator.exchangeToken({
                ...options,
                client_id: options.client_id ?? this.clientConfig.clientId ?? '',
                client_secret: options.client_secret ?? this.clientConfig.clientSecret ?? '',
                redirect_uri: options.redirect_uri ?? this.clientConfig.redirectUri ?? '',
            });

            const body = new URLSearchParams({
                grant_type: parsed.grant_type,
                code: parsed.code,
                redirect_uri: parsed.redirect_uri,
                client_id: parsed.client_id,
                client_secret: parsed.client_secret,
                state: parsed.state,
            });

            const resp = await this.httpClient.post<OAuthTokenResponse>(Routes.OAUTH.TOKEN, body, {
                'Content-Type': 'application/x-www-form-urlencoded',
            });
            const data = this.validator.tokenResponse(resp.data);
            this.auth.setToken(data.access_token);
            return { ...resp, data };
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Public branding for an OAuth client: app name, icon, legal links and
     * theme. Unauthenticated, so it can be called before the user signs in.
     */
    async clientInfo(clientId?: string): Promise<HttpResponse<OAuthClientInfo>> {
        try {
            const id = clientId ?? this.clientConfig.clientId ?? '';
            if (!id) {
                throw new Error('clientInfo requires a client_id');
            }

            const resp = await this.httpClient.get<OAuthClientInfo>(
                Routes.OAUTH.CLIENT_INFO,
                { Accept: 'application/json' },
                { client_id: id }
            );
            const data = this.validator.clientInfoResponse(resp.data);
            return { ...resp, data };
        } catch (err) {
            handleError(err);
        }
    }

    /**
     * Finish the flow from a callback request: verifies `state` matches the
     * value issued at login, exchanges the code, and returns the token.
     *
     * `expectedState` is whatever your app stashed in the user's session when
     * it called `authorize()`. Skipping that comparison leaves the callback
     * open to CSRF, so it is required rather than optional.
     */
    async handleCallback(options: {
        code: string;
        state: string;
        expectedState: string;
        redirect_uri?: string;
    }): Promise<HttpResponse<OAuthTokenResponse>> {
        if (!options.expectedState || options.state !== options.expectedState) {
            throw new Error('OAuth state mismatch — possible CSRF, aborting sign-in');
        }

        return this.exchangeToken({
            grant_type: 'authorization_code',
            code: options.code,
            state: options.state,
            redirect_uri: options.redirect_uri ?? this.clientConfig.redirectUri,
        });
    }
}

export { generateOAuthState } from './utils.js';
