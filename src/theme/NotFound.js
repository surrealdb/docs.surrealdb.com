import React from 'react';
import { useLocation } from '@docusaurus/router';
import { Redirect } from '@docusaurus/router';

export default function NotFound() {
  
  const location = useLocation();
  const { pathname } = location;
  const lastSlashIndex = pathname.lastIndexOf('/');
  const redirectTo = pathname.slice(0, lastSlashIndex);

  return <Redirect to={redirectTo} />;
}