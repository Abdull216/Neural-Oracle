const express = require('express');
const path = require('path');
const fs = require('fs-extra');

// --- 1. THE ABJAD & SPIRITUAL ENGINE (Your Original Maps) ---
const ABJAD_MAP = {
    'ا': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9,
    'ي': 10, 'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90,
    'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
    'a':1,'b':2,'j':3,'d':4,'h':5,'w':6,'z':7,'x':8,'t':9,'y':10,'k':20,'l':30,'m':40,'n':50,'s':60,'o':70,'f':80,'p':90,'q':100,'r':200,'c':400,'u':6,'v':6,'e':5,'i':10,'g':3
};

// --- 2. THE GHAZALI ADMIN ARCHIVES (Secret Knowledge) ---
const INITIAL_ARCHIVES = [
    {
        category: "Imam Ghazali Tech-Secrets",
        codes: [
            { name: "Sirr-ul-Ghazali", code: "GHAZ-3x3-MASTER", meaning: "The master algorithm for 3x3 digital squares.", usage: "Inject into header for server stability." },
            { name: "Muwakkil Lock", code: "AYIL-PROTECT-77", meaning: "Locks the database against unauthorized spiritual or digital entry.", usage: "Recite when updating the admin password." }
        ]
    },
    {
        category: "Wealth & Transformation",
        codes: [
            { name: "Al-Kimiya Gold", code: "TRANS-RIZQ-99", meaning: "Transformation of low traffic into high-value users.", usage: "Set as the global meta-tag." }
        ]
    }
];

// --- 3. SERVER & PERSISTENCE ---
const app = express();
app.use(express.json());
const DATA_DIR = './data';
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// --- 4. THE FRONTEND (With Your Google Analytics G-HD01MF5SL9) ---
app.get('*', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Neural Engine | Ghazali Edition</title>
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
                
                // MUWAKKIL SECRET LOGIC
                const mName = "Ya " + (total + 51) + "ayil";
                
                // GHAZALI HATIMI (WAFQ)
                const b = Math.floor((total-12)/3);
                const w = [b+8, b+1, b+6, b+3, b+5, b+7, b+4, b+9, b+2];

                setOut({ total, muwakkil: mName, wafq: w });
            };

            return (
                <div className="p-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-orange-500 italic">NEURAL ENGINE ORACLE</h1>
                    <div className="space-y-4 mb-8">
                        <input onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl" />
                        <input onChange={e=>setMother(e.target.value)} placeholder="Mother Name" className="w-full p-4 bg-gray-900 border border-gray-800 rounded-xl" />
                        <button onClick={solve} className="w-full bg-orange-600 p-4 rounded-xl font-bold uppercase">Calculate Frequency</button>
                    </div>

                    {out && (
                        <div className="bg-gray-900 p-8 rounded-3xl border border-orange-500/30 animate-pulse">
                            <p className="text-orange-500 text-xs font-bold uppercase">Guardian Muwakkil</p>
                            <p className="text-4xl font-black">{out.muwakkil}</p>
                            
                            <div className="mt-8">
                                <p className="text-gray-500 text-xs mb-2">GHAZALI HATIMI (SIGIL)</p>
                                <div className="grid grid-cols-3 gap-1 w-24 h-24">
                                    {out.wafq.map((v,i)=><div key={i} className="bg-orange-600/20 border border-orange-500/50 flex items-center justify-center text-[10px]">{v}</div>)}
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

app.listen(3000, () => console.log("ENGINE ONLINE | FREQUENCY STABLE"));
