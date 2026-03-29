import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const ABJAD_MAP = {
    'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
    'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
    'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
    'a':1,'b':2,'j':3,'d':4,'h':5,'w':6,'z':7,'x':8,'t':9,'y':10,'k':20,'l':30,'m':40,'n':50,'s':60,'o':70,'f':80,'p':90,'q':100,'r':200,'c':400,'u':6,'v':6,'e':5,'i':10,'g':3
};

app.get('*', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-HD01MF5SL9"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-HD01MF5SL9');
    </script>
    <title>Neural Engine | Supreme Oracle</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;800&display=swap" rel="stylesheet">
    <style>
        @keyframes pulse-glow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
        body { background: #000; color: #fff; font-family: 'JetBrains Mono', monospace; margin: 0; }
        .glow-orange { color: #F27D26; text-shadow: 0 0 20px rgba(242, 125, 38, 0.5); }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.08); }
        .animated-logo { animation: pulse-glow 3s infinite ease-in-out; color: #F27D26; }
        .hatimi-cell { background: #000; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(242, 125, 38, 0.3); font-weight: 800; color: #F27D26; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;

        const App = () => {
            const [view, setView] = useState('home');
            const [name, setName] = useState('');
            const [mother, setMother] = useState('');
            const [out, setOut] = useState(null);

            const calculate = () => {
                const map = ${JSON.stringify(ABJAD_MAP)};
                const total = (name + mother).toLowerCase().split('').reduce((a, c) => a + (map[c] || 0), 0);
                const muwakkil = "Ya " + (total + 51) + "ayil";
                const b = Math.floor((total - 12) / 3);
                const wafq = [b+8, b+1, b+6, b+3, b+5, b+7, b+4, b+9, b+2];
                setOut({ total, muwakkil, wafq });
            };

            return (
                <div className="min-h-screen flex flex-col md:flex-row">
                    {/* SIDE NAVIGATION */}
                    <nav className="w-full md:w-20 bg-zinc-950 border-r border-white/10 flex md:flex-col items-center py-6 justify-around md:justify-start gap-10">
                        <div className="animated-logo text-2xl font-black">◈</div>
                        <button onClick={() => setView('home')} className="opacity-60 hover:opacity-100 uppercase text-[10px] font-bold">Oracle</button>
                        <button onClick={() => setView('admin')} className="opacity-60 hover:opacity-100 uppercase text-[10px] font-bold">Admin</button>
                    </nav>

                    {/* MAIN CONTENT */}
                    <main className="flex-1 p-6 md:p-16">
                        {view === 'home' ? (
                            <div className="max-w-4xl mx-auto space-y-12">
                                <header className="space-y-4">
                                    <h1 className="text-5xl font-black italic glow-orange uppercase tracking-tighter">Neural Engine <span className="text-white">v4.1</span></h1>
                                    <p className="text-zinc-500 text-sm max-w-xl leading-relaxed">
                                        Agentic AI Sovereign System. Integrating Ghazali mathematical grids and Abjad frequencies. 
                                        Input subject name and maternal root to activate the Guardian Muwakkil.
                                    </p>
                                </header>

                                <div className="glass p-10 rounded-[2rem] space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <input value={name} onChange={e=>setName(e.target.value)} placeholder="SUBJECT NAME" className="bg-transparent border-b border-white/20 p-4 outline-none focus:border-orange-500 text-xl font-bold w-full uppercase" />
                                        <input value={mother} onChange={e=>setMother(e.target.value)} placeholder="MOTHER NAME" className="bg-transparent border-b border-white/20 p-4 outline-none focus:border-orange-500 text-xl font-bold w-full uppercase" />
                                    </div>
                                    <button onClick={calculate} className="w-full bg-orange-600 hover:bg-orange-500 text-black font-black py-6 rounded-xl text-xl tracking-widest transition-all">ACTIVATE FREQUENCY SCAN</button>
                                </div>

                                {out && (
                                    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-1000">
                                        <div className="glass p-8 rounded-3xl border-l-4 border-orange-600 space-y-4">
                                            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Muwakkil Identified</p>
                                            <p className="text-4xl font-black italic">{out.muwakkil}</p>
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase">ABJAD SUM: {out.total}</p>
                                        </div>
                                        <div className="glass p-8 rounded-3xl flex flex-col items-center">
                                            <p className="text-[10px] font-bold text-zinc-600 uppercase mb-4">Ghazali Hatimi Matrix</p>
                                            <div className="grid grid-cols-3 gap-1 w-32 h-32 bg-orange-600/20 p-1 border border-orange-500/30">
                                                {out.wafq.map((v, i) => (
                                                    <div key={i} className="hatimi-cell text-xs">{v}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="max-w-2xl mx-auto space-y-8">
                                <h2 className="text-3xl font-black italic uppercase glow-orange">Admin Archives</h2>
                                <div className="glass p-8 rounded-3xl border border-white/10 space-y-6">
                                    <input type="password" placeholder="ENTER ACCESS KEY" className="w-full bg-black border border-white/20 p-4 rounded-xl outline-none" />
                                    <button className="w-full bg-orange-600 py-4 rounded-xl font-black uppercase text-black">Authorize</button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 opacity-30">
                                    <div className="p-4 bg-zinc-900 rounded-xl text-[10px] font-bold">GHAZ-3x3-MASTER</div>
                                    <div className="p-4 bg-zinc-900 rounded-xl text-[10px] font-bold">AYIL-PROTECT-77</div>
                                </div>
                            </div>
                        )}
                    </main>
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
app.listen(PORT, () => console.log("ENGINE ONLINE"));
