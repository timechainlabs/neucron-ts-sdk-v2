import type { NeucronSDK } from '../../neucron-sdk.js';
import type { McpFlowServices } from './types.js';
import * as authSetup from './auth-setup.js';
import * as oauth from './oauth.js';
import * as holdings from './holdings.js';
import * as develop from './develop.js';
import * as getPaid from './get-paid.js';
import * as payFlows from './pay-flows.js';
import * as dataIntegrity from './data-integrity.js';
import * as assetIssuance from './asset-issuance.js';

export * from './types.js';
export type { FlowFile, Base64FileContent, UploadableFile } from './file.js';

/**
 * MCP flow orchestrators that chain existing SDK service methods in UI-flow order.
 * Each public method maps 1:1 to an MCP tool name from `docs/internal/mcp-flows-sop.md`.
 */
export class McpFlows {
    private readonly services: McpFlowServices;

    constructor(sdk: NeucronSDK) {
        this.services = {
            auth: sdk.auth,
            oauth: sdk.oauth,
            wallet: sdk.wallet,
            business: sdk.business,
            assets: sdk.assets,
            apps: sdk.apps,
            blob: sdk.blob,
            invoice: sdk.invoice,
            customer: sdk.customer,
            vendor: sdk.vendor,
            bill: sdk.bill,
            payout: sdk.payout,
            pay: sdk.pay,
            dataIntegrity: sdk.dataIntegrity,
            asset21: sdk.asset21,
        };
    }

    /** Authenticate a user via email/password and return a session token. */
    neucron_login = (options: Parameters<typeof authSetup.neucron_login>[1]) =>
        authSetup.neucron_login(this.services, options);

    /** Start Sign in with Neucron and return the hosted login URL. */
    neucron_oauth_authorize = (options: Parameters<typeof oauth.neucron_oauth_authorize>[1]) =>
        oauth.neucron_oauth_authorize(this.services, options);

    /** Exchange an OAuth authorization code for an access token and user profile. */
    neucron_oauth_exchange_token = (options: Parameters<typeof oauth.neucron_oauth_exchange_token>[1]) =>
        oauth.neucron_oauth_exchange_token(this.services, options);

    /** List available personal and business entities and set the active operating context. */
    neucron_choose_entity = (options?: Parameters<typeof authSetup.neucron_choose_entity>[1]) =>
        authSetup.neucron_choose_entity(this.services, options);

    /** Register a new business entity with KYB details. */
    neucron_create_business = (options: Parameters<typeof authSetup.neucron_create_business>[1]) =>
        authSetup.neucron_create_business(this.services, options);

    /** List all wallets for the authenticated user or selected business. */
    neucron_list_wallets = (options?: Parameters<typeof holdings.neucron_list_wallets>[1]) =>
        holdings.neucron_list_wallets(this.services, options);

    /** Create a new MPC or encrypted wallet and refresh the wallet list. */
    neucron_create_wallet = (options: Parameters<typeof holdings.neucron_create_wallet>[1]) =>
        holdings.neucron_create_wallet(this.services, options);

    /** Fetch asset balances for a wallet across chains/networks. */
    neucron_get_balances = (options: Parameters<typeof holdings.neucron_get_balances>[1]) =>
        holdings.neucron_get_balances(this.services, options);

    /** Fetch paginated wallet transaction history with optional detail drill-down. */
    neucron_get_transaction_history = (options: Parameters<typeof holdings.neucron_get_transaction_history>[1]) =>
        holdings.neucron_get_transaction_history(this.services, options);

    /** Export filtered transaction history to CSV or JSON. */
    neucron_export_transaction_history = (options: Parameters<typeof holdings.neucron_export_transaction_history>[1]) =>
        holdings.neucron_export_transaction_history(this.services, options);

    /** List notification/activity logs and mark items as read. */
    neucron_get_notification_logs = (options?: Parameters<typeof holdings.neucron_get_notification_logs>[1]) =>
        holdings.neucron_get_notification_logs(this.services, options);

    /** Create a new developer application with credentials and optional document upload. */
    neucron_create_app = (options: Parameters<typeof develop.neucron_create_app>[1]) =>
        develop.neucron_create_app(this.services, options);

    /** Submit a configured app for platform publishing. */
    neucron_publish_app = (options: Parameters<typeof develop.neucron_publish_app>[1]) =>
        develop.neucron_publish_app(this.services, options);

    /** Browse installed apps and the public app catalog. */
    neucron_browse_appstore = (options?: Parameters<typeof develop.neucron_browse_appstore>[1]) =>
        develop.neucron_browse_appstore(this.services, options);

    /** Create a universal payment collection link for a wallet. */
    neucron_create_collection_link = (options: Parameters<typeof getPaid.neucron_create_collection_link>[1]) =>
        getPaid.neucron_create_collection_link(this.services, options);

    /** Create, update, delete, list, or get a customer. */
    neucron_customer_manage = (action: Parameters<typeof getPaid.neucron_customer_manage>[1]) =>
        getPaid.neucron_customer_manage(this.services, action);

    /** @deprecated Use {@link neucron_customer_manage} */
    neucron_manage_customer = (action: Parameters<typeof getPaid.neucron_customer_manage>[1]) =>
        getPaid.neucron_customer_manage(this.services, action);

    /** Create or update an invoice through the multi-step invoice builder. */
    neucron_create_invoice = (options: Parameters<typeof getPaid.neucron_create_invoice>[1]) =>
        getPaid.neucron_create_invoice(this.services, options);

    /** Create or update the payment collection linked to an invoice. */
    neucron_manage_invoice_payment_collection = (
        options: Parameters<typeof getPaid.neucron_manage_invoice_payment_collection>[1]
    ) => getPaid.neucron_manage_invoice_payment_collection(this.services, options);

    /** Retrieve revenue analytics and customer balance summaries. */
    neucron_get_revenue = (options?: Parameters<typeof getPaid.neucron_get_revenue>[1]) =>
        getPaid.neucron_get_revenue(this.services, options);

    /** Create, update, delete, invite, suspend, or accept a vendor. */
    neucron_vendor_manage = (action: Parameters<typeof payFlows.neucron_vendor_manage>[1]) =>
        payFlows.neucron_vendor_manage(this.services, action);

    /** @deprecated Use {@link neucron_vendor_manage} */
    neucron_manage_vendor = (action: Parameters<typeof payFlows.neucron_vendor_manage>[1]) =>
        payFlows.neucron_vendor_manage(this.services, action);

    /** Create or update a vendor bill with optional document upload. */
    neucron_manage_bill = (options: Parameters<typeof payFlows.neucron_manage_bill>[1]) =>
        payFlows.neucron_manage_bill(this.services, options);

    /** Pay an approved vendor bill by creating and triggering a payout. */
    neucron_pay_bill = (options: Parameters<typeof payFlows.neucron_pay_bill>[1]) =>
        payFlows.neucron_pay_bill(this.services, options);

    /** Schedule a future payout for a vendor bill. */
    neucron_schedule_payment = (options: Parameters<typeof payFlows.neucron_schedule_payment>[1]) =>
        payFlows.neucron_schedule_payment(this.services, options);

    /** Send funds via transfer, payout, or direct vendor payment. */
    neucron_create_payout = (options: Parameters<typeof payFlows.neucron_create_payout>[1]) =>
        payFlows.neucron_create_payout(this.services, options);

    /** List payouts and retrieve individual payout details. */
    neucron_get_payout_history = (options: Parameters<typeof payFlows.neucron_get_payout_history>[1]) =>
        payFlows.neucron_get_payout_history(this.services, options);

    /** Retrieve expense summary and time-series spend analytics. */
    neucron_get_expenses = (options: Parameters<typeof payFlows.neucron_get_expenses>[1]) =>
        payFlows.neucron_get_expenses(this.services, options);

    /** Inscribe a file on-chain for proof of existence. */
    neucron_inscribe_document = (options: Parameters<typeof dataIntegrity.neucron_inscribe_document>[1]) =>
        dataIntegrity.neucron_inscribe_document(this.services, options);

    /** Inscribe plain text on-chain for proof of existence. */
    neucron_inscribe_text = (options: Parameters<typeof dataIntegrity.neucron_inscribe_text>[1]) =>
        dataIntegrity.neucron_inscribe_text(this.services, options);

    /** Inscribe multiple text entries on-chain in a single transaction. */
    neucron_inscribe_text_array = (options: Parameters<typeof dataIntegrity.neucron_inscribe_text_array>[1]) =>
        dataIntegrity.neucron_inscribe_text_array(this.services, options);

    /** Issue a security token (Asset21) through register, governance, and mint phases. */
    neucron_issue_security_token = (options: Parameters<typeof assetIssuance.neucron_issue_security_token>[1]) =>
        assetIssuance.neucron_issue_security_token(this.services, options);

    /** Register and deploy an Asset21 security token. */
    neucron_create_security_token = (options: Parameters<typeof assetIssuance.neucron_create_security_token>[1]) =>
        assetIssuance.neucron_create_security_token(this.services, options);

    /** Onboard an Asset21 customer (create + approve). */
    neucron_create_asset21_customer = (options: Parameters<typeof assetIssuance.neucron_create_asset21_customer>[1]) =>
        assetIssuance.neucron_create_asset21_customer(this.services, options);

    /** Mint, burn, blacklist, freeze, and other Asset21 core operations. */
    neucron_security_token_operations = (
        options: Parameters<typeof assetIssuance.neucron_security_token_operations>[1]
    ) => assetIssuance.neucron_security_token_operations(this.services, options);
}
