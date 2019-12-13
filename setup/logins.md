# Admin Logins

```sql
-- Define a user account on the namespace
DEFINE LOGIN `tobie@abcum.com` ON NAMESPACE PASSWORD '192837192837192837';
-- Remove a user account from the namespace
REMOVE LOGIN `tobie@abcum.com` ON NAMESPACE;

-- Define a user account on the database
DEFINE LOGIN `tobie@abcum.com` ON DATABASE PASSWORD '192837192837192837';
-- Remove a user account from the database
REMOVE LOGIN `tobie@abcum.com` ON DATABASE;
```

```sql
-- Define a signing token on the namespace
DEFINE TOKEN `default` ON NAMESPACE TYPE HS256 VALUE "secretkey";
-- Define a signing token public key on the namespace
DEFINE TOKEN `default` ON NAMESPACE TYPE RS256 VALUE "-----BEGIN PUBLIC KEY----- MIGfMA0G...";
-- Remove a signing token from the namespace
REMOVE TOKEN `default` ON NAMESPACE;

-- Define a signing token on the database
DEFINE TOKEN `default` ON DATABASE TYPE HS256 VALUE "secretkey";
-- Define a signing token public key on the database
DEFINE TOKEN `default` ON DATABASE TYPE HS256 VALUE "-----BEGIN PUBLIC KEY----- MIGfMA0G...";
-- Remove a signing token from the database
REMOVE TOKEN `default` ON DATABASE;
```
