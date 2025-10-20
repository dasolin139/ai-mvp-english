import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Checkbox } from './components/ui/checkbox';
import { Label } from './components/ui/label';
import { Dialog } from './components/ui/dialog';
import { Toast } from './components/ui/toast';

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
    a.download = 'digital-marketing-waitlist.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Email Waitlist</h2>
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={exportCSV}>Export CSV</Button>
        <Button onClick={deleteAll} className="bg-red-600 hover:bg-red-700">Delete All</Button>
        <Button onClick={onClose} className="ml-auto">Close</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Submitted At</th>
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
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">No data available.</td>
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

  const openAdmin = (e: any) => {
    e.preventDefault();
    if (passcode === 'admin1234') {
      setIsAdmin(true);
      setPasscodeOpen(false);
      setPasscode('');
    } else {
      setToast({ message: 'Incorrect passcode.', type: 'error' });
    }
  };

  return (
    <div className="text-gray-900">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <button
        className="fixed top-4 right-4 z-40 text-sm underline"
        onClick={() => setPasscodeOpen(true)}
      >
        Admin
      </button>
      <Dialog open={passcodeOpen} onClose={() => setPasscodeOpen(false)}>
        <form onSubmit={openAdmin} className="space-y-4">
          <div>
            <Label htmlFor="pass">Passcode</Label>
            <Input
              id="pass"
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Enter</Button>
        </form>
      </Dialog>
      {isAdmin ? (
        <AdminDashboard emails={emails} setEmails={setEmails} onClose={() => setIsAdmin(false)} />
      ) : (
        <main>
          {/* Hero Section */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                Master Digital Marketing in Nigeria
              </h1>
              <p className="mb-8 text-xl md:text-2xl text-gray-700">
                Learn in-demand skills. Grow your business. Build your career.
              </p>
              <p className="mb-10 text-lg text-gray-600 max-w-2xl mx-auto">
                Join thousands of Nigerians transforming their careers with practical digital marketing education designed for the African market.
              </p>
              <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  aria-label="Email address"
                  required
                />
                <div className="flex items-center space-x-2 text-left">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    aria-describedby="consent-desc"
                  />
                  <Label htmlFor="consent" id="consent-desc" className="text-sm">
                    I agree to receive course updates and marketing communications
                  </Label>
                </div>
                <Button type="submit" disabled={loading} className="w-full text-lg py-6">
                  {loading ? 'Processing...' : 'Join the Waitlist'}
                </Button>
              </form>
            </div>
          </section>

          {/* Why Digital Marketing Section */}
          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Digital Marketing in Nigeria?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
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
                ].map(card => (
                  <div key={card.title} className="p-6 border-2 rounded-lg bg-white hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{card.icon}</div>
                    <h3 className="font-bold text-xl mb-3">{card.title}</h3>
                    <p className="text-gray-600">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Courses Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">What You'll Learn</h2>
              <p className="text-center text-gray-600 mb-12 text-lg">Comprehensive courses designed for the Nigerian market</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
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
                ].map(course => (
                  <div key={course.title} className="p-6 border rounded-lg bg-white">
                    <h3 className="font-bold text-lg mb-3">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{course.desc}</p>
                    <div className="space-y-2">
                      {course.skills.map(skill => (
                        <div key={skill} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block mr-2">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { step: '1', title: 'Enroll', desc: 'Join our waitlist and get early access to courses at discounted rates.' },
                  { step: '2', title: 'Learn', desc: 'Study at your own pace with video lessons, practical assignments, and real projects.' },
                  { step: '3', title: 'Earn', desc: 'Get certified, build your portfolio, and start earning with your new digital marketing skills.' }
                ].map(s => (
                  <div key={s.step} className="p-6">
                    <div className="w-16 h-16 bg-blue-600 text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                      {s.step}
                    </div>
                    <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                    <p className="text-gray-600">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Success Stories Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-12">Success Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
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
                ].map(testimonial => (
                  <div key={testimonial.name} className="p-6 border rounded-lg bg-white text-left">
                    <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                    <div className="border-t pt-4">
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
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
                ].map(item => (
                  <div key={item.q} className="border rounded-lg p-6 bg-gray-50">
                    <p className="font-bold text-lg mb-2">{item.q}</p>
                    <p className="text-gray-700">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-12 bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Digital Marketing Academy Nigeria</h3>
                <p className="text-gray-400">Empowering Nigerians with digital skills</p>
              </div>
              <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
                <p className="mb-2">Your email is stored locally for demo purposes only.</p>
                <p>Contact: hello@digitalmarketingng.com</p>
                <p className="mt-4">© 2025 Digital Marketing Academy Nigeria. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      )}
    </div>
  );
}
