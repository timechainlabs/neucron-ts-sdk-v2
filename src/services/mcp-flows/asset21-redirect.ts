function readRedirectValue(data: unknown): string | undefined {
    if (!data || typeof data !== 'object') {
        return undefined;
    }
    const record = data as Record<string, unknown>;
    const value = record.redirect_url ?? record.redirectUrl ?? record.intent_id ?? record.intentId;
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}

/** Resolve API redirect value to a browser-openable URL. */
export function resolveAsset21RedirectUrl(redirectValue: string): string {
    if (/^https?:\/\//i.test(redirectValue)) {
        return redirectValue;
    }
    return redirectValue;
}

/** Scan flow step payloads for the first redirect_url / intent id. */
export function findAsset21RedirectUrl(steps: Record<string, unknown>): string | undefined {
    for (const step of Object.values(steps)) {
        const direct = readRedirectValue(step);
        if (direct) {
            return resolveAsset21RedirectUrl(direct);
        }
        if (step && typeof step === 'object') {
            for (const nested of Object.values(step as Record<string, unknown>)) {
                const nestedRedirect = readRedirectValue(nested);
                if (nestedRedirect) {
                    return resolveAsset21RedirectUrl(nestedRedirect);
                }
            }
        }
    }
    return undefined;
}

export function attachAsset21Redirect<T extends { steps?: Record<string, unknown> }>(
    result: T
): T & { redirectUrl?: string; redirectRequired: boolean } {
    const redirectUrl = result.steps ? findAsset21RedirectUrl(result.steps) : undefined;
    return {
        ...result,
        redirectUrl,
        redirectRequired: Boolean(redirectUrl),
    };
}
