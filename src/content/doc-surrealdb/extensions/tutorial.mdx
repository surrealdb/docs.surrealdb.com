---
sidebar_position: 2
sidebar_label: Quick tutorial
title: Quick tutorial
description: A quick tutorial showing the steps involved in turning regular Rust code into SurrealDB-accessible WASM functions.
---

## Getting started: regular Rust code

To start, depending on your platform you may need to add this line in your `Cargo.toml` to instruct cargo to generate a .wasm file instead of the standard .rlib file:

```toml
[lib]
crate-type = [ "cdylib" ]
```

With that scaffolding out of the way, lets assume you have a `lib.rs` file that has three functions that you would like to call using SurrealQL.

One is a simple function that returns a bool.

```rust
fn can_drive(age: i64) -> bool {
    age >= 18
}
```

The second returns a `Result`.

```rust
fn parse_number(input: String) -> Result<i64, ParseIntError> {
    input.parse::<i64>()
}
```

And the third returns a `User` struct via a function called `random_user()` which uses the [fake](https://docs.rs/fake/4.4.0/fake/index.html) crate to create a user with a random English first name, French middle name, and German last name. This struct is annotated with the `SurrealValue` trait, allowing its return value to be understood on the SurrealDB side.

```rust
#[derive(Debug, SurrealValue)]
pub struct User {
    first_name: String,
    middle_name: String,
    last_name: String,
	age: i32
}

pub fn random_user() -> User {
    User {
        first_name: FirstName(EN).fake(),
        middle_name: FirstName(FR_FR).fake(),
        last_name: LastName(DE_DE).fake(),
		age: random_range(10..=50)
    }
}
```

Here is all of the code.

```rust
use fake::faker::name::raw::*;
use fake::{Fake, locales::*};
use rand::random_range;
use surrealdb_types::SurrealValue;
use std::num::ParseIntError;

#[derive(Debug, SurrealValue)]
pub struct User {
    first_name: String,
    middle_name: String,
    last_name: String,
	age: i32
}

fn can_drive(age: i64) -> bool {
    age >= 18
}

fn parse_number(input: String) -> Result<i64, ParseIntError> {
    input.parse::<i64>()
}

pub fn random_user() -> User {
    User {
        first_name: FirstName(EN).fake(),
        middle_name: FirstName(FR_FR).fake(),
        last_name: LastName(DE_DE).fake(),
		age: random_range(10..=50)
    }
}
```

## Annotating functions and adding surrealism.toml

To allow these functions to be accessed from SurrealDB, first we can add Surrealism to Cargo. We'll also add `surrealdb-types`, which provides access to the `SurrealValue` trait above. The command `cargo add surrealism,surrealdb-types` will do the job. Note that the entire `surrealdb` repo is not necessary!

The functions that we want to call from inside SurrealQL can now be exposed by adding the `#[surrealism]` annotation.

```rust
use fake::faker::name::raw::*;
use fake::{Fake, locales::*};
use rand::random_range;
use surrealdb_types::SurrealValue;
use surrealism::surrealism;
use std::num::ParseIntError;

#[derive(Debug, SurrealValue)]
pub struct User {
    first_name: String,
    middle_name: String,
    last_name: String,
	age: i32
}

#[surrealism]
fn can_drive(age: i64) -> bool {
    age >= 18
}

#[surrealism]
fn parse_number(input: String) -> Result<i64, ParseIntError> {
    input.parse::<i64>()
}

#[surrealism]
pub fn random_user() -> User {
    User {
        first_name: FirstName(EN).fake(),
        middle_name: FirstName(FR_FR).fake(),
        last_name: LastName(DE_DE).fake(),
		age: random_range(10..=50)
    }
}
```

You also need to add a `surrealism.toml` file. This file currently does not do much but in future versions will be used for function versioning, capabilities, and so on.

```toml
[package]
organisation = "surrealdb"
name = "demo"
version = "1.0.0"

[capabilities]
allow_scripting = true
allow_arbitrary_queries = true
allow_functions = ["fn::test"]
allow_net = ["127.0.0.1:8080"]
```

With this setup done, the Rust code can now be compiled to WASM via the [`module build`](/docs/surrealdb/cli/module) command in the CLI. This is followed with the `--out` flag and the output file name/path (e.g. `demo.surli`). If you are in a separate folder, you can follow this with the path to the Rust code with the functions to expose.

```bash
surreal module build --out demo.surli /Users/my_name/my_rust_code
```

The file will now be compiled at either your current location or the one specified like in the command above: `/Users/my_name/my_rust_code`.

That's the WASM plugin file that SurrealDB can point to!

## Calling the Surrealism file from SurrealDB

The Surrealism file is ready to be used. All that is left now is to start a database with two environment variables. They are:

* `SURREAL_CAPS_ALLOW_EXPERIMENTAL=files,surrealism`, which allows the [files](/docs/surrealql/statements/define/bucket) and surrealism features to be used in the first place. Files can be used in SurrealDB once a `DEFINE BUCKET` statement has been used to set up the location for the files to be stored.
* `SURREAL_BUCKET_FOLDER_ALLOWLIST="/Users/my_name/my_rust_code/"`, which tells the database that it's okay to access this folder when using the files feature.

Now it's time to [start the database](/docs/surrealdb/cli/start) with the `surreal start` command and these two env vars.

```bash
SURREAL_CAPS_ALLOW_EXPERIMENTAL=files,surrealism SURREAL_BUCKET_FOLDER_ALLOWLIST="/Users/my_name/my_rust_code/" surreal start --user root --pass secret
```

You can then connect through [surrealist](/docs/surrealist) or the CLI with the [surreal sql](/docs/surrealdb/cli/sql) command:

```bash
SURREAL_CAPS_ALLOW_EXPERIMENTAL=files,surrealism SURREAL_BUCKET_FOLDER_ALLOWLIST="/Users/my_name/my_rust_code/" surreal sql --user root --pass secret
```

We're almost there! Only two statements left and we can start accessing these functions.

The first is a [DEFINE BUCKET](/docs/surrealql/statements/define/bucket) statement to create a bucket called `test`, linked to the folder that we have allowed the database to access. The "file:/" prefix in this statement tells the `DEFINE BUCKET` statement that this path is to a file, not temporary storage in memory.

```surql
DEFINE BUCKET test BACKEND "file:/users/my_name/my_rust_code";
```

Now that we have a bucket called `test`, the `demo.surli` file will be available to us at the f"test:/demo.surli" path. The `f` there is an instruction to treat the string as a file path instead of just a regular string.

Then we can [define a module](/docs/surrealql/statements/define/module) which will hold all the tests. We'll call it `mod::test` and use `AS` to connect it to the file.

```surql
DEFINE MODULE mod::test AS f"test:/demo.surli";
```

And now the magic begins! Let's give the `parse_number()` function a try, now available at the `mod::test::parse_number` path.

```surql
mod::test::parse_number("10");
-- 10
mod::test::parse_number("Hi I'm number");
-- 'Thrown error: WASM function returned error: invalid digit found in string'
```

Next, we can use `random_user()` to create some random users.

```surql
CREATE user CONTENT mod::test::random_user();
-- [{ age: 18, first_name: 'Thomas', id: user:hr8ohmn36zrpv3zthhnf, last_name: 'Meier', middle_name: 'Ninon' }]
CREATE user CONTENT mod::test::random_user();
-- [{ age: 13, first_name: 'Verda', id: user:zg0ucdjizdp71fzq9syc, last_name: 'Schuster', middle_name: 'Clarisse' }]
CREATE user CONTENT mod::test::random_user();
-- [{ age: 45, first_name: 'Zelda', id: user:rulp2bf82twrh94ifhsh, last_name: 'Berger', middle_name: 'Noah' }]
```

That leaves us with one function left to try out, the `can_drive()` function.

```surql
SELECT 
    first_name + ' ' + middle_name + ' ' + last_name AS name, 
    mod::test::can_drive(age) AS can_drive
FROM user;
```

Two of them can drive, but not Verda Clarisse Schuster who is far too young.

```surql
[
    { can_drive: true,  name: 'Thomas Ninon Meier' }, 
    { can_drive: true,  name: 'Zelda Noah Berger' }, 
    { can_drive: false, name: 'Verda Clarisse Schuster' }
]
```