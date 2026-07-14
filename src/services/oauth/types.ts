import type { z } from 'zod';
import {
    oauthFlowEnum,
    oauthAuthorizeSchema,
    oauthAuthorizeResponseSchema,
    oauthTokenExchangeSchema,
    oauthTokenResponseSchema,
} from './schema.js';

export type OAuthFlow = z.infer<typeof oauthFlowEnum>;
export type OAuthAuthorizeRequest = z.infer<typeof oauthAuthorizeSchema>;
export type OAuthAuthorizeResponse = z.infer<typeof oauthAuthorizeResponseSchema>;
export type OAuthTokenExchangeRequest = z.infer<typeof oauthTokenExchangeSchema>;
export type OAuthTokenResponse = z.infer<typeof oauthTokenResponseSchema>;
