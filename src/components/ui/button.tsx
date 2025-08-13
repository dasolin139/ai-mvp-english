import React from 'react';

export interface ButtonProps {
  className?: string;
  children?: any;
  [key: string]: any;
}

export function Button({ className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
