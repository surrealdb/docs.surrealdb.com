---
sidebar_position: 1
sidebar_label: Authenticate
title: .NET | SDK | Methods | Authenticate
description: The .NET SDK for SurrealDB enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.Authenticate()` {#authenticate}

Authenticates the current connection with a JWT token.

```csharp title="Method Syntax"
await db.Authenticate(jwt)
```

### Arguments

<table>
    <thead>
        <tr>
            <th colspan="2" scope="col">Arguments</th>
            <th colspan="2" scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>jwt</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The JWT object holder of the authentication token.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp
Jwt jwt = new JWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTdXJyZWFsREIiLCJpYXQiOjE1MTYyMzkwMjIsIm5iZiI6MTUxNjIzOTAyMiwiZXhwIjoxODM2NDM5MDIyLCJOUyI6InRlc3QiLCJEQiI6InRlc3QiLCJTQyI6InVzZXIiLCJJRCI6InVzZXI6dG9iaWUifQ.N22Gp9ze0rdR06McGj1G-h2vu6a6n9IVqUbMFJlOxxA");
await db.Authenticate(jwt);
```

You can invalidate the authentication for the current connection using the [`Invalidate()` method](/docs/sdk/dotnet/methods/invalidate).
