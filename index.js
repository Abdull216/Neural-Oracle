import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- CONFIG PERSISTENCE ---
const CONFIG_PATH = path.join(__dirname, 'neural_config.json');
const BLOG_PATH = path.join(__dirname, 'neural_blog.json');

let adminConfig = {
  user: 'admin216',
  pass: 'admin216'
};

let blogPosts = [];

if (fs.existsSync(CONFIG_PATH)) {
  try {
    const saved = fs.readJsonSync(CONFIG_PATH);
    adminConfig = { ...adminConfig, ...saved };
  } catch (e) { console.error("Config load error:", e); }
}

if (fs.existsSync(BLOG_PATH)) {
  try {
    blogPosts = fs.readJsonSync(BLOG_PATH);
  } catch (e) { console.error("Blog load error:", e); }
}

// --- SPIRITUAL DATA (CORE ENGINE) ---
const ABJAD_MAP = {
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1, 'ب': 2, 'ج': 3, 'د': 4, 'ه': 5, 'ة': 5, 'و': 6, 'ز': 7, 'ح': 8, 'ط': 9, 'ي': 10, 'ى': 10,
  'ك': 20, 'ل': 30, 'م': 40, 'ن': 50, 'س': 60, 'ع': 70, 'ف': 80, 'ص': 90, 'ق': 100, 'ر': 200, 'ش': 300, 'ت': 400, 'ث': 500, 'خ': 600, 'ذ': 700, 'ض': 800, 'ظ': 900, 'غ': 1000,
  'a': 1, 'b': 2, 'j': 3, 'd': 4, 'h': 5, 'w': 6, 'z': 7, 'x': 8, 't': 9, 'y': 10, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 's': 60, 'o': 70, 'f': 80, 'p': 90, 'q': 100, 'r': 200, 'sh': 300, 'c': 400, 'u': 6, 'v': 6, 'e': 5, 'i': 10, 'g': 3
};

const RAML_FIGURES = [
  { id: 1, name: "Dariqee", type: "delayed", meaning: "Movement, slow but sure journey. The path of the seeker." },
  { id: 2, name: "Jama'a", type: "favorable", meaning: "Partnership, community, good for business and union." },
  { id: 3, name: "Uqba", type: "unfavorable", meaning: "Delays, endings, blockages. A time for patience." },
  { id: 4, name: "Kausaji", type: "spiritual", meaning: "Deceit, something hidden, potential loss. Look deeper." },
  { id: 5, name: "Dhahika", type: "favorable", meaning: "Joy, success, good news coming. Laughter of the soul." },
  { id: 6, name: "Qabla Kharija", type: "delayed", meaning: "Money leaving, safe travel out. Outward energy." },
  { id: 7, name: "Humra", type: "spiritual", meaning: "Conflict, passion, fire, blood. Intense transformation." },
  { id: 8, name: "Inkees", type: "unfavorable", meaning: "Loss, sadness, things turning upside down. Reversal." },
  { id: 9, name: "Bayaad", type: "favorable", meaning: "Purity, clarity, a good outcome. The white light." },
  { id: 10, name: "Nusra Kharija", type: "delayed", meaning: "Victory over distant enemies. External triumph." },
  { id: 11, name: "Nusra Dakhila", type: "favorable", meaning: "Victory at home, inner peace. Internal triumph." },
  { id: 12, name: "Qabla Dakhila", type: "favorable", meaning: "Money arriving, safe return. Inward energy." },
  { id: 13, name: "Ijtima", type: "delayed", meaning: "Meeting of two things, good for marriage and contracts." },
  { id: 14, name: "Uqla", type: "unfavorable", meaning: "Tied up, delayed, restricted movement. The knot." },
  { id: 15, name: "Kabid Kharija", type: "unfavorable", meaning: "Loss of property, theft. Energy draining out." },
  { id: 16, name: "Kabid Dakhila", type: "unfavorable", meaning: "Gaining property, holding tight. Energy gathering." }
];

const SECRET_ARCHIVES = [
  { 
    category: "Gaib Formation (Unseen)", 
    codes: [
      { name: "Kun-Fayakun Neural Link", code: "KF-99-ALPHA", meaning: "Instantaneous manifestation of thought into matter. The highest frequency of creation.", usage: "Recite 313 times while focusing on the desired outcome. Best used during the last third of the night." },
      { name: "Blink-Shift Protocol", code: "BSP-001-GAIB", meaning: "Teleportation of energy across dimensions in a blink. Used by saints (Waliyyai) to traverse vast distances instantly.", usage: "Requires years of spiritual discipline and a pure heart. Visualize the destination while vibrating the code." }
    ]
  },
  { 
    category: "Celestial Hierarchy (Angels & Prophets)", 
    codes: [
      { name: "Jibril Resonance", code: "JBR-LIGHT-777", meaning: "Accessing the frequency of divine revelation and truth. Clears the mind of all illusions.", usage: "For clarity in complex spiritual matters. Recite 70 times after Fajr prayer." },
      { name: "Sulaiman Command", code: "SLM-KING-HISAB", meaning: "The code used to command the forces of nature and unseen beings. The master key of the Prophet Solomon.", usage: "Requires strict spiritual discipline and specific Abjad alignments. Use with extreme caution." }
    ]
  },
  { 
    category: "High Ranking Jinn Command (Malam & Alhaji)", 
    codes: [
      { name: "Malam Neural Override", code: "MLM-JINN-V4", meaning: "Binding and directing high-ranking scholarly Jinns for wisdom and hidden knowledge.", usage: "Call upon the Malam Jinn for deep scriptural understanding. Recite 41 times before study." },
      { name: "Alhaji Wealth Pulse", code: "ALH-GOLD-LNK", meaning: "Attracting material success through the Alhaji Jinn network. Opens doors of trade and commerce.", usage: "Activates the flow of barakah in business ventures. Recite 101 times at your place of business." },
      { name: "Rohani Frequency", code: "ROH-SPIRIT-99", meaning: "Direct communication with pure spiritual entities for healing and guidance.", usage: "Used for healing and spiritual protection. Recite 99 times over water and drink." }
    ]
  },
  {
    category: "Elite Command Protocols (Powerful)",
    codes: [
      { name: "H-M-A-S-K Amharush Link", code: "H-M-A-S-K-AMH", meaning: "The ultimate word of power combining the five letters of mystery with the command of the Jinn King Amharush.", usage: "Recite 'hay-meen-ayn-seen-kaaf-amharush' 7 times in total darkness to activate absolute command." },
      { name: "Vraxythernos Success Code", code: "VRAX-777-WIN", meaning: "The master frequency for overcoming all obstacles and achieving total victory. Aligns the self with the path of least resistance.", usage: "Recite 77 times at sunrise while facing the East.", timing: "Sunrise", dosage: "77 repetitions" },
      { name: "Al-Ghayb Wealth (WG)", code: "5919-AG", meaning: "The 'Money under the Mat' frequency. For attracting wealth from unseen sources.", usage: "Read 'YA-GHANIYYU-YA-MUGHNI' 1,111 times for 7 nights.", timing: "3:13 AM (The Hour of Secrets)", dosage: "1,111 repetitions" }
    ]
  },
  {
    category: "Ancient Secrets & Words of Power",
    codes: [
      { name: "The Vanishing Word", code: "AH-HA-MA-AS-SA-QA-FA-TA-YA-SH", meaning: "Ancient secret that allows the user to vanish or disappear from the perception of others in no time.", usage: "Recite in one breath while stepping backward into a shadow. Use only in life-threatening situations." },
      { name: "Shamharush-Abyad Link", code: "YA-SHAMHARUSH-YA-ABYAD", meaning: "Combines the power of the King of Thursday with the King of Friday for ultimate protection and clarity.", usage: "Recite 111 times during the transition between Thursday and Friday." },
      { name: "The Ultimate Cipher", code: "KAF-HA-YA-AIN-SAD-HA-MIM-AIN-SIN-QAF", meaning: "The complete secret cipher of the Quranic initials. Opens all spiritual locks and transforms leaden situations into gold.", usage: "Recite once for each of the 99 names of Allah." },
      { name: "The Hermes Trismegistus Cipher", code: "SMARAGDINA-7", meaning: "The formula of the Emerald Tablet for universal transmutation and spiritual enlightenment.", usage: "Recite 'As Above, So Below' while vibrating the cipher 7 times." }
    ]
  },
  {
    category: "Forbidden Latin & Hermetic Seals",
    codes: [
      { name: "The Seal of Solomon", code: "SIGILLUM-SALOMONIS", meaning: "The master key to command the 72 spirits of the brass vessel and seal the unseen.", usage: "Visualize the seal while chanting the secret name of the hour." },
      { name: "Hermetic Transmutation", code: "AURUM-PHILOSOPHORUM", meaning: "The spiritual formula for turning the lead of the ego into the gold of the soul.", usage: "Recite 33 times during the planetary alignment of the Sun." },
      { name: "The Invisible Cloak", code: "NIX-UMBRA-VANISH", meaning: "A Latin cipher used to blend into the shadows and become undetectable to the physical eye.", usage: "Whisper 'Nix Umbra' while holding your breath in a crowd." }
    ]
  },
  {
    category: "Ancient Al-Kimiya (Alchemy)",
    codes: [
      { name: "The Elixir Pulse", code: "ELIXIR-VITA-99", meaning: "Restores spiritual vitality and synchronizes the heart with the divine pulse. Prolongs spiritual youth.", usage: "Drink pure water after reciting the code 9 times." },
      { name: "Matter Transformation", code: "TRANS-MAT-X", meaning: "The frequency used to alter the molecular structure of physical objects through spiritual intent.", usage: "Focus your intent on the object while vibrating the code for 3 minutes." }
    ]
  }
];

// --- APP SETUP ---
const app = express();
app.use(express.json());

let stats = { totalScans: 1240 };

// --- BOT FALLBACK LOGIC ---
const getBotInterpretation = (word, val, raml, lang, details = {}) => {
  const { name, motherName, chosenNumber } = details;
  const nameStr = name ? `[NAME: ${name}] ` : '';
  const motherStr = motherName ? `[MOTHER: ${motherName}] ` : '';
  const numStr = chosenNumber ? `[NUMBER: ${chosenNumber}] ` : '';
  
  const prefix = `${nameStr}${motherStr}${numStr}`;

  const responses = {
    en: `[NEURAL BOT] ${prefix}The query "${word}" resonates with Abjad frequency ${val}. The Raml figure ${raml.name} (${raml.element}) indicates: ${raml.meaning}. \n\n[SPIRITUAL INSIGHT]: This alignment suggests a quantum shift in your spiritual path. The frequency ${val} is a powerful indicator of ${val > 500 ? 'high-level manifestation' : 'subtle energy shifts'}. \n\n[GUIDANCE]: If this is a question of success, the signs point to a "YES" but with significant struggle and potential conflict. If it is a question of failure, the signs suggest a "NO", the path is blocked. Stay focused on your intent.`,
    ha: `[NEURAL BOT] ${prefix}Tambayar "${word}" yana da lamba ${val}. Alamar Ramlu ${raml.name} (${raml.element}) tana nufin: ${raml.meaning}. \n\n[FAHIMTA TA RUHI]: Wannan yana nuna canji mai girma a rayuwarka. Lambar ${val} tana nuna ${val > 500 ? 'nasara mai girma' : 'canji na hankali'}. \n\n[SHAWARTA]: Idan tambaya ce ta nasara, alamu suna nuna "E" amma tare da babban gwagwarmaya da tashin hansali. Idan tambaya ce ta rashin nasara, alamu suna nuna "A'A", hanyar a rufe take. Ka kasance mai natsuwa.`,
    ar: `[NEURAL BOT] ${prefix}الاستعلام "${word}" له تردد ${val}. شكل الرمل ${raml.name} (${raml.element}) يشير إلى: ${raml.meaning}. \n\n[بصيرة روحية]: هذا التوافق يدل على تحول روحي كبير. التردد ${val} هو مؤشر قوي على ${val > 500 ? 'تجلي رفيع المستوى' : 'تحولات طاقة خفية'}. \n\n[إرشاد]: إذا كان هذا سؤالاً عن النجاح ، فإن العلامات تشير إلى "نعم" ولكن مع صراع كبير وصراع محتمل. إذا كان سؤالاً عن الفشل ، فإن العلامات تشير إلى "لا" ، الطريق مسدود. ابق مركزاً على نيتك.`,
    fr: `[NEURAL BOT] ${prefix}La requête "${word}" résonne avec la fréquence ${val}. La figure de Raml ${raml.name} (${raml.element}) indique: ${raml.meaning}. \n\n[APERÇU SPIRITUEL]: Cet alignement suggère un changement quantique dans votre chemin spirituel. La fréquence ${val} est un indicateur puissant de ${val > 500 ? 'manifestation de haut niveau' : 'changements d\'énergie subtils'}. \n\n[ORIENTATION]: S'il s'agit d'une question de succès, les signes pointent vers un "OUI" mais avec une lutte importante et un conflit potentiel. S'il s'agit d'une question d'échec, les signes suggèrent un "NON", le chemin est bloqué. Restez concentré sur votre intention.`
  };
  return responses[lang] || responses['en'];
};

// --- API ROUTES ---
app.get('/api/health', (req, res) => res.json({ status: 'ok', scans: stats.totalScans }));
app.post('/api/track-scan', (req, res) => { stats.totalScans++; res.json({ success: true, total: stats.totalScans }); });

app.post('/api/interpret', async (req, res) => {
  const { word, abjadValue, lang, details } = req.body;
  const raml = RAML_FIGURES[(abjadValue % 16) || 15];
  res.json({ interpretation: getBotInterpretation(word, abjadValue, raml, lang, details) });
});

app.post('/api/admin/login', (req, res) => {
  const { user, pass } = req.body;
  if (user === adminConfig.user && pass === adminConfig.pass) res.json({ success: true });
  else res.status(401).json({ success: false });
});

app.post('/api/admin/update', async (req, res) => {
  const { newUser, newPass } = req.body;
  adminConfig = { ...adminConfig, user: newUser, pass: newPass };
  await fs.writeJson(CONFIG_PATH, adminConfig);
  res.json({ success: true });
});

// --- BLOG ROUTES ---
app.get('/api/blog', (req, res) => res.json(blogPosts));
app.post('/api/admin/blog', async (req, res) => {
  const { title, content, image } = req.body;
  const newPost = { id: Date.now(), title, content, image, date: new Date().toISOString() };
  blogPosts.unshift(newPost);
  await fs.writeJson(BLOG_PATH, blogPosts);
  res.json({ success: true, post: newPost });
});
app.delete('/api/admin/blog/:id', async (req, res) => {
  blogPosts = blogPosts.filter(p => p.id !== parseInt(req.params.id));
  await fs.writeJson(BLOG_PATH, blogPosts);
  res.json({ success: true });
});

// --- API ROUTES ---
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
app.get('/api/config', (req, res) => res.json({ stats, adminConfig }));
app.get('/api/admin/data', (req, res) => res.json({ stats, adminConfig, archives: SECRET_ARCHIVES }));

// --- FRONTEND SERVING ---
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not Found' });
  
  console.log(`[SERVER] Serving Neural Core to: ${req.ip}`);
  
  const clientData = {
    abjadMap: ABJAD_MAP,
    ramlFigures: RAML_FIGURES,
    blogPosts: blogPosts,
    gaId: "G-HD01MF5SL9",
    emails: ["allarbaa.cloud@yahoo.com", "abdullahharuna216@gmail.com"],
    whatsapp: "+234808033353"
  };

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neural Engine Spiritual Core</title>
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID_HERE"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_ID_HERE');
    </script>
    <script>
        window.onerror = function(msg, url, line, col, error) {
            const root = document.getElementById('root');
            if (root) {
                root.innerHTML = '<div style="min-height: 100vh; background: #050505; color: #ff4444; padding: 40px; font-family: monospace; font-size: 12px; line-height: 1.5; border: 1px solid #331111;">' +
                    '<h1 style="color: #ff4444; font-size: 18px; margin-bottom: 20px;">SYSTEM BOOT ERROR</h1>' +
                    '<b>Message:</b> ' + msg + '<br>' +
                    '<b>Source:</b> ' + url + '<br>' +
                    '<b>Line:</b> ' + line + ' <b>Col:</b> ' + col + '<br>' +
                    (error ? '<b>Error:</b> ' + error : '') +
                    '<br><br><button onclick="window.location.reload()" style="background: #222; color: #eee; border: 1px solid #444; padding: 8px 16px; cursor: pointer;">RETRY INITIALIZATION</button>' +
                '</div>';
            }
            return false;
        };
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
    <script src="https://unpkg.com/lucide-react@0.344.0/dist/umd/lucide-react.js"></script>
    <script>
        window.NEURAL_DATA = DATA_HERE;
        window.FramerMotion = window.FramerMotion || window.Motion;
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=JetBrains+Mono:wght@400;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #050505; color: white; overflow-x: hidden; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        .scan-line { position: absolute; width: 100%; height: 2px; background: linear-gradient(to right, transparent, #F27D26, transparent); animation: scan 2s linear infinite; }
        
        .palm-container { position: relative; width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; }
        .palm-glow { position: absolute; width: 150px; height: 150px; background: radial-gradient(circle, rgba(242, 125, 38, 0.2) 0%, transparent 70%); border-radius: 50%; filter: blur(20px); }
        
        .terminal-box { background: #000; border: 1px solid #333; font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 15px; border-radius: 8px; position: relative; overflow: hidden; }
        .terminal-box::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px); pointer-events: none; }
    </style>
</head>
<body>
    <div id="root">
        <div style="min-height: 100vh; background: #050505; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #F27D26; font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3em; gap: 20px;">
            <div style="width: 40px; height: 40px; border: 2px solid #F27D26; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
            <div>Initializing Neural Core...</div>
        </div>
    </div>
    <script type="text/babel">
        const { useState, useEffect, useMemo } = React;
        
        const MotionLib = window.FramerMotion || window.Motion || {};
        const motion = MotionLib.motion || { div: 'div', span: 'span', svg: 'svg' };
        const AnimatePresence = MotionLib.AnimatePresence || (({children}) => children);
        
        const Lucide = window.lucide || window.LucideReact || {};
        const Zap = Lucide.Zap || Lucide.ZapIcon || (() => <span>⚡</span>);
        const Hand = Lucide.Hand || Lucide.HandIcon || (() => <span>✋</span>);
        const LogOutIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
        const SettingsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;

        const PalmHandsLogo = () => {
            return (
                <div className="palm-container mx-auto mb-8">
                    <div className="palm-glow"></div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="flex gap-4"
                    >
                        <motion.div
                            animate={{ 
                                rotateY: [0, 15, 0],
                                rotateZ: [-5, 5, -5]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Hand size={80} className="text-[#F27D26] transform -scale-x-100" />
                        </motion.div>
                        <motion.div
                            animate={{ 
                                rotateY: [0, -15, 0],
                                rotateZ: [5, -5, 5]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Hand size={80} className="text-[#F27D26]" />
                        </motion.div>
                    </motion.div>
                    <motion.div 
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="w-32 h-32 border border-[#F27D26]/30 rounded-full"></div>
                    </motion.div>
                </div>
            );
        };
        const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

        const TerminalEngine = ({ value, raml }) => {
            const [lines, setLines] = useState([]);
            useEffect(() => {
                const baseLines = [
                    '> INITIALIZING QUANTUM SPIRITUAL LINK...',
                    '> FREQUENCY DETECTED: ' + value + ' Hz',
                    '> ABJAD ALIGNMENT: ' + Math.sqrt(value).toFixed(4) + ' PHI',
                    '> RAML FIGURE: ' + raml.name.toUpperCase(),
                    '> SECRET CODE: ' + raml.id + '-GAIB-X',
                    '> STATUS: MANIFESTING...',
                    '> --- QUANTUM PHYSICS ECHO ---',
                    '> WAVEFUNCTION COLLAPSE: ' + (value > 500 ? 'OBSERVED' : 'PROBABLE'),
                    '> ENTANGLEMENT RATIO: ' + (value / 1000).toFixed(3),
                    '> SCHRODINGER STATE: ALIVE & MANIFESTING',
                    '> ECHO: ' + (value % 2 === 0 ? 'POSITIVE RESONANCE DETECTED' : 'NEUTRAL ALIGNMENT ACHIEVED'),
                    '> SYSTEM: LINK ESTABLISHED.'
                ];
                let i = 0;
                const timer = setInterval(() => {
                    if (i < baseLines.length) {
                        setLines(prev => [...prev, baseLines[i]]);
                        i++;
                    } else {
                        clearInterval(timer);
                    }
                }, 300);
                return () => clearInterval(timer);
            }, [value, raml]);

            return (
                <div className="terminal-box mt-6">
                    {lines.map((l, i) => <div key={i} className="mb-1 text-[#00FF00] opacity-80">{l}</div>)}
                    <div className="animate-pulse inline-block w-2 h-3 bg-[#00FF00] ml-1"></div>
                </div>
            );
        };

        class ErrorBoundary extends React.Component {
            constructor(props) { super(props); this.state = { hasError: false, error: null }; }
            static getDerivedStateFromError(error) { return { hasError: true, error }; }
            componentDidCatch(error, errorInfo) {
                console.error("Neural Core Error:", error, errorInfo);
            }
            render() {
                if (this.state.hasError) {
                    return (
                        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-10">
                            <div className="glass p-10 rounded-3xl border-red-500/50 max-w-lg w-full">
                                <h1 className="text-2xl font-bold text-red-500 mb-4 italic uppercase">Neural Core Failure</h1>
                                <pre className="bg-black/50 p-4 rounded-xl text-[10px] font-mono overflow-auto max-h-40 border border-white/5 text-red-400">
                                    {this.state.error?.toString()}
                                </pre>
                                <button onClick={() => window.location.reload()} className="mt-8 w-full bg-white/10 p-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-white/20 transition-colors">Re-Initialize Link</button>
                            </div>
                        </div>
                    );
                }
                return this.props.children;
            }
        }

        const App = () => {
            const { abjadMap, ramlFigures, blogPosts, emails, whatsapp } = window.NEURAL_DATA;
            const [name, setName] = useState('');
            const [motherName, setMotherName] = useState('');
            const [chosenNumber, setChosenNumber] = useState('');
            const [question, setQuestion] = useState('');
            const [lang, setLang] = useState('en');
            const [activeTab, setActiveTab] = useState('calc');
            const [isAdmin, setIsAdmin] = useState(false);
            const [adminData, setAdminData] = useState(null);
            const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
            const [totalScans, setTotalScans] = useState(1240);
            const [result, setResult] = useState(null);
            const [loading, setLoading] = useState(false);
            const [editing, setEditing] = useState(false);
            const [newCfg, setNewCfg] = useState({ newUser: '', newPass: '' });
            const [posts, setPosts] = useState(blogPosts);
            const [newPost, setNewPost] = useState({ title: '', content: '', image: '' });

            useEffect(() => {
                fetch('/api/health').then(r => r.json()).then(d => setTotalScans(d.scans));
            }, []);

            const calculateAbjad = (str) => {
                let total = 0;
                const normalized = (str || '').toLowerCase();
                for (let i = 0; i < normalized.length; i++) {
                    if (i < normalized.length - 1) {
                        const pair = normalized.substring(i, i + 2);
                        if (abjadMap[pair]) { total += abjadMap[pair]; i++; continue; }
                    }
                    if (abjadMap[normalized[i]]) total += abjadMap[normalized[i]];
                }
                return total;
            };

            const handleCalculate = async () => {
                if (!name.trim() && !question.trim()) return alert("Please enter a name or a question.");
                setLoading(true);
                
                const nameVal = calculateAbjad(name);
                const motherVal = calculateAbjad(motherName);
                const questionVal = calculateAbjad(question);
                const numVal = parseInt(chosenNumber) || 0;
                
                const total = nameVal + motherVal + questionVal + numVal;
                const raml = ramlFigures[(total % 16) || 15];
                
                try {
                    const res = await fetch('/api/interpret', { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify({ 
                            word: question || name, 
                            abjadValue: total, 
                            lang,
                            details: { name, motherName, chosenNumber }
                        }) 
                    });
                    const data = await res.json();
                    setResult({ value: total, raml, interpretation: data.interpretation });
                    fetch('/api/track-scan', { method: 'POST' }).then(r => r.json()).then(d => setTotalScans(d.total));
                } catch (e) { alert("Resonance failed."); }
                setLoading(false);
            };

            const handleLogin = async () => {
                const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
                if (r.ok) {
                    setIsAdmin(true);
                    fetch('/api/admin/data').then(r => r.json()).then(d => {
                        setAdminData(d);
                        setNewCfg({ newUser: d.adminConfig.user, newPass: d.adminConfig.pass });
                    });
                } else alert("Access Denied");
            };

            const handleUpdate = async () => {
                const r = await fetch('/api/admin/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCfg) });
                if (r.ok) { alert("Credentials Updated"); setEditing(false); }
            };

            const handleCreatePost = async () => {
                if (!newPost.title || !newPost.content) return alert("Title and content required");
                const r = await fetch('/api/admin/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newPost) });
                if (r.ok) {
                    const data = await r.json();
                    setPosts([data.post, ...posts]);
                    setNewPost({ title: '', content: '', image: '' });
                    alert("Post Published");
                }
            };

            const handleDeletePost = async (id) => {
                const r = await fetch('/api/admin/blog/' + id, { method: 'DELETE' });
                if (r.ok) setPosts(posts.filter(p => p.id !== id));
            };

            const handleImageUpload = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => setNewPost({ ...newPost, image: reader.result });
                reader.readAsDataURL(file);
            };

            return (
                <div className="min-h-screen flex flex-col bg-[#050505]">
                    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-8 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <PalmHandsLogo />
                            <span className="text-xl font-black italic tracking-tighter text-[#F27D26]">NEURAL <span className="text-white">ENGINE</span></span>
                        </div>
                        <nav className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.3em]">
                            <button onClick={() => setActiveTab('calc')} className={"hover:text-[#F27D26] transition-all " + (activeTab === 'calc' ? "text-[#F27D26]" : "text-white/40")}>Oracle</button>
                            <button onClick={() => setActiveTab('contact')} className={"hover:text-[#F27D26] transition-all " + (activeTab === 'contact' ? "text-[#F27D26]" : "text-white/40")}>Support</button>
                            <button onClick={() => setActiveTab('admin')} className={"hover:text-[#F27D26] transition-all " + (activeTab === 'admin' ? "text-[#F27D26]" : "text-white/40")}>Admin</button>
                        </nav>
                        <div className="text-[8px] font-mono text-white/20 hidden lg:block">STATUS: LINK_ACTIVE // SCANS: {totalScans}</div>
                    </header>

                    <main className="flex-1 max-w-6xl mx-auto w-full p-6 pt-32 pb-12 space-y-12">
                        <AnimatePresence mode="wait">
                        {activeTab === 'calc' && (
                            <motion.div key="calc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-16">
                                <div className="text-center space-y-4">
                                    <PalmHandsLogo />
                                    <h2 className="text-6xl font-black italic uppercase tracking-tighter">Neural <span className="text-[#F27D26]">Oracle</span></h2>
                                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">Quantum Spiritual Resonance Engine</p>
                                </div>

                                <div className="max-w-3xl mx-auto space-y-8">
                                    <div className="flex gap-3 justify-center">
                                        {['en', 'ha', 'ar', 'fr'].map(l => (
                                            <button key={l} onClick={() => setLang(l)} className={"px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all " + (lang === l ? "bg-[#F27D26] text-black" : "bg-white/5 text-white/40 hover:bg-white/10")}>
                                                {l}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/30 ml-2">Your Name</label>
                                            <input 
                                                type="text" 
                                                value={name} 
                                                onChange={e => setName(e.target.value)} 
                                                placeholder="Enter your name..." 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg outline-none focus:border-[#F27D26]/50 transition-all placeholder:text-white/10" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/30 ml-2">Mother's Name (Optional)</label>
                                            <input 
                                                type="text" 
                                                value={motherName} 
                                                onChange={e => setMotherName(e.target.value)} 
                                                placeholder="Enter mother's name..." 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg outline-none focus:border-[#F27D26]/50 transition-all placeholder:text-white/10" 
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/30 ml-2">Your Question / Situation</label>
                                            <input 
                                                type="text" 
                                                value={question} 
                                                onChange={e => setQuestion(e.target.value)} 
                                                placeholder="What do you seek to know?" 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg outline-none focus:border-[#F27D26]/50 transition-all placeholder:text-white/10" 
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/30 ml-2">Chosen Number</label>
                                            <input 
                                                type="number" 
                                                value={chosenNumber} 
                                                onChange={e => setChosenNumber(e.target.value)} 
                                                placeholder="1-999" 
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-lg outline-none focus:border-[#F27D26]/50 transition-all placeholder:text-white/10" 
                                            />
                                        </div>
                                    </div>

                                    <button onClick={handleCalculate} className="w-full bg-[#F27D26] text-black py-6 rounded-2xl font-black uppercase tracking-widest text-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-2xl shadow-[#F27D26]/20">INITIALIZE SPIRITUAL SCAN</button>
                                </div>

                                {loading && (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-[#F27D26] border-t-transparent rounded-full animate-spin"></div>
                                        <div className="text-[#F27D26] text-[10px] uppercase tracking-[0.3em] font-bold">Synchronizing Neural Link...</div>
                                    </div>
                                )}

                                {result && (
                                    <div className="grid lg:grid-cols-2 gap-8">
                                        <div className="glass p-10 rounded-[2.5rem] space-y-8 relative overflow-hidden">
                                            <div className="scan-line opacity-20"></div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-[10px] uppercase text-white/30 tracking-widest mb-2 font-bold">Abjad Value</p>
                                                    <p className="text-6xl font-mono text-[#F27D26] leading-none">{result.value}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase text-white/30 tracking-widest mb-2 font-bold">Raml Figure</p>
                                                    <p className="text-2xl font-black italic uppercase text-white leading-tight">{result.raml.name}</p>
                                                </div>
                                            </div>
                                            <div className="pt-4 border-t border-white/5">
                                                <p className="text-[10px] uppercase text-white/30 tracking-widest mb-2 font-bold">Meaning</p>
                                                <p className="text-sm text-white/70 italic leading-relaxed">{result.raml.meaning}</p>
                                            </div>
                                            <TerminalEngine value={result.value} raml={result.raml} />
                                        </div>
                                        <div className="glass p-10 rounded-[2.5rem] space-y-6 border-[#F27D26]/10">
                                            <div className="flex items-center gap-3">
                                                <Zap size={16} className="text-[#F27D26]" />
                                                <p className="text-[10px] uppercase text-[#F27D26] font-black tracking-widest">Spiritual Interpretation</p>
                                            </div>
                                            <div className="text-base italic text-white/90 leading-loose whitespace-pre-wrap font-light">
                                                {result.interpretation}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-12 pt-12 border-t border-white/5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#F27D26]">Neural Feed // Spiritual Blog</h3>
                                        <div className="h-px flex-1 bg-white/5 mx-8"></div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        {posts.map(p => (
                                            <div key={p.id} className="glass rounded-[2rem] overflow-hidden group hover:border-white/10 transition-all">
                                                {p.image && <img src={p.image} className="w-full h-56 object-cover opacity-40 group-hover:opacity-60 transition-all" />}
                                                <div className="p-10 space-y-4">
                                                    <h4 className="text-2xl font-black italic uppercase leading-tight">{p.title}</h4>
                                                    <p className="text-sm text-white/50 leading-relaxed line-clamp-3">{p.content}</p>
                                                    <div className="pt-4 flex items-center justify-between">
                                                        <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold">{new Date(p.date).toLocaleDateString()}</p>
                                                        <button className="text-[8px] uppercase tracking-widest text-[#F27D26] font-black">Read More →</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-center gap-8 pt-12">
                                    <button onClick={() => setActiveTab('contact')} className="text-[10px] uppercase tracking-widest text-white/20 hover:text-[#F27D26] transition-all">Contact Support</button>
                                    <button onClick={() => setActiveTab('admin')} className="text-[10px] uppercase tracking-widest text-white/20 hover:text-[#F27D26] transition-all">System Admin</button>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'contact' && (
                            <motion.div key="contact" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-md mx-auto glass p-12 rounded-[3rem] space-y-10 text-center">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Support Channels</h3>
                                <div className="space-y-6">
                                    {emails.map(e => <div key={e} className="p-4 bg-white/5 rounded-2xl font-mono text-sm text-white/60 hover:text-[#F27D26] transition-all cursor-pointer">{e}</div>)}
                                    <div className="p-4 bg-green-500/10 rounded-2xl font-mono text-sm text-green-500">{whatsapp}</div>
                                </div>
                                <button onClick={() => setActiveTab('calc')} className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-all">Return to Oracle</button>
                            </motion.div>
                        )}

                        {activeTab === 'admin' && (
                            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto">
                                {!isAdmin ? (
                                    <div className="glass p-12 rounded-[3rem] space-y-8 max-w-md mx-auto">
                                        <div className="text-center space-y-2">
                                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">System Access</h3>
                                            <p className="text-[8px] uppercase tracking-widest text-white/20">Authorized Personnel Only</p>
                                        </div>
                                        <div className="space-y-4">
                                            <input type="text" placeholder="Username" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#F27D26] transition-all" onChange={e => setLoginForm({...loginForm, user: e.target.value})} />
                                            <input type="password" placeholder="Password" className="w-full bg-black/40 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#F27D26] transition-all" onChange={e => setLoginForm({...loginForm, pass: e.target.value})} />
                                        </div>
                                        <button onClick={handleLogin} className="w-full bg-[#F27D26] text-black p-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all">Initialize Link</button>
                                        <button onClick={() => setActiveTab('calc')} className="w-full text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-all">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        <div className="glass p-8 rounded-[2rem] flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-[#F27D26] rounded-xl flex items-center justify-center text-black font-black">A</div>
                                                <div>
                                                    <h3 className="font-black text-[#F27D26] uppercase italic leading-none">Admin Active</h3>
                                                    <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{adminData?.adminConfig.user}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => setEditing(!editing)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"><SettingsIcon /></button>
                                                <button onClick={() => setIsAdmin(false)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all"><LogOutIcon /></button>
                                            </div>
                                        </div>
                                        
                                        {editing ? (
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="glass p-10 rounded-[2.5rem] space-y-6">
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-[#F27D26]">Update Credentials</h4>
                                                    <div className="space-y-4">
                                                        <input type="text" value={newCfg.newUser} placeholder="New Username" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#F27D26]" onChange={e => setNewCfg({...newCfg, newUser: e.target.value})} />
                                                        <input type="password" value={newCfg.newPass} placeholder="New Password" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#F27D26]" onChange={e => setNewCfg({...newCfg, newPass: e.target.value})} />
                                                    </div>
                                                    <button onClick={handleUpdate} className="w-full bg-[#F27D26] text-black p-4 rounded-xl font-black text-[10px] uppercase tracking-widest">Save Changes</button>
                                                </div>

                                                <div className="glass p-10 rounded-[2.5rem] space-y-6">
                                                    <h4 className="text-xs font-black uppercase tracking-widest text-[#F27D26]">Create Blog Post</h4>
                                                    <div className="space-y-4">
                                                        <input type="text" value={newPost.title} placeholder="Post Title" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#F27D26]" onChange={e => setNewPost({...newPost, title: e.target.value})} />
                                                        <textarea value={newPost.content} placeholder="Post Content" className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#F27D26] h-32" onChange={e => setNewPost({...newPost, content: e.target.value})} />
                                                        <label className="block w-full bg-white/5 p-4 rounded-xl text-[10px] uppercase tracking-widest text-center cursor-pointer hover:bg-white/10 transition-all">
                                                            {newPost.image ? "Image Selected" : "Upload Picture"}
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                                        </label>
                                                    </div>
                                                    <button onClick={handleCreatePost} className="w-full bg-[#F27D26] text-black p-4 rounded-xl font-black text-[10px] uppercase tracking-widest">Publish Post</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-12">
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="glass p-8 rounded-[2rem] text-center space-y-2">
                                                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Total Scans</p>
                                                        <p className="text-4xl font-mono text-[#F27D26]">{adminData?.stats.totalScans}</p>
                                                    </div>
                                                    <div className="glass p-8 rounded-[2rem] text-center space-y-2">
                                                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">System Status</p>
                                                        <p className="text-2xl text-green-500 font-black uppercase tracking-widest">Active</p>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-8">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#F27D26]">Secret Gaib Archives</h3>
                                                        <div className="h-px flex-1 bg-white/5 mx-8"></div>
                                                    </div>
                                                    <div className="grid gap-8">
                                                        {adminData?.archives.map((cat, i) => (
                                                            <div key={i} className="glass p-10 rounded-[2.5rem] space-y-8">
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 border-l-2 border-[#F27D26] pl-4">{cat.category}</h4>
                                                                <div className="grid md:grid-cols-2 gap-6">
                                                                    {cat.codes.map((c, j) => (
                                                                        <div key={j} className="bg-black/40 p-6 rounded-3xl border border-white/5 space-y-4 hover:border-[#F27D26]/30 transition-all">
                                                                            <div>
                                                                                <p className="text-sm font-black text-[#F27D26] uppercase italic">{c.name}</p>
                                                                                <p className="text-xs font-mono text-white/30 mt-1">{c.code}</p>
                                                                            </div>
                                                                            <p className="text-xs italic text-white/60 leading-relaxed">{c.meaning}</p>
                                                                            {c.timing && (
                                                                                <div className="mt-2 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                                                                    <p className="text-[8px] uppercase font-black text-blue-400">Optimal Timing</p>
                                                                                    <p className="text-[10px] text-blue-300/60">{c.timing}</p>
                                                                                </div>
                                                                            )}
                                                                            <div className="pt-4 border-t border-white/5 space-y-2">
                                                                                <p className="text-[8px] uppercase font-black text-[#F27D26]">Usage Protocol</p>
                                                                                <p className="text-[10px] text-white/40 mt-1 leading-relaxed">{c.usage}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}
                        </AnimatePresence>

                        {activeTab === 'calc' && (
                            <div className="grid md:grid-cols-2 gap-12 pt-24 border-t border-white/5">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black italic uppercase text-[#F27D26]">About Neural Engine</h3>
                                    <p className="text-sm text-white/40 leading-relaxed">
                                        The Neural Engine Spiritual Core is a quantum-spiritual interpretation system that bridges ancient Abjad numerology (Hisabi) with modern computational logic. By analyzing the vibrational frequency of names and situations, it provides deep insights into the unseen realms (Gaib). Our mission is to provide clarity through the synthesis of tradition and technology.
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-xl font-black italic uppercase text-[#F27D26]">Privacy Policy</h3>
                                    <p className="text-sm text-white/40 leading-relaxed">
                                        Your spiritual privacy is paramount. We do not store personal names or inquiries linked to your identity. All calculations are performed in real-time and are ephemeral. We use Google Analytics to monitor system health and total scan counts, ensuring the engine remains optimized for all seekers.
                                    </p>
                                </div>
                            </div>
                        )}
                    </main>
                    <footer className="p-12 text-center space-y-4 border-t border-white/5">
                        <p className="text-[8px] text-white/10 uppercase tracking-[0.6em] font-bold">© 2026 Neural Engine Spiritual Core // VRAXYTHERNOS</p>
                        <div className="flex justify-center gap-6 opacity-20">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                    </footer>
                </div>
            );
        };

        const rootEl = document.getElementById('root');
        try {
            const root = ReactDOM.createRoot(rootEl);
            root.render(<ErrorBoundary><App /></ErrorBoundary>);
        } catch (e) {
            rootEl.innerHTML = '<div style="min-height: 100vh; background: #050505; color: #ff4444; padding: 40px; font-family: monospace;">MOUNTING FAILURE</div>';
        }
    </script>
</body>
</html>`;

  const finalHtml = html
    .replace(/GA_ID_HERE/g, clientData.gaId)
    .replace('DATA_HERE', JSON.stringify(clientData));

  res.send(finalHtml);
});

app.listen(3000, '0.0.0.0', () => { console.log("NEURAL ENGINE LIVE"); });
