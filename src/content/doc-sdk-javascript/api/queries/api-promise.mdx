---
sidebar_position: 12
sidebar_label: ApiPromise
title: JavaScript | SDK | API Reference | ApiPromise
description: ApiPromise provides methods for executing user-defined API calls.
---

import Label from "@components/shared/Label.astro";

# `ApiPromise<Req, Res, V, J>` {#apipromise}

The `ApiPromise` class provides an interface for executing user-defined API endpoint calls. It extends `Promise`, allowing you to `await` it directly or configure the response handling.

**Returned by:** Methods on [`SurrealApi`](/docs/2.x/sdk/javascript/api/core/surreal-api)

**Source:** [query/api.ts](https://github.com/surrealdb/surrealdb.js/blob/main/packages/sdk/src/query/api.ts)

## Type Parameters

- `Req` - The request body type
- `Res` - The response body type
- `V` - Boolean for value-only response (default: `false`)
- `J` - Boolean indicating if result is JSON (default: `false`)

## Configuration Methods

### `.json()` {#json}

Configure the query to return the result as a JSON string.

```ts title="Method Syntax"
apiPromise.json()
```

#### Returns
`ApiPromise<Req, Res, V, true>` - Promise returning JSON string

#### Example

```ts
const jsonString = await db.api().get('/users').json();
console.log(typeof jsonString); // 'string'
```

---

### `.header()` {#header}

Append a header to the API request.

```ts title="Method Syntax"
apiPromise.header(name, value)
```

#### Parameters
<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>name</code> <Label label="required" /></td>
            <td><code>string</code></td>
            <td>The header name.</td>
        </tr>
        <tr>
            <td><code>value</code> <Label label="required" /></td>
            <td><code>string</code></td>
            <td>The header value.</td>
        </tr>
    </tbody>
</table>

#### Returns
`ApiPromise<Req, Res, V, J>` - Chainable promise

#### Example

```ts
const result = await db.api().get('/users')
    .header('X-Custom-Header', 'value')
    .header('Authorization', 'Bearer token');
```

---

### `.value()` {#value}

Return only the response body value, without the wrapper object.

```ts title="Method Syntax"
apiPromise.value()
```

#### Returns
`ApiPromise<Req, Res, true, J>` - Promise returning only the value

#### Examples

```ts title="Without .value()"
const response = await db.api().get('/users');
console.log(response.body); // The actual data
console.log(response.status); // HTTP status
console.log(response.headers); // Response headers
```

```ts title="With .value()"
const users = await db.api().get('/users').value();
console.log(users); // Direct access to user array
```

## Response Structure

### Default Response (without `.value()`)

```ts
interface ApiResponse<T> {
    body?: T;
    headers?: Record<string, string>;
    status?: number;
}
```

### Value Response (with `.value()`)

```ts
// Returns Res directly instead of ApiResponse<Res>
```

## Complete Examples

### Basic API Calls

```ts
import { Surreal } from 'surrealdb';

const db = new Surreal();
await db.connect('ws://localhost:8000');

const api = db.api();

// GET request
const users = await api.get('/users').value();

// POST request
const newUser = await api.post('/users', {
    name: 'John Doe',
    email: 'john@example.com'
}).value();

// PUT request
const updated = await api.put('/users/123', {
    name: 'John Smith'
}).value();

// DELETE request
await api.delete('/users/123').value();
```

### With Full Response

```ts
const response = await db.api().get('/users');

console.log('Status:', response.status);
console.log('Headers:', response.headers);
console.log('Body:', response.body);

if (response.status === 200) {
    console.log('Success:', response.body);
}
```

### Custom Headers

```ts
const result = await db.api().post('/protected', data)
    .header('Authorization', `Bearer ${token}`)
    .header('X-API-Version', '2.0')
    .value();
```

### Type-Safe API Calls

```ts
interface User {
    id: string;
    name: string;
    email: string;
}

interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

type ApiPaths = {
    "/users": {
        get: [void, User[]];
        post: [CreateUserRequest, User];
    };
};

const api = db.api<ApiPaths>();

// Type-safe calls
const users: User[] = await api.get('/users').value();
const newUser: User = await api.post('/users', {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'secure'
}).value();
```

### Error Handling

```ts
try {
    const user = await db.api().get('/users/999').value();
} catch (error) {
    if (error instanceof UnsuccessfulApiError) {
        console.error('API error:', error.response);
        console.error('Status:', error.response.status);
        console.error('Message:', error.response.body);
    }
}
```

### Pagination

```ts
async function fetchPage(page: number, pageSize: number) {
    return db.api().get(`/users?page=${page}&limit=${pageSize}`).value();
}

const page1 = await fetchPage(1, 20);
const page2 = await fetchPage(2, 20);
```

### File Upload

```ts
const formData = new FormData();
formData.append('file', fileBlob);
formData.append('name', 'profile-picture');

const result = await db.api().post('/upload', formData)
    .header('Content-Type', 'multipart/form-data')
    .value();
```

### Authentication Flow

```ts
// Login
const loginResult = await db.api().post('/auth/login', {
    email: 'user@example.com',
    password: 'password123'
}).value();

const { access_token } = loginResult;

// Use token for subsequent requests
const api = db.api();
api.header('Authorization', `Bearer ${access_token}`);

const profile = await api.get('/profile').value();
const orders = await api.get('/orders').value();
```

### Conditional Requests

```ts
const api = db.api();

// Check if resource exists
const checkResponse = await api.get('/users/123');

if (checkResponse.status === 404) {
    // Create if doesn't exist
    await api.post('/users/123', userData).value();
} else {
    // Update if exists
    await api.put('/users/123', userData).value();
}
```

### Batch Operations

```ts
const api = db.api();

const promises = userIds.map(id =>
    api.get(`/users/${id}`).value()
);

const users = await Promise.all(promises);
console.log(`Fetched ${users.length} users`);
```

### Response Transformation

```ts
const response = await db.api().get('/users');

const transformed = {
    data: response.body,
    timestamp: new Date(),
    status: response.status,
    cached: response.headers?.['X-Cache'] === 'HIT'
};
```

### Retry Pattern

```ts
async function apiWithRetry(
    apiCall: () => Promise<any>,
    maxRetries = 3
) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await apiCall();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
}

const result = await apiWithRetry(() =>
    db.api().get('/unstable-endpoint').value()
);
```

### Query Parameters

```ts
// Build query params manually
const params = new URLSearchParams({
    filter: 'active',
    sort: 'created_at',
    order: 'desc'
});

const users = await db.api().get(`/users?${params}`).value();
```

### WebSocket vs API Endpoints

```ts
// Both use the same connection
const db = new Surreal();
await db.connect('ws://localhost:8000');

// Regular query (via WebSocket/HTTP RPC)
const users1 = await db.select(new Table('users'));

// API endpoint (via defined API routes)
const users2 = await db.api().get('/users').value();

// Both work, but API endpoints allow custom logic
```

## Response Headers

```ts
const response = await db.api().get('/users');

console.log('Content-Type:', response.headers?.['Content-Type']);
console.log('Cache-Control:', response.headers?.['Cache-Control']);
console.log('X-Custom:', response.headers?.['X-Custom-Header']);
```

## Best Practices

### 1. Use Type Definitions

```ts
// Good: Type-safe API
type MyApi = {
    "/users": { get: [void, User[]] };
};
const api = db.api<MyApi>();

// Avoid: Untyped
const api = db.api();
```

### 2. Use .value() for Simpler Code

```ts
// Good: Direct value access
const users = await api.get('/users').value();

// More verbose:
const response = await api.get('/users');
const users = response.body;
```

### 3. Handle Errors Gracefully

```ts
// Good: Specific error handling
try {
    const result = await api.get('/users').value();
} catch (error) {
    if (error instanceof UnsuccessfulApiError) {
        // Handle API errors
    }
}
```

## See Also

- [SurrealApi](/docs/2.x/sdk/javascript/api/core/surreal-api) - API instance methods
- [SurrealQueryable.api](/docs/2.x/sdk/javascript/api/core/surreal-queryable#api) - Creating API instances
- [User-Defined APIs](/docs/surrealql/statements/define/api) - Defining APIs in SurrealDB
- [Query Overview](/docs/2.x/sdk/javascript/api/queries/) - All query builder classes
