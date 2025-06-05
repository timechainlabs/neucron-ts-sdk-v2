import { createPaymailSchema, createWalletSchema, paymailListSchema } from './schema.js';
import type { CreatePaymailBody, CreateWalletBody, PayamailListBody } from './types.js';

export default class Validator {
    createWallet(options: CreateWalletBody) {
        return createWalletSchema.parse(options);
    }

    createPaymail(options: CreatePaymailBody) {
        return createPaymailSchema.parse(options);
    }

    paymailList(options: PayamailListBody) {
        return paymailListSchema.parse(options);
    }
}
