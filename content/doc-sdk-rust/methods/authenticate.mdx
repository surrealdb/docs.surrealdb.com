---
sidebar_position: 2
sidebar_label: authenticate
title: Authenticate Method in Rust | Rust SDK | Integration | SurrealDB
description: The .authenticate() method for the SurrealDB Rust SDK authenticates the current connection with a JWT token.
---

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

# `authenticate()`

<Tabs>

<TabItem label="3.x">

Authenticates the current connection with a JWT token.

```rust title="Method Syntax"
db.authenticate(token)
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
                <code>token</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The JWT authentication token.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

Note: the following example uses the `ureq` crate with the `json` feature to first send a request to the database's [`/signup`](/docs/surrealdb/integration/http#signup) endpoint which returns a token. The `reqwest` crate and others can be used here instead.

Alternatively, you could use a command like the following, copy the returned token, and paste it into the `.authenticate()` method.

```bash
curl -X POST -H "Accept: application/json" -d '{"ns":"test","db":"test","ac":"account","user":"info@surrealdb.com","pass":"123456"}' http://localhost:8000/signup
```

As the `DEFINE ACCESS` statement below shows, a token will remain valid by default for 15 minutes.

```rust
// Use the following statement to set up the access
//
// DEFINE ACCESS account ON DATABASE TYPE RECORD
// 	SIGNUP ( CREATE user SET email = $email, pass = crypto::argon2::generate($pass) )
// 	SIGNIN ( SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass) )
// 	DURATION FOR TOKEN 15m, FOR SESSION 12h
// ;

// DEFINE TABLE cat SCHEMALESS
//     PERMISSIONS for select, update, delete, create
//     WHERE $auth.id;

use serde::{Deserialize, Serialize};
use std::fmt::Display;
use surrealdb::Surreal;
use surrealdb::engine::remote::ws::Ws;
use surrealdb_types::SurrealValue;

#[derive(Deserialize, SurrealValue)]
struct Response {
    token: String,
}

impl Display for Response {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.token)
    }
}

#[derive(Serialize)]
struct Signup {
    ns: String,
    db: String,
    ac: String,
    email: String,
    pass: String,
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;
    let response_string = ureq::post("http://127.0.0.1:8000/signup")
        .header("Accept", "application/json")
        .send_json(Signup {
            ns: "main".to_string(),
            db: "main".to_string(),
            ac: "account".to_string(),
            email: "info@surrealdb.com".to_string(),
            pass: "123456".to_string(),
        })
        .unwrap()
        .into_body()
        .read_to_string()
        .unwrap();

    let response = serde_json::from_str::<Response>(&response_string).unwrap();

    // Not signed in, doesn't work
    println!("{:?}", db.query("CREATE cat;").await);
    db.authenticate(response.token).await?;
    // Now it works
    println!("{:?}", db.query("CREATE cat;").await?);

    Ok(())
}
```

</TabItem>

<TabItem label="2.x">

Authenticates the current connection with a JWT token.

```rust title="Method Syntax"
db.authenticate(token)
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
                <code>token</code>
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The JWT authentication token.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

Note: the following example uses the `ureq` crate with the `json` feature to first send a request to the database's [`/signup`](/docs/surrealdb/integration/http#signup) endpoint which returns a token. The `reqwest` crate and others can be used here instead.

Alternatively, you could use a command like the following, copy the returned token, and paste it into the `.authenticate()` method.

```bash
curl -X POST -H "Accept: application/json" -d '{"ns":"test","db":"test","ac":"account","user":"info@surrealdb.com","pass":"123456"}' http://localhost:8000/signup`
```

As the `DEFINE ACCESS` statement below shows, a token will remain valid by default for 15 minutes.

```rust
// Use the following statements to set up the access
//
// DEFINE ACCESS account ON DATABASE TYPE RECORD
// 	SIGNUP ( CREATE user SET email = $email, pass = crypto::argon2::generate($pass) )
// 	SIGNIN ( SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(pass, $pass) )
// 	DURATION FOR TOKEN 15m, FOR SESSION 12h
// ;

// DEFINE TABLE cat SCHEMALESS
//     PERMISSIONS for select, update, delete, create
//     WHERE $auth.id;

use serde::Deserialize;
use std::fmt::Display;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::Surreal;

#[derive(Deserialize)]
struct Response {
    token: String,
}

impl Display for Response {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.token)
    }
}

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;
    let token = ureq::post("http://127.0.0.1:8000/signup")
        .set("Accept", "application/json")
        .send_json(ureq::json!({
            "ns": "test",
            "db": "test",
            "ac": "account",
            "email": "info@surrealdb.com",
            "pass": "123456"
        }))
        .unwrap()
        .into_json::<Response>()
        .unwrap()
        .to_string();

    // Not signed in, doesn't work
    dbg!(db.query("CREATE cat;").await?);
    db.authenticate(token).await?;
    // Now it works
    dbg!(db.query("CREATE cat;").await?);

    Ok(())
}
```

### See also

* [.authenticate() method on Docs.rs](https://docs.rs/surrealdb/latest/surrealdb/struct.Surreal.html#method.authenticate)

</TabItem>

</Tabs>