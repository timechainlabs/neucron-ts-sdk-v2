import { z } from 'zod';
import { loginSchema } from '../authentication/schema.js';
import { oauthAuthorizeSchema, oauthTokenExchangeSchema } from '../oauth/schema.js';
import { createWalletSchema, transactionsSchema } from '../wallet/schema.js';
import { createBusinessSchema } from '../business/schema.js';
import { balancesSchema, ledgerListSchema } from '../assets/schema.js';
import { createAppSchema } from '../apps/schema.js';
import {
    checkPaymentSchema,
    createInvoicePayloadSchema,
    createPublicPaymentCollectionSchema,
    revenueGraphFiltersSchema,
    shareInvoiceSchema,
    submitCollectionSchema,
    walletCustomizationSchema,
} from '../invoice/schema.js';
import {
    createCustomerSchema,
    deleteCustomerSchema,
    getCustomerSchema,
    inviteCustomerSchema,
    listCustomersSchema,
    updateCustomerSchema,
} from '../customer/schema.js';
import {
    acceptVendorSchema,
    createVendorSchema,
    expenseGraphFiltersSchema,
    listVendorsSchema,
    payVendorSchema,
    setVendorSuspensionSchema,
    updateVendorSchema,
    vendorIdSchema,
} from '../vendor/schema.js';
import { listBillsSchema, reviewBillSchema, vendorBillPayloadSchema } from '../bill/schema.js';
import {
    confirmPayoutSchema,
    createPayoutSchema,
    listPayoutsSchema,
    payoutUpsertPayloadSchema,
    updatePayoutSchema,
} from '../payout/schema.js';
import { payRequestSchema } from '../pay/schema.js';
import { fileUploadSchema, textArrayUploadSchema, textUploadSchema } from '../data-integrity/schema.js';
import { registerBodySchema, requestDetailsSchema } from '../asset21/schema.js';
import { jsonFileSchema, nonEmptyString, optionalBusinessId } from '../../utils/schema/common.js';

/**
 * Complete input schemas for every compound MCP flow (`sdk.flows.*`).
 * These are the single source of truth for MCP tool `inputSchema` definitions:
 * the MCP server imports them instead of re-declaring validation rules.
 * No `z.unknown()` / `z.any()` anywhere, so JSON-schema generation for tool
 * definitions stays precise.
 */

// ---------------------------------------------------------------------------
// Shared building blocks
// ---------------------------------------------------------------------------

/** Upload wrapper used by flows that attach a document/image to a step. */
export const flowUploadSchema = z.object({
    businessId: optionalBusinessId,
    file: jsonFileSchema.describe(
        'File to upload: { fileBase64, fileName?, mimeType? } or a React Native { uri, name, type } object.'
    ),
});

/** Vendor list filter for nested flow steps; businessId falls back to the flow-level one. */
const vendorListFilterSchema = listVendorsSchema.omit({ businessId: true }).extend({
    businessId: optionalBusinessId,
});

/** Bill list filter for nested flow steps; businessId falls back to the flow-level one. */
const billListFilterSchema = listBillsSchema.omit({ businessId: true }).extend({
    businessId: optionalBusinessId,
});

/** Customer list filter for nested flow steps; businessId falls back to the flow-level one. */
const customerListFilterSchema = listCustomersSchema.omit({ businessId: true }).extend({
    businessId: optionalBusinessId,
});

/** App metadata payload (POST /app). */
export const appDataSchema = z.object({
    app_name: nonEmptyString.describe('Display name of the application.'),
    app_domain: z.string().url().optional().describe('Primary domain of the application.'),
    app_icon: z.string().optional().describe('Icon URL (set automatically when uploadIcon is provided).'),
    app_images: z.array(z.string()).optional().describe('Preview image URLs.'),
    description: z.string().optional(),
    type: z.string().optional(),
    color: z.string().optional(),
    logo: z.string().optional(),
});

/** Partial app metadata update (PUT /app), e.g. publish-time final touches. */
export const appUpdateDataSchema = appDataSchema.partial();

/** KYB/business details update payload (POST /business/update). */
export const businessUpdateDataSchema = createBusinessSchema.partial();

// ---------------------------------------------------------------------------
// Auth setup
// ---------------------------------------------------------------------------

export const neucronLoginSchema = z.object({
    method: z.literal('email').default('email').describe('Login method (email only for now).'),
    credentials: loginSchema,
});

export const neucronOauthAuthorizeSchema = oauthAuthorizeSchema;

export const neucronOauthExchangeTokenSchema = oauthTokenExchangeSchema;

export const neucronChooseEntitySchema = z.object({
    businessId: optionalBusinessId.describe('Business to make active; omit for the personal account.'),
    loadBusinessDetails: z.boolean().optional().describe('Load full business details after selection.'),
});

export const neucronCreateBusinessSchema = z.object({
    payload: createBusinessSchema.describe('KYB payload for business creation.'),
    businessId: optionalBusinessId.describe('Skip creation and use an existing business ID.'),
    submitKyb: z.boolean().optional(),
    updateAfterCreate: businessUpdateDataSchema.optional().describe('Business details to update after creation.'),
});

// ---------------------------------------------------------------------------
// Holdings
// ---------------------------------------------------------------------------

export const neucronListWalletsSchema = z.object({
    businessId: optionalBusinessId,
});

export const neucronCreateWalletSchema = createWalletSchema.extend({
    refreshList: z.boolean().optional().describe('Refresh wallet list after creation (default true).'),
});

export const neucronGetBalancesSchema = z.object({
    businessId: optionalBusinessId,
    walletID: z.string().optional().describe('Wallet ID (defaults to the first wallet).'),
    ledger: ledgerListSchema
        .omit({ businessId: true, walletID: true })
        .optional()
        .describe('Optional ledger filters (status, pagination).'),
    balances: balancesSchema
        .omit({ businessId: true, walletID: true })
        .optional()
        .describe('Optional balance filters (network, currency).'),
});

export const neucronGetTransactionHistorySchema = transactionsSchema.extend({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).default(25),
    includeDetails: z
        .boolean()
        .optional()
        .describe('Fetch single transaction detail when txid/chain/network are provided.'),
    txid: z.string().optional(),
});

export const neucronExportTransactionHistorySchema = transactionsSchema.extend({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).default(100),
    format: z.enum(['csv', 'json']).optional().describe('Export format (default csv).'),
    fetchAllPages: z.boolean().optional().describe('Fetch all pages before export (default true).'),
});

export const neucronGetNotificationLogsSchema = z.object({
    state: z.string().optional().describe('Notification state filter (e.g. READ, UNREAD).'),
    pageNumber: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).optional(),
    notificationIds: z.array(nonEmptyString).optional().describe('Notification IDs to mark as read.'),
});

// ---------------------------------------------------------------------------
// Develop
// ---------------------------------------------------------------------------

export const neucronCreateAppSchema = createAppSchema.extend({
    appData: appDataSchema,
    fetchSecret: z.boolean().optional().describe('Retrieve the app secret after creation (default true).'),
    uploadDocument: flowUploadSchema.optional().describe('Supporting document to upload after creation.'),
});

export const neucronPublishAppSchema = z.object({
    businessId: optionalBusinessId,
    appId: nonEmptyString,
    finalUpdate: appUpdateDataSchema.optional().describe('Final app metadata update before publishing.'),
    skipPublish: z.boolean().optional().describe('Update app metadata only, without republishing (default false).'),
    uploadIcon: flowUploadSchema.optional().describe('App icon image to upload before publishing.'),
});

export const neucronBrowseAppstoreSchema = z.object({
    businessId: optionalBusinessId,
    appId: z.string().optional(),
    pageNumber: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).optional(),
});

// ---------------------------------------------------------------------------
// Get paid
// ---------------------------------------------------------------------------

export const neucronCreateCollectionLinkSchema = z.object({
    businessId: optionalBusinessId,
    walletID: z.string().optional().describe('Wallet ID (defaults to the first wallet).'),
    customization: walletCustomizationSchema.shape.payload.optional(),
    updateCustomization: z.boolean().optional().describe('Update existing customization instead of creating.'),
    collection: submitCollectionSchema.shape.data
        .optional()
        .describe('Invoice-linked collection (POST /invoice/collection).'),
    publicCollection: createPublicPaymentCollectionSchema.shape.data
        .optional()
        .describe('Universal wallet payment collection (POST /payment-collection).'),
});

const customerActionOptions = {
    create: createCustomerSchema,
    update: updateCustomerSchema,
    delete: deleteCustomerSchema,
    invite: inviteCustomerSchema,
    list: listCustomersSchema,
    get: getCustomerSchema,
} as const;

export const customerActionSchema = z.enum(['create', 'update', 'delete', 'invite', 'list', 'get']);

export const neucronCustomerManageSchema = z
    .object({
        action: customerActionSchema,
        invite: z.boolean().optional().describe('Send invite email after create (create action only).'),
        options: z.union([
            createCustomerSchema.describe('action=create'),
            updateCustomerSchema.describe('action=update'),
            deleteCustomerSchema.describe('action=delete'),
            inviteCustomerSchema.describe('action=invite'),
            listCustomersSchema.describe('action=list'),
            getCustomerSchema.describe('action=get'),
        ]),
    })
    .refine((value) => customerActionOptions[value.action].safeParse(value.options).success, {
        message: 'options must match the schema for the given action',
        path: ['options'],
    });

export const neucronCreateInvoiceSchema = z.object({
    businessId: optionalBusinessId,
    customerList: customerListFilterSchema
        .optional()
        .describe('Fetch the customer list first (for customer selection).'),
    invoiceData: createInvoicePayloadSchema,
    invoiceID: z.string().optional().describe('Existing invoice ID (update flow).'),
    updateData: createInvoicePayloadSchema.partial().optional().describe('Fields to update on an existing invoice.'),
    attachment: flowUploadSchema.optional().describe('Document to attach to the invoice.'),
    share: shareInvoiceSchema.optional().describe('Share the invoice by email after creation/update.'),
    finalise: z.boolean().optional().describe('Finalise the invoice after creation/update.'),
});

export const neucronManageInvoicePaymentCollectionSchema = z.object({
    businessId: optionalBusinessId,
    invoiceID: nonEmptyString,
    walletID: z.string().optional(),
    supportedAssets: z.array(z.string()).optional().describe('Asset IDs accepted for this invoice.'),
    collectionID: z.string().optional(),
    mapToInvoice: z.boolean().optional().describe('Map the collection to the invoice.'),
    checkPayment: checkPaymentSchema
        .pick({ collectionID: true, txHash: true })
        .optional()
        .describe('Check a payment against the collection.'),
});

export const neucronGetRevenueSchema = revenueGraphFiltersSchema;

// ---------------------------------------------------------------------------
// Pay flows
// ---------------------------------------------------------------------------

export const billModeSchema = z.enum(['create', 'update', 'review']);

export const neucronManageBillSchema = z.object({
    businessId: nonEmptyString,
    mode: billModeSchema,
    vendorList: vendorListFilterSchema.optional().describe('Fetch the vendor list first (for vendor selection).'),
    billID: z.string().optional(),
    createPayload: vendorBillPayloadSchema.optional(),
    updatePayload: vendorBillPayloadSchema.optional(),
    review: reviewBillSchema.optional(),
    attachment: flowUploadSchema.optional().describe('Bill document to upload.'),
});

export const neucronPayBillSchema = z.object({
    businessId: nonEmptyString,
    billID: nonEmptyString,
    payoutPayload: payoutUpsertPayloadSchema,
    confirmPayout: confirmPayoutSchema.shape.payload.optional(),
});

export const neucronSchedulePaymentSchema = z.object({
    businessId: nonEmptyString,
    vendorList: vendorListFilterSchema.optional(),
    billList: billListFilterSchema.optional(),
    billID: nonEmptyString,
    payoutPayload: payoutUpsertPayloadSchema,
});

const payoutModeOptions = {
    transfer: payRequestSchema,
    payout: createPayoutSchema,
    pay_vendor: payVendorSchema,
} as const;

export const payoutModeSchema = z.enum(['transfer', 'payout', 'pay_vendor']);

export const neucronCreatePayoutSchema = z
    .object({
        mode: payoutModeSchema,
        trigger: z.boolean().optional().describe('Trigger the payout after creation (payout mode only).'),
        options: z.union([
            payRequestSchema.describe('mode=transfer: direct wallet transfer (paymail, email, or address).'),
            createPayoutSchema.describe('mode=payout: create (and optionally trigger) a payout.'),
            payVendorSchema.describe('mode=pay_vendor: direct vendor payment.'),
        ]),
        updateBeforeTrigger: updatePayoutSchema
            .optional()
            .describe('Update the payout before triggering (payout mode only).'),
    })
    .refine((value) => payoutModeOptions[value.mode].safeParse(value.options).success, {
        message: 'options must match the schema for the given mode',
        path: ['options'],
    });

export const neucronGetPayoutHistorySchema = listPayoutsSchema.extend({
    payoutID: z.string().optional().describe('Fetch a single payout by ID.'),
});

export const neucronGetExpensesSchema = expenseGraphFiltersSchema;

const vendorActionOptions = {
    create: createVendorSchema,
    update: updateVendorSchema,
    list: listVendorsSchema,
    get: vendorIdSchema,
    delete: vendorIdSchema,
    invite: vendorIdSchema,
    suspend: setVendorSuspensionSchema,
    accept: acceptVendorSchema,
} as const;

export const vendorActionSchema = z.enum(['create', 'update', 'list', 'get', 'delete', 'invite', 'suspend', 'accept']);

export const neucronVendorManageSchema = z
    .object({
        action: vendorActionSchema,
        options: z.union([
            createVendorSchema.describe('action=create'),
            updateVendorSchema.describe('action=update'),
            listVendorsSchema.describe('action=list'),
            vendorIdSchema.describe('action=get/delete/invite'),
            setVendorSuspensionSchema.describe('action=suspend'),
            acceptVendorSchema.describe('action=accept'),
        ]),
    })
    .refine((value) => vendorActionOptions[value.action].safeParse(value.options).success, {
        message: 'options must match the schema for the given action',
        path: ['options'],
    });

// ---------------------------------------------------------------------------
// Data integrity
// ---------------------------------------------------------------------------

export const neucronInscribeDocumentSchema = fileUploadSchema.extend({
    file: jsonFileSchema.describe(
        'File to inscribe: { fileBase64, fileName?, mimeType? } or a React Native { uri, name, type } object.'
    ),
});

export const neucronInscribeTextSchema = textUploadSchema;

export const neucronInscribeTextArraySchema = textArrayUploadSchema;

// ---------------------------------------------------------------------------
// Asset issuance (Asset21)
// ---------------------------------------------------------------------------

export const securityTokenOperationSchema = z.enum([
    'MINT',
    'BURN',
    'BLACKLIST',
    'UNBLACKLIST',
    'FREEZE',
    'UNFREEZE',
    'PAUSE',
    'RESUME',
]);

export const neucronCreateSecurityTokenSchema = z.object({
    businessId: optionalBusinessId,
    walletID: z.string().optional().describe('Issuing wallet (defaults to the first business wallet).'),
    assetID: z.string().optional().describe('Deploy an already-registered asset (skips register).'),
    deploy: z.boolean().optional().describe('Deploy on-chain after register (default true).'),
    register: registerBodySchema
        .extend({ wallet_id: z.string().optional() })
        .optional()
        .describe('Token registration payload (required unless assetID is provided).'),
});

export const neucronCreateAsset21CustomerSchema = z.object({
    businessId: optionalBusinessId,
    assetId: nonEmptyString,
    requestDetails: requestDetailsSchema,
    autoApprove: z.boolean().optional().describe('Approve the request after creation (default true).'),
    requestId: z.string().optional().describe('Approve an existing request instead of creating one.'),
    approvalsRequired: z.number().optional(),
    rejectionsRequired: z.number().optional(),
    loadCustomers: z.boolean().optional().describe('Return the refreshed customer list after onboarding.'),
});

export const neucronSecurityTokenOperationsSchema = z.object({
    businessId: optionalBusinessId,
    assetId: nonEmptyString,
    action: securityTokenOperationSchema,
    requestDetails: requestDetailsSchema,
    autoApprove: z.boolean().optional().describe('Approve the request after creation (default true).'),
    requestId: z.string().optional().describe('Approve an existing request instead of creating one.'),
    approvalsRequired: z.number().optional(),
    rejectionsRequired: z.number().optional(),
    syncTransaction: z.object({ txid: nonEmptyString }).optional(),
    getAddressState: z.object({ address: nonEmptyString }).optional(),
});
