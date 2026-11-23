// AWS PrivateLink figures for operate/instances/aws-privatelink.

import { arrow, type Figure, line, markers, rect, svg, type Theme, text } from "../lib";
import type { Verified } from "../provenance";

export const verified: Verified = {
    against:
        "the us-east-1 endpoint service as configured in SurrealDB Cloud: availability zone IDs use1-az1, use1-az4 and use1-az6, private DNS name *.privatelink.aws-use1.surreal.cloud, connections accepted by SurrealDB, TCP 443",
    on: "2026-11-23",
};

const label = (s: string[], t: Theme, x: number, y: number, title: string, sub?: string) => {
    s.push(text(x, y, title, { size: 28, fill: t.text, weight: 700, anchor: "start" }));
    if (sub) s.push(text(x, y + 38, sub, { size: 22, fill: t.muted, anchor: "start" }));
};

// A box with a bold title and muted lines under it, centred horizontally
const box = (
    s: string[],
    t: Theme,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    lines: string[],
    o: { active?: boolean; mono?: boolean } = {},
) => {
    s.push(
        rect(x, y, w, h, {
            fill: o.active ? t.accentBg : t.card,
            stroke: o.active ? t.accent : undefined,
            r: 16,
        }),
    );
    const top = y + h / 2 - (lines.length * 34) / 2 + 4;
    s.push(text(x + w / 2, top, title, { size: 26, fill: t.text, weight: 700 }));
    lines.forEach((l, i) => {
        s.push(
            text(x + w / 2, top + 38 + i * 34, l, {
                size: 22,
                fill: t.muted,
                font: o.mono ? "'SF Mono', Menlo, monospace" : undefined,
            }),
        );
    });
};

// The private path from an application in the customer's VPC to an instance,
// with the public path drawn apart from it
const privatelinkFlow: Figure = {
    name: "aws-privatelink-flow",
    width: 2400,
    height: 1180,
    draw(t: Theme) {
        const s: string[] = [markers([t.accent, t.line])];
        s.push(
            text(80, 76, "Traffic from your VPC reaches the instance over AWS PrivateLink", {
                size: 36,
                fill: t.text,
                weight: 700,
                anchor: "start",
            }),
        );

        // Your AWS account and VPC
        s.push(rect(80, 130, 1020, 790, { fill: t.panel, r: 24 }));
        label(s, t, 120, 182, "Your AWS account", "us-east-1");
        s.push(rect(120, 250, 940, 640, { fill: "none", stroke: t.line, dash: "12 10", r: 20 }));
        label(s, t, 150, 296, "Your VPC");

        box(s, t, 160, 360, 340, 150, "Your application", ["connects to the", "private hostname"]);
        box(
            s,
            t,
            160,
            580,
            340,
            270,
            "Private DNS",
            [
                "*.privatelink.",
                "aws-use1.surreal.cloud",
                "resolves to the",
                "endpoint's IP addresses",
            ],
            { mono: false },
        );

        // The interface endpoint, one network interface in each zone
        s.push(rect(600, 340, 420, 520, { fill: t.accentBg, stroke: t.accent, r: 18 }));
        s.push(text(810, 392, "Interface VPC endpoint", { size: 26, fill: t.text, weight: 700 }));
        s.push(text(810, 428, "security group: TCP 443", { size: 22, fill: t.muted }));
        ["use1-az1", "use1-az4", "use1-az6"].forEach((az, i) => {
            const y = 470 + i * 122;
            s.push(rect(640, y, 340, 96, { fill: t.card, r: 14 }));
            s.push(text(810, y + 42, "network interface", { size: 22, fill: t.text, weight: 600 }));
            s.push(
                text(810, y + 74, az, {
                    size: 22,
                    fill: t.muted,
                    font: "'SF Mono', Menlo, monospace",
                }),
            );
        });

        s.push(arrow(500, 435, 592, 435, t.accent, 4));
        s.push(line(330, 510, 330, 572, t.line, 3, "8 8"));

        // Across AWS PrivateLink
        // SurrealDB Cloud
        s.push(rect(1300, 130, 1020, 790, { fill: t.panel, r: 24 }));
        label(s, t, 1340, 182, "SurrealDB Cloud", "us-east-1");

        s.push(arrow(1020, 470, 1332, 470, t.accent, 6));
        s.push(text(1170, 430, "AWS PrivateLink", { size: 26, fill: t.accent, weight: 700 }));
        s.push(text(1170, 520, "stays on the", { size: 22, fill: t.muted }));
        s.push(text(1170, 552, "AWS network", { size: 22, fill: t.muted }));

        box(s, t, 1340, 370, 440, 200, "Endpoint service", [
            "accepts approved AWS accounts",
            "SurrealDB accepts",
            "each endpoint",
        ]);
        box(s, t, 1340, 670, 440, 160, "PrivateLink gateway", [
            "one in each zone",
            "routes by hostname",
        ]);
        box(
            s,
            t,
            1880,
            440,
            400,
            260,
            "Your instance",
            ["Private traffic: on", "Public traffic: on (dual)", "or off (private)"],
            { active: true },
        );

        s.push(arrow(1560, 570, 1560, 662, t.accent, 4));
        s.push(arrow(1780, 740, 1872, 660, t.accent, 4));

        // The public path, apart from the private one
        s.push(rect(1340, 990, 440, 130, { fill: t.panel, stroke: t.line, dash: "12 10", r: 16 }));
        s.push(
            text(1560, 1044, "Clients on the internet", { size: 26, fill: t.text, weight: 700 }),
        );
        s.push(
            text(1560, 1084, "*.aws-use1.surreal.cloud", {
                size: 22,
                fill: t.muted,
                font: "'SF Mono', Menlo, monospace",
            }),
        );
        s.push(line(1780, 1055, 2080, 1055, t.line, 4, "10 8"));
        s.push(arrow(2080, 1055, 2080, 708, t.line, 4, "10 8"));
        s.push(text(2100, 980, "public path, only", { size: 22, fill: t.muted, anchor: "start" }));
        s.push(
            text(2100, 1012, "while Public traffic is on", {
                size: 22,
                fill: t.muted,
                anchor: "start",
            }),
        );

        return svg(privatelinkFlow, t, s.join(""));
    },
};

export default [privatelinkFlow];
