import {
    createPaymailSchema,
    paymailListResponseSchema,
    updateDefaultPaymailSchema,
    updateDefaultPaymailResponseSchema,
    deletePaymailSchema,
    deletePaymailResponseSchema,
    createPaymailResponseSchema,
    paymailListSchema,
} from './schema.js';
import type {
    CreatePaymailBody,
    PaymailListResponse,
    UpdateDefaultPaymailBody,
    UpdateDefaultPaymailResponse,
    DeletePaymailBody,
    DeletePaymailResponse,
    CreatePaymailResponse,
    PaymailListBody,
} from './types.js';

export default class Validator {
    createPaymail(options: CreatePaymailBody) {
        return createPaymailSchema.parse(options);
    }

    createPaymailResponse(options: CreatePaymailResponse) {
        return createPaymailResponseSchema.parse(options);
    }

    paymailList(options: PaymailListBody) {
        return paymailListSchema.parse(options);
    }

    paymailListResponse(options: PaymailListResponse) {
        return paymailListResponseSchema.parse(options);
    }

    updateDefaultPaymail(options: UpdateDefaultPaymailBody) {
        return updateDefaultPaymailSchema.parse(options);
    }

    updateDefaultPaymailResponse(options: UpdateDefaultPaymailResponse) {
        return updateDefaultPaymailResponseSchema.parse(options);
    }

    deletePaymail(options: DeletePaymailBody) {
        return deletePaymailSchema.parse(options);
    }

    deletePaymailResponse(options: DeletePaymailResponse) {
        return deletePaymailResponseSchema.parse(options);
    }
}
