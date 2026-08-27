import { Image } from "@mantine/core";
import {
    brandClaude,
    brandCodex,
    brandCursorDark,
    brandCursorLight,
    brandGithubDark,
    brandGithubLight,
    brandVSCode,
    brandZedDark,
    brandZedLight,
    pictoWindsurfSolid,
} from "@surrealdb/ui";

/** A mark that needs a different artwork per theme, named by the theme it suits. */
interface ThemedMark {
    light: string;
    dark: string;
}

/**
 * Brand marks for the agent setup section, keyed by the agent id so the
 * catalogue in `~/utils/agents` stays free of UI imports.
 *
 * The kit names a mark after the colour of its own artwork rather than the
 * theme it belongs in, so `brandGithubDark` is the near-black mark and belongs
 * on the *light* page. The pairs below are written the other way round, in theme
 * terms, and a mark that reads on either background is a single value.
 */
const AGENT_BRANDS: Record<string, string | ThemedMark> = {
    "claude-code": brandClaude,
    codex: brandCodex,
    cursor: { light: brandCursorDark, dark: brandCursorLight },
    "github-copilot": { light: brandGithubDark, dark: brandGithubLight },
    vscode: brandVSCode,
    // The kit publishes no Windsurf brand mark, so this one stays on its picto.
    windsurf: pictoWindsurfSolid,
    zed: { light: brandZedDark, dark: brandZedLight },
};

export interface AgentBrandProps {
    /** Agent id, matching the page slug under `/docs/agents`. */
    agent: string;
    /** Rendered edge length in pixels. */
    size: number;
    /** Accessible name. Leave unset for a mark shown beside its own label. */
    alt?: string;
}

/**
 * The brand mark for an agent.
 *
 * A themed pair is swapped with Mantine's `darkHidden` / `lightHidden` rather
 * than a colour-scheme hook: the choice is then made in CSS, so the server and
 * the client render the same markup and the mark is correct on the first paint.
 */
export function AgentBrand({ agent, size, alt = "" }: AgentBrandProps) {
    const mark = AGENT_BRANDS[agent];

    if (!mark) {
        return null;
    }

    if (typeof mark === "string") {
        return (
            <Image
                src={mark}
                alt={alt}
                w={size}
                h={size}
            />
        );
    }

    return (
        <>
            <Image
                src={mark.light}
                alt={alt}
                w={size}
                h={size}
                darkHidden
            />
            <Image
                src={mark.dark}
                alt={alt}
                w={size}
                h={size}
                lightHidden
            />
        </>
    );
}
