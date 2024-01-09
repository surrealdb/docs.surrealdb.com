import React from 'react';
import { Redirect } from '@docusaurus/router';

export default function Home(): JSX.Element {
  return <Redirect to="/docs/1.1.x/intro" />;
}
