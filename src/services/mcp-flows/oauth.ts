import type { McpFlowServices } from './types.js';
import type { OAuthAuthorizeRequest, OAuthTokenExchangeRequest } from '../oauth/types.js';

/**
 * Start Sign in with Neucron and return the hosted login URL.
 * MCP Tool: `neucron_oauth_authorize`
 */
export async function neucron_oauth_authorize(services: McpFlowServices, options: OAuthAuthorizeRequest) {
    const authorizeResponse = await services.oauth.authorize(options);
    return { redirect_url: authorizeResponse.data.redirect_url };
}

/**
 * Exchange an OAuth authorization code for an access token and load the user profile.
 * MCP Tool: `neucron_oauth_exchange_token`
 */
export async function neucron_oauth_exchange_token(services: McpFlowServices, options: OAuthTokenExchangeRequest) {
    const tokenResponse = await services.oauth.exchangeToken(options);
    const userInfo = await services.auth.userInfo();

    return {
        access_token: tokenResponse.data.access_token,
        user: userInfo.data,
    };
}
