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
    let data = {};
    try {
        if (fs.existsSync(DATA_FILE)) {
            const content = fs.readFileSync(DATA_FILE, 'utf8');
            if(content.trim()) data = JSON.parse(content);
        }
    } catch (e) { console.error("Error reading database", e); }

    // Enforce default structure safely
    if(!data.adminAuth) data.adminAuth = { user: 'admin216', hash: bcrypt.hashSync('admin1234', 10) };
    if(!data.contact) data.contact = { email: 'abdullahharuna216@gmail.com', phone: '2348080335353' };
    
    // NEW: Financial Configuration for Sadaqah/Donations
    if(!data.finance) data.finance = { bank: '', paypal: '', crypto: '' };

    if(!data.users) data.users = [];
    if(!data.posts) data.posts = [];
    if(!data.audios) data.audios = [];
    if(!data.stats) data.stats = { totalScans: 1204 }; 
    
    if(!data.aboutContent) data.aboutContent = "FALAKI is an advanced Neural Ramlu and Spiritual Archives platform. We bridge the ancient, profound mathematical systems of Hisab al-Jummal (Abjad) and Ilm al-Raml with modern web technologies.";
    if(!data.privacyContent) data.privacyContent = "Your privacy is our utmost priority. All spiritual inquiries and Abjad calculations are processed locally and securely. We do not sell or share your personal spiritual readings.";

    saveData(data);
    return data;
}

function saveData(data) {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch(e) {}
}

getData(); // Initialize on boot

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

    // DYNAMIC DONATION HTML
    const donationHtml = `
        <div class="donate-box">
            <h3 style="color:#ffcc00; margin-top:0;">💰 Give Sadaqah (Support The Archives)</h3>
            <p style="color:#888; font-size:13px;">If this Oracle has brought you clarity, please consider supporting the servers and scholars.</p>
            ${data.finance.bank ? `<div class="pay-method"><strong>Bank Transfer:</strong> ${data.finance.bank}</div>` : ''}
            ${data.finance.paypal ? `<div class="pay-method"><strong>PayPal:</strong> ${data.finance.paypal}</div>` : ''}
            ${data.finance.crypto ? `<div class="pay-method"><strong>Crypto/Binance:</strong> ${data.finance.crypto}</div>` : ''}
            ${(!data.finance.bank && !data.finance.paypal && !data.finance.crypto) ? `<div class="pay-method">Contact Admin for Sadaqah details.</div>` : ''}
        </div>
    `;

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
        .scan-count { background:rgba(75,0,130,0.3); border:1px solid var(--purple); padding:5px 15px; border-radius:20px; color:var(--gold); font-size:12px; font-weight:bold; display:inline-block; margin-top:15px; animation:pulse 2s infinite;}
        @keyframes pulse { 50% { opacity:0.6; } }

        /* STEP 1: GATES GRID */
        .gates-grid { display:grid; grid-template-columns:1fr 1fr; gap:15px; width:100%; max-width:600px;}
        .gate-btn { background:var(--card); border:1px solid var(--purple); padding:20px; border-radius:10px; color:#fff; font-family:inherit; font-size:15px; font-weight:bold; cursor:pointer; transition:0.3s; text-align:left; display:flex; align-items:center; gap:10px;}
        .gate-btn:hover { background:var(--purple); border-color:var(--gold); transform:translateY(-3px); box-shadow:0 10px 20px rgba(75,0,130,0.5);}
        .gate-icon { font-size:24px; }

        /* STEP 2: FORM (NO CAMERA) */
        #user-form { display:none; width:100%; max-width:500px; background:var(--card); padding:30px; border-radius:10px; border:1px solid var(--gold); box-shadow:0 0 30px rgba(255,204,0,0.1);}
        .input-group { margin-bottom:15px; text-align:left;}
        .input-group label { display:block; color:#888; font-size:12px; margin-bottom:5px; text-transform:uppercase;}
        .input-group input, .input-group select { width:100%; padding:12px; background:#000; border:1px solid #333; color:var(--gold); font-family:inherit; font-size:14px; box-sizing:border-box;}
        .input-group input:focus, .input-group select:focus { outline:none; border-color:var(--gold); }

        /* LOADING ANIMATION */
        #loading-ui { display:none; text-align:center; padding:40px; }
        .mystic-text { color:var(--gold); font-size:18px; letter-spacing:3px; margin-top:20px; animation:pulse 1s infinite;}

        /* STEP 3: RESULT */
        #result-ui { display:none; width:100%; max-width:600px; border: 2px dashed var(--gold); padding: 30px; background:#000; animation:fadeIn 1s; box-sizing:border-box;}
        @keyframes fadeIn { from{opacity:0; transform:scale(0.95);} to{opacity:1; transform:scale(1);} }
        .res-star { font-size:26px; color:var(--gold); margin-bottom:10px; font-weight:bold;}
        .res-element { font-size:13px; color:var(--purple); margin-bottom:20px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;}
        .res-desc { line-height:1.8; color:#ccc; margin-bottom:30px; font-size:15px; text-align:justify; border-left:3px solid var(--purple); padding-left:15px;}
        .ramlu-fig { font-size: 20px; color:#fff; background:var(--purple); padding:5px 10px; border-radius:5px; margin-bottom:15px; display:inline-block;}

        .btn-main { background: var(--gold); color: #000; border: none; padding: 15px; cursor: pointer; font-weight: bold; text-transform: uppercase; width: 100%; font-family:inherit; font-size:16px; transition:0.3s; border-radius:5px;}
        .btn-main:hover { background: #fff; box-shadow:0 0 20px #fff;}

        /* DONATE BOX */
        .donate-box { background:rgba(75,0,130,0.2); border:1px solid var(--purple); padding:20px; border-radius:8px; margin-top:30px; text-align:left;}
        .pay-method { background:#000; padding:10px; border:1px solid #333; border-radius:5px; margin-top:10px; font-size:13px; color:#ccc;}

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

        @media(max-width:600px) { .input-grid{grid-template-columns:1fr;} nav a{padding:10px; font-size:12px;} .gates-grid{grid-template-columns:1fr;} }
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
                <div class="grid">${renderCards(jinn).substring(0, 800)}</div> <!-- Preview only -->
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
                <div class="scan-count">👁️ ${data.stats.totalScans} Souls Calculated</div>
            </div>

            <!-- STEP 1: GATES -->
            <div class="gates-grid" id="gates-grid">
                <button class="gate-btn" onclick="selectQuestion('travel')"><span class="gate-icon">✈️</span> Travel & Journey</button>
                <button class="gate-btn" onclick="selectQuestion('wealth')"><span class="gate-icon">💰</span> Wealth & Funding</button>
                <button class="gate-btn" onclick="selectQuestion('business')"><span class="gate-icon">🏢</span> Business Success</button>
                <button class="gate-btn" onclick="selectQuestion('destiny')"><span class="gate-icon">⏳</span> Past & Future</button>
                <button class="gate-btn" onclick="selectQuestion('encounter')"><span class="gate-icon">👥</span> Encounters & People</button>
                <button class="gate-btn" onclick="selectQuestion('marriage')"><span class="gate-icon">❤️</span> Marriage Compatibility</button>
                <button class="gate-btn" onclick="selectQuestion('timing')"><span class="gate-icon">🌙</span> Auspicious Timing</button>
                <button class="gate-btn" onclick="selectQuestion('custom')"><span class="gate-icon">🔮</span> Write Custom Inquiry</button>
            </div>

            <!-- STEP 2: PURE TEXT FORM -->
            <div id="user-form">
                <h3 style="color:var(--gold); text-align:center; margin-top:0;" id="form-title">Enter Spiritual Details</h3>
                <p style="color:#888; font-size:12px; text-align:center; margin-bottom:20px;">The Abjad system requires exact names for accurate calculation.</p>
                
                <div id="custom-query-box" class="input-group" style="display:none;">
                    <label>What do you seek to know?</label>
                    <input type="text" id="uQuery" placeholder="Type your specific question here...">
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
                        <label>City of Birth</label>
                        <input type="text" id="city" placeholder="e.g. Kano" required>
                    </div>
                    <div>
                        <label>Secret Number (1-12)</label>
                        <input type="number" id="uNum" min="1" max="12" placeholder="Choose 1-12" required>
                    </div>
                </div>
                <div class="input-group">
                    <label>Reading Language</label>
                    <select id="uLang">
                        <option value="en">English Translation</option>
                        <option value="ha">Hausa (Original)</option>
                        <option value="ar">Arabic (العربية)</option>
                    </select>
                </div>
                
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button class="btn-main" style="background:#333; color:#fff;" onclick="resetToGrid()">BACK</button>
                    <!-- PERFECTED CALCULATE BUTTON -->
                    <button class="btn-main" onclick="startCalculation()">CALCULATE DESTINY</button>
                </div>
            </div>

            <!-- STEP 3: LOADING -->
            <div id="loading-ui">
                ${magicalLogoHtml}
                <div class="mystic-text">DECRYPTING STARS...</div>
                <p style="color:#888; font-size:12px; margin-top:10px;">Calculating Abjad values against the 16 Houses of Ramlu.</p>
            </div>

            <!-- STEP 4: RESULT -->
            <div id="result-ui">
                <div style="text-align:center;">
                    <div class="res-star" id="resTitle"></div>
                    <div class="res-element" id="resElement"></div>
                    <div class="ramlu-fig" id="resRamlu"></div>
                </div>
                <div class="res-desc" id="resDesc"></div>
                
                <!-- DONATION SECTION INJECTED HERE -->
                ${donationHtml}

                <div style="text-align:center; margin-top:30px;">
                    <button class="btn-main" onclick="resetToGrid()" style="max-width:300px;">Consult Again</button>
                </div>
            </div>
            
            <div id="archives" style="width:100%; margin-top:60px; display:none;"> </div>
        </section>

        <!-- RIGHT SIDEBAR -->
        <aside class="right-sidebar">
            <div class="widget">
                <h3>📜 Seerah Archives</h3>
                <div class="grid">${renderCards(seerah).substring(0, 500)}</div>
            </div>
            
            <div class="widget">
                <h3>🌍 History</h3>
                <div class="grid">${renderCards(history).substring(0, 500)}</div>
            </div>

            <!-- SADAQAH WIDGET FOR RIGHT SIDEBAR -->
            <div class="widget" style="border-color:var(--gold);">
                <h3 style="color:var(--gold);">💰 Sadaqah / Donate</h3>
                <p style="font-size:12px; color:#888; margin-bottom:10px;">Support the Oracle servers.</p>
                ${data.finance.bank ? `<div class="pay-method">🏦 <strong>Bank:</strong> ${data.finance.bank}</div>` : ''}
                ${data.finance.paypal ? `<div class="pay-method">🅿️ <strong>PayPal:</strong> ${data.finance.paypal}</div>` : ''}
                ${data.finance.crypto ? `<div class="pay-method">₿ <strong>Crypto:</strong> ${data.finance.crypto}</div>` : ''}
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
                <p>Email: <a href="mailto:${data.contact.email}" style="color:var(--gold); text-decoration:none;">${data.contact.email}</a></p>
                <p>WhatsApp: <a href="https://wa.me/${data.contact.phone.replace(/[^0-9]/g,'')}" style="color:var(--gold); text-decoration:none;">${data.contact.phone}</a></p>
                <p style="margin-top:20px; font-size:11px;">© 2026 FALAKI CLOUD ARCHIVES. Deployed on Render.</p>
            </div>
        </div>
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
            { id: 1, nameEn: "Aries (Hamal)", nameHa: "Babban Rago (Hamal)", nameAr: "الحمل", element: "Fire" },
            { id: 2, nameEn: "Taurus (Thaur)", nameHa: "Sa (Thaur)", nameAr: "الثور", element: "Earth" },
            { id: 3, nameEn: "Gemini (Jauza)", nameHa: "Tagwaye (Jauza)", nameAr: "الجوزاء", element: "Air" },
            { id: 4, nameEn: "Cancer (Sartan)", nameHa: "Kaguwa (Sartan)", nameAr: "السرطان", element: "Water" },
            { id: 5, nameEn: "Leo (Asad)", nameHa: "Zaki (Asad)", nameAr: "الأسد", element: "Fire" },
            { id: 6, nameEn: "Virgo (Sunbula)", nameHa: "Budurwa (Sunbula)", nameAr: "العذراء", element: "Earth" },
            { id: 7, nameEn: "Libra (Mizan)", nameHa: "Sikeli (Mizan)", nameAr: "الميزان", element: "Air" },
            { id: 8, nameEn: "Scorpio (Aqrab)", nameHa: "Kunama (Aqrab)", nameAr: "العقرب", element: "Water" },
            { id: 9, nameEn: "Sagittarius (Qaus)", nameHa: "Maharbi (Qaus)", nameAr: "القوس", element: "Fire" },
            { id: 10, nameEn: "Capricorn (Jadi)", nameHa: "Bunsuru (Jadi)", nameAr: "الجدي", element: "Earth" },
            { id: 11, nameEn: "Aquarius (Dalwu)", nameHa: "Guga (Dalwu)", nameAr: "الدلو", element: "Air" },
            { id: 12, nameEn: "Pisces (Hut)", nameHa: "Kifi (Hut)", nameAr: "الحوت", element: "Water" }
        ];

        const ramlFigures = [
            { name: "Dariqee", nature: "Good for travel, indicates movement." },
            { name: "Jama'a", nature: "Good for partnership, crowds, business." },
            { name: "Uqba", nature: "Indicates delays, the end of a matter." },
            { name: "Kausaji", nature: "Deceit, something hidden or incomplete." },
            { name: "Dhahika", nature: "Joy, success, good news coming." },
            { name: "Qabla Kharija", nature: "Money leaving, safe travel out." },
            { name: "Humra", nature: "Conflict, passion, fire, blood." },
            { name: "Inkees", nature: "Loss, sadness, things turning upside down." },
            { name: "Bayaad", nature: "Purity, clarity, a good outcome." },
            { name: "Nusra Kharija", nature: "Victory over distant enemies." },
            { name: "Nusra Dakhila", nature: "Victory at home, inner peace." },
            { name: "Qabla Dakhila", nature: "Money arriving, safe return." },
            { name: "Ijtima", nature: "Meeting of two things, good for marriage." },
            { name: "Uqla", nature: "Tied up, delayed, restricted movement." },
            { name: "Kabid Kharija", nature: "Loss of property, theft." },
            { name: "Kabid Dakhila", nature: "Gaining property, holding tight." }
        ];

        let selectedGate = '';

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
            document.getElementById('loading-ui').style.display = 'none';
            document.getElementById('result-ui').style.display = 'none';
            document.getElementById('oracle-header').style.display = 'block';
            
            document.getElementById('uName').value = '';
            document.getElementById('mName').value = '';
            document.getElementById('city').value = '';
            document.getElementById('uNum').value = '';
            document.getElementById('uQuery').value = '';
        }

        function calculateAbjad(str) {
            let total = 0;
            str = str.toLowerCase().replace(/\\s/g, '');
            for(let char of str) { total += (abjad[char] || 1); }
            return total;
        }

        // FLAWLESS CALCULATION TRIGGER
        function startCalculation() {
            const n = document.getElementById('uName').value;
            const m = document.getElementById('mName').value;
            const c = document.getElementById('city').value;
            const num = parseInt(document.getElementById('uNum').value);
            const q = document.getElementById('uQuery').value;
            
            if(!n || !m || !c || !num || num < 1 || num > 12) return alert("All fields are required, and number must be 1-12.");
            if(selectedGate === 'custom' && !q) return alert("Please enter your question.");

            document.getElementById('user-form').style.display = 'none';
            document.getElementById('oracle-header').style.display = 'none';
            document.getElementById('loading-ui').style.display = 'block';

            // Record scan API hit
            fetch('/api/track-scan', {method:'POST'});

            setTimeout(() => {
                document.getElementById('loading-ui').style.display = 'none';
                generateResult(n, m, c, num, q);
            }, 3000); // 3 seconds calculation animation
        }

        function generateResult(n, m, c, num, q) {
            const lang = document.getElementById('uLang').value;
            
            // DYNAMIC ABJAD MATH (Calculates exact string inputs + User's secret number)
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
            let resAr = "بناءً على حساب الأبجد الخاص بك (" + totalSum + ")، نجمك هو <strong>" + starData.nameAr + "</strong> وشكل الرمل هو <strong>" + ramlData.name + "</strong>.<br><br>";

            // DYNAMIC RESPONSES PER GATE
            if (selectedGate === 'marriage') {
                if(isFire) {
                    resEn += "For marriage: Fire is passionate but destructive. Avoid marrying a Water star, as it will extinguish your progress. An Earth star will ground your anger.";
                    resHa += "Aurenku: Wuta tana da zafi. Kar ka auri tauraron Ruwa domin zai kashe maka karsashi. Tauraron Kasa zai fi rike ka da kwanciyar hankali.";
                    resAr += "للزواج: النار عاطفية ولكنها مدمرة. تجنب الزواج من نجم مائي.";
                } else if (isWater) {
                    resEn += "For marriage: Water blends well. You need an Earth star to contain you and build a home. Avoid Fire, it will cause constant emotional boiling.";
                    resHa += "Aurenku: Ruwa yana bukatan Kasa don ya zauna wuri daya. Kar ka auri Wuta, zaku ringa samun tashin hankali (Tafasa).";
                    resAr += "للزواج: الماء يمتزج جيدا. أنت بحاجة إلى نجم ترابي لاحتوائك وبناء منزل.";
                } else if (isEarth) {
                    resEn += "For marriage: You are stable. Water stars bring you wealth and growth. Air stars will cause dust and confusion in your home.";
                    resHa += "Aurenku: Kasa tana son Ruwa don ta kawo amfanin gona (Arziki). Amma idan ka auri Iska, zaku yawaita samun kura da rashin jituwa.";
                    resAr += "للزواج: أنت مستقر. النجوم المائية تجلب لك الثروة والنمو.";
                } else {
                    resEn += "For marriage: Air needs Fire to expand, but too much Fire burns the house. A Water star will never understand your need for freedom.";
                    resHa += "Aurenku: Iska tana son Wuta don ta kara karfi. Amma tauraron Ruwa ba zai taba fahimtar yanci da zirga-zirgar ka ba.";
                    resAr += "للزواج: الهواء يحتاج إلى النار ليتمدد، لكن كثرة النار تحرق المنزل.";
                }
            } 
            else if (selectedGate === 'business' || selectedGate === 'wealth') {
                if(isEarth) {
                    resEn += "Business: Your element is Earth. Real estate, farming, and physical trades will bring you massive wealth. Do not rush; your wealth builds slowly but permanently.";
                    resHa += "Kasuwanci: Asalinka Kasa ne. Kasuwancin filaye, noma, ko gine-gine zai kawo maka arziki mai dorewa. Kada ka yi gaggawa.";
                    resAr += "الأعمال: عنصرك هو الأرض. العقارات والزراعة والتجارة المادية ستجلب لك ثروة هائلة.";
                } else if(isAir) {
                    resEn += "Business: Air moves fast. Digital business, communication, and travel are your paths to wealth. You must learn to save, as money leaves your hand as fast as wind.";
                    resHa += "Kasuwanci: Iska tana tafiya da sauri. Kasuwancin yanar gizo ko tafiye-tafiye zasu fi karbe ka. Dole ka koyi tattali, kudi yana saurin fita a hannunka.";
                    resAr += "الأعمال: الهواء يتحرك بسرعة. الأعمال الرقمية والتواصل والسفر هي طرقك نحو الثروة.";
                } else {
                    resEn += "Business: Your element requires partnership. Do not do business alone this month. Give charity on a Thursday before starting the new venture.";
                    resHa += "Kasuwanci: Dabi'arka tana bukatar hadin gwiwa. Kar ka yi kasuwanci kai kadai a wannan watan. Ka bayar da sadaka ranar Alhamis kafin ka fara.";
                    resAr += "الأعمال: عنصرك يتطلب الشراكة. لا تقم بأعمال تجارية بمفردك هذا الشهر.";
                }
            }
            else if (selectedGate === 'travel') {
                if(ramlData.name === "Dariqee" || ramlData.name === "Qabla Kharija") {
                    resEn += "The stars align perfectly for movement. " + ramlData.nature + " Proceed with your journey.";
                    resHa += "Taurari sun bada dama. " + ramlData.nature + " Ci gaba da shirin tafiyarka.";
                    resAr += "النجوم تتوافق تمامًا للحركة. " + ramlData.nature + " المضي قدما في رحلتك.";
                } else if (ramlData.name === "Uqla" || ramlData.name === "Inkees") {
                    resEn += "Warning: " + ramlData.nature + " It is highly advised to delay travel. Give charity before moving.";
                    resHa += "Gargadi: " + ramlData.nature + " An fi so ka daga tafiyar. Kuma kayi sadaka kafin ka fita.";
                    resAr += "تحذير: " + ramlData.nature + " ينصح بشدة بتأخير السفر. إعطاء الصدقة قبل التحرك.";
                } else {
                    resEn += "The journey is neutral. The figure reveals: " + ramlData.nature;
                    resHa += "Tafiyar tana da matsakaicin tsari. Ramlu ya nuna: " + ramlData.nature;
                    resAr += "الرحلة محايدة. الشكل يكشف: " + ramlData.nature;
                }
            }
            else {
                resEn += "For your specific inquiry, the unseen calculation brings forth " + ramlData.name + ". This means: " + ramlData.nature + " Let your " + starData.element + " nature guide your next steps.";
                resHa += "Dangane da tambayarka, lissafin ya fito da " + ramlData.name + ". Wannan yana nufin: " + ramlData.nature + " Ka bar asalin dabi'arka ta " + starData.element + " ta jagorance ka.";
                resAr += "لسؤالك المحدد، الحساب الغيبي يبرز " + ramlData.name + ". وهذا يعني: " + ramlData.nature + " دع طبيعتك ترشد خطواتك القادمة.";
            }

            document.getElementById('result-ui').style.display = 'block';
            document.getElementById('resRamlu').innerText = "RAMLU: " + ramlData.name;
            
            if(lang === 'ha') {
                document.getElementById('resTitle').innerText = "⭐ " + starData.nameHa;
                document.getElementById('resDesc').innerHTML = resHa;
            } else if(lang === 'ar') {
                document.getElementById('resTitle').innerText = "⭐ " + starData.nameAr;
                document.getElementById('resDesc').innerHTML = resAr;
                document.getElementById('resDesc').style.textAlign = "right";
                document.getElementById('resDesc').style.direction = "rtl";
            } else {
                document.getElementById('resTitle').innerText = "⭐ " + starData.nameEn;
                document.getElementById('resDesc').innerHTML = resEn;
            }
            
            document.getElementById('resElement').innerText = "ELEMENT: " + starData.element;
        }
    </script>
</body>
</html>
    `);
});

app.post('/api/track-scan', (req, res) => {
    const data = getData();
    data.stats.totalScans = (data.stats.totalScans || 0) + 1;
    saveData(data);
    res.json({success: true});
});

// READ MANUSCRIPT (BLOG DETAIL)
app.get('/read/:id', checkUserAuth, (req, res) => {
    const data = getData();
    const post = data.posts.find(p => p.id == req.params.id);
    if (!post) return res.redirect('/');
    post.views = (post.views || 0) + 1;
    saveData(data);
    
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <title>${post.title} | FALAKI</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${googleAnalytics}
    <style>
        body { background: #050505; color: #ccc; font-family: 'Courier New', monospace; margin: 0; padding: 40px 5%; line-height: 1.8;}
        .wrap { max-width: 800px; margin: auto; background: #111; padding: 40px; border: 1px solid #333; border-radius: 8px;}
        h1 { color: #ffcc00; text-transform: uppercase; margin-bottom:10px;}
        .meta { color: #888; font-size:12px; margin-bottom:20px; text-transform:uppercase;}
        img { max-width: 100%; border: 1px solid #333; border-radius: 5px; margin: 20px 0; }
        a { color: #4b0082; text-decoration: none; font-weight: bold; }
        a:hover { color: #ffcc00; }
        p { margin-bottom:15px; font-size:15px;}
    </style>
</head>
<body>
    <div class="wrap">
        <a href="/">← Return to Archives</a>
        <h1>${post.title}</h1>
        <div class="meta">Category: ${post.category} | Views: ${post.views} | Decrypted: ${new Date(post.date).toLocaleDateString()}</div>
        ${post.image ? `<img src="${post.image}">` : ''}
        <div>${post.content}</div>
    </div>
</body>
</html>`);
});

// ==================== SUPER ADMIN (CEO PANEL) ====================
app.get('/admin-login', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><title>CEO Login</title>
        <style>body{background:#000;color:#ffcc00;font-family:monospace;display:flex;justify-content:center;align-items:center;height:100vh;}
        .box{background:#111;padding:40px;border:1px solid #4b0082;text-align:center;}
        input{width:100%;padding:12px;margin:10px 0;background:#000;border:1px solid #333;color:#ffcc00;box-sizing:border-box;}
        button{width:100%;padding:12px;background:#4b0082;color:#fff;border:none;cursor:pointer;margin-top:10px;}</style></head>
        <body><div class="box"><h2>[ CEO OVERRIDE ]</h2>
        <form method="POST" action="/admin-auth">
            <input type="text" name="user" placeholder="Username" required>
            <input type="password" name="pass" placeholder="Password" required>
            <button type="submit">ACCESS SYSTEM</button>
        </form></div></body></html>`);
});

app.post('/admin-auth', (req, res) => {
    const { user, pass } = req.body;
    const data = getData();
    if (user === data.adminAuth.user && bcrypt.compareSync(pass, data.adminAuth.hash)) {
        req.session.isSuperAdmin = true; res.redirect('/super-admin');
    } else {
        res.send('<script>alert("Access Denied"); window.location="/admin-login";</script>');
    }
});

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
        <a onclick="show('finance')">💳 Financial Details</a>
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
                    <button onclick="window.location.href='/admin/reset-scans'" style="background:#880000; color:white; padding:5px 10px; margin-top:10px; font-size:12px;">Reset Counter</button>
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

        <!-- NEW: FINANCIAL SETTINGS (DONATIONS) -->
        <div id="finance" class="panel">
            <h3>💳 Sadaqah / Donation Settings</h3>
            <p style="color:#888; margin-bottom:20px; font-size:14px;">Enter your payment details below. These will be shown to users after they get their reading, so they can thank you.</p>
            <form action="/admin/update-finance" method="POST" style="max-width:600px;">
                <label style="color:#888; font-size:12px;">Bank Account (Name, Number, Bank)</label>
                <input type="text" name="bank" placeholder="e.g. John Doe, 0123456789, GTBank" value="${data.finance.bank}">
                
                <label style="color:#888; font-size:12px;">PayPal Email / Link</label>
                <input type="text" name="paypal" placeholder="e.g. your@paypal.com or paypal.me/link" value="${data.finance.paypal}">
                
                <label style="color:#888; font-size:12px;">Crypto Wallet (BTC, USDT, or Binance Pay ID)</label>
                <input type="text" name="crypto" placeholder="e.g. USDT TRC20: 0x123..." value="${data.finance.crypto}">
                
                <button type="submit">Update Payment Details</button>
            </form>
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
            
            <h3 style="margin-top:40px;">Manage Manuscripts</h3>
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

            <h3 style="margin-top:40px;">Manage Audios</h3>
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
app.post('/admin/update-finance', checkAdminAuth, (req, res) => {
    const data = getData();
    data.finance = { bank: req.body.bank, paypal: req.body.paypal, crypto: req.body.crypto };
    saveData(data);
    res.send('<script>alert("Financial Details Saved!"); window.location="/super-admin";</script>');
});

app.post('/admin/post-article', checkAdminAuth, upload.single('image'), (req, res) => {
    const data = getData();
    data.posts.unshift({
        id: Date.now(), title: req.body.title, category: req.body.category,
        content: req.body.content.replace(/\n/g, '<br>'),
        image: req.file ? `/uploads/images/${req.file.filename}` : null,
        date: new Date().toISOString(), views: 0
    });
    saveData(data); res.send('<script>alert("Manuscript Encrypted!"); window.location="/super-admin";</script>');
});

app.get('/admin/delete-post/:id', checkAdminAuth, (req, res) => {
    const data = getData(); data.posts = data.posts.filter(p => p.id != req.params.id); saveData(data); res.redirect('/super-admin');
});

app.post('/admin/upload-audio', checkAdminAuth, upload.single('audio'), (req, res) => {
    if (!req.file) return res.send('<script>alert("No file!"); window.location="/super-admin";</script>');
    const data = getData();
    data.audios.unshift({ id: Date.now(), title: req.body.title, category: req.body.category, url: `/uploads/audio/${req.file.filename}` });
    saveData(data); res.send('<script>alert("Audio Uploaded!"); window.location="/super-admin";</script>');
});

app.get('/admin/delete-audio/:id', checkAdminAuth, (req, res) => {
    const data = getData(); data.audios = data.audios.filter(a => a.id != req.params.id); saveData(data); res.redirect('/super-admin');
});

app.post('/admin/update-contact', checkAdminAuth, (req, res) => {
    const data = getData();
    data.contact = { email: req.body.email, phone: req.body.phone };
    data.aboutContent = req.body.aboutContent; data.privacyContent = req.body.privacyContent;
    saveData(data); res.send('<script>alert("Contact & Texts Updated!"); window.location="/super-admin";</script>');
});

app.post('/admin/change-pass', checkAdminAuth, (req, res) => {
    const data = getData();
    data.adminAuth.user = req.body.newUser; data.adminAuth.hash = bcrypt.hashSync(req.body.newPass, 10);
    saveData(data); res.send('<script>alert("Security Updated!"); window.location="/super-admin";</script>');
});

app.get('/admin/reset-scans', checkAdminAuth, (req, res) => {
    const data = getData(); data.stats.totalScans = 0; saveData(data); res.redirect('/super-admin');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`👁️ FALAKI SYSTEM ONLINE on http://localhost:${PORT}`);
});
