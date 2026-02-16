---
sidebar_position: 1
sidebar_label: query
title: Python | SDK | Methods | query
description: The SurrealDB SDK for Python enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.query()`

Runs a set of [SurrealQL statements](/docs/surrealql) against the database.

```python title="Method Syntax"
db.query(query, vars)
```

> [!IMPORTANT]
> When multiple statements are provided, `.query()` returns only the first statement's result. If you need results from all statements, use `.query_raw()` instead.

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
                <code>query</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Specifies the SurrealQL statements.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>vars</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Assigns variables which can be used in the query.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```python
result = await db.query(
	'CREATE person SET name = $name',
	{ "name": "John" }
)

print(result)
```

Output:

```surql
[{'id': RecordID(table_name=person, record_id='opdhtxopqovbi3nvffid'), 'name': 'John'}]
```

### `.query_raw()`

With `.query_raw()`, you will get back the raw RPC response. In contrast to the `.query()` method, this will not throw for errors that occur in individual statements. Instead, errors are returned in the per-statement response, and the response includes the execution time for each statement.

### Example usage
```python
raw = await db.query_raw(
	'CREATE person SET name = $name; SELECT * FROM person;',
	{ "name": "John" }
)


# `raw` contains results for *all* statements in the query.
print(raw)
```

Output (formatted for readability):

```surql
{
    'id': 'e66e2607-0497-4b50-868c-5c61ddf495ca',
    'result': [
        {
            'result': [{'id': RecordID(table_name=person, record_id='aykahjapj2g2ra23xflx'), 'name': 'John'}],
            'status': 'OK',
            'time': '3.357375ms'
        },
        {
            'result': [{'id': RecordID(table_name=person, record_id='aykahjapj2g2ra23xflx'), 'name': 'John'}],
            'status': 'OK',
            'time': '881.75µs'
        }
    ]
}
```
