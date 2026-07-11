/** Normalize date-only strings (YYYY-MM-DD) to ISO 8601 datetimes expected by the API. */
export function toIsoDateTime(value: string): string {
    if (!value) return value;
    if (value.includes('T')) return value;
    return `${value}T00:00:00Z`;
}

/** Normalize invoice payload date fields before POST /invoice. */
export function normalizeInvoiceDates<T extends { due_date?: string; issue_date?: string }>(data: T): T {
    return {
        ...data,
        ...(typeof data.due_date === 'string' ? { due_date: toIsoDateTime(data.due_date) } : {}),
        ...(typeof data.issue_date === 'string' ? { issue_date: toIsoDateTime(data.issue_date) } : {}),
    };
}

/** Normalize arbitrary invoice update payloads (Record shape). */
export function normalizeInvoicePayload(data: Record<string, unknown>): Record<string, unknown> {
    const copy = { ...data };
    if (typeof copy.due_date === 'string') copy.due_date = toIsoDateTime(copy.due_date);
    if (typeof copy.issue_date === 'string') copy.issue_date = toIsoDateTime(copy.issue_date);
    return copy;
}

/** Normalize wallet transaction history API responses into `{ list, page_meta }`. */
export function normalizeTransactionsResponse(data: unknown): {
    list: Array<Record<string, unknown>>;
    page_meta: { page: number; limit: number; total: number; next_page?: number; total_pages: number };
} {
    if (Array.isArray(data)) {
        return {
            list: data as Array<Record<string, unknown>>,
            page_meta: {
                page: 1,
                limit: data.length,
                total: data.length,
                next_page: -1,
                total_pages: 1,
            },
        };
    }

    if (data && typeof data === 'object') {
        const record = data as Record<string, unknown>;
        const rawList = record.list ?? record.transactions ?? record.data ?? [];
        const list = Array.isArray(rawList) ? (rawList as Array<Record<string, unknown>>) : [];
        const meta = (record.page_meta as Record<string, unknown> | undefined) ?? {};

        return {
            list,
            page_meta: {
                page: Number(meta.page ?? 1),
                limit: Number(meta.limit ?? meta.size ?? list.length),
                total: Number(meta.total ?? list.length),
                next_page: meta.next_page !== undefined ? Number(meta.next_page) : -1,
                total_pages: Number(meta.total_pages ?? (list.length > 0 ? 1 : 0)),
            },
        };
    }

    return { list: [], page_meta: { page: 1, limit: 0, total: 0, next_page: -1, total_pages: 0 } };
}

/** Normalize data-integrity upload responses that may return txID, txid, or a bare string. */
export function normalizeTxidResponse(data: unknown): { txID: string; txid: string } {
    if (typeof data === 'string') {
        return { txID: data, txid: data };
    }
    if (data && typeof data === 'object') {
        const record = data as Record<string, unknown>;
        const tx = record.txID ?? record.txid ?? record.transaction_id ?? record.transactionId;
        if (tx) {
            const value = String(tx);
            return { txID: value, txid: value };
        }
    }
    throw new Error('Expected transaction id in response');
}
