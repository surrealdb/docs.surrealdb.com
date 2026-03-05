---
sidebar_position: 1
sidebar_label: SignUp
title: Golang | SDK | Methods | SignUp
description: This method signs up to a specific authentication scope / access method.
---


# `.SignUp()` {#signup}

Signs up to a specific authentication scope / access method.

```go title="Method Syntax"
await db.SignUp(credentials)
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
            <td colspan="2" scope="row" data-label="Arguments">
                <code>credentials</code>
                <label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Credentials to sign up as a scoped user.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

<tabs synckey="signup-example">
<tabitem label="V2.x">

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
	token, err := db.SignUp(authData)
	if err != nil {
		panic(err)
	}
```

</tabitem>
<tabitem label="V1.x">

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
	token, err := db.SignUp(authData)
	if err != nil {
		panic(err)
	}
```

</tabitem>
</tabs>

You can invalidate the authentication for the current connection using the [`Invalidate()` method](/docs/sdk/dotnet/methods/invalidate).
