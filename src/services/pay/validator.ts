import { payResponseSchema, payWithAddressSchema, payWithEmailSchema, payWithPaymailSchema } from './schema.js';
import type { PayResponse, PayWithAddressBody, PayWithEmailBody, PayWithPaymailBody } from './types.js';

export default class Validator {
    /**
     * Validate payload for transfer via Address
     */
    payWithAddress(option: PayWithAddressBody) {
        return payWithAddressSchema.parse(option);
    }

    /**
     * Validate payload for transfer via Email
     */
    payWithEmail(option: PayWithEmailBody) {
        return payWithEmailSchema.parse(option);
    }

    /**
     * Validate payload for transfer via Paymail
     */
    payWithPaymail(option: PayWithPaymailBody) {
        return payWithPaymailSchema.parse(option);
    }

    /**
     * Validate transfer response
     */
    payResponse(option: PayResponse) {
        return payResponseSchema.parse(option);
    }
}
