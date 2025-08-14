import { jsx as _jsx } from "react/jsx-runtime";

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(_jsx(App, {}));
}
