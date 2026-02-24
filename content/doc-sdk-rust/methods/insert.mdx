---
sidebar_position: 10
sidebar_label: insert
title: Insert Method in Rust | Rust SDK | Integration | SurrealDB
description: The .insert() method for the SurrealDB Rust SDK inserts a record or records into a table.
---

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

# `insert()`

<Tabs>

<TabItem label="3.x">

```rust title="Method Syntax"
db.insert(resource).content(data);
db.insert(resource).relation(data);
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
                <code>resource</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The table name or the specific record ID to create.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>data</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The document / record data to insert.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>data</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The relation table data to insert.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

Inserting a record with a specific ID:

```rust
use surrealdb::engine::any::connect;
use surrealdb::opt::auth::Root;
use surrealdb_types::SurrealValue;

#[derive(Debug, SurrealValue)]
struct Settings {
    active: bool,
    marketing: bool,
}

#[derive(SurrealValue)]
struct Data {
    name: String,
    settings: Settings,
}

#[derive(Debug, SurrealValue)]
struct Person {
    name: String,
    settings: Settings,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = connect("ws://localhost:8000").await?;

    db.signin(Root {
        username: "root".to_string(),
        password: "secret".to_string(),
    })
    .await?;

    db.use_ns("ns").use_db("db").await?;

    let person: Option<Person> = db
        .insert(("person", "tobie"))
        .content(Data {
            name: "Tobie".to_string(),
            settings: Settings {
                active: true,
                marketing: true,
            },
        })
        .await?;
    dbg!(person);
    Ok(())
}
```

Inserting multiple records into a table:

```rust
use serde::{Deserialize, Serialize};
use surrealdb::engine::any::connect;
use surrealdb::opt::auth::Root;

#[derive(Debug, Serialize, Deserialize)]
struct Settings {
    active: bool,
    marketing: bool,
}

#[derive(Serialize)]
struct Data<'a> {
    name: &'a str,
    settings: Settings,
}

#[derive(Debug, Deserialize)]
struct Person {
    name: String,
    settings: Settings,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = connect("ws://localhost:8000").await?;

    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    db.use_ns("ns").use_db("db").await?;

    let people: Vec<Person> = db
        .insert("person")
        .content(vec![
            Data {
                name: "Tobie",
                settings: Settings {
                    active: true,
                    marketing: false,
                },
            },
            Data {
                name: "Jaime",
                settings: Settings {
                    active: true,
                    marketing: true,
                },
            },
        ])
        .await?;
    dbg!(people);
    Ok(())
}
```

An example of two `person` records and one `company` record, followed by `.insert().relation()` to create a relation between them. Note the usage of the `#[surreal(rename)]` attribute to interface between the Rust struct `Founded` and the original relation table, which must have [an `in` and an `out` field](/docs/surrealql/statements/relate).

```rust
use surrealdb::engine::any::connect;
use surrealdb::opt::auth::Root;
use surrealdb_types::{RecordId, SurrealValue};

#[derive(SurrealValue)]
struct Data {
    id: RecordId,
    name: String,
}

#[derive(Debug, SurrealValue)]
struct Record {
    name: String,
    id: RecordId,
}

#[derive(Debug, SurrealValue)]
struct Founded {
    #[surreal(rename = "in")]
    founder: RecordId,
    #[surreal(rename = "out")]
    company: RecordId,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = connect("ws://localhost:8000").await?;

    db.signin(Root {
        username: "root".to_string(),
        password: "secret".to_string(),
    })
    .await?;

    db.use_ns("main").use_db("main").await?;

    let records: Vec<Record> = db
        .insert("person")
        .content(vec![
            Data {
                id: RecordId::new("person", "tobie"),
                name: "Tobie".to_string(),
            },
            Data {
                id: RecordId::new("person", "jaime"),
                name: "Jaime".to_string(),
            },
            Data {
                id: RecordId::new("company", "surrealdb"),
                name: "SurrealDB".to_string(),
            },
        ])
        .await?;
    dbg!(records);

    let founded: Vec<Founded> = db
        .insert("founded")
        .relation(vec![
            Founded {
                founder: RecordId::new("person", "tobie"),
                company: RecordId::new("company", "surrealdb"),
            },
            Founded {
                founder: RecordId::new("person", "jaime"),
                company: RecordId::new("company", "surrealdb"),
            },
        ])
        .await?;
    dbg!(founded);
    Ok(())
}
```

The equivalent SurrealQL statements to create and query the relations are:

```surql
RELATE [person:jaime, person:tobie]->founded->company:surrealdb;
SELECT ->founded->company FROM person;
```

### See also

* [.insert() method on Docs.rs](https://docs.rs/surrealdb/latest/surrealdb/struct.Surreal.html#method.insert)

</TabItem>

<TabItem label="2.x">

```rust title="Method Syntax"
db.insert(resource).content(data);
db.insert(resource).relation(data);
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
                <code>resource</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The table name or the specific record ID to create.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>data</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The document / record data to insert.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>data</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The relation table data to insert.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

Inserting a record with a specific ID:

```rust
use serde::{Deserialize, Serialize};
use surrealdb::engine::any::connect;
use surrealdb::opt::auth::Root;

#[derive(Debug, Serialize, Deserialize)]
struct Settings {
    active: bool,
    marketing: bool,
}

#[derive(Serialize)]
struct Data<'a> {
    name: &'a str,
    settings: Settings,
}

#[derive(Debug, Deserialize)]
struct Person {
    name: String,
    settings: Settings,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = connect("ws://localhost:8000").await?;

    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    db.use_ns("ns").use_db("db").await?;

    let person: Option<Person> = db
        .insert(("person", "tobie"))
        .content(Data {
            name: "Tobie",
            settings: Settings {
                active: true,
                marketing: true,
            },
        })
        .await?;
    dbg!(person);
    Ok(())
}
```

Inserting multiple records into a table:

```rust
use serde::{Deserialize, Serialize};
use surrealdb::engine::any::connect;
use surrealdb::opt::auth::Root;

#[derive(Debug, Serialize, Deserialize)]
struct Settings {
    active: bool,
    marketing: bool,
}

#[derive(Serialize)]
struct Data<'a> {
    name: &'a str,
    settings: Settings,
}

#[derive(Debug, Deserialize)]
struct Person {
    name: String,
    settings: Settings,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = connect("ws://localhost:8000").await?;

    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    db.use_ns("ns").use_db("db").await?;

    let people: Vec<Person> = db
        .insert("person")
        .content(vec![
            Data {
                name: "Tobie",
                settings: Settings {
                    active: true,
                    marketing: false,
                },
            },
            Data {
                name: "Jaime",
                settings: Settings {
                    active: true,
                    marketing: true,
                },
            },
        ])
        .await?;
    dbg!(people);
    Ok(())
}
```

The `.insert()` method can take an empty tuple instead of a table ID if the following method contains [a record ID](https://docs.rs/surrealdb/latest/surrealdb/struct.RecordId.html).

```rust
use serde::{Deserialize, Serialize};
use surrealdb::engine::any::connect;
use surrealdb::opt::auth::Root;
use surrealdb::RecordId;

#[derive(Debug, Serialize, Deserialize)]
struct Settings {
    active: bool,
    marketing: bool,
}

#[derive(Serialize)]
struct Data<'a> {
    id: RecordId,
    name: &'a str,
}

#[derive(Debug, Deserialize)]
struct Person {
    name: String,
    id: RecordId,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = connect("ws://localhost:8000").await?;

    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    db.use_ns("ns").use_db("db").await?;

    let people: Vec<Person> = db
        .insert(())
        .content(vec![
            Data {
                id: RecordId::from(("person", "tobie")),
                name: "Tobie",
            },
            Data {
                id: RecordId::from(("person", "jaime")),
                name: "Jaime",
            },
        ])
        .await?;
    dbg!(people);
    Ok(())
}
```

An example of two `person` records and one `company` record, followed by `.insert().relation()` to create a relation between them. Note the usage of the `#[serde(rename)]` attribute to interface between the Rust struct `Founded` and the original relation table, which must have [an `in` and an `out` field](/docs/surrealql/statements/relate).

```rust
use serde::{Deserialize, Serialize};
use surrealdb::engine::any::connect;
use surrealdb::opt::auth::Root;
use surrealdb::RecordId;

#[derive(Debug, Serialize, Deserialize)]
struct Settings {
    active: bool,
    marketing: bool,
}

#[derive(Serialize)]
struct Data<'a> {
    id: RecordId,
    name: &'a str,
}

#[derive(Debug, Deserialize)]
struct Record {
    name: String,
    id: RecordId,
}

#[derive(Debug, Serialize, Deserialize)]
struct Founded {
    #[serde(rename = "in")]
    founder: RecordId,
    #[serde(rename = "out")]
    company: RecordId,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = connect("ws://localhost:8000").await?;

    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    db.use_ns("ns").use_db("db").await?;

    let records: Vec<Record> = db
        .insert(())
        .content(vec![
            Data {
                id: RecordId::from(("person", "tobie")),
                name: "Tobie",
            },
            Data {
                id: RecordId::from(("person", "jaime")),
                name: "Jaime",
            },
            Data {
                id: RecordId::from(("company", "surrealdb")),
                name: "SurrealDB",
            },
        ])
        .await?;
    dbg!(records);

    let founded: Vec<Founded> = db
        .insert("founded")
        .relation(vec![
            Founded {
                founder: RecordId::from(("person", "tobie")),
                company: RecordId::from(("company", "surrealdb")),
            },
            Founded {
                founder: RecordId::from(("person", "jaime")),
                company: RecordId::from(("company", "surrealdb")),
            },
        ])
        .await?;
    dbg!(founded);
    Ok(())
}
```

The equivalent SurrealQL statements to create and query the relations are:

```surql
RELATE [person:jaime, person:tobie]->founded->company:surrealdb;
SELECT ->founded->company FROM person;
```

### See also

* [.insert() method on Docs.rs](https://docs.rs/surrealdb/latest/surrealdb/struct.Surreal.html#method.insert)

</TabItem>

</Tabs>