import React, { useEffect, useState } from 'react';
import { cn } from '../../utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Trigger animation frame after mount
    requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => setIsMounted(false);
  }, []);

  return (
    <div 
        className={cn(
            "transition-all duration-500 ease-ios will-change-transform h-full flex flex-col",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
            className
        )}
    >
      {children}
    </div>
  );
};

export default PageTransition;