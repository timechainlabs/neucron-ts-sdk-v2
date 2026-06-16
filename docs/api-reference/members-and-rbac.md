# Members & RBAC API

## Members Service — `sdk.members`

Manage business-level membership, invitations, and role assignments.

---

### `getMembers(options?)`

List members of a business.

**HTTP:** `GET /business/members`

### Parameters — `GetMembers`

| Field | Type |
|-------|------|
| `businessId` | `string` |
| `pageNumber` | `number` |
| `pageSize` | `number` |

---

### `createInvites(options)`

Invite users to a business.

**HTTP:** `POST /business/invites`

### Parameters — `CreateInvites`

| Field | Type | Description |
|-------|------|-------------|
| `businessId` | `string` | Target business |
| `invites` | `array` | List of email/role pairs |

---

### `getInvites(options?)`

List pending business invitations.

**HTTP:** `GET /business/invites`

---

### `assignRoles(options)`

Assign roles to a business member.

**HTTP:** `POST /business/role/assign`

### Parameters — `AssignRoles`

| Field | Type |
|-------|------|
| `businessId` | `string` |
| `memberId` | `string` |
| `roleIds` | `string[]` |

---

### `removeRoles(options)`

Remove roles from a business member.

**HTTP:** `POST /business/role/remove`

---

### `removeMember(options)`

Remove a member from a business.

**HTTP:** `DELETE /business/members` (via remove endpoint)

---

## RBAC Service — `sdk.rbac`

Manage roles and permissions within a business.

---

### `getPermissions(options?)`

List all available permissions.

**HTTP:** `GET /business/permissions`

---

### `getMemberRole(options?)`

Resolve the current user's role in a business.

**HTTP:** `GET /business/role/resolve`

---

### `getRoles(options?)`

List all roles defined for a business.

**HTTP:** `GET /business/roles`

---

### `createRole(options)`

Create a new role with specific permissions.

**HTTP:** `POST /business/roles`

### Parameters — `CreateRole`

| Field | Type |
|-------|------|
| `businessId` | `string` |
| `role` | `object` | Role name and permission IDs |

---

### `updateRole(options)`

Update an existing role.

**HTTP:** `PUT /business/roles`

---

### `deleteRole(options)`

Delete a role by ID.

**HTTP:** `DELETE /business/roles?roleID={id}`

### Example

```typescript
const businessId = 'biz_abc123';

// List permissions
const permissions = await sdk.rbac.getPermissions({ businessId });

// Create a custom role
await sdk.rbac.createRole({
  businessId,
  role: {
    name: 'Accountant',
    permissions: ['invoice:read', 'invoice:write'],
  },
});

// Assign role to member
await sdk.members.assignRoles({
  businessId,
  memberId: 'mem_xyz',
  roleIds: ['role_accountant'],
});
```
