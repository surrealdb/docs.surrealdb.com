---
sidebar_position: 7
sidebar_label: Writing stored procedures
title: Surrealist | Writing stored procedures
description: Surrealist is a user interface for interacting with your SurrealDB database visually. It enables you to seamlessly connect to any SurrealDB instance, allowing you to execute queries, explore your tables, design your schemas, and much more.
---

import Image from "@components/Image.astro";
import ImageFunctions from "@img/image/surrealist/functions.png";

# Writing stored procedures

SurrealDB provides the ability to write and store functions, also known as stored procedures, directly in the database. These functions can be called from SurrealQL queries, allowing for more complex and reusable queries.

Surrealist provides a useful view where you can manage and create these functions visually using an intuitive SurrealQL editor.

<Image
  alt="Surrealist functions view"
  src={ImageFunctions}
/>

### Functions panel

The functions panel list out all functions stored in the database. You can press any function to open it in the editor panel where you can view and edit the function's contents.

### Creating a function

You can press the plus button in the top right of this panel to start writing a new function. This will first prompt you to enter a name for the function. For complex function names it is conventional to namespace them using double colons (`::`), for example `fn::project::has_member`.

After entering the function name, press "Continue" to open the function editor panel where you can write the function body.

## Function editor panel

After selecting or creating a function you will be presented with the function editor panel. Here you can write the function body using SurrealQL statements, similar to how you would write a query.
To the right of the editor you will see a column with some metadata about the function, such as function arguments, a permission clause, and a comment field.
You can also find buttons to download the function as a file, and a function to remove the function from the database.

When you make changes to a function, you can press the "Save changes" button in the bottom right of the editor to save the changes to the database.
