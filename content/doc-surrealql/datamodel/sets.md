---
sidebar_position: 21
sidebar_label: Sets
title: Sets | SurrealQL
description: A set is a collection type of deduplicated and ordered values that can have a maximum size limit.

---

# Sets

> [!NOTE]
> Before version 3.0.0-beta, sets were simply arrays that deduplicated their items. To emulate the former behaviour, add the clause `VALUE $value.distinct()` to a `DEFINE FIELD` definition.

A set is similar to an array, but with two key differences:

* The values in a set are automatically deduplicated.
* The values in a set are automatically ordered.

A set can be created using the literal syntax `{}`.

```surql
/**[test]

[[test.results]]
value = "{1, 2, 6}"

*/

RETURN {1, 6, 6, 2};
-- {1, 2, 6}
```

To create a set with zero items or a single item, add a comma.

```surql
/**[test]

[[test.results]]
value = "true"

[[test.results]]
value = "true"

[[test.results]]
value = "false"

[[test.results]]
value = "false"

*/
{,}.is_set();  -- true
{9,}.is_set(); -- true

{}.is_set();   -- false
{9}.is_set();  -- false
```

In addition to the `{}` literal syntax, an array can be cast into a set.

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ bank_accounts: [55555, 55555, 98787], id: customer:q57ltnsy4rnpwtica0qa, languages: {'en', 'ja', 'kr'} }]"

*/

DEFINE FIELD bank_accounts ON TABLE customer TYPE array<int>;
DEFINE FIELD languages ON TABLE customer TYPE set<string>;

CREATE customer SET
    bank_accounts = [
      55555,
      55555,
      98787
    ],
    languages = <set>[
        "en",
        "ja",
        "kr",
        "kr"
    ];
```

```surql title="Output"
[
	{
		bank_accounts: [
			55555,
			98787
		],
		id: customer:uv6mn62t8td9vzvfogh4,
		languages: {
			'en',
			'ja',
			'kr'
		}
	}
]
```

Casting into a `set` and back into an array can be a convenient way to deduplicate items in the same way that the [`array::distinct()`](/docs/surrealql/functions/database/array#arraydistinct) and [`array::sort()`](/docs/surrealql/functions/database/array#arraysort) functions are used.

```surql
/**[test]

[[test.results]]
value = "[3, 4, 5, 6, 7, 9, 18]"

[[test.results]]
value = "[3, 4, 5, 6, 7, 9, 18]"

*/

<array><set>[18,7,6,6,6,6,5,4,3,9];
[18,7,6,6,6,6,5,4,3,9].distinct().sort();
```

```surql title="Output"
[3, 4, 5, 6, 7, 9, 18]
```