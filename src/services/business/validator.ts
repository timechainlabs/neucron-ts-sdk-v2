import {
    getBusinessDetailsSchema,
    businessDetailsResponseSchema,
    businessListResponseSchema,
    updateBusinessDetailsSchema,
    updateBusinessDetailsResponseSchema,
} from './schema.js';
import type {
    GetBusinessDetails,
    BusinessDetailsResponse,
    BusinessListResponse,
    UpdateBusinessDetails,
    UpdateBusinessDetailsResponse,
} from './types.js';

export default class Validator {
    getBusinessDetails(options: GetBusinessDetails): void {
        getBusinessDetailsSchema.parse(options);
    }

    businessDetailsResponse(response: BusinessDetailsResponse): void {
        businessDetailsResponseSchema.parse(response);
    }

    businessListResponse(response: BusinessListResponse): void {
        businessListResponseSchema.parse(response);
    }

    updateBusinessDetails(options: UpdateBusinessDetails): void {
        updateBusinessDetailsSchema.parse(options);
    }

    updateBusinessDetailsResponse(response: UpdateBusinessDetailsResponse): void {
        updateBusinessDetailsResponseSchema.parse(response);
    }
}
