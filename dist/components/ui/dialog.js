import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export function Dialog({ open, onClose, children }) {
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", role: "dialog", "aria-modal": "true", children: _jsxs("div", { className: "relative bg-white p-6 rounded-md shadow w-full max-w-sm", children: [_jsx("button", { "aria-label": "Close", className: "absolute top-2 right-2 text-gray-500 hover:text-gray-700", onClick: onClose, children: "\u2715" }), children] }) }));
}
