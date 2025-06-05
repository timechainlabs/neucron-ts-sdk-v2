export class NeucronError extends Error {
    public readonly type: 'network' | 'validation' | 'internal';

    // only populated when type === 'network'
    public readonly status?: number;
    public readonly data?: unknown;
    public readonly headers?: Record<string, string>;

    // only populated when type === 'validation'
    public readonly issues?: Array<{ path: string; message: string }>;

    constructor(
        message: string,
        raw: Error,
        options: {
            type: 'network' | 'validation' | 'internal';
            // network‐specific:
            status?: number;
            data?: unknown;
            headers?: Record<string, string>;
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
        }

        if (options.type === 'validation') {
            this.issues = options.issues;
        }

        if (raw.stack) {
            this.stack = raw.stack;
        }
    }
}
