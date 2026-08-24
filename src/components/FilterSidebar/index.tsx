import { Box, type BoxProps, Checkbox, Stack } from "@mantine/core";
import { iconBraces, iconGrid, iconList } from "@surrealdb/ui";
import { SIDEBAR_INSET, SidebarPane, SidebarSectionHeading } from "~/components/Layout/sidebar";
import { labLanguages, labTopics } from "~/utils/labs";
import classes from "./style.module.scss";

export interface FilterSidebarProps extends BoxProps {
    authorFilter: string[];
    setAuthorFilter: (v: string[]) => void;
    languageFilter: string[];
    setLanguageFilter: (v: string[]) => void;
    topicFilter: string[];
    setTopicFilter: (v: string[]) => void;
}

interface FilterSectionProps {
    icon: string;
    title: string;
    value: string[];
    onChange: (v: string[]) => void;
    options: readonly string[] | { value: string; label: string }[];
}

function FilterSection({ icon, title, value, onChange, options }: FilterSectionProps) {
    return (
        <Box component="section">
            <SidebarSectionHeading icon={icon}>{title}</SidebarSectionHeading>
            <Checkbox.Group
                value={value}
                onChange={onChange}
            >
                <Stack
                    gap="sm"
                    px="sm"
                >
                    {options.map((option) => {
                        const { value: optionValue, label } =
                            typeof option === "string" ? { value: option, label: option } : option;

                        return (
                            <Checkbox
                                key={optionValue}
                                value={optionValue}
                                label={label}
                                classNames={{ input: classes.checkboxInput }}
                            />
                        );
                    })}
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
    authorFilter,
    setAuthorFilter,
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
                    icon={iconList}
                    title="Filters"
                    value={authorFilter}
                    onChange={setAuthorFilter}
                    options={[
                        { value: "official", label: "SurrealDB Official" },
                        { value: "community", label: "Community" },
                    ]}
                />
                <FilterSection
                    icon={iconBraces}
                    title="Languages"
                    value={languageFilter}
                    onChange={setLanguageFilter}
                    options={labLanguages}
                />
                <FilterSection
                    icon={iconGrid}
                    title="Topics"
                    value={topicFilter}
                    onChange={setTopicFilter}
                    options={labTopics}
                />
            </Stack>
        </SidebarPane>
    );
}
