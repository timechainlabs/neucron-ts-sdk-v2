import {
    appsListResponseSchema,
    createAppSchema,
    createAppResponseSchema,
    getAppSecretSchema,
    appSecretResponseSchema,
} from './schema.js';
import type { AppsListResponse, CreateApp, CreateAppResponse, GetAppSecret, AppSecretResponse } from './types.js';

export default class Validator {
    appsListResponse(response: AppsListResponse): void {
        appsListResponseSchema.parse(response);
    }

    createApp(options: CreateApp): void {
        createAppSchema.parse(options);
    }

    createAppResponse(response: CreateAppResponse): void {
        createAppResponseSchema.parse(response);
    }

    getAppSecret(options: GetAppSecret): void {
        getAppSecretSchema.parse(options);
    }

    appSecretResponse(response: AppSecretResponse): void {
        appSecretResponseSchema.parse(response);
    }
}
