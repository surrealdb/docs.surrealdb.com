---
sidebar_position: 1
sidebar_label: Kill
title: Golang | SDK | Methods | Kill
description: This method kills a running live query by it's UUID.
---

import Label from "@components/shared/Label.astro";

# `.Kill()` {#kill}

Kills a running live query by it's UUID.

```go title="Method Syntax"
db.Kill(queryUuid string)
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
                <code>queryUuid</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The UUID of the live query you wish to kill.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```go
package main

import (
    "fmt"
    surreal "github.com/surrealdb/surrealdb.go"
)

func main() {
    // Assuming db is an instance of your database connection
    // and uuid is a string containing the query UUID you want to kill
    queryUuid := "your-query-uuid-here"

    err := surreal.Kill(queryUuid)
    if err != nil {
        fmt.Println("Error killing query:", err)
        return
    }

    fmt.Println("Successfully killed query")
}