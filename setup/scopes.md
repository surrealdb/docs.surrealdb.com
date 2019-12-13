# Access Scopes

```sql
-- Define an authentication scope named 'account'
DEFINE SCOPE account SESSION 1h
	SIGNUP AS (CREATE admin SET email=$user, pass=bcrypt.generate($pass), account=(UPDATE AND UPSERT @account:$account SET name=$accountname))
	SIGNIN AS (SELECT * FROM admin WHERE email=$user AND bcrypt.compare(pass, $pass))
	CONNECT AS (SELECT * FROM $id)
;
-- Remove the authentication scope named 'account'
REMOVE SCOPE account;

-- Define an authentication scope named 'profile'
DEFINE SCOPE profile SESSION 24h 
	SIGNUP AS (CREATE person SET email=$user, pass=bcrypt.generate($pass)) 
	SIGNIN AS (SELECT * FROM person WHERE email=$user AND bcrypt.compare(pass, $pass))
	CONNECT AS (SELECT * FROM $id)
;
-- Remove the authentication scope named 'profile'
REMOVE SCOPE profile;
```
