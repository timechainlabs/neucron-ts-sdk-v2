import { NeucronError } from '../../utils/errors/sdk-error.js';
import type {
    McpFlowServices,
    NeucronLoginOptions,
    NeucronChooseEntityOptions,
    NeucronChooseEntityResult,
    NeucronCreateBusinessOptions,
} from './types.js';
import type { CreateBusinessBody } from '../business/types.js';

/**
 * Authenticate a user via email/password and refresh the user profile.
 * MCP Tool: `neucron_login`
 */
export async function neucron_login(services: McpFlowServices, options: NeucronLoginOptions) {
    if (options.method !== 'email') {
        throw new NeucronError(
            'Passkey login is not yet supported. Use email/password or sdk.oauth for Sign in with Neucron.',
            new Error('Unsupported login method'),
            { type: 'internal' }
        );
    }

    const loginResponse = await services.auth.login(options.credentials);
    const userInfo = await services.auth.userInfo();

    return {
        token: loginResponse.data.token,
        login: loginResponse.data,
        user: userInfo.data,
    };
}

/**
 * List personal and business entities and resolve the active operating context.
 * MCP Tool: `neucron_choose_entity`
 */
export async function neucron_choose_entity(
    services: McpFlowServices,
    options: NeucronChooseEntityOptions = {}
): Promise<NeucronChooseEntityResult> {
    const userInfoResponse = await services.auth.userInfo();
    const businessListResponse = await services.business.getBusinessList();

    const user = userInfoResponse.data as Record<string, unknown>;
    const personalLabel =
        [user.first_name, user.last_name].filter(Boolean).join(' ') || (user.email as string | undefined) || 'Personal';

    const entities: NeucronChooseEntityResult['entities'] = [{ type: 'personal', label: personalLabel }];

    const businesses = businessListResponse.data;
    if (Array.isArray(businesses)) {
        for (const business of businesses) {
            const record = business as Record<string, unknown>;
            entities.push({
                type: 'business',
                business_id: String(record.business_id ?? record.businessId ?? ''),
                label: String(record.business_name ?? record.display_name ?? record.business_id ?? 'Business'),
            });
        }
    }

    const active_entity: NeucronChooseEntityResult['active_entity'] = options.businessId
        ? { type: 'business', business_id: options.businessId }
        : { type: 'personal' };

    let businessDetails: unknown;
    if (options.businessId && options.loadBusinessDetails) {
        const detailsResponse = await services.business.getBusinessDetails({ businessId: options.businessId });
        businessDetails = detailsResponse.data;
    }

    return {
        entities,
        active_entity,
        userInfo: userInfoResponse.data,
        businessList: businessListResponse.data,
        businessDetails,
    };
}

/**
 * Register a new business entity and refresh the business list.
 * MCP Tool: `neucron_create_business`
 */
export async function neucron_create_business(services: McpFlowServices, options: NeucronCreateBusinessOptions) {
    let businessId = options.businessId;
    let createResult: unknown;

    if (!businessId) {
        const createResponse = await services.business.createBusiness(options.payload as CreateBusinessBody);
        createResult = createResponse.data;
        const data = createResponse.data as { business_id?: string; data?: { business_id?: string } };
        businessId = data.business_id ?? data.data?.business_id;
        if (!businessId) {
            throw new NeucronError(
                'Business was created but no business_id was returned',
                new Error('missing business_id'),
                { type: 'internal' }
            );
        }
    }

    let updateResult: unknown;

    if (options.updateAfterCreate) {
        const updateResponse = await services.business.updateBusinessDetails({
            businessId,
            data: options.updateAfterCreate,
        });
        updateResult = updateResponse.data;
    }

    const businessList = await services.business.getBusinessList();

    return {
        business_id: businessId,
        create: createResult,
        update: updateResult,
        businessList: businessList.data,
    };
}
