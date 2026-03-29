import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// --- RESTORED DATA CONSTANTS ---
const ABJAD_MAP = {
    'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
    'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
    'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
    'a':1,'b':2,'j':3,'d':4,'h':5,'w':6,'z':7,'x':8,'t':9,'y':10,'k':20,'l':30,'m':40,'n':50,'s':60,'o':70,'f':80,'p':90,'q':100,'r':200,'c':400,'u':6,'v':6,'e':5,'i':10,'g':3
};

const INITIAL_ARCHIVES = [
    {
        category: "Ghazali Al-Kimiya",
        codes: [
            { name: "Wafq-al-Sirr", code: "GHAZ-786-OPEN", usage: "Master frequency for digital squares." },
            { name: "Muwakkil Lock", code: "AYIL-PROTECT-77", usage: "Admin terminal security." }
        ]
    }
];

// --- PERSISTENCE LAYER ---
const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const CONFIG_PATH = path.join(DATA_DIR, 'admin-config.json');
let adminConfig = fs.existsSync(CONFIG_PATH) ? fs.readJsonSync(CONFIG_PATH) : { user: 'admin', pass: 'oracle777' };

// --- RESTORED FULL UI & LOGIC ---
app.get('*', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-HD01MF5SL9"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-HD01MF5SL9');
    </script>
    <title>Neural Engine | Supreme Sovereign Oracle</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide-react@0.263.1/dist/umd/lucide-react.min.js"></script>
    <style>
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        body { background: #020202; color: #eee; font-family: 'JetBrains Mono', monospace; }
        .terminal-glow { box-shadow: 0 0 40px rgba(242, 125, 38, 0.15); border: 1px solid rgba(242, 125, 38, 0.2); }
        .animated-logo { animation: pulse-glow 3s infinite; }
        .glass-panel { background: rgba(10, 10, 10, 0.8); backdrop-filter: blur(20px); }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;
        const { Shield, Terminal, Menu, Lock, Cpu, Star, Activity } = lucide;

        const App = () => {
            const [view, setView] = useState('home');
            const [name, setName] = useState('');
            const [mother, setMother] = useState('');
            const [result, setResult] = useState(null);
            const [loading, setLoading] = useState(false);

            const handleCalculate = async () => {
                setLoading(true);
                const map = ${JSON.stringify(ABJAD_MAP)};
                const total = (name+mother).toLowerCase().split('').reduce((a,c)=>a+(map[c]||0),0);
                
                // GHAZALI LOGIC
                const mName = "Ya " + (total + 51) + "ayil";
                const b = Math.floor((total-12)/3);
                const wafq = [b+8, b+1, b+6, b+3, b+5, b+7, b+4, b+9, b+2];

                setTimeout(() => {
                    setResult({ total, muwakkil: mName, wafq });
                    setLoading(false);
                }, 1500);
            };

            return (
                <div className="min-h-screen flex">
                    {/* SIDE NAVIGATION MENU */}
                    <nav className="w-20 border-r border-white/5 flex flex-col items-center py-8 space-y-8 glass-panel">
                        <Shield className="text-orange-500 animated-logo" size={32} />
                        <Menu className="cursor-pointer hover:text-orange-500" onClick={() => setView('home')} />
                        <Activity className="cursor-pointer hover:text-orange-500" onClick={() => setView('stats')} />
                        <Lock className="mt-auto cursor-pointer hover:text-orange-500" onClick={() => setView('admin')} />
                    </nav>

                    <main className="flex-1 p-8 md:p-16 overflow-y-auto">
                        {view === 'home' && (
                            <div className="max-w-5xl mx-auto space-y-12">
                                <header className="space-y-4">
                                    <div className="flex items-center gap-4 text-orange-500 font-bold tracking-widest text-xs uppercase">
                                        <Cpu size={14}/> Neural Engine Active
                                    </div>
                                    <h1 className="text-6xl font-black italic tracking-tighter uppercase">Sovereign <span className="text-orange-500">Oracle</span></h1>
                                    <p className="max-w-2xl text-gray-500 leading-relaxed text-sm">
                                        Ancient mathematical frequencies meets Agentic AI. This interface calculates your 
                                        metaphysical Abjad resonance using the Al-Ghazali 3x3 balance grid. 
                                        Input your data to reveal your Guardian Muwakkil.
                                    </p>
                                </header>

                                <div className="terminal-glow p-10 rounded-[3rem] bg-zinc-950/50 space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Subject Identity</label>
                                            <input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-black border-b border-white/10 p-4 outline-none focus:border-orange-500 transition-all text-xl" placeholder="Full Name..." />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold text-gray-500">Maternal Root</label>
                                            <input value={mother} onChange={e=>setMother(e.target.value)} className="w-full bg-black border-b border-white/10 p-4 outline-none focus:border-orange-500 transition-all text-xl" placeholder="Mother's Name..." />
                                        </div>
                                    </div>
                                    <button onClick={handleCalculate} className="w-full bg-orange-600 hover:bg-orange-500 text-black font-black py-6 rounded-2xl text-2xl uppercase italic flex items-center justify-center gap-4 transition-all">
                                        {loading ? <Terminal className="animate-spin" /> : 'INITIATE FREQUENCY SCAN'}
                                    </button>
                                </div>

                                {result && (
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="glass-panel p-8 rounded-3xl border-l-4 border-orange-500 space-y-4">
                                            <p className="text-[10px] font-bold text-orange-500 uppercase">Guardian Muwakkil Identified</p>
                                            <p className="text-5xl font-black italic">{result.muwakkil}</p>
                                            <div className="pt-6 border-t border-white/5 text-gray-500 text-xs italic">
                                                *Frequency detected at Abjad Level: {result.total}
                                            </div>
                                        </div>
                                        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest">Ghazali Hatimi Matrix</p>
                                            <div className="grid grid-cols-3 gap-2 w-48 h-48 bg-orange-600/10 p-2 rounded-xl border border-orange-500/20">
                                                {result.wafq.map((v, i) => (
                                                    <div key={i} className="bg-black flex items-center justify-center font-bold text-orange-500 border border-orange-500/10">{v}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {view === 'admin' && (
                            <div className="max-w-4xl mx-auto space-y-8">
                                <h2 className="text-4xl font-black uppercase italic">Admin <span className="text-orange-500">Console</span></h2>
                                <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
                                    <input type="password" placeholder="Access Key" className="w-full bg-black border border-white/10 p-4 rounded-xl" />
                                    <button className="bg-orange-600 w-full py-4 rounded-xl font-bold uppercase">Authorize</button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6 opacity-40">
                                    <div className="glass-panel p-6 rounded-2xl border border-white/5">
                                        <p className="text-xs font-bold text-orange-500 uppercase">Archived Secrets</p>
                                        <p className="mt-2">Sirr-ul-Ghazali Level 4 Active</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            );
        };
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
</body>
</html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("SOVEREIGN ENGINE RE-ESTABLISHED"));
