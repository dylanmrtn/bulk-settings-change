import React from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '@dynatrace/strato-components-preview';

export const Header = () => {
  return (
    <AppHeader>
      <AppHeader.NavItems>
        <AppHeader.AppNavLink as={Link} to="/" />
        <AppHeader.AppNavLink as={Link} to="/guide">Guide</AppHeader.AppNavLink>
      </AppHeader.NavItems>
    </AppHeader>
  );
};
