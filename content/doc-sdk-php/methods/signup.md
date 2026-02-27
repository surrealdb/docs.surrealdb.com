---
sidebar_position: 1
sidebar_label: signup
title: Signup Method in PHP | PHP SDK | Integration | SurrealDB
description: The ->signup() method for the SurrealDB SDK for PHP signs up to a specific access method.
---

import Label from "@components/shared/Label.astro";
import Since from "@components/shared/Since.astro";

# `->signup()` {#signup}

Signs up to a specific authentication scope.

```php title="Method Syntax"
$db->signup([
    "namespace" => "test",
    "database" => "db",
    "scope" => "scope",
    // ... other variables
]);
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
                <code>namespace</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The namespace to sign up to
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>database</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The database to sign up to
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Arguments">
                <code>scope</code>
                <Label label="required" />
                <Since v="1.x" prefix={false} />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The scope to sign up to. Also pass any variables used in the scope. Only supported in SurrealDB 1.x
            </td>
        </tr>
        <tr>
            <td colspan="2" scope="row" data-label="Properties">
                <code>access</code>
                <Label label="required" />
                <Since v="2.x" prefix=">=" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                The access to sign in to. Also pass any variables used in the access. Only supported from SurrealDB 2.x onwards
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```php
$token = $db->signup([
	"namespace" => "surrealdb",
	"database" => "docs",
	"scope" => "user",

	// Also pass any properties required by the scope definition
	"email" => "info@surrealdb.com",
	"pass" => "123456",
]);
```

You can invalidate the authentication for the current connection using the [`invalidate()` method](/docs/sdk/php/methods/invalidate).
