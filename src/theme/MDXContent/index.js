import React from 'react';
import {MDXProvider} from '@mdx-js/react';
import MDXComponents from '@theme/MDXComponents';
import { ModalProvider } from '@site/src/utils/ModalContext';
import FeedbackDialog from '@site/src/theme/FeedbackDialog';

export default function MDXContent({children}) {
  return (
      <MDXProvider components={MDXComponents}>
        {children}
        <ModalProvider>
          <FeedbackDialog />
        </ModalProvider>
      </MDXProvider>
  );
}
