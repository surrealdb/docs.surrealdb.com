---
sidebar_position: 1
sidebar_label: export
title: JavaScript | SDK | Methods | export
description: The export method allows you to export the database to a file.
---

# `.export()`

This method exports data for a specific Namespace and Database. To use this method, you need to be connected to a SurrealDB instance that is version `>= 2.1.0`. 

It returns a promise that resolves to a string containing the exported SurrealQL statements that can be used to recreate the database state.

```ts title="Method Syntax"
db.export(options?: {
  tables?: string[] | boolean;
  functions?: boolean;
})
```

### Example usage

```ts
// Export everything
const result = await db.export();

// Export specific tables only
const specificTables = await db.export({
  tables: ["foo", "bar"]
});

// Export functions only
const functionsOnly = await db.export({
  functions: true,
  tables: false
});
```

```surql title="Example SurrealQL"
// Create some data
db.query(`
    DEFINE TABLE foo SCHEMALESS;
    DEFINE TABLE bar SCHEMALESS;
    CREATE foo:1 CONTENT { hello: "world" };
    CREATE bar:1 CONTENT { hello: "world" };
    DEFINE FUNCTION fn::foo() {
      RETURN "bar";
    };
`)

// Export specific tables only
db.export({
  tables: ["foo", "bar"],
  functions: true
})

// Export functions only
db.export({
  tables: false,
  functions: true
})

// Export nothing
db.export({
  tables: false,
  functions: false
})

// Export everything
db.export()
```

