import { payResponseSchema, payWithAddressSchema, payWithEmailSchema, payWithPaymailSchema } from './schema.js';
import type { PayResponse, PayWithAddressBody, PayWithEmailBody, PayWithPaymailBody } from './types.js';

export default class Validator {
    payWithAddress(option: PayWithAddressBody) {
        return payWithAddressSchema.parse(option);
    }
    payWithEmail(option: PayWithEmailBody) {
        return payWithEmailSchema.parse(option);
    }
    payWithPaymail(option: PayWithPaymailBody) {
        return payWithPaymailSchema.parse(option);
    }
    payResponse(option: PayResponse) {
        return payResponseSchema.parse(option);
    }
}
