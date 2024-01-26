import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent() {
  const { colorMode } = useColorMode();

  return (
    <Giscus    
      repo="surrealdb/docs.surrealdb.com"
      repoId="MDEwOlJlcG9zaXRvcnkyMjc4MTY1NzM="
      category="General"
      categoryId="DIC_kwDODZQ0fc4CayrW"
      mapping="url"                      // Important! To map comments to URL
      term="Welcome to @giscus/react component!"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme={colorMode}
      lang="en"
      loading="lazy"
      crossorigin="anonymous"
      async
    />
  );
}