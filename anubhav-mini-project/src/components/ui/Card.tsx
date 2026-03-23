import * as React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : {}}
        className={cn(
          'rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
