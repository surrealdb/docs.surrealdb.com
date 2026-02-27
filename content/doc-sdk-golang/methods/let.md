---
sidebar_position: 11
sidebar_label: Let
title: Golang | SDK | Methods | Let
description: The let method assigns a value as a parameter for this connection.
---

import Label from "@components/shared/Label.astro";

# `.Let()` {#let}

Assigns a value as a parameter for this connection.

```go title="Method Syntax"
db.Let(key string, value interface{})
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
    </tbody>
</table>

### Example usage

```go
// Assign the variable on the connection
db.Let("name", new Name { FirstName = "Tobie", LastName = "Morgan Hitchcock" });

// Use the variable in a subsequent query
db.Query("CREATE person SET name = $name");

// Use the variable in a subsequent query
db.Query("SELECT * FROM person WHERE name.first_name = $name.first_name");
```

You can remove the variable from the connection using the [`Unset()` method](/docs/sdk/golang/methods/unset).
