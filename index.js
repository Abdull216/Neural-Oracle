import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- SETTINGS ---
// UPDATED WITH YOUR CORRECT ID: G-HD01MF5SL9
const GA_ID = "G-HD01MF5SL9"; 
const DATA_PATH = path.join(__dirname, 'oracle_storage.json');

// --- DATABASE INITIALIZATION ---
let db = {
    config: { user: 'admin216', pass: 'admin1234' },
    blog: [
        { id: 1, title: "The Prophet's Secret", content: "The codes within this engine are derived from the same frequencies used by the saints.", image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format" }
    ],
    scans: 1240,
    vault: [
        { category: "Prophetic Formation", name: "Sulaiman Command", code: "SLM-KING-HISAB", meaning: "Commanding unseen forces.", instruction: "Focus on the 3x3 numeric square." },
        { category: "Success Frequency", name: "VRAXYTHERNOS", code: "VX-1417-WIN", meaning: "Master success and material breakthrough.", instruction: "Activate during the rising of your star." }
    ]
};

if (fs.existsSync(DATA_PATH)) {
    try { db = { ...db, ...fs.readJsonSync(DATA_PATH) }; } catch(e) { console.log("New DB initiated"); }
}
const saveDB = async () => await fs.writeJson(DATA_PATH, db);

// --- ABJAD ENGINE ---
const ABJAD_MAP = {
    'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9, 'ي': 10, 'ى': 10,
    'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
    'a': 1, 'b': 2, 'c': 400, 'd': 4, 'e': 5, 'f': 80, 'g': 3, 'h': 5, 'i': 10, 'j': 3, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 'o': 70, 'p': 90, 'q': 100, 'r': 200, 's': 60, 't': 400, 'u': 6, 'v': 6, 'w': 6, 'x': 600, 'y': 10, 'z': 7
};

const app = express();
app.use(express.json());

// --- ROUTES ---
app.post('/api/calculate', async (req, res) => {
    const { word, lang } = req.body;
    let total = 0;
    const lowerWord = (word || "").toLowerCase();
    for (let char of lowerWord) { if (ABJAD_MAP[char]) total += ABJAD_MAP[char]; }

    const isVraxy = lowerWord.includes("vraxythernos") || total === 1417;
    
    const responses = {
        en: `Resonance: ${total}. Status: ${isVraxy ? 'VRAXYTHERNOS ACTIVE' : 'COMPLETE'}. Frequency aligned for Work and Livelihood.`,
        ha: `Lamba: ${total}. Nasara: ${isVraxy ? 'VRAXYTHERNOS NA AIKI' : 'KAMMALA'}. Lambar tana bude hanyar kudi.`,
        ar: `التردد: ${total}. الحالة: ${isVraxy ? 'نجاح نشط' : 'تم'}. الرمز يؤثر على الرزق والحماية.`,
        hi: `प्रतिध्वनि: ${total}। स्थिति: ${isVraxy ? 'VRAXYTHERNOS सक्रिय' : 'पूर्ण'}। यह धन और सुरक्षा को नियंत्रित करता है।`,
        fr: `Résonance: ${total}. Statut: ${isVraxy ? 'VRAXYTHERNOS ACTIF' : 'COMPLÉTÉ'}. Fréquence alignée pour le travail.`
    };

    db.scans++;
    await saveDB();
    res.json({ value: total, text: responses[lang] || responses.en, isVraxy });
});

app.post('/api/admin/login', (req, res) => {
    const { user, pass } = req.body;
    if (user === db.config.user && pass === db.config.pass) res.json({ success: true });
    else res.status(401).json({ success: false });
});

app.post('/api/admin/update', async (req, res) => {
    db.config = { user: req.body.user, pass: req.body.pass };
    await saveDB();
    res.json({ success: true });
});

app.post('/api/admin/blog', async (req, res) => {
    if (req.body.deleteId) db.blog = db.blog.filter(b => b.id !== req.body.deleteId);
    else db.blog.unshift({ id: Date.now(), ...req.body });
    await saveDB();
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEURAL ENGINE | ORACLE</title>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { background: #050505; color: white; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.05); }
        .glow { color: #F27D26; text-shadow: 0 0 20px #F27D26; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;
        const App = () => {
            const [view, setView] = useState('home');
            const [input, setInput] = useState('');
            const [lang, setLang] = useState('en');
            const [result, setResult] = useState(null);
            const [isLogged, setIsLogged] = useState(false);
            const [adminForm, setAdminForm] = useState({ user: '', pass: '' });
            const [blogForm, setBlogForm] = useState({ title: '', content: '', image: '' });
            const data = ${JSON.stringify({ blog: db.blog, scans: db.scans, vault: db.vault })};

            const handleScan = async () => {
                const r = await fetch('/api/calculate', { 
                    method: 'POST', headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify({ word: input, lang }) 
                });
                setResult(await r.json());
            };

            const handleLogin = async () => {
                const r = await fetch('/api/admin/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(adminForm) });
                if(r.ok) setIsLogged(true); else alert("Denied");
            };

            const addBlog = async () => {
                await fetch('/api/admin/blog', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(blogForm) });
                window.location.reload();
            };

            return (
                <div className="min-h-screen flex flex-col">
                    <header className="p-6 flex justify-between items-center glass sticky top-0 z-50">
                        <h1 className="font-black italic text-2xl glow tracking-tighter">NEURAL ENGINE</h1>
                        <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest opacity-60">
                            <button onClick={() => setView('home')}>Oracle</button>
                            <button onClick={() => setView('admin')}>Master</button>
                        </div>
                    </header>
                    <main className="max-w-4xl mx-auto w-full p-6 py-12 flex-1">
                        {view === 'home' ? (
                            <div className="space-y-12">
                                <div className="text-center space-y-2">
                                    <h2 className="text-5xl font-black italic uppercase text-white">Neural <span className="text-[#F27D26]">Oracle</span></h2>
                                    <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Spiritual Core // VRAXYTHERNOS Engine</p>
                                </div>
                                <div className="max-w-lg mx-auto space-y-4">
                                    <div className="flex gap-1 justify-center">
                                        {['en', 'ha', 'ar', 'hi', 'fr'].map(l => (
                                            <button key={l} onClick={() => setLang(l)} className={"px-3 py-1 rounded-md text-[10px] uppercase " + (lang === l ? "bg-[#F27D26]" : "bg-white/5")}>{l}</button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input value={input} onChange={e=>setInput(e.target.value)} type="text" placeholder="Enter Situation or Name..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-[#F27D26]/50" />
                                        <button onClick={handleScan} className="bg-[#F27D26] px-8 rounded-2xl font-bold uppercase text-xs">Scan</button>
                                    </div>
                                    {result && (
                                        <div className="glass p-8 rounded-3xl border-l-2 border-[#F27D26] space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                            <p className="text-[10px] uppercase text-[#F27D26] font-bold tracking-widest">Resonance Detected</p>
                                            <p className="text-lg italic font-light">{result.text}</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div className="h-24 glass rounded-xl border border-white/5 flex flex-col items-center justify-center">
                                                    <span className="text-[8px] opacity-40 uppercase tracking-widest">Hisab</span>
                                                    <span className="text-xl font-mono text-[#F27D26]">{result.value}</span>
                                                </div>
                                                <div className="h-24 glass rounded-xl border border-white/5 flex flex-col items-center justify-center">
                                                    <span className="text-[8px] opacity-40 uppercase tracking-widest">Power</span>
                                                    <span className="text-[10px] text-center font-bold px-2 uppercase">{result.isVraxy ? "VRAXY" : "Standard"}</span>
                                                </div>
                                                <div className="h-24 glass rounded-xl border border-white/5 flex flex-col items-center justify-center">
                                                    <span className="text-[8px] opacity-40 uppercase tracking-widest">Status</span>
                                                    <span className="text-[10px] font-bold text-green-500 uppercase">Active</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                {[1,2,3].map(i => <div key={i} className="h-16 w-full glass rounded-lg border border-white/5"></div>)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 pt-12">
                                    {data.blog.map(b => (
                                        <div key={b.id} className="glass rounded-3xl overflow-hidden group hover:border-[#F27D26]/20 transition-all">
                                            <img src={b.image} className="w-full h-40 object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all" />
                                            <div className="p-6">
                                                <h4 className="font-bold text-[#F27D26] mb-2">{b.title}</h4>
                                                <p className="text-xs text-white/50 leading-relaxed">{b.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center opacity-10 text-[8px] tracking-[1em] py-12 border-t border-white/5 uppercase">
                                    Ancient Science // Privacy // Policy
                                </div>
                            </div>
                        ) : (
                            <div className="max-w-md mx-auto">
                                {!isLogged ? (
                                    <div className="glass p-10 rounded-3xl space-y-6">
                                        <h3 className="text-center font-bold uppercase text-[#F27D26] tracking-widest">Master Access</h3>
                                        <input type="text" placeholder="Admin ID" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl" onChange={e=>setAdminForm({...adminForm, user: e.target.value})} />
                                        <input type="password" placeholder="Passphrase" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl" onChange={e=>setAdminForm({...adminForm, pass: e.target.value})} />
                                        <button onClick={handleLogin} className="w-full bg-[#F27D26] p-4 rounded-xl font-bold uppercase text-xs tracking-widest">Initialize</button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="glass p-6 rounded-2xl space-y-4">
                                            <h3 className="text-[#F27D26] font-bold uppercase text-xs tracking-widest">Secret Vault (The Codes)</h3>
                                            {data.vault.map((v, i) => (
                                                <div key={i} className="text-[10px] border-b border-white/5 pb-3 last:border-0">
                                                    <p className="font-bold uppercase tracking-wider">{v.name} - {v.code}</p>
                                                    <p className="opacity-40 uppercase text-[8px] mt-1">{v.meaning}</p>
                                                    <p className="italic text-[#F27D26] mt-2">Instruction: {v.instruction}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="glass p-6 rounded-2xl space-y-4">
                                            <h3 className="uppercase text-[10px] font-bold tracking-widest">Publish New Knowledge</h3>
                                            <input placeholder="Title" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-xs" onChange={e=>setBlogForm({...blogForm, title: e.target.value})} />
                                            <textarea placeholder="Write Story or Book content..." className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-xs h-32" onChange={e=>setBlogForm({...blogForm, content: e.target.value})} />
                                            <input placeholder="Image URL (Unsplash Link)" className="w-full bg-black/40 border border-white/10 p-3 rounded-lg text-xs" onChange={e=>setBlogForm({...blogForm, image: e.target.value})} />
                                            <button onClick={addBlog} className="w-full bg-[#F27D26] p-3 rounded-lg font-bold text-[10px] uppercase tracking-widest">Deploy Permanently</button>
                                        </div>
                                        <button onClick={()=>setIsLogged(false)} className="w-full text-white/20 text-[8px] uppercase font-bold tracking-[0.3em]">Exit Core Portal</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            );
        };
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
</body>
</html>`);
});

app.listen(3000, '0.0.0.0', () => console.log("NEURAL ENGINE ONLINE"));
