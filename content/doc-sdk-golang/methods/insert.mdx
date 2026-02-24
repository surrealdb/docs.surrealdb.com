---
sidebar_position: 1
sidebar_label: Insert
title: Golang | SDK | Methods | Insert
description: The Insert method inserts one or multiple records in the database.
---

import Label from "@components/shared/Label.astro";

# `.Insert[T](table, data)` {#insert}

Inserts one or multiple records in the database.

```go title="Method Syntax"
db.Insert[T](table, data)
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
                <code>table</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Optionally pass along a table to insert into.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>data</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Either a single document/record or an array of documents/records to insert
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```go
// Insert an entry

package main

import (
	"fmt"
	"time"

	surrealdb "github.com/surrealdb/surrealdb.go"
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

//nolint:funlen
func ExampleInsert() {
	
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

	type Person struct {
		Name string `json:"name"`
		// Note that you must use CustomDateTime instead of time.Time.
		CreatedAt models.CustomDateTime  `json:"created_at,omitempty"`
		UpdatedAt *models.CustomDateTime `json:"updated_at,omitempty"`
	}

	createdAt, err := time.Parse(time.RFC3339, "2023-10-01T12:00:00Z")
	if err != nil {
		panic(err)
	}

		// Unlike Create which returns a pointer to the record itself,
	// Insert returns a pointer to the array of inserted records.
	var inserted *[]Person
	inserted, err = surrealdb.Insert[Person](
		db,
		"persons",
		map[string]any{
			"name":       "First",
			"created_at": createdAt,
		})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Insert result: %+s\n", *inserted)

	_, err = surrealdb.Insert[struct{}](
		db,
		"persons",
		map[string]any{
			"name":       "Second",
			"created_at": createdAt,
		},
	)
	if err != nil {
		panic(err)
	}

	_, err = surrealdb.Insert[struct{}](
		db,
		"persons",
		Person{
			Name: "Third",
			CreatedAt: models.CustomDateTime{
				Time: createdAt,
			},
		},
	)
	if err != nil {
		panic(err)
	}

	fourthAsMap, err := surrealdb.Insert[map[string]any](
		db,
		"persons",
		Person{
			Name: "Fourth",
			CreatedAt: models.CustomDateTime{
				Time: createdAt,
			},
		},
	)
	if err != nil {
		panic(err)
	}
	if _, ok := (*fourthAsMap)[0]["id"].(models.RecordID); ok {
		delete((*fourthAsMap)[0], "id")
	}
	fmt.Printf("Insert result: %+s\n", *fourthAsMap)

	selected, err := surrealdb.Select[[]Person](
		db,
		"persons",
	)
	if err != nil {
		panic(err)
	}
	for _, person := range *selected {
		fmt.Printf("Selected person: %+s\n", person)
	}

	//nolint:lll
	// Unordered output:
	// Insert result: [{First {2023-10-01 12:00:00 +0000 UTC} <nil>}]
	// Insert result: [map[created_at:{2023-10-01 12:00:00 +0000 UTC} name:Fourth]]
	// Selected person: {First {2023-10-01 12:00:00 +0000 UTC} <nil>}
	// Selected person: {Second {2023-10-01 12:00:00 +0000 UTC} <nil>}
	// Selected person: {Third {2023-10-01 12:00:00 +0000 UTC} <nil>}
	// Selected person: {Fourth {2023-10-01 12:00:00 +0000 UTC} <nil>}
}

```