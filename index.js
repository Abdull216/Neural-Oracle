import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- THE SUPREME VAULT (UNCHANGED AS REQUESTED) ---
const MASTER_VAULT = [
    { level: "MASTER SUCCESS", cipher: "1417-VX", sound: "VRAXYTHERNOS", dosage: "1,417 times", timing: "Fajr" },
    { level: "UNSEEN WEALTH (AL-GHAYB)", cipher: "5919-SR", sound: "AH-HA-MA-AS-SA-QA-FA-TA-YA-SH", dosage: "1,111 times", timing: "3:13 AM" },
    { level: "BELIEVING JINN KING", cipher: "66-MA", sound: "YA-MALIKAL-ARDI-ABYAD-Malam-Alhaji", dosage: "66 times", timing: "Thursday Night" },
    { level: "REALITY FORMATION", cipher: "110-TR", sound: "KAF-HA-YA-AIN-SAD", dosage: "45 times", timing: "High Noon" },
    { level: "TIME FOLDING (TAYY)", cipher: "232-TY", sound: "YA-QAIDU-YA-QAYYUM", dosage: "232 times", timing: "Midnight" }
];

const DATA_PATH = path.join(__dirname, 'oracle_storage.json');
const UPLOAD_DIR = path.join(__dirname, 'public/uploads');
fs.ensureDirSync(UPLOAD_DIR);

let db = { blog: [], scans: 58000 };
if (fs.existsSync(DATA_PATH)) db = fs.readJsonSync(DATA_PATH);
const saveDB = () => fs.writeJsonSync(DATA_PATH, db);

// --- THE REAL ABJAD ENGINE (FULL 28 KEYS) ---
const ABJAD_MAP = {
    'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ي':10,
    'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,
    'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
    'a':1,'b':2,'c':3,'d':4,'e':5,'f':80,'g':1000,'h':5,'i':10,'j':3,'k':20,'l':30,'m':40,'n':50,'o':70,'p':80,'q':100,'r':200,'s':60,'t':400,'u':6,'v':6,'w':6,'x':600,'y':10,'z':7
};

const app = express();
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

app.post('/api/calculate', (req, res) => {
    const { word } = req.body;
    let total = 0;
    const input = (word || "").toLowerCase();
    
    // 1. Calculate Core Abjad
    for (let char of input) { if (ABJAD_MAP[char]) total += ABJAD_MAP[char]; }

    // 2. Determine Element & Nature
    const natures = [
        { name: "Fire (Nar)", color: "#FF4D00", desc: "Aggressive, dominant, high-energy. Indicates a struggle or a victory through force." },
        { name: "Air (Hawa)", color: "#00E5FF", desc: "Unstable, fast-moving, mental. Indicates a change in public opinion or travel." },
        { name: "Water (Ma'u)", color: "#007BFF", desc: "Fluid, deep, hidden. Indicates secrets, spiritual backing, or emotional shifts." },
        { name: "Earth (Turab)", color: "#4CAF50", desc: "Solid, slow, material. Indicates long-term stability or physical wealth." }
    ];
    const natureObj = natures[total % 4];

    // 3. Quantum Logic (The Interpretation)
    let explanation = "";
    const yearFreq = 2027 % 9; // Numerology of the year 2027 (2+0+2+7 = 11 -> 2)
    const queryFreq = total % 9;

    if (input.includes("tinubu") || input.includes("election")) {
        if (queryFreq === yearFreq) {
            explanation = `ALIGNMENT DETECTED: The frequency of the name aligns with the 2027 node. Probability of retention is high but requires grounding in ${natureObj.name}.`;
        } else {
            explanation = `DISSONANCE: The name frequency (${queryFreq}) and the year node (${yearFreq}) are in conflict. Mass disruption in the ${natureObj.name} field is expected.`;
        }
    } else {
        explanation = `GENERAL ANALYSIS: This query has a spiritual mass of ${total}. Its dominant force is ${natureObj.name}, which suggests that success depends on ${natureObj.desc}`;
    }

    res.json({ total, nature: natureObj.name, natureColor: natureObj.color, explanation, velocity: (total * 1.618).toFixed(2) });
});

// Admin and Server routes remain same...
app.post('/api/admin/blog', multer({ dest: UPLOAD_DIR }).single('image'), (req, res) => {
    db.blog.unshift({ id: Date.now(), title: req.body.title, content: req.body.content, image: req.file ? `/uploads/${req.file.filename}` : null });
    saveDB();
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TERMINAL ORACLE | Q-PHYSICS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap');
        body { background: #000; color: #0f0; font-family: 'JetBrains Mono', monospace; }
        .crt::before { content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); z-index: 2; background-size: 100% 2px, 3px 100%; pointer-events: none; }
        .terminal-box { border: 1px solid #1a1a1a; background: #050505; box-shadow: 0 0 20px rgba(0, 255, 0, 0.05); }
        .glitch-text { text-shadow: 2px 0 #f0f, -2px 0 #0ff; }
    </style>
</head>
<body class="crt">
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;
        const App = () => {
            const [v, setV] = useState('home');
            const [query, setQuery] = useState('');
            const [result, setResult] = useState(null);
            const [logs, setLogs] = useState([]);

            const solve = async () => {
                setLogs(["INITIALIZING QUANTUM SCAN...", "FETCHING ABJAD VALUES...", "MAPPING TO ELEMENTAL PLANES..."]);
                const r = await fetch('/api/calculate', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ word: query }) });
                const data = await r.json();
                setTimeout(() => {
                    setLogs(prev => [...prev, "CALCULATION COMPLETE.", "OUTPUTTING DATA..."]);
                    setResult(data);
                }, 1000);
            };

            return (
                <div className="min-h-screen p-6 max-w-4xl mx-auto">
                    <header className="mb-12 border-b border-zinc-800 pb-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-black italic tracking-tighter text-white glitch-text">NEURAL_ORACLE_V5</h1>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Quantum Abjad Analysis Engine</p>
                        </div>
                        <button onClick={() => setV(v==='home'?'admin':'home')} className="text-[10px] border border-zinc-700 px-4 py-1 hover:bg-white hover:text-black transition-all">SYSTEM_ROOT</button>
                    </header>

                    {v === 'home' ? (
                        <div className="space-y-8">
                            <div className="terminal-box p-8 rounded-xl space-y-6">
                                <div className="text-[12px] text-zinc-600 mb-4 uppercase tracking-tighter">Enter Query for 2027 Alignment Scan:</div>
                                <div className="flex gap-4">
                                    <span className="text-[#F27D26] font-bold mt-4">$</span>
                                    <input value={query} onChange={e=>setQuery(e.target.value)} className="w-full bg-transparent border-none outline-none text-xl text-white py-4" placeholder="Type here..." autoFocus />
                                    <button onClick={solve} className="bg-white text-black font-black px-8 py-4 text-xs uppercase hover:bg-[#F27D26] transition-colors">RUN</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {logs.map((l, i) => <div key={i} className="text-[10px] opacity-40 font-bold tracking-widest animate-pulse">>> {l}</div>)}
                            </div>

                            {result && (
                                <div className="terminal-box p-10 rounded-xl space-y-10 animate-in fade-in duration-1000">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="border border-zinc-800 p-6 rounded-lg">
                                            <div className="text-[10px] text-zinc-500 mb-2">ABJAD_TOTAL</div>
                                            <div className="text-5xl font-black text-white">{result.total}</div>
                                        </div>
                                        <div className="border border-zinc-800 p-6 rounded-lg" style={{borderColor: result.natureColor}}>
                                            <div className="text-[10px] text-zinc-500 mb-2">ELEMENTAL_FORCE</div>
                                            <div className="text-3xl font-black italic" style={{color: result.natureColor}}>{result.nature}</div>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/30 p-8 rounded-lg border-l-4 border-white">
                                        <h3 className="text-[10px] font-black uppercase mb-4 text-[#F27D26]">The Quantum Explanation:</h3>
                                        <p className="text-white text-sm leading-relaxed">{result.explanation}</p>
                                        <p className="text-[11px] mt-6 text-zinc-500 italic font-bold">Resonance Velocity: {result.velocity} $Hz$</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-xs uppercase tracking-widest opacity-20">Admin Secure Portal Active</p>
                            {/* Admin content from previous version... */}
                        </div>
                    )}
                </div>
            );
        };
        ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    </script>
</body>
</html>`);
});

app.listen(3000, () => console.log("TERMINAL ONLINE"));
