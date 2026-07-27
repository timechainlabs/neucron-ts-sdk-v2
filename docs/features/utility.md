# Utility Tokens

## What are utility tokens in Neucron?

**Utility tokens** are digital assets you register, mint, and redeem through Neucron. Typical lifecycle:

1. `createUtility` — register the asset (draft)
2. `updateUtility` — adjust metadata before mint
3. `mint` — issue supply on-chain
4. `redeem` — burn / redeem a UTXO

Access via `sdk.utility`.

---

## `createUtility`

Register a new utility (or related) asset.

### Parameters

| Name           | Type                                                                                       | Required | Description                                                |
| -------------- | ------------------------------------------------------------------------------------------ | -------- | ---------------------------------------------------------- |
| `asset_name`   | `string`                                                                                   | Yes      | Display name                                               |
| `asset_type`   | `'STAS' \| 'CERTIFICATE' \| 'UTILITY' \| 'SECURITY' \| 'STABLECOIN' \| 'MNEE' \| 'TICKET'` | Yes      | Asset type                                                 |
| `legal_term`   | `string`                                                                                   | Yes      | Legal terms text                                           |
| `protocol`     | `'STAS-20' \| 'STAS-789' \| 'STAS-50' \| 'STAS-LEGACY' \| 'NULL'`                          | Yes      | Token protocol                                             |
| `symbol`       | `string`                                                                                   | Yes      | Ticker                                                     |
| `tokenDetail`  | `object`                                                                                   | Yes      | Token metadata (name, supply, satsPerToken, properties, …) |
| `total_supply` | `number`                                                                                   | Yes      | Total supply                                               |
| `expires_at`   | `string` (datetime)                                                                        | No       | Expiry                                                     |
| `image_url`    | `string`                                                                                   | No       | Image URL                                                  |
| `wallet_id`    | `string`                                                                                   | No       | Issuing wallet                                             |

|                   |                 |
| ----------------- | --------------- |
| **Auth required** | Yes             |
| **Headers**       | `Authorization` |

### Request Payload

```json
{
    "asset_name": "Loyalty Points",
    "asset_type": "UTILITY",
    "legal_term": "Subject to issuer terms of use.",
    "protocol": "STAS-20",
    "symbol": "LOYAL",
    "total_supply": 1000000,
    "wallet_id": "wal_def456",
    "image_url": "https://cdn.example.com/loyal.png",
    "tokenDetail": {
        "name": "Loyalty Points",
        "protocolId": "STAS-20",
        "symbol": "LOYAL",
        "totalSupply": 1000000,
        "satsPerToken": 1,
        "description": "Redeemable loyalty points",
        "decimals": 0,
        "properties": {
            "issuer": {
                "organisation": "Acme Labs",
                "email": "legal@acme.example.com",
                "issuerCountry": "IN"
            },
            "legal": {
                "terms": "https://acme.example.com/terms"
            },
            "meta": {
                "website": "https://acme.example.com"
            }
        }
    }
}
```

### Response Payload

```json
{
    "assetID": "asset_util001"
}
```

```typescript
const { data } = await sdk.utility.createUtility({
    asset_name: 'Loyalty Points',
    asset_type: 'UTILITY',
    legal_term: 'Subject to issuer terms of use.',
    protocol: 'STAS-20',
    symbol: 'LOYAL',
    total_supply: 1000000,
    wallet_id: 'wal_def456',
    tokenDetail: {
        name: 'Loyalty Points',
        protocolId: 'STAS-20',
        symbol: 'LOYAL',
        totalSupply: 1000000,
        satsPerToken: 1,
        properties: {},
    },
});
```

---

## `updateUtility`

Update a drafted utility asset.

### Parameters

| Name                    | Type     | Required | Description                             |
| ----------------------- | -------- | -------- | --------------------------------------- |
| `asset_id`              | `string` | Yes      | Asset to update                         |
| _(other create fields)_ | —        | No       | Same optional fields as `createUtility` |

|                   |                 |
| ----------------- | --------------- |
| **Auth required** | Yes             |
| **Headers**       | `Authorization` |

### Request Payload

```json
{
    "asset_id": "asset_util001",
    "asset_name": "Loyalty Points v2",
    "legal_term": "Updated terms of use.",
    "image_url": "https://cdn.example.com/loyal-v2.png"
}
```

### Response Payload

```json
{
    "message": "Utility asset updated successfully"
}
```

```typescript
await sdk.utility.updateUtility({
    asset_id: 'asset_util001',
    asset_name: 'Loyalty Points v2',
});
```

---

## `mint`

Mint a registered utility asset.

### Parameters

| Name      | Type     | Required | Sent as | Description   |
| --------- | -------- | -------- | ------- | ------------- |
| `assetID` | `string` | Yes      | Query   | Asset to mint |

|                   |                 |
| ----------------- | --------------- |
| **Auth required** | Yes             |
| **Headers**       | `Authorization` |
| **Request body**  | None            |

### Request Payload

```json
{
    "assetID": "asset_util001"
}
```

### Response Payload

```json
{
    "txid": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    "status": "MINTED",
    "message": "Asset minted successfully"
}
```

```typescript
const { data } = await sdk.utility.mint({ assetID: 'asset_util001' });
```

---

## `redeem`

Redeem (burn) a utility UTXO.

### Parameters

| Name     | Type     | Required | Sent as | Description    |
| -------- | -------- | -------- | ------- | -------------- |
| `utxoID` | `string` | Yes      | Query   | UTXO to redeem |

|                   |                 |
| ----------------- | --------------- |
| **Auth required** | Yes             |
| **Headers**       | `Authorization` |
| **Request body**  | None            |

### Request Payload

```json
{
    "utxoID": "utxo_abc123"
}
```

### Response Payload

```json
{
    "txid": "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
    "status": "REDEEMED",
    "message": "UTXO redeemed successfully"
}
```

```typescript
const { data } = await sdk.utility.redeem({ utxoID: 'utxo_abc123' });
```
