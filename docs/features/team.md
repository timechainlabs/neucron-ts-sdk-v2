# Team

## What is a team in Neucron?

A **team** is a collaboration unit under a business (or Assetyzer context). Teams support invites, roles (`EDITOR`, `OWNER`, `VIEWER`, `ADMINISTRATOR`), and member management.

Most methods require the `X-Neucron-Team-ID` header, passed as `'X-Neucron-Team-ID'` in the SDK options.

Access via `sdk.team`.

---

## `getTeamList`

List teams for the authenticated user.

| | |
| --- | --- |
| **Parameters** | None |
| **Auth required** | Yes |
| **Headers** | `Authorization` |
| **Request Payload** | None |

### Response Payload

```json
[
  {
    "team_id": "team_abc123",
    "team_name": "Product",
    "business_id": "biz_abc123",
    "description": "Product engineering team",
    "is_owner": true,
    "owner_id": "usr_abc123",
    "role": "OWNER"
  }
]
```

```typescript
const { data } = await sdk.team.getTeamList();
```

---

## `getInvitesList`

List team invites for the authenticated user.

| | |
| --- | --- |
| **Parameters** | None |
| **Auth required** | Yes |
| **Headers** | `Authorization` |
| **Request Payload** | None |

### Response Payload

```json
[
  {
    "user_id": "usr_abc123",
    "team_id": "team_xyz789",
    "role": "EDITOR"
  }
]
```

```typescript
const { data } = await sdk.team.getInvitesList();
```

---

## `acceptInvite`

Accept a pending team invite.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `X-Neucron-Team-ID` | `string` | Yes | Header | Team to join |

| | |
| --- | --- |
| **Auth required** | Yes |

### Request Payload

```json
{
  "X-Neucron-Team-ID": "team_xyz789"
}
```

### Response Payload

```json
{
  "message": "Invite accepted"
}
```

```typescript
await sdk.team.acceptInvite({
  'X-Neucron-Team-ID': 'team_xyz789',
});
```

---

## `createInvite`

Invite users to a team by email.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `X-Neucron-Team-ID` | `string` | Yes | Header | Target team |
| `X-Identifier` | `'ASSETYZER' \| 'NEUCRON'` | Yes | Header | Platform |
| `role` | `'EDITOR' \| 'OWNER' \| 'VIEWER' \| 'ADMINISTRATOR'` | Yes | Query | Invite role |
| `emails` | `string[]` | Yes | Body | Invitee emails |

| | |
| --- | --- |
| **Auth required** | Yes |

### Request Payload

```json
{
  "X-Neucron-Team-ID": "team_abc123",
  "X-Identifier": "NEUCRON",
  "role": "EDITOR",
  "emails": ["alice@example.com", "bob@example.com"]
}
```

### Response Payload

```json
{
  "message": "Invites sent successfully"
}
```

```typescript
await sdk.team.createInvite({
  'X-Neucron-Team-ID': 'team_abc123',
  'X-Identifier': 'NEUCRON',
  role: 'EDITOR',
  emails: ['alice@example.com', 'bob@example.com'],
});
```

---

## `getPendingInvites`

List pending invites for a team.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `X-Neucron-Team-ID` | `string` | Yes | Header | Team ID |

| | |
| --- | --- |
| **Auth required** | Yes |

### Request Payload

```json
{
  "X-Neucron-Team-ID": "team_abc123"
}
```

### Response Payload

```json
[
  {
    "email": "alice@example.com",
    "role": "EDITOR",
    "user_name": "Alice"
  }
]
```

```typescript
const { data } = await sdk.team.getPendingInvites({
  'X-Neucron-Team-ID': 'team_abc123',
});
```

---

## `getMemberList`

Paginated list of team members.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `X-Neucron-Team-ID` | `string` | Yes | Header | Team ID |
| `memberName` | `string` | No | Query | Name filter |
| `role` | `string` | No | Query | Role filter |
| `pageNumber` | `number` | No | Query | Page (default 1) |
| `limit` | `number` | No | Query | Page size (default 20) |

| | |
| --- | --- |
| **Auth required** | Yes |

### Request Payload

```json
{
  "X-Neucron-Team-ID": "team_abc123",
  "memberName": "Ada",
  "role": "EDITOR",
  "pageNumber": 1,
  "limit": 20
}
```

### Response Payload

```json
{
  "list": [
    {
      "user_id": "usr_abc123",
      "email": "ada@example.com",
      "full_name": "Ada Lovelace",
      "role": "EDITOR",
      "team_id": "team_abc123",
      "is_owner": false,
      "joined_at": "2026-06-01T09:00:00Z"
    }
  ],
  "page_meta": {
    "page": 1,
    "limit": 20,
    "next_page": null,
    "total_pages": 1
  }
}
```

```typescript
const { data } = await sdk.team.getMemberList({
  'X-Neucron-Team-ID': 'team_abc123',
  pageNumber: 1,
  limit: 20,
});
```

---

## `updateMemberRole`

Change a team member's role.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `X-Neucron-Team-ID` | `string` | Yes | Header | Team ID |
| `memberID` | `string` | Yes | Query | Member user ID |
| `role` | `string` | Yes | Query | New role |

| | |
| --- | --- |
| **Auth required** | Yes |

### Request Payload

```json
{
  "X-Neucron-Team-ID": "team_abc123",
  "memberID": "usr_abc123",
  "role": "ADMINISTRATOR"
}
```

### Response Payload

```json
{
  "message": "Member role updated"
}
```

```typescript
await sdk.team.updateMemberRole({
  'X-Neucron-Team-ID': 'team_abc123',
  memberID: 'usr_abc123',
  role: 'ADMINISTRATOR',
});
```

---

## `removeMember`

Remove a member from a team.

### Parameters

| Name | Type | Required | Sent as | Description |
| --- | --- | --- | --- | --- |
| `X-Neucron-Team-ID` | `string` | Yes | Header | Team ID |
| `memberID` | `string` | Yes | Query | Member user ID |

| | |
| --- | --- |
| **Auth required** | Yes |

### Request Payload

```json
{
  "X-Neucron-Team-ID": "team_abc123",
  "memberID": "usr_abc123"
}
```

### Response Payload

```json
{
  "message": "Member removed"
}
```

```typescript
await sdk.team.removeMember({
  'X-Neucron-Team-ID': 'team_abc123',
  memberID: 'usr_abc123',
});
```
