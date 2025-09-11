import { z } from 'zod';

const nonEmptyString = z.string().min(1);
const id = nonEmptyString;
const message = nonEmptyString;

const walletIDSchema = z.object({
    walletID: id,
});

const responseMessageSchema = z.object({
    message,
});

export const createWalletSchema = z.object({
    walletName: id,
    paymailName: id,
});

export const updateDefaultWalletSchema = walletIDSchema;

export const walletAddressSchema = z.object({
    walletID: id.optional(),
});

export const createWalletResponseSchema = z.object({
    wallet_id: id,
    paymail_id: id,
});

export const walletListResponseSchema = z.object({
    app_id: id.nullable(),
    default_paymail_alias: nonEmptyString.nullable(),
    is_default: z.boolean(),
    team_id: id.nullable(),
    user_id: id,
    wallet_id: id,
    name: nonEmptyString,
});

export const updateDefaultWalletResponseSchema = responseMessageSchema;

export const createAddressResponseSchema = responseMessageSchema;

export const walletAddressListResponseSchema = z.array(nonEmptyString);
