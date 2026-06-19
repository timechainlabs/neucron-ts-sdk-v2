# Apps & Blob Storage API

## Apps Service — `sdk.apps`

Register API applications and retrieve app secrets for server-to-server integrations.

---

### `getApps(options?)`

List all registered API apps for a business.

**HTTP:** `GET /app/list`

### Parameters

| Field | Type |
|-------|------|
| `businessId` | `string` (optional) |

---

### `createApp(options)`

Register a new API application.

**HTTP:** `POST /app`

### Parameters — `CreateApp`

| Field | Type | Description |
|-------|------|-------------|
| `businessId` | `string` | Business context |
| `appData` | `object` | App name, description, etc. |

---

### `getAppSecret(options)`

Retrieve the secret key for an API app.

**HTTP:** `GET /app/secret?appID={id}`

> Store app secrets securely. Never expose them in client-side code.

### Example

```typescript
const app = await sdk.apps.createApp({
  businessId: 'biz_abc123',
  appData: {
    name: 'Production Integration',
    description: 'Backend payment processor',
  },
});

const secret = await sdk.apps.getAppSecret({
  businessId: 'biz_abc123',
  appId: app.data.app_id,
});
```

---

## Blob Service — `sdk.blob`

Upload documents to Neucron blob storage (used for invoices, vendor bills, KYC, etc.).

---

### `uploadDocument(options)`

Upload a document file.

**HTTP:** `POST /blob/document/upload`

**Content-Type:** `multipart/form-data` (set automatically)

### Parameters — `UploadDocument`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `File` \| `Blob` | Yes | Document to upload |
| `businessId` | `string` | No | Business context |

### Response — `UploadDocumentResponse`

Returns a document URL or ID for referencing in other APIs (e.g., invoice attachments).

### Example (Browser)

```typescript
const input = document.querySelector<HTMLInputElement>('#file-input');
const file = input?.files?.[0];

if (file) {
  const result = await sdk.blob.uploadDocument({
    file,
    businessId: 'biz_abc123',
  });
  console.log(result.data); // document reference
}
```

### Example (Node.js)

```typescript
import { readFileSync } from 'fs';

const buffer = readFileSync('./invoice.pdf');
const file = new Blob([buffer], { type: 'application/pdf' });

const result = await sdk.blob.uploadDocument({
  file,
  businessId: 'biz_abc123',
});
```
