---
sidebar_position: 5
sidebar_label: Live queries
title: Live Queries in Rust | Rust SDK | SurrealDB
description: The Rust SDK for SurrealDB allows changes to tables in real time to be observed
---

# Live queries

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

<Tabs>

<TabItem label="3.x">

A [`LIVE SELECT`](/docs/surrealql/statements/live) statement creates a session that keeps track of changes to a table in real time. Inside the Rust SDK, this is accomplished by appending [`.live()`](https://docs.rs/surrealdb/latest/surrealdb/method/struct.Select.html#method.live) to the end of a [`.select()`](/docs/sdk/rust/methods/select) query.

## Getting started

Start a running database using the following command:

```
surreal start --user root --pass secret 
```

To follow along interactively, connect [using Surrealist](/docs/surrealist/getting-started#creating-a-connection) or the following command to open up the CLI:

```
surrealdb % surreal sql --user root --pass secret --pretty
```

Then use the `cargo add` command to add three crates: `surrealdb`, `tokio`, and the `futures` crate for the [`StreamExt`](https://docs.rs/futures/latest/futures/stream/trait.StreamExt.html) trait needed to use the async stream.

The example code below shows a live select that keeps track of changes made to a sample of records from the `account` table. By adding the [`.range()`](https://docs.rs/surrealdb/latest/surrealdb/method/struct.Select.html#method.range-1) method, it can be restricted to certain record IDs, in this case any record IDs in between the letters a and g.

The stream from the `.live()` method returns a stream of [`Notification`](https://docs.rs/surrealdb/latest/surrealdb/struct.Notification.html)s. These contain an action (an `Action::Create`, `Action::Update`, or `Action::Delete`), and a field called `data` that contains anything that can be deserialized. In this case, the `data` field will deserialize into a struct that we create called `Account`. It also contains a `query_id` field that contains the ID of the live query itself, for record keeping or to cancel using the [`KILL`](/docs/surrealql/statements/kill) statement.

Once the following code is run, the Rust client will continue to listen for changes to the `account` table indefinitely.

```rust
use futures::StreamExt;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;
use surrealdb_types::{RecordId, SurrealValue};

const ACCOUNT: &str = "account";

#[derive(Debug, SurrealValue)]
struct Account {
    id: RecordId,
    balance: f64,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    db.signin(Root {
        username: "root".to_string(),
        password: "secret".to_string(),
    })
    .await?;

    db.use_ns("main").use_db("main").await?;
    db.query("DEFINE TABLE account").await?;

    let mut sample_accounts = db.select(ACCOUNT).range("a"..="g").live().await?;

    while let Some(result) = sample_accounts.next().await {
        match result {
            Ok(notification) => {
                let action = notification.action;
                let account: Account = notification.data;
                let id = notification.query_id;
                println!("{action:?} from live ID {id}:\n  {account:#?}\n");
            }
            Err(error) => eprintln!("{error}"),
        }
    }

    Ok(())
}
```

We can now move to Surrealist or the CLI to execute a few queries and see what happens. The following queries create, update, and delete ten `account` records.

```surql
FOR $_ IN 0..10 { CREATE account SET balance = 10.0 };
UPDATE account SET balance += 1000;
DELETE account;
```

The Rust client will keep track for any with a record ID in between a and g, returning an output similar to the following.

```bash
Create from live ID aad570d6-1d3f-4dd6-81f5-582b92a6d8a4:
  Account {
    id: RecordId {
        table: Table(
            "account",
        ),
        key: String(
            "cr4obgozhu4oe2fo3vra",
        ),
    },
    balance: 10.0,
}

Create from live ID aad570d6-1d3f-4dd6-81f5-582b92a6d8a4:
  Account {
    id: RecordId {
        table: Table(
            "account",
        ),
        key: String(
            "do3us1twpyaxm20mp2qt",
        ),
    },
    balance: 10.0,
}

Update from live ID aad570d6-1d3f-4dd6-81f5-582b92a6d8a4:
  Account {
    id: RecordId {
        table: Table(
            "account",
        ),
        key: String(
            "cr4obgozhu4oe2fo3vra",
        ),
    },
    balance: 1010.0,
}

Update from live ID aad570d6-1d3f-4dd6-81f5-582b92a6d8a4:
  Account {
    id: RecordId {
        table: Table(
            "account",
        ),
        key: String(
            "do3us1twpyaxm20mp2qt",
        ),
    },
    balance: 1010.0,
}

Delete from live ID aad570d6-1d3f-4dd6-81f5-582b92a6d8a4:
  Account {
    id: RecordId {
        table: Table(
            "account",
        ),
        key: String(
            "cr4obgozhu4oe2fo3vra",
        ),
    },
    balance: 1010.0,
}

Delete from live ID aad570d6-1d3f-4dd6-81f5-582b92a6d8a4:
  Account {
    id: RecordId {
        table: Table(
            "account",
        ),
        key: String(
            "do3us1twpyaxm20mp2qt",
        ),
    },
    balance: 1010.0,
}
```

</TabItem>

<TabItem label="2.x">

A [`LIVE SELECT`](/docs/surrealql/statements/live) statement creates a session that keeps track of changes to a table in real time. Inside the Rust SDK, this is accomplished by appending [`.live()`](https://docs.rs/surrealdb/latest/surrealdb/method/struct.Select.html#method.live) to the end of a [`.select()`](/docs/sdk/rust/methods/select) query.

## Getting started

Start a running database using the following command:

```
surreal start --user root --pass secret 
```

To follow along interactively, connect [using Surrealist](/docs/surrealist/getting-started#creating-a-connection) or the following command to open up the CLI:

```
surrealdb % surreal sql --user root --pass secret --ns namespace --db database --pretty
```

Then use the `cargo add` command to add four crates: `surrealdb` and `tokio`, the `futures` crate for the [`StreamExt`](https://docs.rs/futures/latest/futures/stream/trait.StreamExt.html) trait needed to use the async stream, as well as with `serde` with the "serde_derive" feature (`cargo add serde --features serde_derive`). The dependencies inside `Cargo.toml` should look something like this:

cargo add serde --features serde_derive

```toml
[dependencies]
futures = "0.3.31"
serde = { version = "1.0.228", features = ["serde_derive"] }
surrealdb = "2.4.1"
tokio = "1.49.0"
```

The example code below shows a live select that keeps track of changes made to a sample of records from the `account` table. By adding the [`.range()`](https://docs.rs/surrealdb/latest/surrealdb/method/struct.Select.html#method.range-1) method, it can be restricted to certain record IDs, in this case any record IDs in between the letters a and g.

The stream from the `.live()` method returns a stream of [`Notification`](https://docs.rs/surrealdb/latest/surrealdb/struct.Notification.html)s. These contain an action (an `Action::Create`, `Action::Update`, or `Action::Delete`), and a field called `data` that contains anything that can be deserialized. In this case, the `data` field will deserialize into a struct that we create called `Account`. It also contains a `query_id` field that contains the ID of the live query itself, for record keeping or to cancel using the [`KILL`](/docs/surrealql/statements/kill) statement.

Once the following code is run, the Rust client will continue to listen for changes to the `account` table indefinitely.

```rust
use futures::StreamExt;
use serde::Deserialize;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::{RecordId, Surreal};

const ACCOUNT: &str = "account";

#[derive(Debug, Deserialize)]
struct Account {
    id: RecordId,
    balance: f64,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    db.use_ns("namespace").use_db("database").await?;

    let mut sample_accounts = db.select(ACCOUNT).range("a"..="g").live().await?;

    while let Some(result) = sample_accounts.next().await {
        match result {
            Ok(notification) => {
                let action = notification.action;
                let account: Account = notification.data;
                let id = notification.query_id;
                println!("{action:?} from live ID {id}:\n  {account:#?}\n");
            }
            Err(error) => eprintln!("{error}"),
        }
    }

    Ok(())
}
```

We can now move to Surrealist or the CLI to execute a few queries and see what happens. The following queries create, update, and delete ten `account` records.

```surql
FOR $_ IN 0..10 { CREATE account SET balance = 10 };
UPDATE account SET balance += 1000;
DELETE account;
```

The Rust client will keep track for any with a record ID in between a and g, returning an output similar to the following.

```bash
Create from live ID 63853ee1-aa9b-4e04-a54a-3b900a3cbaaa:
  Account {
    id: RecordId {
        table: "account",
        key: String(
            "cjk4pk2am5chjs4hxjpz",
        ),
    },
    balance: 10.0,
}

Create from live ID 63853ee1-aa9b-4e04-a54a-3b900a3cbaaa:
  Account {
    id: RecordId {
        table: "account",
        key: String(
            "dp98mide1w91fnjoezf0",
        ),
    },
    balance: 10.0,
}

Update from live ID 63853ee1-aa9b-4e04-a54a-3b900a3cbaaa:
  Account {
    id: RecordId {
        table: "account",
        key: String(
            "cjk4pk2am5chjs4hxjpz",
        ),
    },
    balance: 1010.0,
}

Update from live ID 63853ee1-aa9b-4e04-a54a-3b900a3cbaaa:
  Account {
    id: RecordId {
        table: "account",
        key: String(
            "dp98mide1w91fnjoezf0",
        ),
    },
    balance: 1010.0,
}

Delete from live ID 63853ee1-aa9b-4e04-a54a-3b900a3cbaaa:
  Account {
    id: RecordId {
        table: "account",
        key: String(
            "cjk4pk2am5chjs4hxjpz",
        ),
    },
    balance: 1010.0,
}

Delete from live ID 63853ee1-aa9b-4e04-a54a-3b900a3cbaaa:
  Account {
    id: RecordId {
        table: "account",
        key: String(
            "dp98mide1w91fnjoezf0",
        ),
    },
    balance: 1010.0,
}
```

</TabItem>

</Tabs>