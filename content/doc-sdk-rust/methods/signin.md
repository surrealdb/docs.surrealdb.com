---
sidebar_position: 18
sidebar_label: signin
title: Signin Method in Rust | Rust SDK | Integration | SurrealDB
description: The .signin() method for the SurrealDB Rust SDK signs in to a specific access method.
---

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";
import Label from "@components/shared/Label.astro";

# `signin()`

<Tabs>
<TabItem label="2.x">

Signs in to a specific access method for an already signed up record user.

```rust title="Method Syntax"
db.signin(credentials)
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
                <code>credentials</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Variables used in a signin query.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```rust
// Use the following statement to set up the access
//
// DEFINE ACCESS account ON DATABASE TYPE RECORD
// 	SIGNUP ( CREATE user SET email = $email, pass = crypto::argon2::generate($pass) )
// 	SIGNIN ( SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass) )
// 	DURATION FOR TOKEN 15m, FOR SESSION 12h
// ;

use serde::Serialize;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Record;
use surrealdb::Surreal;

#[derive(Serialize)]
struct Credentials<'a> {
    email: &'a str,
    pass: &'a str,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;
    let jwt = db
        .signin(Record {
            namespace: "test",
            database: "test",
            access: "account",
            params: Credentials {
                email: "info@surrealdb.com",
                pass: "123456",
            },
        })
        .await?;

    // ⚠️: It is important to note that the token should be handled securely and protected from unauthorized access.
    let token = jwt.as_insecure_token();
    dbg!(token);
    Ok(())
}
```

### See also

* [.signin() method on Docs.rs](https://docs.rs/surrealdb/latest/surrealdb/struct.Surreal.html#method.signin)

</TabItem>

<TabItem label="3.x">

Signs in to a specific access method for an already signed up record user.

```rust title="Method Syntax"
db.signin(credentials)
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
                <code>credentials</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Variables used in a signin query.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```rust
// Use the following statement to set up the access
//
// DEFINE ACCESS account ON DATABASE TYPE RECORD
// 	SIGNUP ( CREATE user SET email = $email, pass = crypto::argon2::generate($pass) )
// 	SIGNIN ( SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass) )
// 	DURATION FOR TOKEN 15m, FOR SESSION 12h
// ;

use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Record;
use surrealdb::Surreal;
use surrealdb_types::SurrealValue;

#[derive(SurrealValue)]
struct Credentials {
    email: String,
    pass: String,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;

    db.use_ns("main").use_db("main").await?;

    let token = db
        .signin(Record {
            namespace: "main".to_string(),
            database: "main".to_string(),
            access: "account".to_string(),
            params: Credentials {
                email: "info@surrealdb.com".to_string(),
                pass: "123456".to_string(),
            },
        })
        .await?;

    // ⚠️: It is important to note that the token should be handled securely and protected from unauthorized access.
    let jwt = token.access.as_insecure_token();
    dbg!(jwt);
    Ok(())
}
```

### See also

* [.signin() method on Docs.rs](https://docs.rs/surrealdb/latest/surrealdb/struct.Surreal.html#method.signin)

</TabItem>

</Tabs>