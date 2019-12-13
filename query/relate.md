# Relating Records

```sql
RELATE person:one likes person:two;
-- Define an edge connection between two records
RELATE friend FROM person:one TO person:two;
-- Define an edge connection between two records, ensuring only one edge of this type exists
RELATE friend FROM person:one TO person:two UNIQUE;
-- Define an edge connection between two records, created in subqueries
RELATE friend FROM (CREATE person) TO (CREATE person);
```
