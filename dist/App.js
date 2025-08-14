import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

function getStoredEmails() {
    try {
        const raw = localStorage.getItem('waitlist.emails');
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function saveEmails(list) {
    localStorage.setItem('waitlist.emails', JSON.stringify(list));
}
function AdminDashboard({ emails, setEmails, onClose }) {
    const [query, setQuery] = useState('');
    const filtered = emails.filter(e => e.email.includes(query));
    const deleteOne = (email) => {
        const next = emails.filter(e => e.email !== email);
        setEmails(next);
        saveEmails(next);
    };
    const deleteAll = () => {
        setEmails([]);
        saveEmails([]);
    };
    const exportCSV = () => {
        const header = 'email,submittedAt\n';
        const rows = emails.map(e => `${e.email},${e.submittedAt}`).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'waitlist.csv';
        a.click();
        URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "p-4 max-w-3xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "\uC218\uC9D1 \uC774\uBA54\uC77C \uBAA9\uB85D" }), _jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Input, { placeholder: "\uAC80\uC0C9", value: query, onChange: e => setQuery(e.target.value), className: "max-w-xs" }), _jsx(Button, { onClick: exportCSV, children: "CSV \uB0B4\uBCF4\uB0B4\uAE30" }), _jsx(Button, { onClick: deleteAll, className: "bg-red-600 hover:bg-red-700", children: "\uC804\uCCB4 \uC0AD\uC81C" }), _jsx(Button, { onClick: onClose, className: "ml-auto", children: "\uB2EB\uAE30" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "p-2 text-left", children: "\uC774\uBA54\uC77C" }), _jsx("th", { className: "p-2 text-left", children: "\uC81C\uCD9C \uC2DC\uAC01" }), _jsx("th", { className: "p-2" })] }) }), _jsxs("tbody", { children: [filtered.map((item) => (_jsxs("tr", { className: "border-b last:border-0", children: [_jsx("td", { className: "p-2 break-all", children: item.email }), _jsx("td", { className: "p-2", children: new Date(item.submittedAt).toLocaleString() }), _jsx("td", { className: "p-2 text-right", children: _jsx(Button, { onClick: () => deleteOne(item.email), className: "bg-red-600 hover:bg-red-700", children: "\uC0AD\uC81C" }) })] }, item.email))), filtered.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 3, className: "p-4 text-center text-gray-500", children: "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." }) }))] })] }) })] }));
}
export default function App() {
    const [emails, setEmails] = useState(getStoredEmails());
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [passcodeOpen, setPasscodeOpen] = useState(false);
    const [passcode, setPasscode] = useState('');
    useEffect(() => {
        const t = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(t);
    }, [toast]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading)
            return;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setToast({ message: '유효한 이메일을 입력하세요.', type: 'error' });
            return;
        }
        if (!consent) {
            setToast({ message: '개인정보 수집에 동의해야 합니다.', type: 'error' });
            return;
        }
        if (emails.some(e => e.email === email)) {
            setToast({ message: '이미 제출된 이메일입니다.', type: 'error' });
            return;
        }
        setLoading(true);
        const entry = { email, submittedAt: new Date().toISOString() };
        const next = [entry, ...emails];
        saveEmails(next);
        setEmails(next);
        setEmail('');
        setConsent(false);
        setLoading(false);
        setToast({ message: '제출되었습니다!', type: 'success' });
    };
    const openAdmin = (e) => {
        e.preventDefault();
        if (passcode === 'admin1234') {
            setIsAdmin(true);
            setPasscodeOpen(false);
            setPasscode('');
        }
        else {
            setToast({ message: '패스코드가 올바르지 않습니다.', type: 'error' });
        }
    };
    return (_jsxs("div", { className: "text-gray-900", children: [toast && _jsx(Toast, { message: toast.message, type: toast.type }), _jsx("button", { className: "fixed top-4 right-4 z-40 text-sm underline", onClick: () => setPasscodeOpen(true), children: "\uAD00\uB9AC\uC790 \uBAA8\uB4DC" }), _jsx(Dialog, { open: passcodeOpen, onClose: () => setPasscodeOpen(false), children: _jsxs("form", { onSubmit: openAdmin, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "pass", children: "\uD328\uC2A4\uCF54\uB4DC" }), _jsx(Input, { id: "pass", type: "password", value: passcode, onChange: e => setPasscode(e.target.value) })] }), _jsx(Button, { type: "submit", className: "w-full", children: "\uC785\uC7A5" })] }) }), isAdmin ? (_jsx(AdminDashboard, { emails: emails, setEmails: setEmails, onClose: () => setIsAdmin(false) })) : (_jsxs("main", { children: [_jsxs("section", { className: "min-h-screen flex flex-col items-center justify-center text-center px-4", children: [_jsx("h1", { className: "text-4xl font-bold mb-4", children: "AI \uD29C\uD130\uB85C \uBA74\uC811 \uC601\uC5B4\uB97C \uBE60\uB974\uAC8C \uC900\uBE44\uD558\uC138\uC694" }), _jsx("p", { className: "mb-6 text-lg", children: "\uCDE8\uC5C5 \uC900\uBE44 \uB300\uD559\uC0DD\uC744 \uC704\uD55C AI \uC601\uC5B4 \uD559\uC2B5 \uC11C\uBE44\uC2A4" }), _jsxs("form", { onSubmit: handleSubmit, className: "w-full max-w-md space-y-4", children: [_jsx(Input, { type: "email", placeholder: "\uC774\uBA54\uC77C \uC8FC\uC18C", value: email, onChange: e => setEmail(e.target.value), "aria-label": "\uC774\uBA54\uC77C \uC8FC\uC18C", required: true }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "consent", checked: consent, onChange: e => setConsent(e.target.checked), "aria-describedby": "consent-desc" }), _jsx(Label, { htmlFor: "consent", id: "consent-desc", children: "(\uD544\uC218) \uC774\uBA54\uC77C \uC218\uC9D1\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4" })] }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full", children: loading ? '처리중...' : '대기 명단 신청' })] })] }), _jsx("section", { className: "py-16 bg-gray-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 text-center", children: [_jsx("h2", { className: "text-2xl font-bold mb-8", children: "\uBB38\uC81C / \uD574\uACB0 / \uAC00\uCE58 \uC81C\uC548" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                                        { title: '시간 부족', desc: '빠르게 준비해야 하지만 자료가 부족합니다.' },
                                        { title: '맞춤 피드백', desc: 'AI가 개인 맞춤 피드백을 제공합니다.' },
                                        { title: '언제 어디서나', desc: '모바일로도 학습이 가능합니다.' }
                                    ].map(card => (_jsxs("div", { className: "p-4 border rounded-md bg-white", children: [_jsx("h3", { className: "font-semibold mb-2", children: card.title }), _jsx("p", { className: "text-sm text-gray-600", children: card.desc })] }, card.title))) })] }) }), _jsx("section", { className: "py-16", children: _jsxs("div", { className: "max-w-3xl mx-auto px-4 text-center", children: [_jsx("h2", { className: "text-2xl font-bold mb-8", children: "\uC791\uB3D9 \uBC29\uC2DD" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
                                        { step: '1', desc: 'AI에게 목표를 알려주세요.' },
                                        { step: '2', desc: '맞춤 커리큘럼을 받으세요.' },
                                        { step: '3', desc: '실전 연습으로 준비를 마무리하세요.' }
                                    ].map(s => (_jsxs("div", { className: "p-4 border rounded-md", children: [_jsx("div", { className: "text-3xl font-bold mb-2", children: s.step }), _jsx("p", { className: "text-sm text-gray-600", children: s.desc })] }, s.step))) })] }) }), _jsx("section", { className: "py-16 bg-gray-50", children: _jsxs("div", { className: "max-w-3xl mx-auto px-4 text-center", children: [_jsx("h2", { className: "text-2xl font-bold mb-8", children: "\uC0AC\uC6A9\uC790 \uD6C4\uAE30" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: Array.from({ length: 3 }).map((_, i) => (_jsx("div", { className: "p-4 border rounded-md bg-white text-sm text-gray-600", children: "\"\uB354\uBBF8 \uD6C4\uAE30\uAC00 \uB4E4\uC5B4\uAC08 \uC790\uB9AC\"" }, i))) })] }) }), _jsx("section", { className: "py-16", children: _jsxs("div", { className: "max-w-3xl mx-auto px-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-8 text-center", children: "FAQ" }), _jsx("div", { className: "space-y-4", children: [
                                        { q: '어떻게 이용하나요?', a: '이메일 등록 후 안내를 받아보세요.' },
                                        { q: '비용은 얼마인가요?', a: '정식 출시 전에 공지됩니다.' },
                                        { q: '데이터는 안전한가요?', a: '로컬에만 저장되며 언제든 삭제할 수 있습니다.' },
                                        { q: '모바일도 지원하나요?', a: '네, 모바일 최적화가 되어 있습니다.' },
                                        { q: '언제 출시되나요?', a: '곧 출시 예정입니다.' }
                                    ].map(item => (_jsxs("div", { className: "border rounded-md p-4 bg-white", children: [_jsx("p", { className: "font-semibold", children: item.q }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: item.a })] }, item.q))) })] }) }), _jsxs("footer", { className: "py-8 bg-gray-100 text-center text-sm text-gray-600", children: [_jsx("p", { className: "mb-2", children: "\uAC1C\uC778\uC815\uBCF4\uB294 \uB370\uBAA8\uC6A9\uC73C\uB85C \uB85C\uCEEC\uC5D0\uB9CC \uC800\uC7A5\uB429\uB2C8\uB2E4." }), _jsx("p", { children: "\uBB38\uC758: support@example.com" })] })] }))] }));
}
