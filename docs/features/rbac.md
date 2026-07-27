# RBAC

## What is RBAC in Neucron?

**RBAC** (role-based access control) defines named roles with permission strings for a business. Use it to grant fine-grained access to invoices, wallets, payouts, and other modules.

Access via `sdk.rbac`.

---

## `getPermissions`

List available permission strings for a business.

### Parameters

| Name         | Type     | Required | Sent as | Description    |
| ------------ | -------- | -------- | ------- | -------------- |
| `businessId` | `string` | No       | Header  | Business scope |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
["invoice:read", "invoice:write", "wallet:read", "payout:write", "member:manage"]
```

```typescript
const { data } = await sdk.rbac.getPermissions({ businessId: 'biz_abc123' });
```

---

## `getMemberRole`

Get roles assigned to the authenticated member in a business.

### Parameters

| Name         | Type     | Required | Sent as | Description    |
| ------------ | -------- | -------- | ------- | -------------- |
| `businessId` | `string` | No       | Header  | Business scope |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
[
    {
        "role_id": "role_editor",
        "role_name": "Editor",
        "description": "Can manage invoices",
        "permissions": ["invoice:read", "invoice:write"],
        "business_id": "biz_abc123"
    }
]
```

```typescript
const { data } = await sdk.rbac.getMemberRole({ businessId: 'biz_abc123' });
```

---

## `getRoles`

List all roles defined for a business.

### Parameters

| Name         | Type     | Required | Sent as | Description    |
| ------------ | -------- | -------- | ------- | -------------- |
| `businessId` | `string` | No       | Header  | Business scope |

|                   |                                                       |
| ----------------- | ----------------------------------------------------- |
| **Auth required** | Yes                                                   |
| **Headers**       | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
    "businessId": "biz_abc123"
}
```

### Response Payload

```json
[
    {
        "role_id": "role_editor",
        "role_name": "Editor",
        "description": "Can manage invoices",
        "permissions": ["invoice:read", "invoice:write"],
        "business_id": "biz_abc123"
    },
    {
        "role_id": "role_viewer",
        "role_name": "Viewer",
        "description": "Read-only access",
        "permissions": ["invoice:read", "wallet:read"],
        "business_id": "biz_abc123"
    }
]
```

```typescript
const { data } = await sdk.rbac.getRoles({ businessId: 'biz_abc123' });
```

---

## `createRole`

Create a new role.

### Parameters

| Name         | Type     | Required | Sent as | Description     |
| ------------ | -------- | -------- | ------- | --------------- |
| `businessId` | `string` | Yes      | Header  | Business scope  |
| `role`       | `object` | Yes      | Body    | Role definition |

`role` fields: `role_name`, `description`, `permissions` (string[]).

|                   |                                              |
| ----------------- | -------------------------------------------- |
| **Auth required** | Yes                                          |
| **Headers**       | `Authorization`, `X-Identifier`, business ID |

### Request Payload

```json
{
    "businessId": "biz_abc123",
    "role": {
        "role_name": "Billing Admin",
        "description": "Manage payouts and billing",
        "permissions": ["payout:write", "billing:read", "billing:write"]
    }
}
```

### Response Payload

```json
{
    "message": "Role created successfully"
}
```

```typescript
await sdk.rbac.createRole({
    businessId: 'biz_abc123',
    role: {
        role_name: 'Billing Admin',
        description: 'Manage payouts and billing',
        permissions: ['payout:write', 'billing:read', 'billing:write'],
    },
});
```

---

## `updateRole`

Update an existing role.

### Parameters

| Name         | Type     | Required | Sent as | Description                                                         |
| ------------ | -------- | -------- | ------- | ------------------------------------------------------------------- |
| `businessId` | `string` | Yes      | Header  | Business scope                                                      |
| `roleId`     | `string` | Yes      | —       | Role ID (also included in body)                                     |
| `role`       | `object` | Yes      | Body    | Updated role (`role_id`, `role_name`, `description`, `permissions`) |

|                   |                                              |
| ----------------- | -------------------------------------------- |
| **Auth required** | Yes                                          |
| **Headers**       | `Authorization`, `X-Identifier`, business ID |

### Request Payload

```json
{
    "businessId": "biz_abc123",
    "roleId": "role_billing",
    "role": {
        "role_id": "role_billing",
        "role_name": "Billing Admin",
        "description": "Manage payouts, billing, and invoices",
        "permissions": ["payout:write", "billing:read", "billing:write", "invoice:read"]
    }
}
```

### Response Payload

```json
{
    "message": "Role updated successfully"
}
```

```typescript
await sdk.rbac.updateRole({
    businessId: 'biz_abc123',
    roleId: 'role_billing',
    role: {
        role_id: 'role_billing',
        role_name: 'Billing Admin',
        description: 'Manage payouts, billing, and invoices',
        permissions: ['payout:write', 'billing:read', 'billing:write', 'invoice:read'],
    },
});
```

---

## `deleteRole`

Delete a role.

### Parameters

| Name         | Type     | Required | Sent as          | Description    |
| ------------ | -------- | -------- | ---------------- | -------------- |
| `businessId` | `string` | Yes      | Header           | Business scope |
| `roleId`     | `string` | Yes      | Query (`roleID`) | Role to delete |

|                   |                                              |
| ----------------- | -------------------------------------------- |
| **Auth required** | Yes                                          |
| **Headers**       | `Authorization`, `X-Identifier`, business ID |

### Request Payload

```json
{
    "businessId": "biz_abc123",
    "roleId": "role_billing"
}
```

### Response Payload

```json
{
    "message": "Role deleted successfully"
}
```

```typescript
await sdk.rbac.deleteRole({
    businessId: 'biz_abc123',
    roleId: 'role_billing',
});
```
