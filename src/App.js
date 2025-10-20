import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { Label } from './components/ui/label';
import { Dialog } from './components/ui/dialog';
import { Toast } from './components/ui/toast';
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
        a.download = 'digital-marketing-waitlist.csv';
        a.click();
        URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "p-4 max-w-3xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Email Waitlist" }), _jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Input, { placeholder: "Search", value: query, onChange: e => setQuery(e.target.value), className: "max-w-xs" }), _jsx(Button, { onClick: exportCSV, children: "Export CSV" }), _jsx(Button, { onClick: deleteAll, className: "bg-red-600 hover:bg-red-700", children: "Delete All" }), _jsx(Button, { onClick: onClose, className: "ml-auto", children: "Close" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "p-2 text-left", children: "Email" }), _jsx("th", { className: "p-2 text-left", children: "Submitted At" }), _jsx("th", { className: "p-2" })] }) }), _jsxs("tbody", { children: [filtered.map((item) => (_jsxs("tr", { className: "border-b last:border-0", children: [_jsx("td", { className: "p-2 break-all", children: item.email }), _jsx("td", { className: "p-2", children: new Date(item.submittedAt).toLocaleString() }), _jsx("td", { className: "p-2 text-right", children: _jsx(Button, { onClick: () => deleteOne(item.email), className: "bg-red-600 hover:bg-red-700", children: "Delete" }) })] }, item.email))), filtered.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 3, className: "p-4 text-center text-gray-500", children: "No data available." }) }))] })] }) })] }));
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
            setToast({ message: 'Please enter a valid email address.', type: 'error' });
            return;
        }
        if (!consent) {
            setToast({ message: 'You must agree to receive course updates.', type: 'error' });
            return;
        }
        if (emails.some(e => e.email === email)) {
            setToast({ message: 'This email is already registered.', type: 'error' });
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
        setToast({ message: 'Successfully registered! We\'ll be in touch soon.', type: 'success' });
    };
    const openAdmin = (e) => {
        e.preventDefault();
        if (passcode === 'admin1234') {
            setIsAdmin(true);
            setPasscodeOpen(false);
            setPasscode('');
        }
        else {
            setToast({ message: 'Incorrect passcode.', type: 'error' });
        }
    };
    return (_jsxs("div", { className: "text-gray-900", children: [toast && _jsx(Toast, { message: toast.message, type: toast.type }), _jsx("button", { className: "fixed top-4 right-4 z-40 text-sm underline", onClick: () => setPasscodeOpen(true), children: "Admin" }), _jsx(Dialog, { open: passcodeOpen, onClose: () => setPasscodeOpen(false), children: _jsxs("form", { onSubmit: openAdmin, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "pass", children: "Passcode" }), _jsx(Input, { id: "pass", type: "password", value: passcode, onChange: e => setPasscode(e.target.value) })] }), _jsx(Button, { type: "submit", className: "w-full", children: "Enter" })] }) }), isAdmin ? (_jsx(AdminDashboard, { emails: emails, setEmails: setEmails, onClose: () => setIsAdmin(false) })) : (_jsxs("main", { children: [_jsx("section", { className: "min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-blue-50 to-white", children: _jsxs("div", { className: "max-w-4xl", children: [_jsx("h1", { className: "text-5xl md:text-6xl font-bold mb-6 text-gray-900", children: "Master Digital Marketing in Nigeria" }), _jsx("p", { className: "mb-8 text-xl md:text-2xl text-gray-700", children: "Learn in-demand skills. Grow your business. Build your career." }), _jsx("p", { className: "mb-10 text-lg text-gray-600 max-w-2xl mx-auto", children: "Join thousands of Nigerians transforming their careers with practical digital marketing education designed for the African market." }), _jsxs("form", { onSubmit: handleSubmit, className: "w-full max-w-md mx-auto space-y-4", children: [_jsx(Input, { type: "email", placeholder: "Enter your email address", value: email, onChange: e => setEmail(e.target.value), "aria-label": "Email address", required: true }), _jsxs("div", { className: "flex items-center space-x-2 text-left", children: [_jsx(Checkbox, { id: "consent", checked: consent, onChange: e => setConsent(e.target.checked), "aria-describedby": "consent-desc" }), _jsx(Label, { htmlFor: "consent", id: "consent-desc", className: "text-sm", children: "I agree to receive course updates and marketing communications" })] }), _jsx(Button, { type: "submit", disabled: loading, className: "w-full text-lg py-6", children: loading ? 'Processing...' : 'Join the Waitlist' })] })] }) }), _jsx("section", { className: "py-20 bg-white", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-12 text-center", children: "Why Digital Marketing in Nigeria?" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
                                        {
                                            title: 'Growing Digital Economy',
                                            desc: 'Nigeria has over 150 million internet users. Businesses need digital marketers to reach these customers online.',
                                            icon: '📈'
                                        },
                                        {
                                            title: 'High Earning Potential',
                                            desc: 'Digital marketers in Nigeria earn ₦150,000 - ₦500,000+ monthly. Freelancers can earn even more working globally.',
                                            icon: '💰'
                                        },
                                        {
                                            title: 'Work from Anywhere',
                                            desc: 'Digital marketing skills allow you to work remotely, start your own agency, or help local businesses grow.',
                                            icon: '🌍'
                                        }
                                    ].map(card => (_jsxs("div", { className: "p-6 border-2 rounded-lg bg-white hover:shadow-lg transition-shadow", children: [_jsx("div", { className: "text-4xl mb-4", children: card.icon }), _jsx("h3", { className: "font-bold text-xl mb-3", children: card.title }), _jsx("p", { className: "text-gray-600", children: card.desc })] }, card.title))) })] }) }), _jsx("section", { className: "py-20 bg-gray-50", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-4 text-center", children: "What You'll Learn" }), _jsx("p", { className: "text-center text-gray-600 mb-12 text-lg", children: "Comprehensive courses designed for the Nigerian market" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
                                        {
                                            title: 'Social Media Marketing',
                                            desc: 'Master Instagram, Facebook, Twitter, and TikTok marketing. Build engaged audiences and drive sales.',
                                            skills: ['Content Strategy', 'Paid Ads', 'Community Management']
                                        },
                                        {
                                            title: 'SEO & Content Marketing',
                                            desc: 'Rank on Google Nigeria. Create content that attracts customers and builds authority.',
                                            skills: ['Keyword Research', 'On-page SEO', 'Content Writing']
                                        },
                                        {
                                            title: 'Email Marketing',
                                            desc: 'Build email lists, create campaigns, and convert subscribers into customers.',
                                            skills: ['Email Copywriting', 'Automation', 'List Building']
                                        },
                                        {
                                            title: 'Digital Advertising',
                                            desc: 'Run profitable ad campaigns on Google, Facebook, and Instagram for Nigerian businesses.',
                                            skills: ['Google Ads', 'Facebook Ads', 'Campaign Analytics']
                                        }
                                    ].map(course => (_jsxs("div", { className: "p-6 border rounded-lg bg-white", children: [_jsx("h3", { className: "font-bold text-lg mb-3", children: course.title }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: course.desc }), _jsx("div", { className: "space-y-2", children: course.skills.map(skill => (_jsx("div", { className: "text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block mr-2", children: skill }, skill))) })] }, course.title))) })] }) }), _jsx("section", { className: "py-20 bg-white", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-12", children: "How It Works" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
                                        { step: '1', title: 'Enroll', desc: 'Join our waitlist and get early access to courses at discounted rates.' },
                                        { step: '2', title: 'Learn', desc: 'Study at your own pace with video lessons, practical assignments, and real projects.' },
                                        { step: '3', title: 'Earn', desc: 'Get certified, build your portfolio, and start earning with your new digital marketing skills.' }
                                    ].map(s => (_jsxs("div", { className: "p-6", children: [_jsx("div", { className: "w-16 h-16 bg-blue-600 text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-4", children: s.step }), _jsx("h3", { className: "font-bold text-xl mb-2", children: s.title }), _jsx("p", { className: "text-gray-600", children: s.desc })] }, s.step))) })] }) }), _jsx("section", { className: "py-20 bg-gray-50", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 text-center", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-12", children: "Success Stories" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
                                        {
                                            name: 'Chioma O.',
                                            location: 'Lagos',
                                            quote: 'After completing the course, I started my own social media agency. Now I manage 15+ clients and earn over ₦400,000 monthly.',
                                            role: 'Social Media Manager'
                                        },
                                        {
                                            name: 'Ibrahim K.',
                                            location: 'Abuja',
                                            quote: 'The SEO skills I learned helped me grow my e-commerce store from 0 to 10,000 visitors per month. Sales have tripled!',
                                            role: 'E-commerce Entrepreneur'
                                        },
                                        {
                                            name: 'Grace A.',
                                            location: 'Port Harcourt',
                                            quote: 'I landed a digital marketing job at a top tech company in Lagos just 2 months after completing the program.',
                                            role: 'Digital Marketing Specialist'
                                        }
                                    ].map(testimonial => (_jsxs("div", { className: "p-6 border rounded-lg bg-white text-left", children: [_jsxs("p", { className: "text-gray-700 mb-4 italic", children: ["\"", testimonial.quote, "\""] }), _jsxs("div", { className: "border-t pt-4", children: [_jsx("p", { className: "font-bold", children: testimonial.name }), _jsx("p", { className: "text-sm text-gray-600", children: testimonial.role }), _jsx("p", { className: "text-xs text-gray-500", children: testimonial.location })] })] }, testimonial.name))) })] }) }), _jsx("section", { className: "py-20 bg-white", children: _jsxs("div", { className: "max-w-3xl mx-auto px-4", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-12 text-center", children: "Frequently Asked Questions" }), _jsx("div", { className: "space-y-4", children: [
                                        {
                                            q: 'Do I need any prior experience?',
                                            a: 'No prior experience required! Our courses are designed for beginners and include everything you need to start from scratch.'
                                        },
                                        {
                                            q: 'How much do the courses cost?',
                                            a: 'Pricing will be announced soon. Waitlist members will receive exclusive early-bird discounts of up to 50% off.'
                                        },
                                        {
                                            q: 'Can I learn while working full-time?',
                                            a: 'Absolutely! All courses are self-paced and include lifetime access. Study whenever it fits your schedule.'
                                        },
                                        {
                                            q: 'Will I get a certificate?',
                                            a: 'Yes! You\'ll receive an industry-recognized certificate upon completion that you can share on LinkedIn and with employers.'
                                        },
                                        {
                                            q: 'Do you offer payment plans?',
                                            a: 'Yes, we offer flexible payment plans to make education accessible to all Nigerians. Pay in installments interest-free.'
                                        },
                                        {
                                            q: 'Is the content relevant for Nigeria?',
                                            a: 'Yes! All examples, case studies, and projects are based on Nigerian businesses and the African market context.'
                                        }
                                    ].map(item => (_jsxs("div", { className: "border rounded-lg p-6 bg-gray-50", children: [_jsx("p", { className: "font-bold text-lg mb-2", children: item.q }), _jsx("p", { className: "text-gray-700", children: item.a })] }, item.q))) })] }) }), _jsx("footer", { className: "py-12 bg-gray-900 text-white", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h3", { className: "text-2xl font-bold mb-2", children: "Digital Marketing Academy Nigeria" }), _jsx("p", { className: "text-gray-400", children: "Empowering Nigerians with digital skills" })] }), _jsxs("div", { className: "border-t border-gray-700 pt-8 text-center text-sm text-gray-400", children: [_jsx("p", { className: "mb-2", children: "Your email is stored locally for demo purposes only." }), _jsx("p", { children: "Contact: hello@digitalmarketingng.com" }), _jsx("p", { className: "mt-4", children: "\u00A9 2025 Digital Marketing Academy Nigeria. All rights reserved." })] })] }) })] }))] }));
}
