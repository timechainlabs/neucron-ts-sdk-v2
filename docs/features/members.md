# Members

## What are business members?

**Members** manage people attached to a **business** (distinct from team-scoped `sdk.team`). You can list members, send invites with role IDs, assign/remove RBAC roles, and remove members.

Access via `sdk.members`.

---

## `getMembers`

List business members (paginated).

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | No | Header | Business scope |
| `memberName` | `string` | No | Query | Name filter |
| `pageNumber` | `number` | No | Query | Page |
| `limit` | `number` | No | Query | Page size |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "businessId": "biz_abc123",
  "memberName": "Ada",
  "pageNumber": 1,
  "limit": 20
}
```

### Response Payload

```json
{
  "list": [
    {
      "business_id": "biz_abc123",
      "user_id": "usr_abc123",
      "email": "ada@example.com",
      "full_name": "Ada Lovelace",
      "is_owner": false,
      "status": "ACTIVE",
      "avatar": "https://cdn.example.com/avatar.png",
      "joined_at": "2026-06-01T09:00:00Z",
      "roles": [
        {
          "role_id": "role_editor",
          "role_name": "Editor",
          "permissions": ["invoice:read", "invoice:write"],
          "description": "Can manage invoices"
        }
      ]
    }
  ],
  "page_meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "next_page": null,
    "total_pages": 1
  }
}
```

```typescript
const { data } = await sdk.members.getMembers({
  businessId: 'biz_abc123',
  pageNumber: 1,
  limit: 20,
});
```

---

## `createInvites`

Invite users to a business with role IDs.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | No | Header | Business scope |
| `invites` | `Array<{ email, role_ids }>` | Yes | Body | Invite list |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "businessId": "biz_abc123",
  "invites": [
    {
      "email": "alice@example.com",
      "role_ids": ["role_editor", "role_viewer"]
    },
    {
      "email": "bob@example.com",
      "role_ids": ["role_viewer"]
    }
  ]
}
```

### Response Payload

```json
{
  "message": "Invites created successfully"
}
```

```typescript
await sdk.members.createInvites({
  businessId: 'biz_abc123',
  invites: [
    { email: 'alice@example.com', role_ids: ['role_editor'] },
  ],
});
```

---

## `getInvites`

List pending business invites.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | No | Header | Business scope |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

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
    "email": "alice@example.com",
    "role_ids": ["role_editor"],
    "status": "PENDING",
    "invited_at": "2026-07-01T08:00:00Z"
  }
]
```

```typescript
const { data } = await sdk.members.getInvites({ businessId: 'biz_abc123' });
```

---

## `assignRoles`

Assign RBAC roles to a member.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | No | Header | Business scope |
| `memberID` | `string` | Yes | Query | Member user ID |
| `roleIds` | `string[]` | Yes | Body | Roles to assign |
| `teamID` | `string` | No | Query | Optional team scope |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "businessId": "biz_abc123",
  "memberID": "usr_abc123",
  "roleIds": ["role_editor", "role_billing"],
  "teamID": "team_abc123"
}
```

### Response Payload

```json
{
  "message": "Roles assigned successfully"
}
```

```typescript
await sdk.members.assignRoles({
  businessId: 'biz_abc123',
  memberID: 'usr_abc123',
  roleIds: ['role_editor', 'role_billing'],
});
```

---

## `removeRoles`

Remove RBAC roles from a member.

### Parameters

Same shape as `assignRoles`.

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "businessId": "biz_abc123",
  "memberID": "usr_abc123",
  "roleIds": ["role_billing"]
}
```

### Response Payload

```json
{
  "message": "Roles removed successfully"
}
```

```typescript
await sdk.members.removeRoles({
  businessId: 'biz_abc123',
  memberID: 'usr_abc123',
  roleIds: ['role_billing'],
});
```

---

## `removeMember`

Remove a member from the business.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `businessId` | `string` | No | Header | Business scope |
| `memberID` | `string` | Yes | Query | Member user ID |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier`, optional business ID |

### Request Payload

```json
{
  "businessId": "biz_abc123",
  "memberID": "usr_abc123"
}
```

### Response Payload

```json
{
  "message": "Member removed successfully"
}
```

```typescript
await sdk.members.removeMember({
  businessId: 'biz_abc123',
  memberID: 'usr_abc123',
});
```
