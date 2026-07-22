import type { z } from 'zod';
import {
    oauthFlowEnum,
    oauthAuthorizeSchema,
    oauthAuthorizeResponseSchema,
    oauthBrandingSchema,
    oauthClientInfoSchema,
    oauthTokenExchangeSchema,
    oauthTokenResponseSchema,
} from './schema.js';

export type OAuthFlow = z.infer<typeof oauthFlowEnum>;
// Request types are `z.input`, not `z.infer`: fields carrying a zod `.default()`
// are supplied by the schema, so callers must not be forced to pass them.
export type OAuthAuthorizeRequest = z.input<typeof oauthAuthorizeSchema>;
export type OAuthAuthorizeResponse = z.infer<typeof oauthAuthorizeResponseSchema>;
export type OAuthTokenExchangeRequest = z.input<typeof oauthTokenExchangeSchema>;
export type OAuthTokenResponse = z.infer<typeof oauthTokenResponseSchema>;
export type OAuthBranding = z.infer<typeof oauthBrandingSchema>;
export type OAuthClientInfo = z.infer<typeof oauthClientInfoSchema>;
