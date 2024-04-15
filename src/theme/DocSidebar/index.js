// website/src/theme/DocSidebar/index.js
import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';
import { useActivePlugin } from '@docusaurus/plugin-content-docs/lib/client/index.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import ThemedImage from "@theme/ThemedImage";
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';

const mappedDocTitle = {
    'doc-surrealist': {
        title: "Surrealist",
        iconLight: "img/light/doc-surrealml.png",
        iconDark: "img/doc-surrealml.png",
    },
    'doc-surrealml': {
        title: "SurrealML",
        iconLight: "img/light/doc-surrealml.png",
        iconDark: "img/doc-surrealml.png",
    },
    'doc-surrealdb': {
        title: "SurrealDB",
        iconLight: "img/light/doc-surrealdb.png",
        iconDark: "img/doc-surrealdb.png",
    }
}

export default function DocSidebarWrapper(props) {
    const plugin = useActivePlugin();
    const docTitle = mappedDocTitle[plugin.pluginId];

    return (
        <div className="custom-sidebarContainer">
            <div style={{paddingTop: 'var(--ifm-navbar-height)'}}></div>
            {plugin.pluginId !== 'default' && (
                <>
                    <div className='custom-sidebarBackToHome'>
                        <Link href="/docs">
                            <FontAwesomeIcon icon={faChevronLeft} />
                            Back to Home
                        </Link>
                    </div>
                    <div className="custom-sidebarDocIdentifier">
                        <div className='custom-sidebarDocTitle'>
                            {docTitle ? (
                                <>
                                    <ThemedImage
                                        alt="Rust"
                                        width="35"
                                        className="devicon"
                                        sources={{
                                            light: useBaseUrl(docTitle.iconLight),
                                            dark: useBaseUrl(docTitle.iconDark),
                                        }}
                                    />
                                    <h2>
                                        {docTitle.title}
                                    </h2>
                                </>
                            ) : (
                                <h2>
                                    {plugin.pluginId}
                                </h2>
                            )}
                        </div>
                        <div className="custom-sidebarDocVersion">
                            <DocsVersionDropdownNavbarItem 
                                docsPluginId={plugin.pluginId}
                                dropdownItemsBefore={[]} 
                                dropdownItemsAfter={[]} 
                            />
                        </div>
                    </div>
                    <hr class="custom-sidebarSeparator" />
                </>
            )}
            <div className="doc-sidebar-container">
                <DocSidebar {...props} />
            </div>
        </div>
    );
}