---
sidebar_position: 1
sidebar_label: insertRelation
title: Insert Method in PHP | PHP SDK | Integration | SurrealDB
description: Insert one or multiple relations in the database using the insertRelation method with the SurrealDB PHP SDK.
---

import Label from "@components/shared/Label.astro";

# `->insertRelation()` {#insertRelation}

Inserts one or multiple relations in the database.

```php title="Method Syntax"
$db->insertRelation($thing, $data)
```

### Arguments

<table>
	<thead>
		<tr>
			<th colspan="2" scope="col">Arguments</th>
			<th colspan="2" scope="col">Type</th>
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
				`string` or `Table`
			</td>
			<td colspan="2" scope="row" data-label="Description">
				Target table to insert the relation to.
			</td>
		</tr>
		<tr>
			<td colspan="2" scope="row" data-label="Arguments">
				<code>data</code>
			   <Label label="optional" />
			</td>
			<td colspan="2" scope="row" data-label="Type">
				`array`
			</td>
			<td colspan="2" scope="row" data-label="Description">
				An array of relations to insert.
			</td>
		</tr>
	</tbody>
</table>

### Example usage
```php

// Insert a single relation
$relation = $db->insertRelation('person', [
	"id" => new RecordId('person', 'tobie'),
	"in" => new RecordId('company', 'surreal'),
	"out" => new RecordId('role', 'founder'),
]);

// Insert multiple relations
$relations = $db->insertRelation('person', [
	[
		"id" => new RecordId('person', 'tobie'),
		"in" => new RecordId('company', 'surreal'),
		"out" => new RecordId('role', 'founder'),
	],
	[
		"id" => new RecordId('person', 'jaime'),
		"in" => new RecordId('company', 'surreal'),
		"out" => new RecordId('role', 'cofounder'),
	],
]);
```