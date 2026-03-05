---
sidebar_position: 1
sidebar_label: SignIn
title: Golang | SDK | Methods | SignIn
description: This method signs in to a root, namespace, database or scope user.
---


# `.SignIn()` {#signin}

Signs in to a root, namespace, database or scope user.

```go title="Method Syntax"
await db.SignIn(credentials)
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
                <code>credentials</code>
                <label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Variables used in a signin query.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

<tabs synckey="signin-example">
<tabitem label="Root user">

```go
// Sign in to authentication `db` using the root user
	authData := &surrealdb.Auth{
		Username: "root", // use your setup username
		Password: "secret", // use your setup password
	}
	token, err := db.SignIn(authData)
	if err != nil {
		panic(err)
	}
```

</tabitem>

<tabitem label="Namespace user">

```go
// Sign in to authentication `db` using the root user
	authData := &surrealdb.Auth{
		Username: "root", // use your setup username
		Password: "secret", // use your setup password
        Namespace = "test", 
	}
	token, err := db.SignIn(authData)
	if err != nil {
		panic(err)
	}
```

</tabitem>

<tabitem label="Database user">

```go
// Sign in to authentication `db` using the root user
	authData := &surrealdb.Auth{
		Username: "root", // use your setup username
		Password: "secret", // use your setup password
        Namespace = "test", 
        Database = "test", 
	}
	token, err := db.SignIn(authData)
	if err != nil {
		panic(err)
	}
```

</tabitem>

<tabitem label="Record Access">

```go
// Sign in to authentication `db` using the root user
	authData := &surrealdb.Auth{
		Username: "root", // use your setup username
		Password: "secret", // use your setup password
        Namespace = "test", 
        Database = "test", 
        Access = "user",
        Email = "info@surrealdb.com",
        Password = "123456"
	}
	token, err := db.SignIn(authData)
	if err != nil {
		panic(err)
	}
```

</tabitem>

<tabitem label="Scopes">

```go
// Sign in to authentication `db` using the root user
	authData := &surrealdb.Auth{
		Username: "root", // use your setup username
		Password: "secret", // use your setup password
        Namespace = "test", 
        Database = "test", 
        Scope = "user",
        Email = "info@surrealdb.com",
        Password = "123456"
	}
	token, err := db.SignIn(authData)
	if err != nil {
		panic(err)
	}
```

</tabitem>
</tabs>

You can invalidate the authentication for the current connection using the [`Invalidate()` method](/docs/sdk/dotnet/methods/invalidate).
