import type { z } from 'zod';
import {
    appsListResponseSchema,
    createAppSchema,
    createAppResponseSchema,
    getAppSecretSchema,
    getAppSchema,
    updateAppSchema,
    publishAppSchema,
    appSecretResponseSchema,
    appResponseSchema,
    publishAppResponseSchema,
    appSchema,
} from './schema.js';

export type App = z.infer<typeof appSchema>;
export type AppsListResponse = z.infer<typeof appsListResponseSchema>;
export type CreateApp = z.infer<typeof createAppSchema>;
export type CreateAppResponse = z.infer<typeof createAppResponseSchema>;
export type GetAppSecret = z.infer<typeof getAppSecretSchema>;
export type GetApp = z.infer<typeof getAppSchema>;
export type UpdateApp = z.infer<typeof updateAppSchema>;
export type PublishApp = z.infer<typeof publishAppSchema>;
export type AppSecretResponse = z.infer<typeof appSecretResponseSchema>;
export type AppResponse = z.infer<typeof appResponseSchema>;
export type PublishAppResponse = z.infer<typeof publishAppResponseSchema>;
