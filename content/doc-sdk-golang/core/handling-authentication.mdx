---
sidebar_position: 2
sidebar_label: Handle authentication
title: Golang | SDK | Handle authentication
description: SurrealDB supports a number of methods for authenticating users and securing the database.
---

import Label from "@components/shared/Label.astro";
import Since from "@components/shared/Since.astro";
import Version from '@components/Version.astro';
import Tabs from "@components/Tabs/Tabs.astro";
import TabItem from "@components/Tabs/TabItem.astro";

# Handle authentication

Since SurrealDB is a database that is designed to be used in a distributed environment, it is important to secure the database and the data that is stored in it. SurrealDB provides a number of methods for authenticating users and securing the database.

In your SurrealDB database, you can create authentication login using the [`DEFINE ACCESS`](/docs/surrealql/statements/define/access) statement which supports [JWT](/docs/surrealql/statements/define/access/jwt) and [Record](/docs/surrealql/statements/define/access/record) Access methods.

The access method used will inform the input for `access` in the `.SignUp()` and `.SignIn()` methods.

> [!IMPORTANT]
> If you are not on Version <Version /> of SurrealDB, you will use the `scope` property instead of `access`. 

<table>
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td scope="row" data-label="Method"><a href="/docs/sdk/golang/methods/signup"> <code> db.SignUp() </code></a></td>
			<td scope="row" data-label="Description">Connects to a local or remote database endpoint</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="/docs/sdk/golang/methods/signin"> <code> db.SignIn() </code></a></td>
            <td scope="row" data-label="Description">Signs in to a root, namespace, database or scope user</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="/docs/sdk/golang/methods/invalidate"> <code> db.Invalidate() </code></a></td>
            <td scope="row" data-label="Description">Invalidates the current session</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="/docs/sdk/golang/methods/authenticate"> <code> db.Authenticate() </code></a></td>
            <td scope="row" data-label="Description">Authenticates a user with a token</td>
        </tr>
	</tbody>
</table>

## Defining access in your application

The Golang SDK has a [`.Query()` method](/docs/sdk/golang/methods/query) which allows you to write secure SurrealQL statements from within your application. Using this method, you can define access for your users and securely manage authentication. See the code example below:

<Tabs groupId="define-access">
<TabItem value="V2" label="V2.x" >
```go
package main

import (
	"context"
	"fmt"

	surrealdb "github.com/surrealdb/surrealdb.go"
	"github.com/surrealdb/surrealdb.go/contrib/testenv"
)

//nolint:funlen
func ExampleDB_record_user_auth_struct() {
	ns := "surrealdbexamples"
	db := testenv.MustNew(ns, "record_auth_demo", "user")

	setupQuery := `
		-- Define the user table with schema
		DEFINE TABLE user SCHEMAFULL
			PERMISSIONS
				FOR select, update, delete WHERE id = $auth.id;

		-- Define fields
		DEFINE FIELD name ON user TYPE string;
		DEFINE FIELD password ON user TYPE string;

		-- Define unique index on email
		REMOVE INDEX IF EXISTS name ON user;
		DEFINE INDEX name ON user FIELDS name UNIQUE;

		-- Define access method for record authentication
		REMOVE ACCESS IF EXISTS user ON DATABASE;
		DEFINE ACCESS user ON DATABASE TYPE RECORD
			SIGNIN (
				SELECT * FROM user WHERE name = $user AND crypto::argon2::compare(password, $pass)
			)
			SIGNUP (
				CREATE user CONTENT {
					name: $user,
					password: crypto::argon2::generate($pass)
				}
			);
	`

	if _, err := surrealdb.Query[any](context.Background(), db, setupQuery, nil); err != nil {
		panic(err)
	}

	fmt.Println("Database schema setup complete")

	// Refer to the next example, `ExampleDB_record_user_custom_struct`,
	// when you need to use fields other than `user` and `pass` in the query specified for SIGNUP.
	_, err := db.SignUp(context.Background(), &surrealdb.Auth{
		Namespace: ns,
		Database:  "record_auth_demo",
		Access:    "user",
		Username:  "yusuke",
		Password:  "VerySecurePassword123!",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("User signed up successfully")

	// Refer to the next example, `ExampleDB_record_user_custom_struct`,
	// when you need to use fields other than `user` and `pass` in the query specified for SIGNIN.
	//
	// For example, you might want to use `email` and `password` instead of `user` and `pass`.
	// In that case, you need to something that encodes to a cbor map containing those keys.
	_, err = db.SignIn(context.Background(), &surrealdb.Auth{
		Namespace: ns,
		Database:  "record_auth_demo",
		Access:    "user",
		Username:  "yusuke",
		Password:  "VerySecurePassword123!",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("User signed in successfully")

	info, err := db.Info(context.Background())
	if err != nil {
		panic(err)
	}
	fmt.Printf("Authenticated user name: %v\n", info["name"])

	// Output:
	// Database schema setup complete
	// User signed up successfully
	// User signed in successfully
	// Authenticated user name: yusuke
}

func ExampleDB_record_user_custom_struct() {
	ns := "surrealdbexamples"
	db := testenv.MustNew(ns, "record_user_custom", "user")

	setupQuery := `
		-- Define the user table with schema
		DEFINE TABLE user SCHEMAFULL
			PERMISSIONS
				FOR select, update, delete WHERE id = $auth.id;

		-- Define fields
		DEFINE FIELD name ON user TYPE string;
		DEFINE FIELD email ON user TYPE string;
		DEFINE FIELD password ON user TYPE string;

		-- Define unique index on email
		REMOVE INDEX IF EXISTS email ON user;
		DEFINE INDEX email ON user FIELDS email UNIQUE;

		-- Define access method for record authentication
		REMOVE ACCESS IF EXISTS user ON DATABASE;
		DEFINE ACCESS user ON DATABASE TYPE RECORD
			SIGNIN (
				SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(password, $password)
			)
			SIGNUP (
				CREATE user CONTENT {
					name: $name,
					email: $email,
					password: crypto::argon2::generate($password)
				}
			);
	`

	if _, err := surrealdb.Query[any](context.Background(), db, setupQuery, nil); err != nil {
		panic(err)
	}

	fmt.Println("Database schema setup complete")

	type User struct {
		Namespace string `json:"NS"`
		Database  string `json:"DB"`
		Access    string `json:"AC"`
		Name      string `json:"name"`
		Password  string `json:"password"`
		Email     string `json:"email"`
	}

	type LoginRequest struct {
		Namespace string `json:"NS"`
		Database  string `json:"DB"`
		Access    string `json:"AC"`
		Email     string `json:"email"`
		Password  string `json:"password"`
	}

	_, err := db.SignUp(context.Background(), &User{
		// Corresponds to the SurrealDB namespace
		Namespace: ns,
		// Corresponds to the SurrealDB database
		Database: "record_user_custom",
		// Corresponds to `user` in `DEFINE ACCESS USER ON ...`
		Access: "user",
		// Corresponds to the $name in the SIGNUP query and `name` in `DEFINE FIELD name ON user`
		Name: "yusuke",
		// Corresponds to the $password in the SIGNUP query and `password` in `DEFINE FIELD password ON user`
		Password: "VerySecurePassword123!",
		// Corresponds to the $email in the SIGNUP query and `email` in `DEFINE FIELD email ON user`
		Email: "yusuke@example.com",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("User signed up successfully")

	_, err = db.SignIn(context.Background(), &LoginRequest{
		Namespace: ns,
		Database:  "record_user_custom",
		Access:    "user",
		// Corresponds to the $email in the SIGNIN query and `email` in `DEFINE FIELD email ON user`
		Email: "yusuke@example.com",
		// Corresponds to the $password in the SIGNIN query and `password` in `DEFINE FIELD password ON user`
		Password: "VerySecurePassword123!",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println("User signed in successfully")

	info, err := db.Info(context.Background())
	if err != nil {
		panic(err)
	}
	fmt.Printf("Authenticated user name: %v\n", info["name"])

	// Output:
	// Database schema setup complete
	// User signed up successfully
	// User signed in successfully
	// Authenticated user name: yusuke
}
```
</TabItem>
<TabItem value="V1" label="V1.x" >

```go
...
-- Define scope method for record authentication
		REMOVE SCOPE IF EXISTS user ON DATABASE;
		DEFINE SCOPE user ON DATABASE TYPE RECORD
			SIGNIN (
				SELECT * FROM user WHERE name = $user AND crypto::argon2::compare(password, $pass)
			)
			SIGNUP (
				CREATE user CONTENT {
					name: $user,
					password: crypto::argon2::generate($pass)
				}
			);
...
```
</TabItem>
</Tabs>

{/* > [!NOTE]
> Depending on the connection protocol you choose, authentication tokens and sessions lifetime work differently. Refer to the [connection options](/docs/sdk/golang/core/create-a-new-connection#connection-options) documentation for more information. */}


## Learn more

Learn more about authentication in SurrealDB in our [security best practices](/docs/surrealdb/security/security-best-practices#authentication) documentation and in the [security](/docs/surrealdb/security/authentication#expiration) section of the SurrealDB documentation.  