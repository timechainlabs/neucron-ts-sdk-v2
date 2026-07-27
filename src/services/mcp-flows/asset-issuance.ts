import type { McpFlowServices } from './types.js';
import type {
    NeucronCreateSecurityTokenOptions,
    NeucronCreateAsset21CustomerOptions,
    NeucronSecurityTokenOperationsOptions,
    NeucronIssueSecurityTokenOptions,
} from './types.js';
import type { GetRequestResponse } from '../asset21/types.js';
import { attachAsset21Redirect } from './asset21-redirect.js';

async function resolveWalletId(services: McpFlowServices, businessId?: string, walletID?: string) {
    if (walletID) {
        return walletID;
    }
    const wallets = await services.wallet.walletList({ businessId });
    const walletData = wallets.data as Record<string, unknown> | Array<Record<string, unknown>>;
    const firstWallet = Array.isArray(walletData) ? walletData[0] : walletData;
    return String(firstWallet?.wallet_id ?? firstWallet?.walletID ?? '');
}

function mapOperationAction(action: NeucronSecurityTokenOperationsOptions['action']) {
    return action === 'BURN' ? 'REDEEM' : action;
}

async function findLatestPendingRequest(
    services: McpFlowServices,
    context: { businessId?: string },
    assetId: string,
    state: string
) {
    const response = await services.asset21.getRequest({
        ...context,
        assetID: assetId,
        page: 1,
        size: 20,
        state: state as GetRequestResponse[number]['state'],
        status: 'PENDING',
    });
    const requests = response.data as Array<{ requestId: string; createdAt?: string }>;
    if (!Array.isArray(requests) || requests.length === 0) {
        return undefined;
    }
    return [...requests].sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')))[0];
}

async function approveRequest(
    services: McpFlowServices,
    context: { businessId?: string },
    assetId: string,
    requestId: string
) {
    return services.asset21.updateRequest({
        ...context,
        action: 'APPROVE',
        assetId,
        requestId,
    });
}

/**
 * Register and optionally deploy an Asset21 security token on-chain.
 * MCP Tool: `neucron_create_security_token`
 */
export async function neucron_create_security_token(
    services: McpFlowServices,
    options: NeucronCreateSecurityTokenOptions
) {
    const { businessId, deploy = true } = options;
    const context = { businessId };
    const steps: Record<string, unknown> = {};

    let assetID = options.assetID;
    if (!assetID) {
        if (!options.register) {
            throw new Error('Either assetID or register payload is required.');
        }
        const walletID = await resolveWalletId(services, businessId, options.walletID);
        steps.walletID = walletID;

        const registered = await services.asset21.register({
            ...context,
            ...options.register,
            wallet_id: options.register.wallet_id ?? walletID,
        });
        steps.register = registered.data;
        assetID = registered.data.assetID;
    }

    if (deploy && assetID) {
        const deployed = await services.asset21.deploy({
            ...context,
            assetID,
        });
        steps.deploy = deployed.data;
    }

    return attachAsset21Redirect({ assetID, steps });
}

/**
 * Onboard an Asset21 customer via CUSTOMER request and optional approval.
 * MCP Tool: `neucron_create_asset21_customer`
 */
export async function neucron_create_asset21_customer(
    services: McpFlowServices,
    options: NeucronCreateAsset21CustomerOptions
) {
    const { businessId, assetId, autoApprove = true } = options;
    const context = { businessId };
    const steps: Record<string, unknown> = {};

    let requestId = options.requestId;
    if (!requestId) {
        const created = await services.asset21.createRequest({
            ...context,
            assetId,
            state: 'CUSTOMER',
            requestDetails: options.requestDetails,
            approvalsRequired: options.approvalsRequired,
            rejectionsRequired: options.rejectionsRequired,
        });
        steps.createRequest = created.data;

        const createdPayload = created.data as Record<string, unknown>;
        requestId =
            typeof createdPayload.requestId === 'string'
                ? createdPayload.requestId
                : (await findLatestPendingRequest(services, context, assetId, 'CUSTOMER'))?.requestId;
    }

    if (autoApprove && requestId) {
        const approved = await approveRequest(services, context, assetId, requestId);
        steps.approveRequest = approved.data;
    } else if (autoApprove) {
        steps.approveNote =
            'Could not resolve requestId for approval; fetch pending CUSTOMER requests and approve manually.';
    }

    if (options.loadCustomers) {
        const customers = await services.asset21.getCustomers({
            ...context,
            assetID: assetId,
        });
        steps.customers = customers.data;
    }

    return attachAsset21Redirect({ assetId, requestId, steps });
}

/**
 * Create and optionally approve Asset21 core token operations (mint, burn, blacklist, freeze, etc.).
 * MCP Tool: `neucron_security_token_operations`
 */
export async function neucron_security_token_operations(
    services: McpFlowServices,
    options: NeucronSecurityTokenOperationsOptions
) {
    const { businessId, assetId, autoApprove = true } = options;
    const context = { businessId };
    const state = mapOperationAction(options.action);
    const steps: Record<string, unknown> = {};

    let requestId = options.requestId;
    if (!requestId) {
        const created = await services.asset21.createRequest({
            ...context,
            assetId,
            state,
            requestDetails: options.requestDetails,
            approvalsRequired: options.approvalsRequired,
            rejectionsRequired: options.rejectionsRequired,
        });
        steps.createRequest = created.data;

        const createdPayload = created.data as Record<string, unknown>;
        requestId =
            typeof createdPayload.requestId === 'string'
                ? createdPayload.requestId
                : (await findLatestPendingRequest(services, context, assetId, state))?.requestId;
    }

    if (autoApprove && requestId) {
        const approved = await approveRequest(services, context, assetId, requestId);
        steps.approveRequest = approved.data;
    } else if (autoApprove) {
        steps.approveNote = `Could not resolve requestId for ${state}; fetch pending ${state} requests and approve manually.`;
    }

    if (options.syncTransaction) {
        const synced = await services.asset21.syncTransaction({
            ...context,
            assetID: assetId,
            txid: options.syncTransaction.txid,
        });
        steps.syncTransaction = synced.data;
    }

    if (options.getAddressState) {
        const addressState = await services.asset21.getAddressState({
            ...context,
            assetID: assetId,
            address: options.getAddressState.address,
        });
        steps.addressState = addressState.data;
    }

    return attachAsset21Redirect({ assetId, state, requestId, steps });
}

/** @deprecated Use {@link neucron_create_security_token} and {@link neucron_security_token_operations}. */
export async function neucron_issue_security_token(
    services: McpFlowServices,
    options: NeucronIssueSecurityTokenOptions
) {
    const { businessId } = options;
    const context = { businessId };
    const steps: Record<string, unknown> = {};

    const walletID = await resolveWalletId(services, businessId, options.walletID);
    steps.walletID = walletID;

    const { assetID, steps: tokenSteps } = await neucron_create_security_token(services, {
        businessId,
        walletID,
        register: options.register,
        deploy: false,
    });
    Object.assign(steps, tokenSteps);

    if (options.governanceRequest) {
        const request = await services.asset21.createRequest({
            ...context,
            ...options.governanceRequest,
        });
        steps.governanceRequest = request.data;
    }

    if (options.loadRequest) {
        const requestDetails = await services.asset21.getRequest({
            ...context,
            ...options.loadRequest,
        });
        steps.requestDetails = requestDetails.data;
    }

    if (options.handleRequest) {
        const handled = await services.asset21.updateRequest({
            ...context,
            ...options.handleRequest,
        });
        steps.handleRequest = handled.data;
    }

    return {
        assetID,
        walletID,
        steps,
        mintNote: options.mintAssetID
            ? 'Use neucron_security_token_operations with action MINT for mint workflows.'
            : undefined,
    };
}
