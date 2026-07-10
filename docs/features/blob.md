# Blob Storage

## What is blob storage?

The **Blob** service uploads files to Neucron-managed storage and returns URLs you can attach to apps, invoices, KYB documents, and other resources.

| Method | Purpose |
| --- | --- |
| `uploadDocument` | PDFs and general documents |
| `uploadImage` | Images (logos, avatars, media) |

### Supported file inputs

| Environment | Type |
| --- | --- |
| Browser / Node | `Blob` or `File` |
| React Native | `{ uri, name, type }` |

Access via `sdk.blob`.

---

## `uploadDocument`

Upload a document file.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `file` | `Blob \| File \| ReactNativeUploadFile` | Yes | FormData | Document |
| `businessId` | `string` | No | Header | Business scope |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |
| **Content-Type** | Multipart (`FormData`) |

### Request Payload

```json
{
  "businessId": "biz_abc123",
  "file": "<File | Blob | { uri, name, type }>"
}
```

Sent as `FormData` with field name `document`.

### Response Payload

```json
{
  "url": "https://cdn.neucron.io/documents/doc_xyz789.pdf"
}
```

```typescript
const { data } = await sdk.blob.uploadDocument({
  businessId: 'biz_abc123',
  file: documentFile,
});
console.log(data.url);
```

---

## `uploadImage`

Upload an image file.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `file` | `Blob \| File \| ReactNativeUploadFile` | Yes | FormData | Image |
| `businessId` | `string` | No | Header | Business scope |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |
| **Content-Type** | Multipart (`FormData`) |

### Request Payload

```json
{
  "businessId": "biz_abc123",
  "file": "<File | Blob | { uri, name, type }>"
}
```

Sent as `FormData` with field name `image`.

### Response Payload

```json
{
  "url": "https://cdn.neucron.io/images/img_logo456.png"
}
```

```typescript
const { data } = await sdk.blob.uploadImage({
  businessId: 'biz_abc123',
  file: imageFile,
});
```
