# Business

## What is a business in Neucron?

A **business** is an organization entity on Neucron. Personal accounts operate on user-owned wallets; businesses add:

- Shared wallets and treasury
- Business collaboration
- Customers, vendors, invoices, bills, and payouts
- RBAC roles and permissions
- Developer apps and app secrets
- KYB (Know Your Business) profile details

Most commerce SDK methods accept `businessId`, which the SDK sends as the `X-Neucron-Business-ID` header.

### Typical business lifecycle

```
createBusiness → getBusinessList → getBusinessDetails → updateBusinessDetails
```

1. **Create** a business with KYB fields (`createBusiness`) — returns `business_id`
2. **List** businesses for the authenticated user
3. **Read** full KYB / profile details
4. **Update** profile fields as onboarding progresses

Access via `sdk.business`.

---

## `createBusiness`

Register a new business entity with KYB (Know Your Business) details. Returns a `business_id` used for all subsequent business-scoped SDK calls.

### Parameters (request body)

| Name                    | Type             | Required | Description                                        |
| ----------------------- | ---------------- | -------- | -------------------------------------------------- |
| `business_name`         | `string`         | Yes      | Legal / registered business name                   |
| `display_name`          | `string`         | No       | Public display name                                |
| `business_type`         | `string`         | No       | e.g. `private`, `public`                           |
| `business_model`        | `string`         | No       | e.g. `b2b`, `b2c`, `both`                          |
| `business_sub_model`    | `string`         | No       | Sub-model / niche                                  |
| `business_category`     | `string`         | No       | Industry category                                  |
| `business_sub_category` | `string`         | No       | Industry sub-category                              |
| `business_description`  | `string`         | No       | Short description                                  |
| `business_purpose`      | `string`         | No       | Business purpose                                   |
| `business_email`        | `string` (email) | No       | Business contact email                             |
| `jurisdiction`          | `string`         | No       | Registration jurisdiction (e.g. `IN`)              |
| `gst_number`            | `string`         | No       | GST / VAT number                                   |
| `cin_number`            | `string`         | No       | Corporate identification number                    |
| `pan_number`            | `string`         | No       | PAN / tax ID                                       |
| `phoneNumber`           | `string`         | No       | Contact phone                                      |
| `countryCode`           | `string`         | No       | Phone country code                                 |
| `noGstin`               | `boolean`        | No       | Whether GSTIN is not applicable                    |
| `business_address`      | `object`         | No       | `{ address?, city?, state?, country?, pin_code? }` |
| `gst_address`           | `object`         | No       | GST address (same shape)                           |
| `sameAsGst`             | `boolean`        | No       | Business address same as GST address               |
| `business_url`          | `string`         | No       | Website URL                                        |
| `app_link`              | `string`         | No       | App / portal link                                  |
| `business_logo`         | `string`         | No       | Logo URL                                           |

{% hint style="info" %}
Extra KYB fields beyond this table are accepted (schema uses passthrough) so you can send the full onboarding payload.
{% endhint %}

|                   |                                 |
| ----------------- | ------------------------------- |
| **Auth required** | Yes                             |
| **Headers**       | `Authorization`, `X-Identifier` |
| **Query**         | None                            |

### Request Payload

```json
{
    "business_name": "Acme Corp",
    "display_name": "Acme",
    "business_type": "private",
    "business_model": "b2b",
    "business_sub_model": "saas",
    "business_category": "Technology",
    "business_sub_category": "Software",
    "business_description": "Digital asset infrastructure",
    "business_purpose": "Payments and tokenization",
    "business_email": "billing@acme.com",
    "jurisdiction": "IN",
    "gst_number": "29ABCDE1234F1Z5",
    "cin_number": "U72900KA2020PTC123456",
    "pan_number": "ABCDE1234F",
    "phoneNumber": "9876543210",
    "countryCode": "+91",
    "noGstin": false,
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
    "business_logo": "https://cdn.example.com/logo.png"
}
```

### Response Payload

```json
{
    "business_id": "biz_abc123",
    "data": {
        "business_id": "biz_abc123"
    },
    "message": "Business created successfully"
}
```

```typescript
const { data } = await sdk.business.createBusiness({
    business_name: 'Acme Corp',
    display_name: 'Acme',
    business_type: 'private',
    business_model: 'b2b',
    business_email: 'billing@acme.com',
    jurisdiction: 'IN',
    pan_number: 'ABCDE1234F',
    business_address: {
        address: '12 MG Road',
        city: 'Bengaluru',
        state: 'KA',
        country: 'IN',
        pin_code: '560001',
    },
});

const businessId = data.business_id ?? data.data?.business_id;
```

---

## `getBusinessList`

List businesses associated with the authenticated user.

|                   |                                 |
| ----------------- | ------------------------------- |
| **Parameters**    | None                            |
| **Auth required** | Yes                             |
| **Headers**       | `Authorization`, `X-Identifier` |
| **Query**         | None                            |

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

| Name         | Type     | Required | Sent as | Description |
| ------------ | -------- | -------- | ------- | ----------- |
| `businessId` | `string` | Yes      | Query   | Business ID |

|                   |                                 |
| ----------------- | ------------------------------- |
| **Auth required** | Yes                             |
| **Headers**       | `Authorization`, `X-Identifier` |

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

| Name         | Type     | Required | Sent as              | Description        |
| ------------ | -------- | -------- | -------------------- | ------------------ |
| `businessId` | `string` | Yes      | Query (`businessID`) | Business to update |
| `data`       | `object` | Yes      | Body                 | Fields to patch    |

|                   |                                 |
| ----------------- | ------------------------------- |
| **Auth required** | Yes                             |
| **Headers**       | `Authorization`, `X-Identifier` |

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
