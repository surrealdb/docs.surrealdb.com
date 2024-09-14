---
sidebar_position: 5
sidebar_label: Type conversion
title: Type conversion | Embedded scripting functions | SurrealQL
description: Any value from SurrealDB is converted into a JavaScript type automatically, and the return value from the JavaScript function is converted to a SurrealQL value.
---

# Type conversion

Any value from SurrealDB is converted into a JavaScript type automatically, and the return value from the JavaScript function is converted to a SurrealQL value. Boolean values, Integers, Floats, Strings, Arrays, Objects, and Date objects are all converted automatically to and from SurrealQL values.

```surql
CREATE user:test SET created_at = function() {
	return new Date();
};
```

In addition, a number of special classes are included within the JavaScript functions for the additional types which are not built into JavaScript. These enable the creation of [`duration`](/docs/surrealql/datamodel/datetimes#durations-and-datetimes) values, [`record`](/docs/surrealql/datamodel/ids) ids, and [`UUID`](/docs/surrealql/datamodel/strings#uuid) values from within JavaScript.

Any values of these types passed into embedded scripting functions are also represented with these special classes.

```surql
CREATE user:test SET
	session_timeout = function() {
		return new Duration('1w');
	},
	best_friend = function() {
		return new Record('user', 'joanna');
	},
	identifier = function() {
		return new Uuid('03412258-988f-47cd-82db-549902cdaffe');
	}
;
```