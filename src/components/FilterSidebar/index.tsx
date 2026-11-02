import { Box, type BoxProps, Checkbox, Stack } from "@mantine/core";
import { SIDEBAR_INSET, SidebarPane, SidebarSectionHeading } from "~/components/Layout/sidebar";
import { labFormats, labLanguages, labStages, labTopics } from "~/utils/labs";
import classes from "./style.module.scss";

export interface FilterSidebarProps extends BoxProps {
    stageFilter: string[];
    setStageFilter: (v: string[]) => void;
    formatFilter: string[];
    setFormatFilter: (v: string[]) => void;
    languageFilter: string[];
    setLanguageFilter: (v: string[]) => void;
    topicFilter: string[];
    setTopicFilter: (v: string[]) => void;
}

interface FilterSectionProps {
    title: string;
    value: string[];
    onChange: (v: string[]) => void;
    options: readonly string[];
}

function FilterSection({ title, value, onChange, options }: FilterSectionProps) {
    return (
        <Box component="section">
            <SidebarSectionHeading>{title}</SidebarSectionHeading>
            <Checkbox.Group
                value={value}
                onChange={onChange}
            >
                <Stack
                    gap="sm"
                    px="sm"
                >
                    {options.map((option) => (
                        <Checkbox
                            key={option}
                            value={option}
                            label={option}
                            classNames={{ input: classes.checkboxInput }}
                        />
                    ))}
                </Stack>
            </Checkbox.Group>
        </Box>
    );
}

/**
 * Filter rail for the labs index. Sits in the same shell column as the docs
 * tree and borrows its pane, insets and section headings, so the two rails
 * read identically.
 */
export function FilterSidebar({
    stageFilter,
    setStageFilter,
    formatFilter,
    setFormatFilter,
    languageFilter,
    setLanguageFilter,
    topicFilter,
    setTopicFilter,
    ...props
}: FilterSidebarProps) {
    return (
        <SidebarPane {...props}>
            <Stack
                gap="lg"
                component="nav"
                aria-label="Lab filters"
                px={SIDEBAR_INSET}
            >
                <FilterSection
                    title="Stage"
                    value={stageFilter}
                    onChange={setStageFilter}
                    options={labStages}
                />
                <FilterSection
                    title="Format"
                    value={formatFilter}
                    onChange={setFormatFilter}
                    options={labFormats}
                />
                <FilterSection
                    title="Topics"
                    value={topicFilter}
                    onChange={setTopicFilter}
                    options={labTopics}
                />
                <FilterSection
                    title="Languages"
                    value={languageFilter}
                    onChange={setLanguageFilter}
                    options={labLanguages}
                />
            </Stack>
        </SidebarPane>
    );
}
