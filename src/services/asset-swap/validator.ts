import {
    swappableAssetsResponseSchema,
    swapAssetsSchema,
    swapAssetsResponseSchema,
    swapRateSchema,
    swapRateResponseSchema,
} from './schema.js';
import type { SwappableAssetsResponse, SwapAssets, SwapAssetsResponse, SwapRate, SwapRateResponse } from './types.js';

export default class Validator {
    swappableAssetsResponse(response: SwappableAssetsResponse): void {
        swappableAssetsResponseSchema.parse(response);
    }

    swapAssets(options: SwapAssets): void {
        swapAssetsSchema.parse(options);
    }

    swapAssetsResponse(response: SwapAssetsResponse): void {
        swapAssetsResponseSchema.parse(response);
    }

    swapRate(options: SwapRate): void {
        swapRateSchema.parse(options);
    }

    swapRateResponse(response: SwapRateResponse): void {
        swapRateResponseSchema.parse(response);
    }
}
