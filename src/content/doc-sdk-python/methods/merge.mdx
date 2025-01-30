---
sidebar_position: 1
sidebar_label: merge
title: Python | SDK | Methods | merge
description: The SurrealDB SDK for Python enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.merge()`

Modifies all records in a table, or a specific record, in the database.

```python title="Method Syntax"
db.merge(thing, data)
```

> [!NOTE]
> This function merges the current document / record data with the specified data. If no merge data is passed it will simply trigger an update.

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
                <code>thing</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The table name or the specific [`RecordID`](/docs/sdk/python/data-types#recordid) to merge.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>data</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The document / record data to merge.
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```python

# Update all records in a table
await db.merge('person', {
	updated_at: datetime.datetime.utcnow()
})

# Update a record with a specific ID
await db.merge(RecordID('person', 'tobie'), {
	"updated_at": datetime.datetime.utcnow(),
	"settings": {
		"active": true,
	}
})
```

### Translated query
This function will run the following query in the database.

```surql
UPDATE $thing MERGE $data;
```