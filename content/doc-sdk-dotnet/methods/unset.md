---
sidebar_position: 1
sidebar_label: Unset
title: .NET | SDK | Methods | Unset
description: The .NET SDK for SurrealDB enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.Unset()` {#unset}

Removes a parameter for this connection.

```csharp title="Method Syntax"
await db.Unset(key)
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
                <code>key</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Specifies the SurrealQL statements.
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
await db.Unset("name");
```