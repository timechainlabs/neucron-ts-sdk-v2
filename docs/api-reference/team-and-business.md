# Team & Business API

## Team Service — `sdk.team`

Manage team membership, invitations, and roles within a Neucron team.

---

### `acceptInvite(options)`

Accept a team invitation.

**HTTP:** `POST /team/accept`

### `getInvitesList()`

List all team invitations for the current user.

**HTTP:** `GET /team/invites`

### `createInvite(options)`

Send a team invitation to an email address.

**HTTP:** `POST /team/invites`

### Parameters — `CreateInvite`

| Field | Type | Description |
|-------|------|-------------|
| `email` | `string` | Invitee email |
| `teamId` | `string` | Target team ID |
| `role` | `string` | Role to assign |

### `getPendingInvites(options)`

List pending invitations for a team.

**HTTP:** `GET /team/invites/pending`

### `getTeamList()`

List all teams the user belongs to.

**HTTP:** `GET /team/list`

### `getMemberList(options)`

List members of a team.

**HTTP:** `GET /team/members`

### `updateMemberRole(options)`

Update a team member's role.

**HTTP:** `PUT /team/members/role`

### `removeMember(options)`

Remove a member from a team.

**HTTP:** `DELETE /team/remove`

### Example

```typescript
// Invite a colleague
await sdk.team.createInvite({
  email: 'colleague@example.com',
  teamId: 'team_abc',
  role: 'member',
});

// List team members
const members = await sdk.team.getMemberList({
  teamId: 'team_abc',
});
```

---

## Business Service — `sdk.business`

Manage business profiles and listings.

---

### `getBusinessDetails(options)`

Get details for a specific business.

**HTTP:** `GET /business`

### Parameters — `GetBusinessDetails`

| Field | Type | Required |
|-------|------|----------|
| `businessId` | `string` | Yes |

### `getBusinessList()`

List all businesses the authenticated user has access to.

**HTTP:** `GET /business/list`

### `updateBusinessDetails(options)`

Update business profile information.

**HTTP:** `PUT /business/update`

### Example

```typescript
const businesses = await sdk.business.getBusinessList();
const businessId = businesses.data[0].business_id;

const details = await sdk.business.getBusinessDetails({ businessId });
```
