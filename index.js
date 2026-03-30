import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json({ limit: '50mb' }));

// --- PERMANENT STORAGE ---
const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const BLOGS_PATH = path.join(DATA_DIR, 'blogs.json');
const AUTH_PATH = path.join(DATA_DIR, 'admin_config.json');
const HISTORY_PATH = path.join(DATA_DIR, 'oracle_history.json');

if (!fs.existsSync(AUTH_PATH)) fs.writeJsonSync(AUTH_PATH, { u: 'admin216', p: 'admin1234' });
if (!fs.existsSync(BLOGS_PATH)) fs.writeJsonSync(BLOGS_PATH, []);
if (!fs.existsSync(HISTORY_PATH)) fs.writeJsonSync(HISTORY_PATH, []);

// --- SYSTEM API ---
app.get('/api/init', (req, res) => {
    res.json({ blogs: fs.readJsonSync(BLOGS_PATH), history: fs.readJsonSync(HISTORY_PATH) });
});

app.post('/api/login', (req, res) => {
    const auth = fs.readJsonSync(AUTH_PATH);
    if (req.body.user === auth.u && req.body.pass === auth.p) res.json({ success: true });
    else res.status(401).json({ success: false });
});

app.post('/api/oracle', (req, res) => {
    const history = fs.readJsonSync(HISTORY_PATH);
    const entry = { id: Date.now(), ...req.body, date: new Date().toLocaleString() };
    history.unshift(entry);
    fs.writeJsonSync(HISTORY_PATH, history);
    res.json({ success: true });
});

app.post('/api/blogs', (req, res) => {
    const blogs = fs.readJsonSync(BLOGS_PATH);
    blogs.unshift({ id: Date.now(), ...req.body });
    fs.writeJsonSync(BLOGS_PATH, blogs);
    res.json({ success: true });
});

app.delete('/api/blogs/:id', (req, res) => {
    let blogs = fs.readJsonSync(BLOGS_PATH).filter(b => b.id !== parseInt(req.params.id));
    fs.writeJsonSync(BLOGS_PATH, blogs);
    res.json({ success: true });
});

app.delete('/api/history/:id', (req, res) => {
    let history = fs.readJsonSync(HISTORY_PATH).filter(h => h.id !== parseInt(req.params.id));
    fs.writeJsonSync(HISTORY_PATH, history);
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sovereign Oracle v19 | 927</title>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-HD01MF5SL9"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-HD01MF5SL9');
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { background: #000; color: #eee; font-family: 'JetBrains Mono', monospace; }
        .glow { color: #F27D26; text-shadow: 0 0 25px rgba(242, 125, 38, 0.6); }
        .glass { background: rgba(10, 10, 10, 0.98); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.05); }
        .wafq-cell { background: rgba(242, 125, 38, 0.05); border: 1px solid #F27D26; height: 50px; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;
        const abjadMap = {'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000};

        const App = () => {
            const [view, setView] = useState('home');
            const [blogs, setBlogs] = useState([]);
            const [history, setHistory] = useState([]);
            const [isLogged, setIsLogged] = useState(false);
            const [form, setForm] = useState({ n:'', m:'', y:'', s:'', q:'', img:'' });
            const [result, setResult] = useState(null);

            const load = () => fetch('/api/init').then(r => r.json()).then(d => { setBlogs(d.blogs); setHistory(d.history); });
            useEffect(() => { load(); }, []);

            const runOracle = async () => {
                let total = 0;
                (form.n + form.m + form.s + form.q).split('').forEach(c => { if(abjadMap[c]) total += abjadMap[c]; });
                const mod = total % 4;
                let prophecy = ""; let hausa = "";

                const q = form.q.toLowerCase();
                if(q.includes('love') || q.includes('girl')) {
                    prophecy = mod === 0 ? "The frequency indicates a block from the mother's side. Caution is advised." : "The alignment is harmonious. A fruitful union is possible.";
                    hausa = mod === 0 ? "Akwai cikas daga bangaren mahaifiya." : "Akwai alheri a cikin wannan soyayya.";
                } else if(q.includes('election') || q.includes('president') || q.includes('tinubu')) {
                    prophecy = "The path is turbulent. Success is visible but social unrest and loss are high.";
                    hausa = "Nasara zata zo amma tare da babban hargitsi.";
                } else {
                    prophecy = "The hidden reality suggests spiritual work is needed for full manifestation.";
                    hausa = "Sirrin ya nuna akwai bukatar yin aiki na musamman.";
                }

                const base = Math.floor((total - 12) / 3);
                const w = [base+8, base+1, base+6, base+3, base+5, base+7, base+4, base+9, base+2];
                const resObj = { sum:total, wafq:w, prophecy, hausa, ...form };
                setResult(resObj);
                await fetch('/api/oracle', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(resObj)});
                load();
            };

            return (
                <div className="min-h-screen">
                    <nav className="p-6 glass flex justify-between items-center sticky top-0 z-50 mb-8">
                        <div className="glow font-black italic tracking-widest">927 SOVEREIGN</div>
                        <div className="flex gap-4 text-[9px] font-bold uppercase">
                            <button onClick={()=>setView('home')}>Consult</button>
                            <button onClick={()=>setView('archive')}>Archive</button>
                            <button onClick={()=>setView('admin')}>Vault</button>
                        </div>
                    </nav>

                    {view === 'home' && (
                        <div className="max-w-4xl mx-auto p-4 space-y-10 pb-20">
                            <div className="glass p-10 rounded-[3rem] border-t-8 border-orange-600 space-y-4 shadow-2xl">
                                <h2 className="glow text-center font-black italic uppercase text-xl">The Oracle Terminal</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <input onChange={e=>setForm({...form, n:e.target.value})} placeholder="NAME" className="bg-black p-4 rounded-xl border border-white/5 outline-none" />
                                    <input onChange={e=>setForm({...form, m:e.target.value})} placeholder="MOTHER'S NAME" className="bg-black p-4 rounded-xl border border-white/5 outline-none" />
                                    <input onChange={e=>setForm({...form, y:e.target.value})} placeholder="BIRTH YEAR" className="bg-black p-4 rounded-xl border border-white/5 outline-none" />
                                    <input onChange={e=>setForm({...form, s:e.target.value})} placeholder="STATE" className="bg-black p-4 rounded-xl border border-white/5 outline-none" />
                                </div>
                                <textarea onChange={e=>setForm({...form, q:e.target.value})} placeholder="WHAT IS YOUR QUESTION?" className="w-full bg-black p-4 rounded-xl border border-white/5 h-24 outline-none"></textarea>
                                <button onClick={runOracle} className="w-full bg-orange-600 p-4 rounded-2xl font-black text-black text-xl hover:bg-white transition-all">DECODE FREQUENCY</button>
                            </div>
                            {result && (
                                <div className="glass p-10 rounded-[3rem] border-l-[20px] border-orange-600 space-y-6 animate-in slide-in-from-left">
                                    <h3 className="text-3xl font-black glow uppercase italic">The Prophecy</h3>
                                    <p className="text-xl leading-relaxed">{result.prophecy}</p>
                                    <p className="text-zinc-500 italic text-sm">{result.hausa}</p>
                                    <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
                                        {result.wafq.map((v,i)=><div key={i} className="wafq-cell text-xs">{v}</div>)}
                                    </div>
                                    <p className="text-center text-[8px] opacity-30 font-bold uppercase italic">Wafq Grid for Frequency {result.sum}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {view === 'archive' && (
                        <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
                            {blogs.map(b => (
                                <div key={b.id} className="glass rounded-[2rem] overflow-hidden hover:scale-105 transition-all">
                                    {b.img ? <img src={b.img} className="w-full h-40 object-cover" /> : <div className="w-full h-40 bg-zinc-900" />}
                                    <div className="p-6"><h3 className="glow font-black text-xs uppercase mb-2">{b.title}</h3><p className="text-zinc-500 text-[10px]">{b.content}</p></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {view === 'admin' && (
                        <div className="max-w-5xl mx-auto p-6 space-y-12">
                            {!isLogged ? (
                                <div className="glass p-10 rounded-[3rem] max-w-sm mx-auto space-y-4 shadow-2xl">
                                    <input id="u" placeholder="ADMIN USER" className="bg-black w-full p-4 rounded-xl border border-white/5" />
                                    <input id="p" type="password" placeholder="ADMIN PASS" className="bg-black w-full p-4 rounded-xl border border-white/5" />
                                    <button onClick={async ()=>{
                                        const r = await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:document.getElementById('u').value,pass:document.getElementById('p').value})});
                                        if(r.ok) setIsLogged(true); else alert("Access Denied");
                                    }} className="w-full bg-orange-600 p-4 rounded-xl font-black text-black">ENTER VAULT</button>
                                </div>
                            ) : (
                                <div className="space-y-10 pb-20">
                                    <div className="glass p-8 rounded-3xl space-y-4">
                                        <h3 className="text-orange-500 font-bold text-xs italic uppercase">Secret Codes Registry</h3>
                                        <div className="flex justify-between items-center bg-black p-4 rounded-xl italic text-2xl border-l-4 border-orange-600"><span>آهِيًّا شَرَاهِيًّا</span><span className="text-[8px] opacity-30 uppercase">Tayy al-Ard Protocol</span></div>
                                        <div className="flex justify-between items-center bg-black p-4 rounded-xl italic text-2xl border-l-4 border-orange-600"><span>يا تايسميال</span><span className="text-[8px] opacity-30 uppercase">927 Wealth Guardian</span></div>
                                    </div>
                                    <div className="glass p-8 rounded-3xl space-y-4">
                                        <h3 className="text-xs font-bold opacity-30 italic uppercase">Consultation History ({history.length})</h3>
                                        <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                                            {history.map(h => (
                                                <div key={h.id} className="flex justify-between items-center p-3 bg-black/40 rounded-xl text-[9px] border border-white/5">
                                                    <span>{h.date} | Q: {h.q} | From: {h.n}</span>
                                                    <button onClick={async ()=>{await fetch('/api/history/'+h.id,{method:'DELETE'}); load();}} className="text-red-500 font-bold hover:text-white transition-all">ERASE</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="glass p-8 rounded-3xl space-y-4">
                                         <h3 className="text-xs font-bold opacity-30 italic uppercase">New Archive Entry</h3>
                                         <input id="bt" placeholder="TITLE" className="bg-black w-full p-4 rounded-xl border border-white/5" />
                                         <textarea id="bc" placeholder="CONTENT" className="bg-black w-full p-4 rounded-xl border border-white/5 h-24"></textarea>
                                         <button onClick={async ()=>{
                                            const title = document.getElementById('bt').value;
                                            const content = document.getElementById('bc').value;
                                            if(title) await fetch('/api/blogs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,content})});
                                            load();
                                         }} className="w-full bg-white text-black p-4 rounded-xl font-bold uppercase text-[10px]">Publish to Archive</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        };
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("SOVEREIGN ARCHIVE v19.0 - G-HD01MF5SL9 ACTIVATED"));
