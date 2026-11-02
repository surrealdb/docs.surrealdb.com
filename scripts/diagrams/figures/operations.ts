// Storage and operations figures: the SurrealKV write and read paths, SurrealMX
// durability, Cloud backups and permissions, capability precedence, the RocksDB
// conversion, the audit log pipeline, the CLI credential lock, background
// removal, MCP transports, tenancy levels, the instance lifecycle and the
// addresses a React Native app connects to. Each one was checked against the
// source it draws (SurrealKV, SurrealMX, surrealdb, enterprise, cloud-api and
// the cloud CLI) or run on a SurrealDB 4.0 server.

import {
    arrow,
    circle,
    type Figure,
    line,
    MONO,
    markers,
    path,
    rect,
    svg,
    type Theme,
    text,
} from "../lib";

type Kind = "plain" | "accent" | "bad" | "good" | "muted" | "panel";

const fillOf = (t: Theme, k: Kind) =>
    k === "accent"
        ? t.accentBg
        : k === "bad"
          ? t.redBg
          : k === "good"
            ? t.greenBg
            : k === "muted" || k === "panel"
              ? t.panel
              : t.card;

const strokeOf = (t: Theme, k: Kind) =>
    k === "accent" ? t.accent : k === "bad" ? t.red : k === "good" ? t.green : undefined;

// A box with a bold title and an optional muted line under it, both centred
function box(
    s: string[],
    t: Theme,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    o: {
        sub?: string;
        sub2?: string;
        kind?: Kind;
        mono?: boolean;
        size?: number;
        dash?: string;
    } = {},
) {
    const { sub, sub2, kind = "plain", mono = false, size = 28, dash } = o;
    s.push(rect(x, y, w, h, { fill: fillOf(t, kind), stroke: strokeOf(t, kind), r: 14, dash }));
    const lines = 1 + (sub ? 1 : 0) + (sub2 ? 1 : 0);
    const block = size + (lines - 1) * 34;
    let ty = y + h / 2 - block / 2 + size * 0.8;
    s.push(
        text(x + w / 2, ty, title, {
            size,
            fill: kind === "muted" ? t.muted : t.text,
            weight: 700,
            font: mono ? MONO : undefined,
        }),
    );
    for (const l of [sub, sub2]) {
        if (!l) continue;
        ty += 34;
        s.push(text(x + w / 2, ty, l, { size: 22, fill: t.muted }));
    }
}

// A numbered circle
function badge(s: string[], t: Theme, x: number, y: number, n: string, colour: string) {
    s.push(circle(x, y, 22, colour));
    s.push(text(x, y + 9, n, { size: 26, fill: t.bg, weight: 800 }));
}

// Left-aligned text
function say(
    s: string[],
    t: Theme,
    x: number,
    y: number,
    str: string,
    o: {
        size?: number;
        colour?: string;
        weight?: number;
        mono?: boolean;
        anchor?: "start" | "middle" | "end";
        halo?: boolean;
    } = {},
) {
    s.push(
        text(x, y, str, {
            size: o.size ?? 26,
            fill: o.colour ?? t.text,
            weight: o.weight ?? 500,
            anchor: o.anchor ?? "start",
            font: o.mono ? MONO : undefined,
            halo: o.halo ? t.bg : undefined,
        }),
    );
}

// ---------------------------------------------------------------------------
// 1. SurrealKV: the write path, compaction, and a point lookup
// ---------------------------------------------------------------------------

const surrealkvPaths: Figure = {
    name: "ops-surrealkv-paths",
    width: 2400,
    height: 1460,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.green, t.line])];
        // Panels
        s.push(rect(40, 120, 760, 1200, { fill: t.panel, r: 24 }));
        s.push(rect(840, 120, 1520, 1200, { fill: t.panel, r: 24 }));
        say(s, t, 60, 96, "Memory", { size: 32, weight: 700 });
        say(s, t, 860, 96, "Disk", { size: 32, weight: 700 });

        // Write path
        box(s, t, 90, 160, 660, 230, "commit", {
            sub: "a transaction's writes, in one group",
            sub2: "with other commits",
            kind: "accent",
        });
        const VX = 2060;
        box(s, t, VX, 160, 260, 1120, "", { kind: "plain" });
        say(s, t, VX + 130, 210, "value log", { size: 28, weight: 700, anchor: "middle" });
        say(s, t, VX + 130, 244, "large values", { size: 22, colour: t.muted, anchor: "middle" });
        for (let i = 0; i < 6; i++)
            s.push(rect(VX + 30, 280 + i * 160, 200, 130, { fill: t.panel, r: 10 }));
        // 1: large values to the value log
        s.push(arrow(750, 190, VX - 8, 190, t.accent, 5));
        badge(s, t, 830, 190, "1", t.accent);
        say(s, t, 870, 176, "values over 4 KiB are appended to the value log", {
            size: 24,
            colour: t.accent,
            weight: 600,
            halo: true,
        });
        // 2: the record, with a pointer in place of a large value, to the WAL
        box(s, t, 880, 230, 1140, 120, "write-ahead log", {
            sub: "every record, with a pointer in place of a large value",
            sub2: "synced before the commit returns, with the default sync=every",
        });
        s.push(arrow(750, 300, 872, 300, t.accent, 5));
        badge(s, t, 810, 300, "2", t.accent);
        // 3: the memtable
        box(s, t, 90, 470, 660, 130, "active memtable", { sub: "every write, sorted by key" });
        s.push(arrow(420, 390, 420, 462, t.accent, 5));
        badge(s, t, 380, 428, "3", t.accent);
        // 4: full memtable becomes immutable
        s.push(rect(110, 700, 660, 130, { fill: t.card, r: 14 }));
        box(s, t, 90, 680, 660, 130, "immutable memtables", { sub: "full, waiting to be flushed" });
        s.push(arrow(420, 600, 420, 672, t.accent, 5));
        badge(s, t, 380, 638, "4", t.accent);
        say(s, t, 460, 646, "full", { size: 24, colour: t.accent, weight: 600 });

        // Levels
        const LX0 = 1010;
        const LX1 = 1790;
        const rows = [400, 540, 680, 820, 960, 1100];
        const RH = 110;
        const K = 1520; // the key being looked up
        rows.forEach((y, i) => {
            say(s, t, 880, y + 50, `L${i}`, { size: 30, weight: 700, mono: true });
            s.push(rect(LX0, y, LX1 - LX0, RH, { fill: t.bg, r: 10 }));
        });
        say(s, t, 880, rows[0] + 84, "overlap", { size: 20, colour: t.muted });
        say(s, t, 880, rows[1] + 84, "no overlap", { size: 20, colour: t.muted });

        // 5: flush to a new L0 table
        s.push(arrow(750, 745, 872, rows[0] + 70, t.accent, 5));
        badge(s, t, 800, 690, "5", t.accent);
        say(s, t, 90, 885, "5: full memtables are flushed to a new L0 table", {
            size: 24,
            colour: t.accent,
            weight: 600,
        });

        // L0: three overlapping tables, newest at the top
        const l0: [number, number][] = [
            [1060, 1400],
            [1300, 1740],
            [1140, 1620],
        ];
        l0.forEach(([a, b], j) => {
            const y = rows[0] + 10 + j * 32;
            const hit = a <= K && K <= b;
            s.push(
                rect(a, y, b - a, 26, { fill: t.card, stroke: hit ? t.green : undefined, r: 6 }),
            );
        });
        // L1 to L5: non-overlapping tables, more of them at each level
        const found = 2;
        for (let i = 1; i < rows.length; i++) {
            const n = [0, 4, 7, 11, 16, 22][i];
            const w = (LX1 - LX0 - 20) / n;
            for (let j = 0; j < n; j++) {
                const a = LX0 + 10 + j * w;
                const hit = a <= K && K < a + w;
                const visited = i <= found;
                const kind: Kind = hit && i === found ? "good" : "plain";
                s.push(
                    rect(a + 3, rows[i] + 14, w - 6, RH - 28, {
                        fill: hit && visited ? fillOf(t, kind) : t.card,
                        stroke: hit && visited ? t.green : undefined,
                        r: 6,
                        opacity: i > found ? 0.5 : undefined,
                    }),
                );
            }
        }
        // The key line and the read steps on it
        s.push(line(K, rows[0] - 14, K, rows[found] + RH + 4, t.green, 4, "10 8"));
        say(s, t, K, rows[0] - 22, "key", {
            size: 24,
            colour: t.green,
            weight: 700,
            anchor: "middle",
            mono: true,
        });
        // Notes beside the levels the lookup reaches
        say(s, t, 1805, rows[0] + 66, "range holds the key", {
            size: 20,
            colour: t.green,
            weight: 600,
            halo: true,
        });
        say(s, t, 1805, rows[1] + 66, "bloom filter: absent", {
            size: 20,
            colour: t.green,
            weight: 600,
            halo: true,
        });
        say(s, t, 1805, rows[2] + 40, "found", {
            size: 20,
            colour: t.green,
            weight: 700,
            halo: true,
        });
        say(s, t, 1805, rows[4] + 66, "not read", { size: 20, colour: t.muted, halo: true });
        // 5 on the read path: the value is a pointer into the value log
        s.push(arrow(LX1 - 2, rows[found] + 55, VX - 8, rows[found] + 55, t.green, 5));
        // Compaction arrows in the label column
        for (let i = 0; i < rows.length - 1; i++)
            s.push(arrow(975, rows[i] + RH - 6, 975, rows[i + 1] + 8, t.line, 3, "8 6"));

        // Read steps, listed in the memory panel
        const steps = [
            "active memtable",
            "immutable memtables, newest first",
            "each L0 table whose key range holds",
            "the key, newest first",
            "L1 to L5: the one table per level",
            "whose range holds the key; a bloom",
            "filter skips it if the key is absent",
            "the first version found answers; a",
            "pointer is read from the value log",
        ];
        say(s, t, 90, 950, "Point lookup, in this order", { size: 28, weight: 700 });
        const nums = ["1", "2", "3", "", "4", "", "", "5", ""];
        steps.forEach((l, i) => {
            const y = 1010 + i * 36;
            if (nums[i]) badge(s, t, 110, y - 8, nums[i], t.green);
            say(s, t, 150, y, l, { size: 24 });
        });
        // Read badges on the memtables
        badge(s, t, 712, 535, "1", t.green);
        badge(s, t, 712, 745, "2", t.green);
        badge(s, t, K + 40, rows[0] + 26, "3", t.green);
        badge(s, t, K + 40, rows[1] + 30, "4", t.green);
        badge(s, t, (LX1 + VX) / 2, rows[found] + 22, "5", t.green);

        say(
            s,
            t,
            40,
            1380,
            "Write path in purple, a point lookup in green. Dashed arrows are compaction: L0 merges into L1 once it holds 4 tables, and each deeper level is about 10 times larger than the one above.",
            { size: 24, colour: t.muted },
        );
        say(
            s,
            t,
            40,
            1420,
            "A commit too large for a memtable is written straight to its own L0 table. Settings are SurrealDB's defaults for SurrealKV.",
            { size: 24, colour: t.muted },
        );
        return svg(surrealkvPaths, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 2. SurrealMX: which commits each durability setting loses in a crash
// ---------------------------------------------------------------------------

// Ten commits before the crash. `lost` counts the newest commits lost; the
// marks are where a snapshot was taken or the log was last synced.
type Loss = { lost: number; note: string };
type MxRow = {
    label: string;
    params: string;
    proc: Loss;
    sys: Loss;
    perf: string;
    mark?: { at: number; label: string };
};

const MX_ROWS: MxRow[] = [
    {
        label: "No persistence",
        params: "mem://",
        proc: { lost: 10, note: "everything" },
        sys: { lost: 10, note: "everything" },
        perf: "fastest",
    },
    {
        label: "Snapshot only",
        params: "snapshot=60s",
        proc: { lost: 4, note: "since the last snapshot" },
        sys: { lost: 4, note: "since the last snapshot" },
        perf: "fastest",
        mark: { at: 6, label: "snapshot" },
    },
    {
        label: "Async AOL, sync=never",
        params: "aol=async",
        proc: { lost: 2, note: "still queued" },
        sys: { lost: 5, note: "queued, and in OS buffers" },
        perf: "very fast",
    },
    {
        label: "Async AOL, sync=5s",
        params: "aol=async&sync=5s",
        proc: { lost: 2, note: "still queued" },
        sys: { lost: 4, note: "since the last fsync" },
        perf: "very fast",
        mark: { at: 6, label: "fsync" },
    },
    {
        label: "Async AOL, sync=every",
        params: "aol=async&sync=every",
        proc: { lost: 2, note: "still queued" },
        sys: { lost: 2, note: "still queued" },
        perf: "very fast",
    },
    {
        label: "Sync AOL, sync=never",
        params: "aol=sync",
        proc: { lost: 0, note: "nothing" },
        sys: { lost: 3, note: "in OS buffers" },
        perf: "fast",
    },
    {
        label: "Sync AOL, sync=5s",
        params: "aol=sync&sync=5s",
        proc: { lost: 0, note: "nothing" },
        sys: { lost: 4, note: "since the last fsync" },
        perf: "fast",
        mark: { at: 6, label: "fsync" },
    },
    {
        label: "Sync AOL, sync=every",
        params: "aol=sync&sync=every",
        proc: { lost: 0, note: "nothing" },
        sys: { lost: 0, note: "nothing" },
        perf: "slow",
    },
];

const mxDurability: Figure = {
    name: "ops-surrealmx-durability",
    width: 2400,
    height: 1300,
    draw(t: Theme) {
        const s: string[] = [];
        const RY = 190;
        const RH = 122;
        const cols = [
            { x: 760, title: "Process crash" },
            { x: 1440, title: "System crash or power loss" },
        ];
        for (const c of cols) say(s, t, c.x, 110, c.title, { size: 30, weight: 700 });
        say(s, t, 2140, 110, "Speed", { size: 30, weight: 700 });
        say(s, t, 760, 150, "oldest commit", { size: 22, colour: t.muted });
        say(s, t, 1340, 150, "crash", { size: 22, colour: t.red, weight: 700, anchor: "end" });
        MX_ROWS.forEach((r, i) => {
            const y = RY + i * RH;
            if (i % 2 === 0) s.push(rect(40, y - 8, 2320, RH - 6, { fill: t.panel, r: 14 }));
            say(s, t, 70, y + 44, r.label, { size: 28, weight: 700 });
            say(s, t, 70, y + 82, r.params, { size: 22, colour: t.muted, mono: true });
            [r.proc, r.sys].forEach((loss, k) => {
                const x0 = cols[k].x + 20;
                for (let d = 0; d < 10; d++) {
                    const lost = d >= 10 - loss.lost;
                    s.push(circle(x0 + d * 52, y + 34, 15, lost ? t.red : t.green));
                }
                if (r.mark && (k === 1 || r.mark.label === "snapshot")) {
                    const mx = x0 + (r.mark.at - 0.5) * 52;
                    s.push(line(mx, y + 6, mx, y + 62, t.text, 4));
                    say(s, t, mx, y + 0, r.mark.label, {
                        size: 18,
                        colour: t.muted,
                        anchor: "middle",
                    });
                }
                s.push(line(x0 + 10 * 52 - 10, y + 8, x0 + 10 * 52 - 10, y + 60, t.red, 5));
                say(
                    s,
                    t,
                    x0 - 15,
                    y + 92,
                    loss.lost === 0 ? "nothing lost" : `lost: ${loss.note}`,
                    {
                        size: 22,
                        colour: loss.lost === 0 ? t.green : t.red,
                        weight: 600,
                    },
                );
            });
            say(s, t, 2140, y + 44, r.perf, { size: 26 });
        });
        const y = RY + MX_ROWS.length * RH + 30;
        s.push(circle(80, y - 8, 14, t.green));
        say(s, t, 104, y, "survives", { size: 24 });
        s.push(circle(260, y - 8, 14, t.red));
        say(s, t, 284, y, "lost", { size: 24 });
        say(
            s,
            t,
            400,
            y,
            "Ten commits before a crash. How many are still queued or in OS buffers depends on the load; the counts here are an example.",
            { size: 24, colour: t.muted },
        );
        say(
            s,
            t,
            40,
            y + 44,
            "With an async AOL a commit returns before its log entry is written, so a process crash loses the commits still in the queue. sync=every syncs each write to the log.",
            { size: 24, colour: t.muted },
        );
        return svg(mxDurability, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 3. Backups: tiered retention, and a restore into a new instance
// ---------------------------------------------------------------------------

const DAYMS = 86_400_000;
const backupRetention: Figure = {
    name: "ops-backup-retention",
    width: 2400,
    height: 830,
    draw(t: Theme) {
        const s: string[] = [];
        // Example policy: 7 days, 4 weeks, 3 months. A snapshot taken at 02:00 UTC each day.
        const now = Date.UTC(2026, 10, 2, 12);
        const days = 105;
        const first = Date.UTC(2026, 10, 2, 2) - (days - 1) * DAYMS;
        const X0 = 520;
        const X1 = 2320;
        const step = (X1 - X0) / (days - 1);
        const X = (i: number) => X0 + i * step;
        const addMonths = (ms: number, n: number) => {
            const d = new Date(ms);
            return Date.UTC(
                d.getUTCFullYear(),
                d.getUTCMonth() + n,
                d.getUTCDate(),
                d.getUTCHours(),
            );
        };
        const tiers = [
            {
                name: "Daily",
                sub: "every day, kept 7 days",
                is: (_d: Date) => true,
                until: (ms: number) => ms + 7 * DAYMS,
            },
            {
                name: "Weekly",
                sub: "Sundays, kept 4 weeks",
                is: (d: Date) => d.getUTCDay() === 0,
                until: (ms: number) => ms + 28 * DAYMS,
            },
            {
                name: "Monthly",
                sub: "the 1st, kept 3 months",
                is: (d: Date) => d.getUTCDate() === 1,
                until: (ms: number) => addMonths(ms, 3),
            },
        ];
        // Month labels
        for (let i = 0; i < days; i++) {
            const d = new Date(first + i * DAYMS);
            if (d.getUTCDate() === 1 && i < days - 6) {
                s.push(line(X(i), 120, X(i), 640, t.grid, 2, "6 6"));
                say(s, t, X(i) + 8, 110, d.toISOString().slice(0, 10), {
                    size: 22,
                    colour: t.muted,
                    mono: true,
                });
            }
        }
        const kept = new Array(days).fill(false);
        tiers.forEach((tier, k) => {
            const y = 200 + k * 130;
            say(s, t, 60, y + 4, tier.name, { size: 30, weight: 700 });
            say(s, t, 60, y + 40, tier.sub, { size: 22, colour: t.muted });
            for (let i = 0; i < days; i++) {
                const ms = first + i * DAYMS;
                const d = new Date(ms);
                if (!tier.is(d)) continue;
                const keep = now < tier.until(ms);
                if (keep) kept[i] = true;
                s.push(circle(X(i), y, keep ? 9 : 6, keep ? t.accent : t.grid));
            }
        });
        const yk = 200 + 3 * 130 + 40;
        s.push(line(X0 - 20, yk - 70, X1 + 10, yk - 70, t.line, 2));
        say(s, t, 60, yk + 4, "Kept", { size: 30, weight: 700 });
        say(s, t, 60, yk + 40, "in at least one tier", { size: 22, colour: t.muted });
        let count = 0;
        for (let i = 0; i < days; i++) {
            if (!kept[i]) continue;
            count++;
            s.push(circle(X(i), yk, 11, t.green));
        }
        say(s, t, X1, 110, "today, 2026-11-02", {
            size: 22,
            colour: t.text,
            weight: 700,
            anchor: "end",
        });
        say(
            s,
            t,
            60,
            yk + 120,
            `With 7 daily, 4 weekly and 3 monthly snapshots, ${count} snapshots are kept on ${new Date(now).toISOString().slice(0, 10)}. A snapshot taken on a Sunday or on the 1st belongs to every tier its UTC date matches,`,
            { size: 24, colour: t.muted },
        );
        say(
            s,
            t,
            60,
            yk + 158,
            "and it is deleted only once no tier keeps it. The retention numbers are an example; each is a setting of the instance.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        return svg(backupRetention, t, s.join(""));
    },
};

const backupRestore: Figure = {
    name: "ops-backup-restore",
    width: 2400,
    height: 800,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line, t.text])];
        // The source instance's timeline
        const Y = 220;
        say(s, t, 60, Y - 2, "api-production", { size: 30, weight: 700, mono: true });
        say(s, t, 60, Y + 36, "source instance", { size: 22, colour: t.muted });
        s.push(arrow(520, Y, 2320, Y, t.line, 4));
        const snaps = [620, 820, 1020, 1220, 1420];
        const chosen = 3;
        snaps.forEach((x, i) => {
            s.push(
                rect(x - 22, Y - 22, 44, 44, {
                    fill: i === chosen ? t.accent : t.card,
                    stroke: i === chosen ? undefined : t.line,
                    r: 8,
                }),
            );
        });
        say(s, t, snaps[0] - 22, Y - 44, "snapshots", { size: 22, colour: t.muted });
        say(s, t, snaps[chosen], Y + 70, "chosen snapshot", {
            size: 24,
            colour: t.accent,
            weight: 700,
            anchor: "middle",
        });
        say(s, t, 1900, Y - 30, "keeps running, unchanged", {
            size: 24,
            colour: t.text,
            anchor: "middle",
        });
        // The fork
        const Y2 = 520;
        s.push(
            path(
                `M ${snaps[chosen]} ${Y + 90} C ${snaps[chosen]} ${Y2 - 40}, ${snaps[chosen] + 40} ${Y2}, ${snaps[chosen] + 200} ${Y2}`,
                { stroke: t.accent, strokeWidth: 5 },
            ),
        );
        s.push(arrow(snaps[chosen] + 200, Y2, 2320, Y2, t.accent, 5));
        say(s, t, 60, Y2 - 2, "api-restored", {
            size: 30,
            weight: 700,
            mono: true,
            colour: t.accent,
        });
        say(s, t, 60, Y2 + 36, "new instance, new endpoint", { size: 22, colour: t.muted });
        box(s, t, 1520, Y2 - 150, 520, 110, "Create from selected", {
            sub: "opens the deploy flow",
            kind: "accent",
        });
        say(s, t, 1520, Y2 + 70, "same region, storage at least the source's size,", {
            size: 24,
            colour: t.text,
        });
        say(s, t, 1520, Y2 + 104, "a SurrealDB version the snapshot is compatible with", {
            size: 24,
            colour: t.text,
        });
        say(
            s,
            t,
            60,
            720,
            "A restore never writes into an existing instance. Check the data on the new one, then point the application at its endpoint.",
            { size: 24, colour: t.muted },
        );
        return svg(backupRestore, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 4. Account structure: two layers of permissions that do not cross
// ---------------------------------------------------------------------------

const twoLayers: Figure = {
    name: "ops-two-permission-layers",
    width: 2400,
    height: 1120,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.accent])];
        const L = 60;
        const R = 1260;
        const PW = 1080;
        s.push(rect(L, 60, PW, 900, { fill: t.panel, r: 24 }));
        s.push(rect(R, 60, PW, 900, { fill: t.panel, r: 24 }));
        say(s, t, L + 40, 120, "Administration", { size: 36, weight: 700 });
        say(s, t, L + 40, 160, "who runs the account in Studio", { size: 24, colour: t.muted });
        say(s, t, R + 40, 120, "Data access", { size: 36, weight: 700 });
        say(s, t, R + 40, 160, "who reads and changes data inside an instance", {
            size: 24,
            colour: t.muted,
        });

        const roleBox = (
            x: number,
            y: number,
            w: number,
            title: string,
            roles: string,
            what: string,
            kind: Kind = "plain",
        ) => {
            s.push(rect(x, y, w, 190, { fill: fillOf(t, kind), stroke: strokeOf(t, kind), r: 16 }));
            say(s, t, x + 30, y + 52, title, { size: 30, weight: 700 });
            say(s, t, x + 30, y + 98, roles, { size: 24, mono: true });
            say(s, t, x + 30, y + 146, what, { size: 22, colour: t.muted });
        };
        // Administration
        roleBox(
            L + 40,
            210,
            PW - 80,
            "Enterprise (optional)",
            "owner, custom roles",
            "single sign-on, verified domains, members",
        );
        roleBox(
            L + 40,
            460,
            PW - 80,
            "Organisation",
            "Owner, Admin, Member",
            "deploy, pause and delete instances, members, billing",
        );
        s.push(arrow(L + PW / 2, 400, L + PW / 2, 452, t.line, 4));
        say(s, t, L + PW / 2 + 20, 434, "custom roles grant nothing here yet", {
            size: 22,
            colour: t.muted,
        });
        s.push(
            rect(L + 40, 710, PW - 80, 190, { fill: t.bg, r: 16, stroke: t.line, dash: "10 8" }),
        );
        say(s, t, L + 70, 770, "Instances, as things to manage", { size: 28, weight: 700 });
        say(s, t, L + 70, 816, "size, region, version, backups, capabilities", {
            size: 22,
            colour: t.muted,
        });
        s.push(arrow(L + PW / 2, 650, L + PW / 2, 702, t.line, 4));

        // Data access
        roleBox(
            R + 40,
            210,
            PW - 80,
            "Root users",
            "DEFINE USER ... ON ROOT",
            "the whole instance",
            "accent",
        );
        roleBox(
            R + 40,
            460,
            PW - 80,
            "Namespace users",
            "DEFINE USER ... ON NAMESPACE",
            "every database in the namespace",
            "accent",
        );
        roleBox(
            R + 40,
            710,
            PW - 80,
            "Database users and access methods",
            "DEFINE USER / DEFINE ACCESS",
            "one database; applications sign in here",
            "accent",
        );
        s.push(arrow(R + PW / 2, 400, R + PW / 2, 452, t.accent, 4));
        s.push(arrow(R + PW / 2, 650, R + PW / 2, 702, t.accent, 4));
        say(s, t, R + PW - 60, 290, "Owner, Editor, Viewer", {
            size: 22,
            colour: t.muted,
            anchor: "end",
        });
        say(s, t, R + PW - 60, 540, "Owner, Editor, Viewer", {
            size: 22,
            colour: t.muted,
            anchor: "end",
        });
        say(s, t, R + PW - 60, 790, "Owner, Editor, Viewer", {
            size: 22,
            colour: t.muted,
            anchor: "end",
        });

        // The wall between them
        s.push(line(1200, 90, 1200, 930, t.red, 6, "16 12"));
        for (const y of [330, 580, 830]) {
            s.push(circle(1200, y, 30, t.bg, t.red, 5));
            s.push(line(1180, y - 20, 1220, y + 20, t.red, 5));
        }
        say(
            s,
            t,
            60,
            1020,
            "A role in one layer grants nothing in the other: organisation and enterprise roles manage the account and its instances, and data access is defined inside each instance.",
            { size: 24, colour: t.muted },
        );
        say(
            s,
            t,
            60,
            1060,
            "Single sign-on applies to Studio, the administration layer. Each user inside an instance can create users only at its own level or below.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        return svg(twoLayers, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 5. Capabilities: which functions each set of flags allows, run on 4.0
// ---------------------------------------------------------------------------

const CAP_FUNCS = ["string::len", "math::abs", "crypto::sha256", "crypto::md5"];
const CAP_ROWS: { flags: string; ok: boolean[]; why: string }[] = [
    { flags: "(no flags)", ok: [true, true, true, true], why: "functions are allowed by default" },
    {
        flags: "--allow-all --deny-funcs crypto",
        ok: [true, true, false, false],
        why: "specific deny beats global allow",
    },
    {
        flags: "--deny-funcs --allow-funcs string::len",
        ok: [true, false, false, false],
        why: "specific allow beats general deny",
    },
    {
        flags: "--deny-all --allow-funcs crypto::md5",
        ok: [false, false, false, true],
        why: "specific allow beats global deny",
    },
    {
        flags: "--allow-funcs crypto --deny-funcs crypto::md5",
        ok: [false, false, true, false],
        why: "both specific: deny wins",
    },
    {
        flags: "--deny-funcs crypto --allow-funcs crypto::md5",
        ok: [false, false, false, false],
        why: "both specific: deny wins",
    },
];

const capPrecedence: Figure = {
    name: "ops-capability-precedence",
    width: 2560,
    height: 1100,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent])];
        // Ladder on the left
        say(s, t, 60, 90, "Which rule applies", { size: 32, weight: 700 });
        const steps = [
            {
                y: 150,
                title: "Specific deny",
                sub: "--deny-funcs crypto::md5",
                kind: "bad" as Kind,
            },
            { y: 330, title: "Specific allow", sub: "--allow-funcs crypto", kind: "good" as Kind },
            { y: 510, title: "General", sub: "--deny-funcs, --allow-net", kind: "plain" as Kind },
            { y: 690, title: "Global", sub: "--deny-all, --allow-all", kind: "plain" as Kind },
        ];
        for (const st of steps) {
            s.push(
                rect(60, st.y, 560, 140, {
                    fill: fillOf(t, st.kind),
                    stroke: strokeOf(t, st.kind),
                    r: 16,
                }),
            );
            say(s, t, 90, st.y + 58, st.title, { size: 30, weight: 700 });
            say(s, t, 90, st.y + 104, st.sub, { size: 22, mono: true, colour: t.muted });
        }
        s.push(arrow(680, 820, 680, 170, t.accent, 5));
        say(s, t, 710, 500, "wins", { size: 26, colour: t.accent, weight: 700 });
        say(s, t, 60, 880, "A family name and a function name", { size: 22, colour: t.muted });
        say(s, t, 60, 912, "are both specific.", { size: 22, colour: t.muted });

        // Grid on the right
        const GX = 860;
        const FW = 220;
        const FX = GX + 760;
        say(s, t, GX, 90, "Flags on surreal db start", { size: 28, weight: 700 });
        CAP_FUNCS.forEach((f, j) => {
            say(s, t, FX + j * FW + FW / 2, 90, f, {
                size: 22,
                mono: true,
                anchor: "middle",
                weight: 600,
            });
        });
        CAP_ROWS.forEach((r, i) => {
            const y = 140 + i * 130;
            if (i % 2 === 0) s.push(rect(GX - 20, y, 1660, 116, { fill: t.panel, r: 14 }));
            say(s, t, GX, y + 50, r.flags, { size: 23, mono: true, weight: 600 });
            say(s, t, GX, y + 88, r.why, { size: 22, colour: t.muted });
            r.ok.forEach((ok, j) => {
                const cx = FX + j * FW + FW / 2;
                s.push(
                    rect(cx - 80, y + 26, 160, 64, {
                        fill: ok ? t.greenBg : t.redBg,
                        stroke: ok ? t.green : t.red,
                        r: 12,
                    }),
                );
                say(s, t, cx, y + 68, ok ? "allowed" : "denied", {
                    size: 22,
                    weight: 700,
                    colour: ok ? t.green : t.red,
                    anchor: "middle",
                });
            });
        });
        say(
            s,
            t,
            60,
            1010,
            "Each row was run on SurrealDB 4.0. Naming functions in --allow-funcs replaces the default of allowing all of them, so math::abs is denied wherever an allow list does not name it.",
            { size: 24, colour: t.muted },
        );
        say(
            s,
            t,
            60,
            1050,
            "A specific deny wins over any allow, even one that names a narrower target, as in the last row.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        return svg(capPrecedence, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 6. Converting a RocksDB directory to SurrealKV when it is first opened
// ---------------------------------------------------------------------------

const rocksConversion: Figure = {
    name: "ops-rocksdb-conversion",
    width: 2400,
    height: 1260,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.accent])];
        const CW = 540;
        const cols = [60, 640, 1220, 1800];
        const titles = [
            ["1. Lock and read", "takes RocksDB's LOCK; refused while"],
            ["2. Stage", "builds the new database beside the"],
            ["3. Place", "moves the tables and value log in,"],
            ["4. Finish", "moves the RocksDB files aside and"],
        ];
        const subs = [
            "a RocksDB process holds it",
            "old files, then reads it back to check",
            "then the manifest, in one rename",
            "removes the marker",
        ];
        // Directory listings
        const dirs: { name: string; kind: Kind }[][] = [
            [
                { name: "*.sst  *.blob", kind: "plain" },
                { name: "MANIFEST-*  *.log", kind: "plain" },
            ],
            [
                { name: "*.sst  *.blob", kind: "plain" },
                { name: "MANIFEST-*  *.log", kind: "plain" },
                { name: "MIGRATING_ROCKSDB", kind: "muted" },
                { name: "_rocksdb_migration/", kind: "accent" },
            ],
            [
                { name: "*.sst  *.blob", kind: "plain" },
                { name: "MANIFEST-*  *.log", kind: "plain" },
                { name: "MIGRATING_ROCKSDB", kind: "muted" },
                { name: "sstables/  vlog/", kind: "accent" },
                { name: "manifest/", kind: "good" },
            ],
            [
                { name: "sstables/  vlog/", kind: "accent" },
                { name: "manifest/", kind: "good" },
                { name: "_rocksdb_backup/", kind: "plain" },
            ],
        ];
        cols.forEach((x, i) => {
            say(s, t, x, 80, titles[i][0], { size: 30, weight: 700 });
            say(s, t, x, 118, titles[i][1], { size: 22, colour: t.muted });
            say(s, t, x, 148, subs[i], { size: 22, colour: t.muted });
            s.push(rect(x, 180, CW, 520, { fill: t.panel, r: 18 }));
            say(s, t, x + 24, 226, "data directory", { size: 22, colour: t.muted, mono: true });
            dirs[i].forEach((d, j) => {
                const y = 250 + j * 86;
                s.push(
                    rect(x + 24, y, CW - 48, 68, {
                        fill: fillOf(t, d.kind),
                        stroke: strokeOf(t, d.kind),
                        r: 10,
                    }),
                );
                say(s, t, x + 48, y + 44, d.name, {
                    size: 24,
                    mono: true,
                    colour: d.kind === "muted" ? t.muted : t.text,
                    weight: 600,
                });
            });
            if (i < 3) s.push(arrow(x + CW + 6, 440, x + CW + 34, 440, t.line, 4));
        });
        say(s, t, cols[2] + 48, 690, "the manifest rename is the switch", {
            size: 22,
            colour: t.green,
            weight: 700,
        });

        // Interruption band
        const BY = 770;
        say(s, t, 60, BY, "If it is interrupted, the next open", { size: 26, weight: 700 });
        s.push(rect(60, BY + 30, 1700, 80, { fill: t.redBg, stroke: t.red, r: 14 }));
        say(
            s,
            t,
            90,
            BY + 82,
            "before the manifest is placed: rolls back, deleting the new files; the RocksDB files are untouched",
            { size: 24, colour: t.text },
        );
        s.push(rect(1780, BY + 30, 560, 80, { fill: t.greenBg, stroke: t.green, r: 14 }));
        say(s, t, 1810, BY + 82, "after: rolls forward", { size: 24, colour: t.text });

        // Disk use
        const DY = 950;
        say(s, t, 60, DY, "Disk used", { size: 26, weight: 700 });
        const bar = (x: number, w: number, label: string, kind: Kind) => {
            s.push(
                rect(x, DY + 30, w, 56, {
                    fill: fillOf(t, kind),
                    stroke: strokeOf(t, kind),
                    r: 10,
                }),
            );
            say(s, t, x + 20, DY + 68, label, { size: 22, mono: true });
        };
        bar(60, 520, "RocksDB files", "plain");
        bar(640, 500, "RocksDB files", "plain");
        bar(1150, 480, "new files", "accent");
        say(s, t, 1660, DY + 68, "about twice the data until _rocksdb_backup/ is deleted", {
            size: 24,
            colour: t.muted,
        });

        // Health probes
        s.push(rect(60, 1080, 2280, 64, { fill: t.panel, r: 12, stroke: t.line, dash: "10 8" }));
        say(
            s,
            t,
            90,
            1122,
            "Steps 1 to 4 run while the datastore opens, before the server listens: /health and /ready cannot be reached until they finish.",
            {
                size: 24,
            },
        );
        say(
            s,
            t,
            60,
            1210,
            "A digest of everything read from RocksDB is compared with the staged tables before anything is placed; a mismatch stops the conversion with nothing changed.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        return svg(rocksConversion, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 7. The Enterprise audit log pipeline and where each self-metric counts
// ---------------------------------------------------------------------------

const auditPipeline: Figure = {
    name: "ops-audit-pipeline",
    width: 2400,
    height: 1040,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.red, t.line])];
        const Y = 380;
        const H = 170;
        // Thread bands
        s.push(rect(40, 200, 1180, 420, { fill: t.panel, r: 24 }));
        s.push(rect(1260, 200, 1100, 540, { fill: t.panel, r: 24 }));
        say(s, t, 70, 250, "Executor thread, synchronous", { size: 26, weight: 700 });
        say(s, t, 1290, 250, "Background worker", { size: 26, weight: 700 });

        box(s, t, 80, Y, 300, H, "event", { sub: "statement, auth,", sub2: "session, RPC, HTTP" });
        box(s, t, 450, Y, 330, H, "redaction", {
            sub: "literals, then tables,",
            sub2: "then regexes",
            kind: "accent",
        });
        box(s, t, 850, Y, 330, H, "push", {
            sub: "block: up to 200 retries",
            sub2: "drop: one try",
        });
        box(s, t, 1300, Y, 330, H, "bounded queue", { sub: "QUEUE_CAPACITY" });
        box(s, t, 1700, Y, 260, H, "worker", { sub: "appends NDJSON" });
        box(s, t, 2030, Y, 290, H, "file sink", { sub: "rotation, fsync,", sub2: "hash chain" });
        s.push(arrow(380, Y + H / 2, 442, Y + H / 2, t.accent, 5));
        s.push(arrow(780, Y + H / 2, 842, Y + H / 2, t.accent, 5));
        s.push(arrow(1180, Y + H / 2, 1292, Y + H / 2, t.accent, 5));
        s.push(arrow(1630, Y + H / 2, 1692, Y + H / 2, t.accent, 5));
        s.push(arrow(1960, Y + H / 2, 2022, Y + H / 2, t.accent, 5));

        // Overflow: dropped
        s.push(arrow(1015, Y + H, 1015, 742, t.red, 5));
        box(s, t, 850, 750, 330, 110, "dropped", { sub: "queue full or closed", kind: "bad" });
        // OTel branch: only once the queue took the record
        s.push(arrow(1015, Y, 1015, 158, t.line, 4, "10 8"));
        box(s, t, 705, 40, 620, 110, "OpenTelemetry LogRecord", {
            sub: "only if SURREAL_AUDIT_OTEL_EXPORT=true",
            kind: "plain",
            dash: "10 8",
        });
        say(s, t, 1035, 340, "after the queue accepts it", { size: 22, colour: t.muted });

        // Metrics, placed where each counts
        const metric = (x: number, y: number, name: string, desc: string, colour: string) => {
            say(s, t, x, y, name, { size: 22, mono: true, weight: 700, colour });
            say(s, t, x, y + 32, desc, { size: 22, colour: t.muted });
        };
        metric(1300, Y + H + 60, "surrealdb_audit_records", "accepted by the queue", t.text);
        metric(1300, Y + H + 140, "surrealdb_audit_queue_depth", "waiting in the queue", t.text);
        metric(1700, Y + H + 60, "surrealdb_audit_appended", "written by the worker", t.text);
        metric(1700, Y + H + 140, "surrealdb_audit_append_errors", "failed writes", t.red);
        metric(850, 910, "surrealdb_audit_dropped", "never reached either path", t.red);

        say(
            s,
            t,
            80,
            1000,
            "Redaction runs before the push, so the file sink and OpenTelemetry both receive the redacted text. The default policy is block for audit records.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        return svg(auditPipeline, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 8. surreal cloud: two processes refreshing a rotating refresh token
// ---------------------------------------------------------------------------

function step(
    s: string[],
    t: Theme,
    x: number,
    y: number,
    w: number,
    label: string,
    kind: Kind = "plain",
) {
    s.push(rect(x, y - 34, w, 68, { fill: fillOf(t, kind), stroke: strokeOf(t, kind), r: 12 }));
    say(s, t, x + w / 2, y + 9, label, { size: 22, weight: 600, anchor: "middle" });
}

const cliRefresh: Figure = {
    name: "ops-cli-refresh-lock",
    width: 2400,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        const lanes = (y0: number, title: string) => {
            say(s, t, 60, y0, title, { size: 32, weight: 700 });
            for (const [k, name] of ["process A", "process B"].entries()) {
                const y = y0 + 100 + k * 120;
                say(s, t, 300, y + 9, name, { size: 26, weight: 700, anchor: "end" });
                s.push(line(330, y, 2340, y, t.grid, 3));
            }
            return [y0 + 100, y0 + 220];
        };
        // Without the lock
        let [a, b] = lanes(70, "Without a lock");
        step(s, t, 360, a, 300, "read refresh token R1");
        step(s, t, 420, b, 300, "read refresh token R1");
        step(s, t, 720, a, 380, "refresh with R1: gets R2");
        step(s, t, 1140, a, 260, "write R2", "good");
        step(s, t, 1200, b, 420, "refresh with R1, already used", "bad");
        step(s, t, 1680, b, 640, "the identity provider may revoke the whole family", "bad");
        say(
            s,
            t,
            360,
            b + 90,
            "That signs out both processes, and every other session that uses the same token family.",
            { size: 24, colour: t.red, weight: 600 },
        );
        // With the lock
        [a, b] = lanes(530, "With the lock on credentials.lock");
        step(s, t, 360, a, 200, "take lock", "accent");
        step(s, t, 580, a, 260, "re-read: R1");
        step(s, t, 860, a, 380, "refresh with R1: gets R2");
        step(s, t, 1260, a, 340, "write temp file, rename", "good");
        step(s, t, 1620, a, 200, "release", "accent");
        s.push(rect(420, b - 34, 1380, 68, { fill: t.panel, r: 12, stroke: t.line, dash: "10 8" }));
        say(s, t, 1110, b + 9, "waits for the lock, up to 30 seconds", {
            size: 22,
            colour: t.muted,
            anchor: "middle",
        });
        step(s, t, 1840, b, 200, "take lock", "accent");
        step(s, t, 2060, b, 270, "re-read: R2, fresh", "good");
        say(
            s,
            t,
            360,
            b + 90,
            "B finds A's refresh already done and has nothing to send. A process that only reads takes no lock: the rename means it sees a whole file, old or new.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        return svg(cliRefresh, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 9. 2.7.0: a removed database deleted in the background, run by run
// ---------------------------------------------------------------------------

const bgRemoval: Figure = {
    name: "ops-background-removal",
    width: 2400,
    height: 1000,
    draw(t: Theme) {
        const s: string[] = [];
        const TOTAL = 350_000;
        const X0 = 300;
        const X1 = 2300;
        const Y0 = 780; // zero keys
        const Y1 = 200; // TOTAL keys
        const maxMin = 6;
        const X = (min: number) => X0 + (min / maxMin) * (X1 - X0);
        const Y = (k: number) => Y0 - (k / TOTAL) * (Y0 - Y1);
        // Axes and gridlines
        for (const k of [0, 100_000, 200_000, 300_000]) {
            s.push(line(X0, Y(k), X1, Y(k), t.grid, 2));
            say(s, t, X0 - 20, Y(k) + 8, k.toLocaleString("en-GB"), {
                size: 22,
                colour: t.muted,
                anchor: "end",
                mono: true,
            });
        }
        say(s, t, 60, 100, "Keys of the removed database left on disk", { size: 28, weight: 700 });
        // Runs, every 60 seconds; the first one after the removal finds it
        const first = 0.6;
        const runs = [first, first + 1, first + 2, first + 3, first + 4, first + 5];
        let left = TOTAL;
        const pts: [number, number][] = [[X(0), Y(left)]];
        runs.forEach((r, i) => {
            s.push(line(X(r), Y1 - 20, X(r), Y0, t.line, 2, "6 6"));
            say(s, t, X(r), Y0 + 40, `run ${i + 1}`, {
                size: 22,
                colour: t.muted,
                anchor: "middle",
            });
            pts.push([X(r), Y(left)]);
            if (i > 0) left = Math.max(0, left - 100_000);
            pts.push([X(r), Y(left)]);
        });
        pts.push([X(maxMin), Y(left)]);
        s.push(
            path(`M ${pts.map(([x, y]) => `${x} ${y}`).join(" L ")}`, {
                stroke: t.accent,
                strokeWidth: 6,
            }),
        );
        say(s, t, X(runs[0]) + 14, Y(TOTAL) + 36, "finds the removal", {
            size: 22,
            colour: t.text,
        });
        say(s, t, X(runs[1]) + 14, Y(TOTAL - 100_000) - 16, "100,000 deleted", {
            size: 22,
            colour: t.accent,
            weight: 600,
        });
        // REMOVE
        s.push(circle(X(0), Y(TOTAL), 12, t.accent));
        say(s, t, X(0) + 10, Y(TOTAL) - 24, "REMOVE DATABASE returns at once", {
            size: 22,
            weight: 700,
        });
        // Name reuse threshold
        s.push(line(X0, Y(10_000), X1, Y(10_000), t.green, 3, "12 8"));
        s.push(rect(X0, Y0 + 70, X(runs[4]) - X0, 50, { fill: t.redBg, stroke: t.red, r: 10 }));
        say(
            s,
            t,
            X0 + 20,
            Y0 + 104,
            "DEFINE DATABASE under the same name fails while more than 10,000 keys are left",
            { size: 22, colour: t.text },
        );
        s.push(
            rect(X(runs[4]), Y0 + 70, X1 - X(runs[4]), 50, {
                fill: t.greenBg,
                stroke: t.green,
                r: 10,
            }),
        );
        say(s, t, X(runs[4]) + 16, Y0 + 104, "succeeds", { size: 22, colour: t.text });
        say(s, t, X1, Y(10_000) - 12, "10,000", {
            size: 20,
            colour: t.green,
            anchor: "end",
            mono: true,
        });
        say(
            s,
            t,
            60,
            960,
            "An example database of 350,000 keys, with the default interval of 60 seconds. Each run deletes up to 100,000 keys, in transactions of 1,000; deletion starts on the run after the one that finds the removal.",
            { size: 24, colour: t.muted },
        );
        return svg(bgRemoval, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 10. MCP: stdio with an embedded datastore, or HTTP to /mcp on a server
// ---------------------------------------------------------------------------

const mcpTopologies: Figure = {
    name: "ops-mcp-topologies",
    width: 2400,
    height: 1170,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];
        // stdio
        s.push(rect(40, 40, 1080, 700, { fill: t.panel, r: 24 }));
        say(s, t, 80, 100, "surreal db mcp, over stdio", { size: 32, weight: 700 });
        say(s, t, 80, 140, "one editor, one process, on your machine", {
            size: 22,
            colour: t.muted,
        });
        box(s, t, 80, 200, 400, 140, "editor", { sub: "command and args" });
        s.push(rect(600, 180, 480, 520, { fill: t.bg, r: 18, stroke: t.line }));
        say(s, t, 630, 230, "child process", { size: 22, colour: t.muted });
        box(s, t, 640, 260, 400, 140, "surreal db mcp", {
            mono: true,
            kind: "accent",
            sub: "owner-level session",
        });
        box(s, t, 640, 500, 400, 160, "embedded datastore", {
            sub: "memory by default,",
            sub2: "or a local file path",
        });
        s.push(arrow(480, 270, 632, 300, t.accent, 5));
        say(s, t, 500, 250, "spawns", { size: 22, colour: t.accent, weight: 600 });
        s.push(arrow(480, 320, 632, 340, t.accent, 5));
        say(s, t, 440, 380, "stdin, stdout", { size: 22, colour: t.accent, weight: 600 });
        s.push(arrow(840, 400, 840, 492, t.line, 4));
        say(s, t, 80, 460, "No login step and no network:", { size: 24 });
        say(s, t, 80, 496, "every tool call has owner-level access.", { size: 24 });
        // HTTP
        s.push(rect(1160, 40, 1200, 700, { fill: t.panel, r: 24 }));
        say(s, t, 1200, 100, "surreal db start, HTTP to /mcp", { size: 32, weight: 700 });
        say(s, t, 1200, 140, "the instance other clients already share", {
            size: 22,
            colour: t.muted,
        });
        const clients = ["editor", "application", "Studio, CLI"];
        clients.forEach((c, i) =>
            box(s, t, 1200, 200 + i * 170, 340, 120, c, {
                sub: i === 0 ? "url and auth headers" : undefined,
            }),
        );
        box(s, t, 1800, 200, 520, 300, "surreal db start", {
            mono: true,
            kind: "accent",
            sub: "POST /mcp beside the HTTP API,",
            sub2: "its users and permissions",
        });
        box(s, t, 1800, 560, 520, 140, "datastore", { sub: "SurrealKV or memory" });
        clients.forEach((_c, i) =>
            s.push(
                arrow(
                    1540,
                    260 + i * 170,
                    1792,
                    300 + i * 60,
                    i === 0 ? t.accent : t.line,
                    i === 0 ? 5 : 4,
                ),
            ),
        );
        say(s, t, 1560, 236, "Bearer JWT or Basic", { size: 20, colour: t.accent, weight: 600 });
        s.push(arrow(2060, 500, 2060, 552, t.line, 4));

        // Scope precedence
        say(
            s,
            t,
            60,
            820,
            "Which namespace and database a tool call uses: the first that is set, for each of the two",
            { size: 28, weight: 700 },
        );
        const ladder = [
            "the call's own namespace and database arguments",
            "the surreal-ns and surreal-db request headers",
            "the session's use selection (handshake revisions only)",
            "the server's configured defaults",
        ];
        ladder.forEach((l, i) => {
            const x = 60 + i * 580;
            s.push(
                rect(x, 860, 550, 150, {
                    fill: i === 0 ? t.accentBg : t.card,
                    stroke: i === 0 ? t.accent : undefined,
                    r: 14,
                }),
            );
            badge(s, t, x + 40, 905, String(i + 1), t.accent);
            const words = l.split(" ");
            const mid = Math.ceil(words.length / 2);
            say(s, t, x + 80, 914, words.slice(0, mid).join(" "), { size: 23 });
            say(s, t, x + 80, 950, words.slice(mid).join(" "), { size: 23 });
            if (i < 3) s.push(arrow(x + 552, 935, x + 576, 935, t.line, 3));
        });
        say(
            s,
            t,
            60,
            1080,
            "A call can set only the database and take the namespace from a later step. A scope set on one call does not change the connection, so it does not affect the next call.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        say(
            s,
            t,
            60,
            1120,
            "Under the 2026-07-28 revision there is no session, and the use tool returns an error that points to the per-call arguments.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        return svg(mcpTopologies, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 11. Namespaces and databases: what lives at each level, and three layouts
// ---------------------------------------------------------------------------

const tenancy: Figure = {
    name: "ops-tenancy-levels",
    width: 2400,
    height: 1060,
    draw(t: Theme) {
        const s: string[] = [];
        // Nested levels, from INFO FOR ROOT, NS and DB on 4.0
        const lv = [
            {
                x: 40,
                y: 40,
                w: 1300,
                h: 900,
                title: "Root",
                holds: "namespaces, root users and access methods, nodes",
            },
            {
                x: 90,
                y: 200,
                w: 1200,
                h: 700,
                title: "Namespace",
                holds: "databases, namespace users and access methods",
            },
            {
                x: 140,
                y: 360,
                w: 1100,
                h: 500,
                title: "Database",
                holds: "tables, functions, params, analyzers, sequences,",
            },
            {
                x: 190,
                y: 640,
                w: 1000,
                h: 180,
                title: "Table",
                holds: "records, fields, indexes, events",
            },
        ];
        lv.forEach((l, i) => {
            s.push(
                rect(l.x, l.y, l.w, l.h, {
                    fill: i % 2 === 0 ? t.panel : t.card,
                    stroke: i === 2 ? t.accent : undefined,
                    r: 24,
                }),
            );
            say(s, t, l.x + 40, l.y + 60, l.title, {
                size: 32,
                weight: 700,
                colour: i === 2 ? t.accent : t.text,
            });
            say(s, t, l.x + 40, l.y + 104, l.holds, { size: 24, colour: t.muted });
        });
        say(s, t, 180, 500, "users and access methods, buckets, APIs, models, config", {
            size: 24,
            colour: t.muted,
        });
        say(s, t, 180, 580, "a query runs in one namespace and one database", {
            size: 24,
            colour: t.accent,
            weight: 600,
        });

        // Layouts
        const PX = 1400;
        say(s, t, PX, 90, "Three common layouts", { size: 32, weight: 700 });
        const tree = (y: number, title: string, rows: [number, string][]) => {
            say(s, t, PX, y, title, { size: 26, weight: 700 });
            rows.forEach(([depth, label], i) => {
                const ty = y + 50 + i * 40;
                say(s, t, PX + 20 + depth * 40, ty, (depth ? "└ " : "") + label, {
                    size: 22,
                    mono: true,
                    colour: depth === 2 ? t.accent : t.text,
                });
            });
        };
        tree(170, "A namespace per tenant", [
            [0, "root"],
            [1, "ns acme"],
            [2, "db app"],
            [1, "ns globex"],
            [2, "db app"],
        ]);
        tree(480, "A namespace per environment", [
            [0, "root"],
            [1, "ns prod"],
            [2, "db orders, db billing"],
            [1, "ns staging"],
            [2, "db orders, db billing"],
        ]);
        tree(790, "A database per user", [
            [0, "root"],
            [1, "ns social"],
            [2, "db user_1, db user_2, ..."],
        ]);
        say(
            s,
            t,
            40,
            1010,
            "Namespace users cover every database in their namespace and nothing outside it. A new server starts with a namespace and a database both named main.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        return svg(tenancy, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 12. Cloud instance lifecycle
// ---------------------------------------------------------------------------

const lifecycle: Figure = {
    name: "ops-instance-lifecycle",
    width: 2400,
    height: 980,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line, t.red])];
        const st = (
            x: number,
            y: number,
            label: string,
            settled: boolean,
            kind: Kind = "plain",
        ) => {
            box(s, t, x, y, 300, 110, label, {
                mono: true,
                kind: settled ? kind : "muted",
                dash: settled ? undefined : "10 8",
                sub: settled ? undefined : "in progress",
            });
        };
        st(60, 400, "creating", false);
        st(560, 400, "ready", true, "good");
        st(560, 100, "updating", false);
        st(1100, 400, "pausing", false);
        st(1600, 400, "paused", true, "accent");
        st(1100, 700, "resuming", false);
        st(1100, 100, "deleting", false);
        st(1600, 100, "deleted", true, "bad");
        const lbl = (x: number, y: number, str: string, c = t.accent) =>
            say(s, t, x, y, str, {
                size: 24,
                weight: 700,
                colour: c,
                anchor: "middle",
                halo: true,
            });
        s.push(arrow(360, 455, 552, 455, t.line, 4));
        s.push(arrow(660, 400, 660, 218, t.accent, 5));
        lbl(600, 320, "Resize");
        s.push(arrow(760, 210, 760, 392, t.line, 4));
        s.push(arrow(860, 455, 1092, 455, t.accent, 5));
        lbl(976, 440, "Pause");
        s.push(arrow(1400, 455, 1592, 455, t.line, 4));
        s.push(arrow(1750, 510, 1408, 740, t.accent, 5));
        lbl(1660, 650, "Resume");
        s.push(arrow(1100, 755, 820, 518, t.line, 4));
        s.push(arrow(860, 420, 1092, 175, t.red, 5));
        lbl(930, 300, "Delete", t.red);
        s.push(arrow(1750, 400, 1408, 190, t.red, 5));
        lbl(1640, 300, "Delete", t.red);
        s.push(arrow(1400, 155, 1592, 155, t.line, 4));
        say(s, t, 190, 350, "Deploy", { size: 24, weight: 700, colour: t.accent, anchor: "end" });
        s.push(arrow(210, 280, 210, 392, t.accent, 5));
        say(s, t, 1950, 470, "no compute billed;", { size: 22, colour: t.muted });
        say(s, t, 1950, 502, "data and settings kept", { size: 22, colour: t.muted });
        say(s, t, 1950, 155, "cannot be recovered", { size: 22, colour: t.red, weight: 600 });
        say(
            s,
            t,
            60,
            900,
            "Solid boxes are the states surreal cloud instance watch --until waits for. Pause is accepted only from ready, and resume only from paused.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        say(
            s,
            t,
            60,
            940,
            "The commands wait for the instance to settle before they return, unless given --no-wait.",
            { size: 24, colour: t.muted },
        );
        return svg(lifecycle, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 13. React Native and Expo: the address each device uses to reach the server
// ---------------------------------------------------------------------------

const rnAddresses: Figure = {
    name: "ops-react-native-addresses",
    width: 2400,
    height: 1060,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.red])];
        // Development machine
        s.push(rect(40, 60, 1500, 820, { fill: t.panel, r: 28 }));
        say(s, t, 80, 120, "Development machine", { size: 32, weight: 700 });
        say(s, t, 80, 160, "LAN address 192.168.1.20 (example)", {
            size: 22,
            colour: t.muted,
            mono: true,
        });
        box(s, t, 80, 380, 520, 200, "SurrealDB, port 8000", {
            kind: "accent",
            sub: "127.0.0.1:8000: this machine only",
            sub2: "0.0.0.0:8000: the network as well",
        });
        // iOS simulator
        box(s, t, 760, 220, 700, 170, "iOS simulator", {
            sub: "shares the machine's network,",
            sub2: "so 127.0.0.1 is the machine",
        });
        s.push(arrow(752, 330, 608, 420, t.accent, 5));
        say(s, t, 1110, 430, "ws://127.0.0.1:8000", {
            size: 24,
            mono: true,
            weight: 700,
            colour: t.accent,
            anchor: "middle",
        });
        // Android emulator
        s.push(rect(760, 520, 700, 300, { fill: t.card, r: 14 }));
        say(s, t, 1110, 572, "Android emulator", { size: 28, weight: 700, anchor: "middle" });
        say(s, t, 1110, 610, "its own virtual network: 127.0.0.1 is", {
            size: 22,
            colour: t.muted,
            anchor: "middle",
        });
        say(s, t, 1110, 644, "the emulator, 10.0.2.2 is the machine", {
            size: 22,
            colour: t.muted,
            anchor: "middle",
        });
        say(s, t, 1110, 720, "ws://10.0.2.2:8000", {
            size: 24,
            mono: true,
            weight: 700,
            colour: t.accent,
            anchor: "middle",
        });
        say(s, t, 1110, 776, "ws://127.0.0.1:8000 finds nothing", {
            size: 22,
            mono: true,
            colour: t.red,
            anchor: "middle",
        });
        s.push(arrow(752, 650, 608, 540, t.accent, 5));
        // Physical phone
        box(s, t, 1800, 380, 520, 200, "Phone on the same Wi-Fi", {
            sub: "a separate device:",
            sub2: "uses the machine's LAN address",
        });
        s.push(arrow(1792, 480, 1548, 480, t.accent, 5));
        s.push(line(1540, 480, 608, 480, t.accent, 5, "14 10"));
        say(s, t, 2060, 640, "ws://192.168.1.20:8000", {
            size: 24,
            mono: true,
            weight: 700,
            colour: t.accent,
            anchor: "middle",
        });
        say(s, t, 2060, 680, "needs the server bound to 0.0.0.0", {
            size: 22,
            colour: t.muted,
            anchor: "middle",
        });
        say(
            s,
            t,
            60,
            960,
            "localhost always means the device the app runs on. The default bind, 127.0.0.1:8000, accepts the simulator and the emulator but not a phone.",
            {
                size: 24,
                colour: t.muted,
            },
        );
        say(
            s,
            t,
            60,
            1000,
            "Release builds do not allow unencrypted connections, so production apps connect over wss://.",
            { size: 24, colour: t.muted },
        );
        return svg(rnAddresses, t, s.join(""));
    },
};

export default [
    surrealkvPaths,
    mxDurability,
    backupRetention,
    backupRestore,
    twoLayers,
    capPrecedence,
    rocksConversion,
    auditPipeline,
    cliRefresh,
    bgRemoval,
    mcpTopologies,
    tenancy,
    lifecycle,
    rnAddresses,
];
