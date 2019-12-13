# Table Events

```sql
-- Define an event for a table
DEFINE EVENT notify ON person;
-- Remove an event from a table
REMOVE EVENT notify ON person;

-- Define an event when a value increases
DEFINE EVENT notify ON person WHEN $before.income < $after.income THEN (UPDATE $this SET increasing = true);
-- Define an event when a value increase beyond a threshold
DEFINE EVENT notify ON person WHEN $before.income < 45000 AND $after.income > 45000 THEN (UPDATE $this SET highincome = true);
```
