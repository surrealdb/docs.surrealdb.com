---
sidebar_position: 4
sidebar_label: Data Manipulation
title: Data Manipulation | .NET | SDK | Concepts
description: SurrealDB supports a number of methods for interacting with the database and performing CRUD operations.
---

import Label from "@components/shared/Label.astro";

# Data Manipulation

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
			<td scope="row" data-label="Method"><a href="#select"> <code> db.Select() </code></a></td>
			<td scope="row" data-label="Description">Selects all records in a table, or a specific record, from the database</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#create"> <code> db.Create() </code></a></td>
            <td scope="row" data-label="Description">Creates a record in the database</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#insert"> <code> db.Insert() </code></a></td>
            <td scope="row" data-label="Description">Inserts one or multiple records in the database</td>
		</tr>
		<tr>
			<td scope="row" data-label="Method"><a href="#insert_relation"> <code> db.InsertRelation() </code></a></td>
			<td scope="row" data-label="Description">Inserts one or multiple relations in the database</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#update"> <code> db.Update() </code></a></td>
            <td scope="row" data-label="Description">Updates all records in a table, or a specific record, in the database</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#upsert"> <code> db.Upsert() </code></a></td>
            <td scope="row" data-label="Description">Creates or updates a set of records in a table, or a specific record, in the database</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#merge"> <code> db.Merge() </code></a></td>
            <td scope="row" data-label="Description">Modifies all records in a table, or a specific record, in the database</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#patch"> <code> db.Patch() </code></a></td>
            <td scope="row" data-label="Description">Applies JSON Patch changes to all records, or a specific record, in the database</td>
        </tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#delete"> <code> db.Delete() </code></a></td>
            <td scope="row" data-label="Description">Deletes all records in a table, or a specific record, from the database</td>
        </tr>
	</tbody>
</table>

## `.Select<T>()` {#select}

Selects all records in a table, or a specific record, from the database.

```csharp title="Method Syntax"
await db.Select<T>(resource)
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
                <code>thing</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The table name or a [`RecordId`](/docs/sdk/dotnet/data-types#recordid) to select.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp
// Select all records from a table
var people = await db.Select<Person>("person");

// Select a specific record from a table
var person = await db.Select<Person>(("person", "h5wxrf2ewk8xjxosxtyc"));
var person = await db.Select<Person>(new StringRecordId("person:h5wxrf2ewk8xjxosxtyc"));

// Select a specific record from a table, given a non-string id
var person = await db.Select<Person>(("person", new Guid("8424486b-85b3-4448-ac8d-5d51083391c7")));
```

<br />

## `.Create<T>()` {#create}

Creates a record in the database.

```csharp title="Method Syntax"
await db.Create<T>(resource, data)
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
                The table name or a [`RecordId`](/docs/sdk/dotnet/data-types#recordid) to create.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>data</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The document / record data to insert.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp
// Create a record with a random ID
var person = await db.Create<Person>("person");

// Create a record with a random ID & specific fields
var person = await db.Create("person", new Person { Name = "Tobie" });

// Create a record with a specific ID
var personToCreate = new Person
{
    Id = ("person", "tobie"),
    Name = "Tobie",
    Settings = new Settings
    {
        Active = true,
        Marketing = true,
    },
};
var result = await db.Create(personToCreate);
```

<br />

## `.Insert<T>()` {#insert}

Inserts one or multiple records in the database.

```csharp title="Method Syntax"
await db.Insert<T>(table, data)
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

```csharp
var posts = new List<Post>
{
    new Post
    {
        Id = ("post", "First"),
        Title = "An article",
        Content = "This is the first article"
    },
    new Post
    {
        Id = ("post", "Second"),
        Title = "An article",
        Content = "This is the second article"
    }
};

await db.Insert("post", posts);
```

<br />

## `.InsertRelation<T>()` {#insert_relation}

Inserts one or multiple relations in the database.

```csharp title="Method Syntax"
await db.InsertRelation<T>(table, data)
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

```csharp
await db.InsertRelation(
    new WroteRelation
    {
        In = ("user", "u1"),
        Out = ("post", "p1"),
        CreatedAt = now,
        NumberOfPages = 144
    }
);
```

<br />

## `.Update<T>()` {#update}

Updates all records in a table, or a specific record, in the database.

```csharp title="Method Syntax"
await db.Update<T>(thing, data)
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
                The table name or the specific [`RecordId`](/docs/sdk/dotnet/data-types#recordid) to update.
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

```csharp
var post = new Post
{
    Id = ("post", "another"),
    Title = "A new article",
    Content = "This is a new article created using the .NET SDK"
};

// Updates a single record
await db.Update(post);

var data = new Person
{
    Name = "Tobie",
    Settings = new Settings
    {
        Active = true,
        Marketing = true,
    },
};

// Updates all records inside the "person" table
await db.Update("person", data);
```

<br />

## `.Upsert<T>()` {#upsert}

Creates or updates a specific record.

```csharp title="Method Syntax"
await db.Upsert<T>(data)
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
                <code>data</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The document / record data to insert.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp
var person = new Person
{
    Id = ("person", "tobie"), // Id is mandatory to apply create or update
    Name = "Tobie",
    Settings = new Settings
    {
        Active = true,
        Marketing = true,
    },
};

// Create a new record when it doesn't exist
var created = await db.Upsert(person);

// Update an existing record when it does exist
var updated = await db.Upsert(person);
```

<br />

## `.Merge<T>()` {#merge}

Modifies all records in a table, or a specific record.

```csharp title="Method Syntax"
await db.Merge<T>(resource, data)
```

> [!NOTE]
> This function merges the current document / record data with the specified data.

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
                The table name or the specific [`RecordId`](/docs/sdk/dotnet/data-types#recordid) to merge.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>data</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The data with which to modify the records.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp title="Merging data within a single record"
// Only changes the fields specified in the merge object
var merge = new PersonMerge
{
    Id = ("person", "tobie"),
    Settings = new Settings
    {
        Active = true,
        Marketing = false,
    },
};
var result = await db.Merge<PersonMerge, Person>(merge);

// Only changes the fields specified in the Dictionary
var data = new Dictionary<string, object>
{
    { "tags", new List<string> { "developer", "engineer" } }
};

var result = await db.Merge<Person>(("person", "tobie"), data);
```

```csharp title="Merging data for every record in a table"
// Only changes the fields specified in the merge object
var merge = new PersonMerge
{
    Settings = new Settings
    {
        Active = true,
        Marketing = false,
    },
};
var result = await db.Merge<PersonMerge, Person>("person", merge);

// Only changes the fields specified in the Dictionary
var data = new Dictionary<string, object>
{
    { "tags", new List<string> { "developer", "engineer" } }
};

var result = await db.Merge<Person>("person", data);
```

<br />

## `.Patch<T>()` {#patch}

Applies JSON Patch changes to all records, or a specific record, in the database.

```csharp title="Method Syntax"
await db.Patch<T>(resource, data)
```

> [!NOTE]
> This function patches document / record data with the specified <a href="https://jsonpatch.com/">JSON Patch</a> data.

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
                The table name or the specific [`RecordId`](/docs/sdk/dotnet/data-types#recordid) to patch.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>data</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The JSON Patch data with which to patch the records.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp
// Update a record with a specific ID
var result = await db.Patch(("person", "tobie"), patches);

// Update all records in a table
var result = await db.Patch("person", patches);
```

<br />

## `.Delete()` {#delete}

Deletes all records in a table, or a specific record, from the database.

```csharp title="Method Syntax"
await db.Delete(resource)
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
                The table name or a [`RecordId`](/docs/sdk/dotnet/data-types#recordid) to delete.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>cancellationToken</code>
                <Label label="optional" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                The cancellationToken enables graceful cancellation of asynchronous operations.
            </td>
        </tr>
    </tbody>
</table>

### Example usage

```csharp
// Delete all records from a table
await db.Delete("person");

// Delete a specific record from a table
await db.Delete(("person", "h5wxrf2ewk8xjxosxtyc"));
```