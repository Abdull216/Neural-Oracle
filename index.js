import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- THE COMPLETE SUPREME VAULT (EXPANDED) ---
const MASTER_VAULT = [
    { level: "MASTER SUCCESS", cipher: "1417-VX", sound: "VRAXYTHERNOS", dosage: "1,417 times", timing: "Fajr" },
    
    // --- MONEY & WEALTH CIPHERS (MULTIPLE) ---
    { 
        level: "UNSEEN WEALTH (AL-GHAYB)", 
        cipher: "5919-SR", 
        sound: "AH-HA-MA-AS-SA-QA-FA-TA-YA-SH", 
        meaning: "The 'Money under the Mat' code for sudden materialization.",
        dosage: "1,111 times", timing: "3:13 AM" 
    },
    { 
        level: "SUDDEN PROVISION", 
        cipher: "308-RZ", 
        sound: "YA-RAZZAQU", 
        meaning: "To open the door of sustenance from where you do not expect.",
        dosage: "308 times after Fajr", timing: "Daily" 
    },
    { 
        level: "BUSINESS DOMINANCE", 
        cipher: "1060-GH", 
        sound: "YA-GHANIYYU", 
        meaning: "To become the 'Mughni' (the enricher) in your field of business.",
        dosage: "1,060 times", timing: "Thursday Nights" 
    },
    { 
        level: "GOLDEN OPENING", 
        cipher: "489-FT", 
        sound: "YA-FATTAHU", 
        meaning: "To break through every financial wall and closed door.",
        dosage: "489 times", timing: "After Dhuhr" 
    },

    // --- FORMATION & TRANSFORMATION CIPHERS ---
    { 
        level: "REALITY FORMATION", 
        cipher: "110-TR", 
        sound: "KAF-HA-YA-AIN-SAD", 
        meaning: "The primary code for changing the 'Sura' (form) of an event.",
        dosage: "45 times while visualizing", timing: "High Noon" 
    },
    { 
        level: "TIME FOLDING (TAYY)", 
        cipher: "232-TY", 
        sound: "YA-QAIDU-YA-QAYYUM", 
        meaning: "To speed up a process that normally takes months into days.",
        dosage: "232 times", timing: "Midnight" 
    },
    { 
        level: "COMMANDING FORM", 
        cipher: "99-MA", 
        sound: "YA-MALIKAL-MULKI", 
        meaning: "To gain authority over the 'Mulk' (physical world) and the King of Jinn.",
        dosage: "99 times", timing: "Thursday Midnight" 
    }
];

const GA_ID = "G-HD01MF5SL9";
const DATA_PATH = path.join(__dirname, 'oracle_storage.json');
const UPLOAD_DIR = path.join(__dirname, 'public/uploads');
fs.ensureDirSync(UPLOAD_DIR);

let db = { blog: [], scans: 45000 };
if (fs.existsSync(DATA_PATH)) db = fs.readJsonSync(DATA_PATH);
const saveDB = () => fs.writeJsonSync(DATA_PATH, db);

const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- FULL REAL ABJAD CALCULATION ENGINE ---
const ABJAD_MAP = {
    // Standard Arabic Letters (The 28 Keys)
    'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ي':10,
    'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,
    'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000,
    // Latin mapping for VRAXYTHERNOS and modern names
    'a':1,'b':2,'c':3,'d':4,'e':5,'f':80,'g':1000,'h':5,'i':10,'j':3,'k':20,'l':30,'m':40,'n':50,'o':70,'p':80,'q':100,'r':200,'s':60,'t':400,'u':6,'v':6,'w':6,'x':600,'y':10,'z':7
};

const app = express();
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

app.post('/api/calculate', (req, res) => {
    const { word } = req.body;
    let total = 0;
    const input = (word || "").toLowerCase();
    
    // Real calculation loop
    for (let char of input) {
        if (ABJAD_MAP[char]) total += ABJAD_MAP[char];
    }

    // Hisab Logic: Finding the "Nature" (Element) based on the total
    const elements = ["Fire (Nar)", "Air (Hawa)", "Water (Ma'u)", "Earth (Turab)"];
    const elementIndex = total % 4;
    const nature = elements[elementIndex];

    // Spiritual mass (Quantum calculation)
    const velocity = (total * 1.618).toFixed(2); 

    res.json({ total, nature, velocity, isVraxy: input.includes("vraxy") });
});

app.post('/api/admin/blog', upload.single('image'), (req, res) => {
    db.blog.unshift({ id: Date.now(), title: req.body.title, content: req.body.content, image: req.file ? `/uploads/${req.file.filename}` : null });
    saveDB();
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORACLE | FULL ABJAD HISAB</title>
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { background: #000; color: #fff; font-family: 'JetBrains Mono', monospace; }
        .neon-border { border: 1px solid rgba(242,125,38,0.3); }
        .elite-glow { color: #F27D26; text-shadow: 0 0 20px #F27D26; }
        .glass { background: rgba(10,10,10,0.9); backdrop-filter: blur(15px); }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;
        const App = () => {
            const [v, setV] = useState('home');
            const [name, setName] = useState('');
            const [res, setRes] = useState(null);
            const [auth, setAuth] = useState(false);
            const vault = ${JSON.stringify(MASTER_VAULT)};
            const blogs = ${JSON.stringify(db.blog)};

            const solve = async () => {
                const r = await fetch('/api/calculate', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ word: name }) });
                setRes(await r.json());
            };

            return (
                <div className="min-h-screen p-4 max-w-4xl mx-auto">
                    <nav className="flex justify-between items-center p-6 neon-border rounded-3xl mb-12 glass sticky top-4 z-50">
                        <h1 className="font-black italic elite-glow text-xl">ABJAD_CORE</h1>
                        <button onClick={() => setV(v==='home'?'admin':'home')} className="text-[10px] border border-white/20 px-6 py-2 rounded-full uppercase">{v==='home'?'Master Login':'Exit'}</button>
                    </nav>

                    {v === 'home' ? (
                        <div className="space-y-16">
                            <div className="text-center space-y-8">
                                <h2 className="text-5xl font-black italic tracking-tighter uppercase"><span className="text-[#F27D26]">VRAXY</span> ORACLE</h2>
                                <p className="text-[10px] uppercase tracking-[0.6em] text-white/30">Universal Hisab Calculator & Sirr Vault</p>
                                <div className="flex gap-2 max-w-xl mx-auto">
                                    <input value={name} onChange={e=>setName(e.target.value)} placeholder="Type Name or Question..." className="flex-1 p-5 rounded-2xl bg-black border border-white/10 outline-none focus:border-[#F27D26]" />
                                    <button onClick={solve} className="bg-[#F27D26] px-10 rounded-2xl font-black text-xs uppercase shadow-lg shadow-[#F27D26]/20">CALCULATE</button>
                                </div>
                            </div>

                            {res && (
                                <div className="neon-border p-10 rounded-[40px] glass space-y-8 border-t-4 border-[#F27D26]">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-black uppercase text-center">
                                        <div className="p-6 bg-black rounded-2xl"><p className="text-[10px] opacity-30 mb-2">Abjad Total</p><span className="elite-glow text-4xl">{res.total}</span></div>
                                        <div className="p-6 bg-black rounded-2xl"><p className="text-[10px] opacity-30 mb-2">Nature (Element)</p><span className="text-white text-xl">{res.nature}</span></div>
                                        <div className="p-6 bg-black rounded-2xl"><p className="text-[10px] opacity-30 mb-2">Quantum Mass</p><span className="text-white text-xl">{res.velocity}</span></div>
                                    </div>
                                    <div className="text-center text-[11px] opacity-50 italic">"The geometric signature of this query aligns with {res.nature} forces."</div>
                                </div>
                            )}

                            <div className="grid gap-10">
                                {blogs.map(b => (
                                    <div key={b.id} className="neon-border rounded-[40px] overflow-hidden glass">
                                        {b.image && <img src={b.image} className="w-full h-72 object-cover opacity-80" />}
                                        <div className="p-10">
                                            <h3 className="text-[#F27D26] font-black text-2xl uppercase italic">{b.title}</h3>
                                            <p className="text-sm opacity-50 mt-4 leading-relaxed">{b.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto space-y-12">
                            {!auth ? (
                                <div className="neon-border p-16 rounded-[40px] text-center space-y-10 glass">
                                    <h3 className="elite-glow text-2xl font-black uppercase italic">Sirr Portal</h3>
                                    <input type="password" id="pass" placeholder="MASTER KEY" className="w-full p-6 text-center rounded-2xl text-3xl font-black bg-black border border-white/10" />
                                    <button onClick={() => document.getElementById('pass').value==='admin216' ? setAuth(true) : alert('LOCKED')} className="w-full bg-[#F27D26] p-6 rounded-2xl font-black uppercase text-xs">Authorize</button>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    <div className="neon-border p-10 rounded-[40px] glass space-y-10">
                                        <h3 className="elite-glow text-xs font-black uppercase text-center border-b border-white/5 pb-6">Expanded Decipher Vault</h3>
                                        {vault.map((v, i) => (
                                            <div key={i} className="border-b border-white/5 pb-8 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-[#F27D26] font-black italic text-xl uppercase">{v.level}</span>
                                                    <span className="text-[10px] bg-[#F27D26] text-black px-4 py-1 rounded-full font-bold">{v.cipher}</span>
                                                </div>
                                                <div className="bg-black p-6 rounded-2xl space-y-3">
                                                    <p className="text-white font-black text-lg tracking-widest">{v.sound}</p>
                                                    <div className="flex justify-between text-[10px] uppercase font-bold text-white/40">
                                                        <span>Count: {v.dosage}</span>
                                                        <span>Time: {v.timing}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        await fetch('/api/admin/blog', { method: 'POST', body: new FormData(e.target) });
                                        window.location.reload();
                                    }} className="neon-border p-10 rounded-[40px] space-y-6 glass">
                                        <h3 className="uppercase text-[12px] font-black text-[#F27D26] text-center">New Sirr Deployment</h3>
                                        <input name="title" placeholder="Title" className="w-full p-5 text-sm font-bold uppercase bg-black" required />
                                        <textarea name="content" placeholder="Details..." className="w-full p-5 text-sm h-40 bg-black" required />
                                        <input type="file" name="image" className="text-[12px] text-white/50" accept="image/*" />
                                        <button className="w-full bg-[#F27D26] p-6 rounded-2xl font-black text-xs uppercase shadow-xl">Deploy</button>
                                    </form>
                                </div>
                            )}
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

app.listen(3000, () => console.log("ORACLE ENGINE ONLINE"));
