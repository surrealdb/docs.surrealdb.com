import React from 'react';

import {isMultiColumnFooterLinks} from '@docusaurus/theme-common';
import FooterLinksMultiColumn from '@theme-original/Footer/Links/MultiColumn';
import FooterLinksSimple from '@theme-original/Footer/Links/Simple';
import type {Props} from '@theme/Footer/Links';

export default function FooterLinks({links}: Props): JSX.Element {
  return isMultiColumnFooterLinks(links) ? (
    <FooterLinksMultiColumn columns={links} />
  ) : (
    <FooterLinksSimple links={links} />
  );
}
