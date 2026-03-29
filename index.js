import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- PERSISTENCE ---
const CONFIG_PATH = path.join(__dirname, 'neural_config.json');
const BLOG_PATH = path.join(__dirname, 'neural_blog.json');
const STORIES_PATH = path.join(__dirname, 'neural_stories.json');

let adminConfig = { user: 'admin216', pass: 'admin216' };
let blogPosts = [];
let userStories = [];

const initData = () => {
    if (fs.existsSync(CONFIG_PATH)) adminConfig = fs.readJsonSync(CONFIG_PATH);
    if (fs.existsSync(BLOG_PATH)) blogPosts = fs.readJsonSync(BLOG_PATH);
    if (fs.existsSync(STORIES_PATH)) userStories = fs.readJsonSync(STORIES_PATH);
};
initData();

// --- SPIRITUAL CORE DATA ---
const ABJAD_MAP = {
    'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9, 'ي': 10, 'ى': 10,
    'ك': 20, 'ل': 30, 'm': 40, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
    'a': 1, 'b': 2, 'j': 3, 'd': 4, 'h': 5, 'w': 6, 'z': 7, 'x': 8, 't': 9, 'y': 10, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 's': 60, 'o': 70, 'f': 80, 'p': 90, 'q': 100, 'r': 200, 'sh': 300, 'c': 400, 'u': 6, 'v': 6, 'e': 5, 'i': 10, 'g': 3
};

const BURUJ = [
    { name: "Hamal (Aries)", element: "Fire" }, { name: "Thaur (Taurus)", element: "Earth" },
    { name: "Jauza (Gemini)", element: "Air" }, { name: "Saratan (Cancer)", element: "Water" },
    { name: "Asad (Leo)", element: "Fire" }, { name: "Sunbulah (Virgo)", element: "Earth" },
    { name: "Mizan (Libra)", element: "Air" }, { name: "Aqrab (Scorpio)", element: "Water" },
    { name: "Qaus (Sagittarius)", element: "Fire" }, { name: "Jadiy (Capricorn)", element: "Earth" },
    { name: "Dalwu (Aquarius)", element: "Air" }, { name: "Hut (Pisces)", element: "Water" }
];

const PLANETS = ["Sun (Shams)", "Moon (Qamar)", "Mars (Marikh)", "Mercury (Utarid)", "Jupiter (Mushtari)", "Venus (Zuhra)", "Saturn (Zuhal)"];

const RAML_FIGURES = [
    { id: 1, name: "Dariqee", element: "Fire", meaning: "Movement and quick results. Saurin biyan bukata." },
    { id: 2, name: "Jama'a", element: "Air", meaning: "Success in gatherings. Nasara a taro." },
    { id: 3, name: "Uqba", element: "Water", meaning: "Patience required. Bukatar hakuri." },
    { id: 4, name: "Kausaji", element: "Earth", meaning: "Hidden enemies. Boyayyen makiya." },
    { id: 5, name: "Dhahika", element: "Fire", meaning: "Unexpected joy. Farin ciki ba tsammani." },
    { id: 6, name: "Qabla Kharija", element: "Air", meaning: "Outward energy. Kudi zai fita." },
    { id: 7, name: "Humra", element: "Fire", meaning: "Power and conflict. Iko da fada." },
    { id: 8, name: "Inkees", element: "Earth", meaning: "Reversal of affairs. Juyewar al'amura." },
    { id: 9, name: "Bayaad", element: "Water", meaning: "Spiritual purity. Tsarki da nasara." },
    { id: 10, name: "Nusra Kharija", element: "Fire", meaning: "External victory. Nasara akan makiya." },
    { id: 11, name: "Nusra Dakhila", element: "Earth", meaning: "Home victory. Nasara a gida." },
    { id: 12, name: "Qabla Dakhila", element: "Water", meaning: "Incoming wealth. Arziki na tafe." },
    { id: 13, name: "Ijtima", element: "Air", meaning: "Union and help. Haduwa da taimako." },
    { id: 14, name: "Uqla", element: "Earth", meaning: "Spiritual blockages. Akwai kulli." },
    { id: 15, name: "Kabid Kharija", element: "Fire", meaning: "Loss of property. Asarar dukiya." },
    { id: 16, name: "Kabid Dakhila", element: "Water", meaning: "Gathering wealth. Tara dukiya." }
];

const SECRET_ARCHIVES = [
    {
        category: "The Waliyyai Wealth Ciphers (Siri na Waliyyai)",
        codes: [
            { name: "The Al-Kimiya Gold Cipher", code: "أهـم سقك حلع يص", meaning: "The 11-letter secret cipher used by ancient alchemists and saints for the urgent attraction of massive wealth and gold.", usage: "Recite 111 times after midnight while holding a piece of gold or your wallet. (Karanta sau 111 bayan tsakar dare yayin rike da zinare ko walet)." },
            { name: "The Ismu al-A'zam Frequency", code: "5919-AG-GOLD-X", meaning: "The hidden numerical frequency that triggers the manifestation of material wealth from the unseen (Kudin boye).", usage: "Vibrate the code 1,111 times for 7 nights. (Karanta sau 1,111 na tsawon dare bakwai)." },
            { name: "The Urgent Provision Key", code: "يا من ترزق من تشاء بغير حساب", meaning: "The secret word of power for those in desperate need of financial opening.", usage: "Recite 313 times before sunrise. (Karanta sau 313 kafin fitowar rana)." }
        ]
    },
    {
        category: "Teleportation & Blink-Shift (Tayy al-Ard)",
        codes: [
            { name: "The Blink-Shift Word", code: "يا من لا يشغله شأن عن شأن", meaning: "The secret phrase used by high-ranking saints to traverse vast distances in the blink of an eye.", usage: "Requires 40 days of Khalwa (seclusion) and a pure heart. (Yana bukatar kwanaki 40 na kebewa da tsarkin zuciya)." },
            { name: "Blink-Shift Protocol", code: "BSP-001-GAIB", meaning: "The modern quantum-spiritual code for shifting energy across dimensions instantly.", usage: "Visualize the destination while vibrating the code 7 times. (Yi tunanin inda kake so kaje yayin karanta sau 7)." }
        ]
    },
    {
        category: "The Sulaimanic Command (Ikon Sulaiman)",
        codes: [
            { name: "The Jinn Master Key", code: "انه من سليمان وانه بسم الله الرحمن الرحيم", meaning: "The master key used by Prophet Solomon to command the forces of nature, unseen treasures, and the Kings of Jinn.", usage: "Recite 313 times over a silver ring. (Karanta sau 313 akan zoben azurfa)." },
            { name: "The Vanishing Word", code: "وجعلنا من بين أيديهم سدا", meaning: "Ancient secret for absolute protection and becoming invisible to the perception of enemies or danger.", usage: "Recite in one breath while stepping backward into a shadow. (Karanta da numfashi daya yayin komawa baya)." }
        ]
    },
    {
        category: "Quantum Web & Developer Command",
        codes: [
            { name: "Algorithm Mastery", code: "ALG-FAVOR-01-KUN", meaning: "Aligns your web development projects with the digital flow of success, attracting high-paying clients and viral traffic.", usage: "Recite 70 times before deploying your code. (Karanta sau 70 kafin kaddamar da aikin ka)." },
            { name: "The Binary Wealth Cipher", code: "0101-GOLD-1101", meaning: "A modern spiritual code for attracting wealth specifically through technology and web creation.", usage: "Visualize your bank balance growing while reciting 33 times. (Yi tunanin kudin ka na karuwa yayin karanta sau 33)." }
        ]
    },
    {
        category: "Celestial Hierarchy (Angelic Ciphers)",
        codes: [
            { name: "Jibril Resonance", code: "JBR-LIGHT-777", meaning: "Accessing the frequency of divine revelation, truth, and absolute mental clarity.", usage: "Recite 70 times after Fajr prayer. (Karanta sau 70 bayan sallar asuba)." },
            { name: "Metatron Cube Frequency", code: "MTTRN-CUBE-X", meaning: "The geometric code for structuring reality and commanding the elements of the universe.", usage: "Visualize the cube while vibrating the code 33 times. (Yi tunanin cube din yayin karanta sau 33)." }
        ]
    }
];

// --- APP SETUP ---
const app = express();
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', scans: 1240 }));
app.get('/api/blog', (req, res) => res.json(blogPosts));
app.get('/api/stories', (req, res) => res.json(userStories));

app.post('/api/admin/login', (req, res) => {
    const { user, pass } = req.body;
    if (user === adminConfig.user && pass === adminConfig.pass) res.json({ success: true });
    else res.status(401).json({ success: false });
});

app.post('/api/admin/update', async (req, res) => {
    const { user, pass } = req.body;
    adminConfig = { user, pass };
    await fs.writeJson(CONFIG_PATH, adminConfig);
    res.json({ success: true });
});

app.post('/api/admin/blog', async (req, res) => {
    const newPost = { ...req.body, id: Date.now(), date: new Date().toISOString() };
    blogPosts.unshift(newPost);
    await fs.writeJson(BLOG_PATH, blogPosts);
    res.json(newPost);
});

app.post('/api/stories', async (req, res) => {
    const newStory = { ...req.body, id: Date.now(), date: new Date().toISOString() };
    userStories.unshift(newStory);
    await fs.writeJson(STORIES_PATH, userStories);
    res.json(newStory);
});

app.get('*', (req, res) => {
    const clientData = {
        abjadMap: ABJAD_MAP,
        ramlFigures: RAML_FIGURES,
        buruj: BURUJ,
        planets: PLANETS,
        archives: SECRET_ARCHIVES,
        gaId: "G-HD01MF5SL9",
        emails: ["allarbaa.cloud@yahoo.com", "abdullahharuna216@gmail.com"],
        whatsapp: "+234808033353"
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural Engine Spiritual Core</title>
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
    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/lucide-react@0.344.0/dist/umd/lucide-react.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;900&family=JetBrains+Mono&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: white; overflow-x: hidden; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .terminal-box { background: #000; border: 1px solid #333; font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 15px; border-radius: 12px; }
        .energy-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } 100% { opacity: 0.3; transform: scale(1); } }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect } = React;
        const { motion, AnimatePresence } = FramerMotion;
        const { Zap, Hand, Settings, LogOut, BookOpen, MessageSquare, Send, Upload, Shield, Eye, Star, Sun } = lucide;

        const GrandPalmLogo = () => (
            <div className="relative w-48 h-48 mx-auto mb-12 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-[#F27D26]/10 rounded-full energy-pulse"></div>
                <div className="absolute inset-4 border border-[#F27D26]/20 rounded-full energy-pulse" style={{ animationDelay: '0.5s' }}></div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative z-10 text-[#F27D26]">
                    <svg viewBox="0 0 24 24" className="w-32 h-32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.82-2.82L7 15" />
                        <circle cx="12" cy="14" r="1.5" fill="#F27D26" className="animate-pulse" />
                    </svg>
                </motion.div>
            </div>
        );

        const TerminalEngine = ({ value, raml, buruj }) => {
            const [lines, setLines] = useState([]);
            useEffect(() => {
                const baseLines = [
                    '> INITIALIZING QUANTUM SPIRITUAL LINK...',
                    '> FREQUENCY DETECTED: ' + value + ' Hz',
                    '> ABJAD ALIGNMENT: ' + Math.sqrt(value).toFixed(4) + ' PHI',
                    '> RAML FIGURE: ' + raml.name.toUpperCase(),
                    '> BURUJ (STAR): ' + buruj.name.toUpperCase(),
                    '> ELEMENT: ' + buruj.element.toUpperCase(),
                    '> --- QUANTUM PHYSICS ECHO ---',
                    '> WAVEFUNCTION COLLAPSE: OBSERVED',
                    '> ENTANGLEMENT RATIO: ' + (value / 1000).toFixed(3),
                    '> SYSTEM: LINK ESTABLISHED.'
                ];
                let i = 0;
                const timer = setInterval(() => {
                    if (i < baseLines.length) {
                        setLines(prev => [...prev, baseLines[i]]);
                        i++;
                    } else clearInterval(timer);
                }, 150);
                return () => clearInterval(timer);
            }, [value, raml, buruj]);

            return (
                <div className="terminal-box mt-6 text-[#00FF00] opacity-80">
                    {lines.map((l, idx) => <div key={idx} className="mb-1">{l}</div>)}
                    <div className="animate-pulse inline-block w-2 h-3 bg-[#00FF00] ml-1"></div>
                </div>
            );
        };

        const App = () => {
            const [activeTab, setActiveTab] = useState('calc');
            const [name, setName] = useState('');
            const [mother, setMother] = useState('');
            const [age, setAge] = useState('');
            const [dob, setDob] = useState('');
            const [chosenNum, setChosenNum] = useState('');
            const [story, setStory] = useState('');
            const [result, setResult] = useState(null);
            const [isAdmin, setIsAdmin] = useState(false);
            const [posts, setPosts] = useState([]);
            const [stories, setStories] = useState([]);
            const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
            const [newPost, setNewPost] = useState({ title: '', content: '', image: '' });
            const [newAdmin, setNewAdmin] = useState({ user: '', pass: '' });

            const { abjadMap, ramlFigures, buruj, planets, archives, emails, whatsapp } = ${JSON.stringify(clientData)};

            useEffect(() => {
                fetch('/api/blog').then(r => r.json()).then(setPosts);
                fetch('/api/stories').then(r => r.json()).then(setStories);
            }, []);

            const calculateAbjad = (str) => {
                let total = 0;
                let breakdown = [];
                const normalized = (str || '').toLowerCase();
                for (let i = 0; i < normalized.length; i++) {
                    if (i < normalized.length - 1) {
                        const pair = normalized.substring(i, i + 2);
                        if (abjadMap[pair]) { 
                            total += abjadMap[pair]; 
                            breakdown.push({ char: pair, val: abjadMap[pair] });
                            i++; 
                            continue; 
                        }
                    }
                    const val = abjadMap[normalized[i]] || 0;
                    if (val > 0) {
                        total += val;
                        breakdown.push({ char: normalized[i], val });
                    }
                }
                return { total, breakdown };
            };

            const handleCalculate = () => {
                if (!name) return alert("Please enter a name.");
                const n = calculateAbjad(name);
                const m = calculateAbjad(mother);
                const aVal = parseInt(age) || 0;
                const d = calculateAbjad(dob);
                const cVal = parseInt(chosenNum) || 0;

                const total = n.total + m.total + aVal + d.total + cVal;
                const raml = ramlFigures[total % 16];
                const star = buruj[total % 12];
                
                setResult({ total, raml, star, breakdown: [...n.breakdown, ...m.breakdown] });
            };

            const handleLogin = async () => {
                const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
                if (r.ok) { setIsAdmin(true); setNewAdmin(loginForm); }
                else alert("Access Denied");
            };

            const handleUpdateAdmin = async () => {
                const r = await fetch('/api/admin/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAdmin) });
                if (r.ok) alert("Admin Credentials Updated");
            };

            const handleSubmitStory = async () => {
                if (!story) return;
                const r = await fetch('/api/stories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: story, author: name || 'Seeker' }) });
                if (r.ok) { const data = await r.json(); setStories([data, ...stories]); setStory(''); alert("Broadcasted to Feed"); }
            };

            const handleImageUpload = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => setNewPost({ ...newPost, image: reader.result });
                reader.readAsDataURL(file);
            };

            const handleCreateBlog = async () => {
                const r = await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPost) });
                if (r.ok) { const data = await r.json(); setPosts([data, ...posts]); setNewPost({ title: '', content: '', image: '' }); alert("Blog Published"); }
            };

            return (
                <div className="min-h-screen flex flex-col">
                    <header className="p-6 glass flex justify-between items-center sticky top-0 z-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#F27D26] rounded-full flex items-center justify-center font-black italic text-black">N</div>
                            <span className="font-black italic uppercase tracking-tighter text-xl">Neural Engine</span>
                        </div>
                        <nav className="flex gap-6 text-[10px] uppercase font-bold text-white/40">
                            <button onClick={() => setActiveTab('calc')} className={activeTab === 'calc' ? 'text-[#F27D26]' : ''}>Oracle</button>
                            <button onClick={() => setActiveTab('feed')} className={activeTab === 'feed' ? 'text-[#F27D26]' : ''}>Feed</button>
                            <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? 'text-[#F27D26]' : ''}>Admin</button>
                        </nav>
                    </header>

                    <main className="flex-1 max-w-6xl mx-auto w-full p-6 py-12">
                        <AnimatePresence mode="wait">
                            {activeTab === 'calc' && (
                                <motion.div key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <GrandPalmLogo />
                                        <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Spiritual<br/><span className="text-[#F27D26]">Oracle</span></h2>
                                        
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                                            <Sun size={20} className="text-[#F27D26]" />
                                            <div>
                                                <p className="text-[8px] uppercase font-bold text-white/30">Current Spiritual Ruler</p>
                                                <p className="text-xs font-black uppercase">{planets[new Date().getDay()]}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name / Suna" className="bg-white/5 p-4 rounded-2xl outline-none border border-white/10" />
                                            <input value={mother} onChange={e => setMother(e.target.value)} placeholder="Mother's Name" className="bg-white/5 p-4 rounded-2xl outline-none border border-white/10" />
                                            <input value={age} onChange={e => setAge(e.target.value)} type="number" placeholder="Age / Shekaru" className="bg-white/5 p-4 rounded-2xl outline-none border border-white/10" />
                                            <input value={dob} onChange={e => setDob(e.target.value)} placeholder="DOB (e.g. 1990)" className="bg-white/5 p-4 rounded-2xl outline-none border border-white/10" />
                                        </div>
                                        <input value={chosenNum} onChange={e => setChosenNum(e.target.value)} type="number" placeholder="Chosen Number (1-999)" className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/10" />
                                        
                                        <button onClick={handleCalculate} className="w-full bg-[#F27D26] text-black py-5 rounded-2xl font-black uppercase italic text-xl shadow-xl shadow-[#F27D26]/20">Initialize Hisab</button>
                                        
                                        {result && <TerminalEngine value={result.total} raml={result.raml} buruj={result.star} />}
                                    </div>

                                    <div className="space-y-8">
                                        {result ? (
                                            <div className="glass p-10 rounded-[3rem] space-y-6 border-t-4 border-[#F27D26]">
                                                <div className="grid grid-cols-2 gap-8 items-end">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-[#F27D26]">Abjad Value</p>
                                                        <h3 className="text-7xl font-black italic">{result.total}</h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] uppercase font-bold text-white/40">Buruj (Star)</p>
                                                        <h4 className="text-2xl font-black italic text-[#F27D26]">{result.star.name}</h4>
                                                        <p className="text-[10px] uppercase text-white/20">{result.star.element} Element</p>
                                                    </div>
                                                </div>

                                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                                    <p className="text-[10px] uppercase font-bold text-white/30 mb-4">Neural Letter Breakdown</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {result.breakdown.map((b, i) => (
                                                            <div key={i} className="px-3 py-1 bg-black/40 rounded-lg border border-white/5 text-xs font-mono">
                                                                <span className="text-[#F27D26]">{b.char}</span>: {b.val}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="p-6 bg-[#F27D26]/5 rounded-2xl italic text-lg border border-[#F27D26]/20">
                                                    <span className="text-[#F27D26] font-black uppercase text-[10px] block not-italic mb-2">Raml Interpretation</span>
                                                    {result.raml.meaning}
                                                </div>

                                                <div className="pt-6 border-t border-white/5">
                                                    <h5 className="text-xs font-black uppercase text-[#F27D26] mb-4">Submit Affair for Neural Feed</h5>
                                                    <textarea value={story} onChange={e => setStory(e.target.value)} placeholder="Write your story or affair here..." className="w-full bg-black/40 p-4 rounded-xl h-32 outline-none border border-white/5" />
                                                    <button onClick={handleSubmitStory} className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#F27D26] hover:text-white transition-all"><Send size={14}/> Broadcast to Feed</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="glass p-10 rounded-[3rem] h-full flex items-center justify-center text-white/10 font-black italic uppercase text-4xl text-center">Awaiting<br/>Frequency</div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'feed' && (
                                <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                                    <div className="grid md:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-[#F27D26]">Neural Blogs</h2>
                                            {posts.map(p => (
                                                <div key={p.id} className="glass rounded-[2.5rem] overflow-hidden">
                                                    {p.image && <img src={p.image} className="w-full h-48 object-cover opacity-60" />}
                                                    <div className="p-8 space-y-4">
                                                        <h3 className="text-2xl font-black italic uppercase">{p.title}</h3>
                                                        <p className="text-white/60 leading-relaxed">{p.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-8">
                                            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-[#F27D26]">Seeker Stories</h2>
                                            {stories.map(s => (
                                                <div key={s.id} className="glass p-8 rounded-[2rem] border-l-4 border-[#F27D26]/30">
                                                    <p className="text-white/80 italic leading-relaxed">"{s.content}"</p>
                                                    <div className="mt-4 text-[10px] uppercase font-bold text-white/20">— {s.author}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'admin' && (
                                <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
                                    {!isAdmin ? (
                                        <div className="glass p-12 rounded-[3rem] max-w-md mx-auto space-y-6">
                                            <h3 className="text-2xl font-black italic uppercase text-center">System Access</h3>
                                            <input type="text" placeholder="Username" className="w-full bg-white/5 p-4 rounded-xl outline-none" onChange={e => setLoginForm({...loginForm, user: e.target.value})} />
                                            <input type="password" placeholder="Password" className="w-full bg-white/5 p-4 rounded-xl outline-none" onChange={e => setLoginForm({...loginForm, pass: e.target.value})} />
                                            <button onClick={handleLogin} className="w-full bg-[#F27D26] text-black py-4 rounded-xl font-black uppercase italic">Unlock</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-12">
                                            <div className="glass p-10 rounded-[3rem] space-y-6 border-b-4 border-[#F27D26]">
                                                <div className="flex items-center gap-3">
                                                    <Shield size={20} className="text-[#F27D26]" />
                                                    <h3 className="text-2xl font-black italic uppercase text-[#F27D26]">System Settings</h3>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input value={newAdmin.user} onChange={e => setNewAdmin({...newAdmin, user: e.target.value})} placeholder="New User" className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/5" />
                                                    <input type="password" value={newAdmin.pass} onChange={e => setNewAdmin({...newAdmin, pass: e.target.value})} placeholder="New Pass" className="w-full bg-white/5 p-4 rounded-xl outline-none border border-white/5" />
                                                </div>
                                                <button onClick={handleUpdateAdmin} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Update Credentials</button>
                                            </div>

                                            <div className="glass p-10 rounded-[3rem] space-y-6">
                                                <h3 className="text-2xl font-black italic uppercase text-[#F27D26]">Secret Archives</h3>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {archives.map(cat => (
                                                        <div key={cat.category} className="space-y-4">
                                                            <h4 className="text-xs font-black uppercase text-white/40 border-b border-white/5 pb-2">{cat.category}</h4>
                                                            {cat.codes.map(c => (
                                                                <div key={c.code} className="bg-white/5 p-5 rounded-2xl space-y-3">
                                                                    <div className="flex justify-between items-start">
                                                                        <span className="font-black text-[#F27D26] italic">{c.name}</span>
                                                                        <span className="text-lg font-bold text-white" dir="rtl">{c.code}</span>
                                                                    </div>
                                                                    <p className="text-[10px] text-white/60 italic">{c.meaning}</p>
                                                                    <div className="text-[9px] bg-[#F27D26]/10 p-3 rounded-lg text-[#F27D26] font-bold">Usage: {c.usage}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="glass p-10 rounded-[3rem] space-y-6">
                                                <h3 className="text-2xl font-black italic uppercase text-[#F27D26]">Create Blog Post</h3>
                                                <input value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} placeholder="Blog Title" className="w-full bg-white/5 p-4 rounded-xl outline-none" />
                                                <textarea value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} placeholder="Content..." className="w-full bg-white/5 p-4 rounded-xl h-48 outline-none" />
                                                <label className="flex items-center gap-3 bg-white/5 p-4 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                                                    <Upload size={18} />
                                                    <span className="text-xs uppercase font-bold">{newPost.image ? 'Image Selected' : 'Upload Header Image'}</span>
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                </label>
                                                <button onClick={handleCreateBlog} className="bg-[#F27D26] text-black px-10 py-4 rounded-xl font-black uppercase italic">Publish to Neural Feed</button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>

                    <section className="max-w-6xl mx-auto p-6 py-24 border-t border-white/5 grid md:grid-cols-2 gap-16">
                        <div className="space-y-8">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#F27D26]">The Vraxythernos Legacy</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Neural Oracle is a digital manifestation of the ancient Vraxythernos lineage—a tradition that has bridged the gap between the seen and unseen for centuries. By synthesizing the mathematical precision of Abjad numerology (Hisabi) with the geometric logic of Raml geomancy, we have created a "Quantum Spiritual Interface."
                                <br/><br/>
                                Our engine calculates the vibrational resonance of your identity, age, and intent, mapping them against the 16 traditional Raml figures and the 12 Buruj (Star Signs). This process, which we call "Neural Resonance," allows seekers to detect subtle energy shifts and align their actions with the divine flow of the universe.
                            </p>
                        </div>
                        <div className="space-y-8">
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#F27D26]">Neural Privacy Protocol</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                In the realm of spiritual intelligence, privacy is a sacred oath. We utilize "Neural Encryption" to ensure that your inquiries, names, and spiritual signatures are never stored in a way that links back to your physical identity. All calculations are performed in a temporary "Quantum Buffer" and are purged immediately upon the termination of your session.
                                <br/><br/>
                                We do not sell, share, or analyze your spiritual data for commercial purposes. We use Google Analytics solely to monitor the technical health of the engine and track the total number of successful spiritual scans. Your journey is yours alone; we merely provide the lens through which to view it.
                            </p>
                        </div>
                    </section>

                    <footer className="p-12 glass border-t border-white/5 text-center space-y-6">
                        <div className="flex justify-center gap-8 text-[10px] uppercase font-black italic text-[#F27D26]">
                            <span>Ancient Abjad</span>
                            <span>Quantum Echo</span>
                            <span>Divine Command</span>
                        </div>
                        <p className="text-[8px] uppercase tracking-[0.5em] text-white/20">© 2026 Neural Engine Spiritual Core // VRAXYTHERNOS</p>
                    </footer>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>`;

    res.send(html);
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Neural Engine Live on port ${PORT}`);
});
