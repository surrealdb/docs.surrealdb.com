import MDXComponents from '@theme-original/MDXComponents';
import Version from '@site/src/components/Version';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'; // Import the FontAwesomeIcon component
import { library } from '@fortawesome/fontawesome-svg-core'; // Import the library component
import { fab } from '@fortawesome/free-brands-svg-icons'; // Import all brands icons
import { fas } from '@fortawesome/free-solid-svg-icons'; // Import all solid icons

library.add(fab, fas);

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Version,
  Icon,
};