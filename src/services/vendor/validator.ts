import {
    listVendorsSchema,
    vendorIdSchema,
    createVendorSchema,
    updateVendorSchema,
    setVendorSuspensionSchema,
    acceptVendorSchema,
    expenseGraphFiltersSchema,
    payVendorSchema,
    messageSchema,
} from './schema.js';
import type {
    ListVendors,
    VendorId,
    CreateVendor,
    UpdateVendor,
    SetVendorSuspension,
    AcceptVendor,
    ExpenseGraphFilters,
    PayVendor,
    VendorMessageResponse,
} from './types.js';

export default class Validator {
    listVendors(options: ListVendors): void {
        listVendorsSchema.parse(options);
    }

    vendorId(options: VendorId): void {
        vendorIdSchema.parse(options);
    }

    createVendor(options: CreateVendor): void {
        createVendorSchema.parse(options);
    }

    updateVendor(options: UpdateVendor): void {
        updateVendorSchema.parse(options);
    }

    setVendorSuspension(options: SetVendorSuspension): void {
        setVendorSuspensionSchema.parse(options);
    }

    acceptVendor(options: AcceptVendor): void {
        acceptVendorSchema.parse(options);
    }

    expenseGraphFilters(options: ExpenseGraphFilters): void {
        expenseGraphFiltersSchema.parse(options);
    }

    payVendor(options: PayVendor): void {
        payVendorSchema.parse(options);
    }

    messageResponse(response: VendorMessageResponse): void {
        messageSchema.parse(response);
    }
}
