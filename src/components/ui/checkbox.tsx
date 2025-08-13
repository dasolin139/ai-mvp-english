import React from 'react';

export interface CheckboxProps {
  className?: string;
  [key: string]: any;
}

export const Checkbox = React.forwardRef(
  ({ className = '', ...props }: CheckboxProps, ref: any) => (
    <input
      type="checkbox"
      ref={ref}
      className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 ${className}`}
      {...props}
    />
  )
);
Checkbox.displayName = 'Checkbox';
