# Authentication

## What is authentication in Neucron?

Authentication establishes a **user session** for the Neucron platform. After a successful login or signup, the SDK holds a JWT that authorizes every subsequent wallet, asset, business, and commerce call.

Neucron accounts can be linked to one or more **platforms** (`NEUCRON`, `ASSETYZER`, `CERTIFICATE`, `TICKETING`). Signup requires choosing a platform; login returns the platforms associated with the account.

### Session lifecycle

1. **Sign up** or **login** → receive a token
2. SDK stores the token (`login` does this automatically)
3. Call any protected method — token is sent as `Authorization`
4. **Logout** clears the local token (client-side only)

Access via `sdk.auth`.

---

## `getToken`

Returns the current bearer token string (may be empty if not logged in).

| | |
| --- | --- |
| **Parameters** | None |
| **Headers** | None |
| **Query** | None |
| **Request** | None |
| **Response** | `string` |

### Request Payload

```json
null
```

```typescript
const token = sdk.auth.getToken();
```

---

## `setToken`

Manually set the session token (e.g. restore from your own storage).

| | |
| --- | --- |
| **Parameters** | `token: string` (required) |
| **Headers** | None |
| **Query** | None |
| **Request** | None |
| **Response** | `void` |

### Request Payload

```json
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

```typescript
sdk.auth.setToken('eyJhbGciOi...');
```

---

## `validate`

Throws `NeucronError` (`type: 'internal'`) if no token is set. Used internally by protected methods; you can call it to guard your own flows.

| | |
| --- | --- |
| **Parameters** | None |
| **Response** | `void` |

### Request Payload

```json
null
```

---

## `signUp`

Register a new Neucron user. Creates the account and returns an initial wallet and paymail.

### Parameters (request body)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | `string` (email) | Yes | Account email |
| `password` | `string` | Yes | Account password |
| `platform` | `'ASSETYZER' \| 'CERTIFICATE' \| 'TICKETING' \| 'NEUCRON'` | Yes | Product platform |
| `first_name` | `string` | No | First name |
| `last_name` | `string` | No | Last name |
| `country_code` | `string` | No | Phone country code |
| `phone_number` | `string` | No | Phone number |

| | |
| --- | --- |
| **Auth required** | No |
| **Headers** | None (public) |
| **Query** | None |

### Request Payload

```json
{
  "email": "ada@example.com",
  "password": "secure-password",
  "platform": "NEUCRON",
  "first_name": "Ada",
  "last_name": "Lovelace",
  "country_code": "+91",
  "phone_number": "9876543210"
}
```

### Response (`data`)

| Field | Type | Description |
| --- | --- | --- |
| `token` | `string` | Session JWT |
| `user_id` | `string` | New user ID |
| `wallet_id` | `string` | Default wallet created at signup |
| `paymail_id` | `string` | Default paymail |

```typescript
const { data } = await sdk.auth.signUp({
  email: 'ada@example.com',
  password: 'secure-password',
  platform: 'NEUCRON',
  first_name: 'Ada',
  last_name: 'Lovelace',
});

sdk.auth.setToken(data.token);
```

---

## `login`

Authenticate with email and password. **Automatically stores** the returned token on the client.

### Parameters (request body)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | `string` (email) | Yes | Account email |
| `password` | `string` | Yes | Account password |

| | |
| --- | --- |
| **Auth required** | No |
| **Headers** | None |
| **Query** | None |

### Request Payload

```json
{
  "email": "you@example.com",
  "password": "your-password"
}
```

### Response (`data`)

| Field | Type | Description |
| --- | --- | --- |
| `token` | `string` | Session JWT (also stored via `setToken`) |
| `platforms` | `Platform[]` | Platforms linked to the account |

```typescript
const { data } = await sdk.auth.login({
  email: 'you@example.com',
  password: 'your-password',
});
```

---

## `logout`

Clears the local session token on this SDK instance. Protected functions will fail until you log in or call `setToken` again.

| | |
| --- | --- |
| **Parameters** | None |
| **Response** | `void` |

### Request Payload

```json
null
```

```typescript
sdk.auth.logout();
```

---

## `emailExists`

Check whether an email is already registered.

### Parameters (query)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | `string` (email) | Yes | Email to check |

| | |
| --- | --- |
| **Auth required** | No |
| **Headers** | None |

### Request Payload

```json
{
  "email": "check@example.com"
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `exists` | `boolean` |

```typescript
const { data } = await sdk.auth.emailExists({ email: 'check@example.com' });
if (data.exists) { /* prompt login */ }
```

---

## `phoneExists`

Check whether a phone number is already registered.

### Parameters (query)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `countryCode` | `string` | Yes | Country dialing code |
| `phoneNumber` | `string` | Yes | Phone number |

| | |
| --- | --- |
| **Auth required** | No |

### Request Payload

```json
{
  "countryCode": "+91",
  "phoneNumber": "9876543210"
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `exists` | `boolean` |

```typescript
const { data } = await sdk.auth.phoneExists({
  countryCode: '+91',
  phoneNumber: '9876543210',
});
```

---

## `forgotPassword`

Start a password-reset flow for the given email.

### Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `email` | `string` (email) | Yes | Account email (**query**) |
| `X-Identifier` | `'ASSETYZER' \| 'NEUCRON'` | Yes | Client identifier (**header**) |

| | |
| --- | --- |
| **Auth required** | No |

### Request Payload

```json
{
  "email": "you@example.com",
  "X-Identifier": "NEUCRON"
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `message` | `string` |

```typescript
const { data } = await sdk.auth.forgotPassword({
  email: 'you@example.com',
  'X-Identifier': 'NEUCRON',
});
```

---

## `updatePassword`

Change the password for the authenticated user.

### Parameters (request body)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `new_password` | `string` | Yes | New password |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier` |
| **Query** | None |

### Request Payload

```json
{
  "new_password": "new-secure-password"
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `message` | `string` |

```typescript
await sdk.auth.updatePassword({ new_password: 'new-secure-password' });
```

---

## `userInfo`

Fetch the authenticated user's profile.

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

### Response (`data`) — selected fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | User ID |
| `email` | `string` | Email |
| `first_name` / `last_name` / `full_name` | `string` | Name fields |
| `phone_number` / `country_code` | `string` | Phone |
| `avatar` | `string` | Avatar URL |
| `currency` / `language` | `string` | Preferences |
| `address` / `city` / `country` / `pin_code` | `string` | Address |
| `is_email_verified` / `is_phone_verified` | `boolean` | Verification flags |
| `is_pan_verified` / `is_aadhar_verified` / `is_upi_verified` | `boolean` | KYC flags |
| `pan` / `aadhar_card` / `upi` | `string` | Identity fields |
| `platform` | `string[]` | Linked platforms |
| `dob` / `gender` | `string` | Profile demographics |

```typescript
const { data: user } = await sdk.auth.userInfo();
console.log(user.email, user.is_email_verified);
```

---

## `updateUser`

Update profile fields for the authenticated user.

### Parameters (request body)

All fields optional:

| Name | Type | Description |
| --- | --- | --- |
| `first_name`, `last_name`, `user_name` | `string` | Name |
| `email` | `string` | Email |
| `phone_number`, `country_code` | `string` | Phone |
| `avatar` | `string` | Avatar URL |
| `address`, `city`, `country`, `pin_code` | `string` | Address |
| `currency`, `language` | `string` | Preferences |
| `dob`, `gender` | `string` | Demographics |
| `pan`, `aadhar_card`, `upi` | `string` | Identity |

| | |
| --- | --- |
| **Auth required** | Yes |
| **Headers** | `Authorization`, `X-Identifier` |

### Request Payload

```json
{
  "first_name": "Ada",
  "last_name": "Lovelace",
  "user_name": "ada",
  "email": "ada@example.com",
  "phone_number": "9876543210",
  "country_code": "+91",
  "avatar": "https://cdn.example.com/avatar.png",
  "address": "221B Baker Street",
  "city": "London",
  "country": "UK",
  "pin_code": "NW16XE",
  "currency": "USD",
  "language": "en",
  "dob": "1815-12-10",
  "gender": "female",
  "pan": "ABCDE1234F",
  "aadhar_card": "1234-5678-9012",
  "upi": "ada@upi"
}
```

### Response (`data`)

| Field | Type |
| --- | --- |
| `message` | `string` |

```typescript
await sdk.auth.updateUser({
  first_name: 'Ada',
  city: 'London',
  currency: 'USD',
});
```
