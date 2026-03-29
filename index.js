import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. THE ABJAD & SPIRITUAL ENGINE ---
const ABJAD_MAP = {
    'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
    'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
    'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
    'a':1,'b':2,'j':3,'d':4,'h':5,'w':6,'z':7,'x':8,'t':9,'y':10,'k':20,'l':30,'m':40,'n':50,'s':60,'o':70,'f':80,'p':90,'q':100,'r':200,'c':400,'u':6,'v':6,'e':5,'i':10,'g':3
};

// --- 2. THE GHAZALI ADMIN ARCHIVES ---
const INITIAL_ARCHIVES = [
    {
        category: "Imam Ghazali Tech-Secrets",
        codes: [
            { name: "Sirr-ul-Ghazali", code: "GHAZ-3x3-MASTER", meaning: "Master algorithm for digital squares.", usage: "Server stability injection." },
            { name: "Muwakkil Lock", code: "AYIL-PROTECT-77", meaning: "Security frequency for Admin protection.", usage: "Recite when changing passwords." }
        ]
    }
];

// --- 3. SERVER SETUP ---
const app = express();
app.use(express.json());
const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// --- 4. THE FRONTEND (Your Actual Analytic: G-HD01MF5SL9) ---
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
    <title>Neural Engine | Supreme Oracle</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-black text-white">
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;
        const App = () => {
            const [name, setName] = useState('');
            const [mother, setMother] = useState('');
            const [out, setOut] = useState(null);

            const solve = () => {
                const map = ${JSON.stringify(ABJAD_MAP)};
                const total = (name+mother).toLowerCase().split('').reduce((a,c)=>a+(map[c]||0),0);
                const mName = "Ya " + (total + 51) + "ayil";
                const b = Math.floor((total-12)/3);
                const w = [b+8, b+1, b+6, b+3, b+5, b+7, b+4, b+9, b+2];
                setOut({ total, muwakkil: mName, wafq: w });
            };

            return (
                <div className="p-10 max-w-2xl mx-auto font-sans">
                    <h1 className="text-4xl font-black mb-8 text-orange-500 italic uppercase tracking-tighter">Neural Oracle v4</h1>
                    <div className="space-y-4 mb-12 bg-white/5 p-6 rounded-3xl border border-white/10">
                        <input onChange={e=>setName(e.target.value)} placeholder="Full Name" className="w-full p-4 bg-black border border-white/20 rounded-xl outline-none focus:border-orange-500" />
                        <input onChange={e=>setMother(e.target.value)} placeholder="Mother's Name" className="w-full p-4 bg-black border border-white/20 rounded-xl outline-none focus:border-orange-500" />
                        <button onClick={solve} className="w-full bg-orange-600 hover:bg-orange-500 transition-colors p-5 rounded-xl font-black uppercase italic">Activate Frequency</button>
                    </div>

                    {out && (
                        <div className="space-y-6 animate-in fade-in duration-1000">
                            <div className="bg-white/5 p-8 rounded-3xl border-l-4 border-orange-600">
                                <p className="text-orange-500 text-[10px] font-bold uppercase tracking-widest mb-1">Guardian Frequency</p>
                                <p className="text-4xl font-black italic">{out.muwakkil}</p>
                            </div>
                            
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">Ghazali Hatimi Sigil</p>
                                <div className="grid grid-cols-3 gap-2 w-36 h-36 mx-auto">
                                    {out.wafq.map((v,i)=><div key={i} className="bg-orange-600/10 border border-orange-600/40 flex items-center justify-center text-xs font-bold text-orange-500">{v}</div>)}
                                </div>
                            </div>
                        </div>
                    )}
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
app.listen(PORT, () => console.log("GHAZALI ENGINE ONLINE (ESM)"));
