# Utility & Data Integrity API

## Utility Service — `sdk.utility`

Register, update, mint, and redeem utility tokens on the Neucron platform.

---

### `createUtility(options)`

Register a new utility token definition.

**HTTP:** `POST /utility/register`

### `updateUtility(options)`

Update utility token metadata.

**HTTP:** `PUT /utility/update`

### `mint(options)`

Mint new utility tokens.

**HTTP:** `POST /utility/mint`

### `redeem(options)`

Redeem utility tokens.

**HTTP:** `POST /utility/redeem`

### Example

```typescript
// Register a loyalty points utility
const utility = await sdk.utility.createUtility({
  // utility definition per CreateUtility schema
});

// Mint tokens to a wallet
await sdk.utility.mint({
  walletID: 'wal_123',
  // mint parameters
});
```

---

## Data Integrity Service — `sdk.dataIntegrity`

Upload files or text to create blockchain-backed integrity proofs.

---

### `fileUpload(options)`

Upload a file for integrity anchoring.

**HTTP:** `POST /data-integrity/file`

**Content-Type:** `multipart/form-data`

### Parameters — `FileUpload`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `File` \| `Blob` | Yes | File to upload |
| Additional fields | — | — | Per schema |

### Example (Node.js with File/Blob)

```typescript
import fs from 'fs';

const fileBuffer = fs.readFileSync('./contract.pdf');
const blob = new Blob([fileBuffer], { type: 'application/pdf' });

const result = await sdk.dataIntegrity.fileUpload({
  file: blob,
  // additional metadata fields
});
```

---

### `textUpload(options)`

Anchor plain text on the blockchain.

**HTTP:** `POST /data-integrity/text`

### Parameters — `TextUpload`

Pass the text content and any required metadata per the `TextUpload` schema.

### Example

```typescript
const proof = await sdk.dataIntegrity.textUpload({
  text: 'Important document hash or content',
  // additional fields
});
```
