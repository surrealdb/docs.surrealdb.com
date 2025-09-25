// Utility to build Tab Atkins' railroad-diagrams from a simple JSON AST
// and return SVG markup. Designed for reuse across statement syntax pages.

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - provided by ambient declaration in src/env.d.ts
import rr from 'railroad-diagrams';

type RRDiagram = {
    format: (...padding: number[]) => void;
    toString: () => string;
};

type RRConstructors = {
    Diagram: (...children: unknown[]) => RRDiagram;
    ComplexDiagram: (...children: unknown[]) => RRDiagram;
    Choice: (index: number, ...children: unknown[]) => unknown;
    Sequence: (...children: unknown[]) => unknown;
    Optional: (child: unknown, skip?: 'skip') => unknown;
    OneOrMore: (child: unknown, repeat?: unknown) => unknown;
    ZeroOrMore: (child: unknown, repeat?: unknown, skip?: 'skip') => unknown;
    Terminal: (
        text: string,
        opts?: { href?: string; title?: string; cls?: string }
    ) => unknown;
    NonTerminal: (
        text: string,
        opts?: { href?: string; title?: string; cls?: string }
    ) => unknown;
    Comment: (
        text: string,
        opts?: { href?: string; title?: string; cls?: string }
    ) => unknown;
    Skip: () => unknown;
};

const {
    Diagram,
    ComplexDiagram,
    Choice,
    Sequence,
    Optional,
    OneOrMore,
    ZeroOrMore,
    Terminal,
    NonTerminal,
    Comment,
    Skip,
} = rr as unknown as RRConstructors;

// Types describing a concise JSON-based AST to generate diagrams
export type RailroadNode =
    | {
          type: 'Terminal';
          text: string;
          href?: string;
          title?: string;
          cls?: string;
      }
    | {
          type: 'NonTerminal';
          text: string;
          href?: string;
          title?: string;
          cls?: string;
      }
    | {
          type: 'Comment';
          text: string;
          href?: string;
          title?: string;
          cls?: string;
      }
    | { type: 'Skip' }
    | { type: 'Sequence'; children: RailroadNode[] }
    | { type: 'Choice'; index: number; children: RailroadNode[] }
    | { type: 'Optional'; skip?: 'skip'; child: RailroadNode }
    | { type: 'OneOrMore'; child: RailroadNode; repeat?: RailroadNode }
    | {
          type: 'ZeroOrMore';
          child: RailroadNode;
          repeat?: RailroadNode;
          skip?: 'skip';
      }
    | {
          type: 'Diagram';
          children: RailroadNode[];
          padding?:
              | number
              | [number]
              | [number, number]
              | [number, number, number, number];
      }
    | {
          type: 'ComplexDiagram';
          children: RailroadNode[];
          padding?:
              | number
              | [number]
              | [number, number]
              | [number, number, number, number];
      };

export type Padding =
    | number
    | [number]
    | [number, number]
    | [number, number, number, number];

function buildNode(node: RailroadNode): unknown {
    switch (node.type) {
        case 'Terminal':
            return Terminal(node.text, {
                href: node.href,
                title: node.title,
                cls: node.cls,
            });
        case 'NonTerminal':
            return NonTerminal(node.text, {
                href: node.href,
                title: node.title,
                cls: node.cls,
            });
        case 'Comment':
            return Comment(node.text, {
                href: node.href,
                title: node.title,
                cls: node.cls,
            });
        case 'Skip':
            return Skip();
        case 'Sequence':
            return Sequence(...node.children.map(buildNode));
        case 'Choice':
            return Choice(node.index, ...node.children.map(buildNode));
        case 'Optional':
            return Optional(buildNode(node.child), node.skip);
        case 'OneOrMore':
            return OneOrMore(
                buildNode(node.child),
                node.repeat ? buildNode(node.repeat) : undefined
            );
        case 'ZeroOrMore':
            return ZeroOrMore(
                buildNode(node.child),
                node.repeat ? buildNode(node.repeat) : undefined,
                node.skip
            );
        case 'Diagram': {
            const d = Diagram(...node.children.map(buildNode));
            // Padding mirrors CSS padding shorthand
            if (node.padding !== undefined) applyPadding(d, node.padding);
            return d;
        }
        case 'ComplexDiagram': {
            const d = ComplexDiagram(...node.children.map(buildNode));
            if (node.padding !== undefined) applyPadding(d, node.padding);
            return d;
        }
        default: {
            const _exhaustive: never = node as never;
            return _exhaustive;
        }
    }
}

function applyPadding(diagram: RRDiagram, padding: Padding) {
    if (Array.isArray(padding)) {
        // up to 4 values
        diagram.format(...padding);
    } else {
        diagram.format(padding);
    }
}

export function diagramFromAst(ast: RailroadNode): RRDiagram {
    const built = buildNode(ast);
    if (ast.type === 'Diagram' || ast.type === 'ComplexDiagram') {
        return built as RRDiagram;
    }
    throw new Error(
        "diagramFromAst expects a root of type 'Diagram' or 'ComplexDiagram'"
    );
}

export function svgFromAst(ast: RailroadNode, padding?: Padding): string {
    const d = diagramFromAst(ast);
    if (padding !== undefined) applyPadding(d, padding);
    return d.toString();
}

export function svgFromNodes(diagram: RRDiagram, padding?: Padding): string {
    if (padding !== undefined) applyPadding(diagram, padding);
    return diagram.toString();
}

export { rr };
