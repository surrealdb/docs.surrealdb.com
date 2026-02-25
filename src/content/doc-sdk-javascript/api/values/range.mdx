---
sidebar_position: 10
sidebar_label: Range
title: JavaScript | SDK | API Reference | Range
description: Generic range values for numeric, datetime, and other ordered types.
---

import Label from "@components/shared/Label.astro";

# `Range<Beg, End>` {#range}

The `Range` class provides generic range values for representing inclusive or exclusive ranges of ordered data types.

**Import:**
```ts
import { Range } from 'surrealdb';
```

**Source:** [value/range.ts](https://github.com/surrealdb/surrealdb.js/blob/main/packages/sdk/src/value/range.ts)

## Type Parameters

- `Beg` - The type of the beginning bound
- `End` - The type of the ending bound

## Constructor

### `new Range(begin, end)` {#constructor}

Create a new range value.

```ts title="Syntax"
new Range(begin, end)
```

#### Parameters
<table>
    <thead>
        <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>begin</code> <Label label="required" /></td>
            <td><code>Bound&lt;Beg&gt;</code></td>
            <td>The beginning bound (can be inclusive or exclusive).</td>
        </tr>
        <tr>
            <td><code>end</code> <Label label="required" /></td>
            <td><code>Bound&lt;End&gt;</code></td>
            <td>The ending bound (can be inclusive or exclusive).</td>
        </tr>
    </tbody>
</table>

#### Examples

```ts
// Numeric range [1, 100]
const numericRange = new Range(
    { value: 1, inclusive: true },
    { value: 100, inclusive: true }
);

// Date range
const dateRange = new Range(
    { value: DateTime.parse('2024-01-01'), inclusive: true },
    { value: DateTime.parse('2024-12-31'), inclusive: true }
);

// Half-open range [0, 10)
const halfOpen = new Range(
    { value: 0, inclusive: true },
    { value: 10, inclusive: false }
);
```

## Properties

### `begin` {#begin}

The beginning bound of the range.

**Type:** `Bound<Beg>`

```ts
const range = new Range(
    { value: 1, inclusive: true },
    { value: 10, inclusive: true }
);

console.log(range.begin.value); // 1
console.log(range.begin.inclusive); // true
```

---

### `end` {#end}

The ending bound of the range.

**Type:** `Bound<End>`

```ts
const range = new Range(
    { value: 1, inclusive: true },
    { value: 10, inclusive: true }
);

console.log(range.end.value); // 10
console.log(range.end.inclusive); // true
```

## Instance Methods

### `.toString()` {#tostring}

Convert to string representation.

```ts title="Syntax"
range.toString()
```

#### Returns
`string` - Range string (e.g., `1..10`, `1..=10`, `1>..10`)

#### Examples

```ts
// Inclusive range [1, 10]
const inclusive = new Range(
    { value: 1, inclusive: true },
    { value: 10, inclusive: true }
);
console.log(inclusive.toString()); // '1..=10'

// Exclusive range (1, 10)
const exclusive = new Range(
    { value: 1, inclusive: false },
    { value: 10, inclusive: false }
);
console.log(exclusive.toString()); // '1>..10'

// Half-open [1, 10)
const halfOpen = new Range(
    { value: 1, inclusive: true },
    { value: 10, inclusive: false }
);
console.log(halfOpen.toString()); // '1..10'
```

---

### `.toJSON()` {#tojson}

Serialize for JSON.

```ts title="Syntax"
range.toJSON()
```

#### Returns
`string` - Range string representation

---

### `.equals(other)` {#equals}

Check if two ranges are equal.

```ts title="Syntax"
range.equals(other)
```

#### Returns
`boolean` - True if equal

## Complete Examples

### Numeric Ranges

```ts
import { Surreal, Range } from 'surrealdb';

const db = new Surreal();
await db.connect('ws://localhost:8000');

// Define age range for filtering
const adultRange = new Range(
    { value: 18, inclusive: true },
    { value: 120, inclusive: true }
);

// Query with range
const adults = await db.query(`
    SELECT * FROM users 
    WHERE age IN $range
`, {
    range: adultRange
}).collect();
```

### Date Ranges

```ts
import { DateTime, Range } from 'surrealdb';

// Define fiscal year
const fiscalYear = new Range(
    { value: DateTime.parse('2024-01-01T00:00:00Z'), inclusive: true },
    { value: DateTime.parse('2024-12-31T23:59:59Z'), inclusive: true }
);

// Query events in date range
const events = await db.query(`
    SELECT * FROM events 
    WHERE date IN $range
`, {
    range: fiscalYear
}).collect();
```

### Price Ranges

```ts
import { Decimal, Range } from 'surrealdb';

// Define price range for product filtering
const budgetRange = new Range(
    { value: new Decimal('0'), inclusive: true },
    { value: new Decimal('100'), inclusive: true }
);

const products = await db.query(`
    SELECT * FROM products 
    WHERE price IN $range
`, {
    range: budgetRange
}).collect();
```

### Score Ranges

```ts
// Grade ranges
const gradeA = new Range(
    { value: 90, inclusive: true },
    { value: 100, inclusive: true }
);

const gradeB = new Range(
    { value: 80, inclusive: true },
    { value: 89, inclusive: true }
);

// Assign grades
const students = await db.query(`
    SELECT *,
        CASE
            WHEN score IN $gradeA THEN 'A'
            WHEN score IN $gradeB THEN 'B'
            ELSE 'C'
        END AS grade
    FROM students
`, {
    gradeA,
    gradeB
}).collect();
```

### Time-based Filtering

```ts
// Recent activity (last 30 days)
const now = DateTime.now();
const thirtyDaysAgo = now.minus(Duration.parse('30d'));

const recentRange = new Range(
    { value: thirtyDaysAgo, inclusive: true },
    { value: now, inclusive: true }
);

const recentActivity = await db.query(`
    SELECT * FROM activity_log 
    WHERE timestamp IN $range
    ORDER BY timestamp DESC
`, {
    range: recentRange
}).collect();
```

### Pagination with ID Ranges

```ts
import { RecordId, Range } from 'surrealdb';

// Fetch records in ID range
const idRange = new Range(
    { value: new RecordId('users', 'a'), inclusive: true },
    { value: new RecordId('users', 'f'), inclusive: false }
);

const users = await db.query(`
    SELECT * FROM users 
    WHERE id IN $range
`, {
    range: idRange
}).collect();
```

### Exclusive Ranges

```ts
// Exclusive range (not including boundaries)
const exclusive = new Range(
    { value: 0, inclusive: false },
    { value: 100, inclusive: false }
);
// Matches: 0 < x < 100

const results = await db.query(`
    SELECT * FROM measurements 
    WHERE value IN $range
`, {
    range: exclusive
}).collect();
```

### Half-Open Ranges

```ts
// Half-open range [start, end)
const halfOpen = new Range(
    { value: 0, inclusive: true },
    { value: 10, inclusive: false }
);
// Matches: 0 <= x < 10

// Common for array-like indexing
const items = await db.query(`
    SELECT * FROM items 
    WHERE index IN $range
`, {
    range: halfOpen
}).collect();
```

### Multiple Ranges

```ts
// Define multiple severity levels
const low = new Range(
    { value: 0, inclusive: true },
    { value: 3, inclusive: true }
);

const medium = new Range(
    { value: 4, inclusive: true },
    { value: 6, inclusive: true }
);

const high = new Range(
    { value: 7, inclusive: true },
    { value: 10, inclusive: true }
);

// Query by severity
const criticalIssues = await db.query(`
    SELECT * FROM issues 
    WHERE severity IN $range
`, {
    range: high
}).collect();
```

### Range Queries in Application

```ts
function queryByRange<T>(
    start: T,
    end: T,
    inclusive: boolean = true
): Range<T, T> {
    return new Range(
        { value: start, inclusive },
        { value: end, inclusive }
    );
}

// Usage
const dateRange = queryByRange(
    DateTime.parse('2024-01-01'),
    DateTime.parse('2024-12-31')
);

const orders = await db.query(`
    SELECT * FROM orders 
    WHERE created_at IN $range
`, {
    range: dateRange
}).collect();
```

## Range Notation

SurrealDB uses specific notation for ranges:

| Notation | Description | Example |
|----------|-------------|---------|
| `a..=b` | Inclusive both ends `[a, b]` | `1..=10` |
| `a..b` | Inclusive start, exclusive end `[a, b)` | `1..10` |
| `a>..b` | Exclusive start, exclusive end `(a, b)` | `1>..10` |
| `a>..=b` | Exclusive start, inclusive end `(a, b]` | `1>..=10` |

## Best Practices

### 1. Use Appropriate Inclusivity

```ts
// Good: Inclusive for dates (including full days)
const dateRange = new Range(
    { value: DateTime.parse('2024-01-01T00:00:00Z'), inclusive: true },
    { value: DateTime.parse('2024-01-31T23:59:59Z'), inclusive: true }
);

// Good: Exclusive end for array-like indexing
const arrayRange = new Range(
    { value: 0, inclusive: true },
    { value: 10, inclusive: false }
); // [0, 10)
```

### 2. Type Safety

```ts
// Good: Explicit types
const range: Range<number, number> = new Range(
    { value: 1, inclusive: true },
    { value: 100, inclusive: true }
);

// Good: Consistent types
const dateRange: Range<DateTime, DateTime> = new Range(
    { value: DateTime.now(), inclusive: true },
    { value: DateTime.now().plus(Duration.parse('1d')), inclusive: true }
);
```

### 3. Validate Bounds

```ts
// Good: Ensure start <= end
function createRange<T>(start: T, end: T): Range<T, T> | null {
    if (start > end) {
        console.error('Invalid range: start must be <= end');
        return null;
    }
    
    return new Range(
        { value: start, inclusive: true },
        { value: end, inclusive: true }
    );
}
```

## Use Cases

- **Filtering** - Filter records by numeric, date, or other ordered values
- **Pagination** - Query records in ID ranges
- **Time Windows** - Define time-based query windows
- **Price Filtering** - E-commerce price range searches
- **Score Categorization** - Categorize by score ranges (grades, ratings)
- **Geographic Bounds** - Coordinate ranges for maps

## See Also

- [RecordIdRange](/docs/2.x/sdk/javascript/api/values/record-id#recordidrange) - Range of record IDs
- [DateTime](/docs/2.x/sdk/javascript/api/values/datetime) - Datetime values for date ranges
- [Decimal](/docs/2.x/sdk/javascript/api/values/decimal) - Precise numbers for price ranges
- [Data Types Overview](/docs/2.x/sdk/javascript/api/values/) - All custom data types
- [SurrealQL Ranges](/docs/surrealql/datamodel/ranges) - Database range syntax
