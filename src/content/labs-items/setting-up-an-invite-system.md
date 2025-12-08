---
title: "Setting up an invite system"
url: https://mord-blog.vercel.app/articles/surrealdb-invitation-system
category: Tutorials
topics:
  - Examples
  - Beginner
author:
  name: Mordechai Hadad
  role: Software Engineer
  avatar: mordechai-hadad
---


Usually when building modern applications, there are instances where you want to allow users to invite others to join, whether it's a project, a team or whatever shared thing. Traditional invitation systems need you to handle a lot of infrastructure: token management, validation logic, cron jobs, email services, etc etc. But what if I told you that SurrealDB does most of this natively?

## The Challenge 

Most invitation systems follow a similar pattern: generate a unique token, store it with an expiration date, and so on. Simple in theory but a lot of moving parts in practice, middleware to validate tokens, race condition handling and so on.

SurrealDB's `DEFINE ACCESS ... TYPE RECORD` feature changes this completely. Instead of managing authentication tokens separately, you can create **custom authentication flows directly in the database**. The invitation itself becomes a temporary authentication method, letting you handle validation, expiration, and permissions at the database layer.

## The Core Architecture

The invitation system has three main pieces:
1. **User Tables** - Primary users (let's call them creators) and secondary users (members)
2. **Resource Table** - Whatever you're sharing (projects, teams, etc.)
3. **Invitation Flow** - A temporary authentication mechanism that validates tokens and creates users

## Database Schema 

### User Tables with Permissions

Let's start by creating the creator table:

```sql
DEFINE TABLE IF NOT EXISTS creator SCHEMAFULL
    PERMISSIONS
        FOR select, create WHERE $access = "creator_access",
        FOR update, delete WHERE id = $auth.id AND $access = "creator_access";

DEFINE FIELD IF NOT EXISTS email ON TABLE creator TYPE string
    ASSERT string::is::email($value);
DEFINE FIELD IF NOT EXISTS first_name ON TABLE creator TYPE string;
DEFINE FIELD IF NOT EXISTS last_name ON TABLE creator TYPE string;
DEFINE FIELD IF NOT EXISTS password ON TABLE creator TYPE string 
    PERMISSIONS FOR select NONE;
DEFINE FIELD IF NOT EXISTS created_at ON TABLE creator TYPE datetime 
    VALUE time::now() READONLY;

DEFINE INDEX IF NOT EXISTS creator_email_idx ON TABLE creator COLUMNS email UNIQUE;
```

Some of the features:
- `PERMISSIONS FOR select NONE` basically means that non root users can't query the password (don't forget to encrypt it naturally)
- Email validation happens on database level with the `ASSERT` keyword
- `READONLY` fields can't be modified after creation, useful for audit trails like `created_at`.

Now the member table:

```sql
DEFINE TABLE IF NOT EXISTS member SCHEMAFULL
    PERMISSIONS
        FOR create WHERE $access = "invitation_accept" OR $access = "creator_access", 
        FOR select WHERE $access = "member_access" OR $access = "creator_access" OR $access = "invitation_accept",
        FOR update, delete WHERE (id = $auth.id AND $access = "member_access") OR (created_by = $auth AND $access = "creator_access");
        
DEFINE FIELD IF NOT EXISTS email ON TABLE member TYPE string
    ASSERT string::is::email($value);
DEFINE FIELD IF NOT EXISTS first_name ON TABLE member TYPE string;
DEFINE FIELD IF NOT EXISTS last_name ON TABLE member TYPE string;
DEFINE FIELD IF NOT EXISTS password ON TABLE member TYPE string 
    PERMISSIONS FOR select NONE;
DEFINE FIELD IF NOT EXISTS created_at ON TABLE member TYPE datetime 
    VALUE time::now() READONLY;
DEFINE FIELD IF NOT EXISTS created_by ON TABLE member TYPE record<creator>;

DEFINE INDEX IF NOT EXISTS member_email_idx ON TABLE member COLUMNS email UNIQUE;
```

What allows the invitation system to work here is `$access = "invitation_accept"`, which will allow the invitation access to create members without needing full privileges.

### Resource and Relationship Tables

```sql
DEFINE TABLE resource SCHEMAFULL
    PERMISSIONS
        FOR create WHERE $access = "creator_access",
        FOR update, delete WHERE creator = $auth.id AND $access = "creator_access",
        FOR select WHERE (creator = $auth.id AND $access = "creator_access") 
            OR (SELECT id FROM membership WHERE in = $auth.id AND out = $parent.id);

DEFINE FIELD creator ON resource TYPE option<record<creator>> 
    VALUE $auth READONLY;
DEFINE FIELD title ON resource TYPE string;
DEFINE FIELD created_at ON resource TYPE datetime VALUE time::now() READONLY;

DEFINE TABLE membership TYPE RELATION IN member OUT resource  
    PERMISSIONS
        FOR create WHERE ($access = "creator_access" AND out.creator = $auth.id) 
            OR $access = "invitation_accept",
        FOR select WHERE in = $auth.id 
            OR ($access = "creator_access" AND out.creator = $auth.id) 
            OR ($access = "invitation_accept" AND $auth.resource = out.id);

DEFINE FIELD created_at ON membership TYPE datetime VALUE time::now() READONLY;
```

A few things worth noting here:
- `VALUE $auth READONLY` automatically sets the creator from the authenticated session
- The `$parent.id` variable is a SurrealDB feature that lets you reference the parent record in subqueries. Here, when checking if a member can select a resource, the subquery looks for a membership relationship where `$parent.id` refers to the resource being queried. This enables graph-based permission checks without manual joins.
- `RELATE` syntax creates the many-to-many relationship between members and resources
- Members can see resources they're enrolled in through the subquery in the select permission

## The Cool Part: Custom Access Method

This is where it gets interesting:

```sql
DEFINE ACCESS invitation_accept ON DATABASE TYPE RECORD
     SIGNIN {
        LET $invitation = (SELECT * FROM invitation WHERE invite_token = $invite_token LIMIT 1)[0];
        IF !$invitation = NONE {
            THROW "INVITATION_NOT_FOUND";
        };
        IF $invitation.used_at IS NOT NONE {
            THROW "INVITATION_ALREADY_USED";
        };
        IF $invitation.expires_at <= time::now() {
            THROW "INVITATION_EXPIRED";
        };
        RETURN $invitation;
    }
    DURATION FOR TOKEN 5m;
```

What is happening here?
- No `SIGNUP` clause - this is signin-only
- Custom validation runs during authentication
- Returns the invitation record, which becomes `$auth` in later queries
- Short 5-minute token duration for security
- Custom error messages with `THROW`

The invitation table:

```sql
DEFINE TABLE invitation SCHEMAFULL
    PERMISSIONS
        FOR create WHERE $access = 'creator_access',
        FOR select WHERE creator = $auth.id 
            OR ($access = "invitation_accept" AND id = $auth.id),
        FOR update WHERE creator = $auth.id 
            OR ($access = 'invitation_accept' AND id = $auth.id);

DEFINE FIELD creator ON invitation TYPE record<creator> VALUE $auth READONLY;
DEFINE FIELD email ON invitation TYPE string ASSERT string::is::email($value);
DEFINE FIELD invite_token ON invitation TYPE string;
DEFINE FIELD resource ON invitation TYPE record<resource>;
DEFINE FIELD expires_at ON invitation TYPE datetime;
DEFINE FIELD used_at ON invitation TYPE option<datetime>;
DEFINE FIELD used_by ON invitation TYPE option<record<member>>;

DEFINE INDEX invitation_invite_token_idx ON invitation COLUMNS invite_token UNIQUE;
```

## Backend Implementation

### Creating Invitations

```sql
BEGIN TRANSACTION;

LET $existing = SELECT VALUE id FROM member WHERE email = $email LIMIT 1;
IF array::len($existing) > 0 {
    THROW "MEMBER_ALREADY_EXISTS";
};

LET $inv = CREATE invitation CONTENT {
    creator: $creator,
    email: $email,
    invite_token: $invite_token,
    resource: $resource,
    expires_at: time::now() + duration::from::days($days)
};
RETURN $inv;
COMMIT TRANSACTION;
```

This will basically create the token, check if the user exists, and then create the invitation record.

### Accepting Invitations

The acceptance flow uses a two-step process - first authenticate using the invitation token, then execute the acceptance transaction:

**Step 1: Authenticate**
```rust
let auth_db = Surreal::new::<Http>(&db_url).await?;

let _jwt = auth_db.signin(Record {
    namespace: &surreal_ns,
    database: &surreal_db,
    access: "invitation_accept",
    params: TokenParams {
        invite_token: &payload.invite_token,
    },
}).await?;
```

**Step 2: Execute acceptance**
```sql
BEGIN TRANSACTION;

LET $inv = SELECT * FROM invitation WHERE invite_token = $invite_token LIMIT 1;
LET $inv_row = $inv[0];

-- Create or retrieve existing member
LET $existing_member = SELECT VALUE id FROM member WHERE email = $inv_row.email LIMIT 1;
LET $member = IF array::len($existing_member) > 0 { 
    $existing_member[0]
} ELSE { 
    (CREATE member CONTENT {
        email: $inv_row.email,
        first_name: $first_name,
        last_name: $last_name,
        password: crypto::argon2::generate($password),
        created_by: $inv_row.creator
    })[0]
};

-- Create membership relationship
LET $existing_membership = SELECT VALUE id FROM membership 
    WHERE in = $member.id AND out = $inv_row.resource LIMIT 1;
IF array::len($existing_membership) = 0 {
    RELATE $member.id->membership->$inv_row.resource;
};

-- Mark invitation as used
UPDATE $inv_row.id MERGE { 
    used_at: time::now(), 
    used_by: $member.id 
};

RETURN $member;
COMMIT TRANSACTION;
```

This flow is quite elegant I would say, authenticate with the invitation token, which basically validates everything automatically. Then in a simple transaction, find or create the member, establish the relationship, mark the invitation as used, done. Boom no race conditions and no manual validation logic.

## Security Considerations

- **Token expiration:** Keep the JWT duration short, while keeping the actual invitation record expiration longer for long term validity. 
- **Permission Isolation:** The `invitation_accept` access has minimal permissions, member create and select, and it can only read its own invitation record. For extra security, you can restrict non-email fields to `PERMISSIONS FOR select NONE WHERE $access = "invitation_accept"` when using this access method.