import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// --- SYSTEM STORAGE ---
const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const BLOGS_PATH = path.join(DATA_DIR, 'blogs.json');
const AUTH_PATH = path.join(DATA_DIR, 'admin_config.json');

// Initialize Files
if (!fs.existsSync(AUTH_PATH)) fs.writeJsonSync(AUTH_PATH, { u: 'admin216', p: 'admin1234' });
if (!fs.existsSync(BLOGS_PATH)) fs.writeJsonSync(BLOGS_PATH, [
    { title: "The Frequency of 927", content: "Guardian flow and digital command.", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800" },
    { title: "Tayy al-Ard", content: "The science of folding space.", img: "https://images.unsplash.com/photo-1462331940025-496df975841e?w=800" }
]);

// --- API BACKEND ---

// 1. Unified Data Fetch
app.get('/api/init', (req, res) => {
    const blogs = fs.readJsonSync(BLOGS_PATH);
    res.json({ blogs });
});

// 2. Real Login
app.post('/api/login', (req, res) => {
    const { user, pass } = req.body;
    const auth = fs.readJsonSync(AUTH_PATH);
    if (user === auth.u && pass === auth.p) res.json({ success: true });
    else res.status(401).json({ success: false });
});

// 3. Update Admin Credentials
app.post('/api/update-auth', (req, res) => {
    const { newU, newP } = req.body;
    fs.writeJsonSync(AUTH_PATH, { u: newU, p: newP });
    res.json({ success: true });
});

// 4. Post Blog
app.post('/api/blogs', (req, res) => {
    const blogs = fs.readJsonSync(BLOGS_PATH);
    blogs.unshift(req.body);
    fs.writeJsonSync(BLOGS_PATH, blogs);
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural Sheikh | Sovereign Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { background: #000; color: #fff; font-family: 'JetBrains Mono', monospace; overflow-x: hidden; }
        .glass { background: rgba(10, 10, 10, 0.8); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05); }
        .glow-orange { color: #F27D26; text-shadow: 0 0 30px rgba(242, 125, 38, 0.6); }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .scanning { animation: pulse 1.5s infinite; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;

        // REAL ABJAD VALUES
        const abjadMap = {
            'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000
        };

        const App = () => {
            const [view, setView] = useState('home');
            const [blogs, setBlogs] = useState([]);
            const [isLogged, setIsLogged] = useState(false);
            const [loading, setLoading] = useState(false);
            const [result, setResult] = useState(null);
            const [form, setForm] = useState({ name: '', mother: '' });
            const [newCreds, setNewCreds] = useState({ u: '', p: '' });

            useEffect(() => {
                fetch('/api/init').then(res => res.json()).then(data => setBlogs(data.blogs));
            }, []);

            const calculateOracle = () => {
                setLoading(true);
                setTimeout(() => {
                    let total = 0;
                    const fullText = (form.name + form.mother).split('');
                    fullText.forEach(char => { if(abjadMap[char]) total += abjadMap[char]; });
                    
                    if (total % 2 === 0) {
                        setResult({
                            title: "Fathul Mubeen (Calculated)",
                            desc: "Your Abjad Sum is " + total + ". The 927 frequency is aligned.",
                            solution: "Recite 'Ya Taysamyal' 927 times for 3 nights.",
                            hausa: "An samu nasara. Adadin lissafin sunayenku ya dace."
                        });
                    } else {
                        setResult({
                            title: "Hafiz Protection (Calculated)",
                            desc: "Abjad Sum: " + total + ". High spiritual interference detected.",
                            solution: "Recite 'Ya Hafizu' 998 times and use Al-Ghazali Wafq.",
                            hausa: "Kariya tana da mahimmanci. Akwai cikas a lissafin sunayenku."
                        });
                    }
                    setLoading(false);
                }, 2000);
            };

            const handleLogin = async () => {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ user: document.getElementById('u').value, pass: document.getElementById('p').value })
                });
                if(res.ok) setIsLogged(true); else alert("Invalid Credentials");
            };

            const saveSecurity = async () => {
                await fetch('/api/update-auth', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ newU: newCreds.u, newP: newCreds.p })
                });
                alert("Credentials updated on server. Please relog.");
                setIsLogged(false);
            };

            return (
                <div className="min-h-screen">
                    <nav className="p-8 flex justify-between items-center glass sticky top-0 z-50">
                        <div className="font-black glow-orange italic text-2xl uppercase">Sovereign Portal</div>
                        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
                            <button onClick={()=>setView('home')}>Main</button>
                            <button onClick={()=>setView('admin')}>Admin</button>
                        </div>
                    </nav>

                    {view === 'home' ? (
                        <div className="max-w-6xl mx-auto p-10 space-y-20">
                            <div className="text-center py-20">
                                <h1 className="text-7xl font-black glow-orange mb-4">NEURAL SHEIKH</h1>
                                <p className="text-zinc-500 italic">Authentic Abjad Spiritual Diagnostics</p>
                            </div>

                            <div className="glass p-12 rounded-[3rem] border-t-8 border-orange-600 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <input onChange={e=>setForm({...form, name: e.target.value})} placeholder="ARABIC NAME (Subject)" className="bg-black border border-white/10 p-6 rounded-2xl outline-none focus:border-orange-500" />
                                    <input onChange={e=>setForm({...form, mother: e.target.value})} placeholder="ARABIC NAME (Mother)" className="bg-black border border-white/10 p-6 rounded-2xl outline-none focus:border-orange-500" />
                                </div>
                                <button onClick={calculateOracle} className="w-full bg-orange-600 p-8 rounded-3xl font-black text-black text-xl uppercase tracking-widest">
                                    {loading ? <span className="scanning">Calculations in Progress...</span> : "Run Spiritual Scan"}
                                </button>
                            </div>

                            {result && (
                                <div className="glass p-12 rounded-[3rem] border-l-[15px] border-orange-600 animate-pulse">
                                    <h2 className="text-4xl font-black uppercase mb-4">{result.title}</h2>
                                    <p className="text-zinc-400 mb-6">{result.desc}</p>
                                    <div className="bg-orange-600/10 p-8 rounded-2xl border border-orange-500/20">
                                        <p className="font-black text-xl text-orange-500">{result.solution}</p>
                                        <p className="text-xs italic mt-4 opacity-50">{result.hausa}</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid md:grid-cols-3 gap-8">
                                {blogs.map((b, i) => (
                                    <div key={i} className="glass p-8 rounded-3xl space-y-4">
                                        {b.img && <img src={b.img} className="rounded-xl h-48 w-full object-cover" />}
                                        <h3 className="glow-orange font-black uppercase">{b.title}</h3>
                                        <p className="text-zinc-500 text-sm leading-relaxed">{b.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto p-10 py-20">
                            {!isLogged ? (
                                <div className="glass p-12 rounded-[4rem] space-y-8 max-w-md mx-auto border-t-8 border-orange-600">
                                    <h2 className="text-2xl font-black text-center glow-orange uppercase">Admin Entry</h2>
                                    <input id="u" placeholder="USERNAME" className="w-full bg-black p-5 rounded-xl border border-white/10" />
                                    <input id="p" type="password" placeholder="PASSWORD" className="w-full bg-black p-5 rounded-xl border border-white/10" />
                                    <button onClick={handleLogin} className="w-full bg-orange-600 p-5 rounded-xl font-black text-black">LOGIN</button>
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    <div className="glass p-10 rounded-3xl border-l-8 border-red-600 space-y-6">
                                        <h3 className="text-red-500 font-black uppercase text-xs">Security Dashboard</h3>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <input onChange={e=>setNewCreds({...newCreds, u: e.target.value})} placeholder="NEW USER" className="bg-black p-4 rounded-xl border border-white/10" />
                                            <input type="password" onChange={e=>setNewCreds({...newCreds, p: e.target.value})} placeholder="NEW PASS" className="bg-black p-4 rounded-xl border border-white/10" />
                                        </div>
                                        <button onClick={saveSecurity} className="w-full bg-white text-black p-4 rounded-xl font-bold uppercase text-xs">Save Permanent Credentials</button>
                                    </div>

                                    <div className="glass p-10 rounded-3xl space-y-8">
                                        <h3 className="glow-orange font-black uppercase text-xs">Knowledge Archive</h3>
                                        <input id="bt" placeholder="STORY TITLE" className="w-full bg-black p-5 rounded-xl border border-white/10" />
                                        <textarea id="bc" placeholder="CONTENT" className="w-full bg-black p-5 rounded-xl border border-white/10 h-40"></textarea>
                                        <button onClick={async ()=>{
                                            const b = { title: document.getElementById('bt').value, content: document.getElementById('bc').value, img: '' };
                                            await fetch('/api/blogs', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(b) });
                                            window.location.reload();
                                        }} className="w-full bg-orange-600 p-6 rounded-xl font-black text-black">PUBLISH TO PORTAL</button>
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
app.listen(PORT, () => console.log("SYSTEM 11.0 FULLY OPERATIONAL"));
