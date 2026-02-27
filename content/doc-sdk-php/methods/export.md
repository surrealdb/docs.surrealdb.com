---
sidebar_position: 1
sidebar_label: export
title: Export Method in PHP | PHP SDK | Integration | SurrealDB
description: Export data from a local or remote database using the export method with the SurrealDB PHP SDK.
---

import Label from "@components/shared/Label.astro";

# `->export()` {#export}

Exports data from a table.

> [!NOTE]
> This method is only available on a remote database targeted with the http protocol.


```php title="Method Syntax"
$db->export($username, $password);
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
				<code>username</code>
				<Label label="required" />
			</td>
			<td colspan="2" scope="row" data-label="Type">
				`string`
			</td>
			<td colspan="2" scope="row" data-label="Description">
				The username to authenticate with.
			</td>
		</tr>
		<tr>
			<td colspan="2" scope="row" data-label="Arguments">
				<code>password</code>
				<Label label="required" />
			</td>
			<td colspan="2" scope="row" data-label="Type">
				`string`
			</td>
			<td colspan="2" scope="row" data-label="Description">
				The password to authenticate with.
			</td>
		</tr>
	</tbody>
</table>

### Example

```php title="Example"

// connect to the remote database. For the export to work, the database must exists with also existing data.
$db->connect('http://localhost:8080', [
	'namespace' => 'example',
	'database' => 'example',
]);

// Export data
$response = $db->export('admin', 'password');

// Create a file and write the response to it
$fp = fopen('exported_data.json', 'w');

// Write the response to the file
fwrite($fp, $response);

// Close the file
fclose($fp);
```