import { ZodError } from 'zod';
import axios from 'axios';
import { NeucronError } from './sdk-error.js';
import type { Headers } from '../http/types.js';

export function handleError(err: unknown): never {
    if (axios.isAxiosError(err) && err.response) {
        throw new NeucronError('Network request failed', err, {
            type: 'network',
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers as Headers,
        });
    }

    if (err instanceof ZodError) {
        throw new NeucronError('Validation failed', err, {
            type: 'validation',
            issues: err.errors.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message,
            })),
        });
    }
    if (err instanceof NeucronError) {
        throw err;
    }

    throw new NeucronError('Internal error occurred', err as Error, {
        type: 'internal',
    });
}
