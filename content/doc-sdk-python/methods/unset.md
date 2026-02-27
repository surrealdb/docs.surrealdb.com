---
sidebar_position: 1
sidebar_label: unset
title: Python | SDK | Methods | unset
description: The SurrealDB SDK for Python enables simple and advanced querying of a remote or embedded database.
---

import Label from "@components/shared/Label.astro";

# `.unset()`

Removes a variable for this connection.

```python title="Method Syntax"
db.unset(key)
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
                <code>key</code>
                <Label label="required" />
            </td>
            <td colspan="2" scope="row" data-label="Description">
                Specifies the name of the variable.
            </td>
        </tr>
    </tbody>
</table>

### Example usage
```python
# Remove the variable from the connection
await db.unset('name')
```
