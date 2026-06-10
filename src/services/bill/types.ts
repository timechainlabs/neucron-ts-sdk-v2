import type { z } from 'zod';
import {
    vendorBillPayloadSchema,
    billIdSchema,
    createBillSchema,
    updateBillSchema,
    listBillsSchema,
    reviewBillSchema,
    payBillSchema,
    mapBillToPayoutSchema,
    acceptVendorInvitationSchema,
    createBillResponseSchema,
    updateBillResponseSchema,
    payBillResponseSchema,
    billResponseSchema,
    billsListResponseSchema,
} from './schema.js';

export type VendorBillPayload = z.infer<typeof vendorBillPayloadSchema>;
export type BillId = z.infer<typeof billIdSchema>;
export type CreateBill = z.infer<typeof createBillSchema>;
export type UpdateBill = z.infer<typeof updateBillSchema>;
export type ListBills = z.infer<typeof listBillsSchema>;
export type ReviewBill = z.infer<typeof reviewBillSchema>;
export type PayBill = z.infer<typeof payBillSchema>;
export type MapBillToPayout = z.infer<typeof mapBillToPayoutSchema>;
export type AcceptVendorInvitation = z.infer<typeof acceptVendorInvitationSchema>;
export type CreateBillResponse = z.infer<typeof createBillResponseSchema>;
export type UpdateBillResponse = z.infer<typeof updateBillResponseSchema>;
export type PayBillResponse = z.infer<typeof payBillResponseSchema>;
export type BillResponse = z.infer<typeof billResponseSchema>;
export type BillsListResponse = z.infer<typeof billsListResponseSchema>;
