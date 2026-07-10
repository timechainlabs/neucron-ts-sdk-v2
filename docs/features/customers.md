# Customers

## What are customers in Neucron?

**Customers** are the people or organizations you bill. They sit at the center of Neucron’s receivables workflow:

1. Create a customer (individual or business)
2. Issue invoices against `customer_id`
3. Optionally invite the customer to a portal
4. Track outstanding balances via revenue helpers on the invoice service

### Customer types

| Type | Description |
| --- | --- |
| `INDIVIDUAL` | Person — uses `individual_details` |
| `BUSINESS` | Company — uses `business_details` (company name, display name, email, phone) |

Customer records can also store address details, contact persons, payment details, tax payer info, and portal access flags.

Access via `sdk.customer`. Most methods require `businessId`.

---

## `getCustomers`

Paginated list of customers for a business.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | Yes | Header / context | Business |
| `page` | `number` (≥ 1) | No | Query | Page |
| `size` | `number` (≥ 1) | No | Query | Page size |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, `X-Neucron-Business-ID` |

### Request Payload

```json
{
  "businessId": "biz_123",
  "page": 1,
  "size": 20
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `customers` | Customer objects[] |
| `page_meta` | Pagination meta |

Customer object fields include `customer_id`, `customer_type`, `business_details`, `individual_details`, `address_details`, `contact_persons`, `payment_details`, `tax_payer_info`, `status`, `total_invoices`, `total_invoiced`, `total_outstanding`.

```typescript
const { data } = await sdk.customer.getCustomers({
  businessId: 'biz_123',
  page: 1,
  size: 20,
});
```

---

## `getCustomer`

Fetch a single customer.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `businessId` | `string` | Yes | Header |
| `customerId` | `string` | Yes | Query (`customerID`) |

### Request Payload

```json
{
  "businessId": "biz_123",
  "customerId": "cust_1"
}
```

### Response (`data`)

`CustomerResponse`.

```typescript
const { data } = await sdk.customer.getCustomer({
  businessId: 'biz_123',
  customerId: 'cust_1',
});
```

---

## `createCustomer`

Create a customer.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | Yes | Header | Business |
| `customerData` | Customer object | Yes | Body | Profile payload |

### Request Payload

```json
{
  "businessId": "biz_123",
  "customerData": {
    "customer_type": "BUSINESS",
    "business_details": {
      "company_name": "Acme Corp",
      "display_name": "Acme",
      "email": "billing@acme.com",
      "phone_number": "+1-555-0100"
    },
    "address_details": {
      "address": "100 Market St",
      "city": "San Francisco",
      "state": "CA",
      "country": "US",
      "pin_code": "94105"
    },
    "contact_persons": [
      {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@acme.com",
        "phone_number": "+1-555-0101",
        "designation": "AP Manager",
        "department": "Finance"
      }
    ],
    "payment_details": {
      "currency": "USD",
      "payment_terms": "Net 30"
    },
    "tax_payer_info": {
      "gst_treatment": "REGISTERED",
      "pan": "ABCDE1234F",
      "vat_gstin": "22AAAAA0000A1Z5",
      "tds": "0"
    },
    "allow_portal_access": true
  }
}
```

### Response (`data`)

`CustomerResponse`.

```typescript
const { data } = await sdk.customer.createCustomer({
  businessId: 'biz_123',
  customerData: {
    customer_type: 'BUSINESS',
    business_details: {
      company_name: 'Acme Corp',
      display_name: 'Acme',
      email: 'billing@acme.com',
    },
    allow_portal_access: true,
  },
});
```

---

## `updateCustomer`

Update an existing customer.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `businessId` | `string` | Yes | Header |
| `customerId` | `string` | Yes | Query |
| `customerData` | Customer object | Yes | Body |

### Request Payload

```json
{
  "businessId": "biz_123",
  "customerId": "cust_1",
  "customerData": {
    "business_details": {
      "phone_number": "+1-555-0100",
      "display_name": "Acme Inc"
    },
    "allow_portal_access": true
  }
}
```

### Response (`data`)

`CustomerResponse`.

```typescript
await sdk.customer.updateCustomer({
  businessId: 'biz_123',
  customerId: 'cust_1',
  customerData: {
    business_details: { phone_number: '+1-555-0100' },
  },
});
```

---

## `deleteCustomer`

Delete a customer.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `businessId` | `string` | Yes | Header |
| `customerId` | `string` | Yes | Query |

### Request Payload

```json
{
  "businessId": "biz_123",
  "customerId": "cust_1"
}
```

### Response (`data`)

`DeleteCustomerResponse` (dynamic acknowledgement).

```typescript
await sdk.customer.deleteCustomer({
  businessId: 'biz_123',
  customerId: 'cust_1',
});
```

---

## `inviteCustomer`

Send a portal invite to a customer.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `businessId` | `string` | Yes | Header |
| `customerId` | `string` | Yes | Query |

### Request Payload

```json
{
  "businessId": "biz_123",
  "customerId": "cust_1"
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `message` | `string` |

```typescript
await sdk.customer.inviteCustomer({
  businessId: 'biz_123',
  customerId: 'cust_1',
});
```
