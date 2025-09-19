export const ASSET_IDS = {
    BSV: "00000000-0000-0000-0000-000000000000",
} as const;

export type AssetName = keyof typeof ASSET_IDS;
