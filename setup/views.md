# Dynamic Tables

```sql
-- Define an aggregated view on a database
DEFINE VIEW ages AS SELECT count(*), min(age), max(age) FROM person;
-- Remove an aggregated view from a database
REMOVE VIEW ages;

-- Define an aggregated view with a where clause
DEFINE VIEW ages AS SELECT count(*), min(age), max(age) FROM person WHERE age > 18;
-- Define an aggregated view with a where clause, and a group-by clause
DEFINE VIEW ages AS SELECT count(*), min(age), max(age) FROM person WHERE age > 18 GROUP BY nationality;
-- Define an aggregated view with a where clause, and multiple group-by clauses
DEFINE VIEW ages AS SELECT count(*), min(age), max(age) FROM person WHERE age > 18 GROUP BY nationality, gender;
```
