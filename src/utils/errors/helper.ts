import { ZodError } from 'zod';
import axios from 'axios';
import { NeucronError } from './sdk-error.js';
import type { Headers } from '../http/types.js';

export function handleError(err: unknown): never {
    if (axios.isAxiosError(err) && err.response) {
        // Distinguish network vs other API errors
        const status = err.response.status;
        const request = {
            method: err.config?.method?.toUpperCase(),
            url: err.config?.url,
        };

        // If status indicates a connection/server issue → normalize to "Network error"
        if (status >= 500 || status === 0) {
            throw new NeucronError('Network error', err, {
                type: 'network',
                status,
                data: err.response.data,
                headers: err.response.headers as Headers,
                request,
            });
        }

        // Otherwise use provided message (like "Invalid credentials", "Invalid email")
        const message =
            (err.response.data && (err.response.data.message || err.response.data.error)) || 'Request failed';
        throw new NeucronError(message, err, {
            type: 'network',
            status,
            data: err.response.data,
            headers: err.response.headers as Headers,
            request,
        });
    }

    // Timeouts and connection failures reach here without a response.
    if (axios.isAxiosError(err)) {
        const timedOut = err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT';
        throw new NeucronError(timedOut ? 'Request timed out' : 'Network error', err, {
            type: 'network',
            request: {
                method: err.config?.method?.toUpperCase(),
                url: err.config?.url,
            },
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
