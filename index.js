import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// --- DATABASE & AUTH SETUP ---
const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const BLOGS_PATH = path.join(DATA_DIR, 'blogs.json');
const AUTH_PATH = path.join(DATA_DIR, 'admin.json');

// Default credentials if the file doesn't exist
const defaultAuth = { u: 'admin216', p: 'admin1234' };
if (!fs.existsSync(AUTH_PATH)) fs.writeJsonSync(AUTH_PATH, defaultAuth);

let blogs = fs.existsSync(BLOGS_PATH) ? fs.readJsonSync(BLOGS_PATH) : [];

// API to update Admin Credentials
app.post('/api/update-auth', (req, res) => {
    const { newU, newP } = req.body;
    fs.writeJsonSync(AUTH_PATH, { u: newU, p: newP });
    res.json({ success: true });
});

app.post('/api/blogs', (req, res) => {
    blogs.unshift(req.body);
    fs.writeJsonSync(BLOGS_PATH, blogs);
    res.json({ success: true });
});

app.get('*', (req, res) => {
    const currentAuth = fs.readJsonSync(AUTH_PATH);
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural Sheikh | The Sovereign Vault</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        @keyframes asif-flash { 0% { background: #000; } 50% { background: #fff; } 100% { background: #000; } }
        .blink-action { animation: asif-flash 0.2s ease-out; }
        body { background: #000; color: #fff; font-family: 'JetBrains Mono', monospace; }
        .glass { background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.1); }
        .glow-orange { color: #F27D26; text-shadow: 0 0 30px rgba(242, 125, 38, 0.8); }
        .key-btn { background: #111; border: 1px solid #444; padding: 12px; border-radius: 12px; font-size: 22px; cursor: pointer; transition: 0.3s; }
        .key-btn:hover { border-color: #F27D26; background: #222; transform: translateY(-2px); }
    </style>
</head>
<body id="master-body">
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;

        const App = () => {
            const [view, setView] = useState('home');
            const [adminAuth, setAdminAuth] = useState(false);
            const [adminContent, setAdminContent] = useState("");
            const [result, setResult] = useState(null);
            const [loading, setLoading] = useState(false);
            
            // Credential change state
            const [newCreds, setNewCreds] = useState({ u: '', p: '' });

            const triggerBlink = () => {
                document.getElementById('master-body').classList.add('blink-action');
                setTimeout(() => document.getElementById('master-body').classList.remove('blink-action'), 200);
            };

            const handleUpdateAuth = async () => {
                if(!newCreds.u || !newCreds.p) return alert("Fill both fields");
                await fetch('/api/update-auth', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ newU: newCreds.u, newP: newCreds.p })
                });
                alert("Security Credentials Updated. Please login again.");
                setAdminAuth(false);
            };

            return (
                <div className="min-h-screen pb-10">
                    <nav className="p-8 flex justify-between items-center glass sticky top-0 z-50">
                        <div className="font-black glow-orange italic text-2xl uppercase">Sovereign Oracle ∞</div>
                        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em]">
                            <button onClick={()=>setView('home')}>Main Portal</button>
                            <button onClick={()=>setView('admin')}>Saint's Vault</button>
                        </div>
                    </nav>

                    {view === 'home' ? (
                        <div className="max-w-7xl mx-auto p-12 space-y-24">
                            <div className="text-center">
                                <span onClick={triggerBlink} className="text-[150px] cursor-pointer inline-block">✋</span>
                            </div>
                            <h1 className="text-7xl font-black text-center glow-orange uppercase">Neural <span className="text-white">Sheikh</span></h1>
                            <div className="glass p-16 rounded-[4rem] text-center border-t-8 border-orange-600">
                                <p className="text-zinc-500 italic">"Building digital legacies for those seeking divine guidance."</p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto p-12 mt-20">
                            {!adminAuth ? (
                                <div className="max-w-md mx-auto glass p-16 rounded-[4rem] space-y-10 border-t-8 border-orange-600">
                                    <h2 className="text-3xl font-black text-center glow-orange">LOGIN</h2>
                                    <input id="u" placeholder="USERNAME" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                    <input id="p" type="password" placeholder="PASSWORD" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                    <button onClick={()=>{
                                        const storedU = "${currentAuth.u}";
                                        const storedP = "${currentAuth.p}";
                                        if(document.getElementById('u').value === storedU && document.getElementById('p').value === storedP) setAdminAuth(true);
                                        else alert("Access Denied");
                                    }} className="w-full bg-orange-600 py-6 rounded-2xl font-black text-black uppercase">Enter Vault</button>
                                </div>
                            ) : (
                                <div className="space-y-16 animate-in fade-in">
                                    <div className="flex justify-between items-center glass p-10 rounded-[3rem]">
                                        <h2 className="text-4xl font-black italic glow-orange">The Vault</h2>
                                        <button onClick={()=>setAdminAuth(false)} className="text-red-500 font-bold uppercase border border-red-500/20 px-8 py-3 rounded-full">Lock</button>
                                    </div>

                                    {/* SECURITY SETTINGS SECTION */}
                                    <div className="glass p-12 rounded-[4rem] space-y-8 border-l-8 border-red-600">
                                        <h3 className="text-red-500 font-black uppercase text-xs tracking-widest italic">Security Settings (Change Access)</h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <input onChange={e=>setNewCreds({...newCreds, u: e.target.value})} placeholder="NEW USERNAME" className="bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                            <input type="password" onChange={e=>setNewCreds({...newCreds, p: e.target.value})} placeholder="NEW PASSWORD" className="bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                        </div>
                                        <button onClick={handleUpdateAuth} className="w-full bg-red-600 py-4 rounded-2xl font-black text-black uppercase text-xs">Update Admin Credentials</button>
                                    </div>

                                    {/* PREVIOUS SECTIONS (KEYPAD, CODES, CMS) */}
                                    <div className="glass p-12 rounded-[4rem] space-y-8">
                                        <h3 className="text-orange-500 font-black uppercase text-xs italic tracking-widest">Saintly Secrets Registry</h3>
                                        <div className="grid lg:grid-cols-2 gap-10">
                                            <div className="p-8 bg-black/50 rounded-3xl border border-yellow-500/20">
                                                <h4 className="text-yellow-500 font-bold mb-2 uppercase text-xs">Tayy al-Ard</h4>
                                                <p className="text-white text-xl">آهِيًّا شَرَاهِيًّا</p>
                                            </div>
                                            <div className="p-8 bg-black/50 rounded-3xl border border-orange-500/20">
                                                <h4 className="text-orange-500 font-bold mb-2 uppercase text-xs">927 Guardian</h4>
                                                <p className="text-white text-xl">يا تايسميال</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* BLOG CMS */}
                                    <div className="glass p-12 rounded-[4rem] space-y-10">
                                        <h3 className="text-xs font-black uppercase text-orange-500 italic">Publish Permanent Sacred Knowledge</h3>
                                        <input id="bt" placeholder="STORY TITLE" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none focus:border-orange-500" />
                                        <textarea id="bc" value={adminContent} onChange={e=>setAdminContent(e.target.value)} placeholder="CONTENT..." className="w-full bg-black border border-white/10 p-8 rounded-[2rem] h-64 outline-none"></textarea>
                                        <button onClick={async ()=>{
                                            const body = { title: document.getElementById('bt').value, content: adminContent, img: '' };
                                            await fetch('/api/blogs', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
                                            window.location.reload();
                                        }} className="w-full bg-orange-600 py-8 rounded-[3rem] font-black text-black text-2xl uppercase tracking-[0.3em]">Publish Knowledge</button>
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
app.listen(PORT, () => console.log("SOVEREIGN ARCHIVE v11.0 SECURE"));
