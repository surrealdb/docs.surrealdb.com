// The SPATIAL index example on reference/query-language/statements/define/indexes:
// six cities, a 400 km radius around London, and the five `IndexScan` ranges
// from its EXPLAIN output drawn as the cells they read.

import land from "../data/europe-land.json";
import { circle, type Figure, line, MONO, path, rect, svg, type Theme, text } from "../lib";
import { cellsInRange, leafId } from "../spatial-cells";

const RANGES: [bigint, bigint][] = [
    [1655143231802834952n, 1655283969291190264n],
    [1655635813012078600n, 1655706181756256248n],
    [1655776550500433928n, 1656481337453838328n],
    [1802284275878330376n, 1803128700808462328n],
    [1803410175785173000n, 1803691650761883640n],
];

const CITIES: [string, number, number, "start" | "end"][] = [
    ["London", -0.1276, 51.5072, "end"],
    ["Paris", 2.3522, 48.8566, "start"],
    ["Brussels", 4.3517, 50.8503, "start"],
    ["Amsterdam", 4.9041, 52.3676, "start"],
    ["Berlin", 13.405, 52.52, "start"],
];
const CENTRE: [number, number] = [-0.1276, 51.5072];
const RADIUS_M = 400_000;

const RANGE_COLOURS = ["#4b8df8", "#22b8a6", "#d35cff", "#e8a53a", "#ef5da8"];

// Map frame. Longitude and latitude are both linear, as in the index's own
// plane, so every cell is a rectangle; latitude is stretched by 1/cos(51.5°)
// so that the coastline keeps its familiar shape.
const MAP = { x: 70, y: 110, w: 1420, lonMin: -10, lonMax: 16, latMin: 45, latMax: 58 };
const KX = MAP.w / (MAP.lonMax - MAP.lonMin);
const KY = KX / Math.cos((51.5 * Math.PI) / 180);
const MAP_H = (MAP.latMax - MAP.latMin) * KY;
const px = (lon: number) => MAP.x + (lon - MAP.lonMin) * KX;
const py = (lat: number) => MAP.y + (MAP.latMax - lat) * KY;

function destination(lon: number, lat: number, bearing: number, metres: number): [number, number] {
    const R = 6_371_008.8;
    const d = metres / R;
    const φ1 = (lat * Math.PI) / 180;
    const λ1 = (lon * Math.PI) / 180;
    const φ2 = Math.asin(
        Math.sin(φ1) * Math.cos(d) + Math.cos(φ1) * Math.sin(d) * Math.cos(bearing),
    );
    const λ2 =
        λ1 +
        Math.atan2(
            Math.sin(bearing) * Math.sin(d) * Math.cos(φ1),
            Math.cos(d) - Math.sin(φ1) * Math.sin(φ2),
        );
    return [(λ2 * 180) / Math.PI, (φ2 * 180) / Math.PI];
}

function draw(t: Theme): string {
    const s: string[] = [];
    s.push(
        `<clipPath id="map"><rect x="${MAP.x}" y="${MAP.y}" width="${MAP.w}" height="${MAP_H}" rx="24"/></clipPath>`,
    );
    s.push(rect(MAP.x, MAP.y, MAP.w, MAP_H, { fill: t.water, r: 24 }));
    s.push(`<g clip-path="url(#map)">`);
    for (const ring of land.rings as [number, number][][]) {
        const d = ring
            .map(([lo, la], i) => `${i ? "L" : "M"}${px(lo).toFixed(1)},${py(la).toFixed(1)}`)
            .join("");
        s.push(path(`${d}Z`, { fill: t.land, stroke: t.grid, strokeWidth: 1.5 }));
    }
    // The level-6 grid, to show that the covering cells are cells of one grid
    for (let lon = -180; lon <= 180; lon += 360 / 64)
        s.push(line(px(lon), MAP.y, px(lon), MAP.y + MAP_H, t.grid, 1, "4 6"));
    for (let lat = -90; lat <= 90; lat += 180 / 64)
        s.push(line(MAP.x, py(lat), MAP.x + MAP.w, py(lat), t.grid, 1, "4 6"));
    RANGES.forEach(([a, b], i) => {
        for (const c of cellsInRange(a, b)) {
            const x = px(c.lonMin);
            const y = py(c.latMax);
            const w = (c.lonMax - c.lonMin) * KX;
            const h = (c.latMax - c.latMin) * KY;
            s.push(
                `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${RANGE_COLOURS[i]}" fill-opacity="0.28" stroke="${RANGE_COLOURS[i]}" stroke-width="3"/>`,
            );
        }
    });
    const ring = Array.from({ length: 121 }, (_, i) =>
        destination(CENTRE[0], CENTRE[1], (i / 120) * 2 * Math.PI, RADIUS_M),
    );
    s.push(
        path(`${ring.map(([lo, la], i) => `${i ? "L" : "M"}${px(lo)},${py(la)}`).join("")}Z`, {
            stroke: t.text,
            strokeWidth: 4,
            dash: "14 10",
        }),
    );
    for (const [name, lon, lat, anchor] of CITIES) {
        const inRange = RANGES.some(([a, b]) => leafId(lon, lat) >= a && leafId(lon, lat) <= b);
        s.push(circle(px(lon), py(lat), 11, inRange ? t.text : t.bg, t.text, 4));
        const dx = anchor === "end" ? -20 : 20;
        s.push(
            text(px(lon) + dx, py(lat) + 11, name, {
                size: 32,
                fill: t.text,
                weight: 600,
                anchor,
                halo: t.water,
            }),
        );
    }
    const [, labelLat] = destination(CENTRE[0], CENTRE[1], 0, RADIUS_M);
    s.push(
        text(px(CENTRE[0]), py(labelLat) - 16, "400 km from London", {
            size: 28,
            fill: t.text,
            weight: 500,
            halo: t.water,
        }),
    );
    s.push(`</g>`);
    s.push(
        text(MAP.x + 24, MAP.y + MAP_H - 24, "Tokyo is off the map, and outside every range", {
            size: 26,
            fill: t.muted,
            anchor: "start",
        }),
    );

    // Right panel: the five ranges in key order
    const X = 1560;
    s.push(
        text(X, 150, "The five IndexScan ranges", {
            size: 40,
            fill: t.text,
            weight: 600,
            anchor: "start",
        }),
    );
    s.push(
        text(X, 196, "in key order, as EXPLAIN lists them", {
            size: 28,
            fill: t.muted,
            anchor: "start",
        }),
    );
    RANGES.forEach(([a, b], i) => {
        const y = 260 + i * 150;
        const found = CITIES.filter(([, lo, la]) => leafId(lo, la) >= a && leafId(lo, la) <= b).map(
            ([n]) => n,
        );
        const cells = cellsInRange(a, b).length;
        s.push(
            `<rect x="${X}" y="${y}" width="770" height="124" rx="18" fill="${RANGE_COLOURS[i]}" fill-opacity="0.16" stroke="${RANGE_COLOURS[i]}" stroke-width="3"/>`,
        );
        s.push(
            text(X + 30, y + 52, `Range ${i + 1}`, {
                size: 32,
                fill: t.text,
                weight: 600,
                anchor: "start",
            }),
        );
        s.push(
            text(X + 30, y + 94, `${cells} ${cells === 1 ? "cell" : "cells"}`, {
                size: 26,
                fill: t.muted,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(
            text(X + 740, y + 74, found.length ? found.join(", ") : "nothing found", {
                size: 30,
                fill: found.length ? t.text : t.muted,
                weight: found.length ? 600 : 400,
                anchor: "end",
            }),
        );
    });
    s.push(circle(X + 12, 1036, 11, t.text, t.text, 4));
    s.push(text(X + 36, 1046, "in a range", { size: 28, fill: t.muted, anchor: "start" }));
    s.push(circle(X + 232, 1036, 11, t.bg, t.text, 4));
    s.push(text(X + 256, 1046, "in no range", { size: 28, fill: t.muted, anchor: "start" }));
    s.push(
        text(X, 1110, "Each record found in a range is then", {
            size: 28,
            fill: t.muted,
            anchor: "start",
        }),
    );
    s.push(
        text(X, 1148, "checked against the exact 400 km distance.", {
            size: 28,
            fill: t.muted,
            anchor: "start",
        }),
    );
    s.push(
        text(X, 1206, "Berlin and Tokyo sit in no range,", {
            size: 28,
            fill: t.text,
            weight: 600,
            anchor: "start",
        }),
    );
    s.push(
        text(X, 1244, "so the query never reads them.", {
            size: 28,
            fill: t.text,
            weight: 600,
            anchor: "start",
        }),
    );
    return svg(figure, t, s.join(""));
}

const figure: Figure = {
    name: "spatial-index",
    width: 2400,
    height: Math.ceil(MAP.y + MAP_H + 70),
    draw,
};
export default figure;
