import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import Highlight from '@site/src/components/Highlight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component
import { library } from '@fortawesome/fontawesome-svg-core'; // Import the library component
import { fab } from '@fortawesome/free-brands-svg-icons'; // Import all brands icons
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import all solid icons

library.add(fab, fas);

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Map the "<Highlight>" tag to our Highlight component
  // `Highlight` will receive all props that were passed to `<Highlight>` in MDX
  Highlight,
  Icon: FontAwesomeIcon,
};