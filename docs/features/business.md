# Business

## What is a business in Neucron?

A **business** is an organization entity on Neucron. Personal accounts operate on user-owned wallets; businesses add:

- Shared wallets and treasury
- Team collaboration
- Customers, vendors, invoices, bills, and payouts
- RBAC roles and permissions
- Developer apps and app secrets
- KYB (Know Your Business) profile details

Most commerce SDK methods accept `businessId`, which the SDK sends as the `X-Neucron-Business-ID` header.

Access via `sdk.business`.

---

## `getBusinessList`

List businesses associated with the authenticated user.

| | |
| --- | --- |
| **Parameters** | None |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier` |
| **Query** | None |

### Request Payload

```json
null
```

### Response Payload

```json
[
  {
    "business_id": "biz_abc123",
    "business_name": "Acme Labs",
    "business_type": "PRIVATE_LIMITED",
    "kyb_status": "APPROVED",
    "is_owner": true,
    "platform": ["NEUCRON"]
  },
  {
    "business_id": "biz_def456",
    "business_name": "Northwind Traders",
    "business_type": "LLP",
    "kyb_status": "PENDING",
    "is_owner": false,
    "platform": ["NEUCRON"]
  }
]
```

```typescript
const { data: businesses } = await sdk.business.getBusinessList();
```

---

## `getBusinessDetails`

Fetch KYB / profile details for a business.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | Yes | Query | Business ID |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier` |

### Request Payload

```json
{
  "businessId": "biz_abc123"
}
```

### Response Payload

```json
{
  "business_id": "biz_abc123",
  "business_name": "Acme Labs",
  "business_type": "PRIVATE_LIMITED",
  "business_model": "B2B",
  "business_category": "Technology",
  "business_sub_category": "Software",
  "business_description": "Digital asset infrastructure",
  "business_purpose": "Payments and tokenization",
  "pan_number": "ABCDE1234F",
  "cin_number": "U72900KA2020PTC123456",
  "gst_number": "29ABCDE1234F1Z5",
  "noGstin": false,
  "phoneNumber": "9876543210",
  "countryCode": "+91",
  "business_address": {
    "address": "12 MG Road",
    "city": "Bengaluru",
    "state": "KA",
    "country": "IN",
    "pin_code": "560001"
  },
  "gst_address": {
    "address": "12 MG Road",
    "city": "Bengaluru",
    "state": "KA",
    "country": "IN",
    "pin_code": "560001"
  },
  "sameAsGst": true,
  "business_url": "https://acme.example.com",
  "app_link": "https://app.acme.example.com",
  "business_logo": "https://cdn.neucron.io/images/logo.png",
  "kyb_status": "APPROVED",
  "is_owner": true,
  "platform": ["NEUCRON"],
  "platform_requests": [
    {
      "platform": "NEUCRON",
      "status": "APPROVED"
    }
  ]
}
```

```typescript
const { data } = await sdk.business.getBusinessDetails({
  businessId: 'biz_abc123',
});
```

---

## `updateBusinessDetails`

Patch business profile / KYB fields.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | Yes | Query (`businessID`) | Business to update |
| `data` | `object` | Yes | Body | Fields to patch |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier` |

### Request Payload

```json
{
  "businessId": "biz_abc123",
  "data": {
    "business_description": "Digital asset infrastructure for enterprises",
    "business_url": "https://acme.example.com",
    "phoneNumber": "9876543210",
    "countryCode": "+91",
    "business_address": {
      "address": "12 MG Road",
      "city": "Bengaluru",
      "state": "KA",
      "country": "IN",
      "pin_code": "560001"
    }
  }
}
```

### Response Payload

```json
{
  "business_id": "biz_abc123",
  "business_name": "Acme Labs",
  "business_description": "Digital asset infrastructure for enterprises",
  "business_url": "https://acme.example.com",
  "kyb_status": "APPROVED",
  "message": "Business updated successfully"
}
```

```typescript
await sdk.business.updateBusinessDetails({
  businessId: 'biz_abc123',
  data: {
    business_description: 'Digital asset infrastructure for enterprises',
    business_url: 'https://acme.example.com',
  },
});
```
