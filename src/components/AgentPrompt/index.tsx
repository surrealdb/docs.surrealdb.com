import { CopyPanel } from "~/components/CopyPanel";
import { SETUP_PROMPT } from "~/utils/agents";
import { trackSetupPromptCopy } from "~/utils/analytics";

export interface AgentPromptProps {
    /** The prompt to show and copy. Defaults to the SurrealDB setup prompt. */
    text?: string;
    /**
     * The copy button's `data-cta` ID, naming the prompt so that two prompts on
     * one page report apart. Defaults to `docs_agent_prompt_setup_copy` for the
     * setup prompt and `docs_agent_prompt_task_copy` for any other.
     */
    cta?: string;
}

/**
 * A prompt to paste into an agent, shown in full with a copy button. Without a
 * `text` it is the setup prompt, which the SurrealDB Studio organisation overview
 * copies too. A page that starts a task gives its own prompt, pointing the agent
 * at that page's markdown.
 */
export function AgentPrompt({ text = SETUP_PROMPT, cta }: AgentPromptProps) {
    const isSetup = text === SETUP_PROMPT;

    return (
        <CopyPanel
            tabs={[
                {
                    value: "prompt",
                    label: "Agent prompt",
                    text,
                    prose: true,
                    copyLabel: "Copy prompt",
                    cta:
                        cta ??
                        (isSetup ? "docs_agent_prompt_setup_copy" : "docs_agent_prompt_task_copy"),
                },
            ]}
            onCopy={isSetup ? trackSetupPromptCopy : undefined}
        />
    );
}
