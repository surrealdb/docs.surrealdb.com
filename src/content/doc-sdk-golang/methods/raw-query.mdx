---
sidebar_position: 1
sidebar_label: QueryRaw
title: Golang | SDK | Methods | QueryRaw
description: This method runs a set of SurrealQL statements against the database, based on a raw SurrealQL query. 
---

import Label from "@components/shared/Label.astro";

# `.QueryRaw()` {#query}

Runs a set of SurrealQL statements against the database, based on a raw SurrealQL query.

```go title="Method Syntax"
func QueryRaw(db *DB, queries *[]QueryStmt) error
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
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>params</code>
               <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Assigns variables which can be used in the query.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```go
	package main

import (
	"fmt"
	"log"
)

// QueryStmt represents a database query.
type QueryStmt struct {
	SQL         string
	Vars        map[string]interface{}
	Result      QueryResult
	unmarshaler interface{}
}

// QueryResult is a simple type representing a query result.
type QueryResult struct {
	Data string
}

// DB simulates a database connection.
type DB struct {
	con Connection
}

// Connection simulates a connection that can send queries.
type Connection struct{}

// RPCResponse is a generic response wrapper.
type RPCResponse[T any] struct {
	Result *T
}

// Send simulates sending the combined query to the database.
// For this example, it returns a dummy result for each query.
func (c *Connection) Send(res *RPCResponse[[]QueryResult], method, query string, params map[string]interface{}) error {
	// For simplicity, we assume one result per query.
	dummyResults := []QueryResult{
		{Data: "Result for query: SELECT * FROM person WHERE id = 1"},
	}
	res.Result = &dummyResults
	return nil
}

// GetUnmarshaler returns a dummy unmarshaler.
func (c *Connection) GetUnmarshaler() interface{} {
	return nil
}

// QueryRaw executes the queries by concatenating them, sending them to the DB,
// and assigning each query its corresponding result.
func QueryRaw(db *DB, queries *[]QueryStmt) error {
	preparedQuery := ""
	parameters := map[string]interface{}{}

	for i := 0; i < len(*queries); i++ {
		preparedQuery += fmt.Sprintf("%s;", (*queries)[i].SQL)
		for k, v := range (*queries)[i].Vars {
			parameters[k] = v
		}
	}

	if preparedQuery == "" {
		return fmt.Errorf("no query to run")
	}

	var res RPCResponse[[]QueryResult]
	if err := db.con.Send(&res, "query", preparedQuery, parameters); err != nil {
		return err
	}

	for i := 0; i < len(*queries); i++ {
		(*queries)[i].Result = (*res.Result)[i]
		(*queries)[i].unmarshaler = db.con.GetUnmarshaler()
	}

	return nil
}

func main() {
	// Create a dummy database instance.
	db := &DB{
		con: Connection{},
	}

	// Define the query statement(s).
	queries := []QueryStmt{
		{
			SQL:  "SELECT * FROM person WHERE id = $id",
			Vars: map[string]interface{}{"id": 1},
		},
	}

	// Perform the query operation.
	if err := QueryRaw(db, &queries); err != nil {
		log.Fatalf("QueryRaw failed: %v", err)
	}

	// Print the query result.
	fmt.Printf("Query result: %+v\n", queries[0].Result)
}

```
