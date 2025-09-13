---
sidebar_position: 1
sidebar_label: Upsert
title: Golang | SDK | Methods | Upsert
description: The Upsert method creates or updates a specific record.
---

import Label from "@components/shared/Label.astro";

# `.Upsert[T](table, data)` {#upsert}

Creates or updates a specific record.

```go title="Method Syntax"
db.Upsert[T](table, data)
```

> [!NOTE]
> This function creates a new document / record or replaces the current one with the specified data.

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
                <code>table</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The table to upsert the record to.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>data</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The document / record data to upsert.
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
func ExampleUpsert() {
	
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
		ID   *models.RecordID `json:"id,omitempty"`
		Name string           `json:"name"`
		// Note that you must use CustomDateTime instead of time.Time.
		// See
		CreatedAt models.CustomDateTime  `json:"created_at,omitempty"`
		UpdatedAt *models.CustomDateTime `json:"updated_at,omitempty"`
	}

	createdAt, err := time.Parse(time.RFC3339, "2023-10-01T12:00:00Z")
	if err != nil {
		panic(err)
	}

	inserted, err := surrealdb.Upsert[Person](
		db,
		models.NewRecordID("persons", "yusuke"),
		map[string]any{
			"name":       "Yusuke",
			"created_at": createdAt,
		})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Insert via upsert result: %+s\n", *inserted)

	updated, err := surrealdb.Upsert[Person](
		db,
		models.NewRecordID("persons", "yusuke"),
		map[string]any{
			"name": "Yusuke Updated",
			// because the upsert RPC is like UPSERT ~ CONTENT rather than UPSERT ~ MERGE,
			// the created_at field becomes None, which results in the returned created_at field being zero value.
			"updated_at": createdAt,
		},
	)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Update via upsert result: %+s\n", *updated)

	udpatedAt, err := time.Parse(time.RFC3339, "2023-10-02T12:00:00Z")
	if err != nil {
		panic(err)
	}
	updatedFurther, err := surrealdb.Upsert[Person](
		db,
		models.NewRecordID("persons", "yusuke"),
		map[string]any{
			"name":       "Yusuke Updated Further",
			"created_at": createdAt,
			"updated_at": models.CustomDateTime{
				Time: udpatedAt,
			},
		},
	)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Update further via upsert result: %+s\n", *updatedFurther)

	_, err = surrealdb.Upsert[struct{}](
		db,
		models.NewRecordID("persons", "yusuke"),
		map[string]any{
			"name": "Yusuke Updated Last",
		},
	)
	if err != nil {
		panic(err)
	}

	selected, err := surrealdb.Select[Person](
		db,
		models.NewRecordID("persons", "yusuke"),
	)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Selected person: %+s\n", *selected)

	//nolint:lll
	// Output:
	// Insert via upsert result: {persons:yusuke Yusuke {2023-10-01 12:00:00 +0000 UTC} <nil>}
	// Update via upsert result: {persons:yusuke Yusuke Updated {0001-01-01 00:00:00 +0000 UTC} 2023-10-01T12:00:00Z}
	// Update further via upsert result: {persons:yusuke Yusuke Updated Further {2023-10-01 12:00:00 +0000 UTC} 2023-10-02T12:00:00Z}
	// Selected person: {persons:yusuke Yusuke Updated Last {0001-01-01 00:00:00 +0000 UTC} <nil>}
}
```

### Bulk upsert example 

```go
package main

import (
	"fmt"
	"strings"

	surrealdb "github.com/surrealdb/surrealdb.go"
	"github.com/surrealdb/surrealdb.go/pkg/models"
)

// This example demonstrates how you can batch insert and upsert records,
// with specifying RETURN NONE to avoid unnecessary data transfer and decoding.
//
//nolint:funlen
func ExampleQuery_bluk_insert_upsert() {
	
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

	/// You can make it a schemaful table by defining fields like this:
	//
	// _, err := surrealdb.Query[any](
	// 	db,
	// 	`DEFINE TABLE persons SCHEMAFULL;
	// 	DEFINE FIELD note ON persons TYPE string;
	// 	DEFINE FIELD num ON persons TYPE int;
	// 	DEFINE FIELD loc ON persons TYPE geometry<point>;
	// `,
	// 	nil,
	// )
	// if err != nil {
	// 	panic(err)
	// }
	//
	/// If you do that, ensure that fields do not have `omitempty` json tags!
	///
	/// Why?
	/// Our cbor library reuses `json` tags for CBOR encoding/decoding,
	/// and `omitempty` skips the encoding of the field if it is empty.
	///
	/// For example, if you define an `int` field with `omitempty` tag,
	/// a value of `0` will not be encoded, resulting in an query error due:
	///   Found NONE for field `num`, with record `persons:p0`, but expected a int

	type Person struct {
		ID   *models.RecordID `json:"id"`
		Note string           `json:"note"`
		// As writte nabove whether it is `json:"num,omitempty"` or `json:"num"` is important,.
		// depending on what you want to achieve.
		Num int                  `json:"num"`
		Loc models.GeometryPoint `json:"loc"`
	}

	nthPerson := func(i int) Person {
		return Person{
			ID:   &models.RecordID{Table: "persons", ID: fmt.Sprintf("p%d", i)},
			Note: fmt.Sprintf("inserted%d", i),
			Num:  i,
			Loc: models.GeometryPoint{
				Longitude: 12.34 + float64(i),
				Latitude:  45.65 + float64(i),
			},
		}
	}

	var persons []Person
	for i := 0; i < 2; i++ {
		persons = append(persons, nthPerson(i))
	}

	insert, err := surrealdb.Query[any](
		db,
		`INSERT INTO persons $persons RETURN NONE`,
		map[string]any{
			"persons": persons,
		})
	if err != nil {
		panic(err)
	}
	fmt.Println("# INSERT INTO")
	fmt.Printf("Count   : %d\n", len(*insert))
	fmt.Printf("Status  : %+s\n", (*insert)[0].Status)
	fmt.Printf("Result  : %+v\n", (*insert)[0].Result)

	select1, err := surrealdb.Query[[]Person](
		db,
		`SELECT * FROM persons ORDER BY id.id`,
		nil)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Selected: %+v\n", (*select1)[0].Result)

	persons = append(persons, nthPerson(2))

	insertIgnore, err := surrealdb.Query[any](
		db,
		`INSERT IGNORE INTO persons $persons RETURN NONE`,
		map[string]any{
			"persons": persons,
		})
	if err != nil {
		panic(err)
	}
	fmt.Println("# INSERT IGNORE INTO")
	fmt.Printf("Count   : %d\n", len(*insertIgnore))
	fmt.Printf("Status  : %+s\n", (*insertIgnore)[0].Status)
	fmt.Printf("Result  : %+v\n", (*insertIgnore)[0].Result)

	select2, err := surrealdb.Query[[]Person](
		db,
		`SELECT * FROM persons ORDER BY id.id`,
		nil)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Selected: %+v\n", (*select2)[0].Result)

	for i := 0; i < 3; i++ {
		persons[i].Note = fmt.Sprintf("updated%d", i)
	}
	persons = append(persons, nthPerson(3))
	var upsertQueries []string
	vars := make(map[string]any)
	for i, p := range persons {
		upsertQueries = append(upsertQueries,
			fmt.Sprintf(`UPSERT persons CONTENT $content%d RETURN NONE`, i),
		)
		vars[fmt.Sprintf("content%d", i)] = p
	}
	upsert, err := surrealdb.Query[any](
		db,
		strings.Join(upsertQueries, ";"),
		vars,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("# UPSERT CONTENT")
	fmt.Printf("Count   : %d\n", len(*upsert))
	fmt.Printf("Status  : %+s\n", (*upsert)[0].Status)
	fmt.Printf("Result  : %+v\n", (*upsert)[0].Result)

	select3, err := surrealdb.Query[[]Person](
		db,
		`SELECT * FROM persons ORDER BY id.id`,
		nil)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Selected: %+v\n", (*select3)[0].Result)

	//nolint:lll
	// Output:
	// # INSERT INTO
	// Count   : 1
	// Status  : OK
	// Result  : []
	// Selected: [{ID:persons:p0 Note:inserted0 Num:0 Loc:{Latitude:45.65 Longitude:12.34}} {ID:persons:p1 Note:inserted1 Num:1 Loc:{Latitude:46.65 Longitude:13.34}}]
	// # INSERT IGNORE INTO
	// Count   : 1
	// Status  : OK
	// Result  : []
	// Selected: [{ID:persons:p0 Note:inserted0 Num:0 Loc:{Latitude:45.65 Longitude:12.34}} {ID:persons:p1 Note:inserted1 Num:1 Loc:{Latitude:46.65 Longitude:13.34}} {ID:persons:p2 Note:inserted2 Num:2 Loc:{Latitude:47.65 Longitude:14.34}}]
	// # UPSERT CONTENT
	// Count   : 4
	// Status  : OK
	// Result  : []
	// Selected: [{ID:persons:p0 Note:updated0 Num:0 Loc:{Latitude:45.65 Longitude:12.34}} {ID:persons:p1 Note:updated1 Num:1 Loc:{Latitude:46.65 Longitude:13.34}} {ID:persons:p2 Note:updated2 Num:2 Loc:{Latitude:47.65 Longitude:14.34}} {ID:persons:p3 Note:inserted3 Num:3 Loc:{Latitude:48.65 Longitude:15.34}}]
}

```