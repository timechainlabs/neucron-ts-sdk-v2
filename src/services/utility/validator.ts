import {
    createUtilitySchema,
    mintUtilitySchema,
    redeemUtilitySchema,
    updateUtilitySchema,
    updateUtilityResponseSchema,
    createUtilityResponseSchema,
    redeemUtilityResponseSchema,
    mintUtilityResponseSchema,
} from './schema.js';
import type {
    CreateUtility,
    CreateUtilityResponse,
    MintUtility,
    RedeemUtility,
    UpdateUtility,
    UpdateUtilityResponse,
    RedeemUtilityResponse,
    MintUtilityResponse,
} from './types.js';

export default class Validator {
    createUtility(utility: CreateUtility) {
        return createUtilitySchema.parse(utility);
    }
    createUtilityResponse(utility: CreateUtilityResponse) {
        return createUtilityResponseSchema.parse(utility);
    }
    updateUtility(utility: UpdateUtility) {
        return updateUtilitySchema.parse(utility);
    }
    updateUtilityResponse(utility: UpdateUtilityResponse) {
        return updateUtilityResponseSchema.parse(utility);
    }
    mintUtility(options: MintUtility) {
        return mintUtilitySchema.parse(options);
    }
    mintUtilityResponse(utility: MintUtilityResponse) {
        return mintUtilityResponseSchema.parse(utility);
    }
    redeemUtility(utility: RedeemUtility) {
        return redeemUtilitySchema.parse(utility);
    }
    redeemUtilityResponse(utility: RedeemUtilityResponse) {
        return redeemUtilityResponseSchema.parse(utility);
    }
}
