---
sidebar_position: 1
sidebar_label: patch
title: Python | SDK | Methods | patch
description: The SurrealDB SDK for Python enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.patch()`

Applies JSON Patch changes to all records, or a specific record, in the database.

```python title="Method Syntax"
db.patch(thing, data)
```

> [!NOTE]
> This function patches the current document / record data with the specified JSON Patch data.


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
                The table name or the specific [`RecordID`](/docs/sdk/python/data-types#recordid) to patch.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>data</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The JSON Patch data with which to patch the records.
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```python
# Update all records in a table
await db.patch('person', [
	{ "op": 'replace', "path": '/created_at', "value": datetime.datetime.utcnow() },
])

# Update a record with a specific ID
await db.patch(RecordID('person', 'tobie'), [
	{ "op": 'replace', "path": '/settings/active', "value": false },
	{ "op": 'add', "path": '/tags', "value": ['developer', 'engineer'] },
	{ "op": 'remove', "path": '/temp' },
])
```

### Translated query
This function will run the following query in the database.

```surql
UPDATE $thing PATCH $data;
```