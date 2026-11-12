// Operator binding power for reference/query-language/language-primitives/operators,
// and field evaluation order for reference/query-language/statements/define/field.
// The binding powers follow the parser in SurrealDB 4.0, checked by running
// expressions such as `1 ?? 2 AND false` and `<string> 1..3`.

import { arrow, type Figure, line, MONO, markers, rect, svg, type Theme, text } from "../lib";
import type { Verified } from "../provenance";

export const verified: Verified = {
    against:
        "SurrealDB 4.0.0-beta.1 and the binding powers in surrealdb-private 0f7faf9edd surrealdb/expr/src/expr/binding_power.rs",
    on: "2026-11-02",
};

const LEVELS: [string, string][] = [
    ["Range", ".."],
    ["Unary and Cast", "!  +  -  <type>"],
    ["Power", "**"],
    ["MulDiv", "*  /  ÷  %"],
    ["AddSub", "+  -"],
    ["Relation", "<  <=  >  >=  CONTAINS  INSIDE  …"],
    ["Equality", "=  IS  ==  !=  *=  ?=  @@"],
    ["And", "&&  AND"],
    ["Or", "||  OR"],
    ["Nullish", "??  ?:"],
];

type Tree = { op: string; l: Tree | string; r: Tree | string };

const bindingPower: Figure = {
    name: "operator-binding-power",
    width: 2400,
    height: 1100,
    draw(t: Theme) {
        const s: string[] = [markers([t.line])];
        s.push(text(80, 70, "Binds most tightly", { size: 26, fill: t.muted, anchor: "start" }));
        LEVELS.forEach(([name, ops], i) => {
            const y = 100 + i * 88;
            const strength = 1 - i / LEVELS.length;
            s.push(
                rect(80, y, 1000, 72, { fill: t.accentBg, opacity: 0.35 + strength * 0.65, r: 12 }),
            );
            s.push(
                text(110, y + 47, name, { size: 28, fill: t.text, weight: 700, anchor: "start" }),
            );
            s.push(text(460, y + 47, ops, { size: 26, fill: t.text, anchor: "start", font: MONO }));
        });
        s.push(text(80, 1010, "Binds least tightly", { size: 26, fill: t.muted, anchor: "start" }));
        // Parse trees: the operator that binds more tightly sits lower, and runs first
        const drawTree = (x: number, y: number, tree: Tree | string, spread: number): void => {
            if (typeof tree === "string") {
                s.push(text(x, y + 12, tree, { size: 32, fill: t.text, weight: 600, font: MONO }));
                return;
            }
            const cy = y + 130;
            for (const [child, dx] of [
                [tree.l, -spread],
                [tree.r, spread],
            ] as [Tree | string, number][]) {
                s.push(line(x, y + 30, x + dx, cy - 30, t.line, 3));
                drawTree(x + dx, cy, child, spread * 0.55);
            }
            s.push(
                `<circle cx="${x}" cy="${y}" r="38" fill="${t.card}" stroke="${t.accent}" stroke-width="3"/>`,
            );
            s.push(text(x, y + 11, tree.op, { size: 28, fill: t.accent, weight: 700, font: MONO }));
        };
        const examples: [string, Tree, string][] = [
            ["1 + 3 * 4", { op: "+", l: "1", r: { op: "*", l: "3", r: "4" } }, "13"],
            ["1 ?? 2 AND false", { op: "??", l: "1", r: { op: "AND", l: "2", r: "false" } }, "1"],
        ];
        examples.forEach(([expr, tree, result], k) => {
            const cx = 1460 + k * 560;
            s.push(text(cx, 120, expr, { size: 32, fill: t.text, weight: 700, font: MONO }));
            drawTree(cx, 240, tree, 150);
            s.push(
                text(cx, 700, `returns ${result}`, {
                    size: 28,
                    fill: t.accent,
                    weight: 600,
                    font: MONO,
                }),
            );
        });
        s.push(
            text(1180, 820, "In each tree the lower operator binds more tightly and runs first.", {
                size: 26,
                fill: t.text,
                anchor: "start",
            }),
        );
        s.push(
            text(
                1180,
                860,
                "?? binds least tightly of all, so 1 ?? 2 AND false is 1 ?? (2 AND false).",
                { size: 26, fill: t.text, anchor: "start" },
            ),
        );
        return svg(bindingPower, t, s.join(""));
    },
};

// The two passes of field evaluation in the example on define/field#field-evaluation-order
const fieldOrder: Figure = {
    name: "field-evaluation-order",
    width: 2200,
    height: 760,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];
        const box = (
            x: number,
            y: number,
            w: number,
            title: string,
            sub: string,
            active = true,
        ) => {
            s.push(
                rect(x, y, w, 130, {
                    fill: active ? t.accentBg : t.card,
                    stroke: active ? t.accent : undefined,
                }),
            );
            s.push(
                text(x + w / 2, y + 56, title, { size: 28, fill: t.text, weight: 700, font: MONO }),
            );
            s.push(text(x + w / 2, y + 98, sub, { size: 24, fill: t.muted, font: MONO }));
        };
        s.push(
            text(80, 80, "Pass 1: DEFAULT, VALUE and COMPUTED, in dependency order", {
                size: 30,
                fill: t.text,
                weight: 600,
                anchor: "start",
            }),
        );
        box(80, 130, 520, "z_src", "VALUE 10  ->  10");
        s.push(arrow(620, 195, 800, 195, t.accent, 5));
        s.push(text(710, 170, "then", { size: 24, fill: t.accent, weight: 600 }));
        box(820, 130, 620, "a_dep", "VALUE z_src + 1  ->  11");
        s.push(
            text(1500, 180, "a_dep reads z_src, so z_src runs first,", {
                size: 26,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(1500, 218, "whatever their names or definition order.", {
                size: 26,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(80, 380, "Pass 2: every ASSERT, once all fields hold their final values", {
                size: 30,
                fill: t.text,
                weight: 600,
                anchor: "start",
            }),
        );
        box(80, 430, 620, "in", "ASSERT in != out");
        box(820, 430, 620, "out", "ASSERT out != in");
        s.push(line(700, 495, 820, 495, t.line, 3, "8 8"));
        s.push(
            text(1500, 480, "Assertions produce no value, so two that", {
                size: 26,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(1500, 518, "read each other are not a cycle.", {
                size: 26,
                fill: t.muted,
                anchor: "start",
            }),
        );
        s.push(
            text(
                80,
                680,
                "Before 3.3.0, fields ran in name order: a_dep before z_src, so a_dep read a field with no value yet.",
                { size: 26, fill: t.red, anchor: "start" },
            ),
        );
        return svg(fieldOrder, t, s.join(""));
    },
};

export default [bindingPower, fieldOrder];
