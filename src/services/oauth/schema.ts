import { z } from 'zod';

export const oauthFlowEnum = z.enum(['sign-in', 'sign-up']);

export const oauthAuthorizeSchema = z.object({
    response_type: z.literal('code').optional().default('code'),
    client_id: z.string().min(1).optional(),
    redirect_uri: z.string().url().optional(),
    state: z.string().min(1),
    platform: z.string().min(1).optional(),
    flow: oauthFlowEnum.optional().default('sign-in'),
});

export const oauthAuthorizeStrictSchema = oauthAuthorizeSchema.extend({
    client_id: z.string().min(1),
    redirect_uri: z.string().url(),
    platform: z.string().min(1),
});

export const oauthAuthorizeResponseSchema = z
    .object({
        redirect_url: z.string().url(),
    })
    .passthrough();

export const oauthTokenExchangeSchema = z.object({
    grant_type: z.literal('authorization_code').optional().default('authorization_code'),
    code: z.string().min(1),
    redirect_uri: z.string().url().optional(),
    client_id: z.string().min(1).optional(),
    client_secret: z.string().min(1).optional(),
    state: z.string().min(1),
});

export const oauthTokenExchangeStrictSchema = oauthTokenExchangeSchema.extend({
    redirect_uri: z.string().url(),
    client_id: z.string().min(1),
    client_secret: z.string().min(1),
});

export const oauthTokenResponseSchema = z
    .object({
        access_token: z.string().min(1),
    })
    .passthrough();
