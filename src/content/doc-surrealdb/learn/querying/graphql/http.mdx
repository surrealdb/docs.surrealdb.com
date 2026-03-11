---
sidebar_position: 2
sidebar_label: GraphQL via HTTP
title: GraphQL via HTTP | GraphQL
description: In this section, you will explore querying SurrealDB using the GraphQL HTTP endpoint. The HTTP API is designed to be simple and intuitive, with any interface that provides a consistent way to interact with the database.
---

import Since from '@components/shared/Since.astro';
import Label from "@components/shared/Label.astro";

# GraphQL via HTTP

SurrealDB provides a powerful HTTP API that allows you to interact with the database programmatically. This API can be used to perform a wide range of database operations, from querying data to modifying records and managing database structures.

The HTTP API is designed to be simple and intuitive, with a RESTful interface that provides a consistent way to interact with the database. You can use the API to perform a wide range of database operations, from querying data to modifying records and managing database structures.

## Starting a new connection

Before you can start making queries, you need to start SurrealDB with the GraphQL module enabled. You can do this by starting a new instance of SurrealDB with the [`surreal start` command](/docs/surrealdb/cli/start).


```bash
surreal start --log debug --user root --password secret
```

In order to allow querying the created table using GraphQL, you will need to explicitly enable GraphQL using the [`DEFINE CONFIG`](/docs/surrealql/statements/define/config) statement. This will allow you to query the table using GraphQL on a per-database basis.


## `POST /sql`

To use the GraphQL API, you first need to enable it using the `DEFINE CONFIG` statement. This will allow you to query the table using GraphQL on a per-database basis.

To do this, you can send a `POST` request to the `/sql` endpoint with a RAW body containing the `DEFINE CONFIG` statement. For example:

```surrealql title="Enabling GraphQL"
DEFINE CONFIG GRAPHQL AUTO;
```

Here are three commands to define this configuration, along with some table and field definitions and sample data. They also assume a root user with the name `root` and the password `secret`.

```bash
curl -X POST -u "root:secret" -H "Surreal-NS: main" -H "Surreal-DB: main" -H "Accept: application/json" \
  -d 'DEFINE TABLE person SCHEMAFULL; DEFINE FIELD name ON TABLE person TYPE string; DEFINE FIELD age ON TABLE person TYPE number;' \
  http://localhost:8000/sql

curl -X POST -u "root:secret" -H "Surreal-NS: main" -H "Surreal-DB: main" -H "Accept: application/json" \
  -d 'CREATE person:simon SET name = "Simon", age = 23; CREATE person:marcus SET name = "Marcus", age = 28;' \
  http://localhost:8000/sql

curl -X POST -u "root:secret" -H "Surreal-NS: main" -H "Surreal-DB: main" -H "Accept: application/json" \
  -d 'DEFINE CONFIG GRAPHQL AUTO' http://localhost:8000/sql
```


## `POST /graphql`

<Since v="v2.0.0" />

To use the GraphQL API, you can send a `POST` request to the `/graphql` endpoint with a JSON body containing the GraphQL query via Postman or any other HTTP client. For example, to query the `person` table for all records, you can send the following request:

```json
curl -X POST -u "root:secret" -H "Surreal-NS: main" -H "Surreal-DB: main" -H "Accept: application/json" \
  -d '{ "query": "query { person { name } }" }' http://localhost:8000/graphql
```

```json title="Response"
{"data":{"person":[{"name":"Marcus"},{"name":"Simon"}]}}
```

The GraphQL endpoint enables use of GraphQL queries to interact with your data.

### Headers
<table>
    <thead>
        <tr>
            <th colspan="2">Header</th>
            <th colspan="2">Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="2" scope="row" data-label="Header">
                <code>Authorization</code>
               <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
            Sets the root, namespace, database, or record authentication data
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Header">
                <code>Accept</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Sets the desired content-type of the response
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Header">
                <code>surreal-ns</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Sets the selected Namespace for queries
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Header">
                <code>surreal-db</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Sets the selected Database for queries
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```bash title="Request"
curl -X POST \
  -u "root:secret" \
  -H "Surreal-NS: main" \
  -H "Surreal-DB: main" \
  -H "Accept: application/json" \
  -d '{"query": "query { person(where: { age: { gt: 18 } }) { id name age } }"}' \
  http://localhost:8000/graphql
```

```json title="Response"
[
	{
		"time": "14.357166ms",
		"status": "OK",
		"result": [
			{
				"age": "23",
				"id": "person:simon"
				"name": "Simon",
			},
			{
				"age": "28",
				"id": "person:marcus"
				"name": "Marcus",
			},
		]
	}
]
```
