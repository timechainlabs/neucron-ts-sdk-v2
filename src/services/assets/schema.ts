import { z } from 'zod';

const AssetTypeEnum = z.enum(['STAS', 'CERTIFICATE', 'UTILITY', 'SECURITY', 'STABLECOIN', 'MNEE', 'TICKET']);

const ProtocolEnum = z.enum(['STAS-20', 'STAS-789', 'STAS-50', 'STAS-LEGACY', 'NULL']);

export const createAssetSchema = z.object({
    asset_name: z.string(),
    asset_type: AssetTypeEnum,
    expires_at: z.string().datetime().optional(),
    image_url: z.string().optional(),
    legal_term: z.string(),
    protocol: ProtocolEnum,
    symbol: z.string(),
    tokenDetail: z.record(z.any()),
    total_supply: z.number().int(),
    wallet_id: z.string().optional(),
});

export const updateAssetSchema = z.object({
    asset_id: z.string(),
    asset_name: z.string().optional(),
    asset_type: AssetTypeEnum.optional(),
    expires_at: z.string().datetime().optional(),
    image_url: z.string().optional().optional(),
    legal_term: z.string().optional(),
    protocol: ProtocolEnum.optional(),
    symbol: z.string().optional(),
    tokenDetail: z.record(z.any()).optional(),
    total_supply: z.number().int().optional(),
    wallet_id: z.string().optional(),
});

export const mintAssetSchema = z.object({
    assetID: z.string(),
});

const transferDestinationSchema = z.object({
    amount: z.number().int(),
    country_code: z.string(),
    email: z.string().email(),
    paymail: z.string(),
    phone_number: z.string(),
});

export const transferAssetSchema = z.object({
    transfer_destinations: z.array(transferDestinationSchema),
    utxo_id: z.string(),
});

const mergeDestinationSchema = z.object({
    amount: z.number().int(),
    country_code: z.string(),
    email: z.string(),
    paymail: z.string(),
    phone_number: z.string(),
});

export const mergeAssetSchema = z.object({
    merge_destinations: z.array(mergeDestinationSchema),
    utxo_ids: z.array(z.string()),
});

export const redeemAssetSchema = z.object({
    utxoID: z.string(),
});

export const getLedgerListSchema = z.object({
    status: z.array(z.string()),
    walletID: z.string().optional(),
    pageNumber: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).optional(),
});

export const getAssetListSchema = z.object({
    searchQuery: z.string().optional(),
    status: z.string().optional(),
    walletID: z.string().optional(),
    pageNumber: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(1).optional(),
});
