# Asset Swap API

**Service:** `sdk.assetSwap`

Discover swappable assets, get exchange rates, and execute swaps.

---

## `getSwappableAssets(options?)`

List assets available for swapping.

**HTTP:** `GET /asset-swap/swappable`

### Parameters

| Field | Type |
|-------|------|
| `businessId` | `string` (optional) |

### Example

```typescript
const swappable = await sdk.assetSwap.getSwappableAssets({
  businessId: 'biz_abc123',
});
```

---

## `getSwapRate(options)`

Get the current exchange rate between two assets.

**HTTP:** `GET /asset-swap/rate`

### Parameters — `SwapRate`

Pass source and destination asset identifiers as defined in the `SwapRate` type.

---

## `swapAssets(options)`

Execute an asset swap.

**HTTP:** `POST /asset-swap/swap`

### Parameters — `SwapAssets`

| Field | Type | Description |
|-------|------|-------------|
| `walletID` | `string` | Source wallet |
| Source/destination asset fields | — | Per `SwapAssets` schema |
| `businessId` | `string` | Optional business context |

### Example

```typescript
// 1. Check rate
const rate = await sdk.assetSwap.getSwapRate({
  // fromAsset, toAsset, amount, etc.
});

// 2. Execute swap
const result = await sdk.assetSwap.swapAssets({
  walletID: 'wal_123',
  // swap parameters
});
```
