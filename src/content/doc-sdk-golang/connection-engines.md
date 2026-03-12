---
sidebar_position: 5
sidebar_label: Connection Engines
title: Golang Connection Engines | SDKs | Integration
description: In this guide, we will walk you through setting up and querying your first project with the Golang SDK for SurrealDB.
---

# Connection Engines

There are two different connection engines you can use to connect to SurrealDb backend. You can do so via Websocket or through HTTP
connections

### Via Websocket
```go
db, err := surrealdb.New("ws://localhost:8000")
```
or for a secure connection
```go
db, err := surrealdb.New("wss://localhost:8000")
```

### Via HTTP
There are some functions that are not available on RPC when using HTTP but on Websocket. All these except
the "live" endpoint are effectively implemented in the HTTP library and provides the same result as though
it is natively available on HTTP. While using the HTTP connection engine, note that live queries will still
use a websocket connection if the backend supports it
```go
db, err := surrealdb.New("http://localhost:8000")
```
or for a secure connection
```go
db, err := surrealdb.New("https://localhost:8000")
```

### Effect of connection engine on token & session duration

The connection engine you choose affects how authentication tokens and sessions work:

With websockets connections (`ws://`, `wss://`) you open a single long-lived stateful connection where after the initial authentication, the session duration applies and if not specified, defaults to `NONE` meaning that the session never expires unless otherwise specified. 

When you connect with a HTTP connection (`http://`, `https://`), every request you make is short-lived and stateless, requiring you to authenticate every request individually for which the token is used, creating a short lived session. Hence, the token duration which defaults to 1 hour applies.

You can extend the session duration of a token or a session by setting the `DURATION` clause when creating a new access method with the [`DEFINE ACCESS METHOD`](/docs/surrealql/statements/define/access) statement or when defining a new user with the [`DEFINE USER`](/docs/surrealql/statements/define/user) statement. 

Learn more about token and session duration in our [security best practices](/docs/surrealdb/security/security-best-practices#expiration) documentation.

### Example of a secure connection

```go

package main

import (
	"os"

	surrealdb "github.com/surrealdb/surrealdb.go"
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

const (
	defaultURL = "ws://localhost:8000"
)

var currentURL = os.Getenv("SURREALDB_URL")

func getSurrealDBURL() string {
	if currentURL == "" {
		return defaultURL
	}
	return currentURL
}

func newSurrealDBConnection(namespace, database string, tables ...string) *surrealdb.DB {
	db, err := surrealdb.New(getSurrealDBURL())
	if err != nil {
		panic(err)
	}

	if err = db.Use(namespace, database); err != nil {
		panic(err)
	}

	authData := &surrealdb.Auth{
		Username: "root",
		Password: "root",
	}
	token, err := db.SignIn(authData)
	if err != nil {
		panic(err)
	}

	if err = db.Authenticate(token); err != nil {
		panic(err)
	}


	return db
}
```