// Timeline figures for transactions, events, views, live queries, changefeeds,
// sequences and time functions. Each one draws the page's own example, run on
// SurrealDB 4.0; the transactions were interleaved over two RPC connections.

import {
    arrow,
    circle,
    type Figure,
    line,
    MONO,
    markers,
    rect,
    svg,
    type Theme,
    text,
} from "../lib";

// A horizontal lane with a label on the left
function lane(s: string[], t: Theme, y: number, label: string, x0 = 360, x1 = 2300, sub?: string) {
    s.push(
        text(x0 - 30, y + (sub ? -4 : 10), label, {
            size: 28,
            fill: t.text,
            weight: 700,
            anchor: "end",
        }),
    );
    if (sub) s.push(text(x0 - 30, y + 30, sub, { size: 22, fill: t.muted, anchor: "end" }));
    s.push(line(x0, y, x1, y, t.grid, 3));
}

// A step on a lane: a box centred on x with a short label
function step(
    s: string[],
    t: Theme,
    x: number,
    y: number,
    label: string,
    kind: "plain" | "accent" | "bad" | "good" = "plain",
    w = 300,
) {
    const fill =
        kind === "accent"
            ? t.accentBg
            : kind === "bad"
              ? t.redBg
              : kind === "good"
                ? t.greenBg
                : t.card;
    const stroke =
        kind === "accent"
            ? t.accent
            : kind === "bad"
              ? t.red
              : kind === "good"
                ? t.green
                : undefined;
    s.push(rect(x - w / 2, y - 34, w, 68, { fill, stroke, r: 12 }));
    s.push(text(x, y + 9, label, { size: 22, fill: t.text, weight: 600, font: MONO }));
}

// Two on-call doctors, each signing off if the other is still on call
const writeSkew: Figure = {
    name: "write-skew",
    width: 2400,
    height: 960,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        const panel = (y0: number, title: string, forUpdate: boolean) => {
            s.push(text(80, y0, title, { size: 32, fill: t.text, weight: 700, anchor: "start" }));
            const ya = y0 + 110;
            const yb = y0 + 230;
            lane(s, t, ya, "Ana's transaction");
            lane(s, t, yb, "Ben's transaction");
            for (const y of [ya, yb]) step(s, t, 500, y, "BEGIN", "plain", 160);
            step(
                s,
                t,
                860,
                ya,
                forUpdate ? "read doctor:ben FOR UPDATE" : "read doctor:ben",
                forUpdate ? "accent" : "plain",
                460,
            );
            step(
                s,
                t,
                860,
                yb,
                forUpdate ? "read doctor:ana FOR UPDATE" : "read doctor:ana",
                forUpdate ? "accent" : "plain",
                460,
            );
            step(s, t, 1340, ya, "set ana off call", "plain", 340);
            step(s, t, 1340, yb, "set ben off call", "plain", 340);
            step(s, t, 1720, ya, "COMMIT", "good", 200);
            step(s, t, 1980, yb, "COMMIT", forUpdate ? "bad" : "good", 200);
            const result = forUpdate
                ? "Ben's COMMIT fails: Ana wrote a record he read FOR UPDATE. He retries, sees Ana is off call, and stays on."
                : "Both commit. Each saw the other on call in its snapshot, so nobody is on call.";
            s.push(
                text(360, yb + 100, result, {
                    size: 26,
                    fill: forUpdate ? t.text : t.red,
                    weight: 600,
                    anchor: "start",
                }),
            );
        };
        panel(70, "Snapshot isolation alone: write skew", false);
        panel(520, "With FOR UPDATE on the record each decision reads", true);
        return svg(writeSkew, t, s.join(""));
    },
};

// time::floor and time::ceil around 2023-10-23T09:12:53Z, from the time functions page
const DAY = 86_400_000;
const timeRounding: Figure = {
    name: "time-floor-ceil",
    width: 2400,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [];
        const from = Date.UTC(2023, 9, 4);
        const to = Date.UTC(2023, 10, 11);
        const X0 = 360;
        const X1 = 2300;
        const X = (ms: number) => X0 + ((ms - from) / (to - from)) * (X1 - X0);
        const now = Date.UTC(2023, 9, 23, 9, 12, 53);
        // Day ticks along the top
        for (let d = from; d <= to; d += DAY) {
            const date = new Date(d);
            const major = date.getUTCDate() % 7 === 1 || date.getUTCDate() === 1;
            s.push(line(X(d), 110, X(d), major ? 140 : 128, t.grid, 2));
            if (major)
                s.push(
                    text(X(d), 96, date.toISOString().slice(5, 10), {
                        size: 22,
                        fill: t.muted,
                        font: MONO,
                    }),
                );
        }
        const rows: [string, number][] = [
            ["1w", 7],
            ["15d", 15],
            ["16d", 16],
            ["17d", 17],
            ["18d", 18],
        ];
        rows.forEach(([label, days], i) => {
            const y = 220 + i * 120;
            lane(s, t, y, label, X0, X1);
            const step = days * DAY;
            const fl = Math.floor(now / step) * step;
            const ce = fl + step;
            // Multiples of the duration, counted from the Unix epoch
            for (let m = Math.ceil(from / step) * step; m <= to; m += step)
                s.push(circle(X(m), y, 9, t.line));
            s.push(
                `<rect x="${X(fl)}" y="${y - 22}" width="${X(ce) - X(fl)}" height="44" rx="10" fill="${t.accentSoft}"/>`,
            );
            s.push(circle(X(fl), y, 14, t.accent));
            s.push(circle(X(ce), y, 14, t.accent));
            s.push(
                text(X(fl), y - 34, `floor ${new Date(fl).toISOString().slice(5, 10)}`, {
                    size: 20,
                    fill: t.accent,
                    weight: 600,
                    font: MONO,
                    halo: t.bg,
                }),
            );
            s.push(
                text(X(ce), y - 34, `ceil ${new Date(ce).toISOString().slice(5, 10)}`, {
                    size: 20,
                    fill: t.accent,
                    weight: 600,
                    font: MONO,
                    halo: t.bg,
                }),
            );
        });
        s.push(line(X(now), 150, X(now), 790, t.text, 3, "8 6"));
        s.push(
            text(X(now), 830, "$now = d'2023-10-23T09:12:53Z'", {
                size: 24,
                fill: t.text,
                weight: 600,
                font: MONO,
            }),
        );
        s.push(
            text(
                80,
                880,
                "Each dot is a whole multiple of the duration since 1970-01-01, a Thursday, so 1w lands on Thursdays and each length of days lands somewhere different.",
                { size: 24, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(timeRounding, t, s.join(""));
    },
};

// A synchronous event and an ASYNC one, by transaction
const eventTiming: Figure = {
    name: "event-sync-async",
    width: 2400,
    height: 860,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.accent])];
        s.push(
            text(80, 70, "A synchronous event runs inside the write's transaction", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        s.push(rect(360, 120, 1300, 120, { fill: t.panel, r: 16 }));
        s.push(text(380, 150, "transaction 1", { size: 22, fill: t.muted, anchor: "start" }));
        step(s, t, 560, 190, "CREATE person", "plain", 280);
        step(s, t, 940, 190, "event runs", "accent", 280);
        step(s, t, 1420, 190, "COMMIT", "good", 200);
        s.push(
            text(1720, 200, "If the event fails, the write rolls back too.", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );

        s.push(
            text(
                80,
                350,
                "An ASYNC event is queued in the write's transaction and runs later in its own",
                { size: 30, fill: t.text, weight: 700, anchor: "start" },
            ),
        );
        s.push(rect(360, 400, 860, 120, { fill: t.panel, r: 16 }));
        s.push(text(380, 430, "transaction 1", { size: 22, fill: t.muted, anchor: "start" }));
        step(s, t, 560, 470, "CREATE person", "plain", 280);
        step(s, t, 880, 470, "queue event", "accent", 240);
        step(s, t, 1110, 470, "COMMIT", "good", 180);
        s.push(arrow(1230, 470, 1430, 470, t.line, 3, "8 8"));
        s.push(text(1330, 448, "worker polls", { size: 22, fill: t.muted }));
        s.push(text(1330, 506, "every 5 s", { size: 22, fill: t.muted }));
        s.push(rect(1440, 400, 860, 120, { fill: t.panel, r: 16 }));
        s.push(text(1460, 430, "transaction 2", { size: 22, fill: t.muted, anchor: "start" }));
        step(s, t, 1680, 470, "event runs", "accent", 260);
        step(s, t, 2110, 470, "COMMIT", "good", 180);
        s.push(
            text(
                360,
                620,
                "If transaction 1 fails, nothing is queued. If the event's transaction loses a write conflict, it runs again,",
                { size: 24, fill: t.muted, anchor: "start" },
            ),
        );
        s.push(
            text(360, 656, "so the event runs at least once and can run more than once.", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(
                360,
                740,
                "The interval is SURREAL_ASYNC_EVENT_PROCESSING_INTERVAL, 5 seconds by default.",
                { size: 24, fill: t.muted, anchor: "start", font: MONO },
            ),
        );
        return svg(eventTiming, t, s.join(""));
    },
};

// The MAXDEPTH example on define/event: each event creates 9 records of the other table
const maxDepth: Figure = {
    name: "event-maxdepth",
    width: 2200,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [];
        const levels = [1, 9, 81, 729, 6561];
        const L = 420;
        const R = 1880;
        const X = (n: number) => L + (Math.log10(n) / Math.log10(10000)) * (R - L);
        s.push(
            text(80, 70, "Records created at each depth of the cat and person events", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        levels.forEach((n, depth) => {
            const y = 160 + depth * 120;
            const inDefault = depth <= 3;
            s.push(
                text(L - 40, y + 10, depth === 0 ? "CREATE start" : `depth ${depth}`, {
                    size: 26,
                    fill: t.text,
                    weight: 600,
                    anchor: "end",
                }),
            );
            s.push(
                rect(L, y - 32, Math.max(X(n) - L, 14), 64, {
                    fill: inDefault ? t.accentBg : t.redBg,
                    stroke: inDefault ? t.accent : t.red,
                    r: 10,
                }),
            );
            s.push(
                text(
                    Math.max(X(n), L + 14) + 20,
                    y + 10,
                    `${n.toLocaleString("en-GB")} ${depth === 0 ? "cat" : depth % 2 ? "people" : "cats"}`,
                    { size: 26, fill: t.text, weight: 600, anchor: "start" },
                ),
            );
        });
        s.push(line(L, 160 + 3.5 * 120, R, 160 + 3.5 * 120, t.text, 3, "10 8"));
        s.push(
            text(R, 160 + 3.5 * 120 - 14, "default MAXDEPTH 3 stops here", {
                size: 24,
                fill: t.text,
                weight: 600,
                anchor: "end",
            }),
        );
        s.push(
            text(
                80,
                790,
                "Total with the default: 1 + 9 + 81 + 729 = 820 records. With MAXDEPTH 4: 820 + 6,561 = 7,381.",
                { size: 28, fill: t.text, anchor: "start" },
            ),
        );
        s.push(
            text(80, 836, "Bar lengths are on a logarithmic scale.", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );
        return svg(maxDepth, t, s.join(""));
    },
};

// What updates a pre-computed table view, from the avg_product_review example
const tableView: Figure = {
    name: "table-view-updates",
    width: 2400,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line, t.red])];
        const view = { x: 1900, y: 430 };
        s.push(rect(view.x - 260, view.y - 90, 520, 180, { fill: t.accentBg, stroke: t.accent }));
        s.push(
            text(view.x, view.y - 10, "avg_product_review", {
                size: 30,
                fill: t.text,
                weight: 700,
                font: MONO,
            }),
        );
        s.push(text(view.x, view.y + 34, "the view table", { size: 24, fill: t.muted }));
        const source = (
            y: number,
            label: string,
            sub: string,
            kind: "accent" | "bad" | "muted" | "plain",
        ) => {
            const fill = kind === "accent" ? t.card : kind === "bad" ? t.redBg : t.panel;
            s.push(
                rect(220, y - 60, 640, 120, { fill, stroke: kind === "bad" ? t.red : undefined }),
            );
            s.push(
                text(250, y - 8, label, {
                    size: 26,
                    fill: t.text,
                    weight: 700,
                    anchor: "start",
                    font: MONO,
                }),
            );
            s.push(text(250, y + 34, sub, { size: 22, fill: t.muted, anchor: "start" }));
        };
        source(
            150,
            "DEFINE TABLE … AS SELECT",
            "runs the full query once to fill the view",
            "plain",
        );
        s.push(arrow(870, 150, view.x - 270, view.y - 60, t.accent, 4));
        source(370, "a write to review", "the FROM table: updates the matching record", "accent");
        s.push(arrow(870, 370, view.x - 270, view.y - 10, t.accent, 4));
        source(590, "a write to product", "read by the query, but not its FROM table", "bad");
        s.push(arrow(870, 590, 1350, 520, t.red, 4, "10 8"));
        s.push(
            text(1380, 540, "✕  no update", {
                size: 26,
                fill: t.red,
                weight: 700,
                anchor: "start",
            }),
        );
        source(
            780,
            "a write under OPTION IMPORT",
            "skipped; DEFINE TABLE OVERWRITE refills",
            "plain",
        );
        s.push(arrow(870, 780, 1350, 650, t.line, 3, "10 8"));
        s.push(
            text(1380, 670, "✕  no update", {
                size: 26,
                fill: t.muted,
                weight: 700,
                anchor: "start",
            }),
        );
        return svg(tableView, t, s.join(""));
    },
};

// Which live queries a RELATE notifies
const liveRelation: Figure = {
    name: "live-query-relation",
    width: 2200,
    height: 620,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];
        step(s, t, 340, 300, "RELATE person:a->wrote->person:b", "plain", 560);
        s.push(text(340, 220, "one write, to the wrote table", { size: 24, fill: t.muted }));
        s.push(rect(1140, 100, 900, 150, { fill: t.accentBg, stroke: t.accent }));
        s.push(
            text(1170, 160, "LIVE SELECT * FROM wrote", {
                size: 28,
                fill: t.text,
                weight: 700,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(1170, 206, "notified: action CREATE, with the edge's in and out", {
                size: 24,
                fill: t.accent,
                weight: 600,
                anchor: "start",
            }),
        );
        s.push(rect(1140, 350, 900, 150, { fill: t.panel }));
        s.push(
            text(1170, 410, "LIVE SELECT * FROM person", {
                size: 28,
                fill: t.text,
                weight: 700,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(1170, 456, "not notified: no person record changed", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(arrow(630, 280, 1130, 180, t.accent, 5));
        s.push(arrow(630, 320, 1130, 425, t.line, 3, "10 8"));
        s.push(
            text(
                80,
                580,
                "A notification is sent only after the transaction commits, so a cancelled transaction notifies nobody.",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        return svg(liveRelation, t, s.join(""));
    },
};

// The changefeed of the reading table, read back from a versionstamp
const changefeed: Figure = {
    name: "changefeed-log",
    width: 2400,
    height: 760,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent])];
        s.push(
            text(80, 70, "DEFINE TABLE reading CHANGEFEED 3d", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
                font: MONO,
            }),
        );
        const entries: [string, string, string][] = [
            ["…313095680", "define_table", "the table is defined"],
            ["…313161216", "update", "story: ['Once upon a time']"],
            ["…313161217", "update", "story: [..., 'there was a database']"],
        ];
        // Older changes have already passed out of the retention window
        s.push(rect(80, 180, 420, 200, { fill: t.panel, r: 16, opacity: 0.6 }));
        s.push(text(290, 252, "older than 3 days:", { size: 24, fill: t.muted }));
        s.push(text(290, 288, "deleted by a", { size: 24, fill: t.muted }));
        s.push(text(290, 324, "periodic clean-up", { size: 24, fill: t.muted }));
        entries.forEach(([vs, kind, detail], i) => {
            const x = 560 + i * 560;
            s.push(rect(x, 180, 520, 200, { fill: t.card, r: 16 }));
            s.push(
                text(x + 30, 236, `versionstamp ${vs}`, {
                    size: 22,
                    fill: t.muted,
                    anchor: "start",
                    font: MONO,
                }),
            );
            s.push(
                text(x + 30, 290, kind, {
                    size: 30,
                    fill: t.text,
                    weight: 700,
                    anchor: "start",
                    font: MONO,
                }),
            );
            s.push(
                text(x + 30, 336, detail, { size: 20, fill: t.muted, anchor: "start", font: MONO }),
            );
        });
        s.push(
            `<rect x="540" y="160" width="1680" height="240" rx="22" fill="none" stroke="${t.accent}" stroke-width="3" stroke-dasharray="12 8"/>`,
        );
        s.push(
            text(2220, 150, "kept for 3 days", {
                size: 24,
                fill: t.accent,
                weight: 600,
                anchor: "end",
            }),
        );
        s.push(arrow(560, 520, 2220, 520, t.accent, 5));
        s.push(
            text(560, 490, "SHOW CHANGES FOR TABLE reading SINCE 1 LIMIT 10", {
                size: 26,
                fill: t.accent,
                weight: 600,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(
                80,
                620,
                "SINCE takes a versionstamp or a datetime, and the read returns the changes from that point on, oldest first, up to LIMIT.",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        s.push(
            text(
                80,
                664,
                "With INCLUDE ORIGINAL, each update is stored as a reverse diff that leads back to the value before the change.",
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(changefeed, t, s.join(""));
    },
};

// A sequence advances in a cancelled transaction; a counter field rolls back
const sequenceGap: Figure = {
    name: "sequence-gap",
    width: 2300,
    height: 640,
    draw(t: Theme) {
        const s: string[] = [];
        s.push(rect(820, 80, 760, 420, { fill: t.redBg, r: 20, opacity: 0.6 }));
        s.push(
            text(1200, 120, "BEGIN … CANCEL TRANSACTION", {
                size: 24,
                fill: t.red,
                weight: 700,
                font: MONO,
            }),
        );
        lane(s, t, 240, "sequence::nextval('seq')", 520, 2240);
        lane(s, t, 400, "my:counter.val", 520, 2240);
        step(s, t, 660, 240, "0", "accent", 120);
        step(s, t, 1200, 240, "1, used up", "bad", 220);
        step(s, t, 1880, 240, "2", "accent", 120);
        step(s, t, 660, 400, "0", "plain", 120);
        step(s, t, 1200, 400, "1, rolled back", "bad", 260);
        step(s, t, 1880, 400, "1", "plain", 120);
        s.push(
            text(
                80,
                580,
                "The cancelled transaction's sequence value is never handed out again, so 1 is a gap. The counter rolls back with the transaction.",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        return svg(sequenceGap, t, s.join(""));
    },
};

// The hourly energy readings on time-buckets-and-windowing
const timeBuckets: Figure = {
    name: "time-buckets",
    width: 2200,
    height: 620,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent])];

        const X = (h: number, m: number) => 200 + (((h - 9) * 60 + m) / 120) * 1800;
        for (const [h, label] of [
            [9, "09:00"],
            [10, "10:00"],
            [11, "11:00"],
        ] as [number, string][]) {
            s.push(line(X(h, 0), 140, X(h, 0), 470, t.grid, 2));
            s.push(text(X(h, 0), 120, label, { size: 26, fill: t.muted, font: MONO }));
        }
        const readings: [number, number, string][] = [
            [9, 15, "09:15"],
            [9, 42, "09:42"],
            [10, 5, "10:05"],
        ];
        for (const [h, m, label] of readings) {
            s.push(circle(X(h, m), 220, 16, t.text));
            s.push(text(X(h, m), 186, label, { size: 24, fill: t.text, weight: 600, font: MONO }));
            s.push(arrow(X(h, m), 240, X(h, 0) + 30, 360, t.accent, 3));
        }
        s.push(
            rect(X(9, 0), 370, X(10, 0) - X(9, 0) - 10, 90, {
                fill: t.accentBg,
                stroke: t.accent,
                r: 12,
            }),
        );
        s.push(
            text(X(9, 30), 426, "hour_bucket 09:00, count 2", {
                size: 26,
                fill: t.text,
                weight: 600,
                font: MONO,
            }),
        );
        s.push(
            rect(X(10, 0) + 10, 370, X(11, 0) - X(10, 0) - 10, 90, {
                fill: t.accentBg,
                stroke: t.accent,
                r: 12,
            }),
        );
        s.push(
            text(X(10, 30), 426, "hour_bucket 10:00, count 1", {
                size: 26,
                fill: t.text,
                weight: 600,
                font: MONO,
            }),
        );
        s.push(
            text(
                200,
                560,
                "time::floor(ts, 1h) moves each reading back to the start of its hour, and GROUP BY counts each bucket.",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        return svg(timeBuckets, t, s.join(""));
    },
};

export default [
    writeSkew,
    timeRounding,
    eventTiming,
    maxDepth,
    tableView,
    liveRelation,
    changefeed,
    sequenceGap,
    timeBuckets,
];
