import {
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
} from './schema.js';
import type {
    BillId,
    CreateBill,
    UpdateBill,
    ListBills,
    ReviewBill,
    PayBill,
    MapBillToPayout,
    AcceptVendorInvitation,
    CreateBillResponse,
    UpdateBillResponse,
    PayBillResponse,
} from './types.js';

export default class Validator {
    billId(options: BillId): void {
        billIdSchema.parse(options);
    }

    createBill(options: CreateBill): void {
        createBillSchema.parse(options);
    }

    updateBill(options: UpdateBill): void {
        updateBillSchema.parse(options);
    }

    listBills(options: ListBills): void {
        listBillsSchema.parse(options);
    }

    reviewBill(options: ReviewBill): void {
        reviewBillSchema.parse(options);
    }

    payBill(options: PayBill): void {
        payBillSchema.parse(options);
    }

    mapBillToPayout(options: MapBillToPayout): void {
        mapBillToPayoutSchema.parse(options);
    }

    acceptVendorInvitation(options: AcceptVendorInvitation): void {
        acceptVendorInvitationSchema.parse(options);
    }

    createBillResponse(response: CreateBillResponse): void {
        createBillResponseSchema.parse(response);
    }

    updateBillResponse(response: UpdateBillResponse): void {
        updateBillResponseSchema.parse(response);
    }

    payBillResponse(response: PayBillResponse): void {
        payBillResponseSchema.parse(response);
    }
}
