---
sidebar_position: 1
sidebar_label: Merge
title: .NET | SDK | Methods | Merge
description: The .NET SDK for SurrealDB enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.Merge<T>()` {#merge}

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