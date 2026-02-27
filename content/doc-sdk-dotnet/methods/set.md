---
sidebar_position: 1
sidebar_label: Set
title: .NET | SDK | Methods | Set
description: The .NET SDK for SurrealDB enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.Set()` {#set}

Assigns a value as a parameter for this connection.

```csharp title="Method Syntax"
await db.Set(key, value)
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
                Specifies the name of the variable.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>value</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Assigns the value to the variable name.
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
// Assign the variable on the connection
await db.Set("name", new Name { FirstName = "Tobie", LastName = "Morgan Hitchcock" });

// Use the variable in a subsequent query
await db.Query($"CREATE person SET name = $name");

// Use the variable in a subsequent query
await db.Query($"SELECT * FROM person WHERE name.first_name = $name.first_name");
```

You can remove the variable from the connection using the [`Unset()` method](/docs/sdk/dotnet/methods/unset).
