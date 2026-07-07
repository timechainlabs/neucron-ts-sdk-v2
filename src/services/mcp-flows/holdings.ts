import type { McpFlowServices } from './types.js';
import type {
    NeucronListWalletsOptions,
    NeucronCreateWalletOptions,
    NeucronGetBalancesOptions,
    NeucronGetTransactionHistoryOptions,
    NeucronExportTransactionHistoryOptions,
    NeucronGetNotificationLogsOptions,
} from './types.js';
import { NeucronError } from '../../utils/errors/sdk-error.js';

/**
 * List all wallets for the authenticated user or selected business.
 * MCP Tool: `neucron_list_wallets`
 */
export async function neucron_list_wallets(services: McpFlowServices, options: NeucronListWalletsOptions = {}) {
    const wallets = await services.wallet.walletList({ businessId: options.businessId });
    return { wallets: wallets.data };
}

/**
 * Create a new wallet and refresh the wallet list.
 * MCP Tool: `neucron_create_wallet`
 */
export async function neucron_create_wallet(services: McpFlowServices, options: NeucronCreateWalletOptions) {
    const { refreshList = true, ...createOptions } = options;
    const created = await services.wallet.createWallet(createOptions);

    let wallets: unknown;
    if (refreshList) {
        const listResponse = await services.wallet.walletList({ businessId: options.businessId });
        wallets = listResponse.data;
    }

    return {
        wallet: created.data,
        wallets,
        mpcNote: 'MPC wallets require a WebSocket shard handshake (wss://{host}:443/v1/mpc) outside this SDK flow.',
    };
}

/**
 * Fetch asset balances for a wallet across chains/networks.
 * MCP Tool: `neucron_get_balances`
 */
export async function neucron_get_balances(services: McpFlowServices, options: NeucronGetBalancesOptions) {
    const businessId = options.businessId;

    let walletID = options.walletID;
    if (!walletID) {
        const wallets = await services.wallet.walletList({ businessId });
        const walletData = wallets.data as Record<string, unknown> | Array<Record<string, unknown>>;
        const firstWallet = Array.isArray(walletData) ? walletData[0] : walletData;
        walletID = String(firstWallet?.wallet_id ?? firstWallet?.walletID ?? '');
    }

    const ledger = await services.assets.getLedgerList({
        ...options.ledger,
        businessId,
        walletID,
    });

    const balances = await services.assets.getBalances({
        ...options.balances,
        businessId,
        walletID,
    });

    return {
        walletID,
        ledger: ledger.data,
        balances: balances.data,
    };
}

/**
 * Fetch paginated wallet transaction history with optional transaction detail drill-down.
 * MCP Tool: `neucron_get_transaction_history`
 */
export async function neucron_get_transaction_history(
    services: McpFlowServices,
    options: NeucronGetTransactionHistoryOptions
) {
    const history = await services.wallet.getTransactions(options);

    let transactionDetails: unknown;
    if (options.includeDetails && options.txid && options.chain && options.network) {
        const details = await services.wallet.getTransactionDetails({
            businessId: options.businessId,
            walletID: options.walletID,
            txid: options.txid,
            chain: options.chain,
            network: options.network,
        });
        transactionDetails = details.data;
    }

    return {
        history: history.data,
        transactionDetails,
    };
}

function transactionRows(data: unknown): Array<Record<string, unknown>> {
    if (Array.isArray(data)) return data as Array<Record<string, unknown>>;
    if (data && typeof data === 'object') {
        const record = data as Record<string, unknown>;
        if (Array.isArray(record.data)) return record.data as Array<Record<string, unknown>>;
        if (Array.isArray(record.transactions)) return record.transactions as Array<Record<string, unknown>>;
    }
    return [];
}

function toCsv(rows: Array<Record<string, unknown>>): string {
    const columns = ['Date', 'Asset', 'Direction', 'Amount', 'Chain', 'Status', 'From', 'To', 'Tx ID'];
    const lines = [columns.join(',')];

    for (const row of rows) {
        lines.push(
            [
                row.date ?? row.created_at ?? '',
                row.asset ?? row.asset_name ?? '',
                row.direction ?? row.type ?? '',
                row.amount ?? '',
                row.chain ?? '',
                row.status ?? '',
                row.from ?? row.from_address ?? '',
                row.to ?? row.to_address ?? '',
                row.txid ?? row.tx_id ?? '',
            ]
                .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                .join(',')
        );
    }

    return lines.join('\n');
}

/**
 * Export filtered transaction history (client-side CSV/JSON generation from history API data).
 * MCP Tool: `neucron_export_transaction_history`
 */
export async function neucron_export_transaction_history(
    services: McpFlowServices,
    options: NeucronExportTransactionHistoryOptions
) {
    const { format = 'csv', fetchAllPages = true, ...historyOptions } = options;
    const page = historyOptions.page ?? 1;
    const limit = historyOptions.limit ?? 100;

    const firstPage = await services.wallet.getTransactions({ ...historyOptions, page, limit });
    let allRows = transactionRows(firstPage.data);

    if (fetchAllPages) {
        let currentPage = page + 1;
        while (true) {
            const nextPage = await services.wallet.getTransactions({ ...historyOptions, page: currentPage, limit });
            const rows = transactionRows(nextPage.data);
            if (rows.length === 0) break;
            allRows = allRows.concat(rows);
            if (rows.length < limit) break;
            currentPage += 1;
        }
    }

    if (format === 'json') {
        return { format, rows: allRows, count: allRows.length };
    }

    return {
        format: 'csv' as const,
        content: toCsv(allRows),
        count: allRows.length,
    };
}

/**
 * List notification/activity logs and mark items as read.
 * MCP Tool: `neucron_get_notification_logs`
 */
export async function neucron_get_notification_logs(
    services: McpFlowServices,
    options: NeucronGetNotificationLogsOptions = {}
) {
    void services;
    void options;
    throw new NeucronError(
        'Notification APIs (GET /notification/all, POST /notification/read) are not yet exposed on the Wallet SDK service.',
        new Error('notifications not implemented'),
        { type: 'internal' }
    );
}
