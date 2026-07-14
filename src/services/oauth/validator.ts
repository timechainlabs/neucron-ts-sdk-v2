import {
    oauthAuthorizeSchema,
    oauthAuthorizeStrictSchema,
    oauthAuthorizeResponseSchema,
    oauthTokenExchangeSchema,
    oauthTokenExchangeStrictSchema,
    oauthTokenResponseSchema,
} from './schema.js';
import type {
    OAuthAuthorizeRequest,
    OAuthAuthorizeResponse,
    OAuthTokenExchangeRequest,
    OAuthTokenResponse,
} from './types.js';

export default class Validator {
    authorize(options: OAuthAuthorizeRequest) {
        oauthAuthorizeSchema.parse(options);
        return oauthAuthorizeStrictSchema.parse(options);
    }

    authorizeResponse(response: OAuthAuthorizeResponse) {
        return oauthAuthorizeResponseSchema.parse(response);
    }

    exchangeToken(options: OAuthTokenExchangeRequest) {
        oauthTokenExchangeSchema.parse(options);
        return oauthTokenExchangeStrictSchema.parse(options);
    }

    tokenResponse(response: OAuthTokenResponse) {
        return oauthTokenResponseSchema.parse(response);
    }
}
