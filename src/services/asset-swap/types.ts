import type { z } from 'zod';
import {
    swappableAssetsResponseSchema,
    swapAssetsSchema,
    swapAssetsResponseSchema,
    swapRateSchema,
    swapRateResponseSchema,
    swapAssetsRequestSchema,
} from './schema.js';

export type SwapAssetsRequest = z.infer<typeof swapAssetsRequestSchema>;
export type SwappableAssetsResponse = z.infer<typeof swappableAssetsResponseSchema>;
export type SwapAssets = z.infer<typeof swapAssetsSchema>;
export type SwapAssetsResponse = z.infer<typeof swapAssetsResponseSchema>;
export type SwapRate = z.infer<typeof swapRateSchema>;
export type SwapRateResponse = z.infer<typeof swapRateResponseSchema>;
