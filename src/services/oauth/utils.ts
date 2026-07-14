import { randomUUID } from 'node:crypto';

/** Generate a cryptographically random OAuth `state` value for CSRF protection. */
export function generateOAuthState(): string {
    return randomUUID();
}
