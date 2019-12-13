# Selecting Records

## BEGIN, CANCEL, COMMIT

```sql
-- Begin a new transaction
BEGIN;
-- Cancel a transaction
CANCEL;
-- Commit a transaction
COMMIT;

-- Define a unique index
DEFINE INDEX languages ON country COLUMNS languages.* UNIQUE;
CREATE country:GBR SET name="Great Britain" languages=["english", "welsh", "scottish"];
CREATE country:FRA SET name="France" languages=["french"];

-- Define a transaction that will fail, without any changes to the database
BEGIN;
CREATE country:BRA SET name="Brazil" languages=["portugese"];
CREATE country:USA SET name="United States of America" languages=["english"];
CREATE country:DEU SET name="Germany" languages="german";
COMMIT;
```

## LET, RETURN

```sql
-- Define a new variable as a new person record
LET person1 = (CREATE person);
-- Define a 2nd variable as a new person record
LET person2 = (CREATE person);
-- Define a 3rd variable as a graph connection between the 1st and 2nd variables
LET edge = (RELATE friend FROM $person TO $person2);
-- Return only the first two people, ignoring the graph edge
RETURN $person1, $person2;
```

## SELECT

```sql
-- Select all records from a table
SELECT * FROM person;
-- Select all records where the condition matches
SELECT * FROM person WHERE age > 18;
-- Select all records and specify a dynamically calculated field
SELECT ((celsius*2)+30) AS fahrenheit FROM temperatues;
-- Select all records where the age is greater than the age of another specific record
SELECT * FROM person WHERE age >= person:tobie.age;

-- Select all records where the `tags` set contains "tag"
SELECT * FROM person WHERE tags ∋ "tag";
SELECT * FROM person WHERE tags ~ "tag";
SELECT * FROM person WHERE tags CONTAINS "tag";
SELECT * FROM person WHERE "tag" ∈ tags;
SELECT * FROM person WHERE "tag" IS IN tags;
-- Select all records where the `tags` set does not contain "tag"
SELECT * FROM person WHERE tags ∌ "tag";
SELECT * FROM person WHERE tags !~ "tag";
SELECT * FROM person WHERE tags CONTAINS NOT "tag";
SELECT * FROM person WHERE "tag" ∉ tags;
SELECT * FROM person WHERE "tag" IS NOT IN tags;
-- Select all records where the `tags` set contains "tag1" AND "tag2"
SELECT * FROM person WHERE tags ⊇ ["tag1", "tag2"];
SELECT * FROM person WHERE tags CONTAINSALL ["tag1", "tag2"];
-- Select all records where the `tags` set contains "tag1" OR "tag2"
SELECT * FROM person WHERE tags ⊃ ["tag1", "tag2"];
SELECT * FROM person WHERE tags CONTAINSSOME ["tag1", "tag2"];
-- Select all records where the `tags` does not contain "tag1" OR "tag2"
SELECT * FROM person WHERE tags ⊅ ["tag1", "tag2"];
SELECT * FROM person WHERE tags CONTAINSNONE ["tag1", "tag2"];

-- Select all records where all email address values end with 'gmail.com'
SELECT * FROM person WHERE emails.*.value = /gmail.com$/;
-- Select all records where no email address values end with 'gmail.com'
SELECT * FROM person WHERE emails.*.value != /gmail.com$/;
-- Select all records where any email address value ends with 'gmail.com'
SELECT * FROM person WHERE emails.*.value ?= /gmail.com$/;

-- Select all person records, and all of their likes
SELECT ->likes->? FROM person;
-- Select all person records, and all of their friends
SELECT ->friend->person FROM person;
-- Select all person records, and all of the friends and followers
SELECT <->(friend, follow)->person FROM person;
-- Select all person records, and the ids of people who like each person
SELECT *, <-likes<-person.id FROM person;
-- Select all person records, and the people who like this person, who are older than 18
SELECT *, <-friend<-person[age>=18] AS friends FROM person;
-- Select only person records where a friend likes chocolate
SELECT * FROM person WHERE ->friend->person->likes->food:chocolate;
-- Select the products purchased by friends of a specific person record
SELECT ->friend->person{1..3}->purchased->product FROM person:tobie;
-- Select all 1st, 2nd, or 3rd level people who this specific person record knows
SELECT ->knows->?{1..3} FROM person:tobie;
-- Select all 1st, 2nd, and 3rd level people who this specific person record knows, or likes, as separet paths
SELECT ->knows->(? AS f1)->knows->(? AS f2)->(knows, likes AS e3 WHERE hot=true)->(? AS f3) FROM person:tobie;
SELECT ->knows->? AS f1, f1->knows->? AS f2, f2->(knows, likes WHERE hot=true) AS e3, e3->? AS f3 FROM person:tobie;
-- Select all person records (and their recipients), who have sent more than 5 emails
SELECT *, ->sent->email->to->person FROM person WHERE count(->sent->email->to->person) > 5;
-- Select all people who know Jaime
SELECT * FROM person WHERE ->knows->person:jaime;
-- Select all people who Jaime knows
SELECT ->knows->person FROM person:jaime;
-- Select all person records, and all of the adult friends
SELECT ->knows->(person WHERE age >= 18) FROM person;
-- Select other products purchased by people who purchased this laptop
SELECT <-purchased<-person->purchased->product FOLLOW DISTINCT FROM product:laptop;
-- Select products purchased by people who have purchased the same products that we have purchased
SELECT ->purchased->product<-purchased<-person->purchased->product FOLLOW DISTINCT FROM person:tobie;
SELECT * FROM product WHERE <-purchased<-person->purchased->product<-purchased<-person:tobie;

-- Select products purchased by people in the last 3 weeks who have purchased the same products that we have purchased
SELECT ->purchased->product<-purchased<-person->(purchased WHERE created_at > now() - 3w)->product FOLLOW DISTINCT FROM person:tobie;
-- Select products purchased by people who have purchased the same products that we have purchased
SELECT ->purchased->product<-purchased<-person->purchased->product FOLLOW DISTINCT FROM person:tobie;
-- Select all people who have sent an email to tobieabcum.com
SELECT * FROM person WHERE email:{tobie@abcum.com}->from->email.address IN emails.*.value;
```
