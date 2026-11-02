// Array and set figures for reference/query-language/functions/database-functions/array
// and set. Every result is the output of the page's example on SurrealDB 4.0.

import { type Figure, MONO, rect, svg, type Theme, text } from "../lib";

// [1, 2, 3, 4] against [3, 4, 5, 6], the inputs the array and set pages share
const venn: Figure = {
    name: "array-set-operations",
    width: 2400,
    height: 760,
    draw(t: Theme) {
        const s: string[] = [];
        const ops: [string, string, ("a" | "both" | "b")[]][] = [
            ["difference", "[1, 2, 5, 6]", ["a", "b"]],
            ["complement", "[1, 2]", ["a"]],
            ["intersect", "[3, 4]", ["both"]],
            ["union", "[1, 2, 3, 4, 5, 6]", ["a", "both", "b"]],
        ];
        ops.forEach(([name, result, regions], k) => {
            const cx = 300 + k * 600;
            const cy = 330;
            const r = 170;
            const ax = cx - 90;
            const bx = cx + 90;
            const id = `${t.name}-${name}`;
            s.push(
                `<defs><clipPath id="a-${id}"><circle cx="${ax}" cy="${cy}" r="${r}"/></clipPath><clipPath id="b-${id}"><circle cx="${bx}" cy="${cy}" r="${r}"/></clipPath><mask id="na-${id}"><rect x="0" y="0" width="2400" height="760" fill="white"/><circle cx="${ax}" cy="${cy}" r="${r}" fill="black"/></mask><mask id="nb-${id}"><rect x="0" y="0" width="2400" height="760" fill="white"/><circle cx="${bx}" cy="${cy}" r="${r}" fill="black"/></mask></defs>`,
            );
            const fill = t.accentSoft;
            if (regions.includes("a"))
                s.push(
                    `<circle cx="${ax}" cy="${cy}" r="${r}" fill="${fill}" mask="url(#nb-${id})"/>`,
                );
            if (regions.includes("b"))
                s.push(
                    `<circle cx="${bx}" cy="${cy}" r="${r}" fill="${fill}" mask="url(#na-${id})"/>`,
                );
            if (regions.includes("both"))
                s.push(
                    `<circle cx="${bx}" cy="${cy}" r="${r}" fill="${fill}" clip-path="url(#a-${id})"/>`,
                );
            s.push(
                `<circle cx="${ax}" cy="${cy}" r="${r}" fill="none" stroke="${t.line}" stroke-width="3"/>`,
            );
            s.push(
                `<circle cx="${bx}" cy="${cy}" r="${r}" fill="none" stroke="${t.line}" stroke-width="3"/>`,
            );
            const num = (x: number, y: number, n: string, on: boolean) =>
                s.push(
                    text(x, y, n, {
                        size: 40,
                        fill: on ? t.text : t.muted,
                        weight: on ? 700 : 400,
                        font: MONO,
                    }),
                );
            num(ax - 80, cy - 20, "1", regions.includes("a"));
            num(ax - 80, cy + 50, "2", regions.includes("a"));
            num(cx, cy - 20, "3", regions.includes("both"));
            num(cx, cy + 50, "4", regions.includes("both"));
            num(bx + 80, cy - 20, "5", regions.includes("b"));
            num(bx + 80, cy + 50, "6", regions.includes("b"));
            s.push(text(cx, 90, name, { size: 36, fill: t.accent, weight: 700, font: MONO }));
            s.push(text(cx, 590, result, { size: 30, fill: t.text, weight: 600, font: MONO }));
        });
        s.push(
            text(
                80,
                690,
                "Left circle: [1, 2, 3, 4]. Right circle: [3, 4, 5, 6]. difference keeps what is in only one of them, and complement keeps what is in the first but not the second.",
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(venn, t, s.join(""));
    },
};

const cell = (
    s: string[],
    t: Theme,
    x: number,
    y: number,
    v: string,
    o: { w?: number; fill?: string; colour?: string } = {},
) => {
    const { w = 90, fill = t.card, colour = t.text } = o;
    s.push(rect(x, y, w, 90, { fill, r: 12 }));
    s.push(text(x + w / 2, y + 58, v, { size: 34, fill: colour, weight: 600, font: MONO }));
};

// array::windows and array::clump on [1, 2, 3, 4]
const windowsClump: Figure = {
    name: "array-windows-clump",
    width: 2400,
    height: 580,
    draw(t: Theme) {
        const s: string[] = [];
        const row = (
            x0: number,
            title: string,
            groups: number[][],
            overlap: boolean,
            result: string,
        ) => {
            s.push(
                text(x0, 80, title, {
                    size: 32,
                    fill: t.accent,
                    weight: 700,
                    anchor: "start",
                    font: MONO,
                }),
            );
            [1, 2, 3, 4].forEach((v, i) => {
                cell(s, t, x0 + i * 110, 130, String(v));
            });
            groups.forEach((g, k) => {
                const first = g[0] - 1;
                const last = g[g.length - 1] - 1;
                const y = 250 + (overlap ? k * 60 : 0);
                const x1 = x0 + first * 110 + 6;
                const x2 = x0 + last * 110 + 84;
                s.push(
                    `<path d="M${x1},${y} v24 H${x2} v-24" fill="none" stroke="${t.accent}" stroke-width="4"/>`,
                );
            });
            s.push(
                text(x0, 440, result, {
                    size: 30,
                    fill: t.text,
                    weight: 600,
                    anchor: "start",
                    font: MONO,
                }),
            );
        };
        row(
            80,
            "array::windows($array, 2)",
            [
                [1, 2],
                [2, 3],
                [3, 4],
            ],
            true,
            "[[1, 2], [2, 3], [3, 4]]",
        );
        row(
            880,
            "array::clump($array, 2)",
            [
                [1, 2],
                [3, 4],
            ],
            false,
            "[[1, 2], [3, 4]]",
        );
        row(1640, "array::clump($array, 3)", [[1, 2, 3], [4]], false, "[[1, 2, 3], [4]]");
        s.push(
            text(
                80,
                530,
                "windows slides one position at a time, so its groups overlap. clump cuts the array into groups that do not, and the last group can be shorter.",
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(windowsClump, t, s.join(""));
    },
};

// array::combine([1, 2], [2, 3]) as a grid of every pair
const combine: Figure = {
    name: "array-combine",
    width: 1400,
    height: 640,
    draw(t: Theme) {
        const s: string[] = [];
        s.push(
            text(80, 80, "array::combine([1, 2], [2, 3])", {
                size: 32,
                fill: t.accent,
                weight: 700,
                anchor: "start",
                font: MONO,
            }),
        );
        const X0 = 300;
        const Y0 = 180;
        [2, 3].forEach((v, j) => {
            cell(s, t, X0 + j * 260 + 60, Y0, String(v), { fill: t.panel, colour: t.muted });
        });
        [1, 2].forEach((v, i) => {
            cell(s, t, X0 - 140, Y0 + 120 + i * 140, String(v), { fill: t.panel, colour: t.muted });
            [2, 3].forEach((w, j) => {
                cell(s, t, X0 + j * 260, Y0 + 120 + i * 140, `[${v}, ${w}]`, {
                    w: 210,
                    fill: t.accentBg,
                });
            });
        });
        s.push(
            text(
                80,
                600,
                "Every value of the first array paired with every value of the second, row by row.",
                { size: 26, fill: t.muted, anchor: "start" },
            ),
        );
        return svg(combine, t, s.join(""));
    },
};

export default [venn, windowsClump, combine];
