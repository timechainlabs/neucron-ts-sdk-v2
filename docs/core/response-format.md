# Response Format

Every SDK method returns a typed `HttpResponse<T>` object.

## HttpResponse Interface

```typescript
interface HttpResponse<T> {
  data: T;           // Parsed and validated response body
  headers: Headers;  // Response headers as key-value pairs
  status: number;    // HTTP status code (e.g., 200, 201)
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

## Validation

Response `data` is validated with **Zod schemas** before being returned. If the API response does not match the expected shape, a `NeucronError` with `type: 'validation'` is thrown.

This protects your application from unexpected API changes and ensures type safety at runtime.

## Pagination

List endpoints commonly return paginated results with a `page_meta` object:

```typescript
interface PageMeta {
  page: number;
  limit: number;
  total: number;
  next_page: number;
  total_pages: number;
}
```

Example pattern:

```typescript
const result = await sdk.assets.getLedgerList({
  pageNumber: 1,
  pageSize: 20,
  walletID: 'wal_123',
});

// result.data.list      — array of items
// result.data.page_meta — pagination info
```

## HTTP Methods Used

| SDK Pattern | HTTP Method |
|-------------|-------------|
| `get*`, `list*`, `*List` | `GET` |
| `create*`, `signUp`, `login` | `POST` |
| `update*` | `PUT` or `PATCH` |
| `delete*` | `DELETE` |

Query parameters are passed via the URL; request bodies are sent as JSON unless uploading files (`FormData`).
