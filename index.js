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
const STATS_PATH = path.join(__dirname, 'neural_stats.json');
const ARCHIVES_PATH = path.join(__dirname, 'neural_archives.json');

let adminConfig = { user: 'admin216', pass: 'admin216', globalCommand: 'KUN FAYAKUN: THE GATES OF WEALTH ARE OPEN.' };
let blogPosts = [];
let userStories = [];
let stats = { totalScans: 0, inquiries: { success: 0, magic: 0, evil_eye: 0, jinn: 0, illness: 0 } };

const initData = () => {
    if (fs.existsSync(CONFIG_PATH)) adminConfig = { ...adminConfig, ...fs.readJsonSync(CONFIG_PATH) };
    if (fs.existsSync(BLOG_PATH)) blogPosts = fs.readJsonSync(BLOG_PATH);
    if (fs.existsSync(STORIES_PATH)) userStories = fs.readJsonSync(STORIES_PATH);
    if (fs.existsSync(STATS_PATH)) stats = fs.readJsonSync(STATS_PATH);
};
initData();

// --- SPIRITUAL CORE DATA ---
const ABJAD_MAP = {
    'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9, 'ي': 10, 'ى': 10,
    'ك': 20, 'ل': 30, 'm': 40, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
    'a': 1, 'b': 2, 'j': 3, 'd': 4, 'h': 5, 'w': 6, 'z': 7, 'x': 8, 't': 9, 'y': 10, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 's': 60, 'o': 70, 'f': 80, 'p': 90, 'q': 100, 'r': 200, 'sh': 300, 'c': 400, 'u': 6, 'v': 6, 'e': 5, 'i': 10, 'g': 3
};

const BURUJ = [
    { name: "Hamal (Aries)", element: "Fire", nature: "Hot & Dry", remedy_type: "Burning/Heat" },
    { name: "Thaur (Taurus)", element: "Earth", nature: "Cold & Dry", remedy_type: "Burying/Grounding" },
    { name: "Jauza (Gemini)", element: "Air", nature: "Hot & Moist", remedy_type: "Hanging/Wind" },
    { name: "Saratan (Cancer)", element: "Water", nature: "Cold & Moist", remedy_type: "Drinking/Washing" },
    { name: "Asad (Leo)", element: "Fire", nature: "Hot & Dry", remedy_type: "Burning/Heat" },
    { name: "Sunbulah (Virgo)", element: "Earth", nature: "Cold & Dry", remedy_type: "Burying/Grounding" },
    { name: "Mizan (Libra)", element: "Air", nature: "Hot & Moist", remedy_type: "Hanging/Wind" },
    { name: "Aqrab (Scorpio)", element: "Water", nature: "Cold & Moist", remedy_type: "Drinking/Washing" },
    { name: "Qaus (Sagittarius)", element: "Fire", nature: "Hot & Dry", remedy_type: "Burning/Heat" },
    { name: "Jadiy (Capricorn)", element: "Earth", nature: "Cold & Dry", remedy_type: "Burying/Grounding" },
    { name: "Dalwu (Aquarius)", element: "Air", nature: "Hot & Moist", remedy_type: "Hanging/Wind" },
    { name: "Hut (Pisces)", element: "Water", nature: "Cold & Moist", remedy_type: "Drinking/Washing" }
];

const PLANETS = [
    { name: "Sun (Shams)", day: "Sunday", angel: "Rufa'il", jinn: "Mazhab", attribute: "Authority" },
    { name: "Moon (Qamar)", day: "Monday", angel: "Jibril", jinn: "Murrah", attribute: "Emotions" },
    { name: "Mars (Marikh)", day: "Tuesday", angel: "Samsama'il", jinn: "Al-Ahmar", attribute: "Power" },
    { name: "Mercury (Utarid)", day: "Wednesday", angel: "Mika'il", jinn: "Burqan", attribute: "Intelligence" },
    { name: "Jupiter (Mushtari)", day: "Thursday", angel: "Sarfaya'il", jinn: "Shamharush", attribute: "Wealth" },
    { name: "Venus (Zuhra)", day: "Friday", angel: "Anaya'il", jinn: "Zawba'a", attribute: "Love" },
    { name: "Saturn (Zuhal)", day: "Saturday", angel: "Kasfaya'il", jinn: "Maymun", attribute: "Protection" }
];

const INITIAL_ARCHIVES = [
    {
        category: "Siri na Waliyyai (Saint Secrets)",
        codes: [
            { name: "Cipher of Al-Khidr", code: "KHIDR-99-OPEN-X", meaning: "Sudden spiritual openings and meeting hidden masters.", usage: "Recite 99 times at a river bank." },
            { name: "Seal of 7 Planets", code: "KT-PLNT-ALL-7", meaning: "Total dominance over environment and career.", usage: "Recite 7 times every morning." },
            { name: "Blink-Shift Master Key", code: "TAYY-ARD-00-GAIB", meaning: "Physical teleportation frequency.", usage: "Requires 40 days seclusion." },
            { name: "Wealth of 4 Angels", code: "ANGEL-4-GOLD-MANIFEST", meaning: "Material manifestation frequency.", usage: "Recite 111 times after midnight." },
            { name: "Metatron Cube Frequency", code: "METATRON-333-CUBE", meaning: "Access to the blueprint of reality.", usage: "Visualize the cube while reciting 333 times." }
        ]
    },
    {
        category: "Jinn King Protocols (Sarakunan Aljanu)",
        codes: [
            { name: "Shamharush (Thursday)", code: "يا شمهروش", meaning: "King of the 4th day. Rules justice and secrets.", usage: "Recite 45 times at noon on Thursday." },
            { name: "Maymun (Saturday)", code: "يا ميمون", meaning: "King of the 6th day. Rules protection and heavy tasks.", usage: "Recite 77 times on Saturday night." },
            { name: "Zawba'a (Friday)", code: "يا زوبعة", meaning: "King of the 5th day. Rules love and abundance.", usage: "Recite 66 times after Jumu'ah." },
            { name: "Al-Ahmar (Tuesday)", code: "يا أحمر", meaning: "King of the 2nd day. Rules power and strength.", usage: "Recite 22 times on Tuesday midnight." }
        ]
    },
    {
        category: "Wealth & Tech Command",
        codes: [
            { name: "Al-Kimiya Gold Cipher", code: "أهـم سقك حلع يص", meaning: "Urgent attraction of massive wealth.", usage: "Recite 111 times after midnight." },
            { name: "Binary Wealth Cipher", code: "0101-GOLD-1101", meaning: "Spiritual code for tech-based wealth.", usage: "Recite 33 times while visualizing bank growth." },
            { name: "Algorithm Mastery", code: "ALG-FAVOR-01-KUN", meaning: "Aligns web projects with success.", usage: "Recite 70 times before deploying code." },
            { name: "Quantum Entanglement of Souls", code: "ENTANGLE-SOUL-777", meaning: "Deep spiritual connection with someone.", usage: "Recite 77 times while holding their name." }
        ]
    },
    {
        category: "Elite Hiding Secrets (The Forbidden)",
        codes: [
            { name: "The 7 Seals of Solomon", code: "SEAL-SOLOMON-7-X", meaning: "Absolute control over all spiritual entities.", usage: "Requires 7 days of fasting and 777 recitations." },
            { name: "The 99th Name of the Void", code: "VOID-99-NAME-NULL", meaning: "Erasure of all negative karma and blockages.", usage: "Recite 99 times in total darkness." },
            { name: "The Hidden 13th Zodiac", code: "ZODIAC-13-OPH-00", meaning: "Access to the lost frequency of time.", usage: "Recite 13 times at the stroke of midnight." },
            { name: "Jibril Resonance", code: "JIBRIL-RESONANCE-19", meaning: "Direct communication with the divine messenger.", usage: "Recite 19 times after Fajr." }
        ]
    }
];

// --- APP SETUP ---
const app = express();
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok', scans: stats.totalScans }));
app.get('/api/blog', (req, res) => res.json(blogPosts));
app.get('/api/stories', (req, res) => res.json(userStories));
app.get('/api/config', (req, res) => res.json({ globalCommand: adminConfig.globalCommand }));
app.get('/api/admin/stats', (req, res) => res.json(stats));
app.get('/api/admin/archives', (req, res) => {
    const archives = fs.existsSync(ARCHIVES_PATH) ? fs.readJsonSync(ARCHIVES_PATH) : INITIAL_ARCHIVES;
    res.json(archives);
});

app.post('/api/admin/login', (req, res) => {
    const { user, pass } = req.body;
    if (user === adminConfig.user && pass === adminConfig.pass) res.json({ success: true });
    else res.status(401).json({ success: false });
});

app.post('/api/admin/update', async (req, res) => {
    const { user, pass, globalCommand } = req.body;
    if (user) adminConfig.user = user;
    if (pass) adminConfig.pass = pass;
    if (globalCommand) adminConfig.globalCommand = globalCommand;
    await fs.writeJson(CONFIG_PATH, adminConfig);
    res.json({ success: true });
});

app.post('/api/admin/archives', async (req, res) => {
    await fs.writeJson(ARCHIVES_PATH, req.body);
    res.json({ success: true });
});

app.post('/api/admin/blog', async (req, res) => {
    const newPost = { ...req.body, id: Date.now(), date: new Date().toISOString() };
    blogPosts.unshift(newPost);
    await fs.writeJson(BLOG_PATH, blogPosts);
    res.json(newPost);
});

app.delete('/api/admin/stories/:id', async (req, res) => {
    userStories = userStories.filter(s => s.id !== parseInt(req.params.id));
    await fs.writeJson(STORIES_PATH, userStories);
    res.json({ success: true });
});

app.post('/api/scan', async (req, res) => {
    const { type } = req.body;
    stats.totalScans++;
    if (stats.inquiries[type] !== undefined) stats.inquiries[type]++;
    await fs.writeJson(STATS_PATH, stats);
    res.json({ success: true });
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
        buruj: BURUJ,
        planets: PLANETS,
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
        .terminal-box { background: #000; border: 1px solid #333; font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 15px; border-radius: 12px; height: 350px; overflow-y: auto; }
        .energy-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } 100% { opacity: 0.3; transform: scale(1); } }
        .marquee { white-space: nowrap; overflow: hidden; position: relative; background: #F27D26; color: black; font-weight: 900; font-size: 10px; padding: 4px 0; text-transform: uppercase; font-style: italic; }
        .marquee-content { display: inline-block; padding-left: 100%; animation: marquee 30s linear infinite; }
        @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }
        .wafq-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; background: #333; border: 2px solid #F27D26; width: 150px; height: 150px; }
        .wafq-cell { background: #000; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 900; color: #F27D26; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
    </style>
</head>
<body>
    <div id="root">
        <div style="color:#F27D26; padding:40px; font-family:monospace; background:#000; height:100vh; display:flex; align-items:center; justify-content:center;">
            <div style="text-align:center;">
                <h2 style="font-size:24px; font-weight:900; font-style:italic; text-transform:uppercase; animation:pulse 2s infinite;">Initializing Neural Engine...</h2>
                <p style="opacity:0.4; margin-top:10px; font-size:10px;">Connecting to Spiritual Frequency</p>
            </div>
        </div>
    </div>
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        const FM = window.Motion || window.FramerMotion || {};
        const motion = FM.motion || { div: (props) => <div {...props} />, span: (props) => <span {...props} /> };
        const AnimatePresence = FM.AnimatePresence || (({children}) => children);
        const L = window.Lucide || window.lucide || {};
        const getIcon = (name) => L[name] || (() => <span className="inline-block w-4 h-4 border border-current rounded-full opacity-20"></span>);
        
        const Zap = getIcon('Zap');
        const Shield = getIcon('Shield');
        const Eye = getIcon('Eye');
        const Star = getIcon('Star');
        const Sun = getIcon('Sun');
        const Trash2 = getIcon('Trash2');
        const Clock = getIcon('Clock');
        const Send = getIcon('Send');
        const Upload = getIcon('Upload');
        const AlertCircle = getIcon('AlertCircle');
        const Globe = getIcon('Globe');
        const Moon = getIcon('Moon');
        const BarChart3 = getIcon('BarChart3');
        const Settings = getIcon('Settings');

        const TRANSLATIONS = {
            en: { oracle: "Oracle", feed: "Feed", admin: "Admin", inquiry: "Select Inquiry Type", name: "Full Name", mother: "Mother's Name", dob: "Year of Birth", pob: "Place of Birth", num: "Chosen Number", init: "Initialize Hisab", diagnosis: "Spiritual Diagnosis", remedy: "Remedy & Protocol", frequency: "Divine Frequency", vault: "System Vault", unlock: "Unlock Vault" },
            ar: { oracle: "أوراكل", feed: "تغذية", admin: "مسؤول", inquiry: "اختر نوع الاستفسار", name: "الاسم الكامل", mother: "اسم الأم", dob: "سنة الميلاد", pob: "مكان الميلاد", num: "الرقم المختار", init: "بدء الحساب", diagnosis: "التشخيص الروحي", remedy: "العلاج والبروتوكول", frequency: "التردد الإلهي", vault: "قبو النظام", unlock: "فتح القبو" },
            ha: { oracle: "Bincike", feed: "Labarai", admin: "Shugaba", inquiry: "Zabi Abinda Kake So", name: "Cikakken Suna", mother: "Sunan Mahaifiya", dob: "Shekarar Haihuwa", pob: "Wajen Haihuwa", num: "Zababben Lamba", init: "Fara Hisabi", diagnosis: "Binciken Matsala", remedy: "Magani da Ka'ida", frequency: "Ismullah al-A'zam", vault: "Ma'ajiyar Sirri", unlock: "Bude Ma'ajiya" },
            fr: { oracle: "Oracle", feed: "Flux", admin: "Admin", inquiry: "Type de Demande", name: "Nom Complet", mother: "Nom de la Mère", dob: "Année de Naissance", pob: "Lieu de Naissance", num: "Nombre Choisi", init: "Initialiser Hisab", diagnosis: "Diagnostic Spirituel", remedy: "Remède et Protocole", frequency: "Fréquence Divine", vault: "Voûte Système", unlock: "Déverrouiller" }
        };

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

        const TerminalEngine = ({ value, buruj, planet, inquiryType }) => {
            const [lines, setLines] = useState([]);
            const scrollRef = useRef(null);

            useEffect(() => {
                const baseLines = [
                    '> INITIALIZING QUANTUM SPIRITUAL LINK...',
                    '> SCANNING FREQUENCY: ' + value + ' Hz',
                    '> ABJAD DARUT CALCULATION: COMPLETE',
                    '> BURUJ (ZODIAC): ' + buruj.name.toUpperCase(),
                    '> ELEMENT: ' + buruj.element.toUpperCase(),
                    '> PLANET RULER: ' + planet.name.toUpperCase(),
                    '> INQUIRY TARGET: ' + inquiryType.toUpperCase(),
                    '> STATUS: WAVEFUNCTION COLLAPSE OBSERVED',
                    '> --- QUANTUM PHYSICS ECHO ---',
                    '> ENTANGLEMENT RATIO: ' + (value / 1000).toFixed(3),
                    '> SCHRODINGER STATE: RESOLVED',
                    '> HEISENBERG UNCERTAINTY: MINIMIZED',
                    '> FREQUENCY DETECTED: ' + (value * 1.618).toFixed(2) + ' Hz',
                    '> BINARY WEALTH STREAM: 0101-GOLD-1101',
                    '> SPIRITUAL RESONANCE: ESTABLISHED',
                    '> SYSTEM: DIAGNOSIS READY.'
                ];
                let i = 0;
                const timer = setInterval(() => {
                    if (i < baseLines.length) {
                        setLines(prev => [...prev, baseLines[i]]);
                        i++;
                    } else clearInterval(timer);
                }, 80);
                return () => clearInterval(timer);
            }, [value, buruj, planet, inquiryType]);

            useEffect(() => {
                if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, [lines]);

            return (
                <div ref={scrollRef} className="terminal-box mt-6 text-[#00FF00] opacity-80">
                    {lines.map((l, idx) => <div key={idx} className="mb-1">{l}</div>)}
                    <div className="animate-pulse inline-block w-2 h-3 bg-[#00FF00] ml-1"></div>
                </div>
            );
        };

        const WafqVisualizer = ({ total }) => {
            const base = Math.floor((total - 12) / 3);
            const cells = [base+5, base, base+7, base+2, base+4, base+6, base+3, base+8, base+1];
            return (
                <div className="space-y-4">
                    <p className="text-[10px] uppercase font-black text-[#F27D26]">Personal Wafq (Magic Square)</p>
                    <div className="wafq-grid">
                        {cells.map((c, i) => <div key={i} className="wafq-cell">{c}</div>)}
                    </div>
                </div>
            );
        };

        const App = () => {
            const [lang, setLang] = useState('en');
            const [activeTab, setActiveTab] = useState('calc');
            const [name, setName] = useState('');
            const [mother, setMother] = useState('');
            const [dob, setDob] = useState('');
            const [pob, setPob] = useState('');
            const [chosenNum, setChosenNum] = useState('');
            const [inquiryType, setInquiryType] = useState('success');
            const [result, setResult] = useState(null);
            const [isAdmin, setIsAdmin] = useState(false);
            const [posts, setPosts] = useState([]);
            const [stories, setStories] = useState([]);
            const [archives, setArchives] = useState([]);
            const [adminStats, setAdminStats] = useState(null);
            const [globalCommand, setGlobalCommand] = useState('');
            const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
            const [newPost, setNewPost] = useState({ title: '', content: '', image: '' });
            const [newAdmin, setNewAdmin] = useState({ user: '', pass: '', globalCommand: '' });

            const t = TRANSLATIONS[lang];
            const { abjadMap, buruj, planets, emails, whatsapp } = ${JSON.stringify(clientData)};

            useEffect(() => {
                fetch('/api/blog').then(r => r.json()).then(setPosts);
                fetch('/api/stories').then(r => r.json()).then(setStories);
                fetch('/api/config').then(r => r.json()).then(d => { setGlobalCommand(d.globalCommand); setNewAdmin(prev => ({...prev, globalCommand: d.globalCommand})); });
            }, []);

            const calculateAbjad = (str) => {
                let total = 0;
                const normalized = (str || '').toLowerCase();
                for (let char of normalized) total += abjadMap[char] || 0;
                return total;
            };

            const handleCalculate = async () => {
                if (!name || !mother) return alert("Please enter Name and Mother's Name.");
                
                const nVal = calculateAbjad(name);
                const mVal = calculateAbjad(mother);
                const pVal = calculateAbjad(pob);
                const dVal = calculateAbjad(dob);
                const cVal = parseInt(chosenNum) || 0;
                
                // Add current day's spiritual frequency (0-6)
                const dayFreq = new Date().getDay();

                const grandTotal = nVal + mVal + pVal + dVal + cVal + dayFreq;
                const burujIdx = (grandTotal % 12) === 0 ? 11 : (grandTotal % 12) - 1;
                const planetIdx = (grandTotal % 7) === 0 ? 6 : (grandTotal % 7) - 1;

                const userBuruj = buruj[burujIdx];
                const userPlanet = planets[planetIdx];

                await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: inquiryType }) });

                let diagnosis = "";
                let remedy = "";
                let timing = "";

                if (inquiryType === 'evil_eye') {
                    diagnosis = lang === 'ha' ? "An gano: Shishigi daga idon makiya." : "Detected: High vibrational interference from external envy (Hasad).";
                    remedy = lang === 'ha' ? "Karanta Falaqi da Nasi sau 11 akan ruwa." : "Recite Surah Al-Falaq and An-Nas 11 times over water and wash your face.";
                    timing = "Sunset (Maghrib)";
                } else if (inquiryType === 'magic') {
                    diagnosis = "Detected: Spiritual binding (Sihr) affecting your " + userPlanet.attribute + ". The frequency is tied to " + userBuruj.element + ".";
                    remedy = "Recite Ayatul Kursi 313 times and Surah Al-Baqarah (last 2 verses) 7 times.";
                    timing = "Midnight (Tahajjud)";
                } else if (inquiryType === 'success') {
                    diagnosis = "Detected: Blockage in your path to wealth. Your star " + userBuruj.name + " is currently eclipsed.";
                    remedy = "Recite 'Ya Fattahu Ya Razzaqu' 489 times. Give charity to 7 poor people.";
                    timing = "Thursday Noon";
                } else if (inquiryType === 'jinn') {
                    diagnosis = "Detected: Presence of a " + (grandTotal % 2 === 0 ? 'Maimun' : 'Shamharush') + " class entity in your proximity.";
                    remedy = "Recite Surah Al-Jinn once and 'A'udhu bi-kalimatillah' 100 times.";
                    timing = "After Isha";
                } else if (inquiryType === 'illness') {
                    const isSpiritual = grandTotal % 2 !== 0;
                    diagnosis = isSpiritual ? "Diagnosis: Spiritual ailment (As-Sihr al-Marad)." : "Diagnosis: Physical ailment. Visit a Hospital immediately.";
                    remedy = isSpiritual ? "Recite 'Ya Shafi' 1000 times and Surah Al-Fatihah 7 times over honey." : "Combine medicine with 'Ya Salam' 131 times.";
                    timing = "Morning (Fajr)";
                }

                setResult({
                    total: grandTotal,
                    buruj: userBuruj,
                    planet: userPlanet,
                    diagnosis,
                    remedy,
                    timing,
                    ism: "YA " + (userBuruj.element === 'Fire' ? 'QAHHAR' : userBuruj.element === 'Water' ? 'LATIF' : userBuruj.element === 'Air' ? 'RAFIU' : 'RAZZAQ')
                });
            };

            const handleLogin = async () => {
                const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
                if (r.ok) { 
                    setIsAdmin(true); 
                    fetch('/api/admin/stats').then(r => r.json()).then(setAdminStats);
                    fetch('/api/admin/archives').then(r => r.json()).then(setArchives);
                }
                else alert("Access Denied");
            };

            const handleUpdateAdmin = async () => {
                const r = await fetch('/api/admin/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newAdmin) });
                if (r.ok) { alert("System Updated"); setGlobalCommand(newAdmin.globalCommand); }
            };

            const handleCreateBlog = async () => {
                const r = await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPost) });
                if (r.ok) { const data = await r.json(); setPosts([data, ...posts]); setNewPost({ title: '', content: '', image: '' }); alert("Blog Published"); }
            };

            const handleDeleteStory = async (id) => {
                const r = await fetch('/api/admin/stories/' + id, { method: 'DELETE' });
                if (r.ok) setStories(stories.filter(s => s.id !== id));
            };

            const handleImageUpload = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => setNewPost({ ...newPost, image: reader.result });
                reader.readAsDataURL(file);
            };

            return (
                <div className="min-h-screen flex flex-col">
                    <div className="marquee">
                        <div className="marquee-content">{globalCommand} // {globalCommand}</div>
                    </div>
                    
                    <header className="p-6 glass flex justify-between items-center sticky top-0 z-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#F27D26] rounded-full flex items-center justify-center font-black italic text-black">N</div>
                            <span className="font-black italic uppercase tracking-tighter text-xl">Neural Engine</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex gap-2">
                                {['en', 'ar', 'ha', 'fr'].map(l => (
                                    <button key={l} onClick={() => setLang(l)} className={'w-6 h-6 rounded-full text-[8px] font-black uppercase border ' + (lang === l ? 'bg-[#F27D26] text-black border-[#F27D26]' : 'border-white/20 text-white/40')}>{l}</button>
                                ))}
                            </div>
                            <nav className="flex gap-6 text-[10px] uppercase font-bold text-white/40">
                                <button onClick={() => setActiveTab('calc')} className={activeTab === 'calc' ? 'text-[#F27D26]' : ''}>{t.oracle}</button>
                                <button onClick={() => setActiveTab('feed')} className={activeTab === 'feed' ? 'text-[#F27D26]' : ''}>{t.feed}</button>
                                <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? 'text-[#F27D26]' : ''}>{t.admin}</button>
                            </nav>
                        </div>
                    </header>

                    <main className="flex-1 max-w-6xl mx-auto w-full p-6 py-12">
                        <AnimatePresence mode="wait">
                            {activeTab === 'calc' && (
                                <motion.div key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <GrandPalmLogo />
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                                                <Moon size={20} className="text-[#F27D26]" />
                                                <div>
                                                    <p className="text-[8px] uppercase font-bold text-white/30">Moon Phase</p>
                                                    <p className="text-xs font-black uppercase">Waxing Crescent</p>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
                                                <Star size={20} className="text-[#F27D26]" />
                                                <div>
                                                    <p className="text-[8px] uppercase font-bold text-white/30">Wealth Alignment</p>
                                                    <p className="text-xs font-black uppercase text-green-500">High Frequency</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[10px] uppercase font-black text-[#F27D26]">{t.inquiry}</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['success', 'magic', 'evil_eye', 'jinn', 'illness'].map(type => (
                                                    <button key={type} onClick={() => setInquiryType(type)} className={'p-3 rounded-xl text-[9px] uppercase font-bold border transition-all ' + (inquiryType === type ? 'bg-[#F27D26] text-black border-[#F27D26]' : 'bg-white/5 border-white/10 text-white/40')}>
                                                        {type.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <input value={name} onChange={e => setName(e.target.value)} placeholder={t.name} className="bg-white/5 p-4 rounded-2xl outline-none border border-white/10" />
                                            <input value={mother} onChange={e => setMother(e.target.value)} placeholder={t.mother} className="bg-white/5 p-4 rounded-2xl outline-none border border-white/10" />
                                            <input value={dob} onChange={e => setDob(e.target.value)} placeholder={t.dob} className="bg-white/5 p-4 rounded-2xl outline-none border border-white/10" />
                                            <input value={pob} onChange={e => setPob(e.target.value)} placeholder={t.pob} className="bg-white/5 p-4 rounded-2xl outline-none border border-white/10" />
                                        </div>
                                        <input value={chosenNum} onChange={e => setChosenNum(e.target.value)} type="number" placeholder={t.num} className="w-full bg-white/5 p-4 rounded-2xl outline-none border border-white/10" />
                                        
                                        <button onClick={handleCalculate} className="w-full bg-[#F27D26] text-black py-5 rounded-2xl font-black uppercase italic text-xl shadow-xl shadow-[#F27D26]/20">{t.init}</button>
                                        
                                        {result && <TerminalEngine value={result.total} buruj={result.buruj} planet={result.planet} inquiryType={inquiryType} />}
                                    </div>

                                    <div className="space-y-8">
                                        {result ? (
                                            <div className="glass p-10 rounded-[3rem] space-y-6 border-t-4 border-[#F27D26]">
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-bold text-[#F27D26]">Abjad Value</p>
                                                        <h3 className="text-6xl font-black italic">{result.total}</h3>
                                                    </div>
                                                    <WafqVisualizer total={result.total} />
                                                </div>

                                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                                                    <div className="flex items-center gap-3 text-[#F27D26]">
                                                        <AlertCircle size={18} />
                                                        <span className="text-xs font-black uppercase">{t.diagnosis}</span>
                                                    </div>
                                                    <p className="text-sm text-white/80 italic leading-relaxed">{result.diagnosis}</p>
                                                </div>

                                                <div className="p-6 bg-[#F27D26]/5 rounded-2xl border border-[#F27D26]/20 space-y-4">
                                                    <span className="text-[#F27D26] font-black uppercase text-[10px] block">{t.remedy}</span>
                                                    <p className="text-lg font-bold italic">{result.remedy}</p>
                                                    <div className="text-[10px] text-white/40 uppercase font-black">Method: {result.buruj.remedy_type} // {result.timing}</div>
                                                </div>

                                                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                                    <p className="text-[10px] uppercase font-bold text-white/30 mb-2">{t.frequency}</p>
                                                    <div className="text-xl font-black uppercase text-[#F27D26]">{result.ism}</div>
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
                                <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto pb-24">
                                    {!isAdmin ? (
                                        <div className="glass p-12 rounded-[3rem] max-w-md mx-auto space-y-6">
                                            <h3 className="text-2xl font-black italic uppercase text-center">{t.vault}</h3>
                                            <input type="text" placeholder="Username" className="w-full bg-white/5 p-4 rounded-xl outline-none" onChange={e => setLoginForm({...loginForm, user: e.target.value})} />
                                            <input type="password" placeholder="Password" className="w-full bg-white/5 p-4 rounded-xl outline-none" onChange={e => setLoginForm({...loginForm, pass: e.target.value})} />
                                            <button onClick={handleLogin} className="w-full bg-[#F27D26] text-black py-4 rounded-xl font-black uppercase italic">{t.unlock}</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-12">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="glass p-8 rounded-[2rem] space-y-4">
                                                    <div className="flex items-center gap-3 text-[#F27D26]">
                                                        <BarChart3 size={20} />
                                                        <h4 className="font-black uppercase text-xs">Neural Analytics</h4>
                                                    </div>
                                                    <div className="text-4xl font-black italic">{adminStats?.totalScans} <span className="text-[10px] uppercase font-bold text-white/20">Total Scans</span></div>
                                                    <div className="grid grid-cols-2 gap-2 text-[8px] uppercase font-bold text-white/40">
                                                        {Object.entries(adminStats?.inquiries || {}).map(([k, v]) => <div key={k}>{k}: {v}</div>)}
                                                    </div>
                                                </div>
                                                <div className="glass p-8 rounded-[2rem] space-y-4">
                                                    <div className="flex items-center gap-3 text-[#F27D26]">
                                                        <Settings size={20} />
                                                        <h4 className="font-black uppercase text-xs">Quick Settings</h4>
                                                    </div>
                                                    <input value={newAdmin.globalCommand} onChange={e => setNewAdmin({...newAdmin, globalCommand: e.target.value})} placeholder="Marquee Message" className="w-full bg-white/5 p-3 rounded-xl text-xs outline-none" />
                                                    <button onClick={handleUpdateAdmin} className="w-full bg-white/10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Update System</button>
                                                </div>
                                            </div>

                                            <div className="glass p-10 rounded-[3rem] space-y-6">
                                                <h3 className="text-2xl font-black italic uppercase text-[#F27D26]">Neural Terminal (Echo Mode)</h3>
                                                <div className="terminal-box text-[#00FF00] opacity-80 h-48">
                                                    <div>> SYSTEM STATUS: ONLINE</div>
                                                    <div>> QUANTUM LINK: STABLE</div>
                                                    <div>> FREQUENCY: 2.791 GHz</div>
                                                    <div>> ECHO: {globalCommand}</div>
                                                    <div>> LOG: ADMIN ACCESS GRANTED AT {new Date().toLocaleTimeString()}</div>
                                                    <div className="animate-pulse inline-block w-2 h-3 bg-[#00FF00] ml-1"></div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <input placeholder="Enter Echo Command..." className="flex-1 bg-white/5 p-3 rounded-xl text-xs outline-none border border-white/10" />
                                                    <button className="bg-[#F27D26] text-black px-6 py-3 rounded-xl font-black uppercase text-[10px]">Execute</button>
                                                </div>
                                            </div>

                                            <div className="glass p-10 rounded-[3rem] space-y-6">
                                                <h3 className="text-2xl font-black italic uppercase text-[#F27D26]">Secret Vault (Siri na Waliyyai)</h3>
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
                                                <h3 className="text-2xl font-black italic uppercase text-[#F27D26]">Moderate Seeker Stories</h3>
                                                <div className="space-y-4">
                                                    {stories.map(s => (
                                                        <div key={s.id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                                            <p className="text-xs italic truncate max-w-[70%]">"{s.content}"</p>
                                                            <button onClick={() => handleDeleteStory(s.id)} className="text-red-500 hover:text-red-400"><Trash2 size={16}/></button>
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

                    <footer className="p-12 glass border-t border-white/5 text-center space-y-6">
                        <div className="flex justify-center gap-8 text-[10px] uppercase font-black italic text-[#F27D26]">
                            <span>Ancient Abjad</span>
                            <span>Quantum Echo</span>
                            <span>Divine Command</span>
                        </div>
                        <div className="text-[10px] text-white/40 space-y-2">
                            <p>Contact: {emails.join(' // ')}</p>
                            <p>WhatsApp: {whatsapp}</p>
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
