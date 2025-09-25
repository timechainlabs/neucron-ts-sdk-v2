import z from "zod";

const transferDestinationBaseSchema = z.object({
    amount: z.number().int().min(1, "Amount must be greater than 0"),
});

const addressDestinationSchema = transferDestinationBaseSchema.extend({
    address: z.string().min(1, "Address is required"),
});

const emailDestinationSchema = transferDestinationBaseSchema.extend({
    email: z.string().email("Enter a valid email"),
});

const paymailDestinationSchema = transferDestinationBaseSchema.extend({
    paymail: z.string().min(1, "Paymail is required"),
});

const transferDestinationSchema = z.union([
    addressDestinationSchema,
    emailDestinationSchema,
    paymailDestinationSchema,
]);

export const payRequestSchema = z.object({
    walletID: z.string().optional(),
    asset_id: z.string().min(1, "assetId is required"),
    transfer_destinations: z.array(transferDestinationSchema).min(1),
});

export const payResponseSchema = z.array(z.string().min(1)).min(1);
