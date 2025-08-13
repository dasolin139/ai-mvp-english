import React from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

export function Toast({ message, type }: ToastProps) {
  return (
    <div
      role="status"
      className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-white shadow transition-all ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {message}
    </div>
  );
}
