// Figures for the beginner pages in agent-memory/index/welcome. They draw the example conversations
// on those pages, which are illustrative rather than output from a run.

import { arrow, type Figure, line, MONO, markers, rect, svg, type Theme, text } from "../lib";
import type { Verified } from "../provenance";

export const verified: Verified = {
    against: "the illustrative conversations on the memory basics pages",
    on: "2026-11-17",
};

const WIN_X = 460;
const WIN_W = 1860;
const ROW_H = 150;
const TURN_W = 34;
const TURN_GAP = 7;
const INSTR_W = 180;

const rowLabel = (s: string[], t: Theme, y: number, title: string, sub: string) => {
    s.push(text(80, y + 66, title, { size: 32, fill: t.text, weight: 700, anchor: "start" }));
    s.push(text(80, y + 106, sub, { size: 24, fill: t.muted, anchor: "start" }));
};

// One context window: the instructions, then a block per turn from `first`
// to `last`, with the turn about the allergy marked
const windowRow = (
    s: string[],
    t: Theme,
    y: number,
    turns: number[],
    o: { summary?: boolean; full?: boolean } = {},
) => {
    s.push(rect(WIN_X, y, WIN_W, ROW_H, { fill: t.panel, stroke: o.full ? t.red : t.line }));
    const by = y + 20;
    const bh = ROW_H - 40;
    s.push(rect(WIN_X + 20, by, INSTR_W, bh, { fill: t.card, r: 10 }));
    s.push(
        text(WIN_X + 20 + INSTR_W / 2, by + bh / 2 + 9, "instructions", {
            size: 24,
            fill: t.muted,
        }),
    );
    let x = WIN_X + 20 + INSTR_W + 14;
    if (o.summary) {
        const sw = 820;
        s.push(rect(x, by, sw, bh, { fill: t.accentBg, stroke: t.accent, r: 10 }));
        s.push(
            text(x + 24, by + 44, "summary of turns 1-30:", {
                size: 24,
                fill: t.accent,
                weight: 700,
                anchor: "start",
            }),
        );
        s.push(
            text(x + 24, by + 82, "dinner party for 8 on Saturday, menu chosen, wine ordered", {
                size: 23,
                fill: t.text,
                anchor: "start",
            }),
        );
        x += sw + 14;
    }
    for (const n of turns) {
        const allergy = n === 3;
        s.push(
            rect(x, by, TURN_W, bh, {
                fill: allergy ? t.redBg : t.card,
                stroke: allergy ? t.red : undefined,
                r: 6,
            }),
        );
        if (allergy) {
            s.push(
                text(x + TURN_W / 2, y - 14, "turn 3: “I'm allergic to peanuts”", {
                    size: 22,
                    fill: t.red,
                    weight: 600,
                    anchor: "start",
                }),
            );
        }
        x += TURN_W + TURN_GAP;
    }
    return x;
};

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// A context window filling over a long conversation, and compaction
// replacing the early turns with a summary that leaves out the allergy
const contextWindowCompaction: Figure = {
    name: "context-window-compaction",
    width: 2400,
    height: 1080,
    draw(t: Theme) {
        const s: string[] = [];
        s.push(
            text(WIN_X, 60, "The context window: everything the model reads in one request", {
                size: 30,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );

        rowLabel(s, t, 110, "Turn 3", "plenty of room");
        windowRow(s, t, 110, range(1, 3));

        rowLabel(s, t, 330, "Turn 20", "half full");
        windowRow(s, t, 330, range(1, 20));

        rowLabel(s, t, 550, "Turn 40", "full");
        windowRow(s, t, 550, range(1, 40), { full: true });

        rowLabel(s, t, 770, "After compaction", "turns 1-30 summarised");
        const end = windowRow(s, t, 770, range(31, 40), { summary: true });
        s.push(
            text((end + WIN_X + WIN_W) / 2, 770 + ROW_H / 2 + 9, "room for new turns", {
                size: 24,
                fill: t.muted,
            }),
        );
        s.push(
            text(
                WIN_X + 214,
                770 + ROW_H + 44,
                "The summary keeps the plan, and the peanut allergy from turn 3 is gone.",
                {
                    size: 26,
                    fill: t.red,
                    weight: 600,
                    anchor: "start",
                },
            ),
        );

        s.push(
            text(
                80,
                1040,
                "Illustrative: a conversation about planning a dinner party. Each narrow block is one turn, and the sizes are not to scale.",
                { size: 24, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(contextWindowCompaction, t, s.join(""));
    },
};

const PANEL_Y = 380;
const PANEL_H = 600;

const panel = (s: string[], t: Theme, x: number, title: string) => {
    s.push(rect(x, PANEL_Y, 720, PANEL_H, { fill: t.panel }));
    s.push(text(x + 360, PANEL_Y + 64, title, { size: 32, fill: t.text, weight: 700 }));
};

const answer = (s: string[], t: Theme, x: number, label: string, kind: "ok" | "bad" | "maybe") => {
    const colour = kind === "ok" ? t.green : kind === "bad" ? t.red : t.muted;
    const fill = kind === "ok" ? t.greenBg : kind === "bad" ? t.redBg : t.card;
    s.push(rect(x + 40, PANEL_Y + PANEL_H - 130, 640, 90, { fill, stroke: colour, r: 14 }));
    s.push(text(x + 360, PANEL_Y + PANEL_H - 74, label, { size: 26, fill: colour, weight: 700 }));
};

const passage = (s: string[], t: Theme, x: number, y: number, score: string, quote: string) => {
    s.push(rect(x + 40, y, 640, 100, { fill: t.card, r: 12 }));
    s.push(
        text(x + 70, y + 60, score, {
            size: 28,
            fill: t.accent,
            weight: 700,
            anchor: "start",
            font: MONO,
        }),
    );
    s.push(text(x + 180, y + 60, quote, { size: 24, fill: t.text, anchor: "start" }));
};

// One question answered from the same conversation by the three kinds of
// memory on the From context to memory page
const memoryThreeApproaches: Figure = {
    name: "memory-three-approaches",
    width: 2400,
    height: 1120,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        // The one conversation that each kind of memory below has stored
        const said: [string, string][] = [
            ["turn 3", "Sam: \u201cI live in Oslo.\u201d"],
            ["turn 41", "Sam: \u201cWe moved to Bergen last month.\u201d"],
            ["turn 60", "Sam: \u201cRestaurants near home?\u201d"],
        ];
        const cardX = 560;
        const cardW = 1280;
        s.push(rect(cardX, 40, cardW, 236, { fill: t.card }));
        said.forEach(([turn, quote], i) => {
            const y = 100 + i * 62;
            const last = i === said.length - 1;
            s.push(
                text(cardX + 40, y, turn, { size: 24, fill: t.muted, anchor: "start", font: MONO }),
            );
            s.push(
                text(cardX + 200, y, quote, {
                    size: 28,
                    fill: last ? t.accent : t.text,
                    weight: 600,
                    anchor: "start",
                }),
            );
        });
        for (const px of [420, 1200, 1980]) {
            s.push(arrow(1200, 280, px, PANEL_Y - 12, t.line, 4));
        }

        // Reloading the transcript
        const ax = 60;
        panel(s, t, ax, "Reloading the transcript");
        s.push(
            rect(ax + 40, PANEL_Y + 110, 640, 110, { fill: t.accentBg, stroke: t.accent, r: 12 }),
        );
        s.push(
            text(ax + 70, PANEL_Y + 156, "summary of turns 1-40", {
                size: 24,
                fill: t.accent,
                weight: 700,
                anchor: "start",
            }),
        );
        s.push(
            text(ax + 70, PANEL_Y + 194, "turn 3 is no longer there", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(rect(ax + 40, PANEL_Y + 240, 640, 100, { fill: t.card, r: 12 }));
        s.push(
            text(ax + 70, PANEL_Y + 300, "turns 41-59, as they were said", {
                size: 24,
                fill: t.text,
                anchor: "start",
            }),
        );
        s.push(
            text(ax + 360, PANEL_Y + 400, "Turn 41 is recent, so it still fits.", {
                size: 24,
                fill: t.muted,
            }),
        );
        answer(s, t, ax, "Bergen, until turn 41 is compacted", "maybe");

        // Retrieval with embeddings
        const bx = 840;
        panel(s, t, bx, "Retrieval with embeddings");
        passage(s, t, bx, PANEL_Y + 110, "0.83", "“I live in Oslo.”");
        passage(s, t, bx, PANEL_Y + 230, "0.79", "“We moved to Bergen last month.”");
        s.push(
            text(bx + 360, PANEL_Y + 400, "Both are about where Sam lives.", {
                size: 24,
                fill: t.muted,
            }),
        );
        answer(s, t, bx, "A guess between Oslo and Bergen", "bad");

        // Structured memory
        const cx = 1620;
        panel(s, t, cx, "Structured memory");
        s.push(rect(cx + 40, PANEL_Y + 110, 640, 250, { fill: t.card, r: 12 }));
        s.push(
            text(cx + 70, PANEL_Y + 160, "Sam", {
                size: 30,
                fill: t.accent,
                weight: 700,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(cx + 70, PANEL_Y + 214, "home city: Bergen", {
                size: 26,
                fill: t.text,
                weight: 600,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(cx + 70, PANEL_Y + 250, "from October", {
                size: 22,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(cx + 70, PANEL_Y + 300, "home city: Oslo", {
                size: 26,
                fill: t.muted,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(cx + 70, PANEL_Y + 336, "closed in October", {
                size: 22,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(cx + 360, PANEL_Y + 400, "One current value, and the old one kept.", {
                size: 24,
                fill: t.muted,
            }),
        );
        answer(s, t, cx, "Bergen", "ok");

        s.push(
            text(
                60,
                1080,
                "Illustrative: the similarity scores and dates are examples, not output from a run.",
                {
                    size: 24,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(memoryThreeApproaches, t, s.join(""));
    },
};

// Embeddings drawn as points in three directions: a cube seen at an angle
const project = (x: number, y: number, z: number): [number, number] => [
    260 + x * 1000 + z * 480,
    940 - y * 600 - z * 300,
];

type Point = {
    at: [number, number, number];
    label: string;
    score?: string;
    dx: number;
    dy: number;
    anchor: "start" | "end" | "middle";
    kind: "question" | "close" | "useful" | "far";
};

// The passages from Sam's conversation on the From context to memory page,
// placed by hand to show which are close in meaning to the question
const embeddingSpace: Figure = {
    name: "embedding-space",
    width: 2400,
    height: 1080,
    draw(t: Theme) {
        const s: string[] = [];
        const corner = (x: number, y: number, z: number) => project(x, y, z);
        const edge = (a: [number, number, number], b: [number, number, number], dash?: string) => {
            const [x1, y1] = corner(...a);
            const [x2, y2] = corner(...b);
            s.push(line(x1, y1, x2, y2, t.grid, 3, dash));
        };
        // Edges at the back of the cube are dashed, and the front ones solid
        edge([0, 0, 1], [1, 0, 1], "10 10");
        edge([0, 0, 1], [0, 1, 1], "10 10");
        edge([0, 0, 0], [0, 0, 1], "10 10");
        edge([1, 0, 1], [1, 1, 1]);
        edge([0, 1, 1], [1, 1, 1]);
        edge([1, 0, 0], [1, 0, 1]);
        edge([0, 1, 0], [0, 1, 1]);
        edge([1, 1, 0], [1, 1, 1]);
        edge([0, 0, 0], [1, 0, 0]);
        edge([0, 0, 0], [0, 1, 0]);
        edge([1, 0, 0], [1, 1, 0]);
        edge([0, 1, 0], [1, 1, 0]);

        const points: Point[] = [
            {
                at: [0.55, 0.55, 0.4],
                label: "Restaurants near home?",
                dx: 30,
                dy: 60,
                anchor: "start",
                kind: "question",
            },
            {
                at: [0.47, 0.63, 0.47],
                label: "I live in Oslo.",
                score: "0.83",
                dx: -30,
                dy: -26,
                anchor: "end",
                kind: "close",
            },
            {
                at: [0.63, 0.62, 0.33],
                label: "We moved to Bergen last month.",
                score: "0.79",
                dx: 32,
                dy: -14,
                anchor: "start",
                kind: "close",
            },
            {
                at: [0.1, 0.2, 0.1],
                label: "Bill's Pizza is on Strandgaten in Bergen.",
                score: "0.52",
                dx: 0,
                dy: 64,
                anchor: "start",
                kind: "useful",
            },
            {
                at: [0.95, 0.1, 0.9],
                label: "The meeting moved to Friday.",
                score: "0.12",
                dx: -34,
                dy: 54,
                anchor: "end",
                kind: "far",
            },
            {
                at: [0.2, 0.95, 0.85],
                label: "Bring an umbrella tomorrow.",
                score: "0.09",
                dx: 30,
                dy: 10,
                anchor: "start",
                kind: "far",
            },
        ];
        const [qx, qy] = project(...points[0].at);
        for (const p of points.slice(1)) {
            const [px, py] = project(...p.at);
            s.push(line(qx, qy, px, py, p.kind === "far" ? t.grid : t.line, 3, "8 8"));
        }
        for (const p of points) {
            const [px, py] = project(...p.at);
            const r = 14 + (1 - p.at[2]) * 10;
            const fill =
                p.kind === "question"
                    ? t.accent
                    : p.kind === "close"
                      ? t.red
                      : p.kind === "useful"
                        ? t.green
                        : t.muted;
            s.push(`<circle cx="${px}" cy="${py}" r="${r}" fill="${fill}"/>`);
            const label = p.score ? `${p.label}  ${p.score}` : p.label;
            s.push(
                text(px + p.dx, py + p.dy, label, {
                    size: p.kind === "question" ? 30 : 26,
                    fill: p.kind === "far" ? t.muted : t.text,
                    weight: p.kind === "question" ? 700 : 600,
                    anchor: p.anchor,
                    halo: t.bg,
                }),
            );
        }

        const lx = 1840;
        const legend: [string, string][] = [
            [t.accent, "The question"],
            [t.red, "Close to the question and to each other"],
            [t.green, "Helps answer it, but is farther away"],
            [t.muted, "Unrelated"],
        ];
        s.push(
            text(lx, 200, "Similarity to the question", {
                size: 28,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );
        legend.forEach(([c, l], i) => {
            const y = 270 + i * 64;
            s.push(`<circle cx="${lx + 14}" cy="${y - 9}" r="14" fill="${c}"/>`);
            s.push(text(lx + 44, y, l, { size: 24, fill: t.text, anchor: "start" }));
        });
        s.push(
            text(lx, 590, "Closer points have more", { size: 24, fill: t.muted, anchor: "start" }),
        );
        s.push(
            text(lx, 626, "similar meanings. A real", { size: 24, fill: t.muted, anchor: "start" }),
        );
        s.push(
            text(lx, 662, "embedding has hundreds", { size: 24, fill: t.muted, anchor: "start" }),
        );
        s.push(
            text(lx, 698, "of directions, not three.", {
                size: 24,
                fill: t.muted,
                anchor: "start",
            }),
        );

        s.push(
            text(
                60,
                1050,
                "Illustrative: the positions and similarity scores are examples, not output from an embedding model.",
                {
                    size: 24,
                    fill: t.muted,
                    anchor: "start",
                },
            ),
        );
        return svg(embeddingSpace, t, s.join(""));
    },
};

export default [contextWindowCompaction, embeddingSpace, memoryThreeApproaches];
