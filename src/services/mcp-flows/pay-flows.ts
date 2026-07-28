import type { McpFlowServices } from './types.js';
import type {
    NeucronVendorManageAction,
    NeucronManageBillOptions,
    NeucronPayBillOptions,
    NeucronSchedulePaymentOptions,
    NeucronCreatePayoutOptions,
    NeucronGetPayoutHistoryOptions,
    NeucronGetExpensesOptions,
} from './types.js';
import { toIsoDateTime } from '../../utils/schema/normalize.js';
import { resolveFlowUpload } from './file.js';
import type { ListVendors } from '../vendor/types.js';
import type { ListBills } from '../bill/types.js';

/**
 * Create, update, delete, invite, suspend, or accept a vendor.
 * MCP Tool: `neucron_vendor_manage`
 */
export async function neucron_vendor_manage(services: McpFlowServices, action: NeucronVendorManageAction) {
    switch (action.action) {
        case 'create': {
            const vendor = await services.vendor.createVendor(action.options);
            return { vendor: vendor.data };
        }
        case 'update': {
            const vendor = await services.vendor.updateVendor(action.options);
            return { vendor: vendor.data };
        }
        case 'list': {
            const vendors = await services.vendor.listVendors(action.options);
            return { vendors: vendors.data };
        }
        case 'get': {
            const vendor = await services.vendor.getVendor(action.options);
            return { vendor: vendor.data };
        }
        case 'delete': {
            const result = await services.vendor.deleteVendor(action.options);
            return { result: result.data };
        }
        case 'invite': {
            const result = await services.vendor.inviteVendor(action.options);
            return { result: result.data };
        }
        case 'suspend': {
            const result = await services.vendor.setVendorSuspension(action.options);
            return { result: result.data };
        }
        case 'accept': {
            const result = await services.vendor.acceptVendor(action.options);
            return { result: result.data };
        }
    }
}

/** @deprecated Use {@link neucron_vendor_manage} */
export const neucron_manage_vendor = neucron_vendor_manage;

/**
 * Create or update a vendor bill with optional document upload and review actions.
 * MCP Tool: `neucron_manage_bill`
 */
export async function neucron_manage_bill(services: McpFlowServices, options: NeucronManageBillOptions) {
    const { businessId, mode } = options;
    const steps: Record<string, unknown> = {};

    if (options.vendorList) {
        const { businessId: vendorBusinessId, ...vendorFilters } = options.vendorList;
        const vendors = await services.vendor.listVendors({
            ...vendorFilters,
            businessId: vendorBusinessId ?? businessId,
        } as ListVendors);
        steps.vendors = vendors.data;
    }

    if (options.billID && mode !== 'create') {
        const bill = await services.bill.getBill({ businessId, billID: options.billID });
        steps.existingBill = bill.data;
    }

    if (options.attachment) {
        const uploaded = await services.blob.uploadDocument(resolveFlowUpload(options.attachment));
        steps.attachment = uploaded.data;
    }

    let bill: unknown;
    if (mode === 'create' && options.createPayload) {
        const created = await services.bill.createBill({
            businessId,
            payload: {
                ...options.createPayload,
                status: options.createPayload.status ?? 'DRAFTED',
                billing_details: {
                    ...options.createPayload.billing_details,
                    bill_date: toIsoDateTime(options.createPayload.billing_details.bill_date),
                    due_date: toIsoDateTime(options.createPayload.billing_details.due_date),
                },
            },
        });
        bill = created.data;
    } else if (mode === 'update' && options.billID && options.updatePayload) {
        const updated = await services.bill.updateBill({
            businessId,
            billID: options.billID,
            payload: options.updatePayload,
        });
        bill = updated.data;
    } else if (mode === 'review' && options.review) {
        const reviewed = await services.bill.reviewBill(options.review);
        bill = reviewed.data;
    }

    return { bill, steps };
}

/**
 * Pay an approved vendor bill by creating a payout, mapping it, and triggering execution.
 * MCP Tool: `neucron_pay_bill`
 */
export async function neucron_pay_bill(services: McpFlowServices, options: NeucronPayBillOptions) {
    const { businessId, billID } = options;

    const bill = await services.bill.getBill({ businessId, billID });
    const payout = await services.payout.createPayout({ businessId, payload: options.payoutPayload });
    const payoutID = String(
        (payout.data as Record<string, unknown>).payout_id ?? (payout.data as Record<string, unknown>).payoutID ?? ''
    );

    const mapped = await services.bill.mapBillToPayout({ businessId, billID, payoutID });
    const triggered = await services.payout.triggerPayout({ businessId, payoutID });
    const payoutStatus = await services.payout.getPayout({ businessId, payoutID });

    let confirmed: unknown;
    if (options.confirmPayout) {
        const confirmResult = await services.payout.confirmPayout({
            businessId,
            payoutID,
            payload: options.confirmPayout,
        });
        confirmed = confirmResult.data;
    }

    return {
        bill: bill.data,
        payout: payout.data,
        payoutID,
        mapped: mapped.data,
        triggered: triggered.data,
        payoutStatus: payoutStatus.data,
        confirmed,
    };
}

/**
 * Schedule a future payout for a vendor bill.
 * MCP Tool: `neucron_schedule_payment`
 */
export async function neucron_schedule_payment(services: McpFlowServices, options: NeucronSchedulePaymentOptions) {
    const { businessId, billID } = options;
    const steps: Record<string, unknown> = {};

    if (options.vendorList) {
        const { businessId: vendorBusinessId, ...vendorFilters } = options.vendorList;
        const vendors = await services.vendor.listVendors({
            ...vendorFilters,
            businessId: vendorBusinessId ?? businessId,
        } as ListVendors);
        steps.vendors = vendors.data;
    }

    if (options.billList) {
        const { businessId: billBusinessId, ...billFilters } = options.billList;
        const bills = await services.bill.listBills({
            ...billFilters,
            businessId: billBusinessId ?? businessId,
        } as ListBills);
        steps.bills = bills.data;
    }

    const payout = await services.payout.createPayout({ businessId, payload: options.payoutPayload });
    const payoutID = String(
        (payout.data as Record<string, unknown>).payout_id ?? (payout.data as Record<string, unknown>).payoutID ?? ''
    );

    const mapped = await services.bill.mapBillToPayout({ businessId, billID, payoutID });

    return {
        steps,
        payout: payout.data,
        payoutID,
        mapped: mapped.data,
    };
}

/**
 * Send funds via direct transfer or standalone payout.
 * MCP Tool: `neucron_create_payout`
 */
export async function neucron_create_payout(services: McpFlowServices, options: NeucronCreatePayoutOptions) {
    if (options.mode === 'transfer') {
        const destinations = options.options.transfer_destinations;
        const hasPaymail = destinations.some((d) => 'paymail' in d && Boolean(d.paymail));
        const hasEmail = destinations.some((d) => 'email' in d && Boolean(d.email));
        const hasAddress = destinations.some((d) => 'address' in d && Boolean(d.address));

        const walletID = options.options.walletID ?? '';
        const balances = walletID
            ? await services.assets.getBalances({
                  walletID,
                  network: 'MAIN',
              })
            : undefined;

        let transfer;
        if (hasPaymail) {
            transfer = await services.pay.payWithPaymail(options.options);
        } else if (hasEmail) {
            transfer = await services.pay.payWithEmail(options.options);
        } else if (hasAddress) {
            transfer = await services.pay.payWithAddress(options.options);
        } else {
            transfer = await services.pay.payWithAddress(options.options);
        }

        return { balances: balances?.data, transfer: transfer.data };
    }

    const payout = await services.payout.createPayout(options.options);

    let updated: unknown;
    if (options.updateBeforeTrigger) {
        const updateResult = await services.payout.updatePayout({
            businessId: options.updateBeforeTrigger.businessId,
            payoutID: options.updateBeforeTrigger.payoutID,
            payload: options.updateBeforeTrigger.payload,
        });
        updated = updateResult.data;
    }

    let triggered: unknown;
    if (options.trigger) {
        const payoutID = String(
            (payout.data as Record<string, unknown>).payout_id ??
                (payout.data as Record<string, unknown>).payoutID ??
                ''
        );
        const triggerResult = await services.payout.triggerPayout({
            businessId: options.options.businessId,
            payoutID,
        });
        triggered = triggerResult.data;
    }

    return { payout: payout.data, updated, triggered };
}

/**
 * List payouts and retrieve individual payout details.
 * MCP Tool: `neucron_get_payout_history`
 */
export async function neucron_get_payout_history(services: McpFlowServices, options: NeucronGetPayoutHistoryOptions) {
    const list = await services.payout.listPayouts(options);

    let payout: unknown;
    if (options.payoutID) {
        const detail = await services.payout.getPayout({
            businessId: options.businessId,
            payoutID: options.payoutID,
        });
        payout = detail.data;
    }

    return { list: list.data, payout };
}

/**
 * Retrieve expense summary and time-series spend analytics.
 * MCP Tool: `neucron_get_expenses`
 */
export async function neucron_get_expenses(services: McpFlowServices, options: NeucronGetExpensesOptions) {
    const summary = await services.vendor.getExpenseSummary(options);
    const graph = await services.vendor.getExpenseGraph(options);

    return {
        summary: summary.data,
        graph: graph.data,
    };
}
