// Figures for the database basics section in learn/database-basics. Each one
// draws the example on its page, with the values that example returns.

import {
    arrow,
    type Figure,
    link,
    MONO,
    markers,
    type Node,
    node,
    rect,
    svg,
    type Theme,
    text,
} from "../lib";
import type { Verified } from "../provenance";

export const verified: Verified = {
    against: "SurrealDB 4.0.1, running each page's example",
    on: "2026-11-17",
};

// A record drawn as a card: its record ID on top, then one line per field
const card = (
    s: string[],
    t: Theme,
    x: number,
    y: number,
    w: number,
    title: string,
    lines: string[],
    o: { stroke?: string; titleColour?: string } = {},
): number => {
    const h = 76 + lines.length * 42;
    s.push(rect(x, y, w, h, { fill: t.card, stroke: o.stroke }));
    s.push(
        text(x + 28, y + 50, title, {
            size: 28,
            fill: o.titleColour ?? t.accent,
            weight: 700,
            anchor: "start",
            font: MONO,
        }),
    );
    lines.forEach((l, i) => {
        s.push(
            // Leading spaces collapse in SVG text, so indentation uses no-break spaces
            text(
                x + 28,
                y + 100 + i * 42,
                l.replace(/^ +/, (m) => "\u00a0".repeat(m.length)),
                {
                    size: 24,
                    fill: t.text,
                    anchor: "start",
                    font: MONO,
                },
            ),
        );
    });
    return h;
};

const panel = (s: string[], t: Theme, x: number, title: string, caption: string) => {
    s.push(rect(x, 60, 720, 780, { fill: t.panel }));
    s.push(text(x + 360, 124, title, { size: 36, fill: t.text, weight: 700 }));
    s.push(text(x + 360, 806, caption, { size: 24, fill: t.muted }));
};

// The book and author examples on the data models page, in three models
const dataModelShapes: Figure = {
    name: "data-model-shapes",
    width: 2400,
    height: 960,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];

        // Relational: a book that links to a separate author record
        const rx = 60;
        panel(s, t, rx, "Relational", "The book links to a separate author record");
        card(s, t, rx + 40, 180, 640, "book:earthsea", [
            "title: 'A Wizard of Earthsea'",
            "author: author:ursula",
        ]);
        card(s, t, rx + 40, 500, 640, "author:ursula", ["name: 'Ursula K. Le Guin'"]);
        s.push(arrow(rx + 230, 352, rx + 230, 490, t.accent, 4));
        s.push(
            text(rx + 250, 430, "record link", {
                size: 24,
                fill: t.accent,
                weight: 600,
                anchor: "start",
                font: MONO,
            }),
        );

        // Document: everything about the book nested in one record
        const dx = 840;
        panel(s, t, dx, "Document", "Everything about the book is in one record");
        card(s, t, dx + 40, 180, 640, "book:dispossessed", [
            "title: 'The Dispossessed',",
            "author: {",
            "    name: 'Ursula K. Le Guin',",
            "    born: 1929",
            "},",
            "tags: [",
            "    'science fiction',",
            "    'politics'",
            "]",
        ]);

        // Graph: readers connected by edges, then a read edge to the book
        const gx = 1620;
        panel(s, t, gx, "Graph", "Edges connect one record to the next");
        const ana: Node = { x: gx + 200, y: 240, w: 260, h: 84 };
        const ben: Node = { x: gx + 520, y: 400, w: 260, h: 84 };
        const chloe: Node = { x: gx + 200, y: 560, w: 260, h: 84 };
        const book: Node = { x: gx + 500, y: 710, w: 300, h: 84 };
        const halo = t.panel;
        s.push(link(ana, ben, t.accent, { label: "knows", halo }));
        s.push(link(ben, chloe, t.accent, { label: "knows", halo }));
        s.push(link(chloe, book, t.accent, { label: "read", halo }));
        s.push(node(ana, "reader:ana", t, { state: "active", size: 26 }));
        s.push(node(ben, "reader:ben", t, { size: 26 }));
        s.push(node(chloe, "reader:chloe", t, { size: 26 }));
        s.push(node(book, "book:earthsea", t, { size: 26 }));

        s.push(
            text(
                60,
                910,
                "The records from the examples on the data models page. All three styles work in the same SurrealDB database.",
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(dataModelShapes, t, s.join(""));
    },
};

type Step = { label: string; sub: string; kind?: "ok" | "fail" };

// One transfer: the balances before, the statements inside the transaction,
// and the balances after
const transferRow = (
    s: string[],
    t: Theme,
    y: number,
    title: string,
    steps: Step[],
    end: { title: string; lines: string[]; ok: boolean },
) => {
    s.push(text(80, y - 80, title, { size: 32, fill: t.text, weight: 700, anchor: "start" }));
    const h = 160;
    card(s, t, 80, y, 300, "before", ["alice: 100", "bob: 20"], { titleColour: t.muted });

    const sx = 480;
    const sw = 320;
    const gap = 40;
    const boxW = steps.length * sw + (steps.length - 1) * gap + 60;
    s.push(
        rect(sx - 30, y - 20, boxW, h + 40, {
            fill: "none",
            stroke: t.line,
            dash: "12 10",
        }),
    );
    s.push(
        text(sx - 10, y - 30, "transaction", {
            size: 22,
            fill: t.muted,
            anchor: "start",
            font: MONO,
        }),
    );
    s.push(arrow(380, y + h / 2, sx - 36, y + h / 2, t.line, 4));
    steps.forEach((st, i) => {
        const x = sx + i * (sw + gap);
        const colour = st.kind === "ok" ? t.green : st.kind === "fail" ? t.red : t.text;
        const fill = st.kind === "ok" ? t.greenBg : st.kind === "fail" ? t.redBg : t.card;
        s.push(rect(x, y, sw, h, { fill, stroke: st.kind ? colour : undefined }));
        s.push(
            text(x + sw / 2, y + 66, st.label, {
                size: 28,
                fill: colour,
                weight: 700,
                font: MONO,
            }),
        );
        s.push(text(x + sw / 2, y + 112, st.sub, { size: 24, fill: t.muted }));
        if (i < steps.length - 1) {
            s.push(arrow(x + sw + 4, y + h / 2, x + sw + gap - 6, y + h / 2, t.line, 4));
        }
    });

    const ex = sx - 30 + boxW + 60;
    s.push(arrow(sx - 30 + boxW + 4, y + h / 2, ex - 6, y + h / 2, end.ok ? t.green : t.red, 4));
    card(s, t, ex, y, 340, end.title, end.lines, {
        stroke: end.ok ? t.green : t.red,
        titleColour: end.ok ? t.green : t.red,
    });
};

// The two transfers on the transactions page: one that commits, and one that
// THROW rolls back
const transactionCommitRollback: Figure = {
    name: "transaction-commit-rollback",
    width: 2040,
    height: 900,
    draw(t: Theme) {
        const s: string[] = [markers([t.line, t.green, t.red])];
        transferRow(
            s,
            t,
            180,
            "Move 30 from Alice to Bob",
            [
                { label: "alice -= 30", sub: "alice: 70, not saved yet" },
                { label: "bob += 30", sub: "bob: 50, not saved yet" },
                { label: "COMMIT", sub: "save both changes", kind: "ok" },
            ],
            { title: "committed", lines: ["alice: 70", "bob: 50"], ok: true },
        );
        transferRow(
            s,
            t,
            580,
            "Move 150 from Alice to Bob",
            [
                { label: "alice -= 150", sub: "alice: -50, not saved yet" },
                { label: "bob += 150", sub: "bob: 170, not saved yet" },
                { label: "THROW", sub: "alice's balance < 0", kind: "fail" },
            ],
            { title: "rolled back", lines: ["alice: 100", "bob: 20"], ok: false },
        );
        s.push(
            text(
                80,
                860,
                "Changes inside a transaction are saved only at COMMIT. When a statement fails, every change in the transaction is discarded.",
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(transactionCommitRollback, t, s.join(""));
    },
};

export default [dataModelShapes, transactionCommitRollback];
