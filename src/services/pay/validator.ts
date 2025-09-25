import { payResponseSchema, payRequestSchema } from './schema.js';
import type { PayRequest, PayResponse } from './types.js';

export default class Validator {
    /**
     * Validate payload for transfer via Address
     */
    payWithAddress(option: PayRequest) {
        return payRequestSchema.parse(option);
    }

    /**
     * Validate payload for transfer via Email
     */
    payWithEmail(option: PayRequest) {
        return payRequestSchema.parse(option);
    }

    /**
     * Validate payload for transfer via Paymail
     */
    payWithPaymail(option: PayRequest) {
        return payRequestSchema.parse(option);
    }

    /**
     * Validate transfer response
     */
    payResponse(option: PayResponse) {
        return payResponseSchema.parse(option);
    }
}
