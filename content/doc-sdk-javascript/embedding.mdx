---
sidebar_position: 7
sidebar_label: Embedding
title: Embedding SurrealDB | JavaScript SDK | Integration
description: Learn how to run SurrealDB as an embedded database within your JavaScript application using in-memory, IndexedDB, or SurrealKV storage.
---

# Embedding SurrealDB

SurrealDB is designed to be run in many different ways and environments. Due to the separation of the storage and compute layers, SurrealDB can be run in embedded mode from within JavaScript environments. In JavaScript, SurrealDB can be run as an [in-memory database](#in-memory-database), or it can persist data using [IndexedDB](#indexeddb-persistence-browser) in browser environments or [SurrealKV](#surrealkv-persistence-server) in server environments.

## In-Memory Database

The in-memory database is perfect for embedded applications, development, testing, caching, or temporary data. It provides the fastest performance as all data is stored in RAM, but data is lost when the connection closes.

### Installation

The embedded database functionality requires installing both the JavaScript SDK and the appropriate engine plugin:

```bash
npm install surrealdb @surrealdb/node  # For Node.js server environments
# or
npm install surrealdb @surrealdb/wasm  # For browser environments
```

> [!NOTE]
> The JavaScript SDK works seamlessly with SurrealDB versions v2.0.0 to v2.3.6, ensuring compatibility with the latest features.

### Using the in-memory database

The simplest way to use an in-memory database instance of SurrealDB is to connect with the `mem://` endpoint after configuring the appropriate engine.

**Node.js example:**

```js
import { Surreal } from 'surrealdb';
import { surrealdbNodeEngines } from '@surrealdb/node';

const db = new Surreal({
    engines: surrealdbNodeEngines(),
});

await db.connect("mem://");
await db.use({ namespace: "test", database: "test" });

// Create a person
const person = await db.create("person", {
    name: "John Doe",
    age: 30,
    email: "john@example.com"
});
console.log("Created person:", person);

// Query all people
const people = await db.select("person");
console.log("All people:", people);

// Update the person
const updated = await db.update("person", {
    name: "John Doe",
    age: 31,
    email: "john@example.com"
});
console.log("Updated person:", updated);

// Run a SurrealQL query
const result = await db.query(
    "SELECT * FROM person WHERE age > $min_age",
    { min_age: 25 }
);
console.log("Query result:", result);

// Delete all people
await db.delete("person");
console.log("Deleted all people");

// Close the connection
await db.close();
```

**Browser example:**

```js
import { Surreal } from 'surrealdb';
import { surrealdbWasmEngines } from '@surrealdb/wasm';

const db = new Surreal({
    engines: surrealdbWasmEngines(),
});

await db.connect("mem://");
await db.use({ namespace: "test", database: "test" });

// Create a person
const person = await db.create("person", {
    name: "John Doe",
    age: 30,
    email: "john@example.com"
});
console.log("Created person:", person);
```

## IndexedDB Persistence (Browser)

The IndexedDB storage engine enables SurrealDB to persist data in browser environments using the browser's IndexedDB API. Data persists across browser sessions and page reloads.

### Installation

Install the JavaScript SDK and the WebAssembly engine:

```bash
npm install surrealdb @surrealdb/wasm
```

### Using IndexedDB persistence

The IndexedDB database can be created using the `indxdb://` endpoint with a database name.

```js
import { Surreal } from 'surrealdb';
import { surrealdbWasmEngines } from '@surrealdb/wasm';

const db = new Surreal({
    engines: surrealdbWasmEngines(),
});

// Connect to IndexedDB database
await db.connect("indxdb://mydb");
await db.use({ namespace: "test", database: "test" });

// Data persists across page reloads
const company = await db.create("company", {
    name: "TechStart"
});
console.log(company);

// After page reload, data is still available
const companies = await db.select("company");
console.log(companies);
```

> [!NOTE]
> If you are using a bundler like Vite, Webpack, or Parcel, you may need to configure it to properly handle the WebAssembly engine. For Vite, add the following to your `vite.config.js`:

```js title="vite.config.js"
optimizeDeps: {
    exclude: ["@surrealdb/wasm"],
    esbuildOptions: {
        target: "esnext",
    },
},
esbuild: {
    supported: {
        "top-level-await": true
    },
}
```

## SurrealKV Persistence (Server)

The SurrealKV storage engine enables SurrealDB to persist data to disk in server environments. It provides good performance while maintaining persistence across connections and application restarts.

### Installation

Install the JavaScript SDK and the Node.js engine:

```bash
npm install surrealdb @surrealdb/node
```

### Using SurrealKV persistence

The SurrealKV database can be created using the `surrealkv://` endpoint with a path to the database directory.

```js
import { Surreal } from 'surrealdb';
import { surrealdbNodeEngines } from '@surrealdb/node';

const db = new Surreal({
    engines: surrealdbNodeEngines(),
});

// Connect to SurrealKV database
await db.connect("surrealkv://./mydb");
await db.use({ namespace: "test", database: "test" });

// Data persists across connections
const company = await db.create("company", {
    name: "TechStart"
});
console.log(company);

// Close and reconnect
await db.close();

// Reconnect to the same database
const db2 = new Surreal({
    engines: surrealdbNodeEngines(),
});
await db2.connect("surrealkv://./mydb");
await db2.use({ namespace: "test", database: "test" });

// Data persists!
const companies = await db2.select("company");
console.log(companies);

await db2.close();
```

### SurrealKV with Versioning

You can also use SurrealKV with versioning support for temporal queries:

```js
// Since SurrealDB 3.x
await db.connect("surrealkv://./mydb?versioned=true");

// Previous versions
await db.connect("surrealkv+versioned://./mydb");
```

## Performance Considerations

### In-Memory (`mem://`)
- **Fastest**: All data in RAM
- **Non-persistent**: Data lost when connection closes
- **Best for**: Tests, caches, temporary data

### IndexedDB (`indxdb://`) - Browser Only
- **Persistent**: Data saved to browser's IndexedDB
- **Good performance**: Browser-native storage
- **Best for**: Browser applications requiring persistence

### SurrealKV (`surrealkv://`) - Server Only
- **Persistent**: Data saved to disk
- **Good performance**: SurrealKV storage engine
- **Best for**: Local apps, development, single-node deployments

## When to Use Embedded vs Remote

### Use Embedded (`mem://`, `indxdb://`, or `surrealkv://`) when:
- Building desktop applications with local data storage
- Running tests (in-memory is very fast)
- Local development without server setup
- Browser applications requiring offline functionality
- Embedded systems or edge computing devices without network access
- Single-application data storage

### Use Remote (`ws://`, `wss://`, `http://`, or `https://`):
- Multiple applications need to share data
- Building distributed systems or microservices
- Requiring scalability across multiple instances
- Cloud deployments with scalable cloud infrastructure
- Need for horizontal scaling or centralized data management

## Connection URLs

### In-Memory Database
```js
// Non-persistent, fastest performance
await db.connect("mem://");
```

### IndexedDB Database (Browser)
```js
// Persistent storage in browser
await db.connect("indxdb://database-name");
```

### SurrealKV Database (Server)
```js
// Persistent storage using file path
await db.connect("surrealkv://./path/to/database");

// With versioning support (since 3.x)
await db.connect("surrealkv://./path/to/database?versioned=true");
// With versioning support (previous versions)
await db.connect("surrealkv+versioned://./path/to/database");
```

### Remote Database (for comparison)
```js
// WebSocket connection to remote server
await db.connect("ws://localhost:8000");

// Secure WebSocket connection
await db.connect("wss://cloud.surrealdb.com");

// HTTP connection to remote server
await db.connect("http://localhost:8000");

// Secure HTTP connection
await db.connect("https://cloud.surrealdb.com");
```

## Key Differences from Remote Connections

### Authentication Behavior
Embedded databases don't require authentication, though you can still call `signin()` if needed:

```js
// Embedded - auth optional (can be skipped)
await db.connect("mem://");
await db.use({ namespace: "test", database: "test" });
// Ready to use!

// Remote - requires authentication
await db.connect("ws://localhost:8000");
await db.signin({
    username: "root",
    password: "root"
});
await db.use({ namespace: "test", database: "test" });
```

### Connection Management
With embedded databases, the connection is established immediately when calling `connect()`. Always close connections when done:

```js
// Good practice - close connection when done
await db.connect("mem://");
// Do work here
await db.close(); // Important for Node.js engine
```

> [!NOTE]
> For the Node.js engine, you must close the connection with `.close()` to prevent console warnings. This is less critical for the WebAssembly engine in browsers.

### Single Process Access
Embedded databases are accessed by a single process or browser tab. For multi-process or distributed access, use a remote SurrealDB server.

## Best Practices

### Use Appropriate Engine
- **Browser applications**: Use `@surrealdb/wasm` with `indxdb://` for persistence or `mem://` for temporary data
- **Server applications**: Use `@surrealdb/node` with `surrealkv://` for persistence or `mem://` for temporary data

### Close Connections
Always close connections when done, especially with the Node.js engine:

```js
await db.connect("surrealkv://./mydb");
// Your code here
await db.close(); // Important!
```

### Choose the Right Storage Type
- **Tests**: Use `mem://` for speed and isolation
- **Development**: Use `surrealkv://` (server) or `indxdb://` (browser) for persistence
- **Production (single-node)**: Use `surrealkv://` (server) or `indxdb://` (browser) with backups
- **Production (distributed)**: Use remote SurrealDB server

## Troubleshooting

### Import Errors
If you encounter import errors, ensure you have the correct packages installed:

```bash
npm install surrealdb @surrealdb/node  # For Node.js
# or
npm install surrealdb @surrealdb/wasm  # For browser
```

### ES Modules Requirement
Both engine plugins require ES modules (`import`), not CommonJS (`require`). Ensure your project uses ES modules or configure your bundler accordingly.

### Connection Issues
For SurrealKV databases, ensure the directory exists and you have write permissions:

```js
import { mkdir } from 'fs/promises';

const dbPath = "./mydata/database";
await mkdir(dbPath, { recursive: true });
await db.connect(`surrealkv://${dbPath}`);
```

### Performance Issues
If experiencing slow performance:
- Consider using in-memory mode for non-persistent data
- Ensure disk I/O is not a bottleneck (for SurrealKV)
- Use appropriate indexes for your queries

## Additional Resources

- [JavaScript SDK GitHub Repository](https://github.com/surrealdb/surrealdb.js)
- [Node.js Engine Documentation](/docs/sdk/javascript/engines/node)
- [WebAssembly Engine Documentation](/docs/sdk/javascript/engines/wasm)
- [SurrealQL Query Language](/docs/surrealql)
- [JavaScript SDK Documentation](/docs/sdk/javascript)
