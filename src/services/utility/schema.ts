import { z } from 'zod';

const AssetTypeEnum = z.enum(['STAS', 'CERTIFICATE', 'UTILITY', 'SECURITY', 'STABLECOIN', 'MNEE', 'TICKET']);

const ProtocolEnum = z.enum(['STAS-20', 'STAS-789', 'STAS-50', 'STAS-LEGACY', 'NULL']);

const messageResponseSchema = z.object({
    message: z.string().min(1),
});
const tokenDetailsSchema = z.object({
    name: z.string().min(1),
    protocolId: z.string().min(1),
    symbol: z.string().min(1),
    description: z.string().optional(),
    image: z.string().optional(),
    totalSupply: z.number().int().positive(),
    decimals: z.number().int().nonnegative().optional(),
    satsPerToken: z.number().int().positive(),

    properties: z.object({
        issuer: z.object({
            email: z.string().optional(),
            governingLaw: z.string().optional(),
            issuerCountry: z.string().optional(),
            jurisdiction: z.string().optional(),
            legalForm: z.string().optional(),
            organisation: z.string().optional(),
        }),
        legal: z.object({
            licenceId: z.string().optional(),
            terms: z.string().optional(),
        }),
        meta: z.object({
            schemaId: z.string().optional(),
            website: z.string().optional(),
            legal: z.object({
                terms: z.string().optional(),
            }),
            media: z
                .array(
                    z.object({
                        URI: z.string().optional(),
                        altURI: z.string().optional(),
                        type: z.string().optional(),
                    })
                )
                .optional(),
        }),
    }),
});

export const createUtilitySchema = z.object({
    asset_name: z.string(),
    asset_type: AssetTypeEnum,
    expires_at: z.string().datetime().optional(),
    image_url: z.string().optional(),
    legal_term: z.string(),
    protocol: ProtocolEnum,
    symbol: z.string(),
    tokenDetail: tokenDetailsSchema,
    total_supply: z.number().int(),
    wallet_id: z.string().optional(),
});

export const createUtilityResponseSchema = z.object({
    assetID: z.string().min(1),
});

export const updateUtilitySchema = z.object({
    asset_id: z.string(),
    asset_name: z.string().optional(),
    image_url: z.string().optional().optional(),
    legal_term: z.string().optional(),
    protocol: ProtocolEnum.optional(),
    symbol: z.string().optional(),
    tokenDetail: tokenDetailsSchema.optional(),
    total_supply: z.number().int().optional(),
    wallet_id: z.string().optional(),
});

export const updateUtilityResponseSchema = messageResponseSchema;

export const mintUtilitySchema = z.object({
    assetID: z.string(),
});

export const mintUtilityResponseSchema = z.any();

export const redeemUtilitySchema = z.object({
    utxoID: z.string(),
});

export const redeemUtilityResponseSchema = z.any();
