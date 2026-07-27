# Data Integrity

## What is data integrity in Neucron?

**Data Integrity** inscribes files or text onto the blockchain so you can prove content existed at a point in time. Use it for certificates, audit trails, and document attestation.

| Method            | Content                 |
| ----------------- | ----------------------- |
| `fileUpload`      | Binary file (multipart) |
| `textUpload`      | Single text string      |
| `textArrayUpload` | Array of text strings   |

### Shared context options

All methods accept:

| Name         | Type               | Required | Description                 |
| ------------ | ------------------ | -------- | --------------------------- |
| `walletID`   | `string`           | No       | Wallet used for inscription |
| `businessId` | `string`           | No       | Business scope header       |
| `appSecret`  | `string`           | No       | App secret header           |
| `network`    | `'MAIN' \| 'TEST'` | No       | Network                     |

Access via `sdk.dataIntegrity`.

---

## `fileUpload`

Inscribe a file on-chain.

### Parameters

| Name         | Type                                    | Required | Sent as  | Description      |
| ------------ | --------------------------------------- | -------- | -------- | ---------------- |
| `file`       | `Blob \| File \| ReactNativeUploadFile` | Yes      | FormData | File to inscribe |
| `walletID`   | `string`                                | No       | Query    | Wallet           |
| `businessId` | `string`                                | No       | Header   | Business scope   |
| `appSecret`  | `string`                                | No       | Header   | App secret       |
| `network`    | `'MAIN' \| 'TEST'`                      | No       | Query    | Network          |

|                   |                                                                 |
| ----------------- | --------------------------------------------------------------- |
| **Auth required** | Yes                                                             |
| **Headers**       | `Authorization`, `X-Identifier`, optional business / app secret |
| **Content-Type**  | Multipart (`FormData`)                                          |

### Request Payload

```json
{
    "file": "<File | Blob | { uri, name, type }>",
    "walletID": "wal_def456",
    "network": "MAIN",
    "businessId": "biz_abc123"
}
```

Sent as `FormData` with field name `file`.

### Response Payload

```json
{
    "txID": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    "txid": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"
}
```

```typescript
const { data } = await sdk.dataIntegrity.fileUpload({
    file: documentFile,
    walletID: 'wal_def456',
    network: 'MAIN',
});
```

---

## `textUpload`

Inscribe a single text string.

### Parameters

| Name         | Type               | Required | Sent as           | Description                       |
| ------------ | ------------------ | -------- | ----------------- | --------------------------------- |
| `text`       | `string`           | Yes      | Body (text/plain) | Content to inscribe               |
| `hashed`     | `string`           | Yes      | Query             | Hash flag / value used by the API |
| `walletID`   | `string`           | No       | Query             | Wallet                            |
| `businessId` | `string`           | No       | Header            | Business scope                    |
| `appSecret`  | `string`           | No       | Header            | App secret                        |
| `network`    | `'MAIN' \| 'TEST'` | No       | Query             | Network                           |

|                   |                                                                 |
| ----------------- | --------------------------------------------------------------- |
| **Auth required** | Yes                                                             |
| **Headers**       | `Authorization`, `X-Identifier`, optional business / app secret |

### Request Payload

```json
{
    "text": "Certificate of completion for Ada Lovelace — Course ID CERT-2026-001",
    "hashed": "false",
    "walletID": "wal_def456",
    "network": "MAIN",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "txID": "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
    "txid": "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a"
}
```

```typescript
const { data } = await sdk.dataIntegrity.textUpload({
    text: 'Certificate of completion for Ada Lovelace — Course ID CERT-2026-001',
    hashed: 'false',
    walletID: 'wal_def456',
    network: 'MAIN',
});
```

---

## `textArrayUpload`

Inscribe multiple text strings in one call.

### Parameters

| Name         | Type               | Required | Sent as           | Description                 |
| ------------ | ------------------ | -------- | ----------------- | --------------------------- |
| `text`       | `string[]`         | Yes      | Body (JSON array) | Strings to inscribe (min 1) |
| `walletID`   | `string`           | No       | Query             | Wallet                      |
| `businessId` | `string`           | No       | Header            | Business scope              |
| `appSecret`  | `string`           | No       | Header            | App secret                  |
| `network`    | `'MAIN' \| 'TEST'` | No       | Query             | Network                     |

|                   |                                                                 |
| ----------------- | --------------------------------------------------------------- |
| **Auth required** | Yes                                                             |
| **Headers**       | `Authorization`, `X-Identifier`, optional business / app secret |

### Request Payload

```json
{
    "text": ["Record A: shipment #1001 sealed", "Record B: shipment #1002 sealed"],
    "walletID": "wal_def456",
    "network": "MAIN",
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
    "txID": "c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2",
    "txid": "c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567ab2"
}
```

```typescript
const { data } = await sdk.dataIntegrity.textArrayUpload({
    text: ['Record A: shipment #1001 sealed', 'Record B: shipment #1002 sealed'],
    walletID: 'wal_def456',
    network: 'MAIN',
});
```
