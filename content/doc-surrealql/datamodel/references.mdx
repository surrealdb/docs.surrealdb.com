---
sidebar_position: 19
sidebar_label: Record references
title: Record references | SurrealQL
description: Record references allow you to link records together, enabling you to traverse from one record to another.

---

import Since from '@components/shared/Since.astro'

# Record references

<Since v="v2.2.0" />

## Basic concepts

Reference tracking begins by adding a `REFERENCE` clause to any `DEFINE FIELD` statement, as long as the field is a top-level field of type `record` or array of records.

```surql
/**[test]

[[test.results]]
value = "NONE"

*/

DEFINE FIELD comics ON person TYPE option<array<record<comic_book>>> REFERENCE;
-- Also works as `option` desugars to this syntax
DEFINE FIELD comics ON person TYPE array<record<comic_book>> | NONE REFERENCE;

-- `comics` field might not be a record, does not work
DEFINE FIELD comics ON person TYPE array<record<comic_book>> | string REFERENCE;
-- Not top-level field, does not work
DEFINE FIELD metadata.comics ON person TYPE array<record<comic_book>> REFERENCE;
```

This incoming record can then be picked up with the `<~` syntax that works in the same way that graph queries do.

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ comics: [comic_book:one], id: person:mat, name: 'Mat' }]"

[[test.results]]
value = "[{ comics: [comic_book:one], id: person:nynaeve, name: 'Nynaeve' }]"

[[test.results]]
value = "[{ id: comic_book:one, title: 'Loki, God of Stories' }]"

[[test.results]]
value = "[{ id: comic_book:one, owners: [person:mat, person:nynaeve], title: 'Loki, God of Stories' }]"

[[test.results]]
value = "[{ id: comic_book:one, owners: [{ id: person:mat, name: 'Mat' }, { id: person:nynaeve, name: 'Nynaeve' }], title: 'Loki, God of Stories' }]"

*/

DEFINE FIELD comics ON person TYPE option<array<record<comic_book>>> REFERENCE;
CREATE person:mat SET 
	name = "Mat", 
	comics = [comic_book:one];
CREATE person:nynaeve SET 
	name = "Nynaeve", 
	comics = [comic_book:one];
CREATE comic_book:one SET title = "Loki, God of Stories";

SELECT 
	*, 
	<~person AS owners
FROM comic_book;

SELECT 
	*, 
	<~person.{ id, name } AS owners
FROM comic_book;
```

```surql title="Output"
-------- Query --------

[
	{
		id: comic_book:one,
		owners: [
			person:mat,
			person:nynaeve
		],
		title: 'Loki, God of Stories'
	}
]

-------- Query --------

[
	{
		id: comic_book:one,
		owners: [
			{
				id: person:mat,
				name: 'Mat'
			},
			{
				id: person:nynaeve,
				name: 'Nynaeve'
			}
		],
		title: 'Loki, God of Stories'
	}
]
```

## Specifying linking tables

Incoming references can also be declared in a schema.

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ comics: [comic_book:one], id: person:one }, { comics: [comic_book:one], id: person:two }]"

[[test.results]]
value = "[{ id: publisher:one, products: [comic_book:one, book:one] }]"

[[test.results]]
value = "[{ id: comic_book:one, owners: [person:one, person:two], publishers: [publisher:one], title: 'Loki, God of Stories' }]"

[[test.results]]
value = "[{ id: comic_book:one, owners: [person:one, person:two], publishers: [publisher:one], title: 'Loki, God of Stories' }]"

*/

DEFINE FIELD comics ON person TYPE option<array<record<comic_book>>> REFERENCE;
DEFINE FIELD products ON publisher TYPE option<array<record<comic_book|book>>> REFERENCE;
DEFINE FIELD owners ON comic_book COMPUTED <~person;
DEFINE FIELD publishers ON comic_book COMPUTED <~publisher;

CREATE person:one, person:two SET comics = [comic_book:one];
CREATE publisher:one SET products = [comic_book:one, book:one];
CREATE comic_book:one SET title = "Loki, God of Stories";
SELECT * FROM comic_book;
```

```surql title="Output"
[
	{
		id: comic_book:one,
		owners: [
			person:one,
			person:two
		],
		publishers: [
			publisher:one
		],
		title: 'Loki, God of Stories'
	}
]
```

A field of type `references` can be further narrowed down to specify not just the table name, but also the field name of the referencing record. This can be done by enclosing the part after `<~` in parentheses, adding the `FIELD` keyword and naming the field or fields via which incoming references will be shown.

```surql
DEFINE FIELD comics ON person TYPE option<array<record<comic_book>>> REFERENCE;
DEFINE FIELD borrowed_comics ON person TYPE option<array<record<comic_book>>> REFERENCE;
DEFINE FIELD owned_by ON comic_book COMPUTED <~(person FIELD comics);
DEFINE FIELD borrowed_by ON comic_book COMPUTED <~(person FIELD borrowed_comics);
DEFINE FIELD all_readers ON comic_book COMPUTED <~(person FIELD comics borrowed_comics);

CREATE person:one SET comics = [comic_book:one];
CREATE person:two SET borrowed_comics = [comic_book:one];
CREATE comic_book:one SET title = "Loki, God of Stories";
SELECT * FROM comic_book;
```

```surql title="Output"
[
	{
		all_readers: [ person:one, person:two ],
		borrowed_by: [ person:two ],
		id: comic_book:one,
		owned_by: [ person:one ],
		title: 'Loki, God of Stories'
	}
]
```

## Specifying deletion behaviour

When working with record links, it is very likely that you will want some behaviour to happen when a referencing link is deleted. Take the following example of a `person` who owns a `comic_book`, which is later deleted. Despite the deletion, a follow-up `SELECT * FROM person` still shows the comic book.

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ id: comic_book:one, owned_by: [], title: 'Loki, God of Stories' }]"

[[test.results]]
value = "[{ comics: [comic_book:one], id: person:one }]"

[[test.results]]
value = "[]"

[[test.results]]
value = "[{ comics: [comic_book:one], id: person:one }]"

*/

DEFINE FIELD comics ON person TYPE option<array<record<comic_book>>> REFERENCE;
DEFINE FIELD owned_by ON comic_book COMPUTED <~person;

CREATE comic_book:one SET title = "Loki, God of Stories";
CREATE person:one SET comics = [comic_book:one];
DELETE comic_book:one;
SELECT * FROM person;
```

```surql title="Output"
[
	{
		comics: [
			comic_book:one
		],
		id: person:one
	}
]
```

A query using `INFO FOR TABLE person` shows that the actual statement created using `REFERENCE` does not finish at this point, but includes the clause `ON DELETE IGNORE`. This is the default behaviour for references.

```surql
{
	events: {},
	fields: {
		comics: 'DEFINE FIELD comics ON person TYPE none | array<record<comic_book>> REFERENCE ON DELETE IGNORE PERMISSIONS FULL',
		"comics.*": 'DEFINE FIELD comics.* ON person TYPE record<comic_book> REFERENCE ON DELETE IGNORE PERMISSIONS FULL'
	},
	indexes: {},
	lives: {},
	tables: {}
}
```

This `ON DELETE` clause can be modified to have some other behaviour when a reference is deleted.

### ON DELETE IGNORE

As shown in the previous section, `ON DELETE IGNORE` is the default behaviour for references and this clause will be added automatically if not specified. It can be added manually to a statement to hint to others reading the code that this behaviour is desired.

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ friended_by: [], friends: [person:two], id: person:one }]"

[[test.results]]
value = "[{ friended_by: [person:one], id: person:two }]"

[[test.results]]
value = "[]"

[[test.results]]
value = "{ friended_by: [], id: person:two }"

*/

-- Default, behaviour, so identical to:
-- DEFINE FIELD friends ON person TYPE option<array<record<person>>> REFERENCE;
DEFINE FIELD friends ON person TYPE option<array<record<person>>> REFERENCE ON DELETE IGNORE;
DEFINE FIELD friended_by ON person COMPUTED <~person;

CREATE person:one SET friends = [person:two];
CREATE person:two;
DELETE person:one;
person:two.*;
```

As the deletion of `person:one` is ignored when calculating the `friended_by` field, it will still show `person:one` even though the record itself has been deleted.

```surql
{
	friended_by: [
		person:one
	],
	id: person:two
}
```

### ON DELETE UNSET

`ON DELETE UNSET` will unset (remove) any linked records that are deleted. This can be thought of as the opposite of `ON DELETE IGNORE`.

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ id: person:one }], [{ comments: [comment:rkvpjc0l9iruy21k89su], id: person:one }]"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ comments: [comment:rkvpjc0l9iruy21k89su, comment:tu5f72ouuydjvycg41st], id: person:one }]"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[]"

[[test.results]]
value = "[{ author: [person:one], id: comment:rkvpjc0l9iruy21k89su, text: 'Estonia is bigger than I expected!' }]"

*/

DEFINE FIELD comments ON person TYPE option<array<record<comment>>> REFERENCE ON DELETE UNSET;
DEFINE FIELD author ON comment COMPUTED <~person;

CREATE person:one;
UPDATE person:one SET comments += (CREATE ONLY comment SET text = "Estonia is bigger than I expected!").id;
-- Give this one a parameter name so it can be deleted later
LET $comment = CREATE ONLY comment SET text = "I don't get the joke here?";
UPDATE person:one SET comments += $comment.id;
-- Now delete it
DELETE $comment;
-- Only one comment shows up for person:one now
person:one.comments.*.*;
```

```surql title="Output of person:one queries"
-------- Query --------

[
	{
		comments: [
			comment:gj1kb2e3tedn7kjcxxja,
			comment:6sztlhd6fhgc91dg2lby
		],
		id: person:one
	}
]

-------- Query --------

[
	{
		author: [
			person:one
		],
		id: comment:gj1kb2e3tedn7kjcxxja,
		text: 'Estonia is bigger than I expected!'
	}
]
```

### ON DELETE CASCADE

The `ON DELETE CASCADE` will cause a record to be deleted if any record it references is deleted. This is useful for records that should not exist if a record that links to them no longer exists.

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ comments: [], id: person:one }]"

[[test.results]]
value = "[{ author: person:one, id: comment:4u9gw4bl2q63zuos3v1y, text: '5/10 for this blog post. The problems I have with it are...' }]"

[[test.results]]
value = "[{ author: person:one, id: comment:em2543ghwy9k921eob3d, text: 'WOW! I never knew you could cut a rope with an arrow.' }]"

[[test.results]]
value = "[{ author: person:one, id: comment:4u9gw4bl2q63zuos3v1y, text: '5/10 for this blog post. The problems I have with it are...' }, { author: person:one, id: comment:em2543ghwy9k921eob3d, text: 'WOW! I never knew you could cut a rope with an arrow.' }]"

[[test.results]]
value = "[]"

[[test.results]]
value = "[]"

*/

DEFINE FIELD author ON comment TYPE record<person> REFERENCE ON DELETE CASCADE;
DEFINE FIELD comments ON person COMPUTED <~comment;

CREATE person:one;
CREATE comment SET author = person:one, text = "5/10 for this blog post. The problems I have with it are...";
CREATE comment SET author = person:one, text = "WOW! I never knew you could cut a rope with an arrow.";

-- Show all the details of comments for 'person:one'
person:one.comments.*.*;
DELETE person:one;
-- Comments no longer exist
SELECT * FROM comment;
```

```surql title="Output"
-------- Query --------

[
	{
		author: person:one,
		id: comment:8msvp0egg8cdlyu4vvn9,
		text: 'WOW! I never knew you could cut a rope with an arrow.'
	},
	{
		author: person:one,
		id: comment:i72qfjy59vbn81hk6lrm,
		text: '5/10 for this blog post. The problems I have with it are...'
	}
]

-------- Query --------

[]

-------- Query --------

[]
```

### ON DELETE REJECT

`ON DELETE REJECT` will outright make it impossible to delete a record that is referenced from somewhere else. For example, consider the case in which a house should not be demolished (deleted) until it has been disconnected from utilities such as gas, water, electricity, and so on. This can be simulated in a schema by adding a `REFERENCE ON DELETE REJECT` to the `utility` table, making it impossible for any `house` to be deleted if they link to it.

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ id: house:one, using: [] }]"

[[test.results]]
value = "[{ connected_to: [house:one], id: utility:gas }, { connected_to: [house:one], id: utility:water }]"

*/

DEFINE FIELD connected_to ON utility TYPE option<array<record<house>>> REFERENCE ON DELETE REJECT;
DEFINE FIELD using ON house COMPUTED <~utility;

CREATE house:one;
CREATE utility:gas, utility:water SET connected_to = [house:one];
```

At this point, the `using` field on `house:one` automatically picks up the two references. Due to these references, the `house` record cannot be deleted.

```surql
house:one.*;
DELETE house:one;
```

```surql title="Output"
-------- Query --------

{
	id: house:one,
	using: [
		utility:gas,
		utility:water
	]
}

-------- Query --------

'Cannot delete `house:one` as it is referenced by `utility:gas` with an ON DELETE REJECT clause'
```

To delete the `house`, the `connected_to` references will first have to be removed.

```surql
UPDATE utility:gas   SET connected_to -= house:one;
UPDATE utility:water SET connected_to -= house:one;

DELETE house:one;
```

Note that an `ON DELETE UNSET` for a required field is effectively the same as an `ON DELETE REJECT`. In both of the following two cases, a `person` that has any referencing `comment` records will not be able to be deleted.

```surql
-- Non-optional field that attempts an UNSET when referencing 'person' is deleted
DEFINE FIELD author ON comment TYPE record<person> REFERENCE ON DELETE UNSET;
LET $person = CREATE ONLY person;
CREATE comment SET text = "Cats are so much better at climbing UP a tree than down! Lol", author = $person.id;
DELETE person;

-- Optional field which rejects the deletion of a referencing 'person'
DEFINE FIELD author ON comment TYPE option<record<person>> REFERENCE ON DELETE REJECT;
LET $person = CREATE ONLY person;
CREATE comment SET text = "Cats are so much better at climbing UP a tree than down! Lol", author = $person.id;
DELETE person;
```

The error message in these two cases will differ, but the behaviour is the same.

```surql
-------- Query --------

"An error occured while updating references for `person:97sfkadd56hqhimbf69m`: Couldn't coerce value for field `author` of `comment:kkigvk5knsoeg53p08n1`: Expected `record<person>` but found `NONE`"

-------- Query --------

'Cannot delete `person:3fm76xztvfab99eq780l` as it is referenced by `comment:ig0ogusbm64cier5ovv9` with an ON DELETE REJECT clause'
```

### ON DELETE THEN

The `ON DELETE THEN` clause allows for custom logic when a reference is deleted. This clause includes a parameters called `$this` to refer to the record in question, and `$reference` for the reference.

In the following example, a `person` record's `comments` field will remove any comments when they are deleted, but also add the same comment to a different field called `deleted_comments`.

```surql
/**[test]

[[test.results]]
value = "NONE"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ comments: [comment:7g857mbox5rdqvjuezxf], id: person:one }]"

[[test.results]]
value = "NONE"

[[test.results]]
value = "[{ comments: [comment:7g857mbox5rdqvjuezxf, comment:o7qgd26uruvf3hracvrh], id: person:one }]"

[[test.results]]
value = "[]"

[[test.results]]
value = "[{ comments: [comment:7g857mbox5rdqvjuezxf], deleted_comments: [comment:o7qgd26uruvf3hracvrh], id: person:one }]"

*/

DEFINE FIELD comments ON person TYPE option<array<record<comment>>> REFERENCE ON DELETE THEN {
    UPDATE $this SET
        deleted_comments += $reference,
        comments -= $reference;
};
DEFINE FIELD author ON comment COMPUTED <~person;

CREATE person:one SET comments += (CREATE ONLY comment SET text = "Estonia is bigger than I expected!").id;
LET $comment = CREATE ONLY comment SET text = "I don't get the joke here?";
UPDATE person:one SET comments += $comment.id;
DELETE $comment;
SELECT * FROM person:one;
```

```surql title="person:one before and after comment is deleted"
-------- Query --------

[
	{
		comments: [
			comment:lbeyh2icushpwo0ak5ux,
			comment:90tdnyoa14cge2ocmep7
		],
		id: person:one
	}
]

-------- Query --------

[
	{
		comments: [
			comment:lbeyh2icushpwo0ak5ux
		],
		deleted_comments: [
			comment:90tdnyoa14cge2ocmep7
		],
		id: person:one
	}
]
```