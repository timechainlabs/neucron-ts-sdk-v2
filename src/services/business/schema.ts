import { z } from 'zod';
import { businessIdSchema, nonEmptyString } from '../../utils/schema/common.js';

const addressSchema = z.object({
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    pin_code: z.string().optional(),
    state: z.string().optional(),
});

export const getBusinessDetailsSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
});

export const businessDetailsResponseSchema = z.object({
    pan_number: z.string(),
    business_name: z.string(),
    business_type: z.enum(['private', 'public']),
    business_model: z.enum(['b2b', 'b2c', 'both']),
    business_category: z.string(),
    business_sub_category: z.string(),
    business_id: z.string(),
    business_description: z.string(),
    business_purpose: z.string(),
    cin_number: z.string(),
    gst_number: z.string().optional(),
    phoneNumber: z.string().optional(),
    countryCode: z.string().optional(),
    noGstin: z.boolean(),
    business_address: addressSchema,
    gst_address: addressSchema.optional(),
    sameAsGst: z.boolean(),
    business_url: z.string().optional(),
    app_link: z.string().optional(),
    kyb_status: z.string().optional(),
    platform_requests: z.array(z.object({ platform: z.string(), status: z.string() })).optional(),
    platform: z.array(z.string()).optional(),
    business_logo: z.string().optional(),
    is_owner: z.boolean().optional(),
});

export const businessListResponseSchema = z.array(z.record(z.unknown()));

export const updateBusinessDetailsSchema = businessIdSchema.extend({
    businessId: nonEmptyString,
    data: z.record(z.unknown()),
});

export const updateBusinessDetailsResponseSchema = z.record(z.unknown());
