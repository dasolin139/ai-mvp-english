import React from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: any;
}

export function Dialog({ open, onClose, children }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
      <div className="relative bg-white p-6 rounded-md shadow w-full max-w-sm">
        <button
          aria-label="Close"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
