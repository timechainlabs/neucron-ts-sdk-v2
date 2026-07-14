import {
    createBusinessSchema,
    createBusinessResponseSchema,
    getBusinessDetailsSchema,
    businessDetailsResponseSchema,
    businessListResponseSchema,
    updateBusinessDetailsSchema,
    updateBusinessDetailsResponseSchema,
} from './schema.js';
import type {
    CreateBusinessBody,
    CreateBusinessResponse,
    GetBusinessDetails,
    BusinessDetailsResponse,
    BusinessListResponse,
    UpdateBusinessDetails,
    UpdateBusinessDetailsResponse,
} from './types.js';

export default class Validator {
    createBusiness(options: CreateBusinessBody): void {
        createBusinessSchema.parse(options);
    }

    createBusinessResponse(response: CreateBusinessResponse): void {
        createBusinessResponseSchema.parse(response);
    }

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
