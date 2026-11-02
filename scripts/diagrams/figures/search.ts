// Full-text and hybrid search figures for learn/data-models/full-text-search and
// learn/data-models/vector-search. Every value is the output of the page's own
// example, checked against a SurrealDB 4.0 server.

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

// BM25 inverse document frequency before and from 4.0. Both depend on N and n
// only through g = (n + 0.5) / (N + 1):
//   from 4.0:   ln(1 + (N - n + 0.5) / (n + 0.5)) = ln(1 / g)
//   before 4.0: max(0, ln((N - n + 0.5) / (n + 0.5))) = max(0, ln(1 / g - 1))
const idf: Figure = {
    name: "bm25-idf",
    width: 2000,
    height: 1100,
    draw(t: Theme) {
        const s: string[] = [];
        const P = { x: 220, y: 120, w: 1660, h: 760 };
        const gMin = 0.04;
        const yMax = 3.4;
        const X = (g: number) => P.x + ((g - gMin) / (1 - gMin)) * P.w;
        const Y = (v: number) => P.y + P.h - (v / yMax) * P.h;
        for (let v = 0; v <= 3; v++) {
            s.push(line(P.x, Y(v), P.x + P.w, Y(v), t.grid, 1.5, v ? "6 8" : undefined));
            s.push(
                text(P.x - 24, Y(v) + 10, String(v), { size: 28, fill: t.muted, anchor: "end" }),
            );
        }
        for (const g of [0.25, 0.5, 0.75, 1]) {
            s.push(
                text(X(g), P.y + P.h + 50, `${Math.round(g * 100)}%`, { size: 28, fill: t.muted }),
            );
        }
        s.push(
            text(
                P.x + P.w / 2,
                P.y + P.h + 110,
                "share of documents holding the term, (n + 0.5) / (N + 1)",
                { size: 30, fill: t.text },
            ),
        );
        s.push(
            `<text x="70" y="${P.y + P.h / 2}" font-family="-apple-system, sans-serif" font-size="30" fill="${t.text}" text-anchor="middle" transform="rotate(-90 70 ${P.y + P.h / 2})">term weight (IDF)</text>`,
        );
        const curve = (f: (g: number) => number, from: number, to: number) =>
            Array.from({ length: 200 }, (_, i) => from + ((to - from) * i) / 199)
                .map(
                    (g, i) =>
                        `${i ? "L" : "M"}${X(g).toFixed(1)},${Y(Math.min(f(g), yMax)).toFixed(1)}`,
                )
                .join("");
        // Before 4.0: falls to zero at half the documents and stays there
        s.push(
            path(
                curve((g) => Math.log(1 / g - 1), gMin, 0.5),
                { stroke: t.muted, strokeWidth: 5, dash: "14 10" },
            ),
        );
        s.push(line(X(0.5), Y(0), X(1), Y(0), t.red, 6));
        s.push(
            path(
                curve((g) => Math.log(1 / g), gMin, 1),
                { stroke: t.accent, strokeWidth: 6 },
            ),
        );
        // The page's two datasets: n = 2 of N = 3, then of N = 7
        const pts: [number, number, string][] = [
            [2, 3, "2 of 3 documents"],
            [2, 7, "2 of 7 documents"],
        ];
        for (const [n, N, label] of pts) {
            const g = (n + 0.5) / (N + 1);
            const after = Math.log(1 / g);
            const before = Math.max(0, Math.log(1 / g - 1));
            s.push(line(X(g), Y(0), X(g), Y(after), t.line, 2, "4 6"));
            s.push(circle(X(g), Y(after), 12, t.accent));
            s.push(circle(X(g), Y(before), 12, before ? t.muted : t.red));
            s.push(
                text(X(g) + 22, Y(after) - 18, `${label}: ${after.toFixed(2)} from 4.0`, {
                    size: 28,
                    fill: t.text,
                    weight: 600,
                    anchor: "start",
                    halo: t.bg,
                }),
            );
            s.push(
                text(
                    X(g) - 22,
                    before ? Y(before) + 10 : Y(0) - 22,
                    before ? `${before.toFixed(2)} before 4.0` : "0 before 4.0",
                    {
                        size: 28,
                        fill: before ? t.muted : t.red,
                        weight: 600,
                        anchor: "end",
                        halo: t.bg,
                    },
                ),
            );
        }
        s.push(
            text(X(0.85), Y(0) - 22, "clamped to 0 before 4.0", {
                size: 28,
                fill: t.red,
                weight: 600,
            }),
        );
        // Legend
        s.push(line(P.x + 40, 70, P.x + 110, 70, t.accent, 6));
        s.push(
            text(P.x + 128, 80, "SurrealDB 4.0 and later", {
                size: 28,
                fill: t.text,
                anchor: "start",
            }),
        );
        s.push(line(P.x + 520, 70, P.x + 590, 70, t.muted, 5, "14 10"));
        s.push(text(P.x + 608, 80, "before 4.0", { size: 28, fill: t.text, anchor: "start" }));
        return svg(idf, t, s.join(""));
    },
};

// The analyzer pipeline, one stage per row, from the same analyzer applied to a
// document and to a query.
const STAGES: [string, string[]][] = [
    ["input", ["Looking at the Cafés running late"]],
    ["TOKENIZERS class", ["Looking", "at", "the", "Cafés", "running", "late"]],
    ["FILTERS lowercase", ["looking", "at", "the", "cafés", "running", "late"]],
    ["ascii", ["looking", "at", "the", "cafes", "running", "late"]],
    ["snowball(english)", ["look", "at", "the", "cafe", "run", "late"]],
];

const analyzer: Figure = {
    name: "analyzer-pipeline",
    width: 2200,
    height: 1120,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        const X0 = 560;
        const TW = 250;
        STAGES.forEach(([stage, tokens], i) => {
            const y = 70 + i * 170;
            s.push(
                text(X0 - 40, y + 62, stage, {
                    size: 30,
                    fill: i ? t.accent : t.muted,
                    weight: 600,
                    anchor: "end",
                    font: MONO,
                }),
            );
            if (i === 0) {
                s.push(rect(X0, y, 6 * TW + 5 * 20, 100, { fill: t.panel }));
                s.push(
                    text(X0 + 24, y + 62, `'${tokens[0]}'`, {
                        size: 34,
                        fill: t.text,
                        anchor: "start",
                        font: MONO,
                    }),
                );
            } else {
                const prev = STAGES[i - 1][1];
                tokens.forEach((tok, j) => {
                    const changed = i > 1 && prev[j] !== tok;
                    s.push(
                        rect(X0 + j * (TW + 20), y, TW, 100, {
                            fill: changed ? t.accentBg : t.card,
                            stroke: changed ? t.accent : undefined,
                        }),
                    );
                    s.push(
                        text(X0 + j * (TW + 20) + TW / 2, y + 62, `'${tok}'`, {
                            size: 32,
                            fill: t.text,
                            font: MONO,
                        }),
                    );
                });
            }
            if (i < STAGES.length - 1)
                s.push(arrow(X0 - 120, y + 108, X0 - 120, y + 162, t.line, 3));
        });
        const y = 70 + STAGES.length * 170 + 10;
        s.push(
            text(X0 - 40, y + 62, "a query", {
                size: 30,
                fill: t.muted,
                weight: 600,
                anchor: "end",
                font: MONO,
            }),
        );
        s.push(rect(X0, y, 380, 100, { fill: t.panel }));
        s.push(
            text(X0 + 24, y + 62, "'late café'", {
                size: 34,
                fill: t.text,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(arrow(X0 + 400, y + 50, X0 + 500, y + 50, t.line, 3));
        ["late", "cafe"].forEach((tok, j) => {
            const x = X0 + 520 + j * (TW + 20);
            s.push(rect(x, y, TW, 100, { fill: t.accentBg, stroke: t.accent }));
            s.push(text(x + TW / 2, y + 62, `'${tok}'`, { size: 32, fill: t.text, font: MONO }));
        });
        s.push(
            text(X0 + 520 + 2 * (TW + 20) + 10, y + 62, "the same analyzer, so 'cafe' matches", {
                size: 28,
                fill: t.muted,
                anchor: "start",
            }),
        );
        return svg(analyzer, t, s.join(""));
    },
};

// search::rrf over the vector and full-text results of the hybrid-search example
const rrf: Figure = {
    name: "rrf-fusion",
    width: 2200,
    height: 820,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        const col = (x: number, title: string, sub: string, rows: [string, string][]) => {
            s.push(text(x, 90, title, { size: 34, fill: t.text, weight: 600, anchor: "start" }));
            s.push(text(x, 132, sub, { size: 26, fill: t.muted, anchor: "start", font: MONO }));
            rows.forEach(([id, note], i) => {
                const y = 180 + i * 150;
                s.push(rect(x, y, 520, 116, { fill: t.card }));
                s.push(
                    text(x + 30, y + 52, `${i + 1}`, {
                        size: 30,
                        fill: t.muted,
                        weight: 600,
                        anchor: "start",
                    }),
                );
                s.push(
                    text(x + 80, y + 52, id, {
                        size: 32,
                        fill: t.text,
                        weight: 600,
                        anchor: "start",
                        font: MONO,
                    }),
                );
                s.push(
                    text(x + 80, y + 92, note, {
                        size: 26,
                        fill: t.muted,
                        anchor: "start",
                        font: MONO,
                    }),
                );
            });
        };
        col(80, "Vector search", "embedding <|2,100|> $qvec", [
            ["test:1", "1 / (60 + 1) = 0.0164"],
            ["test:3", "1 / (60 + 2) = 0.0161"],
        ]);
        col(820, "Full-text search", "text @1@ 'graph'", [["test:1", "1 / (60 + 1) = 0.0164"]]);
        s.push(
            text(820, 520, "'graphs' in test:3 is not 'graph',", {
                size: 26,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(820, 556, "because this analyzer does not stem", {
                size: 26,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(1560, 90, "search::rrf([$vs, $ft], 2, 60)", {
                size: 30,
                fill: t.accent,
                weight: 600,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(1560, 132, "sum of 1 / (k + rank) over both lists", {
                size: 26,
                fill: t.muted,
                anchor: "start",
            }),
        );
        const fused: [string, string][] = [
            ["test:1", "0.0164 + 0.0164 = 0.0328"],
            ["test:3", "0.0161"],
        ];
        fused.forEach(([id, note], i) => {
            const y = 180 + i * 150;
            s.push(rect(1560, y, 560, 116, { fill: t.accentBg, stroke: t.accent }));
            s.push(
                text(1590, y + 52, `${i + 1}`, {
                    size: 30,
                    fill: t.accent,
                    weight: 600,
                    anchor: "start",
                }),
            );
            s.push(
                text(1640, y + 52, id, {
                    size: 32,
                    fill: t.text,
                    weight: 600,
                    anchor: "start",
                    font: MONO,
                }),
            );
            s.push(
                text(1640, y + 92, note, { size: 26, fill: t.muted, anchor: "start", font: MONO }),
            );
        });
        s.push(text(1450, 260, "→", { size: 60, fill: t.line, weight: 300 }));
        s.push(
            text(
                80,
                700,
                "A record found by both searches collects a share from each list, so test:1 ranks first.",
                { size: 30, fill: t.text, anchor: "start" },
            ),
        );
        s.push(
            text(80, 746, "test:3 is still returned, from the vector list alone.", {
                size: 30,
                fill: t.text,
                anchor: "start",
            }),
        );
        return svg(rrf, t, s.join(""));
    },
};

// The filtered KNN example on learn/data-models/vector-search/similarity-search:
// four actors, K = 2, flag = true. Distances are Euclidean from $person_embedding.
const ACTORS: [string, number, boolean][] = [
    ["actor:1", 0.1, true],
    ["actor:2", Math.sqrt(0.05), false],
    ["actor:4", Math.sqrt(0.17), true],
    ["actor:3", Math.sqrt(0.21), true],
];

const knnFilter: Figure = {
    name: "knn-filter",
    width: 2200,
    height: 980,
    draw(t: Theme) {
        const s: string[] = [];
        const X = (d: number) => 140 + (d / 0.5) * 1900;
        const row = (
            y: number,
            title: string,
            taken: string[],
            skipped: string[],
            result: string,
            ok: boolean,
        ) => {
            s.push(text(80, y, title, { size: 34, fill: t.text, weight: 600, anchor: "start" }));
            s.push(line(X(0), y + 120, X(0.5), y + 120, t.line, 3));
            s.push(circle(X(0), y + 120, 14, t.text));
            s.push(text(X(0), y + 180, "query", { size: 26, fill: t.muted }));
            for (const [id, d, flag] of ACTORS) {
                const isTaken = taken.includes(id);
                const isSkipped = skipped.includes(id);
                if (isTaken)
                    s.push(
                        rect(X(d) - 90, y + 64, 180, 112, {
                            fill: flag ? t.accentBg : t.redBg,
                            stroke: flag ? t.accent : t.red,
                            r: 16,
                        }),
                    );
                s.push(
                    circle(X(d), y + 120, 16, flag ? t.accent : t.bg, flag ? t.accent : t.red, 5),
                );
                if (isSkipped)
                    s.push(text(X(d), y + 132, "×", { size: 40, fill: t.red, weight: 700 }));
                s.push(
                    text(X(d), y + 210, id, { size: 28, fill: t.text, weight: 600, font: MONO }),
                );
                s.push(text(X(d), y + 248, d.toFixed(2), { size: 26, fill: t.muted, font: MONO }));
            }
            s.push(
                text(2120, y, result, {
                    size: 30,
                    fill: ok ? t.green : t.red,
                    weight: 600,
                    anchor: "end",
                }),
            );
        };
        row(
            80,
            "If the filter ran after the search",
            ["actor:1", "actor:2"],
            [],
            "1 result: actor:2 used a slot, then failed",
            false,
        );
        row(
            500,
            "SurrealDB filters during the search",
            ["actor:1", "actor:4"],
            ["actor:2"],
            "2 results: actor:1 and actor:4",
            true,
        );
        s.push(circle(100, 920, 14, t.accent, t.accent, 5));
        s.push(text(126, 930, "flag = true", { size: 28, fill: t.muted, anchor: "start" }));
        s.push(circle(360, 920, 14, t.bg, t.red, 5));
        s.push(text(386, 930, "flag = false", { size: 28, fill: t.muted, anchor: "start" }));
        s.push(rect(620, 900, 60, 40, { fill: t.accentBg, stroke: t.accent, r: 10 }));
        s.push(
            text(696, 930, "one of the K = 2 result slots", {
                size: 28,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(2120, 930, "distance from the query, Euclidean", {
                size: 28,
                fill: t.muted,
                anchor: "end",
            }),
        );
        return svg(knnFilter, t, s.join(""));
    },
};

export default [idf, analyzer, rrf, knnFilter];
