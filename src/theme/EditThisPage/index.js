import React from 'react';
import Translate from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import IconEdit from '@theme/Icon/Edit';
export default function EditThisPage({editUrl}) {
  return (
    <a
      href={editUrl}
      target="_blank"
      rel="noreferrer noopener"
      className={ThemeClassNames.common.editThisPage}>
      <IconEdit />
      Edit this page on Github
    </a>
  );
}
