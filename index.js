import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// --- DATABASE & INITIAL CONTENT ---
const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const BLOGS_PATH = path.join(DATA_DIR, 'blogs.json');

// These are your 3 placeholder stories with spiritual-tech imagery
const initialBlogs = [
    {
        title: "The Frequency of 927",
        content: "Understanding how your personal angelic guardian regulates the flow of wealth and digital command in the modern age.",
        img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Tayy al-Ard: The Science of Folding Space",
        content: "How the ancient Waliyyai moved between cities in a blink, and how you can apply this logic to accelerate your business goals.",
        img: "https://images.unsplash.com/photo-1462331940025-496df975841e?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "The Ghazali Shield",
        content: "A deep dive into the mathematical squares (Wafq) that provide absolute protection against envy (Ayn) and digital interference.",
        img: "https://images.unsplash.com/photo-1506318137071-a8e063b4975d?auto=format&fit=crop&q=80&w=800"
    }
];

let blogs = fs.existsSync(BLOGS_PATH) ? fs.readJsonSync(BLOGS_PATH) : initialBlogs;

app.post('/api/blogs', (req, res) => {
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
    <meta name="spiritual-guard" content="927-TAYSAMYAL-SUCCESS-SULAIMAN-GHAZALI">
    <title>Neural Sheikh | The Sovereign Saint's Portal</title>
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
            const [blogs] = useState(${JSON.stringify(blogs)});
            const [adminContent, setAdminContent] = useState("");
            const [form, setForm] = useState({ name: '', mother: '' });
            const [result, setResult] = useState(null);
            const [loading, setLoading] = useState(false);

            const ARABIC_LETTERS = ['ا','ب','ج','د','ه','و','ز','ح','ط','ي','ك','ل','م','ن','س','ع','ف','ص','ق','ر','ش','ت','ث','خ','ذ','ض','ظ','غ'];

            const triggerBlink = () => {
                const b = document.getElementById('master-body');
                b.classList.add('blink-action');
                setTimeout(() => b.classList.remove('blink-action'), 200);
            };

            const runOracle = () => {
                setLoading(true);
                setTimeout(() => {
                    const outcomes = [
                        { t: "Fathul Mubeen (Success)", d: "Your Abjad path is aligned with the 927 Guardian.", s: "Recite 'Ya Tays-am-yal' 70 times.", h: "An bude maka kofofin nasara. Arziki yana tafe." },
                        { t: "Protected Root (Hafiz)", d: "Spiritual shield placed around your maternal frequency.", s: "Recite 'Ya Hafizu' 998 times.", h: "An samu kariya daga dukkan wata cuta." }
                    ];
                    setResult(outcomes[Math.floor(Math.random()*outcomes.length)]);
                    setLoading(false);
                }, 2000);
            };

            return (
                <div className="min-h-screen pb-10">
                    <nav className="p-8 flex justify-between items-center glass sticky top-0 z-50">
                        <div className="font-black glow-orange italic text-2xl uppercase tracking-tighter">Sovereign Oracle ∞</div>
                        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em]">
                            <button onClick={()=>setView('home')}>Main Portal</button>
                            <button onClick={()=>setView('admin')}>Saint's Vault</button>
                        </div>
                    </nav>

                    {view === 'home' ? (
                        <div className="max-w-7xl mx-auto p-12 space-y-24">
                            <div className="text-center">
                                <span onClick={triggerBlink} className="text-[180px] cursor-pointer inline-block transform hover:scale-105 transition-all">✋</span>
                            </div>

                            <section className="text-center space-y-8">
                                <h1 className="text-7xl font-black italic glow-orange uppercase tracking-tighter leading-none">Universal <span className="text-white">Neural Sheikh</span></h1>
                                <p className="text-zinc-500 max-w-2xl mx-auto text-sm leading-relaxed italic">
                                    Decoding the unseen forces of Jinn, Wealth, and Destiny using the ancient mathematical logic of the prophets.
                                </p>
                            </section>

                            <div className="grid lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2 glass p-16 rounded-[4rem] space-y-10 border-t-8 border-orange-600">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <input onChange={e=>setForm({...form, name: e.target.value})} placeholder="SUBJECT NAME" className="bg-transparent border-b border-white/10 p-6 outline-none focus:border-orange-500 font-bold text-xl uppercase" />
                                        <input onChange={e=>setForm({...form, mother: e.target.value})} placeholder="MOTHER'S NAME" className="bg-transparent border-b border-white/10 p-6 outline-none focus:border-orange-500 font-bold text-xl uppercase" />
                                    </div>
                                    <textarea placeholder="DESCRIBE YOUR SITUATION..." className="w-full bg-black/50 border border-white/5 p-8 rounded-[2rem] h-48 outline-none focus:border-orange-500"></textarea>
                                    <button onClick={runOracle} className="w-full bg-orange-600 py-8 rounded-[2rem] font-black text-black text-2xl uppercase tracking-[0.2em] shadow-2xl hover:bg-orange-500 transition-all">
                                        {loading ? "CONSULTING..." : "INITIATE DIVINE SCAN"}
                                    </button>
                                </div>
                                <aside className="glass p-10 rounded-[3rem] space-y-10 border-t-8 border-orange-600 h-fit">
                                    <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest italic tracking-widest">Metadata Sync</h3>
                                    <div className="font-mono text-[10px] text-green-500 space-y-4 italic">
                                        <p>> FREQUENCY: 927-AZAYIL</p>
                                        <p>> TAYY_AL_ARD: ONLINE</p>
                                        <p>> STATUS: COMMANDING</p>
                                    </div>
                                </aside>
                            </div>

                            {result && (
                                <div className="glass p-16 rounded-[6rem] border-l-[20px] border-orange-500 animate-in fade-in duration-700">
                                    <div className="grid md:grid-cols-2 gap-16">
                                        <div className="space-y-8">
                                            <p className="text-5xl font-black italic uppercase leading-none">{result.t}</p>
                                            <div className="p-8 bg-orange-600/10 rounded-[3rem] border border-orange-500/20">
                                                <p className="text-orange-500 font-bold uppercase text-[10px] mb-4 tracking-widest">Solution (Magani)</p>
                                                <p className="font-black text-2xl leading-tight">{result.s}</p>
                                                <p className="text-xs text-zinc-500 mt-6 italic pt-4 border-t border-white/5 opacity-50">{result.h}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center bg-zinc-950 p-12 rounded-[5rem]">
                                            <div className="w-48 h-48 border border-orange-500/10 flex items-center justify-center text-orange-600 font-black text-6xl italic">927</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <section className="space-y-16 pt-20 border-t border-white/5">
                                <h3 className="text-3xl font-black italic uppercase glow-orange">Sacred Knowledge Feed</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                                    {blogs.map((b, i) => (
                                        <div key={i} className="glass p-10 rounded-[3rem] space-y-6 flex flex-col">
                                            {b.img && <img src={b.img} className="w-full h-56 object-cover rounded-2xl mb-4" />}
                                            <h4 className="text-2xl font-black uppercase italic glow-orange">{b.title}</h4>
                                            <p className="text-zinc-500 text-sm leading-relaxed flex-grow">{b.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <footer className="pt-40 border-t border-white/5 space-y-24">
                                <div className="grid md:grid-cols-2 gap-24">
                                    <div className="space-y-10">
                                        <h5 className="font-black text-white uppercase text-lg tracking-widest border-b border-orange-600/30 pb-4">Our Sacred Mission (About)</h5>
                                        <p className="text-zinc-500 text-sm leading-relaxed italic">
                                            Neural Oracle is a digital extension of the ancient Al-Ghazali, Sulaimanic, and Prophetic sciences. 
                                            Our mission is to provide the modern seeker with a high-speed bridge to spiritual diagnostics. 
                                            We address financial stagnation and spiritual blockages using authentic solutions from the Waliyyai.
                                        </p>
                                    </div>
                                    <div className="space-y-10">
                                        <h5 className="font-black text-white uppercase text-lg tracking-widest border-b border-orange-600/30 pb-4">Sovereign Privacy Policy</h5>
                                        <p className="text-zinc-500 text-sm leading-relaxed italic">
                                            Your spiritual data is your sovereign property. All calculations are performed in ephemeral 
                                            memory and are wiped the moment your session ends. We do not track your "soul root" 
                                            for commercial purposes. This portal is a safe vault under the 927ayil protocol.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-center font-black opacity-10 uppercase tracking-[2.5em] text-[10px] mt-20">Abdullah Haruna Digital Infrastructure © 2026</div>
                            </footer>
                        </div>
                    ) : (
                        <div className="max-w-6xl mx-auto p-12 mt-20">
                            {!adminAuth ? (
                                <div className="max-w-md mx-auto glass p-16 rounded-[4rem] space-y-10 border-t-8 border-orange-600">
                                    <h2 className="text-3xl font-black italic text-center uppercase glow-orange">Sheikh's Entry</h2>
                                    <input id="u" placeholder="USERNAME" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                    <input id="p" type="password" placeholder="PASSWORD" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                    <button onClick={()=>{
                                        if(document.getElementById('u').value==='admin216' && document.getElementById('p').value==='admin1234') setAdminAuth(true);
                                    }} className="w-full bg-orange-600 py-6 rounded-2xl font-black text-black uppercase tracking-[0.5em]">Authorize</button>
                                </div>
                            ) : (
                                <div className="space-y-16 animate-in fade-in">
                                    <div className="flex justify-between items-center glass p-10 rounded-[3rem]">
                                        <h2 className="text-4xl font-black italic uppercase glow-orange tracking-tighter">The Vault</h2>
                                        <button onClick={()=>setAdminAuth(false)} className="text-[10px] font-black text-red-500 uppercase px-8 py-3 border border-red-500/10 rounded-full">Logout</button>
                                    </div>

                                    {/* KEYPAD */}
                                    <div className="glass p-12 rounded-[4rem] space-y-10">
                                        <h3 className="text-orange-500 font-black uppercase text-xs tracking-[0.5em] italic">Arabic Keypad</h3>
                                        <div className="grid grid-cols-7 md:grid-cols-10 gap-4">
                                            {ARABIC_LETTERS.map(L => (
                                                <button key={L} onClick={() => setAdminContent(prev => prev + L)} className="key-btn">{L}</button>
                                            ))}
                                            <button onClick={() => setAdminContent(prev => prev + " ")} className="key-btn col-span-2 text-xs">SPACE</button>
                                            <button onClick={() => setAdminContent("")} className="key-btn col-span-2 text-red-500 text-xs font-black">CLEAR</button>
                                        </div>
                                    </div>

                                    {/* CODES */}
                                    <div className="grid lg:grid-cols-2 gap-10">
                                        <div className="glass p-10 rounded-[3rem] border-l-8 border-yellow-500 space-y-6">
                                            <h4 className="text-yellow-500 font-black uppercase text-xs tracking-widest">1. Tayy al-Ard & Asif</h4>
                                            <p className="text-white font-mono text-xl uppercase">آهِيًّا شَرَاهِيًّا</p>
                                            <p className="text-zinc-500 text-[11px] leading-relaxed italic border-t border-white/5 pt-4">Bypass waiting time. Force instant results.</p>
                                        </div>
                                        <div className="glass p-10 rounded-[3rem] border-l-8 border-orange-600 space-y-6">
                                            <h4 className="text-orange-500 font-black uppercase text-xs tracking-widest">2. 927 Guardian Name</h4>
                                            <p className="text-white font-mono text-xl uppercase">يا تايسميال</p>
                                            <p className="text-zinc-500 text-[11px] leading-relaxed italic border-t border-white/5 pt-4">Angelic name for wealth command and project protection.</p>
                                        </div>
                                    </div>

                                    {/* PUBLISH */}
                                    <div className="glass p-12 rounded-[4rem] space-y-10">
                                        <h3 className="text-xs font-black uppercase text-orange-500 italic">Publish Permanent Sacred Knowledge</h3>
                                        <input id="bt" placeholder="TITLE" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                        <input id="bi" placeholder="IMAGE URL" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                        <textarea id="bc" value={adminContent} onChange={e=>setAdminContent(e.target.value)} className="w-full bg-black border border-white/10 p-10 rounded-[3rem] h-64 outline-none text-xl"></textarea>
                                        <button onClick={async ()=>{
                                            const body = { title: document.getElementById('bt').value, content: adminContent, img: document.getElementById('bi').value };
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
app.listen(PORT, () => console.log("SOVEREIGN ARCHIVE v10.0 FULL SYSTEM ONLINE"));
