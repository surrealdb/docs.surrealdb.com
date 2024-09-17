import { useWindowScrollPosition } from "@solid-primitives/scroll";
import { cn } from "@src/util/tailwind";
import {
  type Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  useContext,
} from "solid-js";

export interface HeadingProps {
  depth: number;
  text: string;
  slug: string;
}

type Positions = Record<string, number>;
const PageHeadingsContext =
  createContext<Accessor<string | undefined>>(undefined);

export function PageHeadings({ headings }: { headings: HeadingProps[] }) {
  const scroll = useWindowScrollPosition();
  const [positions, setPositions] = createSignal<Positions>({});
  const active = createMemo(() => {
    const pos = Object.entries(positions());
    const scrollY = scroll.y;
    return scrollY < pos[0]?.[1]
      ? undefined
      : (() => {
          const index = pos.findIndex(([_, pos]) => scrollY < pos) - 1;
          return pos[index < 0 ? pos.length - 1 : index]?.[0];
        })();
  });

  function computePositions() {
    if (typeof window !== "undefined") {
      setPositions(
        headings
          .filter(({ depth }) => depth <= 3)
          .reduce<Positions>((prev, { slug }) => {
            const el = document.querySelector(
              `.flag-page-headings-content #${slug}, .flag-page-headings-root#${slug}`
            );
            if (el)
              prev[slug] =
                el.getBoundingClientRect().top +
                window.scrollY -
                el.clientHeight;

            return prev;
          }, {})
      );
    }
  }

  createEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", computePositions);
      computePositions();
    }
  });

  return (
    <PageHeadingsContext.Provider value={active}>
      <ul>{headings.map(Heading)}</ul>
    </PageHeadingsContext.Provider>
  );
}

function Heading({ depth, text, slug }: HeadingProps) {
  const ctx = useContext(PageHeadingsContext);
  if (!ctx) throw new Error("Page Context is not available");
  const active = createMemo(() => ctx() === slug);

  return (
    <li>
      {depth <= 2 ? (
        <a
          class="group flex items-center gap-4 rounded-lg py-1.5 tracking-tight transition-colors duration-75 text-xs"
          href={`#${slug}`}
        >
          <span
            class={cn(
              "text-text transition-all duration-300 group-hover:text-hover",
              active() && "text-hover/100"
            )}
          >
            {text}
          </span>
        </a>
      ) : depth === 3 ? (
        <a
          class="group flex items-center gap-4 py-1.5 pl-3 text-xs transition-colors duration-75"
          href={`#${slug}`}
        >
          <span
            class={cn(
              "text-text transition-all duration-300 group-hover:text-hover",
              active() && "text-hover/100"
            )}
          >
            {text}
          </span>
        </a>
      ) : null}
    </li>
  );
}
