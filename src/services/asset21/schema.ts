import { z } from 'zod';
import { networkEnum, nonEmptyString, pageMetaSchema } from '../../utils/schema/common.js';

export const messageResponseSchema = z.object({
    message: z.string(),
});

export const requestStateEnum = z.enum([
    'CUSTOMER',
    'MINT',
    'REDEEM',
    'PAUSE',
    'RESUME',
    'FREEZE',
    'BLACKLIST',
    'UNFREEZE',
    'UNBLACKLIST',
]);

export const requestStatusEnum = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']);

export const requestActionEnum = z.enum(['APPROVE', 'REJECT']);

const asset21ContextSchema = z.object({
    businessId: z.string().optional(),
    teamId: z.string().optional(),
});

const feeStructureSchema = z.object({
    fee: z.union([z.string(), z.number()]),
    min: z.union([z.string(), z.number()]),
    max: z.union([z.string(), z.number()]),
});

export const registerBodySchema = z.object({
    asset_name: nonEmptyString,
    symbol: nonEmptyString,
    decimals: z.number(),
    image_url: nonEmptyString,
    legal_term: nonEmptyString,
    wallet_id: nonEmptyString,
    network: networkEnum,
    token_detail: z
        .object({
            icon: z.string().optional(),
            decimal: z.number().optional(),
            feeStructure: z.array(feeStructureSchema).optional(),
            holder_identity_config: z.record(z.unknown()).optional(),
            request_config: z
                .object({
                    min_approval: z.number(),
                    min_rejection: z.number(),
                })
                .optional(),
        })
        .passthrough(),
    asset_type: z.string().optional(),
    currency: z.string().optional(),
    price: z.number().optional(),
    total_supply: z.number().optional(),
});

export const registerSchema = asset21ContextSchema.merge(registerBodySchema);

export const registerResponseSchema = z.object({
    assetID: nonEmptyString,
});

export const getAddressStateSchema = asset21ContextSchema.extend({
    address: nonEmptyString,
    assetID: nonEmptyString,
});

export const getAddressStateResponseSchema = z
    .object({
        address: z.string(),
        assetId: z.string().optional(),
        balance: z.union([z.string(), z.number()]).optional(),
        frozen: z.boolean().optional(),
        blacklisted: z.boolean().optional(),
    })
    .passthrough();

export const fetchBalanceSchema = asset21ContextSchema
    .extend({
        assetID: z.string().optional(),
        address: z.string().optional(),
        addresses: z.array(nonEmptyString).optional(),
    })
    .refine((data) => Boolean(data.address) || Boolean(data.addresses?.length), {
        message: 'Either address or addresses is required',
    });

export const fetchBalanceResponseSchema = z
    .object({
        success: z.boolean().optional(),
        data: z
            .object({
                balances: z
                    .array(
                        z
                            .object({
                                address: z.string(),
                                balance: z.union([z.string(), z.number()]),
                                confirmed: z.union([z.string(), z.number()]).optional(),
                                unconfirmed: z.union([z.string(), z.number()]).optional(),
                            })
                            .passthrough()
                    )
                    .optional(),
            })
            .passthrough()
            .optional(),
    })
    .passthrough();

export const systemConfigSchema = asset21ContextSchema.extend({
    assetID: nonEmptyString,
});

const FeeSchema = z.object({
    fee: z.union([z.string(), z.number()]),
    max: z.union([z.string(), z.number()]),
    min: z.union([z.string(), z.number()]),
});

export const systemConfigResponseSchema = z
    .object({
        approver: z.string().optional(),
        assetId: z.string().optional(),
        burnAddress: z.string().optional(),
        decimals: z.number().optional(),
        feeAddress: z.string().optional(),
        fees: z.array(FeeSchema).optional(),
        mintAddress: z.string().optional(),
        minterHex: z.string().optional(),
        paused: z.boolean().optional(),
        symbol: z.string().optional(),
        tokenId: z.string().optional(),
    })
    .passthrough();

export const updateSystemConfigSchema = asset21ContextSchema.extend({
    assetID: nonEmptyString,
    fees: z.array(FeeSchema).optional(),
    request_config: z
        .object({
            min_approval: z.number(),
            min_rejection: z.number(),
        })
        .optional(),
});

export const updateSystemConfigResponseSchema = messageResponseSchema;

export const getCustomersSchema = asset21ContextSchema.extend({
    assetID: nonEmptyString,
});

export const getCustomerResponseSchema = z.array(
    z
        .object({
            address: z.string(),
            asset_id: z.string().optional(),
            email: z.string().optional(),
            name: z.string().optional(),
            paymail: z.string().optional(),
        })
        .passthrough()
);

export const deploySchema = asset21ContextSchema.extend({
    assetID: nonEmptyString,
});

export const deployResponseSchema = z.object({
    txid: nonEmptyString,
});

export const requestDetailsSchema = z
    .object({
        UtxoId: z.string().optional(),
        address: z.string().optional(),
        amount: z.union([z.string(), z.number()]).optional(),
        email: z.string().optional(),
        name: z.string().optional(),
        paymail: z.string().optional(),
    })
    .passthrough();

export const createRequestSchema = asset21ContextSchema.extend({
    assetId: nonEmptyString,
    state: requestStateEnum,
    requestDetails: requestDetailsSchema,
    approvalsRequired: z.number().optional(),
    rejectionsRequired: z.number().optional(),
});

export const createRequestResponseSchema = z
    .object({
        message: z.string().optional(),
        requestId: z.string().optional(),
        redirect_url: z.string().optional(),
        redirectUrl: z.string().optional(),
        intent_id: z.string().optional(),
    })
    .passthrough();

export const updateRequestSchema = asset21ContextSchema.extend({
    action: requestActionEnum,
    assetId: nonEmptyString,
    requestId: nonEmptyString,
});

export const updateRequestResponseSchema = z
    .object({
        message: z.string().optional(),
        redirect_url: z.string().optional(),
        redirectUrl: z.string().optional(),
        intent_id: z.string().optional(),
    })
    .passthrough();

export const getRequestSchema = asset21ContextSchema.extend({
    assetID: nonEmptyString,
    page: z.number().min(1),
    size: z.number().min(1),
    state: requestStateEnum.optional(),
    status: requestStatusEnum.optional(),
});

const UserSchema = z.object({
    email: z.string().optional(),
    name: z.string().optional(),
    userID: z.string().optional(),
});

export const getRequestResponseSchema = z.array(
    z
        .object({
            approvalsRequired: z.number().optional(),
            approvers: z.array(UserSchema).nullable().optional(),
            assetId: z.string(),
            createdAt: z.string().optional(),
            created_by: z.string().optional(),
            currentApprovals: z.number().optional(),
            currentRejections: z.number().optional(),
            rejectionsRequired: z.number().optional(),
            rejectors: z.array(UserSchema).nullable().optional(),
            requestDetails: requestDetailsSchema.optional(),
            requestId: z.string(),
            state: requestStateEnum.optional(),
            status: z.string().optional(),
            updatedAt: z.string().optional(),
        })
        .passthrough()
);

export const syncTransactionSchema = asset21ContextSchema.extend({
    assetID: nonEmptyString,
    txid: nonEmptyString,
});

export const syncTransactionResponseSchema = z.array(
    z
        .object({
            height: z.number().optional(),
            idx: z.number().optional(),
            outs: z.array(z.number()).optional(),
            rawtx: z.string().optional(),
            receivers: z.array(z.string()).optional(),
            score: z.number().optional(),
            senders: z.array(z.string()).optional(),
            txid: z.string(),
        })
        .passthrough()
);

export const listSyncedTransactionsSchema = asset21ContextSchema.extend({
    assetID: nonEmptyString,
    from: z.union([z.string(), z.number()]).optional(),
    limit: z.union([z.string(), z.number()]).optional(),
    action: z.string().optional(),
});

export const listSyncedTransactionsResponseSchema = syncTransactionResponseSchema;

export const triggerSyncForAddressesSchema = asset21ContextSchema.extend({
    assetID: nonEmptyString,
    addresses: z.array(nonEmptyString).min(1),
});

export const triggerSyncForAddressesResponseSchema = syncTransactionResponseSchema;

export const transferBodySchema = z.object({
    walletID: nonEmptyString,
    fromAddress: nonEmptyString,
    toAddress: nonEmptyString,
    amount: nonEmptyString,
    tokenAddress: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
});

export const transferSchema = asset21ContextSchema.extend({
    assetID: z.string().optional(),
    ...transferBodySchema.shape,
});

export const transferResponseSchema = z
    .object({
        success: z.boolean().optional(),
        data: z
            .object({
                transactionHash: z.string().optional(),
                transferId: z.string().optional(),
                status: z.string().optional(),
                amount: z.string().optional(),
                fromAddress: z.string().optional(),
                toAddress: z.string().optional(),
            })
            .passthrough()
            .optional(),
    })
    .passthrough();

export const getUnspentUTXOsSchema = asset21ContextSchema
    .extend({
        assetID: z.string().optional(),
        address: z.string().optional(),
        addresses: z.array(nonEmptyString).optional(),
        includeMempool: z.boolean().optional(),
    })
    .refine((data) => Boolean(data.address) || Boolean(data.addresses?.length), {
        message: 'Either address or addresses is required',
    });

const Asset21Schema = z.object({
    amt: z.number().optional(),
    dec: z.number().optional(),
    icon: z.string().optional(),
    id: z.string().optional(),
    op: z.string().optional(),
    sym: z.string().optional(),
});

const CosignSchema = z.object({
    address: z.string(),
    cosigner: z.string(),
});

const DataSchema = z.object({
    asset21: Asset21Schema.optional(),
    cosign: CosignSchema.optional(),
});

const UTXOInfoSchema = z
    .object({
        data: DataSchema.optional(),
        height: z.number().optional(),
        idx: z.number().optional(),
        outpoint: z.string().optional(),
        owners: z.array(z.string()).optional(),
        satoshis: z.number().optional(),
        score: z.number().optional(),
        script: z.string().optional(),
        senders: z.array(z.string()).optional(),
        txid: z.string().optional(),
        vout: z.number().optional(),
    })
    .passthrough();

export const getUnspentUTXOsResponseSchema = z.union([z.array(UTXOInfoSchema), z.record(z.unknown())]);

export const getOutputInfoSchema = asset21ContextSchema.extend({
    outpoint: nonEmptyString,
});

export const getOutputInfoResponseSchema = z
    .object({
        outpoint: z.string().optional(),
        output: z.record(z.unknown()).optional(),
    })
    .passthrough();

export const getAnalyticsSchema = asset21ContextSchema.extend({
    assetID: nonEmptyString,
    limit: z.union([z.string(), z.number()]).optional(),
    graphRange: z.string().optional(),
});

export const analyticsGraphPointSchema = z
    .object({
        mint_count: z.number().optional(),
        mint_volume: z.number().optional(),
        redeem_count: z.number().optional(),
        redeem_volume: z.number().optional(),
        timestamp: z.string().optional(),
        transfer_count: z.number().optional(),
        transfer_volume: z.number().optional(),
    })
    .passthrough();

export const getAnalyticsResponseSchema = z
    .object({
        graph_data: z.array(analyticsGraphPointSchema).optional(),
        pending_operations: z.number().optional(),
        total_customers: z.number().optional(),
        total_supply: z.union([z.string(), z.number()]).optional(),
    })
    .passthrough();

export const listDeployedAssetsSchema = asset21ContextSchema.extend({
    status: nonEmptyString,
    pageNumber: z.number().min(1).optional(),
    pageSize: z.number().min(1).optional(),
});

export const listDeployedAssetsResponseSchema = z.object({
    list: z.array(z.record(z.unknown())),
    page_meta: pageMetaSchema.optional(),
});
