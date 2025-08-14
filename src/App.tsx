import React, { useState, useEffect } from 'react';
import { Input } from './components/ui/input.js';
import { Button } from './components/ui/button.js';
import { Checkbox } from './components/ui/checkbox.js';
import { Label } from './components/ui/label.js';
import { Dialog } from './components/ui/dialog.js';
import { Toast } from './components/ui/toast.js';

interface WaitlistEntry {
  email: string;
  submittedAt: string;
}

function getStoredEmails(): WaitlistEntry[] {
  try {
    const raw = localStorage.getItem('waitlist.emails');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEmails(list: WaitlistEntry[]) {
  localStorage.setItem('waitlist.emails', JSON.stringify(list));
}

function AdminDashboard({ emails, setEmails, onClose }: { emails: WaitlistEntry[]; setEmails: (v: WaitlistEntry[]) => void; onClose: () => void; }) {
  const [query, setQuery] = useState('');
  const filtered = emails.filter(e => e.email.includes(query));

  const deleteOne = (email: string) => {
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

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">수집 이메일 목록</h2>
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="검색"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={exportCSV}>CSV 내보내기</Button>
        <Button onClick={deleteAll} className="bg-red-600 hover:bg-red-700">전체 삭제</Button>
        <Button onClick={onClose} className="ml-auto">닫기</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">이메일</th>
              <th className="p-2 text-left">제출 시각</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.email} className="border-b last:border-0">
                <td className="p-2 break-all">{item.email}</td>
                <td className="p-2">{new Date(item.submittedAt).toLocaleString()}</td>
                <td className="p-2 text-right">
                  <Button
                    onClick={() => deleteOne(item.email)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const [emails, setEmails] = useState(getStoredEmails());
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null as any);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcodeOpen, setPasscodeOpen] = useState(false);
  const [passcode, setPasscode] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (loading) return;
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

  const openAdmin = (e: any) => {
    e.preventDefault();
    if (passcode === 'admin1234') {
      setIsAdmin(true);
      setPasscodeOpen(false);
      setPasscode('');
    } else {
      setToast({ message: '패스코드가 올바르지 않습니다.', type: 'error' });
    }
  };

  return (
    <div className="text-gray-900">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <button
        className="fixed top-4 right-4 z-40 text-sm underline"
        onClick={() => setPasscodeOpen(true)}
      >
        관리자 모드
      </button>
      <Dialog open={passcodeOpen} onClose={() => setPasscodeOpen(false)}>
        <form onSubmit={openAdmin} className="space-y-4">
          <div>
            <Label htmlFor="pass">패스코드</Label>
            <Input
              id="pass"
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">입장</Button>
        </form>
      </Dialog>
      {isAdmin ? (
        <AdminDashboard emails={emails} setEmails={setEmails} onClose={() => setIsAdmin(false)} />
      ) : (
        <main>
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl font-bold mb-4">AI 튜터로 면접 영어를 빠르게 준비하세요</h1>
            <p className="mb-6 text-lg">취업 준비 대학생을 위한 AI 영어 학습 서비스</p>
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
              <Input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="이메일 주소"
                required
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  aria-describedby="consent-desc"
                />
                <Label htmlFor="consent" id="consent-desc">
                  (필수) 이메일 수집에 동의합니다
                </Label>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? '처리중...' : '대기 명단 신청'}
              </Button>
            </form>
          </section>
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-8">문제 / 해결 / 가치 제안</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { title: '시간 부족', desc: '빠르게 준비해야 하지만 자료가 부족합니다.' },
                  { title: '맞춤 피드백', desc: 'AI가 개인 맞춤 피드백을 제공합니다.' },
                  { title: '언제 어디서나', desc: '모바일로도 학습이 가능합니다.' }
                ].map(card => (
                  <div key={card.title} className="p-4 border rounded-md bg-white">
                    <h3 className="font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-16">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-8">작동 방식</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '1', desc: 'AI에게 목표를 알려주세요.' },
                  { step: '2', desc: '맞춤 커리큘럼을 받으세요.' },
                  { step: '3', desc: '실전 연습으로 준비를 마무리하세요.' }
                ].map(s => (
                  <div key={s.step} className="p-4 border rounded-md">
                    <div className="text-3xl font-bold mb-2">{s.step}</div>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-16 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h2 className="text-2xl font-bold mb-8">사용자 후기</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-md bg-white text-sm text-gray-600">
                    "더미 후기가 들어갈 자리"
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-16">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-center">FAQ</h2>
              <div className="space-y-4">
                {[
                  { q: '어떻게 이용하나요?', a: '이메일 등록 후 안내를 받아보세요.' },
                  { q: '비용은 얼마인가요?', a: '정식 출시 전에 공지됩니다.' },
                  { q: '데이터는 안전한가요?', a: '로컬에만 저장되며 언제든 삭제할 수 있습니다.' },
                  { q: '모바일도 지원하나요?', a: '네, 모바일 최적화가 되어 있습니다.' },
                  { q: '언제 출시되나요?', a: '곧 출시 예정입니다.' }
                ].map(item => (
                  <div key={item.q} className="border rounded-md p-4 bg-white">
                    <p className="font-semibold">{item.q}</p>
                    <p className="text-sm text-gray-600 mt-2">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <footer className="py-8 bg-gray-100 text-center text-sm text-gray-600">
            <p className="mb-2">개인정보는 데모용으로 로컬에만 저장됩니다.</p>
            <p>문의: support@example.com</p>
          </footer>
        </main>
      )}
    </div>
  );
}
