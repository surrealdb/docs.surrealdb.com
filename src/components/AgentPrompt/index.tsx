import { CopyPanel } from "~/components/CopyPanel";
import { SETUP_PROMPT } from "~/utils/agents";

export interface AgentPromptProps {
    /** The prompt to show and copy. Defaults to the SurrealDB setup prompt. */
    text?: string;
}

/**
 * A prompt to paste into an agent, shown in full with a copy button. Without a
 * `text` it is the setup prompt, which the SurrealDB Studio organisation overview
 * copies too. A page that starts a task gives its own prompt, pointing the agent
 * at that page's markdown.
 */
export function AgentPrompt({ text = SETUP_PROMPT }: AgentPromptProps) {
    return (
        <CopyPanel
            tabs={[
                {
                    value: "prompt",
                    label: "Agent prompt",
                    text,
                    prose: true,
                    copyLabel: "Copy prompt",
                },
            ]}
        />
    );
}
