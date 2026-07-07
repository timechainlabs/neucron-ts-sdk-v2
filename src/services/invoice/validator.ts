import {
    createInvoiceSchema,
    listInvoicesSchema,
    invoiceIdSchema,
    updateInvoiceSchema,
    markInvoiceAsPaidSchema,
    shareInvoiceSchema,
    emailPayloadSchema,
    mapCollectionSchema,
    submitCollectionSchema,
    createPublicPaymentCollectionSchema,
    paymentCollectionSchema,
    paymentSessionSchema,
    sessionIdSchema,
    checkPaymentSchema,
    checkSessionSchema,
    paymentCollectionListSchema,
    collectionIdSchema,
    walletPaymentCollectionInfoSchema,
    walletCustomizationSchema,
    revenueGraphFiltersSchema,
    invoicesListResponseSchema,
    messageSchema,
} from './schema.js';
import type {
    CreateInvoice,
    ListInvoices,
    InvoiceId,
    UpdateInvoice,
    MarkInvoiceAsPaid,
    ShareInvoice,
    EmailPayload,
    MapCollection,
    SubmitCollection,
    CreatePublicPaymentCollection,
    PaymentCollection,
    PaymentSession,
    SessionId,
    CheckPayment,
    CheckSession,
    PaymentCollectionList,
    CollectionId,
    WalletPaymentCollectionInfo,
    WalletCustomization,
    RevenueGraphFilters,
    InvoicesListResponse,
    InvoiceMessageResponse,
} from './types.js';

export default class Validator {
    createInvoice(options: CreateInvoice): void {
        createInvoiceSchema.parse(options);
    }

    listInvoices(options?: ListInvoices): void {
        if (options) listInvoicesSchema.parse(options);
    }

    invoiceId(options: InvoiceId): void {
        invoiceIdSchema.parse(options);
    }

    updateInvoice(options: UpdateInvoice): void {
        updateInvoiceSchema.parse(options);
    }

    markInvoiceAsPaid(options: MarkInvoiceAsPaid): void {
        markInvoiceAsPaidSchema.parse(options);
    }

    shareInvoice(options: ShareInvoice): void {
        shareInvoiceSchema.parse(options);
    }

    emailPayload(options: EmailPayload): void {
        emailPayloadSchema.parse(options);
    }

    mapCollection(options: MapCollection): void {
        mapCollectionSchema.parse(options);
    }

    submitCollection(options: SubmitCollection): void {
        submitCollectionSchema.parse(options);
    }

    createPublicPaymentCollection(options: CreatePublicPaymentCollection): void {
        createPublicPaymentCollectionSchema.parse(options);
    }

    paymentCollection(options: PaymentCollection): void {
        paymentCollectionSchema.parse(options);
    }

    paymentSession(options: PaymentSession): void {
        paymentSessionSchema.parse(options);
    }

    sessionId(options: SessionId): void {
        sessionIdSchema.parse(options);
    }

    checkPayment(options: CheckPayment): void {
        checkPaymentSchema.parse(options);
    }

    checkSession(options: CheckSession): void {
        checkSessionSchema.parse(options);
    }

    paymentCollectionList(options?: PaymentCollectionList): void {
        if (options) paymentCollectionListSchema.parse(options);
    }

    collectionId(options: CollectionId): void {
        collectionIdSchema.parse(options);
    }

    walletPaymentCollectionInfo(options?: WalletPaymentCollectionInfo): void {
        if (options) walletPaymentCollectionInfoSchema.parse(options);
    }

    walletCustomization(options: WalletCustomization): void {
        walletCustomizationSchema.parse(options);
    }

    revenueGraphFilters(options?: RevenueGraphFilters): void {
        if (options) revenueGraphFiltersSchema.parse(options);
    }

    invoicesListResponse(response: InvoicesListResponse): void {
        invoicesListResponseSchema.parse(response);
    }

    messageResponse(response: InvoiceMessageResponse): void {
        messageSchema.parse(response);
    }
}
