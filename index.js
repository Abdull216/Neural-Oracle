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
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } }); 

// ==================== DATABASE ====================
const DATA_FILE = './falaki_db.json';

// AUTO-HEALER
function getData() {
    let data = {};
    try {
        if (fs.existsSync(DATA_FILE)) {
            const content = fs.readFileSync(DATA_FILE, 'utf8');
            if(content.trim()) data = JSON.parse(content);
        }
    } catch (e) { console.error("Error reading database", e); }

    if(!data.adminAuth) data.adminAuth = { user: 'admin216', hash: bcrypt.hashSync('admin1234', 10) };
    if(!data.contact) data.contact = { email: 'abdullahharuna216@gmail.com', phone: '2348080335353' };
    if(!data.users) data.users = [];
    if(!data.posts) data.posts = [];
    if(!data.audios) data.audios = [];
    if(!data.stats) data.stats = { totalScans: 1204 }; 
    if(!data.aboutContent) data.aboutContent = "FALAKI is an advanced Neural Ramlu and Spiritual Archives platform. We bridge the ancient, profound mathematical systems of Hisab al-Jummal (Abjad) and Ilm al-Raml with modern biometric web technologies.";
    if(!data.privacyContent) data.privacyContent = "Your privacy is our utmost priority. The biometric palm scans performed on this platform utilize local browser memory strictly for the duration of the scan to calculate your astrological alignment. NO video, image, or facial data is ever recorded.";

    saveData(data);
    return data;
}

function saveData(data) {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch(e) {}
}

getData();

// ==================== PLAY STORE (PWA) MANIFEST ====================
app.get('/manifest.json', (req, res) => {
    res.json({
        "name": "Falaki Spiritual Engine",
        "short_name": "Falaki",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#050505",
        "theme_color": "#4b0082",
        "icons": [
            { "src": "https://cdn-icons-png.flaticon.com/512/3208/3208945.png", "sizes": "512x512", "type": "image/png" }
        ]
    });
});

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
    .logo-container { position:relative; width: 140px; height: 140px; margin: 0 auto 20px; display:flex; align-items:center; justify-content:center; }
    .logo-ring { position:absolute; width: 100%; height: 100%; border: 3px dashed #ffcc00; border-radius: 50%; animation: spin 15s linear infinite; box-shadow: 0 0 30px rgba(255, 204, 0, 0.4), inset 0 0 20px rgba(75, 0, 130, 0.8); }
    .logo-ring2 { position:absolute; width: 75%; height: 75%; border: 2px solid #4b0082; border-radius: 50%; animation: spin-reverse 10s linear infinite; box-shadow: 0 0 15px rgba(75, 0, 130, 0.6);}
    .logo-hand { font-size: 60px; position:relative; z-index:2; filter: drop-shadow(0 0 15px #ffcc00); animation: pulseGlow 2s infinite; }
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
            <meta name="theme-color" content="#4b0082">
            <link rel="manifest" href="/manifest.json">
            ${googleAnalytics}
            <style>
                body { background: #050505; color: #ffcc00; font-family: 'Courier New', monospace; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; overflow:hidden;}
                .auth-box { background: #111; padding: 40px; border: 1px solid #4b0082; border-radius: 15px; width: 90%; max-width: 400px; text-align: center; box-shadow: 0 0 40px rgba(75,0,130,0.6); position:relative; z-index:10;}
                ${magicalLogoCss}
                input { width: 100%; padding: 15px; margin: 10px 0; background: #000; border: 1px solid #333; color: #fff; border-radius: 5px; font-family: inherit; box-sizing:border-box;}
                input:focus { outline:none; border-color: #ffcc00; }
                button { width: 100%; padding: 15px; background: #ffcc00; color: #000; border: none; font-weight: bold; font-size: 16px; cursor: pointer; border-radius: 5px; margin-top: 10px; font-family: inherit; transition:0.3s;}
                button:hover { background: #fff; box-shadow: 0 0 20px #fff;}
                .switch { color: #888; font-size: 12px; margin-top: 20px; display: block; cursor: pointer; text-decoration: underline; }
                .bg-stars { position:absolute; width:100%; height:100%; top:0; left:0; background:url('https://www.transparenttextures.com/patterns/stardust.png'); opacity:0.3; z-index:1; pointer-events:none;}
            </style>
        </head>
        <body>
            <div class="bg-stars"></div>
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
                <span class="switch" onclick="toggleAuth()">Already have an access key? Login here.</span>
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
                        switchText.textContent = "Already have an access key? Login here.";
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
    if (data.users.find(u => u.email === email)) return res.send('<script>alert("Email already registered! Please login."); window.location="/auth";</script>');
    
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
    
    const seerah = data.posts.filter(p => p.category === 'Seerah');
    const jinn = data.posts.filter(p => p.category === 'Jinn');
    const medicine = data.posts.filter(p => p.category === 'Medicine');
    const history = data.posts.filter(p => p.category === 'History');

    const renderCards = (posts) => posts.map(p => `
        <div class="card">
            ${p.image ? `<img src="${p.image}" class="card-img" alt="${p.title}">` : ''}
            <div class="card-body">
                <h3>${p.title}</h3>
                <p>${p.content.replace(/<[^>]*>/g, '').substring(0, 80)}...</p>
                <a href="/read/${p.id}">Read Manuscript →</a>
            </div>
        </div>
    `).join('') || '<p style="color:#555; font-size:12px;">No manuscripts found.</p>';

    const audioHtml = data.audios.map(a => `
        <div class="audio-track">
            <div class="audio-info">🎵 <strong>${a.title}</strong> <span style="font-size:12px; color:#888;">(${a.category})</span></div>
            <audio controls preload="none"><source src="${a.url}" type="audio/mpeg"></audio>
        </div>
    `).join('') || '<p style="color:#555; font-size:12px;">No audio transmissions found.</p>';

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FALAKI - AI Oracle & Spiritual Archives</title>
    <meta name="theme-color" content="#4b0082">
    <link rel="manifest" href="/manifest.json">
    ${googleAnalytics}
    <style>
        :root { --gold: #ffcc00; --bg: #050505; --card: #111; --purple: #4b0082; --border: #222;}
        body { background: var(--bg); color: #ccc; font-family: 'Courier New', monospace; margin: 0; padding: 0; scroll-behavior: smooth; overflow-x:hidden;}
        
        ${magicalLogoCss}
        
        header { text-align: center; padding: 40px 20px; background: #000; border-bottom: 2px solid var(--gold); position:relative;}
        .user-badge { position:absolute; top:20px; right:20px; font-size:12px; color:var(--gold); border:1px solid var(--gold); padding:5px 10px; border-radius:20px; text-decoration:none;}
        h1 { color:var(--gold); letter-spacing: 8px; margin:0 0 5px; font-size:32px; text-shadow: 0 0 10px rgba(255,204,0,0.5);}
        
        nav { display:flex; justify-content:center; background:#0a0a0a; position:sticky; top:0; z-index:100; border-bottom:1px solid var(--border); flex-wrap:wrap;}
        nav a { color:var(--gold); padding:15px 20px; text-decoration:none; font-size: 14px; font-weight:bold; border-bottom:2px solid transparent; transition:0.3s;}
        nav a:hover { background:#111; border-bottom:2px solid var(--purple);}

        .container { max-width: 1200px; margin: auto; padding: 40px 5%; }
        .section-title { color:var(--purple); border-bottom: 2px solid var(--purple); padding-bottom:10px; margin-bottom:30px; font-size:24px; text-transform:uppercase;}
        
        .oracle-box { background:var(--card); border:1px solid var(--gold); padding:30px; border-radius:10px; text-align:center; box-shadow:0 0 40px rgba(255,204,0,0.1); margin-bottom:60px;}
        .scanner-wrap { position: relative; width: 100%; max-width:400px; height: 300px; background: #000; border: 2px solid var(--gold); margin: 0 auto 30px; border-radius:10px; overflow:hidden;}
        video { width: 100%; height: 100%; object-fit: cover; filter: sepia(100%) hue-rotate(250deg) brightness(80%); transform: scaleX(1); }
        .scan-line { display:none; position: absolute; width: 100%; height: 3px; background: #ffcc00; top: 0; animation: scan 2.5s linear infinite; box-shadow: 0 0 20px #ffcc00, 0 0 40px #ffcc00; }
        @keyframes scan { 0% { top: 0; } 50% { top:100%; } 100% { top: 0; } }
        
        .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; max-width:600px; margin:0 auto; text-align:left;}
        input, select { background: #000; border: 1px solid #444; color: var(--gold); padding: 15px; font-family: inherit; font-size:14px; width:100%; box-sizing:border-box;}
        input:focus, select:focus { outline:none; border-color:var(--gold);}
        .btn { background: var(--gold); color: #000; border: none; padding: 18px; cursor: pointer; font-weight: bold; text-transform: uppercase; width: 100%; font-family:inherit; font-size:16px; transition:0.3s;}
        .btn:hover { background: #fff; box-shadow:0 0 15px #fff;}

        #result-box { border: 2px dashed var(--gold); padding: 30px; background:#000; max-width:600px; margin:0 auto; display:none; animation:fadeIn 1s;}
        @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
        .res-star { font-size:24px; color:var(--gold); margin-bottom:10px;}
        .res-element { font-size:14px; color:#888; margin-bottom:20px; text-transform:uppercase; letter-spacing:2px;}
        .res-desc { line-height:1.8; color:#ccc; margin-bottom:30px; font-size:15px; text-align:justify; border-left:3px solid var(--purple); padding-left:15px;}
        .ramlu-fig { font-size: 20px; color:#fff; background:var(--purple); padding:5px 10px; border-radius:5px; margin-bottom:15px; display:inline-block;}

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-bottom:60px;}
        .card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; transition:0.3s;}
        .card:hover { border-color:var(--purple); transform:translateY(-5px);}
        .card-img { width: 100%; height: 180px; object-fit: cover; border-bottom:1px solid var(--border);}
        .card-body { padding: 20px; }
        .card-body h3 { color: var(--gold); margin:0 0 10px; font-size:18px;}
        .card-body p { color: #888; font-size: 13px; line-height: 1.5; margin-bottom: 15px; }
        .card-body a { color: var(--purple); font-weight: bold; text-decoration: none; font-size:14px;}

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
        
        <div id="oracle" class="oracle-box">
            <h2 style="color:var(--gold); margin-bottom:10px; letter-spacing:2px;">BIOMETRIC DESTINY CALCULATOR</h2>
            <p style="color:#888; margin-bottom:30px; font-size:14px;">Utilizing Advanced Hisab al-Jummal (Abjad) & Digital Palmistry</p>
            
            <div class="scanner-wrap">
                <video id="webcam" autoplay playsinline></video>
                <div class="scan-line" id="scan-line"></div>
            </div>
            
            <!-- STEP 1: GATES -->
            <div id="gates-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:15px; max-width:600px; margin:0 auto;">
                <button class="btn" style="background:var(--card); color:#fff; border:1px solid var(--purple);" onclick="selectQuestion('travel')">✈️ Travel & Journey</button>
                <button class="btn" style="background:var(--card); color:#fff; border:1px solid var(--purple);" onclick="selectQuestion('wealth')">💰 Wealth & Funding</button>
                <button class="btn" style="background:var(--card); color:#fff; border:1px solid var(--purple);" onclick="selectQuestion('business')">🏢 Business Success</button>
                <button class="btn" style="background:var(--card); color:#fff; border:1px solid var(--purple);" onclick="selectQuestion('encounter')">👥 Encounters & People</button>
                <button class="btn" style="background:var(--card); color:#fff; border:1px solid var(--purple);" onclick="selectQuestion('marriage')">❤️ Marriage Compatibility</button>
                <button class="btn" style="background:var(--card); color:#fff; border:1px solid var(--purple);" onclick="selectQuestion('timing')">🌙 Auspicious Timing</button>
                <button class="btn" style="background:var(--card); color:#fff; border:1px solid var(--purple); grid-column:span 2;" onclick="selectQuestion('custom')">🔮 Write Custom Inquiry</button>
            </div>

            <!-- STEP 2: FORM -->
            <div id="oracle-form" style="display:none;">
                <h3 style="color:var(--gold); margin-top:0;" id="form-title">Enter Spiritual Details</h3>
                <div class="input-grid">
                    <div id="custom-query-box" style="display:none; grid-column:span 2;">
                        <label style="color:#888; font-size:12px;">What do you seek to know?</label>
                        <input type="text" id="uQuery" placeholder="Type your specific question here...">
                    </div>
                    
                    <div>
                        <label style="color:#888; font-size:12px;">Your Name</label>
                        <input type="text" id="uName" placeholder="e.g. Ibrahim" required>
                    </div>
                    <div>
                        <label style="color:#888; font-size:12px;">Mother's Name</label>
                        <input type="text" id="mName" placeholder="e.g. Aisha" required>
                    </div>
                    <div>
                        <label style="color:#888; font-size:12px;">City of Origin</label>
                        <input type="text" id="city" placeholder="e.g. Kano" required>
                    </div>
                    <div>
                        <label style="color:#888; font-size:12px;">Secret Number (1-12)</label>
                        <input type="number" id="uNum" min="1" max="12" placeholder="Choose 1-12" required>
                    </div>
                    <div style="grid-column:span 2;">
                        <label style="color:#888; font-size:12px;">Reading Language</label>
                        <select id="uLang">
                            <option value="en">English Translation</option>
                            <option value="ha">Hausa (Original)</option>
                        </select>
                    </div>
                </div>
                <div style="display:flex; gap:10px; margin-top:15px; max-width:600px; margin-left:auto; margin-right:auto;">
                    <button class="btn" style="background:#333; color:#fff;" onclick="resetToGrid()">BACK</button>
                    <button class="btn" id="scanBtn" onclick="startScan()">SCAN PALM & CALCULATE</button>
                </div>
            </div>

            <!-- STEP 3: RESULT -->
            <div id="result-box">
                <div class="ramlu-fig" id="resRamlu"></div>
                <div class="res-star" id="resTitle"></div>
                <div class="res-element" id="resElement"></div>
                <div class="res-desc" id="resDesc"></div>
                <button class="btn" onclick="resetToGrid()" style="background:#222; color:white; padding:12px;">Consult Again</button>
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
        
        <!-- ABOUT / PRIVACY -->
        <div style="background:var(--card); padding:30px; border:1px solid var(--border); border-radius:10px; margin-top:40px;">
            <h3 style="color:var(--gold); margin-top:0;">About FALAKI</h3>
            <p style="color:#888; font-size:14px; line-height:1.6;">${data.aboutContent}</p>
            <h3 style="color:var(--gold); margin-top:30px;">Privacy Policy</h3>
            <p style="color:#888; font-size:14px; line-height:1.6;">${data.privacyContent}</p>
        </div>

    </div>

    <footer>
        <div style="color:var(--gold); margin-bottom: 10px; font-size:14px;">
            Spiritual Consultation: <a href="mailto:${data.contact.email}" style="color:var(--gold);">${data.contact.email}</a> | <a href="https://wa.me/${data.contact.phone.replace(/[^0-9]/g,'')}" style="color:var(--gold);">${data.contact.phone}</a>
        </div>
        <p style="color:#555; font-size:12px;">© 2026 FALAKI CLOUD ARCHIVES</p>
    </footer>

    <!-- SECRET ADMIN GATEWAY -->
    <a href="/super-admin" class="gateway">⚙️ System Access</a>

    <script>
        // AUTHENTIC ABJAD ENGINE
        const abjad = {
            'a':1,'b':2,'j':3,'d':4,'h':5,'w':6,'z':7,'x':8,'t':9,'y':10,'k':20,'l':30,'m':40,'n':50,'s':60,'o':70,'f':80,'p':90,'q':100,'r':200,'sh':300,'c':400,'u':6,'v':6,'e':5,'i':10,'g':3,
            'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000
        };

        const buruj = [
            { id: 1, nameEn: "Aries (Hamal)", nameHa: "Babban Rago (Hamal)", element: "Fire" },
            { id: 2, nameEn: "Taurus (Thaur)", nameHa: "Sa (Thaur)", element: "Earth" },
            { id: 3, nameEn: "Gemini (Jauza)", nameHa: "Tagwaye (Jauza)", element: "Air" },
            { id: 4, nameEn: "Cancer (Sartan)", nameHa: "Kaguwa (Sartan)", element: "Water" },
            { id: 5, nameEn: "Leo (Asad)", nameHa: "Zaki (Asad)", element: "Fire" },
            { id: 6, nameEn: "Virgo (Sunbula)", nameHa: "Budurwa (Sunbula)", element: "Earth" },
            { id: 7, nameEn: "Libra (Mizan)", nameHa: "Sikeli (Mizan)", element: "Air" },
            { id: 8, nameEn: "Scorpio (Aqrab)", nameHa: "Kunama (Aqrab)", element: "Water" },
            { id: 9, nameEn: "Sagittarius (Qaus)", nameHa: "Maharbi (Qaus)", element: "Fire" },
            { id: 10, nameEn: "Capricorn (Jadi)", nameHa: "Bunsuru (Jadi)", element: "Earth" },
            { id: 11, nameEn: "Aquarius (Dalwu)", nameHa: "Guga (Dalwu)", element: "Air" },
            { id: 12, nameEn: "Pisces (Hut)", nameHa: "Kifi (Hut)", element: "Water" }
        ];

        const ramlFigures = [
            { name: "Dariqee (The Path)", nature: "Good for travel, indicates movement." },
            { name: "Jama'a (The Gathering)", nature: "Good for partnership, crowds, business." },
            { name: "Uqba (The Outcome)", nature: "Indicates delays, the end of a matter." },
            { name: "Kausaji (The Beardless)", nature: "Deceit, something hidden or incomplete." },
            { name: "Dhahika (The Laughing)", nature: "Joy, success, good news coming." },
            { name: "Qabla Kharija (Outward Exit)", nature: "Money leaving, safe travel out." },
            { name: "Humra (Redness)", nature: "Conflict, passion, fire, blood." },
            { name: "Inkees (The Inverted)", nature: "Loss, sadness, things turning upside down." },
            { name: "Bayaad (Whiteness)", nature: "Purity, clarity, a good outcome." },
            { name: "Nusra Kharija (Outward Victory)", nature: "Victory over distant enemies." },
            { name: "Nusra Dakhila (Inward Victory)", nature: "Victory at home, inner peace." },
            { name: "Qabla Dakhila (Inward Entry)", nature: "Money arriving, safe return." },
            { name: "Ijtima (Conjunction)", nature: "Meeting of two things, good for marriage." },
            { name: "Uqla (The Knot)", nature: "Tied up, delayed, restricted movement." },
            { name: "Kabid Kharija (Outward Seizing)", nature: "Loss of property, theft." },
            { name: "Kabid Dakhila (Inward Seizing)", nature: "Gaining property, holding tight." }
        ];

        let selectedGate = '';
        let videoStream = null;

        // START BACK CAMERA (if available)
        const video = document.getElementById('webcam');
        function initCamera() {
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then(stream => { videoStream = stream; video.srcObject = stream; })
                .catch(err => { 
                    navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
                        videoStream = s; video.srcObject = s;
                    }).catch(e => console.log("No camera."));
                });
            }
        }
        initCamera();

        function stopCamera() {
            if(videoStream) { videoStream.getTracks().forEach(track => track.stop()); videoStream = null; }
        }

        function selectQuestion(gate) {
            selectedGate = gate;
            document.getElementById('gates-grid').style.display = 'none';
            document.getElementById('user-form').style.display = 'block';
            
            const titles = {
                'travel': '✈️ Travel & Journey Calculation', 'wealth': '💰 Wealth Calculation', 'business': '🏢 Business Calculation',
                'destiny': '⏳ Destiny Calculation', 'encounter': '👥 Encounter Calculation', 'marriage': '❤️ Marriage Compatibility',
                'timing': '🌙 Auspicious Timing', 'custom': '🔮 Custom Oracle Inquiry'
            };
            document.getElementById('form-title').innerText = titles[gate];
            document.getElementById('custom-query-box').style.display = gate === 'custom' ? 'block' : 'none';
        }

        function resetToGrid() {
            document.getElementById('gates-grid').style.display = 'grid';
            document.getElementById('user-form').style.display = 'none';
            document.getElementById('result-box').style.display = 'none';
            document.getElementById('scanBtn').innerText = "SCAN PALM & CALCULATE";
            document.getElementById('scanBtn').style.background = "var(--gold)";
            document.getElementById('scanBtn').style.color = "#000";
            document.getElementById('scan-line').style.display = "none";
            document.getElementById('uName').value = '';
            document.getElementById('mName').value = '';
            document.getElementById('city').value = '';
            document.getElementById('uNum').value = '';
            document.getElementById('uQuery').value = '';
            initCamera();
        }

        function calculateAbjad(str) {
            let total = 0;
            str = str.toLowerCase().replace(/\\s/g, '');
            for(let char of str) { total += (abjad[char] || 1); }
            return total;
        }

        function startScan() {
            const n = document.getElementById('uName').value;
            const m = document.getElementById('mName').value;
            const c = document.getElementById('city').value;
            const num = parseInt(document.getElementById('uNum').value);
            
            if(!n || !m || !c || !num || num < 1 || num > 12) return alert("All fields are required, and number must be 1-12.");
            if(selectedGate === 'custom' && !document.getElementById('uQuery').value) return alert("Please enter your question.");

            const scanBtn = document.getElementById('scanBtn');
            const scanLine = document.getElementById('scan-line');
            
            scanBtn.innerText = "SCANNING PALM BIOMETRICS...";
            scanBtn.style.background = "#4b0082";
            scanBtn.style.color = "#fff";
            scanLine.style.display = "block";

            fetch('/api/track-scan', {method:'POST'});

            setTimeout(() => {
                stopCamera();
                document.getElementById('user-form').style.display = 'none';
                generateResult();
            }, 3500); 
        }

        function generateResult() {
            const n = document.getElementById('uName').value;
            const m = document.getElementById('mName').value;
            const c = document.getElementById('city').value;
            const num = parseInt(document.getElementById('uNum').value);
            const q = document.getElementById('uQuery').value;
            const lang = document.getElementById('uLang').value;
            
            // DYNAMIC ABJAD MATH
            let baseSum = calculateAbjad(n) + calculateAbjad(m) + calculateAbjad(c);
            let gateVal = calculateAbjad(selectedGate);
            if(selectedGate === 'custom') gateVal += calculateAbjad(q);
            
            let totalSum = baseSum + gateVal + num;

            // Find Star (1-12)
            let starIndex = totalSum % 12;
            if(starIndex === 0) starIndex = 12;
            const starData = buruj[starIndex - 1];

            // Find Raml Figure (1-16)
            let ramlIndex = totalSum % 16;
            if(ramlIndex === 0) ramlIndex = 16;
            const ramlData = ramlFigures[ramlIndex - 1];

            const isFire = starData.element === 'Fire';
            const isWater = starData.element === 'Water';
            const isEarth = starData.element === 'Earth';
            const isAir = starData.element === 'Air';

            let resEn = "Based on the exact calculation of your details (Abjad Value: " + totalSum + "), your reading is guided by the star of <strong>" + starData.nameEn + "</strong> and the Raml figure of <strong>" + ramlData.name + "</strong>.<br><br>";
            let resHa = "Bisa tsantsar lissafin bayanan ka (Adadin Abjad: " + totalSum + "), duba dinka ya fada kan tauraron <strong>" + starData.nameHa + "</strong> da kofofin Ramlu na <strong>" + ramlData.name + "</strong>.<br><br>";

            // DYNAMIC RESPONSES PER GATE
            if (selectedGate === 'marriage') {
                if(isFire) {
                    resEn += "Fire indicates passion but potential conflict. The figure of " + ramlData.name + " suggests: " + ramlData.nature + " Look for an Earth partner to stabilize you.";
                    resHa += "Wuta tana nuna kauna amma akwai zafin rai. Siffar " + ramlData.name + " tana nufin: " + ramlData.nature + " Nemi tauraron Kasa zai fi maka.";
                } else if(isWater) {
                    resEn += "Water flows and nurtures. The figure of " + ramlData.name + " suggests: " + ramlData.nature + " You need Earth to build a home. Avoid Fire.";
                    resHa += "Ruwa yana nuna sanyi da ciyarwa. Siffar " + ramlData.name + " tana nufin: " + ramlData.nature + " Kana bukatar Kasa don gina zuriya. Nisanci Wuta.";
                } else if(isEarth) {
                    resEn += "Earth is stable and enduring. The figure of " + ramlData.name + " suggests: " + ramlData.nature + " Water brings you wealth. Avoid Air's instability.";
                    resHa += "Kasa tana nuna tabbatacce. Siffar " + ramlData.name + " tana nufin: " + ramlData.nature + " Ruwa yana kawo maka arziki. Nisanci Iska.";
                } else {
                    resEn += "Air is free and intellectual. The figure of " + ramlData.name + " suggests: " + ramlData.nature + " You need Fire to expand. Water will drown your spirit.";
                    resHa += "Iska tana nuna yanci. Siffar " + ramlData.name + " tana nufin: " + ramlData.nature + " Kana bukatar Wuta. Ruwa zai kashe karsashin ka.";
                }
            } 
            else if (selectedGate === 'business' || selectedGate === 'wealth') {
                resEn += "For your financial inquiry: As a " + starData.element + " element, your path is unique. The emergence of " + ramlData.name + " indicates: " + ramlData.nature + " Trust your element's natural pace.";
                resHa += "Dangane da neman arzikinka: A matsayinka na mai dabi'ar " + starData.element + ", hanyarka daban ce. Bayyanar siffar " + ramlData.name + " tana nuna: " + ramlData.nature + " Biyewa dabi'arka.";
            }
            else if (selectedGate === 'travel') {
                if(ramlData.name === "Dariqee (The Path)" || ramlData.name === "Qabla Kharija (Outward Exit)") {
                    resEn += "The stars align perfectly for movement. " + ramlData.nature + " Proceed with your journey.";
                    resHa += "Taurari sun bada dama. " + ramlData.nature + " Ci gaba da shirin tafiyarka.";
                } else if (ramlData.name === "Uqla (The Knot)" || ramlData.name === "Inkees (The Inverted)") {
                    resEn += "Warning: " + ramlData.nature + " It is highly advised to delay travel. Give charity before moving.";
                    resHa += "Gargadi: " + ramlData.nature + " An fi so ka daga tafiyar. Kuma kayi sadaka kafin ka fita.";
                } else {
                    resEn += "The journey is neutral. The figure reveals: " + ramlData.nature;
                    resHa += "Tafiyar tana da matsakaicin tsari. Ramlu ya nuna: " + ramlData.nature;
                }
            }
            else {
                resEn += "For your specific inquiry, the unseen calculation brings forth " + ramlData.name + ". This means: " + ramlData.nature + " Let your " + starData.element + " nature guide your next steps.";
                resHa += "Dangane da tambayarka, lissafin ya fito da " + ramlData.name + ". Wannan yana nufin: " + ramlData.nature + " Ka bar asalin dabi'arka ta " + starData.element + " ta jagorance ka.";
            }

            document.getElementById('result-ui').style.display = 'block';
            document.getElementById('resRamlu').innerText = "RAMLU: " + ramlData.name;
            document.getElementById('resTitle').innerText = "⭐ " + (lang === 'ha' ? starData.nameHa : starData.nameEn);
            document.getElementById('resElement').innerText = "ELEMENT: " + starData.element;
            document.getElementById('resDesc').innerHTML = lang === 'ha' ? resHa : resEn;
        }
    </script>
</body>
</html>
    `);
});

// Admin Post Handlers
app.post('/admin/post-article', checkAdminAuth, upload.single('image'), (req, res) => {
    const data = getData();
    data.posts.unshift({
        id: Date.now(),
        title: req.body.title,
        category: req.body.category,
        content: req.body.content.replace(/\n/g, '<br>'),
        image: req.file ? `/uploads/images/${req.file.filename}` : null,
        date: new Date().toISOString(),
        views: 0
    });
    saveData(data);
    res.send('<script>alert("Manuscript Encrypted!"); window.location="/super-admin";</script>');
});

app.get('/admin/delete-post/:id', checkAdminAuth, (req, res) => {
    const data = getData(); data.posts = data.posts.filter(p => p.id != req.params.id); saveData(data); res.redirect('/super-admin');
});

app.post('/admin/upload-audio', checkAdminAuth, upload.single('audio'), (req, res) => {
    if (!req.file) return res.send('<script>alert("No file!"); window.location="/super-admin";</script>');
    const data = getData();
    data.audios.unshift({
        id: Date.now(),
        title: req.body.title,
        category: req.body.category,
        url: `/uploads/audio/${req.file.filename}`
    });
    saveData(data);
    res.send('<script>alert("Audio Uploaded!"); window.location="/super-admin";</script>');
});

app.get('/admin/delete-audio/:id', checkAdminAuth, (req, res) => {
    const data = getData(); data.audios = data.audios.filter(a => a.id != req.params.id); saveData(data); res.redirect('/super-admin');
});

app.post('/admin/update-contact', checkAdminAuth, (req, res) => {
    const data = getData();
    data.contact = { email: req.body.email, phone: req.body.phone };
    data.aboutContent = req.body.aboutContent;
    data.privacyContent = req.body.privacyContent;
    saveData(data);
    res.send('<script>alert("Contact & Texts Updated!"); window.location="/super-admin";</script>');
});

app.post('/admin/change-pass', checkAdminAuth, (req, res) => {
    const data = getData();
    data.adminAuth.user = req.body.newUser;
    data.adminAuth.hash = bcrypt.hashSync(req.body.newPass, 10);
    saveData(data);
    res.send('<script>alert("Security Updated!"); window.location="/super-admin";</script>');
});

app.get('/admin/reset-scans', checkAdminAuth, (req, res) => {
    const data = getData();
    data.stats.totalScans = 0;
    saveData(data);
    res.redirect('/super-admin');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`👁️ FALAKI SYSTEM ONLINE on http://localhost:${PORT}`);
    console.log(`⚙️ CEO Admin Panel: http://localhost:${PORT}/super-admin`);
});
