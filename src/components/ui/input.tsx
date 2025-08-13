import React from 'react';

export interface InputProps {
  className?: string;
  [key: string]: any;
}

export const Input = React.forwardRef((
  { className = '', ...props }: InputProps,
  ref: any
) => (
  <input
    ref={ref}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${className}`}
    {...props}
  />
));
Input.displayName = 'Input';
