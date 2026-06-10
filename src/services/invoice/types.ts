import type { z } from 'zod';
import {
    createInvoicePayloadSchema,
    invoiceIdSchema,
    createInvoiceSchema,
    listInvoicesSchema,
    updateInvoiceSchema,
    emailPayloadSchema,
    markInvoiceAsPaidSchema,
    shareInvoiceSchema,
    mapCollectionSchema,
    submitCollectionSchema,
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
    invoiceResponseSchema,
    messageSchema,
    walletInfoPayloadSchema,
    paymentCollectionResponseSchema,
} from './schema.js';

export type CreateInvoicePayload = z.infer<typeof createInvoicePayloadSchema>;
export type InvoiceId = z.infer<typeof invoiceIdSchema>;
export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
export type ListInvoices = z.infer<typeof listInvoicesSchema>;
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>;
export type EmailPayload = z.infer<typeof emailPayloadSchema>;
export type MarkInvoiceAsPaid = z.infer<typeof markInvoiceAsPaidSchema>;
export type ShareInvoice = z.infer<typeof shareInvoiceSchema>;
export type MapCollection = z.infer<typeof mapCollectionSchema>;
export type SubmitCollection = z.infer<typeof submitCollectionSchema>;
export type PaymentCollection = z.infer<typeof paymentCollectionSchema>;
export type PaymentSession = z.infer<typeof paymentSessionSchema>;
export type SessionId = z.infer<typeof sessionIdSchema>;
export type CheckPayment = z.infer<typeof checkPaymentSchema>;
export type CheckSession = z.infer<typeof checkSessionSchema>;
export type PaymentCollectionList = z.infer<typeof paymentCollectionListSchema>;
export type CollectionId = z.infer<typeof collectionIdSchema>;
export type WalletPaymentCollectionInfo = z.infer<typeof walletPaymentCollectionInfoSchema>;
export type WalletCustomization = z.infer<typeof walletCustomizationSchema>;
export type RevenueGraphFilters = z.infer<typeof revenueGraphFiltersSchema>;
export type InvoicesListResponse = z.infer<typeof invoicesListResponseSchema>;
export type InvoiceResponse = z.infer<typeof invoiceResponseSchema>;
export type InvoiceMessageResponse = z.infer<typeof messageSchema>;
export type WalletInfoPayload = z.infer<typeof walletInfoPayloadSchema>;
export type PaymentCollectionResponse = z.infer<typeof paymentCollectionResponseSchema>;
