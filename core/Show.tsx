import React, { Fragment } from 'react';

interface ShowProps {
  when: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const Show: React.FC<ShowProps> = ({ when, fallback, children }) => {
  if (when) return <Fragment>{children}</Fragment>;
  if (fallback) return <Fragment>{fallback}</Fragment>;
  return null;
};

export default Show;
