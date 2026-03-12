---
sidebar_position: 2
sidebar_label: Arguments
title: Arguments | Embedded scripting functions | SurrealQL
description: Additional arguments can be passed in to the function from SurrealDB, and these are accessible as an array using the arguments object within the JavaScript function.
---

# Arguments

Additional arguments can be passed in to the function from SurrealDB, and these are accessible as an array using the `arguments` object within the JavaScript function.

```surql 
-- Create a new parameter
LET $val = "SurrealDB";
-- Create a new parameter
LET $words = ["awesome", "advanced", "cool"];
-- Pass the parameter values into the function
CREATE article SET summary = function($val, $words) {
	const [val, words] = arguments;
	return `${val} is ${words.join(', ')}`;
};
```