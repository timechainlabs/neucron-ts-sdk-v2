import type { z } from 'zod';
import {
    vendorUpsertPayloadSchema,
    listVendorsSchema,
    vendorIdSchema,
    createVendorSchema,
    updateVendorSchema,
    setVendorSuspensionSchema,
    acceptVendorSchema,
    expenseGraphFiltersSchema,
    payVendorSchema,
    vendorsListResponseSchema,
    vendorResponseSchema,
    messageSchema,
    vendorLedgerResponseSchema,
    vendorExpenseGraphResponseSchema,
    vendorExpenseSummaryResponseSchema,
} from './schema.js';

export type VendorUpsertPayload = z.infer<typeof vendorUpsertPayloadSchema>;
export type ListVendors = z.infer<typeof listVendorsSchema>;
export type VendorId = z.infer<typeof vendorIdSchema>;
export type CreateVendor = z.infer<typeof createVendorSchema>;
export type UpdateVendor = z.infer<typeof updateVendorSchema>;
export type SetVendorSuspension = z.infer<typeof setVendorSuspensionSchema>;
export type AcceptVendor = z.infer<typeof acceptVendorSchema>;
export type ExpenseGraphFilters = z.infer<typeof expenseGraphFiltersSchema>;
export type PayVendor = z.infer<typeof payVendorSchema>;
export type VendorsListResponse = z.infer<typeof vendorsListResponseSchema>;
export type VendorResponse = z.infer<typeof vendorResponseSchema>;
export type VendorMessageResponse = z.infer<typeof messageSchema>;
export type VendorLedgerResponse = z.infer<typeof vendorLedgerResponseSchema>;
export type VendorExpenseGraphResponse = z.infer<typeof vendorExpenseGraphResponseSchema>;
export type VendorExpenseSummaryResponse = z.infer<typeof vendorExpenseSummaryResponseSchema>;
