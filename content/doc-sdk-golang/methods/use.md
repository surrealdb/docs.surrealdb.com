---
sidebar_position: 3
sidebar_label: Use
title: Golang | SDK | Methods | Use
description: The use method switches to a specific namespace and database.
---


# `.Use()` {#use}

Switch to a specific namespace and database.

```go title="Method Syntax"
db.Use(namespace, database)
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
                <code>namespace</code>
                <label label="initially required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Switches to a specific namespace.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>database</code>
                <label label="initially required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Switches to a specific database.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```go
db.Use("test", "test");
```
