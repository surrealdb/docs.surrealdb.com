---
sidebar_position: 1
sidebar_label: InsertRelation
title: Golang | SDK | Methods | InsertRelation
description: The InsertRelation method inserts a relation between two records.
---

import Label from "@components/shared/Label.astro";

# .InsertRelation[T](table, data)

Inserts one or multiple relations in the database.

```go title="Method Syntax"
db.InsertRelation[T](table, data)
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
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Optionally pass along a table to insert into.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>data</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Either a single document/record or an array of documents/records to insert
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

//nolint:funlen
func ExampleInsertRelation() {
	
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
		ID models.RecordID `json:"id,omitempty"`
	}

	type Follow struct {
		In    *models.RecordID      `json:"in,omitempty"`
		Out   *models.RecordID      `json:"out,omitempty"`
		Since models.CustomDateTime `json:"since"`
	}

	first, err := surrealdb.Create[Person](
		db,
		"person",
		map[string]any{
			"id": models.NewRecordID("person", "first"),
		})
	if err != nil {
		panic(err)
	}

	second, err := surrealdb.Create[Person](
		db,
		"person",
		map[string]any{
			"id": models.NewRecordID("person", "second"),
		})
	if err != nil {
		panic(err)
	}

	since, err := time.Parse(time.RFC3339, "2023-10-01T12:00:00Z")
	if err != nil {
		panic(err)
	}

	persons, err := surrealdb.Query[[]Person](
		db,
		"SELECT * FROM person ORDER BY id.id",
		nil,
	)
	if err != nil {
		panic(err)
	}
	for _, person := range (*persons)[0].Result {
		fmt.Printf("Person: %+v\n", person)
	}

	if relateErr := surrealdb.InsertRelation(
		db,
		&surrealdb.Relationship{
			ID:       &models.RecordID{Table: "follow", ID: "first_second"},
			In:       first.ID,
			Out:      second.ID,
			Relation: "follow",
			Data: map[string]any{
				"since": models.CustomDateTime{
					Time: since,
				},
			},
		},
	); relateErr != nil {
		panic(relateErr)
	}

	//nolint:lll
	/// Here's an alternative way to insert a relation using a query.
	//
	// if res, err := surrealdb.Query[any](
	// 	db,
	// 	"INSERT RELATION INTO follow $content",
	// 	map[string]any{
	// 		"content": map[string]any{
	// 			"id":    "first_second",
	// 			"in":    first.ID,
	// 			"out":   second.ID,
	// 			"since": models.CustomDateTime{Time: since},
	// 		},
	// 	},
	// ); err != nil {
	// 	panic(err)
	// } else {
	// 	fmt.Printf("Relation: %+v\n", (*res)[0].Result)
	// }
	// The output will be:
	// Relation: [map[id:{Table:follow ID:first_second} in:{Table:person ID:first} out:{Table:person ID:second} since:{Time:2023-10-01 12:00:00 +0000 UTC}]]

	type PersonWithFollows struct {
		Person
		Follows []models.RecordID `json:"follows,omitempty"`
	}
	selected, err := surrealdb.Query[[]PersonWithFollows](
		db,
		"SELECT id, name, ->follow->person AS follows FROM $id",
		map[string]any{
			"id": first.ID,
		},
	)
	if err != nil {
		panic(err)
	}

	for _, person := range (*selected)[0].Result {
		fmt.Printf("PersonWithFollows: %+v\n", person)
	}

	// Note we can select the relationships themselves because
	// RELATE creates a record in the relation table.
	follows, err := surrealdb.Query[[]Follow](
		db,
		"SELECT * from follow",
		nil,
	)
	if err != nil {
		panic(err)
	}

	for _, follow := range (*follows)[0].Result {
		fmt.Printf("Follow: %+v\n", follow)
	}

	//nolint:lll
	// Output:
	// Person: {ID:{Table:person ID:first}}
	// Person: {ID:{Table:person ID:second}}
	// PersonWithFollows: {Person:{ID:{Table:person ID:first}} Follows:[{Table:person ID:second}]}
	// Follow: {In:person:first Out:person:second Since:{Time:2023-10-01 12:00:00 +0000 UTC}}
}
```
