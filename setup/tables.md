# Tables and Fields

```sql
-- Define a new table on the database
DEFINE TABLE person;
-- Remove a table from the database
REMOVE TABLE person;

-- Define a new table as schemaless
DEFINE TABLE items SCHEMALESS;
-- Define a new table as schemafull
DEFINE TABLE items SCHEMAFULL;

-- Define a new table as with no scope permissions
DEFINE TABLE items PERMISSIONS NONE;
-- Define a new table as with full scope permissions
DEFINE TABLE items PERMISSIONS FULL;
-- Define a new table as with advanced scope permissions
DEFINE TABLE items PERMISSIONS FOR select FULL FOR delete NONE FOR create, update WHERE $auth.type = "admin";
```

```sql
-- Define a new field on a database table
DEFINE FIELD age ON person;
-- Remove a field from a database table
REMOVE FIELD name ON person;

-- Define a new field with a type
DEFINE FIELD age ON person TYPE number;
-- Define a new embedded field with type
DEFINE FIELD name.first ON person TYPE string;
-- Define a new field on an array of objects
DEFINE FIELD emails.*.value ON person TYPE email;
-- Define a new field with min and max allowed values
DEFINE FIELD age ON person TYPE number ASSERT ($value >= 0 AND $value <= 100);
-- Define a new field which can not be specified as NULL
DEFINE FIELD age ON person TYPE number ASSERT ($value != NULL AND $value >= 0 AND $value <= 100);
-- Define a new field which defaults to a specified value if not defined
DEFINE FIELD country ON address TYPE string VALUE IF $value IS EMPTY THEN "GBR" ELSE $value END;
-- Define a new field into which any data put must match a regular expression
DEFINE FIELD iso ON output TYPE string ASSERT $value = /^[A-Z]{3}$/;
-- Define a new field into which any data put must match a specific set of values
DEFINE FIELD kind ON address TYPE custom ASSERT $value IN ["home","work"];
-- Define a new computed field which will autoupdate when any dependent fields change
DEFINE FIELD fullname ON person TYPE string VALUE string.join(' ', firstname, middlename, lastname);

-- Define a new field which can not be viewed or edited by any user authenticated by scope
DEFINE FIELD password ON person TYPE string PERMISSIONS NONE;
-- Define a new field which has specific access methods for any user authenticated by scope
DEFINE FIELD notes ON person TYPE string PERMISSIONS FOR select WHERE $auth.accountid = accountid FOR create, update, delete WHERE $auth.accountid = accountid AND $auth.type = "admin";
```
