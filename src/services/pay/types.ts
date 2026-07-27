import type { z } from 'zod';
import { payRequestSchema, payResponseSchema } from './schema.js';
import type { AssetName } from '../../utils/constants/asset.js';

export type PayRequest = z.infer<typeof payRequestSchema>; // internal
export type PayResponse = z.infer<typeof payResponseSchema>;

export interface PayRequestInput {
    walletID?: string;
    assetName: AssetName;
    transfer_destinations: PayRequest['transfer_destinations'];
}

export type PayRequestInputTest = Omit<PayRequestInput, 'assetName'> & {
    assetName: string; // only for tests
};
