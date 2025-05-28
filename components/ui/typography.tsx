import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {}

export const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn('text-4xl font-bold tracking-tight', className)}
      {...props}
    />
  )
);
H1.displayName = 'H1';

export const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-3xl font-semibold tracking-tight', className)}
      {...props}
    />
  )
);
H2.displayName = 'H2';

export const P = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-base leading-relaxed', className)}
      {...props}
    />
  )
);
P.displayName = 'P';
