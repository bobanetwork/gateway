import React, { ReactNode } from 'react';
import clsx from 'clsx'; // Optional utility to conditionally apply classes

// Define possible typography variants
type TypographyVariant =
  | '3xl'
  | '2xl'
  | 'xl'
  | 'lg'
  | 'md'
  | 'sm'
  | 'xs';

// Define font weight supported 
type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';


interface TypographyProps {
  variant?: TypographyVariant;
  fontWeight?: FontWeight;
  fontFamily?: 'inter' | 'montserrat';
  align?: 'left' | 'center' | 'right';
  children: ReactNode;
  className?: string; // Additional classnames
}

const Text: React.FC<TypographyProps> = ({
  variant = 'md',
  fontWeight = 'normal',
  fontFamily = 'inter',
  align = 'left',
  children,
  className }) => {
  // Map variant to tailwind font sizes
  const variantClasses = {
    '3xl': 'text-3xl font-bold',   // 36px
    '2xl': 'text-2xl font-semibold', // 24px
    'xl': 'text-xl font-medium',   // 20px
    'lg': 'text-lg font-medium',   // 18px
    'md': 'text-md font-normal',   // 16px
    'sm': 'text-sm font-normal',   // 14px
    'xs': 'text-xs font-normal',   // 12px
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <p className={clsx(
      variantClasses[variant],
      alignClasses[align],
      `font-${fontWeight}`,
      `font-${fontFamily}`,
      className
    )}>
      {children}
    </p>
  );
};

export default Text;
