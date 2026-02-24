---
sidebar_position: 3
sidebar_label: Set parameters 
title: Set parameters | .NET | SDK | Concepts
description: In this section, you will learn how to set parameters in the .NET SDK for SurrealDB.
---

import Label from "@components/shared/Label.astro";

# Set parameters

Within your application, you can define parameters that can be used to store and retrieve data from SurrealDB.
Parameters are used to store data in a structured format, and can be used to store data in a key-value pair format.

>[!IMPORTANT]
> Parameters allow you to define global (database-wide) parameters that are available to every client.

<table>
	<thead>
		<tr>
			<th scope="col">Method</th>
			<th scope="col">Description</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td scope="row" data-label="Method"><a href="#set"> <code> db.Set(key, value) </code></a></td>
			<td scope="row" data-label="Description">Assigns a value as a parameter for this connection</td>
		</tr>
        <tr>
            <td scope="row" data-label="Method"><a href="#unset"> <code> db.Unset(key) </code></a></td>
            <td scope="row" data-label="Description">Removes a parameter for this connection</td>
        </tr>
	</tbody>
</table>

## `.Set()` {#set}

Assigns a value as a parameter for this connection.

```csharp title="Method Syntax"
await db.Set(key, val)
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
                <code>key</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Specifies the name of the variable.
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="col" scope="row" data-label="Arguments">
                <code>value</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Assigns the value to the variable name.
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
// Assign the variable on the connection
await db.Set("name", new Name { FirstName = "Tobie", LastName = "Morgan Hitchcock" });

// Use the variable in a subsequent query
await db.Query($"CREATE person SET name = $name");

// Use the variable in a subsequent query
await db.Query($"SELECT * FROM person WHERE name.first_name = $name.first_name");
```

<br />

## `.Unset()` {#unset}

Removes a parameter for this connection.

```csharp title="Method Syntax"
await db.Unset(key)
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
                <code>key</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="col" scope="row" data-label="Description">
                Specifies the SurrealQL statements.
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
await db.Unset("name");
```