import { z } from 'zod';

export const messageResponseSchema = z.object({
    message: z.string(),
});

const stateEnum = z.enum(['CUSTOMER', 'MINT', 'REDEEM', 'FREEZE', 'BLACKLIST', 'UNFREEZE', 'UNBLACKLIST']);

export const getAddressStateSchema = z.object({
    assetID: z.string().min(1, 'Asset ID is required'),
});

export const getAddressStateResponseSchema = z.array(
    z.object({
        address: z.string(),
        state: z.string(),
    })
);

export const fetchBalanceSchema = getAddressStateSchema.extend({
    addresses: z.array(z.string().min(1, 'Address is required')),
});

export const fetchBalanceResponseSchema = z.array(
    z.object({
        address: z.string().min(1, 'Address is required'),
        amt: z.number().min(0, 'Amount is required'),
        precised: z.number().min(0, 'Precised is required'),
    })
);

export const systemConfigSchema = getAddressStateSchema;

const FeeSchema = z.object({
    fee: z.number(),
    max: z.number(),
    min: z.number(),
});

export const systemConfigResponseSchema = z.object({
    approver: z.string(),
    assetId: z.string(),
    burnAddress: z.string(),
    decimals: z.number(),
    feeAddress: z.string(),
    fees: z.array(FeeSchema),
    mintAddress: z.string(),
    minterHex: z.string(),
    paused: z.boolean(),
    symbol: z.string(),
    tokenId: z.string(),
});

export const getCustomersSchema = getAddressStateSchema;

export const getCustomerResponseSchema = z.object({
    address: z.string().min(1, 'Address is required'),
    asset_id: z.string().min(1, 'Address is required'),
    email: z.string().min(1, 'Email is required'),
});

export const deploySchema = getAddressStateSchema.extend({
    'X-Neucron-Team-ID': z.string().min(1, 'Team ID is required'),
});

export const deployResponseSchema = z.object({
    txid: z.string().min(1, 'txid is required for successful deployment'),
});

const registerPayloadBody = z.object({
    asset_name: z.string().min(1, 'Asset name cannot be empty'),
    image_url: z.string().url('Must be a valid URL'),
    legal_term: z.string().min(1, 'Legal term cannot be empty'),
    symbol: z.string().min(1, 'Symbol cannot be empty'),
    token_detail: z.object({
        decimal: z.number(),
        feeStructure: z.array(
            z.object({
                fee: z.number(),
                max: z.number(),
                min: z.number(),
            })
        ),
        icon: z.string().min(1, 'Icon cannot be empty'),
        request_config: z.object({
            min_approval: z.number(),
            min_rejection: z.number(),
        }),
    }),
    total_supply: z.number().nonnegative(),
    wallet_id: z.string().min(1, 'Wallet ID cannot be empty'),
});

export const registerPayloadSchema = z.object({
    'X-Neucron-Team-ID': z.string().min(1, 'Team ID is required'),
    registerPayloadBody,
});

export const registerResponseSchema = getAddressStateSchema;

export const createRequestSchema = z.object({
    approvalsRequired: z.number(),
    assetId: z.string().min(1, 'Asset ID cannot be empty'),
    rejectionsRequired: z.number(),
    requestDetails: z.object({
        UtxoId: z.string().optional(),
        address: z.string().optional(),
        amount: z.number().optional(),
        email: z.string().email('Invalid email format').optional(),
        name: z.string().optional(),
    }),
    state: stateEnum,
});

export const createRequestResponseSchema = messageResponseSchema;

export const updateRequestSchema = z.object({
    action: z.string().min(1, 'Action cannot be empty'),
    assetId: z.string().min(1, 'Asset ID cannot be empty'),
    requestId: z.string().min(1, 'Request ID cannot be empty'),
});

export const updateRequestResponseSchema = messageResponseSchema;

export const getRequestSchema = z.object({
    assetID: z.string().min(1, 'Asset ID cannot be empty'),
    state: stateEnum,
    status: z.string().min(1, 'Status cannot be empty'),
    page: z.string().min(1, 'Page cannot be empty'),
    size: z.string().min(1, 'Page size cannot be empty'),
});

const UserSchema = z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().min(1, 'Name cannot be empty'),
    userID: z.string().min(1, 'User ID cannot be empty'),
});

const RequestDetailsSchema = z.object({
    UtxoId: z.string().min(1, 'UtxoId cannot be empty'),
    address: z.string().min(1, 'Address cannot be empty'),
    amount: z.number(),
    email: z.string().email('Invalid email format'),
});

export const getRequestResponseSchema = z.array(
    z.object({
        approvalsRequired: z.number(),
        approvers: z.array(UserSchema),
        assetId: z.string().min(1, 'Asset ID cannot be empty'),
        createdAt: z.string().min(1, 'CreatedAt cannot be empty'),
        created_by: z.string().min(1, 'Created_by cannot be empty'),
        currentApprovals: z.number(),
        currentRejections: z.number(),
        rejectionsRequired: z.number(),
        rejectors: z.array(UserSchema),
        requestDetails: RequestDetailsSchema,
        requestId: z.string().min(1, 'Request ID cannot be empty'),
        state: stateEnum,
        status: z.string().min(1, 'Status cannot be empty'),
        updatedAt: z.string().min(1, 'UpdatedAt cannot be empty'),
    })
);

export const syncTransactionSchema = z.object({
    assetID: z.string().min(1, 'Asset ID cannot be empty'),
    from: z.number().default(0),
    limit: z.number().default(1000),
});

export const syncTransactionResponse = z.array(
    z.object({
        height: z.number(),
        idx: z.number(),
        outs: z.array(z.number()),
        rawtx: z.string().min(1, 'Raw transaction cannot be empty'),
        receivers: z.array(z.string().min(1, 'Receiver address cannot be empty')),
        score: z.number(),
        senders: z.array(z.string().min(1, 'Sender address cannot be empty')),
        txid: z.string().min(1, 'Transaction ID cannot be empty'),
    })
);

export const triggerSyncForAddressesSchema = syncTransactionSchema.extend({
    order: z.string().min(1, 'Order cannot be empty'),
    request: z.array(z.string().min(1, 'Request cannot be empty')),
});

export const triggerSyncForAddressesResponseSchema = syncTransactionResponse;

export const transferSchema = z.object({
    assetID: z.string().min(1, 'Asset ID cannot be empty'),
    transfer: z.string().min(1, 'Transfer cannot be empty'),
});

export const transferResponseSchema = z.array(z.string().min(1, 'Transfer cannot be empty'));

export const getUnspentUTXOs = z.object({
    assetID: z.string().min(1, 'Asset ID cannot be empty'),
    addresses: z.array(z.string().min(1, 'Address cannot be empty')),
});

const Asset21Schema = z.object({
    amt: z.number(),
    dec: z.number(),
    icon: z.string().min(1, 'Icon cannot be empty'),
    id: z.string().min(1, 'Asset ID cannot be empty'),
    op: z.string().min(1, 'Operation cannot be empty'),
    sym: z.string().min(1, 'Symbol cannot be empty'),
});

const CosignSchema = z.object({
    address: z.string().min(1, 'Cosign address cannot be empty'),
    cosigner: z.string().min(1, 'Cosigner cannot be empty'),
});

const DataSchema = z.object({
    asset21: Asset21Schema,
    cosign: CosignSchema,
});

export const getUnspentUTXOResponse = z.array(
    z.object({
        data: DataSchema,
        height: z.number().int().nonnegative(),
        idx: z.number().int().nonnegative(),
        outpoint: z.string().min(1, 'Outpoint cannot be empty'),
        owners: z.array(z.string().min(1, 'Owner address cannot be empty')),
        satoshis: z.number().int().nonnegative(),
        score: z.number(),
        script: z.string().min(1, 'Script cannot be empty'),
        senders: z.array(z.string().min(1, 'Sender address cannot be empty')),
        txid: z.string().min(1, 'Transaction ID cannot be empty'),
        vout: z.number().int().nonnegative(),
    })
);

export const getOutputInfoSchema = z.object({
    outpoint: z.string().min(1, 'Outpoint cannot be empty'),
});

export const getOutputInfoResponse = getUnspentUTXOResponse;
