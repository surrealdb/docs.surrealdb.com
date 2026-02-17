---
sidebar_position: 3
sidebar_label: Manual transactions
title: Manual Transactions in Rust | Rust SDK | SurrealDB
description: Manual transactions can be used via the Rust SDK in the same manner as regular SurrealQL queries
---

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

<Tabs>

<TabItem label="3.x">

# Manual transactions

While every query in SurrealDB is run [inside its own transaction](/docs/surrealql/transactions), manual transactions made up of multiple statements can be used via the [BEGIN](/docs/surrealql/statements/begin) and [COMMIT](/docs/surrealql/statements/commit) keywords.

The [`.query()`](https://docs.rs/surrealdb/latest/surrealdb/struct.Surreal.html#method.query) method can take any number of statements, returning a [`Response`](https://docs.rs/surrealdb/latest/surrealdb/struct.Response.html) that contains the results of each of them. In addition, the same method before being called returns [a struct](https://docs.rs/surrealdb/latest/surrealdb/method/struct.Query.html) that also allows [the same `.query()` method](https://docs.rs/surrealdb/latest/surrealdb/method/struct.Query.html#method.query) to be called on it, chaining the new query onto the existing query. This can help greatly with readability, as the example code below shows.

## Getting started

Start a running database using the following command:

```
surreal start --user root --pass secret 
```

To follow along interactively, connect [using Surrealist](/docs/surrealist/getting-started#creating-a-connection) or the following command to open up the CLI:

```
surreal sql --user root --pass secret --pretty
```

Then use the `cargo add` command to add the `surrealdb` and `tokio` crates. The dependencies inside `Cargo.toml` should look something like this:

```toml
[dependencies]
surrealdb = "2.4.1"
tokio = "1.49.0"
```

Once this is done, copy and paste the following code to run a manual transaction that creates two `account` records and then transfers 300 units from one account to the other.

```rust
use surrealdb::Surreal;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb_types::ToSql;

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    db.signin(Root {
        username: "root".to_string(),
        password: "secret".to_string(),
    })
    .await?;

    db.use_ns("main").use_db("main").await?;

    let response = db
        .query(
            "
        // Start transaction
        BEGIN;
        // Setup accounts
        CREATE account:one SET balance = 135605.16;
        CREATE account:two SET balance = 91031.31;
        // Move money
        UPDATE account:one SET balance += 300.00;
        UPDATE account:two SET balance -= 300.00;
        // Finalise
        COMMIT;
        ",
        )
        .await?;

    for (_, (_, result)) in response.results {
        match result {
            Ok(v) => println!("{}", v.to_sql()),
            Err(e) => println!("{e}"),
        }
    }

    Ok(())
}
```

The output will look like this.

```
NONE
[{ balance: 135605.16f, id: account:one }]
[{ balance: 91031.31f, id: account:two }]
[{ balance: 135905.16f, id: account:one }]
[{ balance: 90731.31f, id: account:two }]
NONE
```

To avoid the possibility of typos, the [`.set()`](/docs/sdk/rust/methods/set) method can be used to set the amount to transfer.

```rust
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
	let db = Surreal::new::<Ws>("localhost:8000").await?;

	db.signin(Root {
		username: "root",
		password: "secret",
	})
	.await?;

	db.use_ns("main").use_db("main").await?;

    // Set the parameter $amount for later use
    db.set("amount", 300).await?;

    let response = db
        .query("
        // Start transaction
        BEGIN;
        // Setup accounts
        CREATE account:one SET balance = 135605.16;
        CREATE account:two SET balance = 91031.31;
        // Move money
        UPDATE account:one SET balance += $amount;
        UPDATE account:two SET balance -= $amount;
        // Finalise
        COMMIT;
        ")
        .await?;

    println!("{response:#?}");

	// See if any errors were returned
	response.check()?;

	Ok(())
}
```

</TabItem>

<TabItem label="2.x">

# Manual transactions

While every query in SurrealDB is run [inside its own transaction](/docs/surrealql/transactions), manual transactions made up of multiple statements can be used via the [BEGIN](/docs/surrealql/statements/begin) and [COMMIT](/docs/surrealql/statements/commit) keywords.

The [`.query()`](https://docs.rs/surrealdb/latest/surrealdb/struct.Surreal.html#method.query) method can take any number of statements, returning a [`Response`](https://docs.rs/surrealdb/latest/surrealdb/struct.Response.html) that contains the results of each of them. In addition, the same method before being called returns [a struct](https://docs.rs/surrealdb/latest/surrealdb/method/struct.Query.html) that also allows [the same `.query()` method](https://docs.rs/surrealdb/latest/surrealdb/method/struct.Query.html#method.query) to be called on it, chaining the new query onto the existing query. This can help greatly with readability, as the example code below shows.

## Getting started

Start a running database using the following command:

```
surreal start --user root --pass secret 
```

To follow along interactively, connect [using Surrealist](/docs/surrealist/getting-started#creating-a-connection) or the following command to open up the CLI:

```
surreal sql --user root --pass secret --ns main --db main --pretty
```

Then use the `cargo add` command to add the `surrealdb` and `tokio` crates. The dependencies inside `Cargo.toml` should look something like this:

```toml
[dependencies]
surrealdb = "2.4.1"
tokio = "1.49.0"
```

Once this is done, copy and paste the following code to run a manual transaction that creates two `account` records and then transfers 300 units from one account to the other.

```rust
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
	let db = Surreal::new::<Ws>("localhost:8000").await?;

	db.signin(Root {
		username: "root",
		password: "secret",
	})
	.await?;

	db.use_ns("main").use_db("main").await?;

    let response = db
        .query("
        // Start transaction
        BEGIN;
        // Setup accounts
        CREATE account:one SET balance = 135605.16;
        CREATE account:two SET balance = 91031.31;
        // Move money
        UPDATE account:one SET balance += 300.00;
        UPDATE account:two SET balance -= 300.00;
        // Finalise
        COMMIT;
        ")
        .await?;

    println!("{response:#?}");

	// See if any errors were returned
	response.check()?;

	Ok(())
}
```

To avoid the possibility of typos, the [`.set()`](/docs/sdk/rust/methods/set) method can be used to set the amount to transfer.

```rust
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
	let db = Surreal::new::<Ws>("localhost:8000").await?;

	db.signin(Root {
		username: "root",
		password: "secret",
	})
	.await?;

	db.use_ns("main").use_db("main").await?;

    // Set the parameter $amount for later use
    db.set("amount", 300).await?;

    let response = db
        .query("
        // Start transaction
        BEGIN;
        // Setup accounts
        CREATE account:one SET balance = 135605.16;
        CREATE account:two SET balance = 91031.31;
        // Move money
        UPDATE account:one SET balance += $amount;
        UPDATE account:two SET balance -= $amount;
        // Finalise
        COMMIT;
        ")
        .await?;

    println!("{response:#?}");

	// See if any errors were returned
	response.check()?;

	Ok(())
}
```

</TabItem>

</Tabs>