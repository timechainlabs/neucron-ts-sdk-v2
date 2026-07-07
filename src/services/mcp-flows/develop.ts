import { NeucronError } from '../../utils/errors/sdk-error.js';
import type { McpFlowServices } from './types.js';
import type { NeucronCreateAppOptions, NeucronPublishAppOptions, NeucronBrowseAppstoreOptions } from './types.js';

/**
 * Create a developer application, retrieve credentials, and optionally upload supporting documents.
 * MCP Tool: `neucron_create_app`
 */
export async function neucron_create_app(services: McpFlowServices, options: NeucronCreateAppOptions) {
    const { fetchSecret = true, uploadDocument, ...createOptions } = options;

    const created = await services.apps.createApp(createOptions);

    const appId =
        (created.data as Record<string, unknown>).app_id ??
        (created.data as Record<string, unknown>).appID ??
        createOptions.appData?.app_id;

    let appSecret: unknown;
    if (fetchSecret && appId) {
        const secretResponse = await services.apps.getAppSecret({
            businessId: createOptions.businessId,
            appId: String(appId),
        });
        appSecret = secretResponse.data;
    }

    let documentUpload: unknown;
    if (uploadDocument) {
        const uploadResponse = await services.blob.uploadDocument(uploadDocument);
        documentUpload = uploadResponse.data;
    }

    return {
        app: created.data,
        appSecret,
        documentUpload,
    };
}

/**
 * Validate app configuration and submit for platform publishing.
 * MCP Tool: `neucron_publish_app`
 */
export async function neucron_publish_app(services: McpFlowServices, options: NeucronPublishAppOptions) {
    void services;
    void options;
    throw new NeucronError(
        'App publish APIs (GET/PUT /app, POST /app/publish) are not yet fully exposed on the Apps SDK service.',
        new Error('publishApp not implemented'),
        { type: 'internal' }
    );
}

/**
 * Browse installed apps and the public app catalog.
 * MCP Tool: `neucron_browse_appstore`
 */
export async function neucron_browse_appstore(services: McpFlowServices, options: NeucronBrowseAppstoreOptions = {}) {
    const installed = await services.apps.getApps({ businessId: options.businessId });

    return {
        installedApps: installed.data,
        publicCatalogNote:
            'Public app catalog (GET /app/public) and app detail endpoints are not yet exposed on the Apps SDK service.',
        appId: options.appId,
    };
}
