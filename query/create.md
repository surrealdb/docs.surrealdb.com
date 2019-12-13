# Creating Records

```sql
-- Create a new record
CREATE person;
-- Create a new record and set some fields
CREATE person SET age=28, name='Tobie';
-- Create a new record and merge the record content
CREATE person MERGE {firstname:"Tobie", lastname:"Morgan Hitchcock"};
-- Create a new record and specify the full record content
CREATE person CONTENT {firstname:"Tobie", lastname:"Morgan Hitchcock"};

-- Create a new specific record
CREATE person:id;
-- Create a new specific record and set some fields
CREATE person:id SET age = 28, name = 'Tobie';
-- Create a new specific record and set some fields, along with an empty set
CREATE person:id SET age = 28, name = 'Tobie', tags = [];
-- Create a new specific record and set some fields, along with a set with 1 element
CREATE person:id SET age = 28, name = 'Tobie', tags = ['old'];

-- Create multiple records in one query
CREATE person, person, person;
-- Create multiple specific records in
CREATE person:one, person:two;

CREATE |person:1..1000|;
```
