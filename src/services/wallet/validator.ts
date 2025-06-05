import { createPaymailSchema, createWalletSchema, paymailListSchema } from './schema';
import { CreatePaymailBody, CreateWalletBody, PayamailListBody } from './types';

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
