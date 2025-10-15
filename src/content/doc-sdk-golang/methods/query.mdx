---
sidebar_position: 1
sidebar_label: Query
title: Golang | SDK | Methods | Query
description: This method runs a set of SurrealQL statements against the database.
---

import Label from "@components/shared/Label.astro";

# `.Query()` {#query}

Runs a set of SurrealQL statements against the database.

```go title="Method Syntax"
db.Query[TResult any](sql string, vars map[string]interface{}) (*[]QueryResult[TResult], error)
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
                <code>sql</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Specifies the SurrealQL statements.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>vars</code>
                <Label label="optional" />
            </td>
            <td colspan="2">
                Assigns the value to the variable name.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```go
package main

import (
	"fmt"
	"time"

	surrealdb "github.com/surrealdb/surrealdb.go"
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

func ExampleQuery() {
	db := newSurrealDBConnection("examples", "query", "persons")

	type NestedStruct struct {
		City string `json:"city"`
	}

	type Person struct {
		ID           *models.RecordID `json:"id,omitempty"`
		Name         string           `json:"name"`
		NestedMap    map[string]any   `json:"nested_map,omitempty"`
		NestedStruct `json:"nested_struct,omitempty"`
		CreatedAt    models.CustomDateTime  `json:"created_at,omitempty"`
		UpdatedAt    *models.CustomDateTime `json:"updated_at,omitempty"`
	}

	createdAt, err := time.Parse(time.RFC3339, "2023-10-01T12:00:00Z")
	if err != nil {
		panic(err)
	}

	createQueryResults, err := surrealdb.Query[[]Person](
		db,
		`CREATE type::record($tb, $id) CONTENT $content`,
		map[string]any{
			"tb": "persons",
			"id": "yusuke",
			"content": map[string]any{
				"name": "Yusuke",
				"nested_struct": NestedStruct{
					City: "Tokyo",
				},
				"created_at": models.CustomDateTime{
					Time: createdAt,
				},
			},
		})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Number of query results: %d\n", len(*createQueryResults))
	fmt.Printf("First query result's status: %+s\n", (*createQueryResults)[0].Status)
	fmt.Printf("Persons contained in the first query result: %+v\n", (*createQueryResults)[0].Result)

	//nolint:lll
	// Output:
	// Number of query results: 1
	// First query result's status: OK
	// Persons contained in the first query result: [{ID:persons:yusuke Name:Yusuke NestedMap:map[] NestedStruct:{City:Tokyo} CreatedAt:{Time:2023-10-01 12:00:00 +0000 UTC} UpdatedAt:<nil>}]
}

```

### Transaction example

```go 

package main

import (
	"fmt"

	surrealdb "github.com/surrealdb/surrealdb.go"
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

func ExampleQuery_transaction_let_return() {
	
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

	createQueryResults, err := surrealdb.Query[[]any](
		db,
		`BEGIN;
		 CREATE t:1 SET name = 'test';
		 LET $i = SELECT * FROM $id;
		 RETURN $i.name;
		 COMMIT
		`,
		map[string]any{
			"id": models.NewRecordID("t", 1),
		})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Number of query results: %d\n", len(*createQueryResults))
	fmt.Printf("First query result's status: %+s\n", (*createQueryResults)[0].Status)
	fmt.Printf("Names contained in the first query result: %+v\n", (*createQueryResults)[0].Result)

	//nolint:lll
	// Output:
	// Number of query results: 1
	// First query result's status: OK
	// Names contained in the first query result: [test]
}
```
