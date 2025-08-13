import React from 'react';

export interface LabelProps {
  className?: string;
  children?: any;
  htmlFor?: string;
  id?: string;
  [key: string]: any;
}

export function Label({ className = '', children, ...props }: LabelProps) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
