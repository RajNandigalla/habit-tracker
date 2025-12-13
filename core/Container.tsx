import React from 'react';
import { cn } from '../utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  wrapper?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  wrapper = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        wrapper ? 'max-w-[1920px]' : 'max-w-7xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
