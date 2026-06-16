# Authentication API

**Service:** `sdk.auth`

Manage user accounts, sessions, and profiles.

---

## `signUp(options)`

Register a new Neucron account. Creates a default wallet and Paymail.

**Auth required:** No

**HTTP:** `POST /auth/signup`

### Parameters — `SignUpBody`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | Yes | Valid email address |
| `password` | `string` | Yes | Account password |
| `platform` | `Platform` | Yes | `NEUCRON` \| `ASSETYZER` \| `CERTIFICATE` \| `TICKETING` |
| `first_name` | `string` | No | User's first name |
| `last_name` | `string` | No | User's last name |
| `country_code` | `string` | No | Phone country code |
| `phone_number` | `string` | No | Phone number |

### Response — `SignupResponse`

| Field | Type | Description |
|-------|------|-------------|
| `token` | `string` | Auth token (not auto-stored; call `login()` or `setToken()`) |
| `user_id` | `string` | New user ID |
| `wallet_id` | `string` | Default wallet ID |
| `paymail_id` | `string` | Default Paymail address |

### Example

```typescript
const result = await sdk.auth.signUp({
  email: 'newuser@example.com',
  password: 'SecurePass123!',
  first_name: 'Alex',
  last_name: 'Smith',
  platform: 'NEUCRON',
});
```

---

## `login(options)`

Authenticate and **automatically store** the session token.

**Auth required:** No

**HTTP:** `POST /auth/login`

### Parameters — `LoginBody`

| Field | Type | Required |
|-------|------|----------|
| `email` | `string` | Yes |
| `password` | `string` | Yes |

### Response — `LoginResponse`

| Field | Type | Description |
|-------|------|-------------|
| `token` | `string` | Bearer token for subsequent requests |
| `platforms` | `Platform[]` | Platforms the user has access to |

### Example

```typescript
const { data } = await sdk.auth.login({
  email: 'user@example.com',
  password: 'password',
});
console.log(sdk.auth.getToken()); // same as data.token
```

---

## `logout()`

Clear the locally stored auth token.

**Auth required:** Yes (token must exist)

---

## `emailExists(options)`

Check whether an email is already registered.

**HTTP:** `POST /auth/email/exists?email={email}`

### Parameters

| Field | Type | Required |
|-------|------|----------|
| `email` | `string` | Yes |

### Response

```typescript
{ exists: boolean }
```

---

## `phoneExists(options)`

Check whether a phone number is already registered.

**HTTP:** `POST /auth/phone/exists`

### Parameters

| Field | Type | Required |
|-------|------|----------|
| `countryCode` | `string` | Yes |
| `phoneNumber` | `string` | Yes |

---

## `forgotPassword(options)`

Initiate a password reset email.

**HTTP:** `POST /auth/password/forgot`

### Parameters — `ForgotPasswordBody`

| Field | Type | Required |
|-------|------|----------|
| `email` | `string` | Yes |
| `X-Identifier` | `'NEUCRON' \| 'ASSETYZER'` | Yes |

---

## `updatePassword(options)`

Change the authenticated user's password.

**HTTP:** `PUT /auth/user/password`

### Parameters

| Field | Type | Required |
|-------|------|----------|
| `new_password` | `string` | Yes |

---

## `userInfo()`

Get the current authenticated user's profile.

**HTTP:** `GET /auth/user/info`

---

## `updateUser(options)`

Update the authenticated user's profile fields.

**HTTP:** `PUT /auth/user/update`

---

## Token Utilities

```typescript
// Read current token
const token = sdk.auth.getToken();

// Set token manually (e.g., from session storage)
sdk.auth.setToken('eyJhbG...');

// Internal guard — throws NeucronError if no token
sdk.auth.validate();
```
