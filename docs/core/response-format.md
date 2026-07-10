# Response Format

Every SDK method that talks to Neucron returns a typed `HttpResponse<T>` object.

## HttpResponse Interface

```typescript
interface HttpResponse<T> {
  data: T;                              // Parsed and validated response body
  headers: Record<string, string>;      // Response headers
  status: number;                       // Status code (e.g. 200, 201)
}
```

## Usage

```typescript
const response = await sdk.auth.login({
  email: 'user@example.com',
  password: 'password',
});

console.log(response.status);  // 200
console.log(response.data);    // { token: '...', platforms: ['NEUCRON'] }
console.log(response.headers); // { 'content-type': 'application/json', ... }
```

Always read business data from `response.data`. The outer wrapper also exposes `status` and `headers` when you need them.

## Validation

Response `data` is validated with **Zod schemas** before being returned. If the payload does not match the expected shape, a `NeucronError` with `type: 'validation'` is thrown.

This protects your application from unexpected payload changes and ensures type safety at runtime.

## Pagination

List methods commonly return paginated results with a `page_meta` object:

```typescript
interface PageMeta {
  page: number;
  limit: number;
  total: number;
  next_page?: number;
  total_pages: number;
}
```

Example:

```typescript
const result = await sdk.wallet.getTransactions({
  walletID: 'wal_123',
  page: 1,
  limit: 20,
});

// result.data.list      — array of items
// result.data.page_meta — pagination info
```

## Query vs Parameters vs Request Body

Throughout the Features section, each method documents:

| Section | Meaning |
|---------|---------|
| **Headers** | Auth and context headers the SDK sends |
| **Query** | Fields sent as query parameters |
| **Parameters / Request** | Fields you pass into the SDK method (and any request body shape) |
| **Response** | Type and key fields inside `response.data` |

Some methods send options as query only (no body). Others send a JSON body, multipart form data (file uploads), or plain text (text inscription).
