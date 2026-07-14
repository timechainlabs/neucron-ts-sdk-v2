import { z } from 'zod';
import { businessIdSchema, nonEmptyString } from '../../utils/schema/common.js';

export const appSchema = z.object({
    app_name: z.string().optional(),
    app_id: z.string().optional(),
    description: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    type: z.string().optional(),
    color: z.string().optional(),
    logo: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export const appsListResponseSchema = z.array(appSchema);

export const createAppSchema = businessIdSchema.extend({
    appData: z.record(z.string(), z.unknown()),
});

export const createAppResponseSchema = z.record(z.string(), z.unknown());

export const getAppSecretSchema = businessIdSchema.extend({
    appId: nonEmptyString,
});

export const getAppSchema = getAppSecretSchema;

export const updateAppSchema = businessIdSchema.extend({
    appId: nonEmptyString,
    appData: z.record(z.string(), z.unknown()),
});

export const publishAppSchema = getAppSecretSchema;

export const appSecretResponseSchema = z.record(z.string(), z.unknown());

export const appResponseSchema = z.record(z.string(), z.unknown());

export const publishAppResponseSchema = z.object({ message: z.string() }).passthrough();
