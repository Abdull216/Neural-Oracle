/**
 * ============================================================================
 * NEURAL ENGINE : Quantum-Spiritual Matrix & White-Hat OS
 * ============================================================================
 * CEO: TICHER
 * Lead Architect: AI Partner
 * 
 * Capabilities initialized:
 * - Public Safe Diagnosis (Basic Stars, Elements, Safe Cures like Ya Latif)
 * - CEO Inner Sanctum (Deep Kashf, Ruhani Calculation, Asma al-Tahatil)
 * - CEO Instruction Manual (How/When to use the Secret Codes)
 * - Advanced Abjad Mathematical Engine (Hisab al-Jummal)
 * - White-Hat Hacker Terminal Simulation
 */

const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== SYSTEM SETUP ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'neural_engine_quantum_ceo_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

// ==================== DATABASE (THE GRIMOIRE) ====================
const DATA_FILE = './neural_db.json';

function getData() {
    let data = {};
    try {
        if (fs.existsSync(DATA_FILE)) {
            const content = fs.readFileSync(DATA_FILE, 'utf8');
            if(content.trim()) data = JSON.parse(content);
        }
    } catch (e) { console.error("[SYSTEM ERROR] Failed to read Neural Matrix:", e); }

    // Enforce default structure safely
    if(!data.adminAuth) data.adminAuth = { user: 'ceo', hash: bcrypt.hashSync('ticher2026', 10) }; // Default Login: ceo / ticher2026
    if(!data.finance) data.finance = { bank: 'Update in Admin', crypto: 'Update in Admin' };
    if(!data.scans) data.scans = 1530; // Social Proof Counter
    if(!data.clientLogs) data.clientLogs = []; // Stores public queries for you to review

    saveData(data);
    return data;
}

function saveData(data) {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch(e) {}
}
getData();

// ==================== THE QUANTUM ABJAD ENGINE ====================
const abjad = {
    'a':1,'b':2,'j':3,'d':4,'h':5,'w':6,'z':7,'x':8,'t':9,'y':10,'k':20,'l':30,'m':40,'n':50,'s':60,'o':70,'f':80,'p':90,'q':100,'r':200,'sh':300,'c':400,'u':6,'v':6,'e':5,'i':10,'g':3,
    'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000
};

// The 12 Stars (Buruj)
const buruj = [
    { id: 1, name: "Aries (Hamal)", element: "Fire", nature: "Hot & Dry" },
    { id: 2, name: "Taurus (Thaur)", element: "Earth", nature: "Cold & Dry" },
    { id: 3, name: "Gemini (Jauza)", element: "Air", nature: "Hot & Wet" },
    { id: 4, name: "Cancer (Sartan)", element: "Water", nature: "Cold & Wet" },
    { id: 5, name: "Leo (Asad)", element: "Fire", nature: "Hot & Dry" },
    { id: 6, name: "Virgo (Sunbula)", element: "Earth", nature: "Cold & Dry" },
    { id: 7, name: "Libra (Mizan)", element: "Air", nature: "Hot & Wet" },
    { id: 8, name: "Scorpio (Aqrab)", element: "Water", nature: "Cold & Wet" },
    { id: 9, name: "Sagittarius (Qaus)", element: "Fire", nature: "Hot & Dry" },
    { id: 10, name: "Capricorn (Jadi)", element: "Earth", nature: "Cold & Dry" },
    { id: 11, name: "Aquarius (Dalwu)", element: "Air", nature: "Hot & Wet" },
    { id: 12, name: "Pisces (Hut)", element: "Water", nature: "Cold & Wet" }
];

// The 99 Names of Allah mapped to their quantum frequencies
const asmaUlHusna = [
    { name: "Ya Allah", value: 66, benefit: "Ultimate connection to the Source." },
    { name: "Ya Rahman", value: 298, benefit: "Attracts deep love and favor." },
    { name: "Ya Razzaq", value: 308, benefit: "Opens blocked doors of wealth." },
    { name: "Ya Latif", value: 129, benefit: "Brings hidden blessings, cures illness." },
    { name: "Ya Wadud", value: 20, benefit: "The ultimate frequency for love." },
    { name: "Ya Fattah", value: 489, benefit: "Breaks all forms of Sihr (Magic)." },
    { name: "Ya Qahhar", value: 306, benefit: "Destroys dark energies and enemies." },
    { name: "Ya Ghani", value: 1060, benefit: "Manifests rapid financial independence." }
];

// CEO SECRET: The 7 Days, Planets, Ruhanis, and the Instruction Manual
const ruhaniMatrix = [
    { 
        day: "Sunday", planet: "Sun", angel: "Ruqyael", ruhani: "Al-Mudhib", tahatil: "Latahtil",
        meaning: "The word 'Latahtil' controls the frequency of Light and Illumination.",
        usage: "Write this word on a white plate with saffron ink. Wash it with Zamzam or rain water and give it to the client to drink. This clears confusion and brings sudden insight and respect from superiors.",
        timing: "Perform this exactly at Sunrise on Sunday for maximum quantum alignment."
    },
    { 
        day: "Monday", planet: "Moon", angel: "Jibraeel", ruhani: "Murrah", tahatil: "Mahatahtil",
        meaning: "The word 'Mahatahtil' controls the frequency of Water, Emotion, and Secrets.",
        usage: "If the client seeks love, marriage, or reconciliation, write this word on parchment and place it near flowing water (or bury it in a moist place).",
        timing: "Perform this on Monday evening when the moon is visible."
    },
    { 
        day: "Tuesday", planet: "Mars", angel: "Samsamael", ruhani: "Al-Ahmar", tahatil: "Qatahtil",
        meaning: "The word 'Qatahtil' controls the frequency of Fire, War, and Destruction.",
        usage: "Use this STRICTLY to destroy Black Magic (Sihr) or stop a violent enemy. Write it on red paper, recite 'Ya Qahhar' over it, and burn it to ashes to return the attack to the sender.",
        timing: "Perform this on Tuesday at midday. (WARNING: Ensure you recite protective verses on yourself before doing this)."
    },
    { 
        day: "Wednesday", planet: "Mercury", angel: "Mikaeel", ruhani: "Barqan", tahatil: "Fatahtil",
        meaning: "The word 'Fatahtil' controls the frequency of Movement, Intelligence, and Business.",
        usage: "If a client wants their business to grow or needs success in exams/interviews. Write it, fold it as a talisman (Laya), and have them carry it in their right pocket or wallet.",
        timing: "Perform this on Wednesday morning."
    },
    { 
        day: "Thursday", planet: "Jupiter", angel: "Sarfayael", ruhani: "Shamhurish", tahatil: "Nahatahtil",
        meaning: "The word 'Nahatahtil' controls the frequency of Expansion, Justice, and Wealth.",
        usage: "For massive wealth attraction or winning a court case. Write this on a green cloth or paper, perfume it with Musk, and keep it in a safe place.",
        timing: "Perform this at dawn on Thursday. It is highly auspicious."
    },
    { 
        day: "Friday", planet: "Venus", angel: "Anyael", ruhani: "Zawba'ah", tahatil: "Jahahtil",
        meaning: "The word 'Jahahtil' controls the frequency of Beauty, Peace, and Healing.",
        usage: "If a client is suffering from spiritual sickness, Hasad (Evil Eye), or Jinn possession (Mass). Write this with saffron, wash it in water, and instruct the client to bathe with it for 3 consecutive days.",
        timing: "Perform this directly after Jum'ah prayers on Friday."
    },
    { 
        day: "Saturday", planet: "Saturn", angel: "Kasfayael", ruhani: "Maimun", tahatil: "Lakhatahtil",
        meaning: "The word 'Lakhatahtil' controls the frequency of Earth, Blockages, and Endings.",
        usage: "Use this to 'tie' or block a situation (e.g., stopping someone from traveling, or freezing an enemy's plans). Write it on lead or heavy dark stone and bury it deep in the earth.",
        timing: "Perform this on Saturday night. (WARNING: This is heavy earth energy. Do not use lightly)."
    }
];

function calculateFrequency(str) {
    let total = 0;
    str = str.toLowerCase().replace(/\\s/g, '');
    for(let char of str) { total += (abjad[char] || 1); }
    return total;
}

function findIsmalAzam(totalSum) {
    let closest = asmaUlHusna[0];
    let minDiff = Math.abs(totalSum - asmaUlHusna[0].value);
    for (let i = 1; i < asmaUlHusna.length; i++) {
        let diff = Math.abs(totalSum - asmaUlHusna[i].value);
        if (diff < minDiff) { closest = asmaUlHusna[i]; minDiff = diff; }
    }
    return closest;
}

// ==================== MIDDLEWARE ====================
function checkAdminAuth(req, res, next) {
    if (req.session.isSuperAdmin) return next();
    res.redirect('/gateway');
}

// ==================== PUBLIC API: SAFE CALCULATION ====================
app.post('/api/public-calculate', (req, res) => {
    const { name, mothersName, intent } = req.body;
    const data = getData();
    
    if(!name || !mothersName) return res.status(400).json({error: "Name parameters missing."});

    // Log the client's query for the CEO to review later
    data.clientLogs.unshift({
        date: new Date().toLocaleString(),
        name, mothersName, intent
    });
    if(data.clientLogs.length > 100) data.clientLogs.pop();
    data.scans++;
    saveData(data);

    const nameFreq = calculateFrequency(name);
    const motherFreq = calculateFrequency(mothersName);
    const totalFreq = nameFreq + motherFreq;

    // Element & Star Calculation (Modulo 12)
    let starIndex = totalFreq % 12;
    if (starIndex === 0) starIndex = 12;
    const star = buruj[starIndex - 1];

    // Build the SAFE Public Reading
    let htmlResult = `
        <h3 style="color:#00ff00; border-bottom:1px dashed #00ff00; padding-bottom:5px;">[ FREQUENCY DECRYPTED ]</h3>
        <p><strong>Target Acquired:</strong> ${name.toUpperCase()}</p>
        <p><strong>Astrological Star:</strong> ${star.name}</p>
        <p><strong>Governing Element:</strong> ${star.element} (${star.nature})</p>
        <br>
    `;

    // Dynamic Safe Answers based on Intent
    if (intent === 'health') {
        htmlResult += `
            <p style="color:#ffcc00;"><strong>DIAGNOSIS:</strong> The calculation indicates a blockage in your energetic field. This may manifest as physical fatigue or mental stress.</p>
            <p><strong>SAFE CURE:</strong> Recite <em>"Ya Latif"</em> 129 times daily. It brings hidden blessings, cures subtle illnesses, and clears the aura.</p>
        `;
    } else if (intent === 'wealth') {
        if (star.element === "Earth" || star.element === "Water") {
            htmlResult += `<p style="color:#00ff00;"><strong>PROGNOSIS:</strong> Your elemental frequency is aligned for wealth. Growth will be steady and permanent.</p>`;
        } else {
            htmlResult += `<p style="color:#ff4444;"><strong>PROGNOSIS:</strong> Your frequency shows fast movement, meaning money leaves your hands quickly. You must practice strict financial discipline.</p>`;
        }
        htmlResult += `<p><strong>SAFE CURE:</strong> Recite <em>"Ya Razzaq"</em> daily to open the blocked doors of sustenance.</p>`;
    } else if (intent === 'relationship') {
        htmlResult += `
            <p style="color:#ffcc00;"><strong>PROGNOSIS:</strong> Relationships require elemental balance. As a ${star.element} sign, you must seek a partner whose nature cools your anger or grounds your thoughts.</p>
            <p><strong>SAFE CURE:</strong> Recite <em>"Ya Wadud"</em> to foster peace, love, and understanding in your home.</p>
        `;
    }

    htmlResult += `
        <div style="background:rgba(0,255,0,0.1); padding:15px; border:1px dashed #00ff00; margin-top:20px;">
            <h4 style="margin:0 0 10px 0; color:#fff;">[ SYSTEM NOTICE ]</h4>
            <p style="font-size:12px; margin:0; color:#ccc;">To unlock your deep Spiritual Secrets (Your Ruling Angel, the exact nature of your enemies, or your personal Ism al-A'zam), a private CEO Consultation is required.</p>
        </div>
    `;

    res.json({ success: true, html: htmlResult });
});

// ==================== CEO API: DEEP KASHF (SECRET) ====================
app.post('/api/ceo-kashf', checkAdminAuth, (req, res) => {
    const { name, mothersName } = req.body;
    
    const nameFreq = calculateFrequency(name);
    const motherFreq = calculateFrequency(mothersName);
    const totalFreq = nameFreq + motherFreq;

    // Star & Element
    let starIndex = totalFreq % 12; if (starIndex === 0) starIndex = 12;
    const star = buruj[starIndex - 1];

    // Planet & Ruhani Calculation (Modulo 7)
    let planetIndex = totalFreq % 7; if(planetIndex === 0) planetIndex = 7;
    const ruhani = ruhaniMatrix[planetIndex - 1];

    // Personal Ism al-A'zam
    const ism = findIsmalAzam(totalFreq);

    // Build the DEEP SECRET Reading with the Instruction Manual
    let htmlResult = `
        <h3 style="color:#ffcc00; border-bottom:1px solid #ffcc00; padding-bottom:5px;">[ INNER SANCTUM: DEEP KASHF ]</h3>
        <p><strong>Client / Target:</strong> ${name.toUpperCase()} (Abjad: ${totalFreq})</p>
        <p><strong>Star & Element:</strong> ${star.name} | ${star.element}</p>
        <hr style="border:1px solid #333;">
        
        <h4 style="color:#00ff00;">🌌 The Celestial Rulers</h4>
        <p style="color:#00ff00;"><strong>Ruling Planet & Day:</strong> ${ruhani.planet} (${ruhani.day})</p>
        <p style="color:#ff4444;"><strong>Ruling Mala'ikah (Angel):</strong> ${ruhani.angel}</p>
        <p style="color:#ff4444;"><strong>Ruling Ruhani (Jinn King):</strong> ${ruhani.ruhani}</p>
        
        <hr style="border:1px solid #333; margin-top:20px;">
        <h4 style="color:#00ff00;">🗝️ The Secret Code (Asma al-Tahatil)</h4>
        <p style="color:#ff4444; font-size:20px; font-weight:bold;">${ruhani.tahatil}</p>
        
        <div style="background:#111; padding:15px; border-left:3px solid #ffcc00; margin-top:15px;">
            <p style="color:#ffcc00; font-size:14px; margin-top:0;"><strong>Meaning:</strong> ${ruhani.meaning}</p>
            <p style="color:#ccc; font-size:12px; margin-bottom:5px;"><strong>How to Use:</strong> ${ruhani.usage}</p>
            <p style="color:#00ff00; font-size:12px; margin-bottom:0;"><strong>Timing:</strong> ${ruhani.timing}</p>
        </div>

        <hr style="border:1px solid #333; margin-top:20px;">
        <h4 style="color:#00ff00;">📿 Personal Divine Frequency (Ism al-A'zam)</h4>
        <p style="color:#fff; font-size:18px;"><strong>${ism.name}</strong></p>
        <p style="color:#ccc; font-size:14px;"><strong>Target Number:</strong> Recite exactly ${ism.value} times daily.</p>
        <p style="color:#ccc; font-size:14px;"><strong>Effect:</strong> ${ism.benefit}</p>
    `;

    res.json({ success: true, html: htmlResult });
});

// ==================== FRONTEND: PUBLIC TERMINAL ====================
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEURAL ENGINE | Public Terminal</title>
    <style>
        body { background-color: #050505; color: #00ff00; font-family: 'Courier New', Courier, monospace; margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; overflow-x: hidden; }
        .terminal-box { width: 100%; max-width: 600px; background: #000; border: 1px solid #00ff00; border-radius: 5px; padding: 30px; box-shadow: inset 0 0 20px rgba(0, 255, 0, 0.1), 0 0 30px rgba(0, 255, 0, 0.2); }
        h1 { margin-top: 0; font-size: 26px; letter-spacing: 4px; text-shadow: 0 0 10px #00ff00; border-bottom: 1px dashed #00ff00; padding-bottom: 10px; text-align:center;}
        .line { margin: 10px 0; font-size: 14px; line-height: 1.6; }
        .cursor { display: inline-block; width: 10px; height: 15px; background: #00ff00; animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        
        .input-group { margin-bottom: 20px; text-align:left;}
        .input-group label { display: block; color: #888; font-size: 12px; margin-bottom: 5px; text-transform:uppercase;}
        .input-group input, .input-group select { width: 100%; padding: 12px; background: #0a0a0a; border: 1px solid #005500; color: #00ff00; font-family: inherit; font-size:16px; box-sizing:border-box;}
        .input-group input:focus, .input-group select:focus { outline:none; border-color: #00ff00; box-shadow: 0 0 10px rgba(0,255,0,0.5);}
        
        button { width: 100%; padding: 15px; background: transparent; color: #00ff00; border: 1px solid #00ff00; font-weight: bold; font-size: 16px; cursor: pointer; font-family: inherit; transition: 0.3s; margin-top:10px; letter-spacing:2px;}
        button:hover { background: #00ff00; color: #000; box-shadow: 0 0 20px #00ff00; }

        #loading { display: none; text-align: center; padding: 20px; font-size: 16px; color:#ffcc00; animation: pulse 1s infinite; }
        @keyframes pulse { 50% { opacity: 0.5; } }

        #result { display: none; margin-top: 20px; padding: 20px; border: 1px dashed #00ff00; background: #0a0a0a; color: #fff; line-height: 1.6; font-size:14px; text-align:left;}
        
        .admin-link { position:fixed; bottom:10px; right:10px; color:#222; text-decoration:none; font-size:10px; transition:0.3s;}
        .admin-link:hover { color:#00ff00;}
    </style>
</head>
<body>
    <div class="terminal-box" id="mainTerminal">
        <h1>[ NEURAL ENGINE ]</h1>
        <div class="line">> SYSTEM STATUS: ONLINE</div>
        <div class="line">> ENTER PARAMETERS FOR SAFE DIAGNOSIS</div>
        <br>
        
        <div class="input-group">
            <label>> Nature of Inquiry</label>
            <select id="tIntent">
                <option value="health">Health, Sickness, or Spiritual Blockage</option>
                <option value="wealth">Wealth, Business, or Success</option>
                <option value="relationship">Marriage, Love, or Compatibility</option>
            </select>
        </div>
        <div class="input-group">
            <label>> Target Given Name</label>
            <input type="text" id="tName" placeholder="e.g. Ibrahim" required>
        </div>
        <div class="input-group">
            <label>> Maternal Origin (Mother's Name)</label>
            <input type="text" id="mName" placeholder="e.g. Aisha" required>
        </div>

        <button onclick="executeCalculation()">INITIATE SCAN</button>

        <div id="loading">> ALIGNING ABJAD FREQUENCIES...</div>
        <div id="result"></div>
    </div>

    <a href="/gateway" class="admin-link">SYS_OVERRIDE</a>

    <script>
        async function executeCalculation() {
            const n = document.getElementById('tName').value;
            const m = document.getElementById('mName').value;
            const i = document.getElementById('tIntent').value;
            
            if(!n || !m) return alert("> ERROR: Name parameters missing.");

            document.getElementById('loading').style.display = 'block';
            document.getElementById('result').style.display = 'none';

            try {
                const res = await fetch('/api/public-calculate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: n, mothersName: m, intent: i })
                });
                const data = await res.json();
                
                setTimeout(() => {
                    document.getElementById('loading').style.display = 'none';
                    if(data.success) {
                        document.getElementById('result').innerHTML = data.html;
                        document.getElementById('result').style.display = 'block';
                    } else { alert("> SYSTEM ERROR."); }
                }, 2500);

            } catch(e) {
                alert("> NETWORK ERROR.");
                document.getElementById('loading').style.display = 'none';
            }
        }
    </script>
</body>
</html>
    `);
});

// ==================== CEO GATEWAY & SUPER ADMIN ====================
app.get('/gateway', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>CEO Gateway</title>
        <style>body{background:#000;color:#ffcc00;font-family:monospace;display:flex;justify-content:center;align-items:center;height:100vh;}
        .box{background:#111;padding:40px;border:1px solid #4b0082;text-align:center;box-shadow:0 0 30px rgba(255,204,0,0.2);}
        input{width:100%;padding:12px;margin:10px 0;background:#000;border:1px solid #555;color:#ffcc00;box-sizing:border-box;}
        button{width:100%;padding:12px;background:#ffcc00;color:#000;border:none;cursor:pointer;font-weight:bold;margin-top:10px;}</style></head>
        <body><div class="box"><h2>[ INNER SANCTUM ]</h2>
        <form method="POST" action="/api/auth-ceo">
            <input type="text" name="user" placeholder="CEO ID" required>
            <input type="password" name="pass" placeholder="Passcode" required>
            <button type="submit">ACCESS MATRIX</button>
        </form></div></body></html>`);
});

app.post('/api/auth-ceo', (req, res) => {
    const { user, pass } = req.body;
    const data = getData();
    if (user === data.adminAuth.user && bcrypt.compareSync(pass, data.adminAuth.hash)) {
        req.session.isSuperAdmin = true; res.redirect('/super-admin');
    } else {
        res.send('<script>alert("Access Denied"); window.location="/gateway";</script>');
    }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });

app.get('/super-admin', checkAdminAuth, (req, res) => {
    const data = getData();
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <title>CEO Inner Sanctum</title>
    <style>
        body { font-family: monospace; background:#050505; color:#00ff00; display:flex; margin:0; height:100vh; }
        .sidebar { width:250px; background:#111; padding:20px; border-right:1px solid #333; }
        .sidebar h2 { color:#ffcc00; margin-bottom:30px;}
        .sidebar a { display:block; padding:12px; color:#888; text-decoration:none; cursor:pointer; border-radius:5px; margin-bottom:5px;}
        .sidebar a:hover, .sidebar a.active { color:#000; background:#ffcc00;}
        .main { flex:1; padding:40px; overflow-y:auto; }
        .panel { display:none; } .panel.active { display:block; }
        h3 { color:#ffcc00; border-bottom:1px dashed #333; padding-bottom:10px; font-size:22px;}
        input, select { width:100%; padding:12px; margin-bottom:15px; background:#000; border:1px solid #333; color:#00ff00; box-sizing:border-box;}
        button { background:#ffcc00; color:#000; border:none; padding:12px 20px; font-weight:bold; cursor:pointer; border-radius:5px;}
        .grid { display:grid; grid-template-columns:1fr 1fr; gap:20px;}
        .log-box { background:#111; padding:15px; border:1px solid #333; border-radius:5px; margin-bottom:10px; font-size:12px; color:#ccc;}
        .terminal { background:#000; color:#0f0; padding:20px; border-radius:8px; height:auto; min-height:300px; border:1px solid #0f0; margin-bottom:20px;}
    </style>
</head>
<body>
    <div class="sidebar">
        <h2>CEO SANCTUM</h2>
        <a onclick="show('kashf')" class="active">👁️ Deep Kashf Engine</a>
        <a onclick="show('logs')">📜 Client Logs</a>
        <a onclick="show('finance')">💳 Payment Settings</a>
        <a onclick="show('sec')">🛡️ Security</a>
        <a href="/" target="_blank" style="margin-top:50px; color:#4b0082;">🌐 View Public Terminal</a>
        <a href="/logout" style="color:red; margin-top:20px;">🚪 Logout</a>
    </div>

    <div class="main">
        <!-- DEEP KASHF PANEL -->
        <div id="kashf" class="panel active">
            <h3>👁️ Deep Kashf Engine (CEO Only)</h3>
            <p style="color:#888; margin-bottom:20px;">Enter client details to reveal their Ruling Angel, Jinn King, Asma al-Tahatil, and Personal Ism al-A'zam. Use the instructions provided to administer spiritual remedies.</p>
            <div class="grid">
                <div>
                    <label>Client Given Name</label>
                    <input type="text" id="cName" placeholder="e.g. Ibrahim">
                    <label>Mother's Given Name</label>
                    <input type="text" id="cmName" placeholder="e.g. Aisha">
                    <button onclick="runDeepKashf()" style="width:100%; margin-top:10px;">REVEAL SECRETS</button>
                </div>
                <div class="terminal" id="kashfResult">
                    [WAITING FOR TARGET INPUT...]
                </div>
            </div>
        </div>

        <!-- CLIENT LOGS -->
        <div id="logs" class="panel">
            <h3>📜 Public Oracle Logs</h3>
            <p style="color:#888;">Recent queries made by the public on the main page. Reach out to these clients to offer them your premium Deep Kashf services.</p>
            ${data.clientLogs.length === 0 ? '<p>No logs yet.</p>' : data.clientLogs.map(l => `
                <div class="log-box">
                    <strong>Date:</strong> ${l.date} | <strong>Target:</strong> ${l.name} (Mother: ${l.mothersName}) | <strong>Intent:</strong> ${l.intent}
                </div>
            `).join('')}
        </div>

        <!-- FINANCE -->
        <div id="finance" class="panel">
            <h3>💳 Sadaqah / Donation Settings</h3>
            <form action="/admin/update-finance" method="POST" style="max-width:500px;">
                <label>Bank Account Details</label>
                <input type="text" name="bank" value="${data.finance.bank}" required>
                <label>Crypto / USDT Address</label>
                <input type="text" name="crypto" value="${data.finance.crypto}" required>
                <button type="submit">Update Records</button>
            </form>
        </div>

        <!-- SECURITY -->
        <div id="sec" class="panel">
            <h3>🛡️ Update CEO Credentials</h3>
            <form action="/admin/change-pass" method="POST" style="max-width:500px;">
                <label>New Username</label>
                <input type="text" name="newUser" value="${data.adminAuth.user}" required>
                <label>New Password</label>
                <input type="password" name="newPass" required>
                <button type="submit">Update Security</button>
            </form>
        </div>
    </div>

    <script>
        function show(id){
            document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
            document.querySelectorAll('.sidebar a').forEach(a=>a.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            event.target.classList.add('active');
        }

        async function runDeepKashf() {
            const n = document.getElementById('cName').value;
            const m = document.getElementById('cmName').value;
            const resBox = document.getElementById('kashfResult');
            
            if(!n || !m) return alert("Enter both names.");
            resBox.innerHTML = "Decrypting Matrix... Please wait.";

            try {
                const res = await fetch('/api/ceo-kashf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: n, mothersName: m })
                });
                const data = await res.json();
                if(data.success) resBox.innerHTML = data.html;
            } catch(e) { resBox.innerHTML = "Network Error."; }
        }
    </script>
</body>
</html>`);
});

// Admin Post Handlers
app.post('/admin/update-finance', checkAdminAuth, (req, res) => {
    const data = getData();
    data.finance = { bank: req.body.bank, crypto: req.body.crypto };
    saveData(data); res.send('<script>alert("Financial Details Saved!"); window.location="/super-admin";</script>');
});

app.post('/admin/change-pass', checkAdminAuth, (req, res) => {
    const data = getData();
    data.adminAuth.user = req.body.newUser; data.adminAuth.hash = bcrypt.hashSync(req.body.newPass, 10);
    saveData(data); res.send('<script>alert("Security Updated!"); window.location="/super-admin";</script>');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==============================================`);
    console.log(`[SYSTEM] NEURAL ENGINE IS LIVE ON PORT ${PORT}`);
    console.log(`[SYSTEM] Public Terminal Active.`);
    console.log(`[SYSTEM] Secret CEO Gateway: /gateway`);
    console.log(`==============================================\n`);
});
