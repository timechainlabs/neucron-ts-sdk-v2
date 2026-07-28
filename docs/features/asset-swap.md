# Asset Swap

## What is Asset Swap?

**Asset Swap** lets you exchange one supported asset for another at a quoted rate, including across chains (for example USDC on one network to USDT on another). Each side of a swap names both the asset and its network, so cross-chain routes use the same call shape as same-chain ones. Typical flow:

1. `getSwappableAssets` — see which from/to pairs are available
2. `getSwapRate` — quote amount, min/max, and expected output
3. `swapAssets` — execute the swap from a wallet

Access via `sdk.assetSwap`.

---

## `getSwappableAssets`

List assets that can be swapped from and to.

|                     |                                                       |
| ------------------- | ----------------------------------------------------- |
| **Parameters**      | `businessId?: string` (optional header scope)         |
| **Auth required**   | Yes                                                   |
| **Headers**         | `Authorization`, `X-Identifier`, optional business ID |
| **Request Payload** | None (or pass `businessId` only)                      |

### Request Payload

```json
{
    "businessId": "biz_abc123"
}
```

Omit `businessId` for personal scope:

**Request Payload:** None

### Response Payload

```json
{
    "from": [
        {
            "asset_name": "BSV",
            "asset_network": "MAIN"
        },
        {
            "asset_name": "MNEE",
            "asset_network": "MAIN"
        }
    ],
    "to": [
        {
            "asset_name": "BSV",
            "asset_network": "MAIN"
        },
        {
            "asset_name": "MNEE",
            "asset_network": "MAIN"
        }
    ]
}
```

```typescript
const { data } = await sdk.assetSwap.getSwappableAssets({
    businessId: 'biz_abc123',
});
```

---

## `getSwapRate`

Get a swap quote for a given amount and asset pair.

### Parameters

| Name                        | Type     | Required | Description         |
| --------------------------- | -------- | -------- | ------------------- |
| `payload.amount`            | `number` | Yes      | Amount to swap      |
| `payload.from_asset_name`   | `string` | Yes      | Source asset        |
| `payload.from_network_name` | `string` | Yes      | Source network      |
| `payload.to_asset_name`     | `string` | Yes      | Destination asset   |
| `payload.to_network_name`   | `string` | Yes      | Destination network |
| `businessId`                | `string` | No       | Business scope      |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "businessId": "biz_abc123",
    "payload": {
        "amount": 100,
        "from_asset_name": "BSV",
        "from_network_name": "MAIN",
        "to_asset_name": "MNEE",
        "to_network_name": "MAIN"
    }
}
```

### Response Payload

```json
{
    "maximum_amount": 10000,
    "minimum_amount": 1,
    "rate": 0.95,
    "requested_amount": 100,
    "swapped_amount": 95
}
```

```typescript
const { data } = await sdk.assetSwap.getSwapRate({
    businessId: 'biz_abc123',
    payload: {
        amount: 100,
        from_asset_name: 'BSV',
        from_network_name: 'MAIN',
        to_asset_name: 'MNEE',
        to_network_name: 'MAIN',
    },
});
```

---

## `swapAssets`

Execute a swap from a wallet.

### Parameters

| Name         | Type     | Required | Description                         |
| ------------ | -------- | -------- | ----------------------------------- |
| `walletID`   | `string` | Yes      | Source wallet                       |
| `payload`    | `object` | Yes      | Same shape as `getSwapRate` payload |
| `businessId` | `string` | No       | Business scope                      |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "walletID": "wal_def456",
    "businessId": "biz_abc123",
    "payload": {
        "amount": 100,
        "from_asset_name": "BSV",
        "from_network_name": "MAIN",
        "to_asset_name": "MNEE",
        "to_network_name": "MAIN"
    }
}
```

### Response Payload

```json
{
    "message": "Swap completed successfully"
}
```

```typescript
await sdk.assetSwap.swapAssets({
    walletID: 'wal_def456',
    businessId: 'biz_abc123',
    payload: {
        amount: 100,
        from_asset_name: 'BSV',
        from_network_name: 'MAIN',
        to_asset_name: 'MNEE',
        to_network_name: 'MAIN',
    },
});
```
