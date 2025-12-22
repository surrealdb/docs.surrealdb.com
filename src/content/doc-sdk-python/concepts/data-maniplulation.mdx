---
sidebar_position: 4
sidebar_label: Data manipulation
title: Python | SDK | Data manipulation
description: SurrealDB supports a number of methods for interacting with the database and performing CRUD operations.
---

import Label from "@components/shared/Label.astro";

# Data manipulation

SurrealDB supports a number of methods for interacting with the database and performing CRUD operations.

<table>
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td scope="row" data-label="Method"><a href="#select"> <code> db.select() </code></a></td>
			<td scope="row" data-label="Description">Selects all records in a table, or a specific record, from the database</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#create"> <code> db.create() </code></a></td>
            <td scope="row" data-label="Description">Creates a record in the database</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#insert"> <code> db.insert() </code></a></td>
            <td scope="row" data-label="Description">Inserts one or multiple records in the database</td>
		</tr>
		<tr>
			<td scope="row" data-label="Method"><a href="#insert_relation"> <code> db.insert_relation() </code></a></td>
			<td scope="row" data-label="Description">Inserts one or multiple relations in the database</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#update"> <code> db.update() </code></a></td>
            <td scope="row" data-label="Description">Updates all records in a table, or a specific record, in the database</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#merge"> <code> db.merge() </code></a></td>
            <td scope="row" data-label="Description">Modifies all records in a table, or a specific record, in the database</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#patch"> <code> db.patch() </code></a></td>
            <td scope="row" data-label="Description">Applies JSON Patch changes to all records, or a specific record, in the database</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#delete"> <code> db.delete() </code></a></td>
            <td scope="row" data-label="Description">Deletes all records in a table, or a specific record, from the database</td>
        </tr>
	</tbody>
</table>

## `.select()` 

Selects all records in a table, or a specific record, from the database.

```python title="Method Syntax"
db.select(thing)
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
                <code>thing</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The table name or a [`RecordID`](/docs/sdk/python/data-types#recordid) to select.
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```python
# Select all records from a table
people = db.select('person')

# Select a specific record from a table
person = db.select(RecordID('person', 'h5wxrf2ewk8xjxosxtyc'))
```

### Translated query
This function will run the following query in the database.

```surql
SELECT * FROM $thing;
```

<br />

## `.create()` 

Creates a record in the database.

```python title="Method Syntax"
db.create(thing, data)
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
                <code>thing</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The table name or a [`RecordID`](/docs/sdk/python/data-types#recordid) to create.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>data</code>
               <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The document / record data to create.
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```python
# Create a record with a random ID
person = db.create('person')

# Create a record with a specific ID
person = db.create(RecordID('person', 'tobie'), {
	"name": 'Tobie',
	"settings": {
		"active": True,
		"marketing": True,
	}
})
```

### Translated query
This function will run the following query in the database.

```surql
CREATE $thing CONTENT $data;
```

<br />

## `.insert()` 

Inserts one or multiple records in the database.

```python title="Method Syntax"
db.insert(table, data)
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
                <code>thing</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The table name to insert to.
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
```python

# Insert a single record
db.insert('person', {
	"name": 'Tobie',
	"settings": {
		"active": True,
		"marketing": True,
	},
})

# Insert multiple records
db.insert('person', [
	{
		"name": 'Tobie',
		"settings": {
			"active": True,
			"marketing": True,
		},
	},
	{
		"name": 'Jaime',
		"settings": {
			"active": True,
			"marketing": True,
		},
	},
])
```

### Translated query
This function will run the following query in the database.

```surql
INSERT INTO $table $data;
```

<br />

## `.insert_relation()` 

Inserts one or multiple relations in the database.

```python title="Method Syntax"
db.insert_relation(table, data)
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
                The table name to insert to.
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
```python


# Insert a single record
db.insert_relation('likes', {
	"in": RecordID('person', 'tobie'),
	"out": RecordID('post', 123)
})

# Insert multiple records across tables
people = db.insert_relation('likes', [
	{
    	"in": RecordID('person', 'tobie'),
    	"out": RecordID('post', 123),
	},
	{
    	"in": RecordID('person', 'jaime'),
    	"out": RecordID('post', 456),
	}
])
```

### Translated query
This function will run the following query in the database.

```surql
INSERT RELATION INTO $table $data;
```

<br />

## `.update()` 

Updates all records in a table, or a specific record, in the database.

```python title="Method Syntax"
db.update(thing, data)
```

> [!NOTE]
> This function replaces the current document / record data with the specified data.

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
                The table name or the specific [`RecordID`](/docs/sdk/python/data-types#recordid) to update.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>data</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The document / record data to update.
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```python

# Update all records in a table
db.update('person', {name: "Jaime"})

# Update a record with a specific ID
db.update(RecordID('person', 'tobie'), {
	"name": 'Tobie',
	"settings": {
		"active": True,
		"marketing": True,
	}
})
```

### Translated query
This function will run the following query in the database.

```surql
UPDATE $thing CONTENT $data;
```

<br />

## `.merge()` 

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
db.merge('person', {
	"updated_at": datetime.datetime.now().isoformat()
})

# Update a record with a specific ID
db.merge(RecordID('person', 'tobie'), {
	"updated_at": datetime.datetime.now().isoformat(),
	"settings": {
		"active": True,
	}
})
```

### Translated query
This function will run the following query in the database.

```surql
UPDATE $thing MERGE $data;
```

<br />

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
db.patch('person', [
	{ "op": 'replace', "path": '/created_at', "value": datetime.datetime.now().isoformat() },
])

# Update a record with a specific ID
db.patch(RecordID('person', 'tobie'), [
	{ "op": 'replace', "path": '/settings/active', "value": False },
	{ "op": 'add', "path": '/tags', "value": ['developer', 'engineer'] },
	{ "op": 'remove', "path": '/temp' },
])
```

### Translated query
This function will run the following query in the database.

```surql
UPDATE $thing PATCH $data;
```

<br />

## `.delete()`

Deletes all records in a table, or a specific record, from the database.

```python title="Method Syntax"
db.delete(thing,data)
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
                <code>thing</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The table name or a [`RecordID`](/docs/sdk/python/data-types#recordid) to delete.
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```python
# Delete all records from a table
db.delete('person')

# Delete a specific record from a table
db.delete(RecordID('person', 'h5wxrf2ewk8xjxosxtyc'))
```

### Translated query
This function will run the following query in the database.

```surql
DELETE $thing;
```
