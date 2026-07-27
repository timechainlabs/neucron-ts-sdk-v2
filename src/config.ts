export const BASE_URL = 'https://api.neucron.io/v1';
export const SANDBOX_BASE_URL = 'https://dev.neucron.io/v1';

export interface OAuthClientConfig {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    platform?: string;
}

export interface Config {
    authToken?: string;
    businessId?: string;
    /** API base URL including `/v1` (e.g. `https://dev.neucron.io/v1`). Takes precedence over `sandbox`. */
    baseUrl?: string;
    /** When true, use the sandbox API (`https://dev.neucron.io/v1`). Ignored if `baseUrl` is set. */
    sandbox?: boolean;
    /** Default OAuth client credentials for Sign in with Neucron. */
    oauth?: OAuthClientConfig;
    /** Per-request timeout in milliseconds. Defaults to 30000. */
    timeoutMs?: number;
    /**
     * Max automatic retries for idempotent (GET) requests on 408/429/5xx or
     * network errors. Mutating requests are never retried. Defaults to 2.
     */
    maxRetries?: number;
}

/** Resolve the API base URL from config: `baseUrl` > `sandbox` > production. */
export function resolveBaseUrl(config?: Config): string {
    if (config?.baseUrl) return config.baseUrl;
    if (config?.sandbox) return SANDBOX_BASE_URL;
    return BASE_URL;
}
