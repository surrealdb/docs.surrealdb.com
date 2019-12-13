# Updating Records

```sql
-- Update a table, ensuring all defined fields are up-to-date
UPDATE person;
-- Update a table, setting a field to null on all records
UPDATE person SET age=NULL;
-- Update a table, removing a field completely from all records
UPDATE person SET age=VOID;
-- Update a table, removing a field completely from all records that match a condition
UPDATE person SET age=VOID WHERE age < 18;

-- Update a specific record, ensuring it exists
UPDATE person:id
-- Update a specific record, and erase all record data
UPDATE person:id CONTENT {};
-- Update a specific record, and set some fields
UPDATE person:id SET age = 28, name = 'Tobie';
-- Update a specific record, and set a field as NULL
UPDATE person:id SET age = 28, name = 'Tobie', tags = NULL;
-- Update a specific record, and set a field to an empty set
UPDATE person:id SET age = 28, name = 'Tobie', tags = [];
-- Update a specific record, and set a field to a set with 1 element
UPDATE person:id SET age = 28, name = 'Tobie', tags = ['old'];
-- Update a specific record, and add 'new' to the `tags` set and removes 'old' from the `tags` set
UPDATE person:id SET age = 28, name = 'Tobie', tags += ['new'], tags -= ['old'];

-- Update multiple records in one query, ensuring both exist
UPDATE person:one, person:two;

-- Update a specific record and ensure the `emails` field is a set
UPDATE person:id SET emails = [];
-- Update a specific record and add an object to the `emails` set
UPDATE person:id SET emails += {type: "work", value: "tobie@abcum.co.uk"};
-- Update a specific record and set the vaue of the first object in the `emails` set
UPDATE person:id SET emails[0].value = "tobie@abcum.com";
-- Update a specific record and remove the object from the `emails` set
UPDATE person:id SET emails -= {type: "work", value: "tobie@abcum.com"};
```
