import { z } from 'zod';

const AssetTypeEnum = z.enum(['CERTIFICATE', 'UTILITY', 'SECURITY', 'STABLECOIN', 'MNEE', 'TICKET']);

const ProtocolEnum = z.enum(['STAS-20', 'STAS-789', 'STAS-50', 'STAS-LEGACY', 'NULL']);

const assetStatusEnum = z.enum(['DRAFTED', 'MINTED', 'EXPIRED', 'DEPLOYED']);

const assetScopeEnum = z.enum(['public', 'private']);

const messageResponseSchema = z.object({
    message: z.string().min(1),
});

const tokenDetailsSchema = z.object({
    name: z.string().min(1),
    protocolId: z.string().min(1),
    symbol: z.string().min(1), // REQUIRED
    description: z.string().optional(),
    image: z.string().url().optional(),
    totalSupply: z.number().int().positive(), // REQUIRED
    decimals: z.number().int().nonnegative().optional(),
    satsPerToken: z.number().int().positive(), // REQUIRED

    properties: z.object({
        legal: z.object({
            terms: z.string().min(1),
            licenceId: z.string().min(1),
        }),
        issuer: z.object({
            organisation: z.string().min(1),
            legalForm: z.string().min(1),
            governingLaw: z.string().min(1),
            issuerCountry: z.string().min(1),
            jurisdiction: z.string().min(1),
            email: z.string().email(),
        }),
        meta: z.object({
            schemaId: z.string().min(1),
            website: z.string().url(),
            legal: z.object({
                terms: z.string().min(1),
            }),
            media: z.array(
                z.object({
                    URI: z.string().url(),
                    type: z.string().min(1),
                    altURI: z.string().url().optional(),
                })
            ),
        }),
    }),
});

export const createAssetSchema = z.object({
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

export const createAssetResponseSchema = z.object({
    assetID: z.string().min(1),
});

export const updateAssetSchema = z.object({
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

export const updateAssetResponseSchema = messageResponseSchema;

export const assetDetailsSchema = z.object({
    assetID: z.string().min(1),
});

export const assetDetailsResponseSchema = z.object({
    app_id: z.string().min(1),
    asset_id: z.string().min(1),
    asset_name: z.string().min(1),
    asset_type: AssetTypeEnum,

    certificate_metadata: z.object({
        created_by: z.string().min(1),
        department: z.string().min(1),
        logo_url: z.string().url(),
        organization_name: z.string().min(1),
        program: z.string().min(1),
        project_name: z.string().min(1),
        template: z.number().int(),
    }),

    created_at: z.string().datetime(),
    current_supply: z.number().int().nonnegative(),

    event_metadata: z.object({
        event_id: z.string().min(1),
        tier: z.object({
            amount: z.number().int().nonnegative(),
            info: z.string().min(1),
            recommended_tier: z.boolean(),
            restriction: z.string().min(1),
            title: z.string().min(1),
            total_tickets: z.number().int().nonnegative(),
        }),
    }),

    expires_at: z.string().datetime(),
    image_url: z.string().url(),
    legal_term: z.string().min(1),
    minted_at: z.string().datetime(),

    protocol: ProtocolEnum,
    scope: assetScopeEnum,
    status: assetStatusEnum,

    symbol: z.string().min(1),
    team_id: z.string().min(1),

    tokenDetail: tokenDetailsSchema,

    total_supply: z.number().int().nonnegative(),
    updated_at: z.string().datetime(),
    user_id: z.string().min(1),
    utxo_id: z.string().min(1),
    wallet_id: z.string().min(1),
});

export const assetDeleteSchema = z.object({
    assetID: z.string(),
});

export const assetDeleteResponseSchema = messageResponseSchema;

export const mintAssetSchema = z.object({
    assetID: z.string(),
});

export const mintAssetResponseSchema = z.any();

const destinationSchema = z.object({
    amount: z.number().int(),
    country_code: z.string(),
    email: z.string().email(),
    paymail: z.string(),
    phone_number: z.string(),
});

export const transferAssetSchema = z.object({
    transfer_destinations: z.array(destinationSchema.extend({ name: z.string() })),
    asset_id: z.string(),
});

export const transferAssetResponseSchema = z.any();

export const redeemAssetSchema = z.object({
    utxoID: z.string(),
});

export const redeemAssetResponseSchema = z.any();

export const ledgerListSchema = z.object({
    status: z.array(z.string()).optional(),
    walletID: z.string().optional(),
    pageNumber: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).optional(),
    businessId: z.string().optional(),
});

export const ledgerListResponseSchema = z.any();

export const assetListSchema = z.object({
    searchQuery: z.string().optional(),
    status: assetStatusEnum.optional(),
    type: AssetTypeEnum.optional(),
    walletID: z.string().optional(),
    pageNumber: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).optional(),
    businessId: z.string().optional(),
});

export const assetListResponseSchema = z.any();

export const ledgerDetailsSchema = z.object({
    assetID: z.string(),
});

export const ledgerDetailsResponseSchema = z.any();

export const assetStatsResponseSchema = z.object({
    total: z.number().int().nonnegative(),
    totalActiveAssets: z.number().int().nonnegative(),
    totalDraftedAssets: z.number().int().nonnegative(),
    totalExpiredAssets: z.number().int().nonnegative(),
});

export const balancesSchema = z.object({
    walletID: z.string(),
    network: z.enum(['MAIN', 'TEST']).optional(),
    currency: z.string().optional(),
    businessId: z.string().optional(),
});

export const balancesResponseSchema = z.object({
    total_balance: z.record(z.number().optional()),
    asset_balance: z.array(z.record(z.unknown())),
});

export const publicAssetListSchema = z.object({
    pageSize: z.number().optional(),
    searchQuery: z.string().optional(),
    type: z.string().optional(),
    pageNumber: z.number().optional(),
    network: z.string().optional(),
    chain: z.string().optional(),
    businessId: z.string().optional(),
});

export const publicAssetListResponseSchema = z.record(z.unknown());

export const ownedAssetDetailsSchema = z.object({
    assetID: z.string().min(1),
    walletID: z.string().min(1),
    businessId: z.string().optional(),
});

export const ownedAssetDetailsResponseSchema = z.record(z.unknown());

export const eventDetailsSchema = z.object({
    eventId: z.string().min(1),
    businessId: z.string().optional(),
});

export const eventDetailsResponseSchema = z.record(z.unknown());
