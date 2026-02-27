---
sidebar_position: 1
sidebar_label: Invalidate
title: .NET | SDK | Methods | Invalidate
description: The .NET SDK for SurrealDB enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.Invalidate()` {#invalidate}

Invalidates the authentication for the current connection.

```csharp title="Method Syntax"
await db.Invalidate()
```

### Arguments

<table>
    <thead>
        <tr>
            <th colspan="2" scope="col">Properties</th>
            <th colspan="2" scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Properties">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp
await db.Invalidate();
```