---
sidebar_position: 1
sidebar_label: Select
title: Golang | SDK | Methods | Select
description: This method selects all records in a table, or a specific record, from the database.
---

import Label from "@components/shared/Label.astro";

# `.Select[T, R](resource)` {#select}

Selects all records in a table, or a specific record, from the database.

```go title="Method Syntax"
db.Select[T, R](resource)
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
                <code>resource</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The table name (as <code>models.Table</code>) for selecting all records or a <code>RecordID</code> (as <code>models.RecordID</code>) to select a single record.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>T</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The type to deserialize the result into, such as <code>Person</code> for a single record or <code>[]Person</code> for an array of records.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>R</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The type of the <code>resource</code> parameter—use <code>models.RecordID</code> for a single record or <code>models.Table</code> for an entire table.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```go
package main

import (
	"context"
	"fmt"

	surrealdb "github.com/surrealdb/surrealdb.go"
	"github.com/surrealdb/surrealdb.go/contrib/testenv"
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

func ExampleSelect() {
	db := testenv.MustNew("surrealdbexamples", "update", "person")

	type Person struct {
		ID models.RecordID `json:"id,omitempty"`
	}

	a := Person{ID: models.NewRecordID("person", "a")}
	b := Person{ID: models.NewRecordID("person", "b")}

	for _, p := range []Person{a, b} {
		created, err := surrealdb.Create[Person](
			context.Background(),
			db,
			p.ID,
			map[string]any{},
		)
		if err != nil {
			panic(err)
		}
		fmt.Printf("Created person: %+v\n", *created)
	}

	selectedOneUsingSelect, err := surrealdb.Select[Person](
		context.Background(),
		db,
		a.ID,
	)
	if err != nil {
		panic(err)
	}
	fmt.Printf("selectedOneUsingSelect: %+v\n", *selectedOneUsingSelect)

	selectedMultiUsingSelect, err := surrealdb.Select[[]Person](
		context.Background(),
		db,
		"person",
	)
	if err != nil {
		panic(err)
	}
	for _, p := range *selectedMultiUsingSelect {
		fmt.Printf("selectedMultiUsingSelect: %+v\n", p)
	}

	// Output:
	// Created person: {ID:{Table:person ID:a}}
	// Created person: {ID:{Table:person ID:b}}
	// selectedOneUsingSelect: {ID:{Table:person ID:a}}
	// selectedMultiUsingSelect: {ID:{Table:person ID:a}}
	// selectedMultiUsingSelect: {ID:{Table:person ID:b}}
}
```
