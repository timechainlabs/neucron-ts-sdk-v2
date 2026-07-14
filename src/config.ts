export const BASE_URL = 'https://api.neucron.io/v1';

export interface OAuthClientConfig {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    platform?: string;
}

export interface Config {
    authToken?: string;
    businessId?: string;
    /** API base URL including `/v1` (e.g. `https://dev.neucron.io/v1`). */
    baseUrl?: string;
    /** Default OAuth client credentials for Sign in with Neucron. */
    oauth?: OAuthClientConfig;
}
