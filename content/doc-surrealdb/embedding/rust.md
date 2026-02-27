---
sidebar_position: 2
sidebar_label: Embedding SurrealDB in Rust
title: Embedding SurrealDB in Rust
description: The documentation for embedding SurrealDB in Rust.
---

import Image from "@components/Image.astro";
import LightLogo from "@img/icon/light/rust.png";
import DarkLogo from "@img/icon/dark/rust.png";

<div class="flag-title">
	<Image
		alt="Rust"
		width={42}
		height={42}
		src={{
			light: LightLogo,
			dark: DarkLogo,
		}}
	/>
	# Embedding in Rust
</div>

SurrealDB can be run as an embedded database within your Rust application, allowing you to use SurrealDB without running a separate server process. This is ideal for desktop applications, testing, local development, and edge computing scenarios.

## Embedded Database Options

SurrealDB supports multiple types of embedded storage in Rust:

- **In-Memory Database** (`Mem`) - Fastest performance with data stored in RAM. Perfect for testing, caching, or temporary data. Data is lost when the connection closes.

- **File-Based Database** (`RocksDb` or `SurrealKV`) - Persistent storage on disk using RocksDB or SurrealKV storage engines. Data persists across connections and application restarts.

## Quick Example

```rust
use surrealdb::engine::local::Mem;
use surrealdb::Surreal;

// In-memory database
let db = Surreal::new::<Mem>(()).await?;
db.use_ns("test").use_db("test").await?;
let person = db.create("person").content(Person { name: "John Doe" }).await?;
println!("{:?}", person);

// File-based persistent database (RocksDB)
use surrealdb::engine::local::RocksDb;
let db = Surreal::new::<RocksDb>("./mydb").await?;
db.use_ns("test").use_db("test").await?;
let company = db.create("company").content(Company { name: "TechStart" }).await?;
println!("{:?}", company);
```

For complete documentation, installation instructions, examples, best practices, and troubleshooting, see the [Rust SDK embedding guide](/docs/sdk/rust/embedding).
