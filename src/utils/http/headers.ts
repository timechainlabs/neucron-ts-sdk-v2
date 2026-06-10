import type { Authentication } from '../../services/authentication/index.js';
import type { Headers } from './types.js';

export interface BusinessHeadersOptions {
    businessId?: string;
    teamId?: string;
    identifier?: string;
}

export function buildAuthHeaders(auth: Authentication, options?: BusinessHeadersOptions): Headers {
    const headers: Headers = {
        Authorization: auth.getToken(),
        'X-Identifier': options?.identifier ?? 'NEUCRON',
    };

    if (options?.businessId) {
        headers['X-Neucron-Business-ID'] = options.businessId;
    }

    if (options?.teamId) {
        headers['X-Neucron-Team-ID'] = options.teamId;
    }

    return headers;
}
