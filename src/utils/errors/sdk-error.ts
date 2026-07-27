/** Machine-readable error categories emitted by the SDK. */
export type NeucronErrorType = 'network' | 'validation' | 'internal';

export class NeucronError extends Error {
    public readonly type: NeucronErrorType;

    // only populated when type === 'network'
    public readonly status?: number;
    public readonly data?: unknown;
    public readonly headers?: Record<string, string>;
    /** HTTP method and path of the failed request, when known. */
    public readonly request?: { method?: string; url?: string };

    // only populated when type === 'validation'
    public readonly issues?: Array<{ path: string; message: string }>;

    constructor(
        message: string,
        raw: Error,
        options: {
            type: NeucronErrorType;
            // network‐specific:
            status?: number;
            data?: unknown;
            headers?: Record<string, string>;
            request?: { method?: string; url?: string };
            // validation‐specific:
            issues?: Array<{ path: string; message: string }>;
        }
    ) {
        super(message);
        this.name = 'NeucronError';
        this.type = options.type;

        if (options.type === 'network') {
            this.status = options.status;
            this.data = options.data;
            this.headers = options.headers;
            this.request = options.request;
        }

        if (options.type === 'validation') {
            this.issues = options.issues;
        }

        if (raw.stack) {
            this.stack = raw.stack;
        }
    }

    /** True when the request failed with HTTP 401/403. */
    get isAuthError(): boolean {
        return this.status === 401 || this.status === 403;
    }

    /** True when the request was rate limited (HTTP 429). */
    get isRateLimit(): boolean {
        return this.status === 429;
    }

    /** True for transient failures worth retrying (5xx, 408, network). */
    get isRetryable(): boolean {
        if (this.type !== 'network') return false;
        if (this.status === undefined) return true;
        return this.status === 408 || this.status === 429 || this.status >= 500;
    }
}

/**
 * Type guard for errors thrown by the SDK. Prefer this over `instanceof`
 * when multiple copies of the SDK may exist in one dependency tree.
 */
export function isNeucronError(err: unknown): err is NeucronError {
    return (
        err instanceof NeucronError ||
        (typeof err === 'object' &&
            err !== null &&
            (err as { name?: string }).name === 'NeucronError' &&
            typeof (err as { type?: string }).type === 'string')
    );
}
