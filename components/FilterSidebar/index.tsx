import { labLanguages, labTopics } from "@content/config";
import { Box, Checkbox, Divider, Stack, Title } from "@mantine/core";
import classes from "./style.module.scss";

export interface FilterSidebarProps {
    authorFilter: string[];
    setAuthorFilter: (v: string[]) => void;
    languageFilter: string[];
    setLanguageFilter: (v: string[]) => void;
    topicFilter: string[];
    setTopicFilter: (v: string[]) => void;
}

export function FilterSidebar({
    authorFilter,
    setAuthorFilter,
    languageFilter,
    setLanguageFilter,
    topicFilter,
    setTopicFilter,
}: FilterSidebarProps) {
    return (
        <Box
            component="aside"
            className={classes.root}
        >
            <Stack gap="md">
                <Box>
                    <Title
                        order={4}
                        fz="sm"
                        c="bright"
                        fw={700}
                        mb="sm"
                    >
                        Filters
                    </Title>
                    <Checkbox.Group
                        value={authorFilter}
                        onChange={setAuthorFilter}
                    >
                        <Stack gap="xs">
                            <Checkbox
                                value="official"
                                label="SurrealDB Official"
                            />
                            <Checkbox
                                value="community"
                                label="Community"
                            />
                        </Stack>
                    </Checkbox.Group>
                </Box>

                <Divider />

                <Box>
                    <Title
                        order={4}
                        fz="sm"
                        c="bright"
                        fw={700}
                        mb="sm"
                    >
                        Languages
                    </Title>
                    <Checkbox.Group
                        value={languageFilter}
                        onChange={setLanguageFilter}
                    >
                        <Stack gap="xs">
                            {labLanguages.map((lang) => (
                                <Checkbox
                                    key={lang}
                                    value={lang}
                                    label={lang}
                                />
                            ))}
                        </Stack>
                    </Checkbox.Group>
                </Box>

                <Divider />

                <Box>
                    <Title
                        order={4}
                        fz="sm"
                        c="bright"
                        fw={700}
                        mb="sm"
                    >
                        Topics
                    </Title>
                    <Checkbox.Group
                        value={topicFilter}
                        onChange={setTopicFilter}
                    >
                        <Stack gap="xs">
                            {labTopics.map((topic) => (
                                <Checkbox
                                    key={topic}
                                    value={topic}
                                    label={topic}
                                />
                            ))}
                        </Stack>
                    </Checkbox.Group>
                </Box>
            </Stack>
        </Box>
    );
}
