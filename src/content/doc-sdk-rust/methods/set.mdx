---
sidebar_position: 17
sidebar_label: set
title: Set Method in Rust | Rust SDK | Integration | SurrealDB
description: The .set() method for the SurrealDB Rust SDK assigns a value as a parameter for this connection.
---

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";
import Label from "@components/shared/Label.astro";

# `set()`

<Tabs>

<TabItem label="3.x">

Assigns a value as a parameter for this connection.

```rust title="Method Syntax"
db.set(key, value)
```

This is equivalent to using a [`LET`](/docs/surrealql/statements/let) statement in SurrealQL, such as this one.

```surql
LET $name = {
    first: "Tobie",
    last: "Morgan Hitchcock",
};
```

### Arguments

<table>
    <thead>
        <tr>
            <th colspan="2" scope="col">Argument</th>
            <th colspan="2" scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="2" scope="row" data-label="Argument">
                <code>key</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Specifies the name of the variable.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>val</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Assigns the value to the variable name.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```rust
use surrealdb::Surreal;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb_types::SurrealValue;

#[derive(Debug, SurrealValue)]
struct Name {
    first: String,
    last: String,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;

    db.signin(Root {
        username: "root".to_string(),
        password: "secret".to_string(),
    })
    .await?;

    db.use_ns("main").use_db("main").await?;

    // Assign the variable on the connection
    db.set(
        "name",
        Name {
            first: "Tobie".to_string(),
            last: "Morgan Hitchcock".to_string(),
        },
    )
    .await?;
    // Use the variable in a subsequent query
    let create = db.query("CREATE person SET name = $name").await?;
    dbg!(create);
    // Use the variable in a subsequent query
    let select = db
        .query("SELECT * FROM person WHERE name.first = $name.first")
        .await?;
    dbg!(select);
    Ok(())
}
```

### See also

* [.set() method on Docs.rs](https://docs.rs/surrealdb/latest/surrealdb/struct.Surreal.html#method.set)

</TabItem>

<TabItem label="2.x">

Assigns a value as a parameter for this connection.

```rust title="Method Syntax"
db.set(key, value)
```

This is equivalent to using a [`LET`](/docs/surrealql/statements/let) statement in SurrealQL, such as this one.

```surql
LET $name = {
    first: "Tobie",
    last: "Morgan Hitchcock",
};
```

### Arguments

<table>
    <thead>
        <tr>
            <th colspan="2" scope="col">Argument</th>
            <th colspan="2" scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="2" scope="row" data-label="Argument">
                <code>key</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Specifies the name of the variable.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>val</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Assigns the value to the variable name.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```rust
use serde::Serialize;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;

#[derive(Debug, Serialize)]
struct Name<'a> {
    first: &'a str,
    last: &'a str,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;

    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    db.use_ns("ns").use_db("db").await?;

    // Assign the variable on the connection
    db.set(
        "name",
        Name {
            first: "Tobie",
            last: "Morgan Hitchcock",
        },
    )
    .await?;
    // Use the variable in a subsequent query
    let create = db.query("CREATE person SET name = $name").await?;
    dbg!(create);
    // Use the variable in a subsequent query
    let select = db
        .query("SELECT * FROM person WHERE name.first = $name.first")
        .await?;
    dbg!(select);
    Ok(())
}
```

### See also

* [.set() method on Docs.rs](https://docs.rs/surrealdb/latest/surrealdb/struct.Surreal.html#method.set)

</TabItem>

</Tabs>