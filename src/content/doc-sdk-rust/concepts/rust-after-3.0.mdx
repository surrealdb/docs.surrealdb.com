---
sidebar_position: 9
sidebar_label: Types after 3.0
title: Using the Rust crate after SurrealDB 3.0
description: Many structural changes were implemented in SurrealDB 3.0, bringing large improvements to working with types in the Rust SDK.
---

# The `surrealdb-types` crate

The largest user experience improvement for Rust users of SurrealDB 3.0 is the [surrealdb-types](https://crates.io/crates/surrealdb-types) crate, which was created to have a shared public value type system for SurrealDB.

This crate was separated from the SurrealDB core to decouple types and type conversions from core database logic, and to allow other crates to make use of types on their own without needing the entire SurrealDB database along with it.

## The `SurrealValue` trait

The main difference between SurrealDB 3.0 and previous versions for Rust users is the existence of a `SurrealValue` trait that can be derived automatically. Deriving this trait is all that is needed to use a Rust type for serialization and deserialization.

```rust
use surrealdb::engine::any::connect;
use surrealdb_types::SurrealValue;

#[derive(Debug, SurrealValue)]
struct Employee {
    name: String,
    active: bool,
}

#[tokio::main]
async fn main() {
    let db = connect("memory").await.unwrap();

    db.use_ns("ns").use_db("db").await.unwrap();

    let mut res = db
        .query("CREATE employee:bobby SET name = 'Bobby', active = true")
        .await
        .unwrap();

    let bobby = res.take::<Option<Employee>>(0).unwrap().unwrap();

    // Employee { name: "Bobby", active: true }
    println!("{bobby:?}");
}
```

The `SurrealValue` trait can be implemented manually via three methods: one to indicate the matching SurrealDB type, a second to convert into a SurrealDB Value, and a third to convert out of a SurrealDB Value.

```rust
#[derive(Debug)]
struct MyOwnDateTime(i64);

impl SurrealValue for MyOwnDateTime {
    fn kind_of() -> surrealdb_types::Kind {
        Kind::Datetime
    }

    fn into_value(self) -> surrealdb_types::Value {
        Value::Datetime(Datetime::from_timestamp(self.0, 0).unwrap())
    }

    fn from_value(value: surrealdb_types::Value) -> anyhow::Result<Self>
    where
        Self: Sized,
    {
        match value {
            Value::Datetime(n) => Ok(MyOwnDateTime(n.timestamp_millis())),
            _ => Err(anyhow!("No good")),
        }
    }
}

#[tokio::main]
async fn main() {
    let db = connect("memory").await.unwrap();

    db.use_ns("ns").use_db("db").await.unwrap();

    println!(
        "{:?}",
        db.query("time::now()")
            .await
            .unwrap()
            .take::<Option<MyOwnDateTime>>(0)
    );
}
```

An example of successful and unsuccessful conversions into the usercreated `MyOwnDateTime` struct:

```rust
#[tokio::main]
async fn main() {
    let db = connect("memory").await.unwrap();

    db.use_ns("ns").use_db("db").await.unwrap();

    println!(
        "{:?}\n",
        db.query("time::now()")
            .await
            .unwrap()
            .take::<Option<MyOwnDateTime>>(0)
    );

    println!(
        "{:?}",
        db.query("CREATE person")
            .await
            .unwrap()
            .take::<Option<MyOwnDateTime>>(0)
    );
}
```

Output:

```
Ok(Some(MyOwnDateTime(1760330504574)))

Err(InternalError("Couldn't convert Object(Object({\"id\": RecordId(RecordId { table: \"person\", key: String(\"tcblzaktx3ponin9dyci\") })})) to MyOwnDateTime"))
```

## The `kind!` macro

This crate includes a `kind!` macro which allows a SurrealQL type to be used directly instead of its Rust equivalent.

This macro is especially useful when working with types like [literals](/docs/surrealql/datamodel/literals) which are similar to enums but can specify exact possible values in a way that Rust would require deriving `TryFrom` to work. In this case, the `SurrealValue` trait can be implemented manually and the `kind!` macro used for its `kind_of()` method.

```rust
fn kind_of() -> surrealdb_types::Kind {
    kind!({ status: "good" } | { status: "goodwithnotification", notification: string} | { status: "error", at: datetime, reason: string })
}
```

This is technically possible without the macro, but requires a lot more boilerplate. Here is the output when using `cargo expand` to show the generated code for the example above.

```rust
fn kind_of() -> surrealdb_types::Kind {
    surrealdb_types::Kind::Either(
        vec!([
            surrealdb_types::Kind::Literal(
                surrealdb_types::KindLiteral::Object(
                    std::collections::BTreeMap::from([
                        (
                            "status".to_string(),
                            surrealdb_types::Kind::Literal(
                                surrealdb_types::KindLiteral::String("good".to_string()),
                            ),
                        ),
                    ]),
                ),
            ),
            surrealdb_types::Kind::Literal(
                surrealdb_types::KindLiteral::Object(
                    std::collections::BTreeMap::from([
                        (
                            "status".to_string(),
                            surrealdb_types::Kind::Literal(
                                surrealdb_types::KindLiteral::String(
                                    "goodwithnotification".to_string(),
                                ),
                            ),
                        ),
                        ("notification".to_string(), surrealdb_types::Kind::String),
                    ]),
                ),
            ),
            surrealdb_types::Kind::Literal(
                surrealdb_types::KindLiteral::Object(
                    std::collections::BTreeMap::from([
                        (
                            "status".to_string(),
                            surrealdb_types::Kind::Literal(
                                surrealdb_types::KindLiteral::String("error".to_string()),
                            ),
                        ),
                        ("at".to_string(), surrealdb_types::Kind::Datetime),
                        ("reason".to_string(), surrealdb_types::Kind::String),
                    ]),
                ),
            ),
            ]),
        ),
}
```

The following example shows the `kind!` macro used for a Rust enum that manually implements `SurrealValue`, along with examples of its use from the Rust side to the SurrealDB side, and vice versa.

```rust
#[derive(SurrealValue)]
struct Error {
    at: Datetime,
    reason: String,
}

enum Response {
    Good,
    GoodWithNotification(String),
    Error(Error),
}

impl SurrealValue for Response {
    fn kind_of() -> surrealdb_types::Kind {
        kind!({ status: "good" } | { status: "goodwithnotification", notification: string} | { status: "error", at: datetime, reason: string })
    }

    fn into_value(self) -> Value {
        let mut obj = Object::new();
        match self {
            Response::Good => {
                obj.insert("status", "good");
            }
            Response::GoodWithNotification(n) => {
                obj.insert("status", "goodwithnotification");
                obj.insert("notification", n);
            }
            Response::Error(e) => {
                obj.insert("status", "error");
                obj.insert("at", e.at);
                obj.insert("reason", e.reason);
            }
        }
        Value::Object(obj)
    }

    fn from_value(value: Value) -> anyhow::Result<Self>
    where
        Self: Sized,
    {
        let Value::Object(o) = value else {
            return Err(anyhow!("Should have been an object"));
        };
        let Some(Value::String(status)) = o.get("status") else {
            return Err(anyhow!("Error trying to get 'status' field"));
        };
        match status.as_str() {
            "Good" => Ok(Response::Good),
            status @ "GoodWithNotification" => {
                Ok(Response::GoodWithNotification(status.to_string()))
            }
            "Error" => {
                let Some(Value::Datetime(at)) = o.get("at") else {
                    return Err(anyhow!("Error trying to get 'at' field"));
                };
                let Some(Value::String(reason)) = o.get("reason") else {
                    return Err(anyhow!("Error trying to get 'reason' field"));
                };
                Ok(Response::Error(Error {
                    at: at.clone(),
                    reason: reason.clone(),
                }))
            }
            _ => Err(anyhow!("No status field for some reason")),
        }
    }

    fn is_value(value: &Value) -> bool {
        value.is_kind(&Self::kind_of())
    }
}

use surrealdb::engine::any::connect;
use surrealdb_types::{
    Datetime, Object, SurrealValue, ToSql, Value,
    anyhow::{self, anyhow},
    kind,
};

#[tokio::main]
async fn main() {
    let db = connect("memory").await.unwrap();
    db.use_ns("main").use_db("main").await.unwrap();

    // Turning DB results into Rust enum
    let mut statuses = db.query("
        { status: 'Good' };
        { status: 'GoodWithNotification', notification: 'We need things to make us go. We need help.' };
        { status: 'Error', at: d'1914-07-28', reason: 'General conflagration'};
    ").await.unwrap();

    println!(
        "Good: {}",
        statuses
            .take::<Option<Response>>(0)
            .unwrap()
            .unwrap()
            .into_value()
            .to_sql_pretty()
    );
    println!(
        "Good with notification: {}",
        statuses
            .take::<Option<Response>>(1)
            .unwrap()
            .unwrap()
            .into_value()
            .to_sql_pretty()
    );
    println!(
        "Error: {}",
        statuses
            .take::<Option<Response>>(2)
            .unwrap()
            .unwrap()
            .into_value()
            .to_sql_pretty()
    );

    // Turn Rust enum into Values,
    // use them in the CONTENT clause
    // and then print the result
    let good = Response::Good;
    let good_but = Response::GoodWithNotification("Keep it up!".into());
    let error = Response::Error(Error {
        at: Datetime::now(),
        reason: "Error: can't think of interesting error message".into(),
    });

    println!(
        "Good: {:?}",
        db.query("CREATE result CONTENT $content")
            .bind(("content", good))
            .await
            .unwrap()
            .take::<Option<Value>>(0)
            .unwrap()
            .unwrap()
            .to_sql()
    );
    println!(
        "Good but: {:?}",
        db.query("CREATE result CONTENT $content")
            .bind(("content", good_but))
            .await
            .unwrap()
            .take::<Option<Value>>(0)
            .unwrap()
            .unwrap()
            .to_sql()
    );
    println!(
        "Error: {:?}",
        db.query("CREATE result CONTENT $content")
            .bind(("content", error))
            .await
            .unwrap()
            .take::<Option<Value>>(0)
            .unwrap()
            .unwrap()
            .to_sql()
    );
}
```

## Convenience methods for the `Value` type

Importing the `SurrealValue` trait gives access to a lot of convenience methods.

One example is the `.into_value()` method which converts a large number of Rust standard library types into a SurrealQL `Value`.

```rust
use surrealdb_types::{SurrealValue, Value};

fn main() {
    let string_val = "string".into_value();
    assert!(string_val.is_string());
    assert_eq!(string_val, Value::String("string".into()));
}
```

One more example of `.into_value()` to convert a `HashMap<String, &'str>` into a `Value`:

```rust
use std::collections::HashMap;

use surrealdb::engine::any::connect;
use surrealdb_types::{SurrealValue, Value};

#[tokio::main]
async fn main() {
    let db = connect("memory").await.unwrap();
    db.use_ns("db").use_db("db").await.unwrap();

    let mut map = HashMap::new();
    map.insert("name".to_string(), "Billy");
    map.insert("id".to_string(), "person:one");

    // Turn HashMap into SurrealDB Value
    let as_person = map.into_value();

    // Object(Object({"id": String("person:one"), "name": String("Billy")}))
    println!("{as_person:?}");

    // Insert it into a query to create a record
    let res = db
        .query("CREATE ONLY person CONTENT $person")
        .bind(("person", as_person))
        .await
        .unwrap()
        .take::<Value>(0)
        .unwrap();

    // Object(Object({"id": RecordId(RecordId { table: "person", key: String("person:one") }), "name": String("Billy")}))
    println!("{res:?}");
}
```

A `Value` can be manually constructed using any of the various structs and enums contained within it. This is particularly useful when constructing a complex ID made up of a table name and an array for the key.

```rust
use std::str::FromStr;

use surrealdb::engine::any::connect;
use surrealdb_types::{Array, Datetime, RecordId, RecordIdKey, Value};

#[tokio::main]
async fn main() {
    let db = connect("memory").await.unwrap();
    db.use_ns("db").use_db("db").await.unwrap();

    let date = "2025-10-13T05:16:11.343Z";

    let complex_id = RecordId {
        table: "weather".into(),
        key: RecordIdKey::Array(Array::from(vec![
            Value::String("London".to_string()),
            Value::Datetime(Datetime::from_str(date).unwrap()),
        ])),
    };

    let mut res = db
        .query("CREATE ONLY weather SET id = $id")
        .bind(("id", complex_id))
        .await
        .unwrap();

    // Object(Object({"id": RecordId(RecordId { table: "weather", key: Array(Array([String("London"), Datetime(Datetime(2025-10-13T05:16:11.343Z))])) })}))
    println!("{:?}", res.take::<Value>(0).unwrap());
}
```

The `.is()` method for a `Value` returns `true` if the type(s) in question can be converted to the type indicated when the method is called.

```rust
use std::collections::HashMap;
use surrealdb_types::SurrealValue;

fn main() {
    // true
    println!("{}", "string".into_value().is::<String>());

    let mut map = HashMap::new();
    map.insert("name".to_string(), "Billy");
    map.insert("id".to_string(), "person:one");

    // true
    println!("{}", map.clone().into_value().is::<HashMap<String, &str>>());
    // Also true
    println!("{}", map.into_value().is::<HashMap<String, String>>());
}
```

A `Value` can be converted into a `serde_json::Value` using the `.into_json_value()` method, and vice versa using `.into_value()`.

```rust
use surrealdb::engine::any::connect;
use surrealdb_types::Value;

#[tokio::main]
async fn main() {
    let db = connect("memory").await.unwrap();
    db.use_ns("db").use_db("db").await.unwrap();

    let value = db
        .query("CREATE ONLY person:one SET age = 21")
        .await
        .unwrap()
        .take::<Value>(0)
        .unwrap();

    // Object(Object({"age": Number(Int(21)), "id": RecordId(RecordId { table: "person", key: String("one") })}))
    println!("{value:?}");
    // Object {"age": Number(21), "id": String("person:one")}
    println!("{:?}", value.into_json_value());

    // Round trip
    value.into_json_value().into_value();
}
```

## Enum and struct attributes

The `SurrealValue` trait can be customised using the `surreal` attribute. These are used in a similar way to [Serde attributes](https://serde.rs/attributes.html), though created in order to interact with SurrealQL in particular and thus often somewhat different.

The currently available attributes are as follows.

### `surreal(default)`

The `surreal(default)` attribute is used to default to certain values when these values are not present when deserializing. The `Default` trait is required to use this.

```rust
use surrealdb::engine::any::connect;
use surrealdb_types::{SurrealValue, ToSql};

#[derive(SurrealValue)]
struct UserData {
    num: i32,
    other_num: i32,
}

#[derive(SurrealValue)]
#[surreal(default)]
struct UserDataDefault {
    num: i32,
    other_num: i32,
}

impl Default for UserDataDefault {
    fn default() -> Self {
        UserDataDefault {
            num: 10,
            other_num: 20,
        }
    }
}

#[tokio::main]
async fn main() {
    let db = connect("memory").await.unwrap();
    db.use_ns("ns").use_db("db").await.unwrap();

    let mut has_two_fields = db
        .query("CREATE user SET num = 10, other_num = 20")
        .await
        .unwrap();

    let mut has_one_field = db.query("CREATE user SET num = 5").await.unwrap();

    println!(
        "Regular deserialization from DB result: {}",
        has_two_fields
            .take::<Option<UserData>>(0)
            .unwrap()
            .unwrap()
            .into_value()
            .to_sql()
    );

    println!(
        "Deserialization using DB result plus default value: {}",
        has_one_field
            .take::<Option<UserDataDefault>>(0)
            .unwrap()
            .unwrap()
            .into_value()
            .to_sql()
    )
}
```

```bash title="Output"
Regular deserialization from DB result: { num: 10, other_num: 20 }
Deserialization using DB result plus default value: { num: 5, other_num: 20 }
```

### `surreal(rename)`

The `surreal(rename)` attribute is used to provide a different name for a field on the SurrealDB side than the one used in the Rust code.

```rust
use surrealdb_types::{SurrealValue, ToSql};

#[derive(SurrealValue)]
struct UserData {
    num: i32,
}

#[derive(SurrealValue)]
struct UserDataRename {
    #[surreal(rename = "user_num")]
    num: i32,
}

fn main() {
    let user_data = UserData { num: 555 };
    let user_data_rename = UserDataRename { num: 555 };

    println!("Before rename: {}", user_data.into_value().to_sql());
    println!("After rename: {}", user_data_rename.into_value().to_sql());
}
```

```title = "Output"
Before rename: { num: 555 }
After rename: { user_num: 555 }
```

### `surreal(uppercase)` and `surreal(lowercase)`

These two attributes are similar to `surreal(rename)` except that they apply to the casing of enum variants.

```rust
use surrealdb_types::{SurrealValue, ToSql};

#[derive(SurrealValue)]
enum LogLevel {
    Debug(String),
    Info(String),
}

#[derive(SurrealValue)]
#[surreal(uppercase)]
enum LogLevelUpper {
    Debug(String),
    Info(String),
}

#[derive(SurrealValue)]
#[surreal(lowercase)]
enum LogLevelLower {
    Debug(String),
    Info(String),
}

fn main() {
    let log_level = LogLevel::Debug("User1".into());
    let log_level_upper = LogLevelUpper::Debug("User1".into());
    let log_level_lower = LogLevelLower::Debug("User1".into());

    println!("Before attribute: {}", log_level.into_value().to_sql());
    println!("After uppercase: {}", log_level_upper.into_value().to_sql());
    println!("After lowercase: {}", log_level_lower.into_value().to_sql());
}
```

```bash title = "Output"
Before attribute: { Debug: 'User1' }
After uppercase: { DEBUG: 'User1' }
After lowercase: { debug: 'User1' }
```

### `surreal(tuple)`

As SurrealQL does not have a tuple type, this attribute can be used to interface in which a Rust tuple struct is treated as an array (instead of a single value) and vice versa.

```rust
use surrealdb_types::{SurrealValue, ToSql};

#[derive(SurrealValue)]
struct UserData(i32);

#[derive(SurrealValue)]
#[surreal(tuple)]
struct UserDataTuple(i32);

fn main() {
    println!(
        "Without tuple attribute: {}",
        UserData(555).into_value().to_sql()
    );
    println!(
        "With tuple attribute: {}",
        UserDataTuple(555).into_value().to_sql()
    );
}
```

```bash title="Output"
Without tuple attribute: 555
With tuple attribute: [555]
```

### `surreal(untagged)`

The `surreal(untagged)` attribute removes the tag from the variant of an enum. This is similar to using `VALUE` in SurrealQL to show only the value and not the field name of a record.


```rust
use surrealdb_types::{SurrealValue, ToSql};

#[derive(SurrealValue)]
enum LogLevel {
    Debug(String),
    Info(String),
}

#[derive(SurrealValue)]
#[surreal(untagged)]
enum LogLevelUntagged {
    Debug(String),
    Info(String),
}

fn main() {
    let log_level = LogLevel::Debug("User1".into());
    let log_level_untagged = LogLevelUntagged::Debug("User1".into());

    println!("Before untagged: {}", log_level.into_value().to_sql());
    println!(
        "After untagged: {}",
        log_level_untagged.into_value().to_sql()
    );
}
```


```bash title="Output"
Before untagged: { Debug: 'User1' }
After untagged: 'User1'
```

### `surreal(tag)`

The `surreal(tag)` attribute can be used to give a tag to a variant. This will create a structure in which the new tag value is the field name, and the variant its value.

```rust
use surrealdb_types::{SurrealValue, ToSql};

#[derive(SurrealValue)]
enum LogLevel {
    Debug,
    Info,
}

#[derive(SurrealValue)]
#[surreal(tag = "log_level")]
enum LogLevelTag {
    Debug,
    Info,
}

fn main() {
    let log_level = LogLevel::Debug;
    let log_level_tag = LogLevelTag::Debug;
    println!("\n___surreal(tag)___");
    println!("Before tag: {}", log_level.into_value().to_sql());
    println!("After tag: {}", log_level_tag.into_value().to_sql());
}
```

```bash title="Output"
Before tag: { Debug: {  } }
After tag: { log_level: 'Debug' }
```

### `surreal(content)`

While the `surreal(tag)` attribute on its own can only be used on variants that do not hold data, the `surreal(content)` makes this possible.

```rust
use surrealdb_types::{SurrealValue, ToSql};

#[derive(SurrealValue)]
enum LogLevel {
    Debug(String),
    Info(String),
}

#[derive(SurrealValue)]
#[surreal(tag = "log_level", content = "user")]
enum LogLevelContent {
    Debug(String),
    Info(String),
}

fn main() {
    let log_level = LogLevel::Debug("User1".to_string());
    let log_level_tag = LogLevelContent::Debug("User1".to_string());

    println!("Before content: {}", log_level.into_value().to_sql());
    println!("After content: {}", log_level_tag.into_value().to_sql());
}
```

```bash title="Output"
Before content: { Debug: 'User1' }
After content: { log_level: 'Debug', user: 'User1' }
```

### `surreal(value)`

This attribute can be used on the fields of an enum marked with `surreal(untagged)` to give it a substitute value. The value that follows this attribute can be a NONE, NULL, bool, string, int, or float.

```rust
use surrealdb_types::{SurrealValue, ToSql};

fn main() {
    #[derive(Clone, Debug, SurrealValue)]
    #[surreal(untagged)]
    pub enum LogLevel {
        Regular,
        Verbose,
        Off,
    }

    #[derive(Clone, Debug, SurrealValue)]
    #[surreal(untagged)]
    pub enum LogLevelValue {
        #[surreal(value = "info")]
        Regular,
        #[surreal(value = "debug")]
        Verbose,
        #[surreal(value = NONE)]
        Off,
    }

    println!("Only untagged: {}", LogLevel::Off.into_value().to_sql());
    println!(
        "Untagged plus value: {}",
        LogLevelValue::Off.into_value().to_sql()
    );
}
```

```bash title="Output"
With only untagged: 'Off'
With untagged plus substitute value: NONE
```

### More examples

Here are some more examples from the SurrealDB source code showing how the `surreal` attribute can be used.

```rust
use surrealdb_types::SurrealValue;

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(untagged)]
enum EnumMixedWithValue {
    #[surreal(value = false)]
    None,
    Some(Vec<String>),
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(tag = "tag", content = "content")]
enum EnumTaggedWithTagAndContent {
    Foo,
    Bar { prop: String },
    Baz(String),
    Qux(String, i64),
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(tag = "tag", content = "content", lowercase)]
enum EnumTaggedWithTagAndContentLowercase {
    Foo,
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(tag = "tag", content = "content", uppercase)]
enum EnumTaggedWithTagAndContentUppercase {
    Foo,
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(tag = "tag")]
enum EnumTaggedWithTag {
    Foo,
    Bar { prop: String },
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(tag = "tag", lowercase)]
enum EnumTaggedWithTagLowercase {
    Foo,
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(tag = "tag", uppercase)]
enum EnumTaggedWithTagUppercase {
    Foo,
}

#[derive(SurrealValue, Debug, PartialEq)]
enum EnumTaggedVariant {
    Foo,
    Bar { prop: String },
    Baz(String),
    Qux(String, i64),
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(lowercase)]
enum EnumTaggedVariantLowercase {
    Foo,
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(uppercase)]
enum EnumTaggedVariantUppercase {
    Foo,
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(untagged)]
enum EnumUnitValue {
    #[surreal(value = true)]
    True,
    #[surreal(value = false)]
    False,
    #[surreal(value = null)]
    Null,
    #[surreal(value = none)]
    None,
    #[surreal(value = "Hello")]
    String,
    #[surreal(value = 123)]
    Int,
    #[surreal(value = 123.45)]
    Float,
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(untagged)]
enum EnumUntagged {
    Foo,
    Bar,
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(untagged, lowercase)]
enum EnumUntaggedLowercase {
    Foo,
    Bar,
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(untagged, uppercase)]
enum EnumUntaggedUppercase {
    Foo,
    Bar,
}

#[derive(SurrealValue, Debug, PartialEq)]
struct PersonRenamed {
    #[surreal(rename = "full_name")]
    name: String,
    #[surreal(rename = "years_old")]
    age: i64,
}

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(tuple)]
struct StringWrapperTuple(String);

#[derive(SurrealValue, Debug, PartialEq)]
#[surreal(value = true)]
struct UnitStructWithValue;

#[derive(Clone, Debug, SurrealValue, PartialEq)]
#[surreal(default)]
struct TestDefault {
    str: String,
    boolean: bool,
    optional: Option<String>,
}

impl Default for TestDefault {
    fn default() -> Self {
        TestDefault {
            str: "default".to_string(),
            boolean: true,
            optional: None,
        }
    }
}

fn main() {}
```