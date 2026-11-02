// Number figures for reference/query-language/functions/database-functions/math
// and reference/query-language/language-primitives/data-types/ranges. Values are
// the outputs of each page's examples on SurrealDB 4.0.

import { circle, type Figure, line, MONO, path, rect, svg, type Theme, text } from "../lib";

// [1, 40, 60, 10, 2, 901], the array every quartile example on the math page uses
const DATA = [1, 2, 10, 40, 60, 901];
const Q1 = 4;
const MEDIAN = 25;
const Q3 = 55;

const percentiles: Figure = {
    name: "math-percentiles",
    width: 2400,
    height: 1100,
    draw(t: Theme) {
        const s: string[] = [];
        // A broken axis: 0 to 70 is drawn to scale, and 901 sits past the break
        const L = 120;
        const R = 1560;
        const BREAK = 1640;
        const X = (v: number) =>
            v <= 70 ? L + (v / 70) * (R - L) : BREAK + 140 + ((v - 150) / (901 - 150)) * 400;
        const axisY = 640;
        s.push(line(L, axisY, R, axisY, t.line, 3));
        s.push(line(BREAK + 60, axisY, X(901) + 40, axisY, t.line, 3));
        s.push(
            path(`M${R + 20},${axisY + 18} l20,-36 M${R + 46},${axisY + 18} l20,-36`, {
                stroke: t.muted,
                strokeWidth: 3,
            }),
        );
        for (const v of [0, 10, 20, 30, 40, 50, 60, 70]) {
            s.push(line(X(v), axisY, X(v), axisY + 14, t.line, 2));
            s.push(text(X(v), axisY + 50, String(v), { size: 24, fill: t.muted }));
        }
        s.push(text(X(901), axisY + 50, "901", { size: 24, fill: t.muted }));
        // The six values, sorted
        for (const v of DATA) {
            s.push(circle(X(v), axisY, 14, t.text));
        }
        s.push(
            text(L, axisY + 150, "the array, sorted: [1, 2, 10, 40, 60, 901]", {
                size: 26,
                fill: t.muted,
                anchor: "start",
                font: MONO,
            }),
        );
        // Box plot from Q1 to Q3, with the median
        const boxY = 440;
        s.push(
            rect(X(Q1), boxY - 70, X(Q3) - X(Q1), 140, {
                fill: t.accentBg,
                stroke: t.accent,
                r: 10,
            }),
        );
        s.push(line(X(MEDIAN), boxY - 70, X(MEDIAN), boxY + 70, t.accent, 6));
        s.push(line(X(1), boxY, X(Q1), boxY, t.line, 3));
        s.push(line(X(Q3), boxY, R, boxY, t.line, 3));
        s.push(line(BREAK + 60, boxY, X(901), boxY, t.line, 3));
        s.push(line(X(1), boxY - 30, X(1), boxY + 30, t.line, 3));
        s.push(line(X(901), boxY - 30, X(901), boxY + 30, t.line, 3));
        const above = (v: number, y: number, label: string, colour = t.text) => {
            s.push(line(X(v), y + 12, X(v), boxY - 72, t.grid, 2, "4 6"));
            s.push(text(X(v), y, label, { size: 24, fill: colour, weight: 600, font: MONO }));
        };
        above(Q1, 300, "Q1 = 4");
        above(MEDIAN, 240, "median = 25", t.accent);
        above(Q3, 300, "Q3 = 55");
        // Interpolation between the two middle values
        s.push(
            path(`M${X(10)},${axisY - 24} Q${X(MEDIAN)},${axisY - 70} ${X(40)},${axisY - 24}`, {
                stroke: t.accent,
                strokeWidth: 3,
                dash: "8 6",
            }),
        );
        s.push(
            text(X(MEDIAN), axisY - 62, "halfway between 10 and 40", {
                size: 22,
                fill: t.accent,
                halo: t.bg,
            }),
        );
        s.push(
            text(X(40), axisY + 88, "nearestrank(50) = 40", {
                size: 22,
                fill: t.text,
                weight: 600,
                font: MONO,
                halo: t.bg,
            }),
        );
        // Mean, pulled up by 901
        s.push(
            text(X(169), boxY - 120, "mean = 169", {
                size: 24,
                fill: t.red,
                weight: 600,
                font: MONO,
            }),
        );
        s.push(line(X(169), boxY - 100, X(169), axisY, t.red, 2, "4 6"));
        s.push(
            text(BREAK + 40, 120, "Sorted values of", {
                size: 30,
                fill: t.text,
                weight: 600,
                anchor: "start",
            }),
        );
        s.push(
            text(BREAK + 40, 162, "[1, 40, 60, 10, 2, 901]", {
                size: 28,
                fill: t.text,
                weight: 600,
                anchor: "start",
                font: MONO,
            }),
        );
        // Results table
        const rows: [string, string][] = [
            ["percentile(50)", "25"],
            ["nearestrank(50)", "40"],
            ["interquartile", "51  (55 - 4)"],
            ["midhinge", "29.5  ((4 + 55) / 2)"],
            ["trimean", "27.25"],
            ["spread", "900  (901 - 1)"],
            ["mean", "169"],
        ];
        rows.forEach(([fn, v], i) => {
            const y = 850 + i * 36;
            s.push(
                text(L, y, `math::${fn}`, { size: 24, fill: t.text, anchor: "start", font: MONO }),
            );
            s.push(
                text(L + 460, y, v, {
                    size: 24,
                    fill: fn === "mean" ? t.red : t.muted,
                    anchor: "start",
                    font: MONO,
                }),
            );
        });
        s.push(
            text(1100, 860, "The quartiles ignore how far 901 is from the rest,", {
                size: 26,
                fill: t.text,
                anchor: "start",
            }),
        );
        s.push(
            text(1100, 898, "while the mean moves towards it.", {
                size: 26,
                fill: t.text,
                anchor: "start",
            }),
        );
        return svg(percentiles, t, s.join(""));
    },
};

// One number line per bound form on the ranges page
const RANGE_FORMS: [string, boolean, boolean, number | null, number | null][] = [
    ["0..10", true, false, 0, 10],
    ["0..=10", true, true, 0, 10],
    ["0>..10", false, false, 0, 10],
    ["0>..=10", false, true, 0, 10],
    ["0..", true, false, 0, null],
    ["..=10", false, true, null, 10],
];

const ranges: Figure = {
    name: "range-bounds",
    width: 2000,
    height: 980,
    draw(t: Theme) {
        const s: string[] = [];
        const L = 520;
        const R = 1880;
        const X = (v: number) => L + 60 + ((v + 2) / 14) * (R - L - 120);
        RANGE_FORMS.forEach(([form, incLo, incHi, lo, hi], i) => {
            const y = 90 + i * 130;
            s.push(
                text(80, y + 12, form, {
                    size: 34,
                    fill: t.accent,
                    weight: 700,
                    anchor: "start",
                    font: MONO,
                }),
            );
            s.push(line(L, y, R, y, t.grid, 2));
            for (let v = -2; v <= 12; v += 2)
                s.push(text(X(v), y + 50, String(v), { size: 20, fill: t.muted }));
            const x1 = lo === null ? L : X(lo);
            const x2 = hi === null ? R : X(hi);
            s.push(line(x1, y, x2, y, t.accent, 10));
            if (lo === null) s.push(path(`M${L + 4},${y} l26,-16 v32 z`, { fill: t.accent }));
            if (hi === null) s.push(path(`M${R - 4},${y} l-26,-16 v32 z`, { fill: t.accent }));
            if (lo !== null) s.push(circle(X(lo), y, 15, incLo ? t.accent : t.bg, t.accent, 5));
            if (hi !== null) s.push(circle(X(hi), y, 15, incHi ? t.accent : t.bg, t.accent, 5));
        });
        s.push(circle(100, 890, 15, t.accent, t.accent, 5));
        s.push(text(130, 900, "bound included", { size: 26, fill: t.muted, anchor: "start" }));
        s.push(circle(420, 890, 15, t.bg, t.accent, 5));
        s.push(text(450, 900, "bound excluded", { size: 26, fill: t.muted, anchor: "start" }));
        s.push(
            text(
                80,
                950,
                "A range covers every value between its bounds, so 9.5 IN 0..10 and 0.5 IN 0>..10 are both true.",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        return svg(ranges, t, s.join(""));
    },
};

export default [percentiles, ranges];
