---
sidebar_position: 4
sidebar_label: Flexible typing
title: Flexible Typing in Rust | Rust SDK | SurrealDB
description: The Rust SDK for SurrealDB offers methods for working with types without deserialization
---

import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

# Flexible typing

<Tabs>

<TabItem label="3.x">

Most examples in the Rust SDK feature strict types like the following that can be serialized and deserialized as needed.

```rust
#[derive(Debug, SurrealValue)]
struct Student {
    name: String,
    class_id: u32,
}
```

However, sometimes you will need to work with types that have a more dynamic structure. This page offers a few methods to use in such a case.

## Getting started

Start a running database using the following command:

```
surreal start --user root --pass secret 
```

To follow along interactively, connect [using Surrealist](/docs/surrealist/getting-started#creating-a-connection) or the following command to open up the CLI:

```
surrealdb % surreal sql --user root --pass secret --pretty
```

Then use the `cargo add` command to add the `surrealdb` and `tokio` crates.

## Strict vs. flexible typing

The following example is a typical one, featuring a `Student` struct that holds a `name` and a `class_id`, followed by the `.select()` function to display all the students.

```rust
use serde::{Deserialize, Serialize};
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::{Error, Surreal};

#[derive(Debug, Serialize, Deserialize)]
struct Student {
    name: String,
    class_id: u32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Connect to the database server
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    // Sign in into the server
    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    // Select the namespace and database to use
    db.use_ns("main").use_db("main").await?;

    let all_students: Vec<Student> = db.select("student").await?;
    println!("All students: {all_students:?}");

    Ok(())
}
```

Before running this code, first use Surrealist or the CLI to populate the database with two students.

```surql
CREATE student SET name = "Student 1", class_id = 10; CREATE student SET name = "Another student", class_id = 20;
```

Once that is done, running `cargo run` will display the following output.

```
All students: [Student { name: "Another student", class_id: 20 }, Student { name: "Student 1", class_id: 10 }]
```

So far so good, but what if we were still experimenting with the data and created a `student` that diverged from the `Student` struct?

```surql
CREATE student SET name = "Third student", class_id = 40, metadata = { teacher: teacher:mr_gundry_white, favourite_classes: ["Music", "Industrial arts"] };
```

In this case the output would still conform to the `Student` struct and the extra information in the third student would not show up.

```
All students: [Student { name: "Another student", class_id: 20 }, Student { name: "Student 1", class_id: 10 }, Student { name: "Third student", class_id: 40 }]
```

One possibility here is to use the `.query()` method, which will always return the output as received from the database.

```rust
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::{Error, Surreal};
use surrealdb_types::SurrealValue;

#[derive(Debug, SurrealValue)]
struct Student {
    name: String,
    class_id: u32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Connect to the database server
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    // Sign in into the server
    db.signin(Root {
        username: "root".to_string(),
        password: "secret".to_string(),
    })
    .await?;

    // Select the namespace and database to use
    db.use_ns("main").use_db("main").await?;

    let all_students = db.query("SELECT * FROM student").await?;
    println!("All students: {all_students:?}");

    Ok(())
}
```

However, the output is a bit noisy.

```
All students: IndexedResults { results: {0: (DbResultStats { execution_time: Some(139.916µs), query_type: Some(Other) }, Ok(Array(Array([Object(Object({"class_id": Number(Int(10)), "id": RecordId(RecordId { table: Table("student"), key: String("9q65y3sujtd6y2oq9qou") }), "name": String("Student 1")})), Object(Object({"class_id": Number(Int(20)), "id": RecordId(RecordId { table: Table("student"), key: String("emm1fhw2bxdm7vkcchni") }), "name": String("Another student")})), Object(Object({"class_id": Number(Int(40)), "id": RecordId(RecordId { table: Table("student"), key: String("vcwgksxms0819ivwsm3q") }), "metadata": Object(Object({"favourite_classes": Array(Array([String("Music"), String("Industrial arts")])), "teacher": RecordId(RecordId { table: Table("teacher"), key: String("mr_gundry_white") })})), "name": String("Third student")}))]))))}, live_queries: {} }
```

A better solution when working with dynamic structures in a situation like this is to pass in a [`Resource`](https://docs.rs/surrealdb/latest/surrealdb/opt/enum.Resource.html) into the methods we use. Database methods that take a `Resource` will automatically return a [`Value`](https://docs.rs/surrealdb/latest/surrealdb/struct.Value.html) which contains an enum of all the possible data types in SurrealDB, and thus does not require deserializing. In addition, a `Value' has the methods `.to_sql()` and `.to_sql_pretty()`, making the output similar to that in the CLI.

```rust
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::opt::Resource;
use surrealdb::{Error, Surreal};
use surrealdb_types::{SurrealValue, ToSql};

#[derive(Debug, SurrealValue)]
struct Student {
    name: String,
    class_id: u32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Connect to the database server
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    // Sign in into the server
    db.signin(Root {
        username: "root".to_string(),
        password: "secret".to_string(),
    })
    .await?;

    // Select the namespace and database to use
    db.use_ns("main").use_db("main").await?;

    let all_students = db.select(Resource::from("student")).await?;
    println!("All students regular: {}\n", all_students.to_sql());
    println!("All students pretty: {}", all_students.to_sql_pretty());

    Ok(())
}
```

As the output shows, the first println! statement looks like the output in the CLI, while the second looks like the output in the CLI when the --pretty flag is passed in.

```
All students regular: [{ class_id: 10, id: student:9q65y3sujtd6y2oq9qou, name: 'Student 1' }, { class_id: 20, id: student:emm1fhw2bxdm7vkcchni, name: 'Another student' }, { class_id: 40, id: student:vcwgksxms0819ivwsm3q, metadata: { favourite_classes: ['Music', 'Industrial arts'], teacher: teacher:mr_gundry_white }, name: 'Third student' }]

All students pretty: [
	{
		class_id: 10,
		id: student:9q65y3sujtd6y2oq9qou,
		name: 'Student 1'
	},
	{
		class_id: 20,
		id: student:emm1fhw2bxdm7vkcchni,
		name: 'Another student'
	},
	{
		class_id: 40,
		id: student:vcwgksxms0819ivwsm3q,
		metadata: {
			favourite_classes: [
				'Music',
				'Industrial arts'
			],
			teacher: teacher:mr_gundry_white
		},
		name: 'Third student'
	}
]
```

A `Value` from `serde_json` can be passed into functions like `.create()`, allowing the [`json!`](https://docs.rs/serde_json/latest/serde_json/macro.json.html) macro to be used.

```rust
use serde_json::json;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::opt::Resource;
use surrealdb::{Error, Surreal};
use surrealdb_types::{SurrealValue, ToSql};

#[derive(Debug, SurrealValue)]
struct Student {
    name: String,
    class_id: u32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Connect to the database server
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    // Sign in into the server
    db.signin(Root {
        username: "root".to_string(),
        password: "secret".to_string(),
    })
    .await?;

    // Select the namespace and database to use
    db.use_ns("main").use_db("main").await?;

    let new_student = db.create(Resource::from("student")).content(json!({
        "age": 15,
        "weekly_allowance": 20.5
    })).await?;
    
    println!("{}", new_student.to_sql());

    Ok(())
}
```

Output:

```
[{ age: 15, id: student:n89ugobw4iaw7gw3lh9b, weekly_allowance: 20.5f }]
```

</TabItem>

<TabItem label="2.x">

Most examples in the Rust SDK feature strict types like the following that can be serialized and deserialized as needed.

```rust
#[derive(Debug, Serialize, Deserialize)]
struct Student {
    name: String,
    class_id: u32,
}
```

However, sometimes you will need to work with types that have a more dynamic structure. This page offers a few methods to use in such a case.

## Getting started

Start a running database using the following command:

```
surreal start --user root --pass secret 
```

To follow along interactively, connect [using Surrealist](/docs/surrealist/getting-started#creating-a-connection) or the following command to open up the CLI:

```
surrealdb % surreal sql --user root --pass secret --ns main --db main --pretty
```

Then use the `cargo add` command to add four crates: `surrealdb`, `serde`, `serde_json`, and `tokio`. Your `Cargo.toml` file should look something like this.

```toml
[dependencies]
serde = "1.0.214"
serde_json = "1.0.132"
surrealdb = "2.4.1"
tokio = "1.49.0"
```

## Strict vs. flexible typing

The following example is a typical one, featuring a `Student` struct that holds a `name` and a `class_id`, followed by the `.select()` function to display all the students.

```rust
use serde::{Deserialize, Serialize};
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::{Error, Surreal};

#[derive(Debug, Serialize, Deserialize)]
struct Student {
    name: String,
    class_id: u32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Connect to the database server
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    // Sign in into the server
    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    // Select the namespace and database to use
    db.use_ns("main").use_db("main").await?;

    let all_students: Vec<Student> = db.select("student").await?;
    println!("All students: {all_students:?}");

    Ok(())
}
```

Before running this code, first use Surrealist or the CLI to populate the database with two students.

```surql
CREATE student SET name = "Student 1", class_id = 10; CREATE student SET name = "Another student", class_id = 20;
```

Once that is done, running `cargo run` will display the following output.

```
All students: [Student { name: "Another student", class_id: 20 }, Student { name: "Student 1", class_id: 10 }]
```

So far so good, but what if we were still experimenting with the data and created a `student` that diverged from the `Student` struct?

```surql
CREATE student SET name = "Third student", class_id = 40, metadata = { teacher: teacher:mr_gundry_white, favourite_classes: ["Music", "Industrial arts"] };
```

In this case the output would still conform to the `Student` struct and the extra information in the third student would not show up.

```
All students: [Student { name: "Another student", class_id: 20 }, Student { name: "Student 1", class_id: 10 }, Student { name: "Third student", class_id: 40 }]
```

One possibility here is to use the `.query()` method, which will always return the output as received from the database.

```rust
use serde::{Deserialize, Serialize};
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::{Error, Surreal};

#[derive(Debug, Serialize, Deserialize)]
struct Student {
    name: String,
    class_id: u32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Connect to the database server
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    // Sign in into the server
    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    // Select the namespace and database to use
    db.use_ns("main").use_db("main").await?;

    let all_students = db.query("SELECT * FROM student").await?;
    println!("All students: {all_students:?}");

    Ok(())
}
```

However, the output is a bit noisy.

```
All students: Response { client: Surreal { router: OnceLock(Router { sender: Sender { .. }, last_id: 4, features: {LiveQueries} }), engine: PhantomData<surrealdb::api::engine::any::Any> }, results: {0: (Stats { execution_time: Some(65.417µs) }, Ok(Array(Array([Object(Object({"class_id": Number(Int(20)), "id": RecordId(RecordId { table: "student", key: String("7bhlb23ti1vedykpsnzd") }), "name": Strand(Strand("Another student"))})), Object(Object({"class_id": Number(Int(10)), "id": RecordId(RecordId { table: "student", key: String("rpi0qmsqc7rwaxddfxpb") }), "name": Strand(Strand("Student 1"))})), Object(Object({"class_id": Number(Int(40)), "id": RecordId(RecordId { table: "student", key: String("xl5rzvlkghtn01nh5tw2") }), "metadata": Object(Object({"favourite_classes": Array(Array([Strand(Strand("Music")), Strand(Strand("Industrial arts"))])), "teacher": RecordId(RecordId { table: "teacher", key: String("mr_gundry_white") })})), "name": Strand(Strand("Third student"))}))]))))}, live_queries: {} }
```

A better solution when working with dynamic structures in a situation like this is to pass in a [`Resource`](https://docs.rs/surrealdb/latest/surrealdb/opt/enum.Resource.html) into the methods we use. Database methods that take a `Resource` will automatically return a [`Value`](https://docs.rs/surrealdb/latest/surrealdb/struct.Value.html) which contains an enum of all the possible data types in SurrealDB, and thus does not require deserializing. In addition, a `Value' implements `Display`, making the output similar to that in the CLI.

```rust
use serde::{Deserialize, Serialize};
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::opt::Resource;
use surrealdb::{Error, Surreal};

#[derive(Debug, Serialize, Deserialize)]
struct Student {
    name: String,
    class_id: u32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Connect to the database server
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    // Sign in into the server
    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    // Select the namespace and database to use
    db.use_ns("main").use_db("main").await?;

    let all_students = db.select(Resource::from("student")).await?;
    println!("All students debug: {all_students:?}\n");
    println!("All students display: {all_students}");

    Ok(())
}
```

As the output shows, `Debug` printing returns an output similar to the `.query()` example above, while using `Display` is much neater.

```
All students debug: Array(Array([Object(Object({"class_id": Number(Int(20)), "id": RecordId(RecordId { table: "student", key: String("7bhlb23ti1vedykpsnzd") }), "name": Strand(Strand("Another student"))})), Object(Object({"class_id": Number(Int(10)), "id": RecordId(RecordId { table: "student", key: String("rpi0qmsqc7rwaxddfxpb") }), "name": Strand(Strand("Student 1"))})), Object(Object({"class_id": Number(Int(40)), "id": RecordId(RecordId { table: "student", key: String("xl5rzvlkghtn01nh5tw2") }), "metadata": Object(Object({"favourite_classes": Array(Array([Strand(Strand("Music")), Strand(Strand("Industrial arts"))])), "teacher": RecordId(RecordId { table: "teacher", key: String("mr_gundry_white") })})), "name": Strand(Strand("Third student"))}))]))

All students display: [{ class_id: 20, id: student:7bhlb23ti1vedykpsnzd, name: 'Another student' }, { class_id: 10, id: student:rpi0qmsqc7rwaxddfxpb, name: 'Student 1' }, { class_id: 40, id: student:xl5rzvlkghtn01nh5tw2, metadata: { favourite_classes: ['Music', 'Industrial arts'], teacher: teacher:mr_gundry_white }, name: 'Third student' }]
```

A `Value` from `serde_json` can be passed into functions like `.create()`, allowing the [`json!`](https://docs.rs/serde_json/latest/serde_json/macro.json.html) macro to also be used.

```rust
use serde::{Deserialize, Serialize};
use serde_json::json;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::opt::Resource;
use surrealdb::{Error, Surreal};

#[derive(Debug, Serialize, Deserialize)]
struct Student {
    name: String,
    class_id: u32,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // Connect to the database server
    let db = Surreal::new::<Ws>("localhost:8000").await?;

    // Sign in into the server
    db.signin(Root {
        username: "root",
        password: "secret",
    })
    .await?;

    // Select the namespace and database to use
    db.use_ns("main").use_db("main").await?;

    let new_student = db.create(Resource::from("student")).content(json!({
        "age": 15,
        "weekly_allowance": 20.5
    })).await?;
    
    println!("{new_student}");

    Ok(())
}
```

Output:

```
{ age: 15, id: student:gp6g0p7t23musi3ms77d, weekly_allowance: 20.5f }
```

</TabItem>

</Tabs>