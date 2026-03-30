import type { NavSection } from "~/utils/sidebar";

export interface PageNavigationProps {
    navigation: NavSection[];
}

export function PageNavigation({ navigation }: PageNavigationProps) {
    // const { urlPathname } = usePageContext();
    // const pages = flattenNavigation(navigation);
    // const currentIndex = findCurrentPageIndex(pages, urlPathname);

    // if (currentIndex === -1) return null;

    // const prev = currentIndex > 0 ? pages[currentIndex - 1] : null;
    // const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

    // if (!prev && !next) return null;

    // return (
    //     <Box
    //         className={classes.pageNavigation}
    //         mt="2xl"
    //     >
    //         {prev ? (
    //             <Anchor
    //                 className={classes.pageNavigationLink}
    //                 href={prev.href}
    //                 underline="never"
    //             >
    //                 <Flex
    //                     align="center"
    //                     gap="md"
    //                 >
    //                     <Icon
    //                         path={iconChevronLeft}
    //                         size="sm"
    //                     />
    //                     <Box lh="xs">
    //                         <Text
    //                             fz="xs"
    //                             opacity={0.6}
    //                             inherit
    //                         >
    //                             Previous
    //                         </Text>
    //                         <Text
    //                             fz="lg"
    //                             fw={500}
    //                             c="bright"
    //                             inherit
    //                         >
    //                             {prev.label}
    //                         </Text>
    //                     </Box>
    //                 </Flex>
    //             </Anchor>
    //         ) : (
    //             <Box />
    //         )}
    //         {next ? (
    //             <Anchor
    //                 className={classes.pageNavigationLink}
    //                 href={next.href}
    //                 underline="never"
    //                 ta="right"
    //             >
    //                 <Flex
    //                     align="center"
    //                     justify="flex-end"
    //                     gap="md"
    //                 >
    //                     <Box lh="xs">
    //                         <Text
    //                             fz="xs"
    //                             opacity={0.6}
    //                             inherit
    //                         >
    //                             Next
    //                         </Text>
    //                         <Text
    //                             fz="lg"
    //                             fw={500}
    //                             c="bright"
    //                             inherit
    //                         >
    //                             {next.label}
    //                         </Text>
    //                     </Box>
    //                     <Icon
    //                         path={iconChevronRight}
    //                         size="sm"
    //                     />
    //                 </Flex>
    //             </Anchor>
    //         ) : (
    //             <Box />
    //         )}
    //     </Box>
    // );
    return null;
}
