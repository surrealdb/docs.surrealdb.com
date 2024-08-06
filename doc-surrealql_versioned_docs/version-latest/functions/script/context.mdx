---
sidebar_position: 4
sidebar_label: Function context
title: Function context | Embedded scripting functions | SurrealQL
description: Embedded scripting functions inherit the context in which they are ran in. The this context of every embedded function is automatically set to the current document on every invocation.
---

# Function context

Embedded scripting functions inherit the context in which they are ran in. The this context of every embedded function is automatically set to the current document on every invocation. This allows the function to access the properties and fields of the current record being accessed / modified.

```surql
CREATE film SET
	ratings = [
		{ rating: 6, user: user:bt8e39uh1ouhfm8ko8s0 },
		{ rating: 8, user: user:bsilfhu88j04rgs0ga70 },
	],
	featured = function() {
		return this.ratings.filter(
			({ rating }) => rating >= 7
		).map(({ rating, ...data }) => {
			return {
				...data,
				rating: rating * 10
			};
		});
	}
;
```