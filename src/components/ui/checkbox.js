import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
export const Checkbox = React.forwardRef(({ className = '', ...props }, ref) => (_jsx("input", { type: "checkbox", ref: ref, className: `h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 ${className}`, ...props })));
Checkbox.displayName = 'Checkbox';
