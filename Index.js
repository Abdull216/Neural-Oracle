const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== SYSTEM SETUP ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'falaki_spiritual_engine_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

// Create necessary folders
fs.ensureDirSync(path.join(__dirname, 'uploads', 'images'));
fs.ensureDirSync(path.join(__dirname, 'uploads', 'audio'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Configuration (Separates Images and Audio)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('audio')) {
            cb(null, path.join(__dirname, 'uploads', 'audio'));
        } else {
            cb(null, path.join(__dirname, 'uploads', 'images'));
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } }); // 500MB limit

// ==================== DATABASE ====================
const DATA_FILE = './falaki_db.json';

function getData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const content = fs.readFileSync(DATA_FILE, 'utf8');
            if(content.trim()) return JSON.parse(content);
        }
    } catch (e) { console.error("Error reading database", e); }
    const defaults = {
        adminAuth: { user: 'admin216', hash: bcrypt.hashSync('admin1234', 10) },
        users: [],
        posts: [],
        audios: [],
        stats: { totalScans: 0 }
    };
    saveData(defaults);
    return defaults;
}

function saveData(data) {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch(e) {}
}

// ==================== REUSABLE SNIPPETS ====================
const googleAnalytics = `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-HD01MF5SL9"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-HD01MF5SL9');
    </script>
`;

const magicalLogoHtml = `
    <div class="logo-container">
        <div class="logo-ring"></div>
        <div class="logo-ring2"></div>
        <div class="logo-hand">✋</div>
    </div>
`;

const magicalLogoCss = `
    .logo-container { position:relative; width: 130px; height: 130px; margin: 0 auto 20px; display:flex; align-items:center; justify-content:center; }
    .logo-ring { position:absolute; width: 100%; height: 100%; border: 3px dashed #ffcc00; border-radius: 50%; animation: spin 15s linear infinite; box-shadow: 0 0 30px rgba(255, 204, 0, 0.4), inset 0 0 20px rgba(75, 0, 130, 0.8); }
    .logo-ring2 { position:absolute; width: 75%; height: 75%; border: 2px solid #4b0082; border-radius: 50%; animation: spin-reverse 10s linear infinite; box-shadow: 0 0 15px rgba(75, 0, 130, 0.6);}
    .logo-hand { font-size: 55px; position:relative; z-index:2; filter: drop-shadow(0 0 15px #ffcc00); animation: pulseGlow 2s infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes spin-reverse { 100% { transform: rotate(-360deg); } }
    @keyframes pulseGlow { 50% { transform: scale(1.1); filter: drop-shadow(0 0 25px #ffcc00) drop-shadow(0 0 10px #4b0082); } }
`;

// ==================== AUTH MIDDLEWARE ====================
function checkUserAuth(req, res, next) {
    if (req.session.userId) return next();
    res.redirect('/auth');
}

function checkAdminAuth(req, res, next) {
    if (req.session.isSuperAdmin) return next();
    res.redirect('/admin-login');
}

// ==================== AUTHENTICATION ROUTES ====================
app.get('/auth', (req, res) => {
    if(req.session.userId) return res.redirect('/');
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>FALAKI | Authentication Gateway</title>
            ${googleAnalytics}
            <style>
                body { background: #050505; color: #ffcc00; font-family: 'Courier New', monospace; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; }
                .auth-box { background: #111; padding: 40px; border: 2px solid #4b0082; border-radius: 15px; width: 90%; max-width: 400px; text-align: center; box-shadow: 0 0 30px rgba(75,0,130,0.5); }
                ${magicalLogoCss}
                input { width: 100%; padding: 15px; margin: 10px 0; background: #000; border: 1px solid #333; color: #fff; border-radius: 5px; font-family: inherit; box-sizing:border-box;}
                input:focus { outline:none; border-color: #ffcc00; }
                button { width: 100%; padding: 15px; background: #ffcc00; color: #000; border: none; font-weight: bold; font-size: 16px; cursor: pointer; border-radius: 5px; margin-top: 10px; font-family: inherit; transition:0.3s;}
                button:hover { background: #fff; box-shadow: 0 0 15px #fff;}
                .switch { color: #888; font-size: 12px; margin-top: 20px; display: block; cursor: pointer; text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="auth-box">
                ${magicalLogoHtml}
                <h2 style="letter-spacing:4px; margin-bottom:5px;">FALAKI</h2>
                <p style="color:#888; font-size:12px; margin-bottom:20px;">The Spiritual & AI Archives</p>
                
                <form id="authForm" method="POST" action="/api/register">
                    <input type="text" name="name" id="nameField" placeholder="Enter Full Name" required>
                    <input type="email" name="email" placeholder="Enter Email Address" required>
                    <input type="password" name="password" placeholder="Enter Password" required>
                    <button type="submit" id="btnText">UNLOCK ARCHIVES</button>
                </form>
                <span class="switch" onclick="toggleAuth()">Already have an account? Login here.</span>
            </div>

            <script>
                let isLogin = false;
                function toggleAuth() {
                    isLogin = !isLogin;
                    const form = document.getElementById('authForm');
                    const nameField = document.getElementById('nameField');
                    const btnText = document.getElementById('btnText');
                    const switchText = document.querySelector('.switch');
                    
                    if(isLogin) {
                        form.action = '/api/login';
                        nameField.style.display = 'none';
                        nameField.removeAttribute('required');
                        btnText.textContent = "ENTER ARCHIVES";
                        switchText.textContent = "New seeker? Register here.";
                    } else {
                        form.action = '/api/register';
                        nameField.style.display = 'block';
                        nameField.setAttribute('required', 'true');
                        btnText.textContent = "UNLOCK ARCHIVES";
                        switchText.textContent = "Already have an account? Login here.";
                    }
                }
            </script>
        </body>
        </html>
    `);
});

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const data = getData();
    if (data.users.find(u => u.email === email)) return res.send('<script>alert("Email already registered!"); window.location="/auth";</script>');
    
    const user = { id: Date.now(), name, email, pass: bcrypt.hashSync(password, 10), joined: new Date().toISOString() };
    data.users.push(user);
    saveData(data);
    
    req.session.userId = user.id;
    req.session.userName = user.name;
    res.redirect('/');
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const data = getData();
    const user = data.users.find(u => u.email === email);
    
    if (user && bcrypt.compareSync(password, user.pass)) {
        req.session.userId = user.id;
        req.session.userName = user.name;
        res.redirect('/');
    } else {
        res.send('<script>alert("Invalid Credentials"); window.location="/auth";</script>');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth');
});

// ==================== MAIN APPLICATION (PROTECTED) ====================
app.get('/', checkUserAuth, (req, res) => {
    const data = getData();
    
    // Categorize Posts
    const seerah = data.posts.filter(p => p.category === 'Seerah');
    const jinn = data.posts.filter(p => p.category === 'Jinn');
    const medicine = data.posts.filter(p => p.category === 'Medicine');
    const history = data.posts.filter(p => p.category === 'History');

    const renderCards = (posts) => posts.map(p => `
        <div class="card">
            <img src="${p.image}" class="card-img" alt="${p.title}">
            <div class="card-body">
                <h3>${p.title}</h3>
                <p>${p.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                <a href="/read/${p.id}">Read Manuscript →</a>
            </div>
        </div>
    `).join('') || '<p style="color:#555;">No records found in this archive.</p>';

    const audioHtml = data.audios.map(a => `
        <div class="audio-track">
            <div class="audio-info">🎵 <strong>${a.title}</strong> <span style="font-size:12px; color:#888;">(${a.category})</span></div>
            <audio controls preload="none">
                <source src="${a.url}" type="audio/mpeg">
                Your browser does not support audio.
            </audio>
        </div>
    `).join('') || '<p style="color:#555;">No audio transmissions found.</p>';

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FALAKI - AI Oracle & Spiritual Archives</title>
    ${googleAnalytics}
    <style>
        :root { --gold: #ffcc00; --bg: #050505; --card: #111; --purple: #4b0082; --border: #222;}
        body { background: var(--bg); color: #ccc; font-family: 'Courier New', monospace; margin: 0; padding: 0; scroll-behavior: smooth; overflow-x:hidden;}
        
        ${magicalLogoCss}
        
        /* HEADER & NAV */
        header { text-align: center; padding: 40px 20px; background: #000; border-bottom: 2px solid var(--gold); position:relative;}
        .user-badge { position:absolute; top:20px; right:20px; font-size:12px; color:var(--gold); border:1px solid var(--gold); padding:5px 10px; border-radius:20px; text-decoration:none;}
        h1 { color:var(--gold); letter-spacing: 8px; margin:0 0 5px; font-size:32px; text-shadow: 0 0 10px rgba(255,204,0,0.5);}
        
        nav { display:flex; justify-content:center; background:#0a0a0a; position:sticky; top:0; z-index:100; border-bottom:1px solid var(--border); flex-wrap:wrap;}
        nav a { color:var(--gold); padding:15px 20px; text-decoration:none; font-size: 14px; font-weight:bold; border-bottom:2px solid transparent; transition:0.3s;}
        nav a:hover { background:#111; border-bottom:2px solid var(--purple);}

        .container { max-width: 1200px; margin: auto; padding: 40px 5%; }
        .section-title { color:var(--purple); border-bottom: 2px solid var(--purple); padding-bottom:10px; margin-bottom:30px; font-size:24px; text-transform:uppercase;}
        
        /* SCANNER UI */
        .oracle-box { background:var(--card); border:1px solid var(--gold); padding:30px; border-radius:10px; text-align:center; box-shadow:0 0 40px rgba(255,204,0,0.1); margin-bottom:60px;}
        .scanner-wrap { position: relative; width: 100%; max-width:400px; height: 300px; background: #000; border: 2px solid var(--gold); margin: 0 auto 30px; border-radius:10px; overflow:hidden;}
        video { width: 100%; height: 100%; object-fit: cover; filter: sepia(100%) hue-rotate(250deg) brightness(80%); transform: scaleX(-1); }
        .scan-line { position: absolute; width: 100%; height: 3px; background: #ffcc00; top: 0; animation: scan 2.5s linear infinite; box-shadow: 0 0 20px #ffcc00, 0 0 40px #ffcc00; }
        @keyframes scan { 0% { top: 0; } 50% { top:100%; } 100% { top: 0; } }
        
        .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width:600px; margin:0 auto; text-align:left;}
        input, select { background: #000; border: 1px solid #444; color: var(--gold); padding: 15px; font-family: inherit; font-size:14px; width:100%; box-sizing:border-box;}
        input:focus, select:focus { outline:none; border-color:var(--gold);}
        .btn { background: var(--gold); color: #000; border: none; padding: 18px; cursor: pointer; font-weight: bold; text-transform: uppercase; width: 100%; font-family:inherit; font-size:16px; transition:0.3s;}
        .btn:hover { background: #fff; box-shadow:0 0 15px #fff;}

        /* RESULT BOX */
        #result-box { border: 2px dashed var(--gold); padding: 30px; background:#000; max-width:600px; margin:0 auto; display:none; animation:fadeIn 1s;}
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
        .res-star { font-size:24px; color:var(--gold); margin-bottom:10px;}
        .res-element { font-size:14px; color:#888; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;}
        .res-desc { line-height:1.8; color:#ccc; margin-bottom:30px; font-size:15px; text-align:justify;}

        /* CARDS GRID */
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom:60px;}
        .card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; transition:0.3s;}
        .card:hover { border-color:var(--purple); transform:translateY(-5px);}
        .card-img { width: 100%; height: 180px; object-fit: cover; border-bottom:1px solid var(--border);}
        .card-body { padding: 20px; }
        .card-body h3 { color: var(--gold); margin:0 0 10px; font-size:18px;}
        .card-body p { color: #888; font-size: 13px; line-height: 1.5; margin-bottom: 15px; }
        .card-body a { color: var(--purple); font-weight: bold; text-decoration: none; font-size:14px;}

        /* AUDIO PLAYER */
        .audio-container { background: var(--card); border:1px solid var(--border); padding:30px; border-radius:10px; margin-bottom:60px;}
        .audio-track { display:flex; justify-content:space-between; align-items:center; padding:15px; border-bottom:1px solid #222; flex-wrap:wrap; gap:15px;}
        .audio-track audio { height:40px; outline:none; }

        footer { background: #000; text-align: center; padding: 40px; border-top: 1px solid var(--gold); margin-top:50px;}
        .gateway { position:fixed; bottom:10px; right:10px; font-size:10px; color:#222; text-decoration:none; }
        .gateway:hover { color:var(--gold); }

        @media(max-width:600px) { .input-grid{grid-template-columns:1fr;} nav a{padding:10px; font-size:12px;} }
    </style>
</head>
<body>

    <header>
        <a href="/logout" class="user-badge">🚪 EXIT [${req.session.userName}]</a>
        ${magicalLogoHtml}
        <h1>FALAKI</h1>
        <p style="color:#888;">Neural Ramlu & The Unseen Encyclopedia</p>
    </header>

    <nav>
        <a href="#oracle">🔮 THE ORACLE</a>
        <a href="#seerah">📜 PROPHETS</a>
        <a href="#jinn">👁️ THE UNSEEN</a>
        <a href="#medicine">🌿 MEDICINE</a>
        <a href="#audio">🎧 AUDIO HEALING</a>
    </nav>

    <div class="container">
        
        <!-- THE ORACLE SCANNER -->
        <div id="oracle" class="oracle-box">
            <h2 style="color:var(--gold); margin-bottom:10px; letter-spacing:2px;">BIOMETRIC DESTINY CALCULATOR</h2>
            <p style="color:#888; margin-bottom:30px; font-size:14px;">Utilizing Advanced Hisab al-Jummal (Abjad) & Digital Palmistry</p>
            
            <div class="scanner-wrap">
                <video id="webcam" autoplay playsinline></video>
                <div class="scan-line"></div>
            </div>
            
            <div id="oracle-form">
                <div class="input-grid">
                    <input type="text" id="uName" placeholder="Your Given Name" required>
                    <input type="text" id="mName" placeholder="Mother's Name" required>
                    <input type="text" id="city" placeholder="City of Birth" required>
                    <select id="uLang">
                        <option value="en">Language: English</option>
                        <option value="ha">Language: Hausa</option>
                    </select>
                </div>
                <button class="btn" style="max-width:600px; margin-top:15px;" onclick="runFalaki()">INITIALIZE CALCULATION</button>
            </div>

            <div id="result-box">
                <div class="res-star" id="resTitle"></div>
                <div class="res-element" id="resElement"></div>
                <div class="res-desc" id="resDesc"></div>
                <button class="btn" onclick="location.reload()" style="background:#222; color:white; padding:12px;">Reset Scanner</button>
            </div>
        </div>

        <!-- CATEGORIES -->
        <h2 class="section-title" id="seerah">📜 Seerah (History of Prophets)</h2>
        <div class="grid">${renderCards(seerah)}</div>

        <h2 class="section-title" id="jinn">👁️ Jinn & The Unseen World</h2>
        <div class="grid">${renderCards(jinn)}</div>

        <h2 class="section-title" id="medicine">🌿 Traditional Islamic Medicine</h2>
        <div class="grid">${renderCards(medicine)}</div>

        <h2 class="section-title" id="history">🌍 World & African History</h2>
        <div class="grid">${renderCards(history)}</div>

        <!-- AUDIO PLAYER -->
        <h2 class="section-title" id="audio">🎧 Spiritual Audio & Ruqyah</h2>
        <div class="audio-container">
            ${audioHtml}
        </div>

    </div>

    <footer>
        <div style="color:var(--gold); margin-bottom: 10px; font-size:14px;">
            Spiritual Consultation: abdullahharuna216@gmail.com
        </div>
        <p style="color:#555; font-size:12px;">© 2026 FALAKI CLOUD ARCHIVES</p>
    </footer>

    <!-- SECRET ADMIN GATEWAY -->
    <a href="/super-admin" class="gateway">⚙️ System Access</a>

    <script>
        // AUTHENTIC ABJAD ENGINE (Arabic & English mapping)
        const abjad = {
            'a':1,'b':2,'j':3,'d':4,'h':5,'w':6,'z':7,'x':8,'t':9,'y':10,'k':20,'l':30,'m':40,'n':50,'s':60,'o':70,'f':80,'p':90,'q':100,'r':200,'sh':300,'c':400,'u':6,'v':6,'e':5,'i':10,'g':3,
            'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000
        };

        // ASTROLOGICAL DATA (12 Stars / Buruj)
        const buruj = [
            { id: 1, nameEn: "Aries (Hamal)", nameHa: "Babban Rago (Hamal)", element: "Fire (Wuta)" },
            { id: 2, nameEn: "Taurus (Thaur)", nameHa: "Sa (Thaur)", element: "Earth (Kasa)" },
            { id: 3, nameEn: "Gemini (Jauza)", nameHa: "Tagwaye (Jauza)", element: "Air (Iska)" },
            { id: 4, nameEn: "Cancer (Sartan)", nameHa: "Kaguwa (Sartan)", element: "Water (Ruwa)" },
            { id: 5, nameEn: "Leo (Asad)", nameHa: "Zaki (Asad)", element: "Fire (Wuta)" },
            { id: 6, nameEn: "Virgo (Sunbula)", nameHa: "Budurwa (Sunbula)", element: "Earth (Kasa)" },
            { id: 7, nameEn: "Libra (Mizan)", nameHa: "Sikeli (Mizan)", element: "Air (Iska)" },
            { id: 8, nameEn: "Scorpio (Aqrab)", nameHa: "Kunama (Aqrab)", element: "Water (Ruwa)" },
            { id: 9, nameEn: "Sagittarius (Qaus)", nameHa: "Maharbi (Qaus)", element: "Fire (Wuta)" },
            { id: 10, nameEn: "Capricorn (Jadi)", nameHa: "Bunsuru (Jadi)", element: "Earth (Kasa)" },
            { id: 11, nameEn: "Aquarius (Dalwu)", nameHa: "Guga (Dalwu)", element: "Air (Iska)" },
            { id: 12, nameEn: "Pisces (Hut)", nameHa: "Kifi (Hut)", element: "Water (Ruwa)" }
        ];

        // START CAMERA
        const video = document.getElementById('webcam');
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { video.srcObject = stream; })
            .catch(err => { console.log("Camera access denied or unavailable."); });
        }

        function calculateAbjad(str) {
            let total = 0;
            str = str.toLowerCase().replace(/\\s/g, '');
            for(let char of str) {
                total += (abjad[char] || 1); // Default to 1 if char unknown
            }
            return total;
        }

        function runFalaki() {
            const n = document.getElementById('uName').value;
            const m = document.getElementById('mName').value;
            const c = document.getElementById('city').value;
            const lang = document.getElementById('uLang').value;
            
            if(!n || !m || !c) return alert("All fields are required by the Oracle.");

            document.getElementById('oracle-form').classList.add('hidden');
            document.getElementById('result-box').style.display = 'block';
            document.getElementById('resTitle').innerHTML = "<span style='animation:pulse 1s infinite;'>ANALYZING BIOMETRICS & ABJAD DATA...</span>";

            // Record scan API hit silently
            fetch('/api/track-scan', {method:'POST'});

            setTimeout(() => {
                // Authentic Modulo 12 Logic
                const sum = calculateAbjad(n) + calculateAbjad(m);
                let starIndex = sum % 12;
                if(starIndex === 0) starIndex = 12;
                
                const starData = buruj[sta
