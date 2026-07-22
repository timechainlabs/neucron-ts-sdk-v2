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

export const oauthBrandingSchema = z
    .object({
        accent_color: z.string().optional(),
        theme: z.enum(['dark', 'light']).optional(),
        logo_url: z.string().optional(),
        login_methods: z.array(z.string()).optional(),
    })
    .passthrough();

export const oauthClientInfoSchema = z
    .object({
        client_id: z.string().min(1),
        app_id: z.string().optional(),
        app_name: z.string().optional(),
        app_icon: z.string().optional(),
        app_domain: z.string().optional(),
        description: z.string().optional(),
        website_url: z.string().optional(),
        terms_and_conditions: z.string().optional(),
        privacy_policy: z.string().optional(),
        branding: oauthBrandingSchema.optional(),
    })
    .passthrough();
