import type { McpFlowServices } from './types.js';
import type {
    NeucronCreateCollectionLinkOptions,
    NeucronCustomerManageAction,
    NeucronCreateInvoiceOptions,
    NeucronManageInvoicePaymentCollectionOptions,
    NeucronGetRevenueOptions,
} from './types.js';
import type { GetCustomer, ListCustomers } from '../customer/types.js';
import { normalizeInvoiceDates, normalizeInvoicePayload } from '../../utils/schema/normalize.js';
import { resolveFlowUpload } from './file.js';

/**
 * Create a universal payment collection link for a wallet.
 * MCP Tool: `neucron_create_collection_link`
 */
export async function neucron_create_collection_link(
    services: McpFlowServices,
    options: NeucronCreateCollectionLinkOptions
) {
    const businessId = options.businessId;

    let walletID = options.walletID;
    if (!walletID) {
        const wallets = await services.wallet.walletList({ businessId });
        const walletData = wallets.data as Record<string, unknown> | Array<Record<string, unknown>>;
        const firstWallet = Array.isArray(walletData) ? walletData[0] : walletData;
        walletID = String(firstWallet?.wallet_id ?? firstWallet?.walletID ?? '');
    }

    const walletInfo = await services.invoice.getWalletPaymentCollectionInfo({ businessId, walletID });

    let customization: unknown;
    if (options.customization) {
        if (options.updateCustomization) {
            const updated = await services.invoice.updateWalletPaymentCollectionCustomization({
                businessId,
                walletID,
                payload: options.customization,
            });
            customization = updated.data;
        } else {
            const created = await services.invoice.createWalletPaymentCollectionCustomization({
                businessId,
                walletID,
                payload: options.customization,
            });
            customization = created.data;
        }
    }

    let collection: unknown;
    if (options.publicCollection) {
        const created = await services.invoice.createPublicPaymentCollection({
            businessId,
            data: {
                ...options.publicCollection,
                wallet_id: options.publicCollection.wallet_id || walletID,
            },
        });
        collection = created.data;
    } else if (options.collection) {
        const created = await services.invoice.submitCollection({
            businessId,
            data: options.collection,
        });
        collection = created.data;
    }

    return {
        walletID,
        walletInfo: walletInfo.data,
        customization,
        collection,
    };
}

async function getCustomerWithListFallback(services: McpFlowServices, options: GetCustomer) {
    try {
        const customer = await services.customer.getCustomer(options);
        return customer.data;
    } catch (primaryError) {
        const list = await services.customer.getCustomers({
            businessId: options.businessId,
            page: 1,
            size: 100,
        });
        const payload = list.data as Record<string, unknown>;
        const items = (Array.isArray(payload) ? payload : (payload.customers as unknown[] | undefined)) ?? [];
        const found = items.find((entry) => {
            const record = entry as Record<string, unknown>;
            const id = String(record.customer_id ?? record.customerID ?? record.customerId ?? '');
            return id === options.customerId;
        });
        if (found) {
            return found;
        }
        throw primaryError;
    }
}

/**
 * Create, update, delete, list, or get a customer for invoicing and collections.
 * MCP Tool: `neucron_customer_manage`
 */
export async function neucron_customer_manage(services: McpFlowServices, action: NeucronCustomerManageAction) {
    switch (action.action) {
        case 'create': {
            const customer = await services.customer.createCustomer(action.options);
            let invite: unknown;
            if (action.invite) {
                const customerId = String(
                    (customer.data as Record<string, unknown>).customer_id ??
                        (customer.data as Record<string, unknown>).customerID ??
                        (customer.data as Record<string, unknown>).customerId ??
                        ''
                );
                if (customerId) {
                    invite = (
                        await services.customer.inviteCustomer({
                            businessId: action.options.businessId,
                            customerId,
                        })
                    ).data;
                }
            }
            return { customer: customer.data, invite };
        }
        case 'update': {
            const customer = await services.customer.updateCustomer(action.options);
            return { customer: customer.data };
        }
        case 'delete': {
            const result = await services.customer.deleteCustomer(action.options);
            return { result: result.data };
        }
        case 'invite': {
            const result = await services.customer.inviteCustomer(action.options);
            return { result: result.data };
        }
        case 'list': {
            const customers = await services.customer.getCustomers(action.options);
            return { customers: customers.data };
        }
        case 'get': {
            const customer = await getCustomerWithListFallback(services, action.options);
            return { customer };
        }
    }
}

/** @deprecated Use {@link neucron_customer_manage} */
export const neucron_manage_customer = neucron_customer_manage;

/**
 * Create or update an invoice through the multi-step invoice builder flow.
 * MCP Tool: `neucron_create_invoice`
 */
export async function neucron_create_invoice(services: McpFlowServices, options: NeucronCreateInvoiceOptions) {
    const { businessId } = options;
    const steps: Record<string, unknown> = {};

    if (options.customerList) {
        const { businessId: customerBusinessId, ...customerFilters } = options.customerList;
        const customers = await services.customer.getCustomers({
            ...customerFilters,
            businessId: customerBusinessId ?? businessId,
        } as ListCustomers);
        steps.customers = customers.data;
    }

    let attachment: unknown;
    if (options.attachment) {
        const uploaded = await services.blob.uploadDocument(resolveFlowUpload(options.attachment));
        attachment = uploaded.data;
        steps.attachment = attachment;
    }

    let invoice: unknown;
    const invoiceData = normalizeInvoiceDates(options.invoiceData);
    const updateData = options.updateData ? normalizeInvoicePayload(options.updateData) : undefined;

    if (options.invoiceID && updateData) {
        const updated = await services.invoice.updateInvoice({
            businessId,
            invoiceID: options.invoiceID,
            invoiceData: updateData,
        });
        invoice = updated.data;
    } else {
        const created = await services.invoice.createInvoice({
            businessId,
            invoiceData,
        });
        invoice = created.data;
    }

    const invoiceID =
        options.invoiceID ??
        String((invoice as Record<string, unknown>).invoice_id ?? (invoice as Record<string, unknown>).invoiceID ?? '');

    const invoiceDetails = await services.invoice.getInvoiceDetails({ businessId, invoiceID });
    steps.invoiceDetails = invoiceDetails.data;

    const paymentCollections = await services.invoice.getInvoicePaymentCollections({ businessId, invoiceID });
    steps.paymentCollections = paymentCollections.data;

    if (options.share) {
        const shared = await services.invoice.shareInvoice(options.share);
        steps.share = shared.data;
    }

    if (options.finalise) {
        const finalised = await services.invoice.finaliseInvoice({ businessId, invoiceID });
        steps.finalise = finalised.data;
    }

    return { invoice, invoiceID, steps, attachment };
}

/**
 * Create or update the payment collection linked to an invoice.
 * MCP Tool: `neucron_manage_invoice_payment_collection`
 */
export async function neucron_manage_invoice_payment_collection(
    services: McpFlowServices,
    options: NeucronManageInvoicePaymentCollectionOptions
) {
    const { businessId, invoiceID } = options;
    const existing = await services.invoice.getInvoicePaymentCollections({ businessId, invoiceID });

    let collection: unknown;
    if (options.supportedAssets) {
        if (existing.data && Object.keys(existing.data as object).length > 0) {
            const updated = await services.invoice.updatePaymentCollection({
                businessId,
                invoiceID,
                supportedAssets: options.supportedAssets,
            });
            collection = updated.data;
        } else {
            const created = await services.invoice.createPaymentCollection({
                businessId,
                invoiceID,
                walletID: options.walletID,
                supportedAssets: options.supportedAssets,
            });
            collection = created.data;
        }
    }

    let collectionDetails: unknown;
    if (options.collectionID) {
        const details = await services.invoice.getPaymentCollection({
            businessId,
            collectionID: options.collectionID,
        });
        collectionDetails = details.data;
    }

    let mapped: unknown;
    if (options.mapToInvoice && options.collectionID) {
        const mapResult = await services.invoice.mapCollectionToInvoice({
            businessId,
            invoiceID,
            collectionID: options.collectionID,
        });
        mapped = mapResult.data;
    }

    let paymentCheck: unknown;
    if (options.checkPayment) {
        const check = await services.invoice.checkPaymentCollection({
            businessId,
            collectionID: options.checkPayment.collectionID,
            txHash: options.checkPayment.txHash,
        });
        paymentCheck = check.data;
    }

    return {
        existing: existing.data,
        collection,
        collectionDetails,
        mapped,
        paymentCheck,
    };
}

/**
 * Retrieve revenue analytics and customer balance summaries.
 * MCP Tool: `neucron_get_revenue`
 */
export async function neucron_get_revenue(services: McpFlowServices, options: NeucronGetRevenueOptions = {}) {
    const revenue = await services.invoice.getRevenueGraph(options);
    const customerBalances = await services.invoice.getCustomerBalances(options);

    return {
        revenue: revenue.data,
        customerBalances: customerBalances.data,
    };
}
