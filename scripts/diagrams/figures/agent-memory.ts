// Agent Memory figures for src/content/agent-memory. Each one draws a page's own
// worked example (Alice at org/acme, the 30-day returns policy, COO -> CEO -> CTO,
// Charles III), and every number, threshold and ordering in them was checked
// against the Agent Memory source on 2026-11-02.

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
import type { Verified } from "../provenance";

export const verified: Verified = {
    against:
        "Agent Memory source (spectron origin/main 9e481bce) and the agent-memory pages' worked examples",
    on: "2026-11-02",
};

type ChipState = "visible" | "hidden" | "plain" | "bad";

// A record drawn as a chip: a title line and an optional monospace sub line
function chip(
    s: string[],
    t: Theme,
    cx: number,
    cy: number,
    w: number,
    title: string,
    sub: string | undefined,
    state: ChipState = "plain",
    h = sub ? 92 : 64,
) {
    const fill =
        state === "visible"
            ? t.accentBg
            : state === "bad"
              ? t.redBg
              : state === "hidden"
                ? t.panel
                : t.card;
    const stroke =
        state === "visible"
            ? t.accent
            : state === "bad"
              ? t.red
              : state === "hidden"
                ? t.line
                : undefined;
    s.push(
        rect(cx - w / 2, cy - h / 2, w, h, {
            fill,
            stroke,
            r: 12,
            dash: state === "hidden" ? "8 8" : undefined,
            strokeWidth: 2.5,
        }),
    );
    const colour = state === "hidden" ? t.muted : t.text;
    if (sub) {
        s.push(text(cx, cy - 8, title, { size: 25, fill: colour, weight: 600 }));
        s.push(text(cx, cy + 28, sub, { size: 21, fill: t.muted, font: MONO }));
    } else {
        s.push(text(cx, cy + 9, title, { size: 25, fill: colour, weight: 600 }));
    }
}

// A scope node: a rounded box with a monospace path
function scopeNode(
    s: string[],
    t: Theme,
    cx: number,
    cy: number,
    label: string,
    o: {
        w?: number;
        h?: number;
        size?: number;
        state?: "normal" | "active" | "muted" | "bad";
    } = {},
) {
    const { w = 340, h = 80, size = 28, state = "normal" } = o;
    const fill =
        state === "active"
            ? t.accentBg
            : state === "bad"
              ? t.redBg
              : state === "muted"
                ? t.panel
                : t.card;
    const stroke = state === "active" ? t.accent : state === "bad" ? t.red : undefined;
    s.push(rect(cx - w / 2, cy - h / 2, w, h, { fill, stroke, r: 14 }));
    s.push(
        text(cx, cy + size * 0.36, label, {
            size,
            fill: state === "muted" ? t.muted : t.text,
            weight: 600,
            font: MONO,
        }),
    );
}

// A small shaded region behind a node, for the part of the tree a grant covers
function region(s: string[], t: Theme, x: number, y: number, w: number, h: number) {
    s.push(
        rect(x, y, w, h, {
            fill: t.accentSoft,
            stroke: t.accent,
            r: 22,
            dash: "10 8",
            strokeWidth: 2.5,
        }),
    );
}

// ---------------------------------------------------------------------------
// 1. Scope tree and visibility (contexts-and-scope)
// ---------------------------------------------------------------------------

const scopeVisibility: Figure = {
    name: "am-scope-visibility",
    width: 2400,
    height: 1320,
    draw(t: Theme) {
        const s: string[] = [];
        s.push(
            text(60, 72, "Alice's key reads with memory:read = org/acme, org/acme/user/alice", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        // Grant regions
        region(s, t, 560, 150, 400, 150);
        region(s, t, 120, 470, 400, 150);
        s.push(text(760, 140, "covered by the grant", { size: 22, fill: t.accent, weight: 600 }));
        // Tree
        const root = { x: 760, y: 225 };
        const kids = [
            { x: 320, y: 545, label: "…/user/alice", on: true },
            { x: 760, y: 545, label: "…/user/bob", on: false },
            { x: 1200, y: 545, label: "…/team/eng", on: false },
        ];
        for (const k of kids) s.push(line(root.x, root.y + 40, k.x, k.y - 40, t.line, 3));
        scopeNode(s, t, root.x, root.y, "org/acme", { state: "active" });
        for (const k of kids)
            scopeNode(s, t, k.x, k.y, k.label, { state: k.on ? "active" : "normal" });
        // Records
        s.push(line(root.x + 170, root.y, 1010, root.y, t.line, 2, "6 6"));
        chip(s, t, 1190, 225, 360, "returns window: 30 days", "[[org/acme]]", "visible");
        chip(s, t, 295, 700, 300, "Alice prefers email", "[[…/user/alice]]", "visible");
        chip(s, t, 860, 700, 300, "Bob is on leave", "[[…/user/bob]]", "hidden");
        chip(s, t, 1240, 700, 300, "on-call rota", "[[…/team/eng]]", "hidden");
        for (const [x1, x2] of [
            [295, 295],
            [760, 820],
            [1200, 1240],
        ])
            s.push(line(x1, 585, x2, 654, t.line, 2, "6 6"));
        // The co-owned record, one clause per owner
        s.push(line(545, 930, 465, 585, t.accent, 3, "10 8"));
        s.push(line(640, 930, 640, 585, t.line, 3, "10 8"));
        s.push(
            text(470, 850, "clause 1", {
                size: 22,
                fill: t.accent,
                weight: 600,
                anchor: "end",
                halo: t.bg,
            }),
        );
        s.push(
            text(660, 850, "clause 2", {
                size: 22,
                fill: t.muted,
                weight: 600,
                anchor: "start",
                halo: t.bg,
            }),
        );
        chip(
            s,
            t,
            580,
            985,
            520,
            "contract.pdf, co-owned",
            "[[…/user/alice], […/user/bob]]",
            "visible",
            104,
        );
        // Legend
        const ly = 1140;
        s.push(
            rect(60, ly - 22, 44, 36, {
                fill: t.accentBg,
                stroke: t.accent,
                r: 8,
                strokeWidth: 2.5,
            }),
        );
        s.push(text(120, ly + 6, "visible to Alice", { size: 24, fill: t.text, anchor: "start" }));
        s.push(
            rect(360, ly - 22, 44, 36, {
                fill: t.panel,
                stroke: t.line,
                r: 8,
                dash: "6 6",
                strokeWidth: 2.5,
            }),
        );
        s.push(
            text(420, ly + 6, "hidden: a path in every clause is outside the grant", {
                size: 24,
                fill: t.text,
                anchor: "start",
            }),
        );
        s.push(
            text(
                60,
                1220,
                "A record is visible when every path in at least one of its clauses is inside the grant.",
                {
                    size: 26,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        s.push(
            text(
                60,
                1264,
                "contract.pdf is visible through clause 1, although clause 2 names Bob's path.",
                {
                    size: 26,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        // Right panel: what each read returns
        const px = 1540;
        s.push(rect(px, 120, 800, 1040, { fill: t.panel, r: 22 }));
        s.push(
            text(px + 40, 180, "What each read returns", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        const reads: [string, string, [string, ChipState][], string][] = [
            [
                "no lens",
                "everything the grant covers",
                [
                    ["returns window: 30 days", "visible"],
                    ["Alice prefers email", "visible"],
                    ["contract.pdf", "visible"],
                ],
                "",
            ],
            [
                'lens [["org/acme/user/alice"]]',
                "clauses that include Alice's path",
                [
                    ["Alice prefers email", "visible"],
                    ["contract.pdf", "visible"],
                ],
                "returns window has no clause with Alice's path",
            ],
            [
                'lens [["org/acme/team/eng"]]',
                "outside the grant",
                [["nothing", "bad"]],
                "a lens narrows the grant and never widens it",
            ],
        ];
        let y = 250;
        reads.forEach(([lens, what, chips, note]) => {
            s.push(
                text(px + 40, y, lens, {
                    size: 25,
                    fill: t.accent,
                    weight: 600,
                    anchor: "start",
                    font: MONO,
                }),
            );
            s.push(text(px + 40, y + 38, what, { size: 23, fill: t.muted, anchor: "start" }));
            chips.forEach(([label, st], i) => {
                chip(s, t, px + 400, y + 100 + i * 76, 700, label, undefined, st);
            });
            const yEnd = y + 100 + (chips.length - 1) * 76 + 32;
            if (note)
                s.push(
                    text(px + 40, yEnd + 40, note, { size: 22, fill: t.muted, anchor: "start" }),
                );
            y = yEnd + (note ? 110 : 70);
        });
        return svg(scopeVisibility, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 2. Key -> principal -> grants -> scope (contexts-and-scope#permissions-and-delegation)
// ---------------------------------------------------------------------------

const keyChain: Figure = {
    name: "am-key-principal-grants",
    width: 2400,
    height: 880,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.accent, t.red])];
        const head = (x: number, label: string) =>
            s.push(text(x, 90, label, { size: 26, fill: t.muted, weight: 700 }));
        head(290, "API keys");
        head(870, "principal");
        head(1400, "grants");
        head(2010, "scope");
        // Keys
        const keys: [string, string, ChipState][] = [
            ["laptop", "same grants as alice", "plain"],
            ["CI runner", "memory:read only", "plain"],
            ["service", "floor: org/acme/user/alice", "plain"],
        ];
        keys.forEach(([name, sub, st], i) => {
            const y = 220 + i * 190;
            chip(s, t, 290, y, 420, `key: ${name}`, sub, st, 110);
            s.push(arrow(505, y, 715, 420, t.line, 3));
        });
        s.push(
            text(290, 720, "each key: the principal's grants or fewer", {
                size: 24,
                fill: t.accent,
                weight: 600,
            }),
        );
        // Principal
        scopeNode(s, t, 870, 420, "principal:alice", { w: 300, h: 100, size: 28, state: "active" });
        s.push(text(870, 520, "recorded on every write", { size: 22, fill: t.muted }));
        s.push(arrow(1025, 420, 1110, 420, t.line, 4));
        // Grants
        s.push(rect(1120, 300, 560, 240, { fill: t.panel, r: 18 }));
        const g: [string, string][] = [
            ["memory:read", "org/acme/*"],
            ["memory:write", "org/acme/user/alice"],
        ];
        g.forEach(([verb, pat], i) => {
            s.push(
                text(1150, 380 + i * 90, verb, {
                    size: 26,
                    fill: t.text,
                    weight: 600,
                    anchor: "start",
                    font: MONO,
                }),
            );
            s.push(
                text(1150, 416 + i * 90, pat, {
                    size: 24,
                    fill: t.accent,
                    anchor: "start",
                    font: MONO,
                }),
            );
        });
        s.push(arrow(1690, 420, 1770, 420, t.line, 4));
        // Scope tree
        region(s, t, 1790, 175, 440, 420);
        const root = { x: 2010, y: 240 };
        const kids = [
            { y: 360, label: "…/user/alice" },
            { y: 450, label: "…/user/bob" },
            { y: 540, label: "…/team/eng" },
        ];
        scopeNode(s, t, root.x, root.y, "org/acme", { w: 300, h: 70, size: 26, state: "active" });
        for (const k of kids) {
            s.push(
                path(`M${root.x - 120},${root.y + 35} V${k.y} H${1930}`, {
                    stroke: t.line,
                    strokeWidth: 2.5,
                }),
            );
            scopeNode(s, t, 2070, k.y, k.label, { w: 270, h: 64, size: 24, state: "active" });
        }
        s.push(
            text(2010, 640, "read region: org/acme/*", { size: 24, fill: t.accent, weight: 600 }),
        );
        // The write lands at alice
        s.push(arrow(2330, 650, 2225, 385, t.accent, 4));
        s.push(
            text(2350, 700, "writes are tagged here", {
                size: 24,
                fill: t.accent,
                weight: 600,
                anchor: "end",
            }),
        );
        s.push(
            text(
                60,
                830,
                "A request resolves key → principal → grants → scope. A key can narrow its principal's access and never widen it; revoking one key leaves the others working.",
                {
                    size: 26,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(keyChain, t, s.join(""));
    },
};

// Exact node, subtree, and the write-but-cannot-read-back case
const grantPatterns: Figure = {
    name: "am-grant-exact-subtree",
    width: 2400,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.red])];
        const tree = (
            cx: number,
            title: string,
            sub: string[],
            covered: (k: string) => boolean,
            extra?: (pos: Record<string, { x: number; y: number }>) => void,
        ) => {
            s.push(rect(cx - 370, 60, 740, 760, { fill: t.panel, r: 22 }));
            s.push(text(cx, 125, title, { size: 28, fill: t.text, weight: 700 }));
            sub.forEach((l, i) => {
                s.push(
                    text(cx, 175 + i * 40, l, {
                        size: 25,
                        fill: t.accent,
                        weight: 600,
                        font: MONO,
                    }),
                );
            });
            const root = { x: cx, y: 340 };
            const kids = [
                { k: "alice", x: cx - 235, y: 560 },
                { k: "bob", x: cx, y: 560 },
                { k: "eng", x: cx + 235, y: 560 },
            ];
            for (const k of kids) s.push(line(root.x, root.y + 36, k.x, k.y - 36, t.line, 3));
            scopeNode(s, t, root.x, root.y, "org/acme", {
                w: 260,
                h: 72,
                size: 26,
                state: covered("root") ? "active" : "normal",
            });
            const pos: Record<string, { x: number; y: number }> = { root };
            for (const k of kids) {
                pos[k.k] = k;
                scopeNode(s, t, k.x, k.y, k.k === "eng" ? "team/eng" : `user/${k.k}`, {
                    w: 210,
                    h: 66,
                    size: 22,
                    state: covered(k.k) ? "active" : "normal",
                });
            }
            extra?.(pos);
        };
        tree(400, "Exact node", ["memory:read = org/acme"], (k) => k === "root");
        s.push(text(400, 690, "covers org/acme alone,", { size: 25, fill: t.text }));
        s.push(text(400, 730, "not the nodes below it", { size: 25, fill: t.text }));
        tree(1200, "Subtree", ["memory:read = org/acme/*"], () => true);
        s.push(text(1200, 690, "covers org/acme and every", { size: 25, fill: t.text }));
        s.push(text(1200, 730, "descendant, and nothing else", { size: 25, fill: t.text }));
        tree(
            2000,
            "Write without read back",
            ["memory:read = org/acme", "memory:write = org/acme/team/eng"],
            (k) => k === "root",
            (pos) => {
                const e = pos.eng;
                s.push(
                    rect(e.x - 113, e.y - 41, 226, 82, {
                        fill: "none",
                        stroke: t.red,
                        r: 16,
                        strokeWidth: 4,
                    }),
                );
                s.push(
                    text(e.x, e.y + 90, "fact written here", {
                        size: 23,
                        fill: t.red,
                        weight: 600,
                    }),
                );
            },
        );
        s.push(
            text(2000, 715, "a scoped read returns empty,", { size: 25, fill: t.red, weight: 600 }),
        );
        s.push(text(2000, 755, "not an error", { size: 25, fill: t.red, weight: 600 }));
        s.push(text(2000, 800, "use org/acme/* for the region", { size: 24, fill: t.muted }));
        s.push(
            text(
                60,
                870,
                "Shaded nodes are the ones the read grant covers. A trailing /* is the only thing that extends a grant to the nodes below it.",
                {
                    size: 26,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(grantPatterns, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 3. Supersession chain and a cross-provenance conflict
// ---------------------------------------------------------------------------

const supersession: Figure = {
    name: "am-supersession-chain",
    width: 2400,
    height: 1180,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.accent])];
        s.push(
            text(60, 80, "Same provenance: Alice's role, stated in turns", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        const y = 230;
        const xs = [320, 960, 1600, 2300];
        const vals = ["COO", "CEO", "CTO"];
        s.push(arrow(320, y + 120, 2330, y + 120, t.line, 3));
        s.push(text(2330, y + 165, "time", { size: 24, fill: t.muted, anchor: "end" }));
        vals.forEach((v, i) => {
            const cur = i === 2;
            const x0 = xs[i];
            const x1 = cur ? xs[3] : xs[i + 1] - 12;
            s.push(
                rect(x0, y - 45, x1 - x0, 90, {
                    fill: cur ? t.accentBg : t.card,
                    stroke: cur ? t.accent : undefined,
                    r: 14,
                }),
            );
            s.push(
                text(x0 + 30, y + 12, `role = ${v}`, {
                    size: 30,
                    fill: t.text,
                    weight: 700,
                    anchor: "start",
                    font: MONO,
                }),
            );
            s.push(line(x0, y + 60, x0, y + 120, t.line, 3));
            s.push(
                text(x0 + 10, y + 100, "valid_from", {
                    size: 22,
                    fill: t.muted,
                    anchor: "start",
                    font: MONO,
                }),
            );
            if (!cur) {
                s.push(
                    text(x1 - 10, y - 62, "valid_until", {
                        size: 22,
                        fill: t.accent,
                        anchor: "end",
                        font: MONO,
                        weight: 600,
                    }),
                );
                s.push(line(x1, y - 50, x1, y + 50, t.accent, 6));
            } else {
                s.push(
                    text(xs[3] - 20, y + 12, "valid_until: none", {
                        size: 22,
                        fill: t.muted,
                        anchor: "end",
                        font: MONO,
                    }),
                );
            }
        });
        s.push(text(960, y + 210, "correction 1", { size: 24, fill: t.muted }));
        s.push(text(1600, y + 210, "correction 2", { size: 24, fill: t.muted }));
        s.push(
            text(640, y + 270, "history: GET …/history/role and asOf reads", {
                size: 25,
                fill: t.text,
            }),
        );
        s.push(
            text(1950, y + 270, "current: returned by default queries", {
                size: 25,
                fill: t.accent,
                weight: 600,
            }),
        );
        // Cross-provenance
        const y2 = 700;
        s.push(
            text(
                60,
                y2 - 60,
                "Different provenance: the returns window, same entity, key and scope",
                { size: 30, fill: t.text, weight: 700, anchor: "start" },
            ),
        );
        s.push(rect(320, y2, 1980, 80, { fill: t.card, r: 14 }));
        s.push(
            text(350, y2 + 52, "30 days", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(560, y2 + 50, "source.kind = document", {
                size: 24,
                fill: t.muted,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(rect(1280, y2 + 110, 1020, 80, { fill: t.card, r: 14 }));
        s.push(
            text(1310, y2 + 162, "60 days", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(1520, y2 + 160, "source.kind = turn", {
                size: 24,
                fill: t.muted,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(line(1280, y2 + 85, 1280, y2 + 240, t.accent, 3, "8 6"));
        chip(
            s,
            t,
            1280,
            y2 + 300,
            760,
            "uncertainty: 30 days (document) vs 60 days (turn)",
            undefined,
            "visible",
            70,
        );
        s.push(
            text(
                60,
                1120,
                "A turn never supersedes a document value, or the reverse. Both stay valid, and an uncertainty record names the two sources.",
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(supersession, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 4. Three clocks (tri-temporal-model), Charles III
// ---------------------------------------------------------------------------

const threeClocks: Figure = {
    name: "am-three-clocks",
    width: 2400,
    height: 1000,
    draw(t: Theme) {
        const s: string[] = [];
        const X0 = 520;
        const X1 = 2320;
        const xAcc = 1150; // 8 September 2022
        const xRec = 1720; // first recorded, a turn days later
        const xAsOf = 1430;
        const lanes: [number, string, string][] = [
            [200, "Valid time", "when it was true"],
            [420, "Known time", "when we first recorded it"],
            [640, "System time", "what the database held"],
        ];
        for (const [y, l, sub] of lanes) {
            s.push(text(X0 - 40, y - 2, l, { size: 30, fill: t.text, weight: 700, anchor: "end" }));
            s.push(text(X0 - 40, y + 34, sub, { size: 23, fill: t.muted, anchor: "end" }));
        }
        const bar = (x0: number, x1: number, y: number, label: string, on: boolean) => {
            s.push(
                rect(x0, y - 38, x1 - x0 - 8, 76, {
                    fill: on ? t.accentBg : t.card,
                    stroke: on ? t.accent : undefined,
                    r: 12,
                }),
            );
            s.push(
                text(x0 + 24, y + 10, label, {
                    size: 27,
                    fill: t.text,
                    weight: 600,
                    anchor: "start",
                }),
            );
        };
        bar(X0, xAcc, 200, "Prince of Wales", false);
        bar(xAcc, X1, 200, "King Charles III", true);
        bar(X0, xRec, 420, "Prince Charles", false);
        bar(xRec, X1, 420, "King Charles III", true);
        // System time: a snapshot taken the morning of 8 September
        s.push(line(X0, 640, X1, 640, t.grid, 2));
        const xSnap = xAcc - 70;
        s.push(line(xSnap, 600, xSnap, 690, t.line, 3));
        s.push(circle(xSnap, 640, 12, t.line));
        s.push(
            text(xSnap - 24, 620, "snapshot, morning of 8 Sep 2022:", {
                size: 25,
                fill: t.text,
                anchor: "end",
                halo: t.bg,
            }),
        );
        s.push(
            text(xSnap - 24, 680, "still holds Prince Charles", {
                size: 25,
                fill: t.text,
                anchor: "end",
                halo: t.bg,
            }),
        );
        // Ticks
        s.push(line(xAcc, 120, xAcc, 740, t.line, 2, "6 8"));
        s.push(text(xAcc, 105, "8 Sep 2022: accession", { size: 24, fill: t.muted, weight: 600 }));
        s.push(line(xRec, 340, xRec, 740, t.line, 2, "6 8"));
        s.push(
            text(xRec, 325, "first recorded: a turn days later", {
                size: 24,
                fill: t.muted,
                weight: 600,
            }),
        );
        // asOf line
        s.push(line(xAsOf, 150, xAsOf, 800, t.accent, 4));
        s.push(text(xAsOf, 840, "a read at instant T", { size: 26, fill: t.accent, weight: 700 }));
        s.push(circle(xAsOf, 200, 11, t.accent));
        s.push(circle(xAsOf, 420, 11, t.accent));
        s.push(
            text(xAsOf + 20, 268, "true at T: King Charles III", {
                size: 23,
                fill: t.accent,
                weight: 600,
                anchor: "start",
                halo: t.bg,
            }),
        );
        s.push(
            text(xAsOf - 20, 490, "asOf T: Prince Charles", {
                size: 23,
                fill: t.accent,
                weight: 600,
                anchor: "end",
                halo: t.bg,
            }),
        );
        s.push(
            text(
                60,
                930,
                "Between the accession and the turn that reported it, valid time already says King Charles III, while an asOf read returns what memory believed then.",
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(threeClocks, t, s.join(""));
    },
};

// A step box with a bold title and up to three plain lines
function stepBox(
    s: string[],
    t: Theme,
    cx: number,
    cy: number,
    w: number,
    h: number,
    title: string,
    lines: string[],
    kind: "plain" | "accent" | "bad" = "plain",
) {
    const fill = kind === "accent" ? t.accentBg : kind === "bad" ? t.redBg : t.card;
    const stroke = kind === "accent" ? t.accent : kind === "bad" ? t.red : undefined;
    s.push(rect(cx - w / 2, cy - h / 2, w, h, { fill, stroke, r: 16 }));
    const top = cy - ((lines.length + 1) * 38) / 2 + 26;
    s.push(text(cx, top, title, { size: 28, fill: t.text, weight: 700 }));
    lines.forEach((l, i) => {
        s.push(text(cx, top + 44 + i * 36, l, { size: 23, fill: t.muted }));
    });
}

// An exit pill naming the tier value a response reports
function exitPill(s: string[], t: Theme, cx: number, cy: number, label: string) {
    s.push(rect(cx - 170, cy - 36, 340, 72, { fill: t.greenBg, stroke: t.green, r: 36 }));
    s.push(text(cx, cy + 10, label, { size: 27, fill: t.text, weight: 700, font: MONO }));
}

// ---------------------------------------------------------------------------
// 5. Recall tier router, in execution order
// ---------------------------------------------------------------------------

const tierRouter: Figure = {
    name: "am-recall-tiers",
    width: 2400,
    height: 1120,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.green, t.accent])];
        const y = 230;
        stepBox(s, t, 250, y, 380, 180, "query understanding", [
            "classify the question,",
            "embed it",
        ]);
        stepBox(s, t, 760, y, 520, 180, "tier 2: response reuse", [
            "a prior answer to a query with",
            "cosine ≥ 0.92, cited facts current",
        ]);
        stepBox(s, t, 1330, y, 500, 180, "tier 1: structured reads", [
            "attribute and relation lookups",
            "in the graph, no LLM",
        ]);
        stepBox(s, t, 1940, y, 560, 180, "tier 3: hybrid retrieval", [
            "vector, BM25 and graph signals",
            "fused over 256 candidates",
        ]);
        s.push(arrow(442, y, 492, y, t.line, 4));
        s.push(arrow(1022, y, 1072, y, t.line, 4));
        s.push(text(1047, y - 20, "miss", { size: 22, fill: t.muted }));
        s.push(arrow(1582, y, 1652, y, t.line, 4));
        s.push(text(1617, y - 20, "seeds", { size: 22, fill: t.accent, weight: 600 }));
        // Cache exit
        s.push(arrow(760, y + 92, 760, 480, t.green, 4));
        s.push(text(780, 410, "hit", { size: 24, fill: t.green, weight: 600, anchor: "start" }));
        exitPill(s, t, 760, 520, "tier: cache");
        s.push(
            text(1330, 370, "never an exit: its results join", {
                size: 23,
                fill: t.accent,
                weight: 600,
            }),
        );
        s.push(text(1330, 404, "tier 3 as seeds", { size: 23, fill: t.accent, weight: 600 }));
        // Escalation decision
        s.push(arrow(1940, y + 92, 1940, 470, t.line, 4));
        s.push(rect(1640, 480, 600, 230, { fill: t.panel, stroke: t.line, r: 16, dash: "10 8" }));
        s.push(text(1940, 528, "escalate if any of:", { size: 26, fill: t.text, weight: 700 }));
        [
            "the classifier asks for full context",
            "fewer than k / 2 hits came back",
            "top fused score < 0.40 and best",
            "vector cosine < 0.80",
        ].forEach((l, i) => {
            s.push(text(1670, 578 + i * 34, l, { size: 23, fill: t.muted, anchor: "start" }));
        });
        s.push(arrow(1632, 595, 1532, 595, t.green, 4));
        s.push(text(1582, 580, "no", { size: 24, fill: t.green, weight: 600 }));
        exitPill(s, t, 1355, 595, "tier: hybrid");
        s.push(arrow(1940, 718, 1940, 800, t.line, 4));
        s.push(text(1960, 770, "yes", { size: 24, fill: t.text, weight: 600, anchor: "start" }));
        stepBox(
            s,
            t,
            1940,
            890,
            600,
            170,
            "tier 4: escalated",
            ["HyDE query rewrite, pool doubled", "to 512, re-rank, still k hits"],
            "accent",
        );
        s.push(arrow(1632, 890, 1532, 890, t.green, 4));
        exitPill(s, t, 1355, 890, "tier: escalated");
        // Notes on tier 2
        s.push(rect(60, 680, 1000, 290, { fill: t.panel, r: 18 }));
        s.push(
            text(100, 735, "Tier 2 runs on /chat only. It is skipped:", {
                size: 25,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        [
            "on /query, /context, /reflect and the MCP read tools",
            "when the session already has prior turns",
            "when the call sets bypassCache: true",
            "when the read has a time or location filter",
        ].forEach((l, i) => {
            s.push(text(100, 785 + i * 44, `· ${l}`, { size: 24, fill: t.muted, anchor: "start" }));
        });
        s.push(
            text(
                60,
                1060,
                "Cheaper steps run first. Each response reports the tier that answered, and retrieval_trace records why.",
                {
                    size: 26,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(tierRouter, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 6. End-to-end write path (how-it-works)
// ---------------------------------------------------------------------------

const writePath: Figure = {
    name: "am-write-path",
    width: 2400,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.accent])];
        // Two entry lanes
        stepBox(s, t, 270, 230, 460, 150, "user message", ["POST /facts, /chat, MCP remember"]);
        stepBox(s, t, 270, 560, 460, 150, "uploaded file", ["POST /documents"]);
        stepBox(s, t, 760, 230, 440, 150, "session turn", ["stored as it is said"]);
        stepBox(s, t, 760, 560, 440, 150, "document job", ["async, chunked by section"]);
        s.push(arrow(502, 230, 532, 230, t.line, 4));
        s.push(arrow(502, 560, 532, 560, t.line, 4));
        s.push(arrow(982, 240, 1092, 370, t.line, 4));
        s.push(arrow(982, 550, 1092, 420, t.line, 4));
        // Extraction
        stepBox(
            s,
            t,
            1300,
            395,
            400,
            200,
            "extraction (LLM)",
            ["windowed, one structured", "output call per window"],
            "accent",
        );
        s.push(arrow(1502, 395, 1592, 395, t.line, 4));
        // Reconciliation
        stepBox(
            s,
            t,
            1840,
            395,
            480,
            200,
            "reconciliation",
            ["one function, one ACID", "transaction per write"],
            "accent",
        );
        // Extraction outputs
        const outs = [
            "entities",
            "attributes",
            "relations",
            "actions",
            "instructions",
            "uncertainties",
        ];
        s.push(text(1300, 560, "produces", { size: 22, fill: t.muted, weight: 600 }));
        outs.forEach((o, i) => {
            s.push(text(1300, 598 + i * 32, o, { size: 22, fill: t.text, font: MONO }));
        });
        // Reconciliation outcomes
        s.push(
            text(1840, 560, "for each extracted value", { size: 22, fill: t.muted, weight: 600 }),
        );
        [
            "match entity by [type, name]",
            "same scope, same provenance: supersede",
            "different provenance: uncertainty",
            "below the confidence floor: uncertainty",
        ].forEach((o, i) => {
            s.push(text(1840, 598 + i * 32, o, { size: 22, fill: t.text }));
        });
        s.push(arrow(2090, 395, 2150, 395, t.line, 4));
        // Substrate
        s.push(rect(2160, 140, 220, 560, { fill: t.panel, stroke: t.line, r: 18 }));
        s.push(text(2270, 200, "SurrealDB", { size: 24, fill: t.muted, weight: 700 }));
        ["graph", "vectors", "documents", "geometry", "decision_trace"].forEach((o, i) => {
            s.push(
                text(2270, 280 + i * 80, o, {
                    size: i === 4 ? 21 : 25,
                    fill: i === 4 ? t.accent : t.text,
                    weight: 600,
                    font: i === 4 ? MONO : undefined,
                }),
            );
        });
        s.push(
            text(
                60,
                850,
                "Turns and documents enter separately and reconcile through the same rules. Each write also links a decision_trace to the records it considered and created.",
                {
                    size: 26,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(writePath, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 7. Hybrid search: RRF fusion, and pool against answer size
// ---------------------------------------------------------------------------

const rrf: Figure = {
    name: "am-hybrid-rrf",
    width: 2400,
    height: 1000,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        const chunks: Record<string, string> = {
            A: "Unopened items: returned within 30 days",
            B: "Refunds go to the original payment method",
            C: "Returns of opened items",
            D: "Return window for gift purchases",
            E: "Return shipping labels",
        };
        const vec = ["C", "A", "D", "B"];
        const bm = ["A", "D", "E", "C"];
        const score = (id: string) =>
            [vec, bm].reduce((acc, l) => {
                const r = l.indexOf(id);
                return r < 0 ? acc : acc + 1 / (60 + r + 1);
            }, 0);
        const fused = Object.keys(chunks).sort((a, b) => score(b) - score(a));
        s.push(
            text(60, 70, 'Query: "what is the return window for unopened items?"', {
                size: 28,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        const col = (
            x: number,
            title: string,
            ids: string[],
            label: (id: string, i: number) => string,
            w: number,
        ) => {
            s.push(text(x, 150, title, { size: 27, fill: t.text, weight: 700, anchor: "start" }));
            ids.forEach((id, i) => {
                const y = 190 + i * 96;
                const top = title.startsWith("fused") && i === 0;
                s.push(
                    rect(x, y, w, 80, {
                        fill: top ? t.accentBg : t.card,
                        stroke: top ? t.accent : undefined,
                        r: 12,
                    }),
                );
                s.push(
                    text(x + 24, y + 51, `${i + 1}`, {
                        size: 26,
                        fill: t.muted,
                        weight: 700,
                        anchor: "start",
                    }),
                );
                s.push(
                    text(x + 70, y + 51, `${id}  ${label(id, i)}`, {
                        size: 24,
                        fill: t.text,
                        weight: 600,
                        anchor: "start",
                    }),
                );
            });
        };
        col(60, "vector rank", vec, () => "", 300);
        col(420, "BM25 rank", bm, () => "", 300);
        col(
            1040,
            "fused: Σ 1 / (60 + rank)",
            fused,
            (id) => {
                const parts = [vec, bm]
                    .map((l) => l.indexOf(id))
                    .filter((r) => r >= 0)
                    .map((r) => `1/${61 + r}`)
                    .join(" + ");
                return `${parts} = ${score(id).toFixed(5)}`;
            },
            620,
        );
        s.push(arrow(740, 380, 1010, 380, t.line, 4));
        Object.entries(chunks).forEach(([id, label], i) => {
            s.push(
                text(1720, 240 + i * 50, `${id}  ${label}`, {
                    size: 23,
                    fill: t.muted,
                    anchor: "start",
                }),
            );
        });
        s.push(text(1720, 190, "chunks", { size: 25, fill: t.text, weight: 700, anchor: "start" }));
        s.push(
            text(
                60,
                720,
                "A is second in one list and first in the other, so it leads. E, found only by BM25 at rank 3, beats B, found only by vector search at rank 4.",
                { size: 24, fill: t.muted, anchor: "start" },
            ),
        );
        // Pool against answer size
        const gy = 790;
        s.push(
            text(
                60,
                gy,
                "Each signal searches a pool of 256 candidates; k only sets how many fused hits come back.",
                { size: 27, fill: t.text, weight: 700, anchor: "start" },
            ),
        );
        const cell = 15;
        for (let i = 0; i < 256; i++) {
            const x = 60 + (i % 128) * (cell + 2);
            const y = gy + 40 + Math.floor(i / 128) * (cell + 2);
            s.push(
                rect(x, y, cell, cell, {
                    fill: i < 10 ? t.accent : i < 50 ? t.accentSoft : t.card,
                    r: 3,
                }),
            );
        }
        s.push(
            text(60, gy + 120, "k = 10 by default", {
                size: 24,
                fill: t.accent,
                weight: 700,
                anchor: "start",
            }),
        );
        s.push(
            text(360, gy + 120, "up to 50", {
                size: 24,
                fill: t.text,
                weight: 600,
                anchor: "start",
            }),
        );
        s.push(
            text(
                560,
                gy + 120,
                "rest of the 256-candidate pool, doubled to 512 when the read escalates",
                { size: 24, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(rrf, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 8. Importance decay per category
// ---------------------------------------------------------------------------

const decay: Figure = {
    name: "am-importance-decay",
    width: 2400,
    height: 1050,
    draw(t: Theme) {
        const s: string[] = [];
        const P = { x: 220, y: 110, w: 1640, h: 700 };
        const days = 60;
        const yMax = 1.1;
        const X = (d: number) => P.x + (d / days) * P.w;
        const Y = (v: number) => P.y + P.h - (v / yMax) * P.h;
        for (const v of [0, 0.25, 0.5, 0.75, 1]) {
            s.push(line(P.x, Y(v), P.x + P.w, Y(v), t.grid, 1.5, v ? "6 8" : undefined));
            s.push(
                text(P.x - 20, Y(v) + 9, v.toFixed(2), { size: 24, fill: t.muted, anchor: "end" }),
            );
        }
        for (let d = 0; d <= days; d += 10) {
            s.push(text(X(d), P.y + P.h + 44, String(d), { size: 24, fill: t.muted }));
        }
        s.push(
            text(
                P.x + P.w / 2,
                P.y + P.h + 96,
                "days since the fact was written (one decay pass a day)",
                { size: 26, fill: t.text },
            ),
        );
        s.push(
            `<text x="70" y="${P.y + P.h / 2}" font-family="-apple-system, sans-serif" font-size="26" fill="${t.text}" text-anchor="middle" transform="rotate(-90 70 ${P.y + P.h / 2})">importance</text>`,
        );
        const curve = (start: number, rate: number, from: number, to: number) => {
            const pts: string[] = [];
            for (let d = from; d <= to; d++) {
                const v = Math.max(start * rate ** d, 0);
                pts.push(`${pts.length ? "L" : "M"}${X(d).toFixed(1)},${Y(v).toFixed(1)}`);
            }
            return pts.join("");
        };
        s.push(path(curve(1.0, 1, 0, days), { stroke: t.green, strokeWidth: 6 }));
        s.push(path(curve(0.8, 0.995, 0, days), { stroke: t.accent, strokeWidth: 6 }));
        s.push(path(curve(0.5, 0.95, 0, 7), { stroke: t.red, strokeWidth: 6 }));
        s.push(path(curve(0.5, 0.95, 7, days), { stroke: t.red, strokeWidth: 4, dash: "12 10" }));
        // Expiry of context facts at day 7
        s.push(line(X(7), P.y, X(7), P.y + P.h, t.line, 2, "4 6"));
        s.push(circle(X(7), Y(0.5 * 0.95 ** 7), 11, t.red));
        s.push(
            text(
                X(7) + 18,
                Y(0.5 * 0.95 ** 7) - 20,
                `day 7: ${(0.5 * 0.95 ** 7).toFixed(2)}, valid_until set`,
                { size: 23, fill: t.red, weight: 600, anchor: "start", halo: t.bg },
            ),
        );
        for (const d of [30, 60]) {
            const v = 0.5 * 0.95 ** d;
            s.push(circle(X(d), Y(v), 9, t.red));
            s.push(
                text(X(d), Y(v) - 22, v.toFixed(2), {
                    size: 23,
                    fill: t.red,
                    weight: 600,
                    halo: t.bg,
                }),
            );
        }
        s.push(circle(X(60), Y(0.8 * 0.995 ** 60), 9, t.accent));
        // Legend on the right
        const lx = 1920;
        const items: [string, string, string][] = [
            [t.green, "identity", "starts at 1.0, rate 1 (no decay)"],
            [
                t.accent,
                "knowledge",
                `starts at 0.8, × 0.995 a day: ${(0.8 * 0.995 ** 60).toFixed(2)} at day 60`,
            ],
            [t.red, "context", "starts at 0.5, × 0.95 a day"],
        ];
        items.forEach(([c, name, sub], i) => {
            const y = 180 + i * 150;
            s.push(line(lx, y, lx + 60, y, c, 6));
            s.push(
                text(lx + 80, y + 9, name, {
                    size: 27,
                    fill: t.text,
                    weight: 700,
                    anchor: "start",
                    font: MONO,
                }),
            );
            const words = sub.split(": ");
            words.forEach((w, j) => {
                s.push(
                    text(lx + 80, y + 48 + j * 32, w, { size: 22, fill: t.muted, anchor: "start" }),
                );
            });
        });
        s.push(line(lx, 640, lx + 60, 640, t.red, 4, "12 10"));
        s.push(
            text(lx + 80, 649, "context after expiry", {
                size: 22,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(lx + 80, 681, "out of current recall", {
                size: 22,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(
                60,
                1010,
                "Decay changes importance only and never ends a fact. A context fact leaves current recall when it expires 7 days after its known time.",
                {
                    size: 25,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(decay, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 9. Extraction windows (extraction-pipeline): 8,000 new characters per
//    window, each later window repeating the previous 256, at most 10 windows
// ---------------------------------------------------------------------------

const windows: Figure = {
    name: "am-extraction-windows",
    width: 2400,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [];
        const CAP = 8000;
        const OV = 256;
        const X0 = 120;
        const W = 2160;
        // A 20,500-character turn
        const n1 = 20_500;
        const X = (c: number) => X0 + (c / n1) * W;
        s.push(
            text(60, 70, "A 20,500-character turn becomes 3 windows", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        s.push(rect(X(0), 110, W, 50, { fill: t.card, r: 8 }));
        s.push(text(X(0) + 20, 145, "turn text", { size: 24, fill: t.muted, anchor: "start" }));
        for (let i = 0, base = 0; base < n1; i++, base += CAP) {
            const end = Math.min(base + CAP, n1);
            const start = Math.max(base - OV, 0);
            const y = 200 + i * 90;
            s.push(
                rect(X(start), y, X(end) - X(start), 64, {
                    fill: t.accentBg,
                    stroke: t.accent,
                    r: 10,
                    strokeWidth: 2.5,
                }),
            );
            if (start < base)
                s.push(
                    rect(X(start), y, X(base) - X(start), 64, {
                        fill: t.accent,
                        r: 6,
                        opacity: 0.55,
                    }),
                );
            s.push(
                text(
                    X(base) + 24,
                    y + 42,
                    `window ${i + 1}: characters ${start.toLocaleString("en-GB")}-${end.toLocaleString("en-GB")}`,
                    {
                        size: 24,
                        fill: t.text,
                        weight: 600,
                        anchor: "start",
                    },
                ),
            );
            if (start < base)
                s.push(
                    text(X(start) - 14, y + 42, "256 repeated", {
                        size: 22,
                        fill: t.accent,
                        weight: 600,
                        anchor: "end",
                    }),
                );
        }
        // A 95,000-character turn
        const n2 = 95_000;
        const X2 = (c: number) => X0 + (c / n2) * W;
        const y2 = 600;
        s.push(
            text(
                60,
                y2 - 40,
                "A 95,000-character turn: 10 windows cover the first 80,000 characters",
                { size: 30, fill: t.text, weight: 700, anchor: "start" },
            ),
        );
        for (let i = 0; i < 10; i++) {
            s.push(
                rect(X2(i * CAP) + 2, y2, X2(CAP) - X2(0) - 4, 70, {
                    fill: t.accentBg,
                    stroke: t.accent,
                    r: 8,
                    strokeWidth: 2,
                }),
            );
            s.push(
                text(X2(i * CAP + CAP / 2), y2 + 46, String(i + 1), {
                    size: 24,
                    fill: t.text,
                    weight: 600,
                }),
            );
        }
        s.push(
            rect(X2(80_000) + 2, y2, X2(n2) - X2(80_000) - 2, 70, {
                fill: t.redBg,
                stroke: t.red,
                r: 8,
                strokeWidth: 2,
            }),
        );
        s.push(text(X2(87_500), y2 + 46, "dropped", { size: 24, fill: t.red, weight: 700 }));
        s.push(
            text(X2(87_500), y2 + 110, "15,000 characters, logged", {
                size: 22,
                fill: t.red,
                anchor: "middle",
            }),
        );
        s.push(
            text(X2(87_500), y2 + 140, "and counted", { size: 22, fill: t.red, anchor: "middle" }),
        );
        s.push(
            text(
                60,
                850,
                "Each window is one structured-output call to the extraction model. The results are merged and deduplicated, since neighbouring windows share 256 characters.",
                {
                    size: 25,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(windows, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 10. What each way of retiring a fact leaves behind
// ---------------------------------------------------------------------------

type Cell = [string, "ok" | "gone" | "off" | "same"];

const forgetMatrix: Figure = {
    name: "am-forget-matrix",
    width: 2400,
    height: 1000,
    draw(t: Theme) {
        const s: string[] = [];
        const cols = [
            "current recall",
            "point-in-time (asOf) reads",
            "correction history",
            "stored",
        ];
        const rows: [string, string, Cell[]][] = [
            [
                "a correction",
                "supersession",
                [
                    ["new value only", "ok"],
                    ["old value served", "ok"],
                    ["kept", "ok"],
                    ["kept", "ok"],
                ],
            ],
            [
                "context expiry",
                "7 days after known time",
                [
                    ["no longer returned", "off"],
                    ["still served", "ok"],
                    ["kept", "ok"],
                    ["kept", "ok"],
                ],
            ],
            [
                "decay",
                "daily, importance only",
                [
                    ["still returned", "same"],
                    ["unchanged", "same"],
                    ["unchanged", "same"],
                    ["kept", "ok"],
                ],
            ],
            [
                "forget, entity delete",
                "POST /forget, DELETE /entities/…",
                [
                    ["no longer returned", "off"],
                    ["withheld", "off"],
                    ["kept", "ok"],
                    ["kept for audit", "ok"],
                ],
            ],
            [
                "forget with purge",
                "purge: true",
                [
                    ["removed", "gone"],
                    ["removed", "gone"],
                    ["erased", "gone"],
                    ["erased", "gone"],
                ],
            ],
            [
                "scoped forget",
                "POST /scopes/forget",
                [
                    ["removed", "gone"],
                    ["removed", "gone"],
                    ["erased", "gone"],
                    ["subtree hard-deleted", "gone"],
                ],
            ],
        ];
        const X0 = 60;
        const LW = 560;
        const CW = 440;
        const RH = 120;
        cols.forEach((c, i) => {
            s.push(text(X0 + LW + i * CW + CW / 2, 90, c, { size: 26, fill: t.text, weight: 700 }));
        });
        rows.forEach(([name, sub, cells], r) => {
            const y = 130 + r * RH;
            s.push(
                text(X0, y + 52, name, { size: 28, fill: t.text, weight: 700, anchor: "start" }),
            );
            s.push(text(X0, y + 88, sub, { size: 22, fill: t.muted, anchor: "start", font: MONO }));
            cells.forEach(([label, kind], i) => {
                const x = X0 + LW + i * CW + 10;
                const fill = kind === "ok" ? t.greenBg : kind === "gone" ? t.redBg : t.card;
                const stroke = kind === "ok" ? t.green : kind === "gone" ? t.red : undefined;
                s.push(rect(x, y + 14, CW - 20, RH - 28, { fill, stroke, r: 12, strokeWidth: 2 }));
                s.push(
                    text(x + (CW - 20) / 2, y + 70, label, {
                        size: 25,
                        fill: kind === "same" ? t.muted : t.text,
                        weight: 600,
                    }),
                );
            });
        });
        s.push(
            text(
                60,
                900,
                "Only an explicit forget is withheld from point-in-time reads; expiry and supersession stay auditable. Purge and scoped forget need memory:forget and cannot be undone.",
                {
                    size: 25,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        s.push(
            text(
                60,
                945,
                "Tombstoning a scope node is separate again: it retires the folder in the scope vocabulary and leaves the facts under it until they are erased.",
                {
                    size: 25,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(forgetMatrix, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 11. Two chat integration patterns: who owns the model call
// ---------------------------------------------------------------------------

const chatPatterns: Figure = {
    name: "am-chat-patterns",
    width: 2400,
    height: 1060,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.accent])];
        const panel = (x: number, title: string, sub: string) => {
            s.push(rect(x, 40, 1140, 900, { fill: t.panel, r: 22 }));
            s.push(text(x + 570, 100, title, { size: 30, fill: t.text, weight: 700 }));
            s.push(text(x + 570, 142, sub, { size: 24, fill: t.accent, weight: 600, font: MONO }));
        };
        // Left: Agent Memory drives the loop
        panel(40, "Agent Memory drives the loop", "memory.chat(message, session)");
        stepBox(s, t, 230, 290, 300, 120, "your app", ["sends the message"]);
        s.push(rect(440, 190, 700, 720, { fill: t.accentBg, stroke: t.accent, r: 18 }));
        s.push(text(790, 240, "Agent Memory", { size: 27, fill: t.accent, weight: 700 }));
        const steps = [
            ["1  transcript window", "last 10 turns, up to 8k characters"],
            ["2  tiered retrieval", "skips turns already in the window"],
            ["3  model call", "the configured or per-call model"],
            ["4  store both turns", "user turn extracted, reply stored as a turn"],
            ["5  return", "reply, memory diff, citations"],
        ];
        steps.forEach(([a, b], i) => {
            const y = 300 + i * 120;
            s.push(rect(480, y - 45, 620, 96, { fill: t.card, r: 12 }));
            s.push(text(510, y - 6, a, { size: 25, fill: t.text, weight: 700, anchor: "start" }));
            s.push(text(546, y + 30, b, { size: 22, fill: t.muted, anchor: "start" }));
            if (i) s.push(arrow(790, y - 70, 790, y - 49, t.line, 3));
        });
        s.push(arrow(382, 290, 432, 290, t.line, 4));
        s.push(arrow(472, 780, 300, 780, t.accent, 4));
        s.push(text(230, 830, "reply", { size: 25, fill: t.accent, weight: 600 }));
        // Right: caller drives the loop
        const R = 1220;
        panel(R, "Caller drives the loop", "context() → your model → remember()");
        const appX = R + 240;
        const amX = R + 960;
        s.push(rect(appX - 200, 190, 400, 720, { fill: t.card, r: 18 }));
        s.push(text(appX, 240, "your app", { size: 27, fill: t.text, weight: 700 }));
        s.push(rect(amX - 150, 190, 300, 720, { fill: t.accentBg, stroke: t.accent, r: 18 }));
        s.push(text(amX, 240, "Agent Memory", { size: 27, fill: t.accent, weight: 700 }));
        const msg = (y: number, label: string, right: boolean) => {
            if (right) s.push(arrow(appX + 200, y, amX - 158, y, t.line, 4));
            else s.push(arrow(amX - 150, y, appX + 208, y, t.accent, 4));
            s.push(
                text((appX + 200 + amX - 150) / 2, y - 16, label, {
                    size: 21,
                    fill: right ? t.text : t.accent,
                    weight: 600,
                    font: MONO,
                    halo: t.panel,
                }),
            );
        };
        msg(320, "profile(), context(query)", true);
        msg(400, "profile, context string", false);
        stepBox(
            s,
            t,
            appX,
            560,
            340,
            170,
            "your model call",
            ["your prompt, tools,", "multi-step chains"],
            "accent",
        );
        msg(740, "remember(user turn)", true);
        msg(820, "remember(reply)", true);
        s.push(text(amX, 600, "extracts and", { size: 23, fill: t.muted }));
        s.push(text(amX, 634, "reconciles", { size: 23, fill: t.muted }));
        s.push(
            text(
                60,
                1010,
                "Both patterns store the same memory. The difference is who calls the model, and one session can mix the two turn by turn.",
                {
                    size: 26,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(chatPatterns, t, s.join(""));
    },
};

// ---------------------------------------------------------------------------
// 12. Integration loops: middleware and MCP tools
// ---------------------------------------------------------------------------

const middleware: Figure = {
    name: "am-integration-middleware",
    width: 2400,
    height: 760,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.accent])];
        const y = 300;
        stepBox(s, t, 230, y, 340, 150, "user message", ["the latest turn"]);
        stepBox(
            s,
            t,
            720,
            y,
            460,
            190,
            "before the model",
            ["recall or context for the", "message, plus the profile"],
            "accent",
        );
        stepBox(s, t, 1240, y, 400, 190, "your model", ["memory injected as", "a system message"]);
        stepBox(
            s,
            t,
            1760,
            y,
            460,
            190,
            "after the model",
            ["remember the user turn", "and the reply"],
            "accent",
        );
        stepBox(s, t, 2210, y, 300, 150, "reply", ["to the user"]);
        s.push(arrow(402, y, 482, y, t.line, 4));
        s.push(arrow(952, y, 1032, y, t.line, 4));
        s.push(arrow(1442, y, 1522, y, t.line, 4));
        s.push(arrow(1992, y, 2052, y, t.line, 4));
        // Agent Memory lane
        s.push(
            rect(490, 520, 1500, 90, { fill: t.panel, stroke: t.accent, r: 16, strokeWidth: 2.5 }),
        );
        s.push(
            text(1240, 576, "Agent Memory, scoped to the caller's key", {
                size: 26,
                fill: t.accent,
                weight: 700,
            }),
        );
        s.push(arrow(720, 512, 720, y + 103, t.accent, 4));
        s.push(arrow(1760, y + 100, 1760, 510, t.accent, 4));
        s.push(
            text(
                60,
                80,
                "Memory as middleware: the framework calls Agent Memory around every model call",
                { size: 30, fill: t.text, weight: 700, anchor: "start" },
            ),
        );
        s.push(
            text(
                60,
                700,
                "The model never sees a memory tool. If Agent Memory cannot be reached, a fail-open adapter calls the model without memory instead of failing.",
                {
                    size: 25,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(middleware, t, s.join(""));
    },
};

const mcpTools: Figure = {
    name: "am-integration-mcp",
    width: 2400,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.accent, t.red])];
        s.push(
            text(60, 80, "Memory as tools over MCP: the model decides when to call them", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        stepBox(s, t, 270, 380, 380, 220, "model", ["chooses a tool", "mid-conversation"]);
        stepBox(s, t, 780, 380, 400, 220, "MCP client", [
            "Claude, Cursor, Codex…",
            "Authorization: Bearer key",
        ]);
        s.push(arrow(462, 360, 572, 360, t.line, 4));
        s.push(arrow(572, 410, 462, 410, t.line, 4));
        // Grant check
        s.push(rect(1080, 220, 560, 320, { fill: t.panel, stroke: t.line, r: 18, dash: "10 8" }));
        s.push(text(1360, 272, "/mcp: same auth as REST", { size: 26, fill: t.text, weight: 700 }));
        [
            "key → principal → grants",
            "each tool needs the verb its",
            "REST equivalent needs, such as",
            "memory:forget for forget",
        ].forEach((l, i) => {
            s.push(
                text(1360, 322 + i * 46, l, {
                    size: 23,
                    fill: i ? t.muted : t.accent,
                    weight: i ? 400 : 600,
                    font: i ? undefined : MONO,
                }),
            );
        });
        s.push(arrow(982, 380, 1072, 380, t.line, 4));
        s.push(arrow(1648, 380, 1738, 380, t.line, 4));
        // Tools
        const tools: [string, string][] = [
            ["recall", "search memory for a query"],
            ["remember", "store an exchange or a fact"],
            ["forget", "retire matches, or purge"],
            ["context, reflect, upload, inspect", ""],
        ];
        s.push(rect(1750, 160, 600, 460, { fill: t.accentBg, stroke: t.accent, r: 18 }));
        s.push(text(2050, 210, "Agent Memory tools", { size: 26, fill: t.accent, weight: 700 }));
        tools.forEach(([n, d], i) => {
            const y = 270 + i * 90;
            s.push(
                text(1790, y, n, {
                    size: 26,
                    fill: t.text,
                    weight: 700,
                    anchor: "start",
                    font: MONO,
                }),
            );
            if (d) s.push(text(1790, y + 34, d, { size: 22, fill: t.muted, anchor: "start" }));
        });
        // Refusal path
        s.push(arrow(1360, 548, 1360, 680, t.red, 4));
        chip(
            s,
            t,
            1360,
            730,
            760,
            "verb not granted: isError result, REST status",
            undefined,
            "bad",
            76,
        );
        s.push(
            text(
                60,
                850,
                "Every tool call is checked against the key's grants, so the model can only read, write or forget where the key's principal is allowed to. Reads outside the region return nothing.",
                {
                    size: 25,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(mcpTools, t, s.join(""));
    },
};

export default [
    scopeVisibility,
    keyChain,
    grantPatterns,
    supersession,
    threeClocks,
    tierRouter,
    writePath,
    rrf,
    decay,
    windows,
    forgetMatrix,
    chatPatterns,
    middleware,
    mcpTools,
];
