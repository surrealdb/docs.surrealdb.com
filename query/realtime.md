# Realtime Queries

```sql
-- Define a live query for a table
LIVE SELECT * FROM person;
-- Remove a live query from a table
KILL "183047103847103847";

-- Define a live query for a table, only for records which match a condition
LIVE SELECT name, age, country FROM person WHERE age > 18 AND age < 60;
```
