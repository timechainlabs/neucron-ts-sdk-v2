import type { Authentication } from '../authentication/index.js';
import type { OAuth } from '../oauth/index.js';
import type { Wallet } from '../wallet/index.js';
import type { Business } from '../business/index.js';
import type { Assets } from '../assets/index.js';
import type { Apps } from '../apps/index.js';
import type { Blob } from '../blob/index.js';
import type { Invoice } from '../invoice/index.js';
import type { Customer } from '../customer/index.js';
import type { Vendor } from '../vendor/index.js';
import type { Bill } from '../bill/index.js';
import type { Payout } from '../payout/index.js';
import type { Pay } from '../pay/index.js';
import type { DataIntegrity } from '../data-integrity/index.js';
import type { Assets21 } from '../asset21/index.js';
import type { LoginBody } from '../authentication/types.js';
import type { CreateWalletBody } from '../wallet/types.js';
import type { UpdateBusinessDetails, CreateBusinessBody } from '../business/types.js';
import type { CreateApp } from '../apps/types.js';
import type { CreateCustomer, UpdateCustomer, ListCustomers, GetCustomer, DeleteCustomer } from '../customer/types.js';
import type { CreateInvoice, UpdateInvoice, ShareInvoice, PaymentCollection } from '../invoice/types.js';
import type {
    CreateVendor,
    UpdateVendor,
    ListVendors,
    VendorId,
    SetVendorSuspension,
    AcceptVendor,
    PayVendor,
} from '../vendor/types.js';
import type { CreateBill, UpdateBill, ListBills, ReviewBill } from '../bill/types.js';
import type { CreatePayout, ListPayouts, ConfirmPayout, PayoutId } from '../payout/types.js';
import type { PayRequestInput } from '../pay/types.js';
import type { FileUpload, TextUpload, TextArrayUpload } from '../data-integrity/types.js';
import type { Register, CreateRequest, UpdateRequest, GetRequest, RequestDetails } from '../asset21/types.js';
import type { UploadDocument, UploadImage } from '../blob/types.js';
import type { FlowFile } from './file.js';
import type {
    WalletCustomization,
    SubmitCollection,
    RevenueGraphFilters,
    CreatePublicPaymentCollection,
} from '../invoice/types.js';
import type { ExpenseGraphFilters } from '../vendor/types.js';
import type { Transactions } from '../wallet/types.js';
import type { Balances, LedgerList } from '../assets/types.js';

/** SDK services injected into MCP flow orchestrators. */
export interface McpFlowServices {
    auth: Authentication;
    oauth: OAuth;
    wallet: Wallet;
    business: Business;
    assets: Assets;
    apps: Apps;
    blob: Blob;
    invoice: Invoice;
    customer: Customer;
    vendor: Vendor;
    bill: Bill;
    payout: Payout;
    pay: Pay;
    dataIntegrity: DataIntegrity;
    asset21: Assets21;
}

/** Upload options where the file may be a native file object or base64 content (MCP/JSON clients). */
export type FlowUploadDocument = Omit<UploadDocument, 'file'> & { file: FlowFile };
export type FlowUploadImage = Omit<UploadImage, 'file'> & { file: FlowFile };

export type EntityType = 'personal' | 'business';

export interface EntitySummary {
    type: EntityType;
    label: string;
    business_id?: string;
}

export interface ActiveEntity {
    type: EntityType;
    business_id?: string;
}

// --- Auth Setup ---

export interface NeucronLoginOptions {
    method: 'email';
    credentials: LoginBody;
}

export interface NeucronChooseEntityOptions {
    businessId?: string;
    loadBusinessDetails?: boolean;
}

export interface NeucronChooseEntityResult {
    entities: EntitySummary[];
    active_entity: ActiveEntity;
    userInfo: unknown;
    businessList: unknown;
    businessDetails?: unknown;
}

export interface NeucronCreateBusinessOptions {
    payload: CreateBusinessBody;
    businessId?: string;
    submitKyb?: boolean;
    updateAfterCreate?: UpdateBusinessDetails['data'];
}

// --- Holdings ---

export interface NeucronListWalletsOptions {
    businessId?: string;
}

export interface NeucronCreateWalletOptions extends CreateWalletBody {
    refreshList?: boolean;
}

export interface NeucronGetBalancesOptions {
    businessId?: string;
    walletID?: string;
    ledger?: Omit<LedgerList, 'businessId' | 'walletID'>;
    balances?: Omit<Balances, 'businessId' | 'walletID'>;
}

export interface NeucronGetTransactionHistoryOptions extends Omit<Transactions, 'page' | 'limit'> {
    page?: number;
    limit?: number;
    includeDetails?: boolean;
    txid?: string;
}

export interface NeucronExportTransactionHistoryOptions extends Omit<Transactions, 'page' | 'limit'> {
    page?: number;
    limit?: number;
    format?: 'csv' | 'json';
    fetchAllPages?: boolean;
}

export interface NeucronGetNotificationLogsOptions {
    state?: string;
    pageNumber?: number;
    pageSize?: number;
    notificationIds?: string[];
}

// --- Develop ---

export interface NeucronCreateAppOptions extends CreateApp {
    fetchSecret?: boolean;
    uploadDocument?: FlowUploadDocument;
}

export interface NeucronPublishAppOptions {
    businessId?: string;
    appId: string;
    finalUpdate?: Record<string, unknown>;
    uploadIcon?: FlowUploadImage;
    skipPublish?: boolean;
}

export interface NeucronBrowseAppstoreOptions {
    businessId?: string;
    appId?: string;
    pageNumber?: number;
    pageSize?: number;
}

// --- Get Paid ---

export interface NeucronCreateCollectionLinkOptions {
    businessId?: string;
    walletID?: string;
    customization?: WalletCustomization['payload'];
    /** Invoice-linked collection (POST /invoice/collection). */
    collection?: SubmitCollection['data'];
    /** Universal wallet payment collection (POST /payment-collection). */
    publicCollection?: CreatePublicPaymentCollection['data'];
    updateCustomization?: boolean;
}

export type NeucronCustomerManageAction =
    | { action: 'create'; options: CreateCustomer; invite?: boolean }
    | { action: 'update'; options: UpdateCustomer }
    | { action: 'delete'; options: DeleteCustomer }
    | { action: 'invite'; options: GetCustomer }
    | { action: 'list'; options: ListCustomers }
    | { action: 'get'; options: GetCustomer };

/** @deprecated Use {@link NeucronCustomerManageAction} */
export type NeucronManageCustomerAction = NeucronCustomerManageAction;

export interface NeucronCreateInvoiceOptions {
    businessId?: string;
    customerList?: Omit<ListCustomers, 'businessId'> & { businessId?: string };
    invoiceData: CreateInvoice['invoiceData'];
    invoiceID?: string;
    updateData?: UpdateInvoice['invoiceData'];
    attachment?: FlowUploadDocument;
    share?: ShareInvoice;
    finalise?: boolean;
}

export interface NeucronManageInvoicePaymentCollectionOptions {
    businessId?: string;
    invoiceID: string;
    walletID?: string;
    supportedAssets?: PaymentCollection['supportedAssets'];
    collectionID?: string;
    mapToInvoice?: boolean;
    checkPayment?: { collectionID: string; txHash?: string };
}

export type NeucronGetRevenueOptions = RevenueGraphFilters;

// --- Pay ---

export type NeucronVendorManageAction =
    | { action: 'create'; options: CreateVendor }
    | { action: 'update'; options: UpdateVendor }
    | { action: 'list'; options: ListVendors }
    | { action: 'get'; options: VendorId }
    | { action: 'delete'; options: VendorId }
    | { action: 'invite'; options: VendorId }
    | { action: 'suspend'; options: SetVendorSuspension }
    | { action: 'accept'; options: AcceptVendor };

/** @deprecated Use {@link NeucronVendorManageAction} */
export type NeucronManageVendorAction = NeucronVendorManageAction;

export interface NeucronPayBillOptions {
    businessId: string;
    billID: string;
    payoutPayload: CreatePayout['payload'];
    confirmPayout?: ConfirmPayout['payload'];
}

export interface NeucronSchedulePaymentOptions {
    businessId: string;
    vendorList?: Omit<ListVendors, 'businessId'> & { businessId?: string };
    billList?: Omit<ListBills, 'businessId'> & { businessId?: string };
    billID: string;
    payoutPayload: CreatePayout['payload'];
}

export interface NeucronManageBillOptions {
    businessId: string;
    mode: 'create' | 'update' | 'review';
    vendorList?: Omit<ListVendors, 'businessId'> & { businessId?: string };
    billID?: string;
    createPayload?: CreateBill['payload'];
    updatePayload?: UpdateBill['payload'];
    review?: ReviewBill;
    attachment?: FlowUploadDocument;
}

export type NeucronCreatePayoutOptions =
    | { mode: 'transfer'; options: PayRequestInput }
    | {
          mode: 'payout';
          options: CreatePayout;
          trigger?: boolean;
          updateBeforeTrigger?: PayoutId & { payload: CreatePayout['payload'] };
      }
    | { mode: 'pay_vendor'; options: PayVendor };

export interface NeucronGetPayoutHistoryOptions extends ListPayouts {
    payoutID?: string;
}

export type NeucronGetExpensesOptions = ExpenseGraphFilters;

// --- Data Integrity ---

export type NeucronInscribeDocumentOptions = Omit<FileUpload, 'file'> & { file: FlowFile };

export type NeucronInscribeTextOptions = TextUpload;

export type NeucronInscribeTextArrayOptions = TextArrayUpload;

// --- Asset Issuance (Asset21) ---

export type Asset21OperationAction =
    'MINT' | 'BURN' | 'BLACKLIST' | 'UNBLACKLIST' | 'FREEZE' | 'UNFREEZE' | 'PAUSE' | 'RESUME';

export interface NeucronCreateSecurityTokenOptions {
    businessId?: string;

    walletID?: string;
    /** Skip register and deploy an already-registered asset. */
    assetID?: string;
    /** Deploy on-chain after register (default true). */
    deploy?: boolean;
    register?: Omit<Register, 'businessId' | 'wallet_id'> & { wallet_id?: string };
}

export interface NeucronCreateAsset21CustomerOptions {
    businessId?: string;

    assetId: string;
    requestDetails: RequestDetails;
    /** Auto-approve the CUSTOMER request (default true). */
    autoApprove?: boolean;
    /** Approve an existing request instead of creating one. */
    requestId?: string;
    approvalsRequired?: number;
    rejectionsRequired?: number;
    /** Refresh customer list after onboarding. */
    loadCustomers?: boolean;
}

export interface NeucronSecurityTokenOperationsOptions {
    businessId?: string;

    assetId: string;
    action: Asset21OperationAction;
    requestDetails: RequestDetails;
    /** Auto-approve after creating the request (default true). */
    autoApprove?: boolean;
    /** Approve an existing request instead of creating one. */
    requestId?: string;
    approvalsRequired?: number;
    rejectionsRequired?: number;
    /** Optional post-approval blockchain sync. */
    syncTransaction?: { txid: string };
    /** Optional address state check after operation. */
    getAddressState?: { address: string };
}

export interface NeucronIssueSecurityTokenOptions {
    businessId?: string;

    walletID?: string;
    register: Omit<Register, 'businessId'>;
    governanceRequest?: Omit<CreateRequest, 'businessId'>;
    handleRequest?: Omit<UpdateRequest, 'businessId'>;
    loadRequest?: Omit<GetRequest, 'businessId'>;
    mintAssetID?: string;
}
