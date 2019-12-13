# Deleting Records

```sql
-- Delete all records in a table
DELETE person;
-- Delete all records in a table that match a condition
DELETE person WHERE age < 18;

-- Delete a specific record from a table
DELETE person:id;
-- Delete a specific record, if the condition matches
DELETE person:id WHERE age < 18;

-- Delete multiple records in one statement
DELETE person:one, person:two;
```
