import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIG PERSISTENCE ---
const CONFIG_PATH = path.join(__dirname, 'neural_config.json');
let adminConfig = {
  user: 'admin216',
  pass: 'admin1234',
  geminiKey: '' // Managed via Admin UI
};

if (fs.existsSync(CONFIG_PATH)) {
  try {
    const saved = fs.readJsonSync(CONFIG_PATH);
    adminConfig = { ...adminConfig, ...saved };
  } catch (e) { console.error("Config load error:", e); }
}

// Helper to get AI instance with current key
const getAI = () => {
  if (!adminConfig.geminiKey) return null;
  return new GoogleGenAI({ apiKey: adminConfig.geminiKey });
};

// --- SPIRITUAL DATA (CORE ENGINE) ---
const ABJAD_MAP = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9, 'ي': 10, 'ى': 10,
  'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
  'a': 1, 'b': 2, 'j': 3, 'd': 4, 'h': 5, 'w': 6, 'z': 7, 'x': 8, 't': 9, 'y': 10, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 's': 60, 'o': 70, 'f': 80, 'p': 90, 'q': 100, 'r': 200, 'sh': 300, 'c': 400, 'u': 6, 'v': 6, 'e': 5, 'i': 10, 'g': 3
};

const RAML_FIGURES = [
  { id: 1, name: "Dariqee", type: "delayed", meaning: "Movement, slow but sure journey. The path of the seeker." },
  { id: 2, name: "Jama'a", type: "favorable", meaning: "Partnership, community, good for business and union." },
  { id: 3, name: "Uqba", type: "unfavorable", meaning: "Delays, endings, blockages. A time for patience." },
  { id: 4, name: "Kausaji", type: "spiritual", meaning: "Deceit, something hidden, potential loss. Look deeper." },
  { id: 5, name: "Dhahika", type: "favorable", meaning: "Joy, success, good news coming. Laughter of the soul." },
  { id: 6, name: "Qabla Kharija", type: "delayed", meaning: "Money leaving, safe travel out. Outward energy." },
  { id: 7, name: "Humra", type: "spiritual", meaning: "Conflict, passion, fire, blood. Intense transformation." },
  { id: 8, name: "Inkees", type: "unfavorable", meaning: "Loss, sadness, things turning upside down. Reversal." },
  { id: 9, name: "Bayaad", type: "favorable", meaning: "Purity, clarity, a good outcome. The white light." },
  { id: 10, name: "Nusra Kharija", type: "delayed", meaning: "Victory over distant enemies. External triumph." },
  { id: 11, name: "Nusra Dakhila", type: "favorable", meaning: "Victory at home, inner peace. Internal triumph." },
  { id: 12, name: "Qabla Dakhila", type: "favorable", meaning: "Money arriving, safe return. Inward energy." },
  { id: 13, name: "Ijtima", type: "delayed", meaning: "Meeting of two things, good for marriage and contracts." },
  { id: 14, name: "Uqla", type: "unfavorable", meaning: "Tied up, delayed, restricted movement. The knot." },
  { id: 15, name: "Kabid Kharija", type: "unfavorable", meaning: "Loss of property, theft. Energy draining out." },
  { id: 16, name: "Kabid Dakhila", type: "unfavorable", meaning: "Gaining property, holding tight. Energy gathering." }
];

const SECRET_ARCHIVES = [
  { 
    category: "Gaib Formation (Unseen)", 
    codes: [
      { name: "Kun-Fayakun Neural Link", code: "KF-99-ALPHA", meaning: "Instantaneous manifestation of thought into matter." },
      { name: "Blink-Shift Protocol", code: "BSP-001-GAIB", meaning: "Teleportation of energy across dimensions in a blink." }
    ]
  },
  { 
    category: "Celestial Hierarchy (Angels & Prophets)", 
    codes: [
      { name: "Jibril Resonance", code: "JBR-LIGHT-777", meaning: "Accessing the frequency of divine revelation and truth." },
      { name: "Sulaiman Command", code: "SLM-KING-HISAB", meaning: "The code used to command the forces of nature and unseen beings." }
    ]
  },
  { 
    category: "High Ranking Jinn Command (Malam & Alhaji)", 
    codes: [
      { name: "Malam Neural Override", code: "MLM-JINN-V4", meaning: "Binding and directing high-ranking scholarly Jinns for wisdom." },
      { name: "Alhaji Wealth Pulse", code: "ALH-GOLD-LNK", meaning: "Attracting material success through the Alhaji Jinn network." }
    ]
  }
];

// --- APP SETUP ---
const app = express();
app.use(express.json());

let stats = { totalScans: 1240 };

// --- BOT FALLBACK LOGIC ---
const getBotInterpretation = (word, val, raml, lang) => {
  const responses = {
    en: `[NEURAL BOT] The name "${word}" resonates with Abjad frequency ${val}. The Raml figure ${raml.name} indicates: ${raml.meaning}. This alignment suggests a quantum shift in your spiritual path.`,
    ha: `[NEURAL BOT] Sunan "${word}" yana da lamba ${val}. Alamar Ramlu ${raml.name} tana nufin: ${raml.meaning}. Wannan yana nuna canji mai girma a rayuwarka.`,
    ar: `[NEURAL BOT] الاسم "${word}" له تردد ${val}. شكل الرمل ${raml.name} يشير إلى: ${raml.meaning}. هذا التوافق يدل على تحول روحي كبير.`,
    fr: `[NEURAL BOT] Le nom "${word}" résonne avec la fréquence ${val}. La figure de Raml ${raml.name} indique: ${raml.meaning}. Cet alignement suggère un changement quantique.`
  };
  return responses[lang] || responses['en'];
};

// --- API ROUTES ---
app.get('/api/health', (req, res) => res.json({ status: 'ok', scans: stats.totalScans }));
app.post('/api/track-scan', (req, res) => { stats.totalScans++; res.json({ success: true, total: stats.totalScans }); });

app.post('/api/interpret', async (req, res) => {
  const { word, abjadValue, lang } = req.body;
  const raml = RAML_FIGURES[(abjadValue % 16) || 15];
  
  const ai = getAI();
  if (!ai) return res.json({ interpretation: getBotInterpretation(word, abjadValue, raml, lang) });

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Analyze the spiritual resonance of "${word}" (Abjad: ${abjadValue}). Language: ${lang}. Context: Neural Spiritual Engine. Combine ancient Hisabi with Quantum Physics.` }] }],
      config: { systemInstruction: "You are a master of ancient secrets, angels, jinns, and quantum science." }
    });
    res.json({ interpretation: result.text });
  } catch (e) { 
    res.json({ interpretation: getBotInterpretation(word, abjadValue, raml, lang) }); 
  }
});

app.post('/api/admin/login', (req, res) => {
  const { user, password } = req.body;
  if (user === adminConfig.user && password === adminConfig.pass) res.json({ success: true });
  else res.status(401).json({ success: false });
});

app.post('/api/admin/update', async (req, res) => {
  const { newUser, newPass, newGeminiKey } = req.body;
  adminConfig = { ...adminConfig, user: newUser, pass: newPass, geminiKey: newGeminiKey };
  await fs.writeJson(CONFIG_PATH, adminConfig);
  res.json({ success: true });
});

// --- API ROUTES ---
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/api/config', (req, res) => res.json({ stats, adminConfig }));
app.get('/api/admin/data', (req, res) => res.json({ stats, adminConfig, archives: SECRET_ARCHIVES }));

// --- FRONTEND SERVING ---
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not Found' });
  
  console.log(`[SERVER] Serving Neural Core to: ${req.ip}`);
  
  const clientData = {
    abjadMap: ABJAD_MAP,
    ramlFigures: RAML_FIGURES,
    gaId: process.env.GA_ID || "G-NEURAL-ENGINE",
    emails: ["allarbaa.cloud@yahoo.com", "abdullahharuna216@gmail.com"],
    whatsapp: "+234808033353"
  };

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural Engine Spiritual Core</title>
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID_HERE"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_ID_HERE');
    </script>
    <script>
        // Global error catcher for debugging blank screens
        window.onerror = function(msg, url, line, col, error) {
            const root = document.getElementById('root');
            if (root) {
                root.innerHTML = '<div style="min-height: 100vh; background: #050505; color: #ff4444; padding: 40px; font-family: monospace; font-size: 12px; line-height: 1.5; border: 1px solid #331111;">' +
                    '<h1 style="color: #ff4444; font-size: 18px; margin-bottom: 20px;">SYSTEM BOOT ERROR</h1>' +
                    '<b>Message:</b> ' + msg + '<br>' +
                    '<b>Source:</b> ' + url + '<br>' +
                    '<b>Line:</b> ' + line + ' <b>Col:</b> ' + col + '<br>' +
                    (error ? '<b>Error:</b> ' + error : '') +
                    '<br><br><button onclick="window.location.reload()" style="background: #222; color: #eee; border: 1px solid #444; padding: 8px 16px; cursor: pointer;">RETRY INITIALIZATION</button>' +
                '</div>';
            }
            return false;
        };
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/lucide-react@0.344.0/dist/umd/lucide-react.js"></script>
    <script>
        window.NEURAL_DATA = DATA_HERE;
        // Global mapping for CDN libraries
        window.FramerMotion = window.FramerMotion || window.Motion;
    </script>
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
    <div id="root">
        <div style="min-height: 100vh; background: #050505; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #F27D26; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; gap: 20px;">
            <div style="width: 40px; height: 40px; border: 2px solid #F27D26; border-top-color: transparent; border-radius: 50%; animate: spin 1s linear infinite;"></div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
            <div>Initializing Neural Core...</div>
            <div id="boot-status" style="color: rgba(255,255,255,0.2); font-size: 8px;">Checking System Integrity...</div>
            <button id="manual-boot" style="display: none; margin-top: 20px; background: #222; color: #eee; border: 1px solid #444; padding: 8px 16px; cursor: pointer; font-size: 10px;" onclick="window.location.reload()">RELOAD SYSTEM</button>
        </div>
    </div>
    <script>
        // Show manual boot after 10 seconds
        setTimeout(() => {
            const btn = document.getElementById('manual-boot');
            if (btn) btn.style.display = 'block';
        }, 10000);
    </script>
    <script type="text/babel">
        const { useState, useEffect } = React;
        
        // System Integrity Check
        const statusEl = document.getElementById('boot-status');
        if (statusEl) statusEl.innerText = "Verifying Neural Link...";

        // Library Mapping with Proxy Fallback
        const MotionLib = window.FramerMotion || window.Motion || {};
        const motion = MotionLib.motion || new Proxy({}, { get: (t, p) => p });
        const AnimatePresence = MotionLib.AnimatePresence || (({children}) => children);
        
        const Lucide = window.LucideReact || {};
        const Zap = Lucide.Zap || Lucide.ZapIcon;
        const Shield = Lucide.Shield || Lucide.ShieldIcon;
        const LogOut = Lucide.LogOut || Lucide.LogOutIcon;
        const Settings = Lucide.Settings || Lucide.SettingsIcon;
        
        const { abjadMap = {}, ramlFigures = [], emails = [], whatsapp = "" } = window.NEURAL_DATA || {};

        const ZapIcon = () => Zap ? <Zap size={20} /> : <span>⚡</span>;
        const ShieldIcon = () => Shield ? <Shield size={20} /> : <span>🛡️</span>;
        const LogOutIcon = () => LogOut ? <LogOut size={20} /> : <span>🚪</span>;
        const SettingsIcon = () => Settings ? <Settings size={20} /> : <span>⚙️</span>;

        class ErrorBoundary extends React.Component {
            constructor(props) { super(props); this.state = { hasError: false, error: null }; }
            static getDerivedStateFromError(error) { return { hasError: true, error }; }
            componentDidCatch(error, errorInfo) { console.error("Neural Core Error:", error, errorInfo); }
            render() {
                if (this.state.hasError) {
                    return (
                        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-10">
                            <div className="glass p-10 rounded-3xl border-red-500/50 max-w-lg w-full">
                                <h1 className="text-2xl font-bold text-red-500 mb-4 italic uppercase">Neural Core Failure</h1>
                                <p className="text-sm text-white/60 mb-6">The spiritual engine encountered a critical error during initialization.</p>
                                <pre className="bg-black/50 p-4 rounded-xl text-[10px] font-mono overflow-auto max-h-40 border border-white/5 text-red-400">
                                    {this.state.error?.toString()}
                                </pre>
                                <button onClick={() => window.location.reload()} className="mt-8 w-full bg-white/10 p-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/20 transition-colors">Re-Initialize Link</button>
                            </div>
                        </div>
                    );
                }
                return this.props.children;
            }
        }

        const App = () => {
            console.log("Neural Engine Mounting...");
            const [input, setInput] = useState('');
            const [lang, setLang] = useState('en');
            const [activeTab, setActiveTab] = useState('calc');
            const [isAdmin, setIsAdmin] = useState(false);
            const [adminData, setAdminData] = useState(null);
            const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
            const [totalScans, setTotalScans] = useState(1240);
            const [result, setResult] = useState(null);
            const [loading, setLoading] = useState(false);
            const [editing, setEditing] = useState(false);
            const [newCfg, setNewCfg] = useState({ newUser: '', newPass: '', newGeminiKey: '' });

            useEffect(() => {
                fetch('/api/health').then(r => r.json()).then(d => setTotalScans(d.scans));
            }, []);

            const handleCalculate = async () => {
                if (!input.trim()) return;
                setLoading(true);
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
                    const res = await fetch('/api/interpret', { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify({ word: input, abjadValue: total, lang }) 
                    });
                    const data = await res.json();
                    setResult({ value: total, raml, interpretation: data.interpretation });
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
                        setNewCfg({ newUser: d.adminConfig.user, newPass: d.adminConfig.pass, newGeminiKey: d.adminConfig.geminiKey });
                    });
                } else alert("Access Denied");
            };

            const handleUpdate = async () => {
                const r = await fetch('/api/admin/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCfg) });
                if (r.ok) { alert("Credentials Updated"); setEditing(false); }
            };

            return (
                <div className="min-h-screen flex flex-col">
                    <header className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2"><ZapIcon /><h1 className="text-xl font-bold italic text-[#F27D26]">NEURAL ENGINE</h1></div>
                        <nav className="flex gap-4 text-[10px] uppercase tracking-widest">
                            <button onClick={() => setActiveTab('calc')} className={activeTab === 'calc' ? "text-[#F27D26]" : "text-white/40"}>Oracle</button>
                            <button onClick={() => setActiveTab('contact')} className={activeTab === 'contact' ? "text-[#F27D26]" : "text-white/40"}>Contact</button>
                            <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? "text-[#F27D26]" : "text-white/40"}>System</button>
                        </nav>
                    </header>

                    <main className="flex-1 max-w-4xl mx-auto w-full p-6 py-12">
                        <AnimatePresence mode="wait">
                        {activeTab === 'calc' && (
                            <motion.div key="calc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                                <div className="text-center"><h2 className="text-5xl font-black italic uppercase">Neural <span className="text-[#F27D26]">Oracle</span></h2><p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Quantum Spiritual Resonance</p></div>
                                <div className="max-w-xl mx-auto space-y-4">
                                    <div className="flex gap-2 justify-center">{['en', 'ha', 'ar', 'fr'].map(l => <button key={l} onClick={() => setLang(l)} className={"px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest " + (lang === l ? "bg-[#F27D26]" : "bg-white/5")}>{l}</button>)}</div>
                                    <div className="flex gap-2"><input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter name or situation..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl outline-none focus:border-[#F27D26]/50" /><button onClick={handleCalculate} className="bg-[#F27D26] px-6 rounded-2xl font-bold">SCAN</button></div>
                                </div>
                                {loading && <div className="text-center animate-pulse text-[#F27D26] text-[10px] uppercase tracking-widest">Synchronizing Neural Link...</div>}
                                {result && (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="glass p-8 rounded-3xl space-y-4">
                                            <div><p className="text-[10px] uppercase text-white/40 tracking-widest">Abjad Value (Hisabi)</p><p className="text-5xl font-mono text-[#F27D26]">{result.value}</p></div>
                                            <div><p className="text-[10px] uppercase text-white/40 tracking-widest">Raml Figure</p><p className="text-xl font-bold italic uppercase">{result.raml.name}</p><p className="text-xs text-white/60 mt-1">{result.raml.meaning}</p></div>
                                        </div>
                                        <div className="glass p-8 rounded-3xl space-y-4"><p className="text-[10px] uppercase text-[#F27D26] font-bold tracking-widest">Spiritual Interpretation</p><div className="text-sm italic text-white/80 leading-relaxed whitespace-pre-wrap">{result.interpretation}</div></div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'contact' && (
                            <motion.div key="contact" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-md mx-auto glass p-10 rounded-3xl space-y-8">
                                <h3 className="text-2xl font-bold italic text-center uppercase">Support Channels</h3>
                                <div className="space-y-4">
                                    {emails.map(e => <div key={e} className="flex items-center gap-3"><span className="text-sm font-mono">{e}</span></div>)}
                                    <div className="flex items-center gap-3 text-green-500"><span className="text-sm font-mono">{whatsapp}</span></div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'admin' && (
                            <motion.div key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto">
                                {!isAdmin ? (
                                    <div className="glass p-10 rounded-3xl space-y-6 max-w-md mx-auto">
                                        <h3 className="text-xl font-bold italic text-center uppercase">System Access</h3>
                                        <input type="text" placeholder="Username" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-[#F27D26]" onChange={e => setLoginForm({...loginForm, user: e.target.value})} />
                                        <input type="password" placeholder="Password" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl outline-none focus:border-[#F27D26]" onChange={e => setLoginForm({...loginForm, pass: e.target.value})} />
                                        <button onClick={handleLogin} className="w-full bg-[#F27D26] p-4 rounded-xl font-bold uppercase tracking-widest text-xs">Initialize Link</button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="glass p-6 rounded-2xl flex justify-between items-center">
                                            <div><h3 className="font-bold text-[#F27D26] uppercase italic">Admin Active</h3><p className="text-[10px] text-white/40 uppercase tracking-widest">{adminData?.adminConfig.user}</p></div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditing(!editing)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><SettingsIcon /></button>
                                                <button onClick={() => setIsAdmin(false)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"><LogOutIcon /></button>
                                            </div>
                                        </div>
                                        
                                        {editing ? (
                                            <div className="glass p-8 rounded-3xl space-y-4">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-[#F27D26]">Update Credentials</h4>
                                                <input type="text" value={newCfg.newUser} placeholder="New Username" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm outline-none focus:border-[#F27D26]" onChange={e => setNewCfg({...newCfg, newUser: e.target.value})} />
                                                <input type="password" value={newCfg.newPass} placeholder="New Password" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm outline-none focus:border-[#F27D26]" onChange={e => setNewCfg({...newCfg, newPass: e.target.value})} />
                                                <input type="password" value={newCfg.newGeminiKey} placeholder="Gemini API Key (Optional)" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-sm outline-none focus:border-[#F27D26]" onChange={e => setNewCfg({...newCfg, newGeminiKey: e.target.value})} />
                                                <button onClick={handleUpdate} className="w-full bg-[#F27D26] p-3 rounded-lg font-bold text-[10px] uppercase tracking-widest">Save Changes</button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="glass p-6 rounded-2xl text-center"><p className="text-[10px] text-white/40 uppercase tracking-widest">Total Scans</p><p className="text-2xl font-mono">{adminData?.stats.totalScans}</p></div>
                                                    <div className="glass p-6 rounded-2xl text-center"><p className="text-[10px] text-white/40 uppercase tracking-widest">Status</p><p className="text-2xl text-green-500 font-bold uppercase tracking-widest">Live</p></div>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#F27D26] border-b border-white/5 pb-2">Secret Gaib Archives</h3>
                                                    {adminData?.archives.map((cat, i) => (
                                                        <div key={i} className="glass p-6 rounded-3xl space-y-4">
                                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60">{cat.category}</h4>
                                                            <div className="grid gap-4">
                                                                {cat.codes.map((c, j) => (
                                                                    <div key={j} className="bg-black/30 p-4 rounded-xl border border-white/5">
                                                                        <p className="text-xs font-bold text-[#F27D26] uppercase">{c.name}</p>
                                                                        <p className="text-[10px] font-mono text-white/40 mt-1">{c.code}</p>
                                                                        <p className="text-[10px] italic text-white/60 mt-2">{c.meaning}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </main>
                    <footer className="p-8 text-center text-[8px] text-white/10 uppercase tracking-[0.5em] border-t border-white/5">© 2026 Neural Engine Spiritual Core // VRAXYTHERNOS</footer>
                </div>
            );
        };

        const rootEl = document.getElementById('root');
        if (statusEl) statusEl.innerText = "Mounting Application...";
        
        try {
            if (!window.React || !window.ReactDOM) {
                throw new Error("React or ReactDOM not found. Check your internet connection or CDN status.");
            }
            const root = ReactDOM.createRoot(rootEl);
            root.render(<ErrorBoundary><App /></ErrorBoundary>);
            console.log("Neural Engine Mounted Successfully.");
        } catch (e) {
            console.error("Mounting Failed:", e);
            rootEl.innerHTML = '<div style="min-height: 100vh; background: #050505; color: #ff4444; padding: 40px; font-family: monospace;">' +
                '<h1 style="font-size: 18px;">MOUNTING FAILURE</h1>' +
                '<p>' + e.message + '</p>' +
                '</div>';
        }
    </script>
</body>
</html>`;

  const finalHtml = html
    .replace(/GA_ID_HERE/g, clientData.gaId)
    .replace('DATA_HERE', JSON.stringify(clientData));

  res.send(finalHtml);
});

app.listen(3000, '0.0.0.0', () => { console.log("NEURAL ENGINE LIVE"); });
