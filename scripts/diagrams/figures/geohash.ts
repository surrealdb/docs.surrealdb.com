// The geohash record IDs on learn/data-models/geospatial/location-based-patterns:
// three events, two of which share the precision-4 cell 'v0gt'.

import { circle, type Figure, MONO, rect, svg, type Theme, text } from "../lib";

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

function encode(lon: number, lat: number, precision: number): string {
    let [lonMin, lonMax, latMin, latMax] = [-180, 180, -90, 90];
    let hash = "";
    let bits = 0;
    let value = 0;
    let even = true;
    while (hash.length < precision) {
        if (even) {
            const mid = (lonMin + lonMax) / 2;
            value = value * 2 + (lon >= mid ? 1 : 0);
            if (lon >= mid) lonMin = mid;
            else lonMax = mid;
        } else {
            const mid = (latMin + latMax) / 2;
            value = value * 2 + (lat >= mid ? 1 : 0);
            if (lat >= mid) latMin = mid;
            else latMax = mid;
        }
        even = !even;
        if (++bits === 5) {
            hash += BASE32[value];
            bits = 0;
            value = 0;
        }
    }
    return hash;
}

// Precision 4 is 20 bits: 10 of longitude and 10 of latitude
const CELL_LON = 360 / 2 ** 10;
const CELL_LAT = 180 / 2 ** 10;
const EVENTS: [number, number][] = [
    [50.0, 50.1],
    [50.1, 50.1],
    [50.5, 50.1],
];

function draw(t: Theme): string {
    const s: string[] = [];
    // Origin of the v0gt cell, from geo::hash::decode('v0gt') minus half a cell
    const lon0 = 50.09765625 - CELL_LON / 2;
    const lat0 = 50.185546875 - CELL_LAT / 2;
    const W = 360;
    const H = (W * CELL_LAT * (1 / Math.cos((50.1 * Math.PI) / 180))) / CELL_LON;
    const X0 = 120;
    const Y0 = 140;
    const px = (lon: number) => X0 + W + ((lon - lon0) / CELL_LON) * W;
    const py = (lat: number) => Y0 + H + ((lat0 + CELL_LAT - lat) / CELL_LAT) * H;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const lon = lon0 + i * CELL_LON;
            const lat = lat0 + j * CELL_LAT;
            const hash = encode(lon + CELL_LON / 2, lat + CELL_LAT / 2, 4);
            const hit = hash === "v0gt";
            s.push(
                rect(px(lon), py(lat + CELL_LAT), W, H, {
                    fill: hit ? t.accentBg : t.panel,
                    stroke: hit ? t.accent : t.grid,
                    strokeWidth: hit ? 5 : 2,
                    r: 0,
                }),
            );
            s.push(
                text(px(lon) + 24, py(lat + CELL_LAT) + 48, `'${hash}'`, {
                    size: 34,
                    fill: hit ? t.accent : t.muted,
                    weight: 600,
                    anchor: "start",
                    font: MONO,
                }),
            );
        }
    }
    EVENTS.forEach(([lon, lat], k) => {
        const inCell = encode(lon, lat, 4) === "v0gt";
        s.push(circle(px(lon), py(lat), 14, inCell ? t.accent : t.text));
        s.push(
            text(px(lon), py(lat) - 28, String(k + 1), {
                size: 30,
                fill: t.text,
                weight: 700,
                halo: inCell ? t.accentBg : t.panel,
            }),
        );
    });
    s.push(
        text(
            X0,
            Y0 + 3 * H + 56,
            "The southern edge of 'v0gt' is at latitude 50.098, so the events at 50.1 sit just inside it.",
            { size: 26, fill: t.muted, anchor: "start" },
        ),
    );
    s.push(
        text(X0, Y0 - 50, "Precision-4 geohash cells around 'v0gt', about 25 km by 20 km each", {
            size: 30,
            fill: t.muted,
            anchor: "start",
        }),
    );

    const RX = X0 + 3 * W + 90;
    s.push(
        text(RX, Y0 + 20, "SELECT * FROM event:['v0gt', NONE, NONE]..['v0gt', .., ..];", {
            size: 24,
            fill: t.text,
            anchor: "start",
            font: MONO,
        }),
    );
    s.push(
        text(RX, Y0 + 80, "reads the two events in 'v0gt'. The third", {
            size: 30,
            fill: t.text,
            anchor: "start",
        }),
    );
    s.push(
        text(RX, Y0 + 120, "is in the neighbouring cell, 'v0gv'.", {
            size: 30,
            fill: t.text,
            anchor: "start",
        }),
    );
    s.push(
        text(RX, Y0 + 220, "Each extra character narrows the cell:", {
            size: 30,
            fill: t.muted,
            anchor: "start",
        }),
    );
    const levels: [string, string][] = [
        ["'v'", "precision 1"],
        ["'v0'", "precision 2"],
        ["'v0g'", "precision 3"],
        ["'v0gt'", "precision 4"],
    ];
    levels.forEach(([h, label], i) => {
        const y = Y0 + 260 + i * 92;
        const indent = i * 40;
        s.push(
            rect(RX + indent, y, 560 - indent, 72, {
                fill: i === 3 ? t.accentBg : t.card,
                stroke: i === 3 ? t.accent : undefined,
                r: 12,
            }),
        );
        s.push(
            text(RX + indent + 24, y + 48, h, {
                size: 30,
                fill: i === 3 ? t.accent : t.text,
                weight: 600,
                anchor: "start",
                font: MONO,
            }),
        );
        s.push(text(RX + 540, y + 48, label, { size: 26, fill: t.muted, anchor: "end" }));
    });
    EVENTS.forEach(([lon, lat], n) => {
        const y = Y0 + 680 + n * 44;
        s.push(text(RX, y, `${n + 1}`, { size: 28, fill: t.text, weight: 700, anchor: "start" }));
        s.push(
            text(
                RX + 40,
                y,
                `(${lon.toFixed(1)}, ${lat.toFixed(1)})  ->  '${encode(lon, lat, 4)}'`,
                { size: 26, fill: t.text, anchor: "start", font: MONO },
            ),
        );
    });
    s.push(
        text(RX, Y0 + 860, "Nearby points share a prefix, so a range on", {
            size: 30,
            fill: t.text,
            anchor: "start",
        }),
    );
    s.push(
        text(RX, Y0 + 900, "the first element of the ID reads one cell.", {
            size: 30,
            fill: t.text,
            anchor: "start",
        }),
    );
    return svg(figure, t, s.join(""));
}

const figure: Figure = { name: "geohash-cell", width: 2400, height: 1060, draw };
export default figure;
