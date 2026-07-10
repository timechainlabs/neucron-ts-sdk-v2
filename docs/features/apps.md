# Apps

## What are developer apps?

**Apps** on Neucron are developer applications registered under a business. They enable:

- Product integrations that act on behalf of a business
- **App secrets** for authenticated server-side SDK flows (data integrity, payout requests)
- Publishing to the Neucron **app store**

### App status

| Status | Meaning |
| --- | --- |
| `draft` | Work in progress |
| `published` | Live in the app store |
| `archived` | Retired |

Access via `sdk.apps`.

---

## `getApps`

List apps for a business.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `businessId` | `string` | No | Header |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "businessId": "biz_123"
}
```

### Response (`data`)

`AppsListResponse`.

```typescript
const { data: apps } = await sdk.apps.getApps({ businessId: 'biz_123' });
```

---

## `createApp`

Create a new developer app.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `appData` | `object` | Yes | Body | App metadata (name, description, icons, etc.) |
| `businessId` | `string` | No | Header | Business scope |

| | |
| --- | --- |
| **Auth required** | Yes |

### Request Payload

```json
{
  "businessId": "biz_123",
  "appData": {
    "app_name": "Checkout Bot",
    "description": "Payment automation for checkout",
    "type": "integration",
    "color": "#0F766E",
    "logo": "https://cdn.example.com/logo.png"
  }
}
```

### Response (`data`)

`CreateAppResponse` — includes the new app identity fields.

```typescript
const { data } = await sdk.apps.createApp({
  businessId: 'biz_123',
  appData: {
    app_name: 'Checkout Bot',
    description: 'Payment automation for checkout',
  },
});
```

---

## `getApp`

Fetch a single app by ID.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `appId` | `string` | Yes | Query (`appID`) |
| `businessId` | `string` | No | Header |

### Request Payload

```json
{
  "businessId": "biz_123",
  "appId": "app_1"
}
```

### Response (`data`)

`AppResponse`.

```typescript
const { data: app } = await sdk.apps.getApp({
  businessId: 'biz_123',
  appId: 'app_1',
});
```

---

## `getAppSecret`

Retrieve the app secret for server-side authentication.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `appId` | `string` | Yes | Query (`appID`) |
| `businessId` | `string` | No | Header |

### Request Payload

```json
{
  "businessId": "biz_123",
  "appId": "app_1"
}
```

### Response (`data`)

`AppSecretResponse` — contains the secret value.

{% hint style="warning" %}
Treat app secrets like passwords. Store them in a secrets manager; never expose them in client-side code.
{% endhint %}

```typescript
const { data } = await sdk.apps.getAppSecret({
  businessId: 'biz_123',
  appId: 'app_1',
});
```

---

## `updateApp`

Update app metadata.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `appId` | `string` | Yes | Query (`appID`) |
| `appData` | `object` | Yes | Body |
| `businessId` | `string` | No | Header |

### Request Payload

```json
{
  "businessId": "biz_123",
  "appId": "app_1",
  "appData": {
    "app_name": "Checkout Bot v2",
    "description": "Updated payment automation",
    "color": "#115E59"
  }
}
```

### Response (`data`)

`AppResponse`.

```typescript
await sdk.apps.updateApp({
  businessId: 'biz_123',
  appId: 'app_1',
  appData: {
    app_name: 'Checkout Bot v2',
    description: 'Updated payment automation',
  },
});
```

---

## `publishApp`

Publish an app to the app store.

### Parameters

| Name | Type | Required | Sent as |
| --- | --- | --- | --- |
| `appId` | `string` | Yes | Query (`appID`) |
| `businessId` | `string` | No | Header |

### Request Payload

```json
{
  "businessId": "biz_123",
  "appId": "app_1"
}
```

### Response (`data`)

`PublishAppResponse`.

```typescript
await sdk.apps.publishApp({
  businessId: 'biz_123',
  appId: 'app_1',
});
```
