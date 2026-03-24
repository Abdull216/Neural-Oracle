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

function getData() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const content = fs.readFileSync(DATA_FILE, 'utf8');
            if(content.trim()) return JSON.parse(content);
        }
    } catch (e) { console.error("Error reading database", e); }
    const defaults = {
        adminAuth: { user: 'admin216', hash: bcrypt.hashSync('admin1234', 10) },
        contact: { email: 'abdullahharuna216@gmail.com', phone: '+2348080335353' },
        users: [],
        posts: [],
        audios: [],
        stats: { totalScans: 0 },
        aboutContent: "FALAKI is an advanced Neural Ramlu and Spiritual Archives platform. We bridge the ancient, profound mathematical systems of Hisab al-Jummal (Abjad) and Ilm al-Raml with modern biometric web technologies. This platform was created to provide deep spiritual insights, historical archives of the Unseen, and a secure repository for traditional medicine and prophetic history.",
        privacyContent: "Your privacy is our utmost priority. The biometric palm scans performed on this platform utilize local browser memory strictly for the duration of the scan to calculate your astrological alignment. NO video, image, or facial data is ever recorded, transmitted, or saved to our servers. Your spiritual inquiries remain between you and the Oracle."
    };
    saveData(defaults);
    return defaults;
}

function saveData(data) {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch(e) {}
}

// ==================== REUSABLE SNIPPETS ====================
const googleAnalytics = `
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
    
    const renderCards = (cat) => {
        const posts = data.posts.filter(p => p.category === cat);
        return posts.map(p => `
            <div class="card">
                ${p.image ? `<img src="${p.image}" class="card-img" alt="${p.title}">` : ''}
                <div class="card-body">
                    <h3>${p.title}</h3>
                    <p>${p.content.replace(/<[^>]*>/g, '').substring(0, 80)}...</p>
                    <a href="/read/${p.id}">Read Manuscript →</a>
                </div>
            </div>
        `).join('') || '<p style="color:#555; font-size:12px;">No manuscripts found.</p>';
    };

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
    ${googleAnalytics}
    <style>
        :root { --gold: #ffcc00; --bg: #050505; --card: #111; --purple: #4b0082; --border: #222;}
        body { background: var(--bg); color: #ccc; font-family: 'Courier New', monospace; margin: 0; padding: 0; scroll-behavior: smooth; overflow-x:hidden;}
        
        ${magicalLogoCss}
        
        /* TOP MENU NAV */
        nav.top-nav { background: #000; border-bottom: 1px solid var(--purple); display:flex; justify-content:space-between; align-items:center; padding: 15px 5%; position:sticky; top:0; z-index:1000; box-shadow:0 4px 15px rgba(75,0,130,0.4);}
        .nav-brand { font-size: 20px; font-weight: bold; color: var(--gold); letter-spacing: 2px; text-decoration:none;}
        .nav-links { display:flex; gap: 20px; align-items:center;}
        .nav-links a { color: #fff; text-decoration:none; font-size: 14px; font-weight:bold; transition:0.3s;}
        .nav-links a:hover { color: var(--gold); }
        .admin-btn { background:var(--purple); color:#fff !important; padding:8px 15px; border-radius:5px;}
        .admin-btn:hover { background:#ffcc00; color:#000 !important;}

        /* MAIN LAYOUT GRID */
        .layout { display: grid; grid-template-columns: 250px 1fr 300px; gap: 30px; max-width: 1400px; margin: 40px auto; padding: 0 5%; }
        @media(max-width: 1024px) { .layout { grid-template-columns: 1fr; } .left-sidebar, .right-sidebar { display:none; } }

        /* CENTER CONTENT */
        .center-content { display:flex; flex-direction:column; align-items:center; }
        
        /* ORACLE UI */
        .oracle-header { text-align:center; margin-bottom:40px;}
        .oracle-header h1 { color:var(--gold); letter-spacing:8px; font-size:36px; margin:0;}
        .oracle-header p { color:#888; font-size:14px; margin-top:5px;}

        /* STEP 1: GATES GRID */
        .gates-grid { display:grid; grid-template-columns:1fr 1fr; gap:15px; width:100%; max-width:600px;}
        .gate-btn { background:var(--card); border:1px solid var(--purple); padding:20px; border-radius:10px; color:#fff; font-family:inherit; font-size:15px; font-weight:bold; cursor:pointer; transition:0.3s; text-align:left; display:flex; align-items:center; gap:10px;}
        .gate-btn:hover { background:var(--purple); border-color:var(--gold); transform:translateY(-3px); box-shadow:0 10px 20px rgba(75,0,130,0.5);}
        .gate-icon { font-size:24px; }

        /* STEP 2: FORM */
        #user-form { display:none; width:100%; max-width:500px; background:var(--card); padding:30px; border-radius:10px; border:1px solid var(--gold); box-shadow:0 0 30px rgba(255,204,0,0.1);}
        .input-group { margin-bottom:15px; text-align:left;}
        .input-group label { display:block; color:#888; font-size:12px; margin-bottom:5px; text-transform:uppercase;}
        .input-group input, .input-group select { width:100%; padding:12px; background:#000; border:1px solid #333; color:var(--gold); font-family:inherit; box-sizing:border-box;}
        .input-group input:focus { outline:none; border-color:var(--gold); }

        /* STEP 3: SCANNER */
        #scanner-ui { display:none; width:100%; max-width:500px; text-align:center;}
        .scanner-wrap { position: relative; width: 100%; height: 350px; background: #000; border: 2px solid var(--gold); margin: 0 auto 20px; border-radius:10px; overflow:hidden;}
        /* NOTE: ScaleX(1) for back camera so it isn't mirrored! */
        video { width: 100%; height: 100%; object-fit: cover; filter: sepia(100%) hue-rotate(250deg) brightness(90%); transform: scaleX(1); }
        .scan-line { display:none; position: absolute; width: 100%; height: 4px; background: #ffcc00; top: 0; animation: scan 2s linear infinite; box-shadow: 0 0 20px #ffcc00, 0 0 40px #ffcc00; }
        @keyframes scan { 0% { top: 0; } 50% { top:100%; } 100% { top: 0; } }

        /* STEP 4: RESULT */
        #result-ui { display:none; width:100%; max-width:600px; border: 2px dashed var(--gold); padding: 30px; background:#000; animation:fadeIn 1s; box-sizing:border-box;}
        @keyframes fadeIn { from{opacity:0; transform:scale(0.95);} to{opacity:1; transform:scale(1);} }
        .res-star { font-size:26px; color:var(--gold); margin-bottom:10px; font-weight:bold;}
        .res-element { font-size:13px; color:var(--purple); margin-bottom:20px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;}
        .res-desc { line-height:1.8; color:#ccc; margin-bottom:30px; font-size:15px; text-align:justify; border-left:3px solid var(--purple); padding-left:15px;}

        .btn-main { background: var(--gold); color: #000; border: none; padding: 15px; cursor: pointer; font-weight: bold; text-transform: uppercase; width: 100%; font-family:inherit; font-size:16px; transition:0.3s; border-radius:5px;}
        .btn-main:hover { background: #fff; box-shadow:0 0 20px #fff;}

        /* SIDEBARS & CARDS */
        .widget { background:var(--card); border:1px solid var(--border); padding:20px; border-radius:8px; margin-bottom:20px;}
        .widget h3 { color:var(--gold); margin-top:0; border-bottom:1px solid #333; padding-bottom:10px; font-size:16px;}
        
        .grid { display: grid; grid-template-columns: 1fr; gap: 15px; }
        .card { background: #000; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; transition:0.3s;}
        .card:hover { border-color:var(--gold);}
        .card-img { width: 100%; height: 140px; object-fit: cover; border-bottom:1px solid var(--border);}
        .card-body { padding: 15px; }
        .card-body h3 { color: #fff; margin:0 0 5px; font-size:15px;}
        .card-body p { color: #888; font-size: 12px; line-height: 1.4; margin-bottom: 10px; }
        .card-body a { color: var(--gold); font-weight: bold; text-decoration: none; font-size:12px;}

        .audio-track { display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #222; flex-wrap:wrap; gap:10px;}
        .audio-track audio { height:35px; outline:none; max-width:200px;}

        footer { background: #000; text-align: center; padding: 50px 20px; border-top: 1px solid var(--purple); margin-top:60px;}
        .footer-content { max-width:800px; margin:0 auto; color:#888; font-size:13px; line-height:1.6;}
        .footer-content h4 { color:var(--gold); font-size:16px; margin-bottom:10px;}
    </style>
</head>
<body>

    <!-- TOP NAVIGATION -->
    <nav class="top-nav">
        <a href="/" class="nav-brand">👁️ FALAKI</a>
        <div class="nav-links">
            <a href="/">Oracle</a>
            <a href="#archives">Archives</a>
            <a href="#audio">Audio</a>
            <a href="/logout" style="color:#ef4444;">Exit [${req.session.userName}]</a>
            <a href="/super-admin" class="admin-btn">⚙️ CEO ADMIN</a>
        </div>
    </nav>

    <div class="layout">
        <!-- LEFT SIDEBAR -->
        <aside class="left-sidebar">
            <div class="widget">
                <h3>📜 Unseen Archives</h3>
                <p style="font-size:12px; color:#888;">Explore the history of Jinn, Prophets, and traditional healing.</p>
                <div class="grid">${renderCards(jinn).substring(0, 500)}</div> <!-- Preview only -->
                <a href="#archives" style="display:block; margin-top:10px; color:var(--purple); font-size:12px; text-align:center;">View All Archives →</a>
            </div>
            <div class="widget" id="audio">
                <h3>🎧 Healing Audio</h3>
                ${audioHtml}
            </div>
        </aside>

        <!-- CENTER CONTENT (THE ORACLE) -->
        <section class="center-content">
            <div class="oracle-header" id="oracle-header">
                ${magicalLogoHtml}
                <h1>FALAKI</h1>
                <p>Select a gateway below to begin your calculation.</p>
            </div>

            <!-- STEP 1: GATES -->
            <div class="gates-grid" id="gates-grid">
                <button class="gate-btn" onclick="selectQuestion('travel')"><span class="gate-icon">✈️</span> Travel & Journeys</button>
                <button class="gate-btn" onclick="selectQuestion('wealth')"><span class="gate-icon">💰</span> Wealth & Prosperity</button>
                <button class="gate-btn" onclick="selectQuestion('business')"><span class="gate-icon">🏢</span> Business Success</button>
                <button class="gate-btn" onclick="selectQuestion('destiny')"><span class="gate-icon">⏳</span> Past & Future</button>
                <button class="gate-btn" onclick="selectQuestion('encounter')"><span class="gate-icon">👥</span> Friends & Enemies</button>
                <button class="gate-btn" onclick="selectQuestion('marriage')"><span class="gate-icon">❤️</span> Marriage & Stars</button>
                <button class="gate-btn" onclick="selectQuestion('timing')"><span class="gate-icon">🌙</span> Spiritual Timing</button>
                <button class="gate-btn" onclick="selectQuestion('custom')"><span class="gate-icon">🔮</span> Custom Inquiry</button>
            </div>

            <!-- STEP 2: FORM -->
            <div id="user-form">
                <h3 style="color:var(--gold); text-align:center; margin-top:0;" id="form-title">Enter Your Details</h3>
                <p style="color:#888; font-size:12px; text-align:center; margin-bottom:20px;">The Abjad system requires exact names for accurate calculation.</p>
                
                <div id="custom-query-box" class="input-group" style="display:none;">
                    <label>What do you seek to know?</label>
                    <input type="text" id="uQuery" placeholder="Type your question here...">
                </div>

                <div class="input-group">
                    <label>Your Given Name</label>
                    <input type="text" id="uName" placeholder="e.g. Ibrahim" required>
                </div>
                <div class="input-group">
                    <label>Mother's Given Name</label>
                    <input type="text" id="mName" placeholder="e.g. Aisha" required>
                </div>
                <div class="input-group" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div>
                        <label>Birth Year / Age</label>
                        <input type="number" id="uAge" placeholder="e.g. 1995" required>
                    </div>
                    <div>
                        <label>City of Birth</label>
                        <input type="text" id="uCity" placeholder="e.g. Kano" required>
                    </div>
                </div>
                <div class="input-group">
                    <label>Reading Language</label>
                    <select id="uLang">
                        <option value="en">English Translation</option>
                        <option value="ha">Hausa (Original)</option>
                    </select>
                </div>
                
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button class="btn-main" style="background:#333; color:#fff;" onclick="resetToGrid()">Cancel</button>
                    <button class="btn-main" onclick="openScanner()">PROCEED TO SCAN</button>
                </div>
            </div>

            <!-- STEP 3: SCANNER -->
            <div id="scanner-ui">
                <h3 style="color:var(--gold); margin-top:0;">BIOMETRIC PALM ALIGNMENT</h3>
                <p style="color:#888; font-size:12px; margin-bottom:20px;">Place your palm in view of the rear camera and press Scan.</p>
                
                <div class="scanner-wrap">
                    <video id="webcam" autoplay playsinline></video>
                    <div class="scan-line" id="scan-line"></div>
                </div>
                
                <button class="btn-main" id="scanBtn" onclick="startScan()">ACTIVATE SCANNER</button>
            </div>

            <!-- STEP 4: RESULT -->
            <div id="result-ui">
                <div style="text-align:center;">
                    ${magicalLogoHtml}
                    <div class="res-star" id="resTitle"></div>
                    <div class="res-element" id="resElement"></div>
                </div>
                <div class="res-desc" id="resDesc"></div>
                <div style="text-align:center; margin-top:30px;">
                    <button class="btn-main" onclick="resetToGrid()" style="max-width:300px;">Consult Again</button>
                </div>
            </div>
            
            <div id="archives" style="width:100%; margin-top:60px; display:none;"> <!-- Hidden on desktop, visible on mobile if needed -->
            </div>
        </section>

        <!-- RIGHT SIDEBAR -->
        <aside class="right-sidebar">
            <div class="widget">
                <h3>📜 Seerah Archives</h3>
                <div class="grid">${renderCards(seerah).substring(0, 500)}</div>
            </div>
            <div class="widget">
                <h3>🌿 Traditional Medicine</h3>
                <div class="grid">${renderCards(medicine).substring(0, 500)}</div>
            </div>
            <div class="widget">
                <h3>🌍 History</h3>
                <div class="grid">${renderCards(history).substring(0, 500)}</div>
            </div>
        </aside>
    </div>

    <footer>
        <div class="footer-content">
            <h4>ABOUT FALAKI</h4>
            <p>${data.aboutContent}</p>
            <h4 style="margin-top:30px;">PRIVACY POLICY</h4>
            <p>${data.privacyContent}</p>
            
            <div style="margin-top:40px; padding-top:20px; border-top:1px solid #222;">
                <p style="color:var(--gold); font-size:14px; font-weight:bold;">Contact The Oracle Archives</p>
                <p>Email: ${data.contact.email} | WhatsApp: ${data.contact.phone}</p>
                <p style="margin-top:20px; font-size:11px;">© 2026 FALAKI CLOUD ARCHIVES. Deployed on Render.</p>
            </div>
        </div>
    </footer>

    <script>
        // ABJAD ENGINE
        const abjad = {
            'a':1,'b':2,'j':3,'d':4,'h':5,'w':6,'z':7,'x':8,'t':9,'y':10,'k':20,'l':30,'m':40,'n':50,'s':60,'o':70,'f':80,'p':90,'q':100,'r':200,'sh':300,'c':400,'u':6,'v':6,'e':5,'i':10,'g':3,
            'ا':1,'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,'ح':8,'ط':9,'ي':10,'ك':20,'ل':30,'م':40,'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,'ذ':700,'ض':800,'ظ':900,'غ':1000
        };

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

        let selectedGate = '';
        let videoStream = null;

        // STEP 1 -> STEP 2
        function selectQuestion(gate) {
            selectedGate = gate;
            document.getElementById('gates-grid').style.display = 'none';
            document.getElementById('user-form').style.display = 'block';
            
            const titles = {
                'travel': '✈️ Journey Calculation', 'wealth': '💰 Wealth Calculation', 'business': '🏢 Business Calculation',
                'destiny': '⏳ Destiny Calculation', 'encounter': '👥 Encounter Calculation', 'marriage': '❤️ Marriage Calculation',
                'timing': '🌙 Timing Calculation', 'custom': '🔮 Custom Oracle Inquiry'
            };
            document.getElementById('form-title').innerText = titles[gate];
            document.getElementById('custom-query-box').style.display = gate === 'custom' ? 'block' : 'none';
        }

        function resetToGrid() {
            document.getElementById('gates-grid').style.display = 'grid';
            document.getElementById('user-form').style.display = 'none';
            document.getElementById('scanner-ui').style.display = 'none';
            document.getElementById('result-ui').style.display = 'none';
            document.getElementById('oracle-header').style.display = 'block';
            stopCamera();
        }

        // STEP 2 -> STEP 3
        function openScanner() {
            const n = document.getElementById('uName').value;
            const m = document.getElementById('mName').value;
            const a = document.getElementById('uAge').value;
            const c = document.getElementById('uCity').value;
            if(!n || !m || !a || !c) return alert("The Oracle requires all fields to be filled.");
            if(selectedGate === 'custom' && !document.getElementById('uQuery').value) return alert("Please enter your question.");

            document.getElementById('user-form').style.display = 'none';
            document.getElementById('scanner-ui').style.display = 'block';
            document.getElementById('oracle-header').style.display = 'none';

            // IMPORTANT: Request BACK CAMERA (environment)
            const videoEl = document.getElementById('webcam');
            if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
                .then(stream => { 
                    videoStream = stream;
                    videoEl.srcObject = stream; 
                })
                .catch(err => { 
                    console.log("Back camera unavailable, trying default."); 
                    navigator.mediaDevices.getUserMedia({ video: true }).then(s => {
                        videoStream = s; videoEl.srcObject = s;
                    }).catch(e => alert("Camera access required for scan."));
                });
            }
        }

        function stopCamera() {
            if(videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
                videoStream = null;
            }
        }

        function calculateAbjad(str) {
            let total = 0;
            str = str.toLowerCase().replace(/\\s/g, '');
            for(let char of str) { total += (abjad[char] || 1); }
            return total;
        }

        // STEP 3 -> STEP 4
        function startScan() {
            const scanBtn = document.getElementById('scanBtn');
            const scanLine = document.getElementById('scan-line');
            
            scanBtn.innerText = "SCANNING PALM DATA...";
            scanBtn.style.background = "#4b0082";
            scanBtn.style.color = "#fff";
            scanLine.style.display = "block";

            // Record scan API hit silently
            fetch('/api/track-scan', {method:'POST'});

            setTimeout(() => {
                stopCamera();
                document.getElementById('scanner-ui').style.display = 'none';
                generateResult();
            }, 4000); // 4 seconds scan
        }

        function generateResult() {
            const n = document.getElementById('uName').value;
            const m = document.getElementById('mName').value;
            const lang = document.getElementById('uLang').value;
            
            const sum = calculateAbjad(n) + calculateAbjad(m);
            let starIndex = sum % 12;
            if(starIndex === 0) starIndex = 12;
            
            const starData = buruj[starIndex - 1];
            const isFire = starData.element.includes('Fire');
            const isWater = starData.element.includes('Water');
            const isEarth = starData.element.includes('Earth');
            const isAir = starData.element.includes('Air');

            let resEn = "Based on Abjad frequency (" + sum + "), your star is " + starData.nameEn + " (" + starData.element + ").<br><br>";
            let resHa = "Bisa lissafin Abjad dinka (" + sum + "), tauraronka shine " + starData.nameHa + " (" + starData.element + ").<br><br>";

            // Dynamic Context Based on the Gate Selected
            if(selectedGate === 'marriage') {
                if(isFire) {
                    resEn += "For marriage: Fire is passionate but destructive. Avoid marrying a Water star, as it will extinguish your progress. An Earth star will ground your anger.";
                    resHa += "Aurenku: Wuta tana da zafi. Kar ka auri tauraron Ruwa domin zai kashe maka karsashi. Tauraron Kasa zai fi rike ka da kwanciyar hankali.";
                } else if (isWater) {
                    resEn += "For marriage: Water blends well. You need an Earth star to contain you and build a home. Avoid Fire, it will cause constant emotional boiling.";
                    resHa += "Aurenku: Ruwa yana bukatan Kasa don ya zauna wuri daya. Kar ka auri Wuta, zaku ringa samun tashin hankali (Tafasa).";
                } else if (isEarth) {
                    resEn += "For marriage: You are stable. Water stars bring you wealth and growth (like rain to soil). Air stars will cause dust and confusion in your home.";
                    resHa += "Aurenku: Kasa tana son Ruwa don ta kawo amfanin gona (Arziki). Amma idan ka auri Iska, zaku yawaita samun kura da rashin jituwa.";
                } else {
                    resEn += "For marriage: Air needs Fire to expand, but too much Fire burns the house. A Water star will never understand your need for freedom.";
                    resHa += "Aurenku: Iska tana son Wuta don ta kara karfi. Amma tauraron Ruwa ba zai taba fahimtar yanci da zirga-zirgar ka ba.";
                }
            } 
            else if (selectedGate === 'business' || selectedGate === 'wealth') {
                if(isEarth) {
                    resEn += "Business: Your element is Earth. Real estate, farming, and physical trades will bring you massive wealth. Do not rush; your wealth builds slowly but permanently.";
                    resHa += "Kasuwanci: Asalinka Kasa ne. Kasuwancin filaye, noma, ko gine-gine zai kawo maka arziki mai dorewa. Kada ka yi gaggawa.";
                } else if(isAir) {
                    resEn += "Business: Air moves fast. Digital business, communication, and travel are your paths to wealth. You must learn to save, as money leaves your hand as fast as wind.";
                    resHa += "Kasuwanci: Iska tana tafiya da sauri. Kasuwancin yanar gizo ko tafiye-tafiye zasu fi karbe ka. Dole ka koyi tattali, kudi yana saurin fita a hannunka.";
                } else {
                    resEn += "Business: Your element requires partnership. Do not do business alone this month. Give charity on a Thursday before starting the new venture.";
                    resHa += "Kasuwanci: Dabi'arka tana bukatar hadin gwiwa. Kar ka yi kasuwanci kai kadai a wannan watan. Ka bayar da sadaka ranar Alhamis kafin ka fara.";
                }
            }
            else {
                // General reading for Travel, Destiny, Custom
                if(isFire) {
                    resEn += "General: You possess strong leadership. Be careful of anger. Spiritual enemies often attack your temperament. Charity involving cooling things is recommended.";
                    resHa += "Gaba daya: Kana da dabi'ar shugabanci. Ka kiyaye fushi. Makiya suna amfani da fushinka don cutar da kai. Ana so ka yawaita sadaka da abubuwa masu sanyi.";
                } else if(isWater) {
                    resEn += "General: You have a deep, intuitive spirit. Success flows to you naturally, but you absorb negative energies easily. Water-based spiritual cleansing is highly beneficial.";
                    resHa += "Gaba daya: Ruhinka mai sanyi ne. Nasara tana zuwa maka a saukake, amma kana saurin daukar mummunan kallo. Wankan addu'a zai taimake ka matuka.";
                } else if(isEarth) {
                    resEn += "General: You are practical. However, you may suffer from spiritual heaviness or blockage in movement. Give charity to the earth (planting trees, feeding ground animals).";
                    resHa += "Gaba daya: Kai mai rikon amana ne. Wani lokacin kana fuskantar nauyi ko tsayawar al'amura. Sadakar shuka bishiya ko ciyar da dabbobi zata bude maka kofofi.";
                } else {
                    resEn += "General: Your mind moves fast like the wind. You adapt easily, but lack focus. Guard against whispers (Waswas). Reciting protective verses daily keeps your mind clear.";
                    resHa += "Gaba daya: Tunaninka yana tafiya da sauri kamar iska. Baka cika karasa abin da ka fara ba. Ka kiyaye waswasi ta hanyar yawaita azkar na kariya kullum.";
                }
            }

            document.getElementById('result-ui').style.display = 'block';
            document.getElementById('resTitle').innerText = "⭐ " + (lang === 'ha' ? starData.nameHa : starData.nameEn);
            document.getElementById('resElement').innerText = "NATURE: " + starData.element;
            document.getElementById('resDesc').innerHTML = lang === 'ha' ? resHa : resEn;
        }
    </script>
</body>
</html>
    `);
});

// ==================== SUPER ADMIN (CEO PANEL) ====================
app.get('/super-admin', checkAdminAuth, (req, res) => {
    const data = getData();
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <title>FALAKI - CEO Control Panel</title>
    <style>
        body { font-family: monospace; background:#050505; color:#ccc; display:flex; margin:0; height:100vh; }
        .sidebar { width:250px; background:#111; padding:20px; border-right:1px solid #333; }
        .sidebar h2 { color:#ffcc00; margin-bottom:30px; letter-spacing:2px;}
        .sidebar a { display:block; padding:10px; color:#888; text-decoration:none; cursor:pointer; margin-bottom:5px; border-radius:5px;}
        .sidebar a:hover, .sidebar a.active { color:#000; background:#ffcc00;}
        .main { flex:1; padding:40px; overflow-y:auto; }
        .panel { display:none; } .panel.active { display:block; }
        h3 { color:#4b0082; border-bottom:1px solid #333; padding-bottom:10px; margin-bottom:20px; font-size:22px;}
        input, textarea, select { width:100%; padding:12px; margin-bottom:15px; background:#000; border:1px solid #333; color:#ffcc00; box-sizing:border-box; border-radius:5px;}
        button { background:#ffcc00; color:#000; border:none; padding:12px 20px; font-weight:bold; cursor:pointer; border-radius:5px;}
        button:hover { background:#fff;}
        .grid { display:grid; grid-template-columns:1fr 1fr; gap:20px;}
        table { width:100%; border-collapse:collapse; margin-top:20px;}
        th, td { padding:10px; text-align:left; border-bottom:1px solid #222;}
        th { color:#ffcc00;}
    </style>
</head>
<body>
    <div class="sidebar">
        <h2>CEO PANEL</h2>
        <a onclick="show('dash')" class="active">📊 Dashboard</a>
        <a onclick="show('article')">📜 Write Manuscript</a>
        <a onclick="show('audio')">🎧 Upload Audio</a>
        <a onclick="show('contact')">📞 Edit Contact/Footer</a>
        <a onclick="show('users')">👥 User Database</a>
        <a onclick="show('sec')">🛡️ Security</a>
        <a href="/" target="_blank" style="margin-top:30px; background:#4b0082; color:white; text-align:center;">🌐 View Website</a>
        <a href="/logout" style="background:#880000; color:white; text-align:center; margin-top:10px;">🚪 Logout</a>
    </div>

    <div class="main">
        <!-- DASHBOARD -->
        <div id="dash" class="panel active">
            <h3>System Status</h3>
            <div class="grid">
                <div style="background:#111; padding:20px; border:1px solid #333; border-radius:8px;">
                    <h4 style="color:#ffcc00; margin-top:0;">Total Oracle Scans</h4>
                    <p style="font-size:40px; margin:0;">${data.stats.totalScans}</p>
                </div>
                <div style="background:#111; padding:20px; border:1px solid #333; border-radius:8px;">
                    <h4 style="color:#ffcc00; margin-top:0;">Registered Souls</h4>
                    <p style="font-size:40px; margin:0;">${data.users.length}</p>
                </div>
                <div style="background:#111; padding:20px; border:1px solid #333; border-radius:8px;">
                    <h4 style="color:#ffcc00; margin-top:0;">Total Manuscripts</h4>
                    <p style="font-size:40px; margin:0;">${data.posts.length}</p>
                </div>
                <div style="background:#111; padding:20px; border:1px solid #333; border-radius:8px;">
                    <h4 style="color:#ffcc00; margin-top:0;">Total Audio Files</h4>
                    <p style="font-size:40px; margin:0;">${data.audios.length}</p>
                </div>
            </div>
        </div>

        <!-- BLOGS -->
        <div id="article" class="panel">
            <h3>Write to Archives</h3>
            <form action="/admin/post-article" method="POST" enctype="multipart/form-data">
                <input type="text" name="title" placeholder="Manuscript Title" required>
                <select name="category" required>
                    <option value="Seerah">Seerah (Prophets)</option>
                    <option value="Jinn">Jinn & The Unseen</option>
                    <option value="Medicine">Traditional Medicine</option>
                    <option value="History">World History</option>
                </select>
                <textarea name="content" rows="10" placeholder="Manuscript Content (HTML tags like <b> and <br> allowed)" required></textarea>
                <label style="color:#888; font-size:12px;">Upload Image (Optional):</label>
                <input type="file" name="image" accept="image/*">
                <button type="submit">Encrypt to Database</button>
            </form>
            
            <h3 style="margin-top:50px;">Manage Manuscripts</h3>
            <table>
                <tr><th>Title</th><th>Category</th><th>Action</th></tr>
                ${data.posts.map(p=>`<tr><td>${p.title}</td><td>${p.category}</td><td><a href="/admin/delete-post/${p.id}" style="color:#ff4444;">Delete</a></td></tr>`).join('')}
            </table>
        </div>

        <!-- AUDIO -->
        <div id="audio" class="panel">
            <h3>Upload Spiritual Audio (Ruqyah/Quran)</h3>
            <form action="/admin/upload-audio" method="POST" enctype="multipart/form-data">
                <input type="text" name="title" placeholder="Audio Title (e.g. Surah Baqarah, Ruqyah for Jinn)" required>
                <select name="category">
                    <option value="Quran">Quran</option>
                    <option value="Ruqyah">Ruqyah / Healing</option>
                    <option value="Lecture">Lecture / History</option>
                </select>
                <label style="color:#888; font-size:12px;">Audio File (MP3):</label>
                <input type="file" name="audio" accept="audio/*" required>
                <button type="submit">Upload Audio</button>
            </form>

            <h3 style="margin-top:50px;">Manage Audios</h3>
            <table>
                <tr><th>Title</th><th>Type</th><th>Action</th></tr>
                ${data.audios.map(a=>`<tr><td>${a.title}</td><td>${a.category}</td><td><a href="/admin/delete-audio/${a.id}" style="color:#ff4444;">Delete</a></td></tr>`).join('')}
            </table>
        </div>

        <!-- CONTACT / FOOTER -->
        <div id="contact" class="panel">
            <h3>Edit Contact & Footer Details</h3>
            <form action="/admin/update-contact" method="POST">
                <label style="color:#888; font-size:12px;">Admin Email Address</label>
                <input type="email" name="email" value="${data.contact.email}" required>
                
                <label style="color:#888; font-size:12px;">WhatsApp Number (Include Country Code)</label>
                <input type="text" name="phone" value="${data.contact.phone}" required>
                
                <label style="color:#888; font-size:12px; margin-top:20px; display:block;">About Falaki Text</label>
                <textarea name="aboutContent" rows="6" required>${data.aboutContent}</textarea>
                
                <label style="color:#888; font-size:12px; margin-top:20px; display:block;">Privacy Policy Text</label>
                <textarea name="privacyContent" rows="6" required>${data.privacyContent}</textarea>
                
                <button type="submit">Update Details</button>
            </form>
        </div>

        <!-- USERS -->
        <div id="users" class="panel">
            <h3>Registered Souls Database</h3>
            <table>
                <tr><th>Name</th><th>Email</th><th>Date Joined</th></tr>
                ${data.users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td>${new Date(u.joined).toLocaleDateString()}</td></tr>`).join('')}
            </table>
        </div>

        <!-- SECURITY -->
        <div id="sec" class="panel">
            <h3>Update CEO Credentials</h3>
            <form action="/admin/change-pass" method="POST" style="max-width:400px;">
                <input type="text" name="newUser" placeholder="New Username" value="${data.adminAuth.user}" required>
                <input type="password" name="newPass" placeholder="New Password" required>
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
    </script>
</body>
</html>`);
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

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`👁️ FALAKI SYSTEM ONLINE on http://localhost:${PORT}`);
    console.log(`⚙️ CEO Admin Panel: http://localhost:${PORT}/super-admin`);
});
