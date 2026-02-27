---
sidebar_position: 5
sidebar_label: Sample industry schemas
title: Simple sample schemas by industry to get started
description: Find a sample schema or two for your industry to copy and paste and modify to your own needs.
---

# Sample schemas by industry

> [!NOTE]
> Many fields in these schemas use [`COMPUTED` fields](/docs/surrealql/statements/define/field#computed-fields), available as of SurrealDB version 3.0.0-beta. For versions before this, a data type called a [`future`](/docs/surrealql/datamodel/futures) was used. To use such fields in a version before 3.0.0-beta, replace `COMPUTED` with `VALUE <future>` and enter an expression to be calculated inside `{}` braces.

This page contains a number of sample schemas, each about 50 lines in length, that can be used to get started on a schema of your own for your own industry.

## Adding to this page

Have a sample schema of your own that you'd like to add? If it's about 50 lines in length then feel free to [make a PR](https://github.com/surrealdb/docs.surrealdb.com/edit/main/src/content/doc-surrealdb/reference-guide/sample-industry-schemas.mdx) and we'll credit the addition with a link to your profile on a code hosting platform (e.g. GitHub, GitLab, Codeberg).

You can also [get in touch](/contact) with us if you'd like a sample schema that isn't in this page that fits the industry in which you work.

## Energy and manufacturing

### Project planning

A comprehensive project management schema that demonstrates activity scheduling, milestone tracking, and dependency management using [graph relationships](/docs/surrealdb/models/graph). This schema shows how to model complex project workflows with interdependent tasks and progress tracking using [futures](/docs/surrealql/statements/define/field#futures) for calculated fields.

```surql
-- Activities in a project schedule
DEFINE TABLE activity SCHEMAFULL;
DEFINE FIELD name         ON activity TYPE string;
DEFINE FIELD description  ON activity TYPE option<string>;
DEFINE FIELD start        ON activity TYPE datetime;
DEFINE FIELD end          ON activity TYPE datetime;
DEFINE FIELD duration     ON activity COMPUTED end - start;
DEFINE FIELD progress     ON activity TYPE float ASSERT $value IN 0.0..=1.0;
DEFINE FIELD assigned_to  ON activity TYPE option<record<employee>>;
DEFINE FIELD followed_by  ON activity COMPUTED <-depends_on<-activity;

-- Milestones
DEFINE TABLE milestone SCHEMAFULL;
DEFINE FIELD project      ON milestone TYPE record<project>;
DEFINE FIELD activities   ON milestone TYPE array<record<activity>>;
DEFINE FIELD name         ON milestone TYPE string;
DEFINE FIELD last_updated ON milestone VALUE time::now();
DEFINE FIELD progress     ON milestone COMPUTED math::mean(activities.progress);
DEFINE FIELD is_complete  ON milestone COMPUTED activities.all(|$a| $a.progress > 0.95);

-- Graph-style dependency links
DEFINE TABLE depends_on SCHEMAFULL TYPE RELATION IN activity OUT activity;
DEFINE TABLE activity_of SCHEMAFULL TYPE RELATION IN activity OUT project;

CREATE project:one;

CREATE activity:one SET name = "Project kickoff", start = time::now(), end = time::now() + 2d, progress = 1.0, project = project:one;
CREATE activity:two SET name = "Pour concrete", start = time::now() + 90d, end = time::now() + 100d, progress = 0.0, project = project:one;
CREATE activity:three SET name = "Dry concrete", start = time::now() + 100d, end = time::now() + 107d, progress = 0.0, project = project:two;
CREATE activity:four SET name = "Build on top of concrete", start = time::now() + 107d, end = time::now() + 150d, progress = 0.0, project = project:two;

RELATE activity:two->depends_on->activity:one;
RELATE activity:three->depends_on->activity:two;
RELATE activity:four->depends_on->activity:three;
RELATE [activity:one,activity:two,activity:three, activity:four]->activity_of->project:one;

CREATE milestone:one SET project = project:one, activities = [activity:one], name = "Project start";
CREATE milestone:two SET project = project:one, activities = [activity:two, activity:three, activity:four], name = "Initial construction";

-- See all graph connections between activity and project records
SELECT *, ->?, <-? FROM activity, project;

-- View the current milestones
SELECT * FROM milestone;
```

### SCADA (Oil and Gas)

Industrial monitoring and control system schema for oil and gas operations. Demonstrates real-time sensor data collection, automated alert generation using [events](/docs/surrealql/statements/define/event), and [time-series data management](/docs/surrealdb/models/time-series) with composite keys. Shows how to handle flexible external data integration and [live query monitoring](/docs/surrealql/statements/live).

```surql
DEFINE TABLE sensor SCHEMAFULL;
DEFINE FIELD type ON sensor TYPE array<string> ASSERT $value ALLINSIDE ["pressure", "temperature", "flow", "level"];
DEFINE FIELD location         ON sensor TYPE point;

DEFINE TABLE reading SCHEMAFULL;
DEFINE FIELD id               ON reading TYPE [record<sensor>, datetime];
DEFINE FIELD pressure         ON reading TYPE float;
-- Optional telemetry values
DEFINE FIELD temperature      ON reading TYPE option<float>;
DEFINE FIELD humidity         ON reading TYPE option<float>;
-- Flexible object for weather or external data
DEFINE FIELD weather          ON reading TYPE option<object>;

DEFINE TABLE alert SCHEMAFULL;
DEFINE FIELD equipment    ON alert TYPE record<sensor>;
DEFINE FIELD severity     ON alert TYPE string ASSERT $value IN ["critical", "high", "medium", "low", "info"];
DEFINE FIELD message      ON alert TYPE string;
DEFINE FIELD triggered_at ON alert TYPE datetime;

-- Create a sensor
CREATE sensor:one SET type = ["temperature", "pressure"], location = (50.0, 50.0);
-- And a reading for the sensor
CREATE reading:[sensor:one, time::now()] SET 
    pressure = 600,
    -- JSON object sourced from somewhere else, `weather` field is a schemaless object so can be any object format
    weather = { "temperature": 17.4, "humidity": 52.0, "wind_speed": 12.8 };

-- Set up event to generate alerts
DEFINE EVENT alert_from_create ON reading WHEN $event = "CREATE" THEN {
    LET $source = $after.id[0];
    LET $time = $after.id[1];
    -- Select everything over the past 15 minutes up to but not including the present reading
    LET $recents_average = math::mean(SELECT VALUE pressure FROM reading:[$source, $time - 15m]..[$source, $time]);
    LET $drop = $recents_average - $after.pressure;
    IF $drop > 15 {
      CREATE alert SET
            equipment = $source,
            severity = "high",
            message = "Pressure drop over 15 PSI: drop of " + <string>$drop,
            triggered_at = time::now();
    };
};

-- Some readings with good values
FOR $_ IN 0..10 {
    -- Sleep to keep timestamp in IDs unique, consider a ULID instead if timestamps may not be unique
    sleep(10ns);
    CREATE reading:[sensor:one, time::now()] SET pressure = 600;
};
-- Pressure has suddenly dropped
CREATE reading:[sensor:one, time::now()] SET pressure = 500;

-- See the alert
SELECT * FROM alert;
-- Or use a LIVE SELECT for alerts: https://surrealdb.com/docs/surrealql/statements/live
LIVE SELECT * FROM alert;
```

### Risk management

Project risk assessment and mitigation tracking schema. Features temporal risk modeling with active/inactive periods, probability-impact calculations, and automated risk scoring using [futures](/docs/surrealql/statements/define/field#futures). Demonstrates [unique constraints](/docs/surrealql/statements/define/indexes#unique-indexes) and complex mathematical aggregations across related records.

```surql
DEFINE TABLE risk SCHEMAFULL;
DEFINE FIELD project        ON risk TYPE record<project> REFERENCE;
DEFINE FIELD description    ON risk TYPE string;
DEFINE FIELD category       ON risk TYPE string; -- e.g. "technical", "commercial", "regulatory"
DEFINE FIELD likelihood     ON risk TYPE float ASSERT $value IN 0.0..=1.0;
DEFINE FIELD maximum_impact ON risk TYPE int; -- in dollars, etc.
DEFINE FIELD start          ON risk TYPE datetime;
DEFINE FIELD end            ON risk TYPE datetime;
-- Use a computed field to calculate value on each SELECT
DEFINE FIELD active         ON risk COMPUTED time::now() IN start..=end;
-- Ensure no duplicate `risk` records exist for each project
DEFINE INDEX risk_name      ON risk FIELDS project, description UNIQUE;

-- See all total_impact
DEFINE FIELD total_risk_impact ON project COMPUTED
    math::sum(<~risk.map(|$risk| $risk.maximum_impact * $risk.likelihood));

-- See risks at the current date
DEFINE FIELD current_risk_impact ON project COMPUTED
    math::sum(<~risk.filter(|$r| $r.active).map(|$risk| $risk.maximum_impact * $risk.likelihood));

CREATE project:one;

CREATE risk SET
    project = project:one,
    description = "Migratory elk",
    category = "regulatory",
    likelihood = 0.9,
    start = d'2025-10-01',
    end = d'2025-12-15',
    maximum_impact = 1000000;

CREATE risk SET
    project = project:one,
    description = "Wildfires",
    category = "technical",
    likelihood = 0.5,
    start = d'2025-06-01',
    end =d'2025-10-15',
    maximum_impact = 10000000;

SELECT * FROM project;
```

### Supply chain and contract management

Vendor relationship and contract lifecycle management schema. Covers contract value tracking with change orders, deliverable management, and automated total commitment calculations using [futures](/docs/surrealql/statements/define/field#futures). Demonstrates complex financial calculations and status tracking across multiple related entities.

```surql
-- Vendors who supply goods or services
DEFINE TABLE vendor SCHEMAFULL;
DEFINE FIELD name ON vendor TYPE string;

-- Contracts awarded under a project
DEFINE TABLE contract SCHEMAFULL;
DEFINE FIELD project        ON contract TYPE record<project>;
DEFINE FIELD vendor         ON contract TYPE record<vendor>;
DEFINE FIELD title          ON contract TYPE string;
DEFINE FIELD original_value ON contract TYPE int;
DEFINE FIELD total_value    ON contract COMPUTED 
    original_value + math::sum(SELECT VALUE amount FROM change_order WHERE contract = $parent.id);
DEFINE FIELD currency ON contract TYPE "dollars" | "euro";
DEFINE FIELD start   ON contract TYPE datetime;
DEFINE FIELD end     ON contract TYPE datetime;

-- Deliverables expected under a contract
DEFINE TABLE deliverable SCHEMAFULL;
DEFINE FIELD contract    ON deliverable TYPE record<contract>;
DEFINE FIELD description ON deliverable TYPE string;
DEFINE FIELD due_date    ON deliverable TYPE datetime;
DEFINE FIELD received    ON deliverable TYPE option<datetime>;
DEFINE FIELD status      ON deliverable COMPUTED IF $parent.received { "complete" } ELSE { "pending" };

-- Change orders during a project
DEFINE TABLE change_order SCHEMAFULL;
DEFINE FIELD contract    ON change_order TYPE record<contract>;
DEFINE FIELD amount      ON change_order TYPE int;
DEFINE FIELD description ON change_order TYPE string;
DEFINE FIELD signed_on   ON change_order TYPE option<datetime>;

-- Total committed value of a project (sum of all contract values)
DEFINE FIELD total_commitment ON project COMPUTED
  math::sum((SELECT VALUE value FROM contract WHERE project = $parent.id));

CREATE project:one;
CREATE vendor:one SET name = "Good vendor";
    CREATE contract:one SET project = project:one, currency = "euro", start = d'2025-12-01', end = d'2026-01-01', original_value = 1000, title = "Services for so-and-so project", vendor = vendor:one;
CREATE change_order SET contract = contract:one, amount = 500, description = "Highway wasn't set up yet";
SELECT * FROM contract;
```

### HSSE (Health, Safety, Security, Environment) incidents

Incident reporting and investigation schema using [graph relationships](/docs/surrealdb/models/graph). Models safety events as edges between employees and projects with severity classification and role identification. Demonstrates graph-style data modeling for complex incident tracking and analysis.

```surql
-- Projects and employees (nodes)
DEFINE TABLE project SCHEMAFULL;
DEFINE TABLE employee SCHEMAFULL;

-- Edges: incident links employee → project
DEFINE TABLE incident SCHEMAFULL TYPE RELATION IN project OUT employee;

DEFINE FIELD severity     ON incident TYPE string ASSERT $value IN ["minor", "moderate", "major", "fatal"];
DEFINE FIELD type         ON incident TYPE string ASSERT $value IN ["safety", "environment", "security", "health"];
DEFINE FIELD description  ON incident TYPE string;
DEFINE FIELD occurred_at  ON incident TYPE datetime;
DEFINE FIELD role         ON incident TYPE string ASSERT $value IN ["witness", "injured", "involved"];

-- Create nodes
CREATE employee:one SET name = "John Doe";
CREATE employee:two SET name = "Sally Lee";
CREATE project:one  SET name = "Pad 3 Expansion";

-- Create incidents as edges with properties
RELATE employee:one->incident->project:one SET 
  severity = "moderate", 
  type = "safety",
  description = "Pinched hand during pipe fitting",
  occurred_at = time::now() - 5d,
  role = "injured";

RELATE employee:two->incident->project:one SET 
  severity = "moderate",
  type = "safety",
  description = "Pinched hand during pipe fitting",
  occurred_at = time::now() - 5d,
  role = "witness";

SELECT id, <-incident[WHERE severity = "moderate"]<-employee FROM project;
```


## Finance

### General bank schema (graph schema)

Multi-currency banking system using [graph relationships](/docs/surrealdb/models/graph). Demonstrates polymorphic account types (JPY, EUR, CAD, USD) with different field structures, customer-bank relationships, and [unique constraint enforcement](/docs/surrealql/statements/define/indexes#unique-indexes). Shows how to model complex financial relationships with type-specific behaviors.

```surql
DEFINE TABLE bank SCHEMAFULL;
DEFINE FIELD name     ON bank TYPE string;

DEFINE TABLE customer SCHEMAFULL;
DEFINE FIELD name ON customer TYPE string;

DEFINE TABLE customer_of TYPE RELATION IN customer OUT bank;
DEFINE FIELD since ON customer_of TYPE datetime VALUE time::now() READONLY;

DEFINE TABLE jpy SCHEMAFULL;
DEFINE FIELD amount ON jpy TYPE int DEFAULT 0;
DEFINE FIELD cent ON jpy TYPE int READONLY VALUE 0;

DEFINE TABLE eur SCHEMAFULL;
DEFINE FIELD amount ON eur TYPE int DEFAULT 0;
DEFINE FIELD cent   ON eur TYPE int ASSERT $value IN 0..=99;
DEFINE FIELD total  ON eur VALUE amount + (<float>$parent.cent / 100);

DEFINE TABLE cad SCHEMAFULL;
DEFINE FIELD amount ON cad TYPE int DEFAULT 0;
DEFINE FIELD cent   ON cad TYPE int ASSERT $value IN 0..=99;
DEFINE FIELD total  ON cad VALUE $parent.amount + (<float>$parent.cent / 100);

DEFINE TABLE usd SCHEMAFULL;
DEFINE FIELD amount ON usd TYPE int DEFAULT 0;
DEFINE FIELD cent   ON usd TYPE int ASSERT $value IN 0..=99;
DEFINE FIELD total  ON usd VALUE $parent.amount + (<float>$parent.cent / 100);

DEFINE TABLE account TYPE RELATION IN customer OUT jpy|eur|cad|usd;
DEFINE FIELD since ON account TYPE datetime VALUE time::now() READONLY;

-- stop the same customer opening two wallets in the same currency
DEFINE INDEX unique_wallet ON account FIELDS in, out UNIQUE;

CREATE bank:one SET name = "Central Bank";
CREATE customer:one SET name = "Billy";
RELATE customer:one->customer_of->bank:one;
RELATE customer:one->account->(CREATE ONLY eur SET amount = 100, cent = 50);
RELATE customer:one->account->(CREATE ONLY jpy SET amount = 10000);

SELECT ->account->eur.total FROM customer:one;
```

### Other bank-customer schema

Traditional bank-customer schema with advanced features including [record references](/docs/surrealql/datamodel/records#record-references), automated cent handling through [events](/docs/surrealql/statements/define/event), and historical interest rate tracking. Demonstrates event-driven data validation, [parameter usage](/docs/surrealql/statements/define/param), and complex relationship management with reference fields.

```surql
DEFINE PARAM $CURRENCIES VALUE ["EUR", "JPY", "USD", "CAD"];

DEFINE TABLE account SCHEMAFULL;
DEFINE FIELD customer ON account TYPE record<customer> REFERENCE;
DEFINE FIELD currency ON account TYPE string ASSERT $value IN $CURRENCIES;
DEFINE FIELD amount   ON account TYPE int;
DEFINE FIELD cent     ON account TYPE option<int>;

DEFINE TABLE customer SCHEMAFULL;
DEFINE FIELD name     ON customer TYPE string;
DEFINE FIELD bank     ON customer TYPE record<bank> REFERENCE;

DEFINE TABLE bank SCHEMAFULL;
DEFINE FIELD name         ON bank TYPE string;
DEFINE FIELD code         ON bank TYPE string;  -- e.g., BIC or internal short code
DEFINE FIELD swift        ON bank TYPE option<string>;
DEFINE FIELD supported_currencies ON bank TYPE set<string> ASSERT $value ALLINSIDE $CURRENCIES;
DEFINE FIELD interest_rate ON bank TYPE float DEFAULT 0.0;
DEFINE FIELD historical_interest_rates ON bank TYPE array<{ rate: float, set_at: datetime }> DEFAULT [];
DEFINE FIELD customers ON bank COMPUTED <~customer;

-- No assert for cent field, but event to update when > 100 or < 0
DEFINE EVENT update_cents ON account WHEN $event = "UPDATE" THEN {
    IF cent > 99 {
        UPDATE $after SET cent -= 100, amount += 1;
    } ELSE IF cent < 0 {
        UPDATE $after SET cent += 100, amount -= 1;
    }
};

-- No assert for cent field, but event to update when > 100 or < 0
DEFINE EVENT update_interest_rate ON bank WHEN $event = "UPDATE" THEN {
    IF $before.interest_rate != $after.interest_rate {
        UPDATE $this SET historical_interest_rates += { rate: $after.interest_rate, set_at: time::now() };
    }
};

CREATE bank:one SET name = "Bank of One", code = "ONEBANK", supported_currencies = ["EUR", "JPY"];
UPDATE bank:one SET interest_rate = 5.0;
CREATE customer:one SET bank = bank:one, name = "Galen Pathwarden";
CREATE account:one SET customer = customer:one, bank = bank:one, currency = "JPY", amount = 10000;

SELECT *, customers.{id, name} FROM bank;
```

### Customers and money transfers

Secure money transfer system with credit-based limits and transaction logging. Features [custom functions](/docs/surrealql/statements/define/function) for atomic transfers, credit level enforcement, and comprehensive audit trails. Demonstrates transaction safety, business rule enforcement, and financial data integrity.

```surql
DEFINE TABLE customer SCHEMAFULL;
-- trusted customers can have greater negative amounts
DEFINE FIELD amount ON customer ASSERT $value >= -1000 * credit_level;
DEFINE FIELD credit_level ON customer TYPE int ASSERT $value IN 0..=5;

-- Logs for money transfers
DEFINE TABLE transfer SCHEMAFULL;
DEFINE FIELD from     ON transfer TYPE record<customer>;
DEFINE FIELD to       ON transfer TYPE record<customer>;
DEFINE FIELD amount   ON transfer TYPE int;
DEFINE FIELD ts       ON transfer TYPE datetime DEFAULT time::now();

DEFINE FUNCTION fn::send_money($from: record<customer>, $to: record<customer>, $amount: int) {
-- Use manual transaction for all statements so all changes are rolled back
-- if something is wrong
    BEGIN;
    If $amount < 1 {
        THROW "Can't send less than 1 ";
    };
    UPDATE $from SET amount -= $amount;
    UPDATE $to SET amount += $amount;
    CREATE transfer SET from = $from, to = $to, amount = $amount;
    COMMIT;
};

CREATE customer:one SET amount = 100, credit_level = 0;
CREATE customer:two SET amount = 500, credit_level = 5;

-- customer:one has bad credit, can't be negative
fn::send_money(customer:one, customer:two, 500);
-- but customer:two can
fn::send_money(customer:two, customer:one, 1000);

SELECT * FROM customer;
SELECT * FROM transfer;
```

### Loans and repayments

Loan management system with automated interest calculations and repayment scheduling. Features [parameterized loan terms](/docs/surrealql/statements/define/param), mathematical payment calculations using [custom functions](/docs/surrealql/statements/define/function), and status tracking. Demonstrates complex financial formulas, temporal data management, and regulatory compliance constraints.

```surql
-- Some government-set maximum term for loans
DEFINE PARAM $MAX_TERM VALUE 84;

DEFINE TABLE loan SCHEMAFULL;
DEFINE FIELD customer      ON loan TYPE record<customer>;
DEFINE FIELD principal     ON loan TYPE int; -- Total borrowed, in cents
DEFINE FIELD interest_rate ON loan TYPE float; -- e.g., 5.5 for 5.5%
DEFINE FIELD issued_at     ON loan TYPE datetime;
-- loans issuable at units of 6 months each
DEFINE FIELD term_months   ON loan TYPE int ASSERT $value % 6 = 0 AND $value <= $MAX_TERM;
DEFINE FIELD balance       ON loan TYPE int; -- Remaining amount to repay
DEFINE FIELD status        ON loan TYPE string ASSERT $value IN ["active", "paid", "defaulted"];

DEFINE TABLE repayment SCHEMAFULL;
DEFINE FIELD loan       ON repayment TYPE record<loan>;
DEFINE FIELD due_date   ON repayment TYPE datetime;
DEFINE FIELD amount     ON repayment TYPE int;
DEFINE FIELD paid       ON repayment TYPE bool DEFAULT false;
DEFINE FIELD paid_at    ON repayment TYPE option<datetime>;
DEFINE FIELD method     ON repayment TYPE option<string>; -- e.g., "auto", "manual"

FOR $loan IN SELECT * FROM loan {
    LET $update_rate = 1 + ($loan.interest_rate / 365);
    UPDATE $loan SET amount = amount * $update_rate;
};

DEFINE FUNCTION fn::repayment_amount($loan: record<loan>) {
    LET $P = $loan.principal;
    LET $annual = $loan.interest_rate / 100;
    LET $r = $annual / 12;              -- Monthly interest rate
    LET $n = $loan.term_months;

    math::round(
        $P * $r / (1 - math::pow(1 + $r, -$n))
    );
};

CREATE customer:one;
CREATE loan:one SET customer = customer:one, principal = 5000000, interest_rate = 5.0, issued_at = time::now(), term_months = 12, balance = 5000000, status = "active";
UPDATE loan:one SET balance -= fn::repayment_amount(loan:one);
```

### Fraud prevention patterns

Anti-fraud detection system using [events](/docs/surrealql/statements/define/event) and temporal analysis. Implements velocity checks, new account restrictions, and suspicious transaction pattern detection. Demonstrates real-time fraud prevention, temporal constraints, and complex business rule enforcement through database events.

```surql
DEFINE FIELD created_at ON account VALUE time::now() READONLY;
DEFINE EVENT cancel_high_volume ON TABLE sends WHEN $event = "CREATE" THEN {
    IF $after.amount > 1000 AND time::now() - $after.in.created_at < 1d {
        THROW "New accounts can only send up to $1000 per transaction";
    }
};

DEFINE FIELD sent_at ON TABLE sends VALUE time::now() READONLY;

DEFINE EVENT cancel_high_volume ON TABLE sends WHEN $event = "CREATE" THEN {
    LET $sender = $after.in;
    LET $receiver = $after.out;
    -- Disallow more than two transactions within a 5 minute period
    LET $recents = 
        $sender->sends[WHERE out = $receiver]
        .filter(|$tx| time::now() - $tx.sent_at < 5m);
    IF $recents.len() > 2 {
        THROW "Can't send that many times within a short period of time";
    };
};
```

### Using Surrealist's graph visualization to see fraudulent activities

For more on these queries and their visual output, see [this dedicated blog post](/blog/fraud-detection-with-surrealdb).

Star pattern: one card used to pay large number of accounts:

```surql
DEFINE FIELD paid_at ON pays DEFAULT time::now();

-- sketchy cards
FOR $card IN CREATE |card:10| {
    FOR $_ IN 0..rand::int(5, 15) {
        LET $payee = UPSERT ONLY account;
        RELATE $card->pays->$payee SET amount = rand::int(100, 1000);    
    };
};

-- regular card
CREATE card:normal;
FOR $_ IN 0..rand::int(5, 15) {
    LET $payee = UPSERT ONLY account;
    RELATE card:normal->pays->$payee SET amount = rand::int(100, 1000), paid_at = time::now() - rand::duration(1d, 100d);
};

SELECT id, ->pays.filter(|$payment| time::now() - $payment.paid_at < 1d).out FROM card;
```

Tight communities that interact mostly among themselves:

```surql
-- Regular community of 200
CREATE |account:200|;
-- Smaller community that interacts among itself
CREATE |account:5| SET is_sketchy = true;

-- The sketchy community interacts only between itself
-- the regular community has more general interactions
-- and sometimes sends money to the sketchy accounts
FOR $account IN SELECT * FROM account {
    FOR $_ IN 0..10 {
        LET $counterpart = IF $account.is_sketchy {
            rand::enum(SELECT * FROM account WHERE is_sketchy)
        } ELSE {
            rand::enum(SELECT * FROM account)
        };
        RELATE $account->sends_to->$counterpart SET amount = rand::int(100, 1000);
    }
};

SELECT id, ->sends_to->account FROM account;
```

Circles showing loops of money returning to its origin:

```surql
CREATE |account:50|;
CREATE |account:1..16| SET is_sketchy = true;

FOR $sketchy IN SELECT * FROM account WHERE is_sketchy {
    LET $counterpart = rand::enum(SELECT * FROM account WHERE is_sketchy AND !<-sent);
    RELATE $sketchy->sent->$counterpart SET amount = rand::int(100, 1000);
};

LET $normal = SELECT * FROM account WHERE !is_sketchy;
FOR $account IN SELECT * FROM account WHERE !is_sketchy {
    LET $counterpart = rand::enum(SELECT * FROM $normal);
    RELATE $account->sent->$counterpart SET amount = rand::int(100, 1000);
};

SELECT id, ->sent->account FROM account;
```

## Gaming

### Characters and quests

RPG game system with character progression, inventory management, and quest tracking. Features polymorphic item effects, character statistics, and complex game state management. Demonstrates flexible data modeling for gaming applications with rich object structures and [relationship tracking](/docs/surrealdb/models/graph).

```surql
-- Characters controlled by players
DEFINE TABLE character SCHEMAFULL;
DEFINE FIELD name     ON character TYPE string;
DEFINE FIELD level    ON character TYPE int DEFAULT 1;
DEFINE FIELD xp       ON character TYPE int DEFAULT 0;
DEFINE FIELD class    ON character TYPE string ASSERT $value IN ["warrior", "mage", "rogue"];
DEFINE FIELD stats    ON character TYPE { str: int, dex: int, int: int };

-- Items in the game world
DEFINE TABLE item SCHEMAFULL;
DEFINE FIELD name     ON item TYPE string;
DEFINE FIELD type     ON item TYPE string ASSERT $value IN ["weapon", "armor", "potion"];
DEFINE FIELD rarity   ON item TYPE string ASSERT $value IN ["common", "rare", "epic", "legendary"];
DEFINE FIELD effects  ON item TYPE array<{ str: int } | { heal: int }>; // etc.

-- Items possessed by characters
DEFINE TABLE owns TYPE RELATION IN character OUT item;
DEFINE FIELD equipped ON owns TYPE bool DEFAULT false;

-- Quests available in the world
DEFINE TABLE quest SCHEMAFULL;
DEFINE FIELD name      ON quest TYPE string;
DEFINE FIELD required_level ON quest TYPE int DEFAULT 1;
DEFINE FIELD rewards   ON quest TYPE { exp: int, items: array<record<item>> };

-- Character quest progress
DEFINE TABLE quest_log TYPE RELATION IN character OUT quest;
DEFINE FIELD status       ON quest_log TYPE string ASSERT $value IN ["active", "completed"];
DEFINE FIELD started_at   ON quest_log TYPE datetime DEFAULT time::now();
DEFINE FIELD completed_at ON quest_log TYPE option<datetime>;

-- Events
DEFINE TABLE character_event SCHEMAFULL;
DEFINE FIELD character  ON character_event TYPE record<character>;
DEFINE FIELD details    ON character_event TYPE 
    { type: "combat", exp: int, against: string, summary: string } |
    { type: "item_used", item: record<item>, summary: string } |
    { type: "quest_update", summary: string };
DEFINE FIELD ts         ON character_event TYPE datetime DEFAULT time::now();

-- Create a new character
CREATE character:aria SET name = "Aria", class = "mage", stats = { str: 4, dex: 6, int: 12 };

-- Give Aria an item
RELATE character:aria->owns->(CREATE ONLY item SET name = "Wand of Sparks", type = "weapon", rarity = "rare", effects = { int: 2 });

-- Start a quest
RELATE character:aria->quest_log->quest:slime_hunt SET status = "active";
```

## Aerospace and astronomy

### Telescopes and observations

Astronomical observation tracking system with instrument management and data collection. Features geospatial telescope locations, flexible observation metadata, and scientific data URL management. Demonstrates [point data types](/docs/surrealql/datamodel/geometries#point), complex temporal relationships, and scientific data organization patterns.

```surql
-- Telescopes (instruments)
DEFINE TABLE telescope SCHEMAFULL;
DEFINE FIELD name        ON telescope TYPE string;
DEFINE FIELD location    ON telescope TYPE point;
DEFINE FIELD aperture_mm ON telescope TYPE int; -- e.g. 200 for 8" scope

-- Astronomical targets
DEFINE TABLE target SCHEMAFULL;
DEFINE FIELD name        ON target TYPE string;
DEFINE FIELD type        ON target TYPE string ASSERT $value IN ["star", "planet", "nebula", "galaxy", "asteroid"];

-- Observation logs
DEFINE TABLE observed SCHEMAFULL TYPE RELATION IN telescope OUT target;
DEFINE FIELD observer        ON observed TYPE record<person>;
DEFINE FIELD observed_at     ON observed TYPE datetime;
DEFINE FIELD observed_until  ON observed TYPE option<datetime>;
DEFINE FIELD exposure_length ON observed VALUE IF observed_until { observed_until - observed_at } ELSE { 0ns };
DEFINE FIELD notes           ON observed TYPE option<string>;
DEFINE FIELD filter          ON observed TYPE option<string> ASSERT $value IN ["B", "V", "R", "I", "H-alpha", "OIII", "IR"];
DEFINE FIELD sky_conditions  ON observed TYPE option<string> ASSERT $value IN ["clear", "thin cloud", "hazy", "overcast"];
DEFINE FIELD data_url        ON observed TYPE option<string>; -- e.g. to FITS file, rendered image, or DOI

CREATE telescope:one SET name = "The one telescope", location = (-68.44, -29.14), aperture_mm = 200;
CREATE target:venus SET type = "planet", name = "Venus";
CREATE person:one;

RELATE telescope:one->observed->target:venus SET 
    observer = person:one,
    observed_at = time::now(),
    observed_until = time::now() + 1h,
    filter = "R",
    seeing = 0.7,
    sky_conditions = "clear",
    data_url = "https://astro.example.org/data/venus-2025.fits";

```

### Launch telemetry

Space launch monitoring system with real-time telemetry data collection. Features component-level tracking, [time-series data management](/docs/surrealdb/models/time-series) with composite keys, and launch lifecycle status tracking. Demonstrates high-frequency data ingestion, temporal range queries, and [live data streaming](/docs/surrealql/statements/live).

```surql
-- A specific launch instance (e.g., Falcon 9 Flight 100)
DEFINE TABLE launch SCHEMAFULL;
DEFINE FIELD name         ON launch TYPE string;
DEFINE FIELD vehicle_name ON launch TYPE option<string>;
DEFINE FIELD scheduled_at ON launch TYPE datetime;
DEFINE FIELD liftoff_at   ON launch TYPE option<datetime>;
DEFINE FIELD status       ON launch TYPE string ASSERT $value IN ["scheduled", "launched", "scrubbed", "failed", "success"] DEFAULT "scheduled";
DEFINE FIELD completed    ON launch TYPE option<datetime>;
 
-- Components involved in the launch
DEFINE TABLE component SCHEMAFULL;
DEFINE FIELD launch     ON component TYPE record<launch>;
DEFINE FIELD name       ON component TYPE string; -- e.g., "first_stage", "engine_1"
DEFINE FIELD type       ON component TYPE string ASSERT $value IN ["stage", "engine", "payload", "fairing"];

-- Time-series telemetry linked to a component
DEFINE TABLE telemetry SCHEMAFULL;
DEFINE FIELD id            ON telemetry TYPE [record<component>, datetime]; -- [component, ulid]
DEFINE FIELD altitude_m    ON telemetry TYPE option<float>;
DEFINE FIELD velocity_mps  ON telemetry TYPE option<float>;
DEFINE FIELD thrust_kN     ON telemetry TYPE option<float>;
DEFINE FIELD pressure_kPa  ON telemetry TYPE option<float>;
DEFINE FIELD temperature_C ON telemetry TYPE option<float>;
DEFINE FIELD status        ON telemetry TYPE option<string>;

CREATE launch:one SET name = "Launch 1", vehicle_name = "Fire rocket", scheduled_at = time::now() - 5s, liftoff_at = time::now() - 1s;
CREATE component:one SET launch = launch:one, name = "Engine 1", type = "engine";
CREATE component:two SET launch = launch:one, name = "Engine 2", type = "engine";

-- Add durations to all datetimes below to simulate passage of time
CREATE telemetry:[component:one, time::now()] SET temperature_c = 30.5, status = "good";
CREATE telemetry:[component:one, time::now() + 1s] SET temperature_c = 30.7, status = "good";
CREATE telemetry:[component:one, time::now() + 2s] SET temperature_c = 30.9, status = "good";
CREATE telemetry:[component:one, time::now() + 3s] SET temperature_c = 35.0, status = "good";
CREATE telemetry:[component:two, time::now()] SET temperature_c = 30.5, status = "good";
CREATE telemetry:[component:two, time::now() + 1s] SET temperature_c = 30.7, status = "good";
CREATE telemetry:[component:two, time::now() + 2s] SET temperature_c = 30.9, status = "good";
CREATE telemetry:[component:two, time::now() + 3s] SET temperature_c = 35.0, status = "good";

UPDATE launch:one SET completed = time::now() + 5s;

-- Get all telemetry for component:two during launch:one
SELECT * FROM telemetry:[component:two, launch:one.liftoff_at]..=[component:two, launch:one.completed];

-- Or LIVE SELECT during the flight
LIVE SELECT * FROM telemetry WHERE id[0] = component:two;
```

## Defense / mission operations

### Missions and tasks

Military mission management system with unit tracking and operational logging. Features hierarchical command structure, real-time status updates, and comprehensive audit trails. Demonstrates complex organizational modeling, [geospatial tracking](/docs/surrealql/datamodel/geometries#point), and mission-critical data management patterns.

```surql
-- Mission-level directive
DEFINE TABLE operation SCHEMAFULL;
DEFINE FIELD name        ON operation TYPE string;
DEFINE FIELD status      ON operation TYPE string ASSERT $value IN ["planned", "active", "complete", "aborted"] DEFAULT "planned";
DEFINE FIELD commander   ON operation TYPE option<record<person>>;
DEFINE FIELD start_time  ON operation TYPE option<datetime>;
DEFINE FIELD end_time    ON operation TYPE option<datetime>;

DEFINE TABLE unit SCHEMAFULL;
DEFINE FIELD members     ON unit TYPE array<record<person>>;
DEFINE FIELD operation   ON unit TYPE record<operation>;
DEFINE FIELD name        ON unit TYPE string; -- e.g., "drone-2", "squad-a"
DEFINE FIELD type        ON unit TYPE string ASSERT $value IN ["drone", "vehicle", "infantry", "support"];
DEFINE FIELD status      ON unit TYPE string ASSERT $value IN ["ready", "deployed", "engaged", "inactive"];

-- Time-stamped unit log (e.g., movement, engagement, report)
DEFINE TABLE log SCHEMAFULL;
DEFINE FIELD id          ON log TYPE [record<unit>, datetime]; -- [unit, timestamp]
DEFINE FIELD message     ON log TYPE string;
DEFINE FIELD status      ON log TYPE option<string>; -- e.g., "engaged", "moving", "waiting"
DEFINE FIELD lonlat      ON log TYPE option<point>;
DEFINE FIELD visibility  ON log TYPE option<string> ASSERT $value IN ["clear", "obscured", "night"];

-- Tasks assigned within a mission
DEFINE TABLE task SCHEMAFULL;
DEFINE FIELD operation   ON task TYPE record<operation>;
DEFINE FIELD name        ON task TYPE string;
DEFINE FIELD objective   ON task TYPE string;
DEFINE FIELD assigned_to ON task TYPE option<array<record<unit>>>;
DEFINE FIELD priority    ON task TYPE string ASSERT $value IN ["high", "medium", "low"];
DEFINE FIELD completed   ON task TYPE bool DEFAULT false;

CREATE operation:alpha SET name = "Operation Alpha", commander = person:one, start_time = time::now();

CREATE unit:squad1 SET operation = operation:alpha, name = "squad-1", type = "infantry", status = "deployed", members = [person:one, person:two];
CREATE unit:drone1 SET operation = operation:alpha, name = "drone-1", type = "drone", status = "ready", members = [person:three, person:four];

CREATE task SET 
  operation = operation:alpha, 
  name = "Secure Ridge", 
  objective = "Clear hilltop sector", 
  assigned_to = [unit:squad1], 
  priority = "high";

-- Log messages (simulate time with + durations)
CREATE log:[unit:squad1, time::now()] SET message = "Entered zone", status = "moving", lonlat = (44.2, 6.3);
CREATE log:[unit:squad1, time::now() + 3m] SET message = "Engaged hostiles", status = "engaged", visibility = "clear";
CREATE log:[unit:drone1, time::now()] SET message = "Recon sweep complete", status = "waiting", lonlat = (44.3, 6.2);
```

## Retail

### People, products and commerce

E-commerce platform schema with customer profiles, product catalog, and shopping cart management. Features flexible address storage, multi-currency support, and comprehensive timestamp tracking. Demonstrates modern e-commerce data modeling with [flexible objects](/docs/surrealql/datamodel/objects#flexible-objects) and relationship management.

```surql
-- Person / customer profile
DEFINE TABLE person SCHEMAFULL;
DEFINE FIELD name     ON person TYPE string;
DEFINE FIELD email    ON person TYPE string ASSERT string::is_email($value);
DEFINE FIELD address  ON person TYPE object;
DEFINE FIELD time     ON person TYPE object;
DEFINE FIELD time.created_at ON person TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON person TYPE datetime VALUE time::now();

-- Payment method linked to person
DEFINE TABLE payment_details SCHEMAFULL;
DEFINE FIELD person          ON payment_details TYPE record<person>;
DEFINE FIELD stored_cards    ON payment_details TYPE array<object>;
DEFINE FIELD time            ON payment_details TYPE object;
DEFINE FIELD time.created_at ON payment_details TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON payment_details TYPE datetime VALUE time::now();

-- Seller profile
DEFINE TABLE seller SCHEMAFULL;
DEFINE FIELD name            ON seller TYPE string;
DEFINE FIELD email           ON seller TYPE string ASSERT string::is_email($value);
DEFINE FIELD time            ON seller TYPE object;
DEFINE FIELD time.created_at ON seller TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON seller TYPE datetime VALUE time::now();

-- Product listings
DEFINE TABLE product SCHEMAFULL;
DEFINE FIELD name            ON product TYPE string;
DEFINE FIELD price           ON product TYPE number;
DEFINE FIELD currency        ON product TYPE string ASSERT $value IN ["USD", "GBP", "CAD"];
DEFINE FIELD category        ON product TYPE string;
DEFINE FIELD seller          ON product TYPE record<seller>;
DEFINE FIELD time            ON product TYPE object;
DEFINE FIELD time.created_at ON product TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON product TYPE datetime VALUE time::now();

-- Wishlist links (person -> product)
DEFINE TABLE wishlist TYPE RELATION FROM person TO product SCHEMAFULL;
DEFINE FIELD colour ON wishlist TYPE string;
DEFINE FIELD size   ON wishlist TYPE string;
DEFINE FIELD time   ON wishlist TYPE object;
DEFINE FIELD time.created_at ON wishlist TYPE datetime DEFAULT time::now();
DEFINE FIELD time.deleted_at ON wishlist TYPE option<datetime>;

-- Cart links (person -> product)
DEFINE TABLE cart TYPE RELATION FROM person TO product SCHEMAFULL;
DEFINE FIELD quantity ON cart TYPE number;
DEFINE FIELD price    ON cart TYPE number;
DEFINE FIELD currency ON cart TYPE string ASSERT $value IN ["CAD", "EUR", "USD"];
DEFINE FIELD time     ON cart TYPE object;
DEFINE FIELD time.created_at ON cart TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON cart TYPE datetime VALUE time::now();
```

### Orders, reviews, reports

Order processing and analytics system with review management and business intelligence. Features order lifecycle tracking, automated analytics tables, and [full-text search](/docs/surrealql/statements/define/analyzer) capabilities. Demonstrates complex aggregations, [materialized views](/docs/surrealql/statements/define/table#pre-computed-table-views), and search optimization for e-commerce applications.

```surql

-- Orders placed (person -> product)
DEFINE TABLE order TYPE RELATION FROM person TO product SCHEMAFULL;
DEFINE FIELD quantity          ON order TYPE number;
DEFINE FIELD price             ON order TYPE number;
DEFINE FIELD currency          ON order TYPE string;
DEFINE FIELD order_status      ON order TYPE string ASSERT $value IN ["pending", "processed", "shipped", "cancelled"];
DEFINE FIELD shipping_address  ON order FLEXIBLE TYPE object;
DEFINE FIELD payment_method    ON order TYPE string;
DEFINE FIELD time              ON order TYPE object;
DEFINE FIELD time.created_at   ON order TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at   ON order TYPE datetime VALUE time::now();
DEFINE FIELD time.processed_at ON order TYPE option<datetime>;
DEFINE FIELD time.shipped_at   ON order TYPE option<datetime>;

-- Product reviews
DEFINE TABLE review TYPE RELATION FROM person TO product SCHEMAFULL;
DEFINE FIELD rating       ON review TYPE number ASSERT $value IN 0..=5;
DEFINE FIELD review_text  ON review TYPE string;
DEFINE FIELD time         ON review TYPE object;
DEFINE FIELD time.created_at ON review TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON review TYPE datetime VALUE time::now();

-- Indexes and analytics
DEFINE FUNCTION fn::number_of_unfulfilled_orders() {
  RETURN (SELECT count() FROM order WHERE order_status NOTINSIDE ["processed", "shipped"] GROUP ALL);
};

-- Monthly order summary
DEFINE TABLE monthly_sales TYPE NORMAL SCHEMAFULL AS 
  SELECT 
    count() AS number_of_orders, 
    time::format(time.created_at, '%Y-%m') AS month, 
    math::sum(price * quantity) AS sum_sales, 
    currency 
  FROM order 
  GROUP BY month, currency;

-- Average product rating
DEFINE TABLE avg_product_review TYPE NORMAL SCHEMAFULL AS 
  SELECT 
    count() AS number_of_reviews, 
    math::mean(<float> rating) AS avg_review, 
    ->product.id AS product_id, 
    ->product.name AS product_name 
  FROM review 
  GROUP BY product_id, product_name;

-- Full-text search
DEFINE ANALYZER blank_snowball TOKENIZERS blank FILTERS lowercase, snowball(english);
DEFINE INDEX review_content ON review FIELDS review_text FULLTEXT ANALYZER blank_snowball BM25 HIGHLIGHTS;
```

## Medical

### Patient records and encounters

Healthcare management system with patient records, encounter tracking, and clinical data management. Features vital signs [time-series data](/docs/surrealdb/models/time-series), medication tracking, and automated encounter lifecycle management using [events](/docs/surrealql/statements/define/event). Demonstrates healthcare data modeling with temporal data, clinical workflows, and medical record compliance patterns.

```surql
-- Patient record
DEFINE TABLE patient SCHEMAFULL;
DEFINE FIELD name      ON patient TYPE string;
DEFINE FIELD dob       ON patient TYPE datetime;
DEFINE FIELD gender    ON patient TYPE string ASSERT $value IN ["male", "female", "other", "uncertain"];
DEFINE FIELD email     ON patient TYPE option<string> ASSERT string::is_email($value);
DEFINE FIELD created_at ON patient TYPE datetime DEFAULT time::now();

-- One healthcare visit
DEFINE TABLE encounter SCHEMAFULL;
DEFINE FIELD patient     ON encounter TYPE record<patient>;
DEFINE FIELD occurred_at ON encounter TYPE datetime DEFAULT time::now();
DEFINE FIELD type        ON encounter TYPE string ASSERT $value IN ["checkup", "emergency", "followup", "consult"];
DEFINE FIELD reason      ON encounter TYPE option<string>;
DEFINE FIELD location    ON encounter TYPE option<string>;
DEFINE FIELD ongoing    ON encounter TYPE bool DEFAULT true;
DEFINE FIELD ended_at   ON encounter TYPE option<datetime>;

DEFINE EVENT close_encounter ON encounter WHEN $event = "UPDATE" THEN {
    IF $before.ongoing = true AND $after.ongoing = false {
        UPDATE $this SET ended_at = time::now();
    }
};

-- Vital signs time-series (per encounter)
DEFINE TABLE vital_signs SCHEMAFULL;
DEFINE FIELD id        ON vital_signs TYPE [record<encounter>, datetime];
DEFINE FIELD heart_rate     ON vital_signs TYPE option<int> ASSERT $value IN 20..=300;
DEFINE FIELD bp_systolic    ON vital_signs TYPE option<int> ASSERT $value IN 40..=300;
DEFINE FIELD bp_diastolic   ON vital_signs TYPE option<int> ASSERT $value IN 20..=200;
DEFINE FIELD temp_c         ON vital_signs TYPE option<float> ASSERT $value IN 25.0..=45.0;
DEFINE FIELD notes     ON vital_signs TYPE option<string>;

-- Diagnoses made during encounter
DEFINE TABLE diagnosis SCHEMAFULL;
DEFINE FIELD encounter ON diagnosis TYPE record<encounter>;
DEFINE FIELD code      ON diagnosis TYPE string; -- e.g., ICD-10
DEFINE FIELD label     ON diagnosis TYPE string;
DEFINE FIELD confirmed ON diagnosis TYPE bool DEFAULT true;

-- Medications prescribed
DEFINE TABLE medication SCHEMAFULL;
DEFINE FIELD encounter ON medication TYPE record<encounter>;
DEFINE FIELD name      ON medication TYPE string;
DEFINE FIELD dose_mg   ON medication TYPE float;
DEFINE FIELD frequency ON medication TYPE string; -- e.g., "2x daily"
DEFINE FIELD duration  ON medication TYPE string; -- e.g., "7 days"
DEFINE FIELD prn       ON medication TYPE bool DEFAULT false; -- "as needed"

-- Notes written by practitioner
DEFINE TABLE note SCHEMAFULL;
DEFINE FIELD id      ON note TYPE [record<encounter>, datetime];
DEFINE FIELD author  ON note TYPE string;
DEFINE FIELD content ON note TYPE string;
DEFINE FIELD tags    ON note TYPE option<array<string>>;

CREATE patient:one SET name = "Alex Quinn", dob = d'1988-06-12', gender = "male";
CREATE encounter:one SET patient = patient:one, type = "checkup", reason = "Routine annual";

-- Vital signs log
CREATE vital_signs:[encounter:one, time::now()] SET heart_rate = 72, bp_systolic = 120, bp_diastolic = 80, temp_c = 36.8;

-- Diagnosis
CREATE diagnosis SET encounter = encounter:one, code = "E66.9", label = "Obesity, unspecified";

-- Medication
CREATE medication SET encounter = encounter:one, name = "Metformin", dose_mg = 500, frequency = "2x daily", duration = "30 days";

-- Progress note
CREATE note:[encounter:one, time::now()] SET author = "Dr. Leung", content = "Patient reports improved energy since last visit.";
```

## Related SurrealQL statements

- [DEFINE TABLE](/docs/surrealql/statements/define/table)
- [DEFINE FIELD](/docs/surrealql/statements/define/field)
- [RELATE](/docs/surrealql/statements/relate)
- [DEFINE INDEX](/docs/surrealql/statements/define/indexes)
- [DEFINE FUNCTION](/docs/surrealql/statements/define/function)
- [DEFINE EVENT](/docs/surrealql/statements/define/event)
- [DEFINE PARAM](/docs/surrealql/statements/define/param)
- [DEFINE ANALYZER](/docs/surrealql/statements/define/analyzer)
