import { z } from 'zod';
import { businessIdSchema, nonEmptyString } from '../../utils/schema/common.js';

const addressSchema = z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    pin_code: z.string().optional(),
    state: z.string().optional(),
});

export const createBusinessSchema = z
    .object({
        business_name: nonEmptyString,
        display_name: z.string().optional(),
        business_type: z.string().optional(),
        business_model: z.string().optional(),
        business_sub_model: z.string().optional(),
        business_category: z.string().optional(),
        business_sub_category: z.string().optional(),
        business_description: z.string().optional(),
        business_purpose: z.string().optional(),
        business_email: z.string().email().optional(),
        jurisdiction: z.string().optional(),
        gst_number: z.string().optional(),
        cin_number: z.string().optional(),
        pan_number: z.string().optional(),
        phoneNumber: z.string().optional(),
        countryCode: z.string().optional(),
        noGstin: z.boolean().optional(),
        business_address: addressSchema.optional(),
        gst_address: addressSchema.optional(),
        sameAsGst: z.boolean().optional(),
        business_url: z.string().optional(),
        app_link: z.string().optional(),
        business_logo: z.string().optional(),
    })
    .passthrough();

export const createBusinessResponseSchema = z
    .object({
        business_id: z.string().optional(),
        data: z
            .object({
                business_id: z.string().optional(),
            })
            .passthrough()
            .optional(),
        message: z.string().optional(),
    })
    .passthrough();

export const getBusinessDetailsSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
});

export const businessDetailsResponseSchema = z
    .object({
        pan_number: z.string().optional(),
        business_name: z.string().optional(),
        business_type: z.string().optional(),
        business_model: z.string().optional(),
        business_category: z.string().optional(),
        business_sub_category: z.string().optional(),
        business_id: z.string().optional(),
        business_description: z.string().optional(),
        business_purpose: z.string().optional(),
        cin_number: z.string().optional(),
        gst_number: z.string().optional(),
        phoneNumber: z.string().optional(),
        countryCode: z.string().optional(),
        noGstin: z.boolean().optional(),
        business_address: addressSchema.optional(),
        gst_address: addressSchema.optional(),
        sameAsGst: z.boolean().optional(),
        business_url: z.string().optional(),
        app_link: z.string().optional(),
        kyb_status: z.string().optional(),
        platform_requests: z.array(z.object({ platform: z.string(), status: z.string() })).optional(),
        platform: z.array(z.string()).optional(),
        business_logo: z.string().optional(),
        is_owner: z.boolean().optional(),
    })
    .passthrough();

export const businessListResponseSchema = z.array(z.record(z.string(), z.unknown()));

export const updateBusinessDetailsSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    data: z.record(z.string(), z.unknown()),
});

export const updateBusinessDetailsResponseSchema = z.record(z.string(), z.unknown());
