---
sidebar_position: 1
sidebar_label: Version
title: Golang | SDK | Methods | Version
description: The Golang SDK for SurrealDB enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.Version()` {#version}

Retrieves the version of the SurrealDB instance.

```go title="Method Syntax"
db.Version()
```

### Arguments

<table>
    <thead>
        <tr>
            <th colspan="2" scope="col">Arguments</th>
            <th colspan="2" scope="col">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```go
package main

import (
	"fmt"
)

//nolint:lll,govet
func ExampleVersion() {
	
	db, err := surrealdb.New("ws://localhost:8000")
	if err != nil {
		panic(err)
	}
	if err = db.Use("test", "test"); err != nil { // set your namespace/database
		panic(err)
	}
	token, err := db.SignIn(&surrealdb.Auth{ // replace with your auth
		Username: "root",
		Password: "root",
	})
	if err != nil {
		panic(err)
	}
	if err = db.Authenticate(token); err != nil {
		panic(err)
	}
	v, err := ws.Version()
	if err != nil {
		panic(err)
	}
	fmt.Printf("VersionData (WebSocket): %+v\n", v)

	http := newSurrealDBHTTPConnection("version")
	v, err = http.Version()
	if err != nil {
		panic(err)
	}
	fmt.Printf("VersionData (HTTP): %+v\n", v)

	// You get something like below depending on your SurrealDB version:
	//
	// VersionData (WebSocket): &{Version:2.3.7 Build: Timestamp:}
	// VersionData (HTTP): &{Version:2.3.7 Build: Timestamp:}
}
```
