import type { z } from 'zod';
import {
    appsListResponseSchema,
    createAppSchema,
    createAppResponseSchema,
    getAppSecretSchema,
    appSecretResponseSchema,
    appSchema,
} from './schema.js';

export type App = z.infer<typeof appSchema>;
export type AppsListResponse = z.infer<typeof appsListResponseSchema>;
export type CreateApp = z.infer<typeof createAppSchema>;
export type CreateAppResponse = z.infer<typeof createAppResponseSchema>;
export type GetAppSecret = z.infer<typeof getAppSecretSchema>;
export type AppSecretResponse = z.infer<typeof appSecretResponseSchema>;
