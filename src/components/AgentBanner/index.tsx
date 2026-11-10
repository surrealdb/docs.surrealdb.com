import { Anchor } from "@mantine/core";
import { Icon, iconArrowRight } from "@surrealdb/ui";
import { AgentBrand } from "~/components/AgentBrand";
import { CopyPanel, type CopyPanelTab } from "~/components/CopyPanel";
import { AGENTS, SETUP_PROMPT } from "~/utils/agents";
import classes from "./style.module.scss";

interface MoreLinkProps {
    href: string;
    label: string;
}

/** A text link with an arrow, as www.surrealdb.com draws them. */
function MoreLink({ href, label }: MoreLinkProps) {
    return (
        <Anchor
            href={href}
            fz="sm"
            fw={500}
            mt="sm"
            underline="never"
            className={classes.moreLink}
        >
            <span className={classes.linkLabel}>{label}</span>
            <Icon
                path={iconArrowRight}
                size="sm"
                className={classes.linkArrow}
            />
        </Anchor>
    );
}

/**
 * The agent setup panel at the top of the documentation home page.
 *
 * It sits above the section cards because it is the shortest route into
 * SurrealDB there is. The first tab is the setup prompt, which works in every
 * agent because the instructions it points at have the agent identify itself.
 * Each agent's mark is a tab of its own, holding the configuration that agent
 * takes, for a reader who would rather set it up without a prompt.
 */
export function AgentBanner() {
    const tabs: CopyPanelTab[] = [
        {
            value: "prompt",
            label: "Agent prompt",
            text: SETUP_PROMPT,
            prose: true,
            copyLabel: "Copy prompt",
            caption:
                "Your agent installs SurrealDB's Agent Skills and connects to the SurrealDB MCP server, ready to write SurrealQL against a real database.",
            footer: (
                <MoreLink
                    href="/docs/agents"
                    label="Setup steps for each agent"
                />
            ),
        },
        ...AGENTS.map((agent) => ({
            value: agent.id,
            label: (
                <AgentBrand
                    agent={agent.id}
                    size={18}
                />
            ),
            ariaLabel: agent.name,
            text: agent.setup.code,
            caption: agent.setup.where,
            footer: (
                <MoreLink
                    href={`/docs/agents/${agent.id}`}
                    label={`Full ${agent.name} setup`}
                />
            ),
        })),
    ];

    return <CopyPanel tabs={tabs} />;
}
