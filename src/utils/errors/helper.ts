import { ZodError } from 'zod';
import { NeucronError } from './sdk-error.js';
import { isHttpTransportError, type Headers } from '../http/types.js';

export function handleError(err: unknown): never {
    if (isHttpTransportError(err) && err.status !== undefined) {
        const status = err.status;

        // If status indicates a connection/server issue → normalize to "Network error"
        if (status >= 500 || status === 0) {
            throw new NeucronError('Network error', err, {
                type: 'network',
                status,
                data: err.data,
                headers: err.headers as Headers,
                request: err.request,
            });
        }

        const data = err.data as { message?: string; error?: string } | undefined;
        const message = (data && (data.message || data.error)) || 'Request failed';
        throw new NeucronError(message, err, {
            type: 'network',
            status,
            data: err.data,
            headers: err.headers as Headers,
            request: err.request,
        });
    }

    // Timeouts and connection failures reach here without a response.
    if (isHttpTransportError(err)) {
        const timedOut = err.code === 'ETIMEDOUT';
        throw new NeucronError(timedOut ? 'Request timed out' : 'Network error', err, {
            type: 'network',
            request: err.request,
        });
    }

    if (err instanceof ZodError) {
        const message = err.issues[0]?.message || 'Validation error';
        throw new NeucronError(message, err, {
            type: 'validation',
            issues: err.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }

    if (err instanceof NeucronError) {
        throw err;
    }

    throw new NeucronError(String(err) || 'Internal error occurred', new Error(String(err)), {
        type: 'internal',
    });
}
