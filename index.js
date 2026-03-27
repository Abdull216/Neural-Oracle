import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- SPIRITUAL LOGIC (ABJAD & RAML) ---
const ABJAD_MAP = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9, 'ي': 10, 'ى': 10,
  'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
  'a': 1, 'b': 2, 'j': 3, 'd': 4, 'h': 5, 'w': 6, 'z': 7, 'x': 8, 't': 9, 'y': 10, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 's': 60, 'o': 70, 'f': 80, 'p': 90, 'q': 100, 'r': 200, 'sh': 300, 'c': 400, 'u': 6, 'v': 6, 'e': 5, 'i': 10, 'g': 3
};

function calculateAbjad(text) {
  let total = 0;
  const normalized = text.toLowerCase();
  for (let i = 0; i < normalized.length; i++) {
    if (i < normalized.length - 1) {
      const pair = normalized.substring(i, i + 2);
      if (ABJAD_MAP[pair]) { total += ABJAD_MAP[pair]; i++; continue; }
    }
    const char = normalized[i];
    if (ABJAD_MAP[char]) total += ABJAD_MAP[char];
  }
  return total;
}

const RAML_FIGURES = [
  { id: 1, name: "Dariqee", type: "delayed", meaning: "Movement, slow but sure journey." },
  { id: 2, name: "Jama'a", type: "favorable", meaning: "Partnership, community, good for business." },
  { id: 3, name: "Uqba", type: "unfavorable", meaning: "Delays, endings, blockages." },
  { id: 4, name: "Kausaji", type: "spiritual", meaning: "Deceit, something hidden, loss." },
  { id: 5, name: "Dhahika", type: "favorable", meaning: "Joy, success, good news coming." },
  { id: 6, name: "Qabla Kharija", type: "delayed", meaning: "Money leaving, safe travel out." },
  { id: 7, name: "Humra", type: "spiritual", meaning: "Conflict, passion, fire, blood." },
  { id: 8, name: "Inkees", type: "unfavorable", meaning: "Loss, sadness, things turning upside down." },
  { id: 9, name: "Bayaad", type: "favorable", meaning: "Purity, clarity, a good outcome." },
  { id: 10, name: "Nusra Kharija", type: "delayed", meaning: "Victory over distant enemies." },
  { id: 11, name: "Nusra Dakhila", type: "favorable", meaning: "Victory at home, inner peace." },
  { id: 12, name: "Qabla Dakhila", type: "favorable", meaning: "Money arriving, safe return." },
  { id: 13, name: "Ijtima", type: "delayed", meaning: "Meeting of two things, good for marriage." },
  { id: 14, name: "Uqla", type: "unfavorable", meaning: "Tied up, delayed, restricted movement." },
  { id: 15, name: "Kabid Kharija", type: "unfavorable", meaning: "Loss of property, theft." },
  { id: 16, name: "Kabid Dakhila", type: "unfavorable", meaning: "Gaining property, holding tight." }
];

// --- SERVER SETUP ---
async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  let stats = { totalScans: 1240 };
  const adminData = {
    users: [{ id: 1, name: "CEO Abdullah Haruna", role: "Super Admin", status: "Active" }],
    paymentSettings: { paypalEmail: "abdullahharuna216@gmail.com", stripeKey: "sk_live_********************", bankAccount: "Neural Bank // Acc: 00123456789", masterCard: "**** **** **** 2026", autoDeposit: true },
    secretCodes: [
      { id: 1, name: "VRAXYTHERNOS", type: "Success", code: "VRAXYTHERNOS-PROTOCOL-V4", purpose: "Total Victory", usage: "Neural Lock", meaning: "The Unstoppable Force" },
      { id: 2, name: "AZYNTALIS", type: "Transformation", code: "AZY-999-TAL", purpose: "Matter Shift", usage: "Quantum Pulse", meaning: "The Realizer" }
    ],
    spiritualArchives: [
      { id: 1, title: "The Secret of Abjad", content: "Ancient numerology decoded for the modern era..." },
      { id: 2, title: "Neural Synchronization", content: "How to align your brain waves with the celestial frequencies..." }
    ]
  };

  app.get('/api/health', (req, res) => res.json({ status: 'ok', scans: stats.totalScans }));
  app.post('/api/track-scan', (req, res) => { stats.totalScans++; res.json({ success: true, total: stats.totalScans }); });
  app.post('/api/admin/login', (req, res) => {
    const { user, password, secretKey } = req.body;
    if (user === 'CEO' && password === 'VRAXYTHERNOS' && secretKey === 'VRAXYTHERNOS-PROTOCOL-V4') res.json({ success: true });
    else res.status(401).json({ success: false, message: "Invalid Neural Key" });
  });
  app.get('/api/admin/data', (req, res) => res.json({ ...adminData, stats }));

  // Serve the "One Code" HTML
  app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural Engine Spiritual Core</title>
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-NEURAL-ENGINE"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-NEURAL-ENGINE');
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: white; overflow-x: hidden; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .neon-text { text-shadow: 0 0 10px rgba(242, 125, 38, 0.5); }
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        .scan-line { position: absolute; width: 100%; height: 2px; background: linear-gradient(to right, transparent, #F27D26, transparent); animation: scan 2s linear infinite; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;
        const { motion, AnimatePresence } = FramerMotion;

        // --- CONTACT INFO ---
        const CONTACT_INFO = {
            emails: ["allarbaa.cloud@yahoo.com", "abdullahharuna216@gmail.com"],
            whatsapp: "+234808033353"
        };

        // --- SVG ICONS ---
        const ZapIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
        const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
        const TerminalIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
        const LogOutIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
        const ChevronRightIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
        const SparklesIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>;
        const MailIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>;
        const MessageCircleIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></svg>;
        const PhoneIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2v3a2 2 0 0 1 1.72 2.03 12.5 12.5 0 0 0 5.85 5.85 2 2 0 0 1 2.03 1.72 2 2 0 0 1 2.18 2.18Z"></path></svg>;

        // --- CONSTANTS ---
        const ABJAD_MAP = ${JSON.stringify(ABJAD_MAP)};
        const RAML_FIGURES = ${JSON.stringify(RAML_FIGURES)};

        function calculateAbjad(text) {
            let total = 0;
            const normalized = text.toLowerCase();
            for (let i = 0; i < normalized.length; i++) {
                if (i < normalized.length - 1) {
                    const pair = normalized.substring(i, i + 2);
                    if (ABJAD_MAP[pair]) { total += ABJAD_MAP[pair]; i++; continue; }
                }
                const char = normalized[i];
                if (ABJAD_MAP[char]) total += ABJAD_MAP[char];
            }
            return total;
        }

        // --- COMPONENTS ---
        const Logo = () => (
            <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-[#F27D26]/30 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-3 bg-[#F27D26] rounded-full shadow-[0_0_15px_rgba(242,125,38,0.5)]" />
                    <div className="absolute inset-0 flex items-center justify-center text-white"><ZapIcon /></div>
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tighter uppercase italic text-[#F27D26]">NEURAL ENGINE</h1>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">VRAXYTHERNOS CORE</p>
                </div>
            </div>
        );

        const App = () => {
            const [input, setInput] = useState('');
            const [activeTab, setActiveTab] = useState('calc');
            const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
            const [adminData, setAdminData] = useState(null);
            const [adminUser, setAdminUser] = useState('');
            const [adminPass, setAdminPass] = useState('');
            const [adminKey, setAdminKey] = useState('');
            const [totalScans, setTotalScans] = useState(1240);
            const [result, setResult] = useState(null);
            const [isLoading, setIsLoading] = useState(false);

            useEffect(() => {
                fetch('/api/health').then(r => r.json()).then(d => setTotalScans(d.scans));
            }, []);

            const handleCalculate = async () => {
                if (!input.trim()) return;
                setIsLoading(true);
                const val = calculateAbjad(input);
                const raml = RAML_FIGURES[(val % 16) || 15];
                
                fetch('/api/track-scan', { method: 'POST' }).then(r => r.json()).then(d => setTotalScans(d.total));

                setTimeout(() => {
                    setResult({ value: val, raml, timestamp: new Date().toLocaleTimeString() });
                    setIsLoading(false);
                }, 1500);
            };

            const handleAdminLogin = async () => {
                const res = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user: adminUser, password: adminPass, secretKey: adminKey })
                });
                const data = await res.json();
                if (data.success) {
                    setIsAdminLoggedIn(true);
                    fetch('/api/admin/data').then(r => r.json()).then(setAdminData);
                } else {
                    alert("Access Denied: Neural Key Mismatch");
                }
            };

            return (
                <div className="min-h-screen flex flex-col">
                    <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                        <Logo />
                        <nav className="hidden md:flex gap-8">
                            <button onClick={() => setActiveTab('calc')} className={"text-xs uppercase tracking-widest " + (activeTab === 'calc' ? "text-[#F27D26]" : "text-white/60")}>Oracle</button>
                            <button onClick={() => setActiveTab('contact')} className={"text-xs uppercase tracking-widest " + (activeTab === 'contact' ? "text-[#F27D26]" : "text-white/60")}>Contact</button>
                            <button onClick={() => setActiveTab('admin')} className={"text-xs uppercase tracking-widest " + (activeTab === 'admin' ? "text-[#F27D26]" : "text-white/60")}>System</button>
                        </nav>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-white/40 uppercase">{totalScans} Scans</span>
                            <button onClick={() => setActiveTab('admin')} className="p-2 rounded-lg glass text-[#F27D26] border border-[#F27D26]/30"><ShieldIcon /></button>
                        </div>
                    </header>

                    <main className="flex-1 max-w-4xl mx-auto w-full p-6 py-12">
                        <AnimatePresence mode="wait">
                            {activeTab === 'calc' && (
                                <motion.div key="calc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                                    <section className="text-center space-y-4">
                                        <h2 className="text-5xl font-extrabold tracking-tighter uppercase italic">Neural <span className="text-[#F27D26]">Oracle</span></h2>
                                        <p className="text-white/40 uppercase tracking-[0.3em] text-[10px]">Quantum Spiritual Resonance Engine</p>
                                    </section>

                                    <div className="relative max-w-2xl mx-auto">
                                        <input 
                                            type="text" 
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            placeholder="Enter name or situation..."
                                            className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-2xl font-light focus:outline-none focus:border-[#F27D26]/50 transition-all"
                                            onKeyDown={e => e.key === 'Enter' && handleCalculate()}
                                        />
                                        <button onClick={handleCalculate} className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-[#F27D26] flex items-center justify-center hover:scale-105 transition-all">
                                            <ChevronRightIcon />
                                        </button>
                                    </div>

                                    {isLoading && (
                                        <div className="relative h-64 glass rounded-[40px] overflow-hidden flex items-center justify-center">
                                            <div className="scan-line" />
                                            <div className="text-center space-y-4">
                                                <div className="w-12 h-12 border-4 border-[#F27D26]/20 border-t-[#F27D26] rounded-full animate-spin mx-auto" />
                                                <p className="text-[10px] uppercase tracking-widest text-[#F27D26] animate-pulse">Synchronizing Neural Link...</p>
                                            </div>
                                        </div>
                                    )}

                                    {result && !isLoading && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="glass p-8 rounded-[40px] space-y-6">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Abjad Value</p>
                                                    <p className="text-6xl font-black text-[#F27D26] font-mono">{result.value}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Raml Figure</p>
                                                    <p className="text-2xl font-bold uppercase italic">{result.raml.name}</p>
                                                    <p className="text-sm text-white/60 mt-2">{result.raml.meaning}</p>
                                                </div>
                                            </div>
                                            <div className="glass p-8 rounded-[40px] flex flex-col justify-between">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-[#F27D26]">
                                                        <SparklesIcon />
                                                        <p className="text-[10px] uppercase font-bold tracking-widest">Quantum Advice</p>
                                                    </div>
                                                    <p className="text-lg leading-relaxed italic text-white/80">"The resonance of {input} indicates a {result.raml.type} path. Alignment with the VRAXYTHERNOS frequency is recommended for total victory."</p>
                                                </div>
                                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                                    <span className="text-[10px] font-mono text-white/20">{result.timestamp} // LNK-OK</span>
                                                    <span className="px-3 py-1 rounded-full bg-[#F27D26]/10 text-[#F27D26] text-[8px] font-bold uppercase tracking-widest">{result.raml.type}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'contact' && (
                                <motion.div key="contact" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12 max-w-2xl mx-auto">
                                    <section className="text-center space-y-4">
                                        <h2 className="text-4xl font-extrabold tracking-tighter uppercase italic">Contact <span className="text-[#F27D26]">Support</span></h2>
                                        <p className="text-white/40 uppercase tracking-[0.3em] text-[10px]">Neural Engine Direct Link</p>
                                    </section>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="glass p-8 rounded-[40px] space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-2xl bg-[#F27D26]/10 text-[#F27D26]">
                                                    <MailIcon />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-white/40">Email Support</p>
                                                    <div className="space-y-1">
                                                        {CONTACT_INFO.emails.map(email => (
                                                            <p key={email} className="text-lg font-medium">{email}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-2xl bg-green-500/10 text-green-500">
                                                    <MessageCircleIcon />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest text-white/40">WhatsApp Support</p>
                                                    <p className="text-lg font-medium">{CONTACT_INFO.whatsapp}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="glass p-8 rounded-[40px] text-center space-y-4">
                                            <p className="text-white/60 italic">"For urgent spiritual matters or technical synchronization, reach out directly to our core team."</p>
                                            <a 
                                                href={`https://wa.me/\${CONTACT_INFO.whatsapp.replace('+', '')}`} 
                                                target="_blank" 
                                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-widest text-xs transition-all"
                                            >
                                                <MessageCircleIcon />
                                                Chat on WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'admin' && (
                                <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto">
                                    {!isAdminLoggedIn ? (
                                        <div className="glass p-10 rounded-[40px] space-y-8">
                                            <div className="text-center space-y-2">
                                                <div className="text-[#F27D26] flex justify-center"><TerminalIcon /></div>
                                                <h2 className="text-2xl font-bold uppercase italic">System Access</h2>
                                                <p className="text-[10px] text-white/40 uppercase tracking-widest">VRAXYTHERNOS Super Admin</p>
                                            </div>
                                            <div className="space-y-4">
                                                <input type="text" placeholder="Admin ID" value={adminUser} onChange={e => setAdminUser(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#F27D26] outline-none" />
                                                <input type="password" placeholder="Access Key" value={adminPass} onChange={e => setAdminPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#F27D26] outline-none" />
                                                <input type="password" placeholder="Quantum Secret Key" value={adminKey} onChange={e => setAdminKey(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#F27D26] outline-none" />
                                                <button onClick={handleAdminLogin} className="w-full py-5 rounded-2xl bg-[#F27D26] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#E65100] transition-all">Initialize Neural Link</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="glass p-6 rounded-3xl flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-xl font-bold text-[#F27D26] uppercase italic">Super Admin Active</h2>
                                                    <p className="text-[10px] text-white/40 uppercase">CEO Abdullah Haruna</p>
                                                </div>
                                                <button onClick={() => setIsAdminLoggedIn(false)} className="p-3 rounded-xl bg-red-500/10 text-red-500"><LogOutIcon /></button>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="glass p-6 rounded-3xl">
                                                    <p className="text-[10px] uppercase text-white/40 mb-1">Total Scans</p>
                                                    <p className="text-3xl font-bold font-mono">{adminData.stats.totalScans}</p>
                                                </div>
                                                <div className="glass p-6 rounded-3xl">
                                                    <p className="text-[10px] uppercase text-white/40 mb-1">Active Links</p>
                                                    <p className="text-3xl font-bold font-mono">88</p>
                                                </div>
                                            </div>

                                            <div className="glass p-8 rounded-[40px] space-y-6">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#F27D26]">Support Channels</h3>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <span className="text-[10px] uppercase text-white/40">Primary Email</span>
                                                        <span className="text-xs font-mono">{CONTACT_INFO.emails[0]}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <span className="text-[10px] uppercase text-white/40">WhatsApp</span>
                                                        <span className="text-xs font-mono">{CONTACT_INFO.whatsapp}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="glass p-8 rounded-[40px] space-y-6">
                                                <h3 className="text-xs font-bold uppercase tracking-widest text-[#F27D26]">Payment Archives</h3>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <span className="text-[10px] uppercase text-white/40">PayPal</span>
                                                        <span className="text-xs font-mono">{adminData.paymentSettings.paypalEmail}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                                                        <span className="text-[10px] uppercase text-white/40">Bank Acc</span>
                                                        <span className="text-xs font-mono">{adminData.paymentSettings.bankAccount}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>

                    <footer className="p-12 text-center space-y-4 border-t border-white/5">
                        <div className="flex justify-center gap-8">
                            <button onClick={() => setActiveTab('calc')} className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors">Oracle</button>
                            <button onClick={() => setActiveTab('contact')} className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors">Contact</button>
                            <button onClick={() => setActiveTab('admin')} className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors">System</button>
                        </div>
                        <p className="text-[8px] uppercase tracking-[0.5em] text-white/10">© 2026 Neural Engine Spiritual Core // VRAXYTHERNOS PROTOCOL</p>
                    </footer>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</body>
</html>
    `);
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`
    --------------------------------------------------
    NEURAL ENGINE SPIRITUAL CORE :: VRAXYTHERNOS
    --------------------------------------------------
    Server running on http://localhost:\${PORT}
    Protocol: VRAXYTHERNOS-PROTOCOL-V4
    Status: QUANTUM-READY
    --------------------------------------------------
    \`);
  });
}

startServer();
