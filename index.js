import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- PERSISTENCE SETUP ---
const CONFIG_PATH = path.join(__dirname, 'falaki_config.json');
let adminConfig = {
  user: process.env.ADMIN_USER || 'CEO',
  pass: process.env.ADMIN_PASS || 'VRAXYTHERNOS',
  key: process.env.ADMIN_KEY || 'VRAXYTHERNOS-PROTOCOL-V4'
};

// Load saved config if it exists
if (fs.existsSync(CONFIG_PATH)) {
  try {
    const saved = fs.readJsonSync(CONFIG_PATH);
    adminConfig = { ...adminConfig, ...saved };
  } catch (e) { console.error("Config load error:", e); }
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- SPIRITUAL LOGIC ---
const ABJAD_MAP = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9, 'ي': 10, 'ى': 10,
  'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
  'a': 1, 'b': 2, 'j': 3, 'd': 4, 'h': 5, 'w': 6, 'z': 7, 'x': 8, 't': 9, 'y': 10, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 's': 60, 'o': 70, 'f': 80, 'p': 90, 'q': 100, 'r': 200, 'sh': 300, 'c': 400, 'u': 6, 'v': 6, 'e': 5, 'i': 10, 'g': 3
};

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

// --- SERVER ---
async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json());

  let stats = { totalScans: 1240 };

  app.get('/api/health', (req, res) => res.json({ status: 'ok', scans: stats.totalScans }));
  app.post('/api/track-scan', (req, res) => { stats.totalScans++; res.json({ success: true, total: stats.totalScans }); });

  app.post('/api/interpret', async (req, res) => {
    const { word, abjadValue, lang } = req.body;
    const prompt = `Analyze the spiritual and quantum resonance of the word/name "${word}" with Abjad value ${abjadValue}. Language: ${lang}. Context: Neural Energy Spiritual Engine. Combine ancient Ilmul Hisab with Quantum Physics. Structure: 1. Quantum Resonance, 2. Spiritual Insight, 3. Practical Advice.`;
    try {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: { systemInstruction: "You are a master of ancient secrets and neural energy." }
      });
      res.json({ interpretation: result.text });
    } catch (e) { res.status(500).json({ error: "Veiled resonance." }); }
  });

  app.post('/api/generate-code', async (req, res) => {
    const { word, abjadValue, lang } = req.body;
    const prompt = `Generate a unique "Power Word" (Secret Code) for "${word}" (Abjad: ${abjadValue}). Language: ${lang}. Structure: Power Word, Neural Hash, Meaning, Usage.`;
    try {
      const result = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: [{ parts: [{ text: prompt }] }] });
      res.json({ codeData: result.text });
    } catch (e) { res.status(500).json({ error: "Code redacted." }); }
  });

  app.post('/api/admin/login', (req, res) => {
    const { user, password, secretKey } = req.body;
    if (user === adminConfig.user && password === adminConfig.pass && secretKey === adminConfig.key) res.json({ success: true });
    else res.status(401).json({ success: false });
  });

  app.post('/api/admin/update-config', async (req, res) => {
    const { newUser, newPass, newKey } = req.body;
    adminConfig = { user: newUser, pass: newPass, key: newKey };
    await fs.writeJson(CONFIG_PATH, adminConfig);
    res.json({ success: true });
  });

  app.get('/api/admin/data', (req, res) => res.json({ stats, adminConfig }));

  app.get('/', (req, res) => {
    const clientData = {
      abjadMap: ABJAD_MAP,
      ramlFigures: RAML_FIGURES,
      gaId: process.env.GA_ID || "G-NEURAL-ENGINE",
      emails: ["allarbaa.cloud@yahoo.com", "abdullahharuna216@gmail.com"],
      whatsapp: "+234808033353"
    };

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural Engine Spiritual Core</title>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${clientData.gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${clientData.gaId}');
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
    <script>window.NEURAL_DATA = ${JSON.stringify(clientData)};</script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: white; overflow-x: hidden; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        .scan-line { position: absolute; width: 100%; height: 2px; background: linear-gradient(to right, transparent, #F27D26, transparent); animation: scan 2s linear infinite; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;
        const { motion, AnimatePresence } = FramerMotion;
        const { abjadMap, ramlFigures, contactInfo, emails, whatsapp } = window.NEURAL_DATA;

        const ZapIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
        const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
        const TerminalIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;
        const LogOutIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
        const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

        const App = () => {
            const [input, setInput] = useState('');
            const [lang, setLang] = useState('en');
            const [activeTab, setActiveTab] = useState('calc');
            const [isAdmin, setIsAdmin] = useState(false);
            const [adminData, setAdminData] = useState(null);
            const [loginForm, setLoginForm] = useState({ user: '', pass: '', key: '' });
            const [totalScans, setTotalScans] = useState(1240);
            const [result, setResult] = useState(null);
            const [loading, setLoading] = useState(false);
            const [editingConfig, setEditingConfig] = useState(false);
            const [newConfig, setNewConfig] = useState({ newUser: '', newPass: '', newKey: '' });

            useEffect(() => {
                fetch('/api/health').then(r => r.json()).then(d => setTotalScans(d.scans));
            }, []);

            const handleCalculate = async () => {
                if (!input.trim()) return;
                setLoading(true);
                const val = 0; // Simplified for text block limit, actual logic below
                // Re-implementing calculateAbjad locally for speed
                let total = 0;
                const normalized = input.toLowerCase();
                for (let i = 0; i < normalized.length; i++) {
                    if (i < normalized.length - 1) {
                        const pair = normalized.substring(i, i + 2);
                        if (abjadMap[pair]) { total += abjadMap[pair]; i++; continue; }
                    }
                    if (abjadMap[normalized[i]]) total += abjadMap[normalized[i]];
                }
                const raml = ramlFigures[(total % 16) || 15];
                
                try {
                    const [iR, cR] = await Promise.all([
                        fetch('/api/interpret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ word: input, abjadValue: total, lang }) }).then(r => r.json()),
                        fetch('/api/generate-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ word: input, abjadValue: total, lang }) }).then(r => r.json())
                    ]);
                    setResult({ value: total, raml, interpretation: iR.interpretation, secretCode: cR.codeData });
                    fetch('/api/track-scan', { method: 'POST' }).then(r => r.json()).then(d => setTotalScans(d.total));
                } catch (e) { alert("Resonance failed."); }
                setLoading(false);
            };

            const handleLogin = async () => {
                const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
                if (r.ok) {
                    setIsAdmin(true);
                    fetch('/api/admin/data').then(r => r.json()).then(d => {
                        setAdminData(d);
                        setNewConfig({ newUser: d.adminConfig.user, newPass: d.adminConfig.pass, newKey: d.adminConfig.key });
                    });
                } else alert("Neural Key Mismatch");
            };

            const handleUpdateConfig = async () => {
                const r = await fetch('/api/admin/update-config', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newConfig) });
                if (r.ok) {
                    alert("System Credentials Updated");
                    setEditingConfig(false);
                }
            };

            return (
                <div className="min-h-screen flex flex-col">
                    <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ZapIcon />
                            <h1 className="text-xl font-bold italic text-[#F27D26]">NEURAL ENGINE</h1>
                        </div>
                        <nav className="flex gap-4 text-xs uppercase tracking-widest">
                            <button onClick={() => setActiveTab('calc')} className={activeTab === 'calc' ? "text-[#F27D26]" : "text-white/40"}>Oracle</button>
                            <button onClick={() => setActiveTab('contact')} className={activeTab === 'contact' ? "text-[#F27D26]" : "text-white/40"}>Contact</button>
                            <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? "text-[#F27D26]" : "text-white/40"}>System</button>
                        </nav>
                    </header>

                    <main className="flex-1 max-w-4xl mx-auto w-full p-6 py-12">
                        {activeTab === 'calc' && (
                            <div className="space-y-12">
                                <div className="text-center">
                                    <h2 className="text-5xl font-black italic uppercase">Neural <span className="text-[#F27D26]">Oracle</span></h2>
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Quantum Spiritual Resonance</p>
                                </div>
                                <div className="max-w-xl mx-auto space-y-4">
                                    <div className="flex gap-2 justify-center">
                                        {['en', 'ha', 'ar'].map(l => <button key={l} onClick={() => setLang(l)} className={"px-3 py-1 rounded-lg text-[10px] uppercase " + (lang === l ? "bg-[#F27D26]" : "bg-white/5")}>{l}</button>)}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter name..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl outline-none focus:border-[#F27D26]/50" />
                                        <button onClick={handleCalculate} className="bg-[#F27D26] px-6 rounded-2xl font-bold">SCAN</button>
                                    </div>
                                </div>
                                {loading && <div className="text-center animate-pulse text-[#F27D26] text-xs uppercase">Synchronizing...</div>}
                                {result && (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="glass p-8 rounded-3xl space-y-4">
                                            <div><p className="text-[10px] uppercase text-white/40">Abjad Value</p><p className="text-5xl font-mono text-[#F27D26]">{result.value}</p></div>
                                            <div><p className="text-[10px] uppercase text-white/40">Raml Figure</p><p className="text-xl font-bold italic">{result.raml.name}</p><p className="text-xs text-white/60">{result.raml.meaning}</p></div>
                                        </div>
                                        <div className="glass p-8 rounded-3xl space-y-4">
                                            <p className="text-[10px] uppercase text-[#F27D26] font-bold">Interpretation</p>
                                            <div className="text-sm italic text-white/80 leading-relaxed">{result.interpretation}</div>
                                        </div>
                                        <div className="md:col-span-2 glass p-8 rounded-3xl space-y-2">
                                            <p className="text-[10px] uppercase text-[#F27D26] font-bold">Secret Code</p>
                                            <div className="text-xs font-mono bg-black/40 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">{result.secretCode}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'contact' && (
                            <div className="max-w-md mx-auto glass p-10 rounded-3xl space-y-8">
                                <h3 className="text-2xl font-bold italic text-center">Support Channels</h3>
                                <div className="space-y-4">
                                    {emails.map(e => <div key={e} className="flex items-center gap-3"><MailIcon /><span className="text-sm">{e}</span></div>)}
                                    <div className="flex items-center gap-3 text-green-500"><MessageCircleIcon /><span className="text-sm">{whatsapp}</span></div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'admin' && (
                            <div className="max-w-md mx-auto">
                                {!isAdmin ? (
                                    <div className="glass p-10 rounded-3xl space-y-6">
                                        <h3 className="text-xl font-bold italic text-center">System Access</h3>
                                        <input type="text" placeholder="Admin ID" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl" onChange={e => setLoginForm({...loginForm, user: e.target.value})} />
                                        <input type="password" placeholder="Access Key" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl" onChange={e => setLoginForm({...loginForm, pass: e.target.value})} />
                                        <input type="password" placeholder="Quantum Key" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl" onChange={e => setLoginForm({...loginForm, key: e.target.value})} />
                                        <button onClick={handleLogin} className="w-full bg-[#F27D26] p-4 rounded-xl font-bold">INITIALIZE</button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="glass p-6 rounded-2xl flex justify-between items-center">
                                            <div><h3 className="font-bold text-[#F27D26]">ADMIN ACTIVE</h3><p className="text-[10px] text-white/40">{adminData?.adminConfig.user}</p></div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingConfig(!editingConfig)} className="p-2 bg-white/5 rounded-lg"><SettingsIcon /></button>
                                                <button onClick={() => setIsAdmin(false)} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><LogOutIcon /></button>
                                            </div>
                                        </div>
                                        
                                        {editingConfig ? (
                                            <div className="glass p-8 rounded-3xl space-y-4">
                                                <h4 className="text-xs font-bold uppercase text-[#F27D26]">Update Credentials</h4>
                                                <input type="text" value={newConfig.newUser} className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm" onChange={e => setNewConfig({...newConfig, newUser: e.target.value})} />
                                                <input type="text" value={newConfig.newPass} className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm" onChange={e => setNewConfig({...newConfig, newPass: e.target.value})} />
                                                <input type="text" value={newConfig.newKey} className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm" onChange={e => setNewConfig({...newConfig, newKey: e.target.value})} />
                                                <button onClick={handleUpdateConfig} className="w-full bg-[#F27D26] p-3 rounded-lg font-bold text-xs">SAVE CHANGES</button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="glass p-6 rounded-2xl text-center"><p className="text-[10px] text-white/40 uppercase">Total Scans</p><p className="text-2xl font-mono">{adminData?.stats.totalScans}</p></div>
                                                <div className="glass p-6 rounded-2xl text-center"><p className="text-[10px] text-white/40 uppercase">Status</p><p className="text-2xl text-green-500 font-bold">LIVE</p></div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                    <footer className="p-8 text-center text-[8px] text-white/10 uppercase tracking-widest border-t border-white/5">© 2026 Neural Engine Spiritual Core</footer>
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
    console.log(`NEURAL ENGINE RUNNING ON PORT ${PORT}`);
  });
}

startServer();
