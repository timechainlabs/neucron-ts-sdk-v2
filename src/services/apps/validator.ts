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
} from './schema.js';
import type {
    AppsListResponse,
    CreateApp,
    CreateAppResponse,
    GetAppSecret,
    GetApp,
    UpdateApp,
    PublishApp,
    AppSecretResponse,
    AppResponse,
    PublishAppResponse,
} from './types.js';

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

    getApp(options: GetApp): void {
        getAppSchema.parse(options);
    }

    updateApp(options: UpdateApp): void {
        updateAppSchema.parse(options);
    }

    publishApp(options: PublishApp): void {
        publishAppSchema.parse(options);
    }

    appSecretResponse(response: AppSecretResponse): void {
        appSecretResponseSchema.parse(response);
    }

    appResponse(response: AppResponse): void {
        appResponseSchema.parse(response);
    }

    publishAppResponse(response: PublishAppResponse): void {
        publishAppResponseSchema.parse(response);
    }
}
