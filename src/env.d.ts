/// <reference path="../.astro/types.d.ts" />

declare module 'railroad-diagrams' {
    // This library is CommonJS without types. We only use its default export with constructors.
    // Provide a minimal typed surface to satisfy the compiler without leaking any.
    type RRDiagram = {
        format: (...padding: number[]) => void;
        toString: () => string;
    };
    const mod: {
        Diagram: new (...children: unknown[]) => RRDiagram;
        ComplexDiagram: new (...children: unknown[]) => RRDiagram;
        Choice: new (index: number, ...children: unknown[]) => unknown;
        Sequence: new (...children: unknown[]) => unknown;
        Stack: new (...children: unknown[]) => unknown;
        OptionalSequence: new (...children: unknown[]) => unknown;
        MultipleChoice: new (
            index: number,
            mode: 'any' | 'all',
            ...children: unknown[]
        ) => unknown;
        HorizontalChoice: new (...children: unknown[]) => unknown;
        Optional: new (child: unknown, skip?: 'skip') => unknown;
        OneOrMore: new (child: unknown, repeat?: unknown) => unknown;
        AlternatingSequence: new (
            option1: unknown,
            option2: unknown
        ) => unknown;
        ZeroOrMore: new (
            child: unknown,
            repeat?: unknown,
            skip?: 'skip'
        ) => unknown;
        Group: new (child: unknown, label?: string) => unknown;
        Terminal: new (
            text: string,
            opts?: { href?: string; title?: string; cls?: string }
        ) => unknown;
        NonTerminal: new (
            text: string,
            opts?: { href?: string; title?: string; cls?: string }
        ) => unknown;
        Comment: new (
            text: string,
            opts?: { href?: string; title?: string; cls?: string }
        ) => unknown;
        Start: new (opts?: {
            type?: 'simple' | 'complex';
            label?: string;
        }) => unknown;
        End: new (opts?: { type?: 'simple' | 'complex' }) => unknown;
        Skip: () => unknown;
    };
    export default mod;
}
