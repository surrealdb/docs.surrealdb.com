# Table Indexes

```sql
-- Define an index for a table
DEFINE INDEX sortable ON person COLUMNS name;
-- Remove an index from a table
REMOVE INDEX sortable ON person;

-- Define a unique index on a table
DEFINE INDEX sortable ON person COLUMNS uuid UNIQUE;
-- Define a compound index with multiple columns
DEFINE INDEX sortable ON person COLUMNS firstname, lastname;

-- Define an index for all values in an array set
DEFINE INDEX tags ON person COLUMNS tags.*;
-- Define an index for all values in each object in an array set
DEFINE INDEX tags ON person COLUMNS tags.*.value;
```
