// Namespaced re-export of every service's zod schemas.
// Consumers (e.g. the MCP server) use these as runtime-validated input
// shapes instead of re-declaring validation rules that already live here.
export * as authenticationSchemas from './services/authentication/schema.js';
export * as walletSchemas from './services/wallet/schema.js';
export * as assetsSchemas from './services/assets/schema.js';
export * as asset21Schemas from './services/asset21/schema.js';
export * as assetSwapSchemas from './services/asset-swap/schema.js';
export * as teamSchemas from './services/team/schema.js';
export * as utilitySchemas from './services/utility/schema.js';
export * as dataIntegritySchemas from './services/data-integrity/schema.js';
export * as paySchemas from './services/pay/schema.js';
export * as paymailSchemas from './services/paymail/schema.js';
export * as businessSchemas from './services/business/schema.js';
export * as membersSchemas from './services/members/schema.js';
export * as rbacSchemas from './services/rbac/schema.js';
export * as appsSchemas from './services/apps/schema.js';
export * as blobSchemas from './services/blob/schema.js';
export * as invoiceSchemas from './services/invoice/schema.js';
export * as customerSchemas from './services/customer/schema.js';
export * as vendorSchemas from './services/vendor/schema.js';
export * as billSchemas from './services/bill/schema.js';
export * as payoutSchemas from './services/payout/schema.js';
export * as billingSchemas from './services/billing/schema.js';
export * as commonSchemas from './utils/schema/common.js';
