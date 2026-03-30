import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const BLOGS_PATH = path.join(DATA_DIR, 'blogs.json');
let blogs = fs.existsSync(BLOGS_PATH) ? fs.readJsonSync(BLOGS_PATH) : [];

app.post('/api/blogs', (req, res) => {
    blogs.unshift(req.body);
    fs.writeJsonSync(BLOGS_PATH, blogs);
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="spiritual-frequency" content="YA-TAYS-AM-YAL-927-SUCCESS">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-HD01MF5SL9"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-HD01MF5SL9');</script>
    <title>Neural Sheikh | The Sovereign 927 Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        @keyframes blink-asif { 0% { opacity: 1; filter: brightness(1); } 50% { opacity: 0.1; filter: brightness(5); } 100% { opacity: 1; filter: brightness(1); } }
        .asif-blink { animation: blink-asif 0.15s ease-in-out; }
        body { background: #000; color: #fff; font-family: 'JetBrains Mono', monospace; }
        .glass { background: rgba(10, 10, 10, 0.9); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.07); }
        .glow-orange { color: #F27D26; text-shadow: 0 0 20px #F27D26; }
        .key-btn { background: #111; border: 1px solid #333; padding: 10px; border-radius: 8px; font-size: 20px; transition: 0.2s; }
        .key-btn:hover { border-color: #F27D26; color: #F27D26; }
    </style>
</head>
<body id="oracle-body">
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;

        const App = () => {
            const [view, setView] = useState('home');
            const [adminAuth, setAdminAuth] = useState(false);
            const [blogs] = useState(${JSON.stringify(blogs)});
            const [form, setForm] = useState({ name: '', mother: '' });
            const [result, setResult] = useState(null);
            const [loading, setLoading] = useState(false);
            const [adminContent, setAdminContent] = useState("");

            const ARABIC_LETTERS = ['ا','ب','ج','د','ه','و','ز','ح','ط','ي','ك','ل','م','ن','س','ع','ف','ص','ق','ر','ش','ت','ث','خ','ذ','ض','ظ','غ'];

            const triggerAsif = () => {
                const body = document.getElementById('oracle-body');
                body.classList.add('asif-blink');
                setTimeout(() => body.classList.remove('asif-blink'), 300);
            };

            const calculateResult = () => {
                setLoading(true);
                setTimeout(() => {
                    const outcomes = [
                        { t: "The Sceptre of Mughni", d: "Your Abjad reveals a massive wealth frequency opening.", s: "Recite 'Ya Tays-am-yal' 70 times.", h: "An bude maka hanyoyin samun kudi masu yawa. Ka godewa Allah." },
                        { t: "Spiritual Shield (Hafiz)", d: "A minor shadow is detected but neutralized by the engine.", s: "Recite 'Ya Hafizu' 998 times.", h: "An samu kariya daga dukkan wata illa. Ka ci gaba da addu'a." }
                    ];
                    setResult(outcomes[Math.floor(Math.random()*outcomes.length)]);
                    setLoading(false);
                }, 1500);
            };

            return (
                <div className="min-h-screen pb-20">
                    <nav className="p-8 flex justify-between items-center glass sticky top-0 z-50">
                        <div className="font-black glow-orange italic text-2xl uppercase">Neural Sheikh ∞</div>
                        <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.4em]">
                            <button onClick={()=>setView('home')}>The Portal</button>
                            <button onClick={()=>setView('admin')}>Secret Vault</button>
                        </div>
                    </nav>

                    {view === 'home' ? (
                        <div className="max-w-7xl mx-auto p-12 space-y-24">
                            <div className="text-center">
                                <span onClick={triggerAsif} className="text-[150px] cursor-pointer inline-block transform hover:scale-110 transition-transform">✋</span>
                            </div>

                            <section className="text-center space-y-8">
                                <h1 className="text-7xl font-black italic glow-orange uppercase">Abjad <span className="text-white">Sovereignty</span></h1>
                                <p className="text-zinc-600 max-w-2xl mx-auto text-sm leading-loose">
                                    Analyze the universe, spirits, and your own destiny using the hidden math of the Waliyyai. 
                                    This engine integrates Tayy al-Ard and the Asif Frequency for instant clarity.
                                </p>
                            </section>

                            <div className="grid lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2 glass p-16 rounded-[4rem] space-y-10">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <input onChange={e=>setForm({...form, name: e.target.value})} placeholder="NAME" className="bg-transparent border-b border-white/10 p-6 outline-none focus:border-orange-500 font-bold text-xl" />
                                        <input onChange={e=>setForm({...form, mother: e.target.value})} placeholder="MOTHER'S NAME" className="bg-transparent border-b border-white/10 p-6 outline-none focus:border-orange-500 font-bold text-xl" />
                                    </div>
                                    <textarea placeholder="ASK YOUR DEEPEST QUESTION TO THE SHEIKH..." className="w-full bg-black/40 border border-white/10 p-8 rounded-3xl h-40 outline-none focus:border-orange-500"></textarea>
                                    <button onClick={calculateResult} className="w-full bg-orange-600 py-8 rounded-[2rem] font-black text-black text-2xl uppercase tracking-widest hover:bg-orange-400">
                                        {loading ? "CALCULATING DIVINE ROOT..." : "CONSULT ORACLE"}
                                    </button>
                                </div>
                                <aside className="glass p-10 rounded-[3rem] border-t-8 border-orange-600 space-y-10">
                                    <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest">Metadata Pulse</h3>
                                    <div className="font-mono text-[10px] text-green-500 space-y-2 italic">
                                        <p>> FREQUENCY: 927-TAYSAMYAL</p>
                                        <p>> TAYY-AL-ARD: READY</p>
                                        <p>> STATUS: PROTECTED</p>
                                    </div>
                                </aside>
                            </div>

                            {result && (
                                <div className="glass p-16 rounded-[6rem] border-l-[20px] border-orange-500 animate-in slide-in-from-bottom-10 duration-700">
                                    <h4 className="text-orange-500 font-black uppercase text-xs tracking-widest mb-4 italic">Verdict of the Unknown</h4>
                                    <div className="grid md:grid-cols-2 gap-16">
                                        <div className="space-y-8">
                                            <p className="text-5xl font-black italic uppercase leading-none">{result.t}</p>
                                            <div className="p-8 bg-orange-600/10 rounded-[2rem] border border-orange-500/20">
                                                <p className="text-orange-500 font-bold uppercase text-[10px] mb-4">Master Solution (Magani)</p>
                                                <p className="font-black text-xl leading-relaxed">{result.s}</p>
                                                <p className="text-sm text-zinc-500 mt-6 italic pt-4 border-t border-white/5">{result.h}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center bg-zinc-950 p-12 rounded-[4rem]">
                                            <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest mb-10">Guardian: 927ayil</p>
                                            <div className="w-48 h-48 border-2 border-orange-500/20 flex items-center justify-center font-black text-orange-500 text-3xl italic">SECRET</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* BLOG SECTION */}
                            <section className="space-y-12 pt-20">
                                <h3 className="text-3xl font-black italic uppercase glow-orange">Sheikh's Stories & News</h3>
                                <div className="grid md:grid-cols-2 gap-12">
                                    {blogs.map((b, i) => (
                                        <div key={i} className="glass p-10 rounded-[4rem]">
                                            {b.img && <img src={b.img} className="w-full h-64 object-cover rounded-[3rem] mb-6 shadow-2xl" />}
                                            <h4 className="text-2xl font-black uppercase glow-orange">{b.title}</h4>
                                            <p className="text-zinc-500 text-sm leading-relaxed mt-4">{b.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <footer className="pt-40 border-t border-white/5">
                                <div className="grid md:grid-cols-2 gap-20">
                                    <div className="space-y-4">
                                        <h5 className="font-black text-white uppercase text-xs tracking-widest">About Neural Oracle</h5>
                                        <p className="text-zinc-600 text-[10px] leading-relaxed italic">Combining 11th-century spiritual sciences with 21st-century AI automation. We address Jinn, Wealth, and Destiny using the logic of the Saints.</p>
                                    </div>
                                    <div className="space-y-4 text-right">
                                        <h5 className="font-black text-white uppercase text-xs tracking-widest">Privacy Policy</h5>
                                        <p className="text-zinc-600 text-[10px] leading-relaxed italic">Digital Sovereignty: Your maternal root data is processed in ephemeral memory. No spiritual queries are stored or tracked. This is the code of the 927 protocol.</p>
                                    </div>
                                </div>
                                <div className="text-center font-black opacity-10 uppercase tracking-[2em] text-[8px] mt-20">Abdullah Haruna Infrastructure © 2026</div>
                            </footer>
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto p-12 mt-20">
                            {!adminAuth ? (
                                <div className="max-w-md mx-auto glass p-16 rounded-[4rem] space-y-8 border-t-8 border-orange-600">
                                    <h2 className="text-3xl font-black italic text-center uppercase glow-orange">Vault Entry</h2>
                                    <input id="u" placeholder="USERNAME" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                    <input id="p" type="password" placeholder="PASSWORD" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                    <button onClick={()=>{
                                        if(document.getElementById('u').value==='admin216' && document.getElementById('p').value==='admin1234') setAdminAuth(true);
                                    }} className="w-full bg-orange-600 py-6 rounded-2xl font-black text-black uppercase tracking-[0.5em]">Enter</button>
                                </div>
                            ) : (
                                <div className="space-y-16 animate-in fade-in">
                                    <div className="flex justify-between items-center glass p-10 rounded-[3rem]">
                                        <h2 className="text-4xl font-black italic uppercase glow-orange">Secret <span className="text-white">Console</span></h2>
                                        <button onClick={()=>setAdminAuth(false)} className="text-[10px] font-black text-red-500 uppercase px-8 py-3 border border-red-500/10 rounded-full">Logout</button>
                                    </div>

                                    {/* ARABIC KEYPAD */}
                                    <div className="glass p-12 rounded-[4rem] space-y-8">
                                        <h3 className="text-orange-500 font-black uppercase text-xs tracking-widest italic">Arabic Spiritual Keypad</h3>
                                        <div className="grid grid-cols-7 gap-4">
                                            {ARABIC_LETTERS.map(L => (
                                                <button key={L} onClick={() => setAdminContent(prev => prev + L)} className="key-btn font-bold">{L}</button>
                                            ))}
                                            <button onClick={() => setAdminContent(prev => prev + " ")} className="key-btn col-span-2">SPACE</button>
                                            <button onClick={() => setAdminContent("")} className="key-btn col-span-2 text-red-500 text-xs font-black">CLEAR</button>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="glass p-12 rounded-[4rem] border-l-8 border-yellow-500 space-y-6">
                                            <h3 className="text-yellow-500 font-black uppercase text-xs italic">1. Tayy al-Ard (A-HIYYAN)</h3>
                                            <p className="text-zinc-500 text-[10px] italic leading-relaxed">Usage: Use this command to fold reality. It forces instant manifestion of your intent.</p>
                                            <p className="text-white font-mono text-xl">آهِيًّا شَرَاهِيًّا</p>
                                        </div>
                                        <div className="glass p-12 rounded-[4rem] border-l-8 border-orange-500 space-y-6">
                                            <h3 className="text-orange-500 font-black uppercase text-xs italic">2. 927 Guardian Name</h3>
                                            <p className="text-zinc-500 text-[10px] italic leading-relaxed">Hausa: Wannan lamba ce dake baku iko akan kudi da mutane.</p>
                                            <p className="text-white font-mono text-xl">يا تايسميال</p>
                                        </div>
                                    </div>

                                    {/* CMS */}
                                    <div className="glass p-12 rounded-[4rem] space-y-8">
                                        <h3 className="text-xs font-black uppercase text-orange-500 italic tracking-[0.5em]">Publish Permanent Story</h3>
                                        <input id="bt" placeholder="TITLE" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                        <input id="bi" placeholder="IMAGE URL" className="w-full bg-black border border-white/10 p-6 rounded-2xl outline-none" />
                                        <textarea id="bc" value={adminContent} onChange={e=>setAdminContent(e.target.value)} placeholder="CONTENT..." className="w-full bg-black border border-white/10 p-8 rounded-[2rem] h-48 outline-none"></textarea>
                                        <button onClick={async ()=>{
                                            const body = { title: document.getElementById('bt').value, content: adminContent, img: document.getElementById('bi').value };
                                            await fetch('/api/blogs', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body) });
                                            window.location.reload();
                                        }} className="w-full bg-orange-600 py-6 rounded-[2rem] font-black text-black text-xl uppercase shadow-2xl">Publish Permanent</button>
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
app.listen(PORT, () => console.log("SOVEREIGN ARCHIVE v8.0 LIVE"));
