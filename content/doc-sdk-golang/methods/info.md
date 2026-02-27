---
sidebar_position: 1
sidebar_label: Info
title: Golang | SDK | Methods | Info
description: The Golang SDK for SurrealDB enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.Info<T>()`

This method returns the record of an authenticated scope user.

```go title="Method Syntax"
db.Info<T>()
```

### Example usage

```go
var currentUser = db.Info<User>();
```
