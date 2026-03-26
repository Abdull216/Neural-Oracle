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

// Multer Configuration
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
    if(!data.finance) data.finance = { bank: '', paypal: '', crypto: '' };
    if(!data.users) data.users = [];
    if(!data.posts) data.posts = [];
    if(!data.audios) data.audios = [];
    if(!data.stats) data.stats = { totalScans: 1204 }; 
    if(!data.aboutContent) data.aboutContent = "NEURAL ENGINE is an advanced Spiritual Archives platform. We bridge the ancient, profound mathematical systems of Hisab al-Jummal (Abjad) and Ilm al-Raml with modern web technologies.";
    if(!data.privacyContent) data.privacyContent = "Your privacy is our utmost priority. All spiritual inquiries and Abjad calculations are processed locally and securely. We do not sell or share your personal spiritual readings.";

    saveData(data);
    return data;
}

function saveData(data) {
    try { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2)); } catch(e) {}
}
getData();

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
            <title>NEURAL ENGINE | Authentication Gateway</title>
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
                <h2 style="letter-spacing:4px; margin-bottom:5px;">NEURAL ENGINE</h2>
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
                        form.action = '/api/login'; nameField.style.display = 'none'; nameField.removeAttribute('required');
                        btnText.textContent = "ENTER ARCHIVES"; switchText.textContent = "New seeker? Register here.";
                    } else {
                        form.action = '/api/register'; nameField.style.display = 'block'; nameField.setAttribute('required', 'true');
                        btnText.textContent = "UNLOCK ARCHIVES"; switchText.textContent = "Already have an access key? Login here.";
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
    data.users.push(user); saveData(data);
    req.session.userId = user.id; req.session.userName = user.name; res.redirect('/');
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const data = getData();
    const user = data.users.find(u => u.email === email);
    if (user && bcrypt.compareSync(password, user.pass)) {
        req.session.userId = user.id; req.session.userName = user.name; res.redirect('/');
    } else { res.send('<script>alert("Invalid Credentials"); window.location="/auth";</script>'); }
});

app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/auth'); });

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

    const donationHtml = `
        <div class="donate-box">
            <h3 style="color:#ffcc00; margin-top:0;">💰 Give Sadaqah (Support The Archives)</h3>
            <p style="color:#888; font-size:13px;">If this Oracle has brought you clarity, please consider giving Sadaqah to maintain the servers and support the scholars.</p>
            ${data.finance.bank ? `<div class="pay-method">🏦 <strong>Bank:</strong> ${data.finance.bank}</div>` : ''}
            ${data.finance.paypal ? `<div class="pay-method">🅿️ <strong>PayPal:</strong> ${data.finance.paypal}</div>` : ''}
            ${data.finance.crypto ? `<div class="pay-method">₿ <strong>Crypto:</strong> ${data.finance.crypto}</div>` : ''}
            ${(!data.finance.bank && !data.finance.paypal && !data.finance.crypto) ? `<div class="pay-method">Contact Admin for Sadaqah details.</div>` : ''}
        </div>
    `;

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEURAL ENGINE - AI Oracle & Spiritual Archives</title>
    ${googleAnalytics}
    <style>
        :root { --gold: #ffcc00; --bg: #050505; --card: #111; --purple: #4b0082; --border: #222;}
        body { background: var(--bg); color: #ccc; font-family: 'Courier New', monospace; margin: 0; padding: 0; scroll-behavior: smooth; overflow-x:hidden;}
        
        ${magicalLogoCss}
        
        nav.top-nav { background: #000; border-bottom: 1px solid var(--purple); display:flex; justify-content:space-between; align-items:center; padding: 15px 5%; position:sticky; top:0; z-index:1000; box-shadow:0 4px 15px rgba(75,0,130,0.4);}
        .nav-brand { font-size: 20px; font-weight: bold; color: var(--gold); letter-spacing: 2px; text-decoration:none;}
        .nav-links { display:flex; gap: 20px; align-items:center;}
        .nav-links a { color: #fff; text-decoration:none; font-size: 14px; font-weight:bold; transition:0.3s;}
        .nav-links a:hover { color: var(--gold); }
        
        .layout { display: grid; grid-template-columns: 250px 1fr 300px; gap: 30px; max-width: 1400px; margin: 40px auto; padding: 0 5%; }
        @media(max-width: 1024px) { .layout { grid-template-columns: 1fr; } .left-sidebar, .right-sidebar { display:none; } }

        .center-content { display:flex; flex-direction:column; align-items:center; }
        .oracle-header { text-align:center; margin-bottom:40px;}
        .oracle-header h1 { color:var(--gold); letter-spacing:8px; font-size:36px; margin:0;}
        .scan-count { background:rgba(75,0,130,0.3); border:1px solid var(--purple); padding:5px 15px; border-radius:20px; color:var(--gold); font-size:12px; font-weight:bold; display:inline-block; margin-top:15px; animation:pulse 2s infinite;}
        @keyframes pulse { 50% { opacity:0.6; } }

        .gates-grid { display:grid; grid-template-columns:1fr 1fr; gap:15px; width:100%; max-width:600px;}
        .gate-btn { background:var(--card); border:1px solid var(--purple); padding:20px; border-radius:10px; color:#fff; font-family:inherit; font-size:15px; font-weight:bold; cursor:pointer; transition:0.3s; text-align:left; display:flex; align-items:center; gap:10px;}
        .gate-btn:hover { background:var(--purple); border-color:var(--gold); transform:translateY(-3px);}
        .gate-icon { font-size:24px; }

        /* THE PURE TEXT FORM */
        #user-form { display:none; width:100%; max-width:500px; background:var(--card); padding:30px; border-radius:10px; border:1px solid var(--gold); box-shadow:0 0 30px rgba(255,204,0,0.1);}
        .input-group { margin-bottom:15px; text-align:left;}
        .input-group label { display:block; color:#888; font-size:12px; margin-bottom:5px;}
        .input-group input, .input-group select { width:100%; padding:12px; background:#000; border:1px solid #333; color:var(--gold); font-family:inherit; font-size:14px; box-sizing:border-box;}

        #loading-ui { display:none; text-align:center; padding:40px; }
        .mystic-text { color:var(--gold); font-size:18px; letter-spacing:3px; margin-top:20px; animation:pulse 1s infinite;}

        #result-ui { display:none; width:100%; max-width:700px; border: 2px dashed var(--gold); padding: 30px; background:#000; animation:fadeIn 1s; box-sizing:border-box; text-align:left;}
        @keyframes fadeIn { from{opacity:0; transform:scale(0.95);} to{opacity:1; transform:scale(1);} }
        .res-star { font-size:26px; color:var(--gold); margin-bottom:10px; font-weight:bold;}
        .res-element { font-size:13px; color:var(--purple); margin-bottom:20px; text-transform:uppercase; letter-spacing:2px; font-weight:bold;}
        .res-desc { line-height:1.8; color:#ccc; margin-bottom:20px; font-size:15px; text-align:justify; border-left:3px solid var(--purple); padding-left:15px;}
        .final-answer { background:rgba(75,0,130,0.2); padding:20px; border:1px solid var(--gold); border-radius:8px; font-size:16px; font-weight:bold; color:#fff; margin-bottom:30px; text-align:center; box-shadow:0 0 15px rgba(255,204,0,0.1);}
        .ramlu-fig { font-size: 20px; color:#fff; background:var(--purple); padding:5px 10px; border-radius:5px; margin-bottom:15px; display:inline-block;}

        .btn-main { background: var(--gold); color: #000; border: none; padding: 15px; cursor: pointer; font-weight: bold; text-transform: uppercase; width: 100%; font-family:inherit; font-size:16px; transition:0.3s; border-radius:5px;}
        .btn-main:hover { background: #fff; box-shadow:0 0 20px #fff;}

        .donate-box { background:rgba(75,0,130,0.2); border:1px solid var(--purple); padding:20px; border-radius:8px; margin-top:30px; text-align:left;}
        .pay-method { background:#000; padding:10px; border:1px solid #333; border-radius:5px; margin-top:10px; font-size:13px; color:#ccc;}

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
        
        .gateway { position:fixed; bottom:10px; right:10px; font-size:10px; color:#222; text-decoration:none; }
        .gateway:hover { color:var(--gold); }

        @media(max-width:600px) { .input-grid{grid-template-columns:1fr;} nav a{padding:10px; font-size:12px;} .gates-grid{grid-template-columns:1fr;} }
    </style>
</head>
<body>

    <nav class="top-nav">
        <a href="/" class="nav-brand">👁️ NEURAL ENGINE</a>
        <div class="nav-links">
            <a href="/">Oracle</a>
            <a href="#archives">Archives</a>
            <a href="#audio">Audio</a>
            <a href="/logout" style="color:#ef4444;">Exit [${req.session.userName}]</a>
        </div>
    </nav>

    <div class="layout">
        <!-- LEFT SIDEBAR -->
        <aside class="left-sidebar">
            <div class="widget">
                <h3>📜 Unseen Archives</h3>
                <p style="font-size:12px; color:#888;">Explore the history of Jinn, Prophets, and traditional healing.</p>
                <div class="grid">${renderCards(jinn).substring(0, 800)}</div>
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
                <h1>NEURAL ENGINE</h1>
                <p>Select a gateway below to begin your calculation.</p>
                <div class="scan-count">👁️ ${data.stats.totalScans} Souls Calculated</div>
            </div>

            <!-- STEP 1: GATES -->
            <div class="gates-grid" id="gates-grid">
                <button class="gate-btn" onclick="selectQuestion('travel')"><span class="gate-icon">✈️</span> Travel & Journey</button>
                <button class="gate-btn" onclick="selectQuestion('wealth')"><span class="gate-icon">💰</span> Wealth & Funding</button>
                <button class="gate-btn" onclick="selectQuestion('business')"><span class="gate-icon">🏢</span> Business Success</button>
                <button class="gate-btn" onclick="selectQuestion('health')"><span class="gate-icon">⚕️</span> Health & Illness</button>
                <button class="gate-btn" onclick="selectQuestion('encounter')"><span class="gate-icon">👥</span> Character Profiling</button>
                <button class="gate-btn" onclick="selectQuestion('marriage')"><span class="gate-icon">❤️</span> Marriage Compatibility</button>
                <button class="gate-btn" onclick="selectQuestion('timing')"><span class="gate-icon">🌙</span> Auspicious Timing</button>
                <button class="gate-btn" onclick="selectQuestion('custom')"><span class="gate-icon">🔮</span> Write Custom Inquiry</button>
            </div>

            <!-- STEP 2: PURE TEXT FORM -->
            <div id="user-form">
                <h3 style="color:var(--gold); text-align:center; margin-top:0;" id="form-title">Enter Spiritual Details</h3>
                <p style="color:#888; font-size:12px; text-align:center; margin-bottom:20px;">The Abjad system requires exact names for accurate calculation.</p>
                
                <div id="custom-query-box" class="input-group" style="display:none;">
                    <label>What do you seek to know? (e.g. "Who is this person", "Will I get married")</label>
                    <input type="text" id="uQuery" placeholder="Type your specific question here...">
                </div>

                <div class="input-group">
                    <label>Your Given Name (Or Subject's Name)</label>
                    <input type="text" id="uName" placeholder="e.g. Ibrahim" required>
                </div>
                <div class="input-group">
                    <label>Mother's Given Name</label>
                    <input type="text" id="mName" placeholder="e.g. Aisha" required>
                </div>
                <div class="input-group" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    <div><label>City of Birth</label><input type="text" id="city" placeholder="e.g. Kano" required></div>
                    <div><label>Secret Number (1-12)</label><input type="number" id="uNum" min="1" max="12" placeholder="Choose 1-12" required></div>
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
                    <!-- FLAWLESS CALCULATE BUTTON -->
                    <button class="btn-main" onclick="startCalculation()">CALCULATE DESTINY</button>
                </div>
            </div>

            <!-- STEP 3: LOADING -->
            <div id="loading-ui">
                ${magicalLogoHtml}
                <div class="mystic-text">DECRYPTING FREQUENCIES...</div>
            </div>

            <!-- STEP 4: RESULT -->
            <div id="result-ui">
                <div style="text-align:center;">
                    <div class="ramlu-fig" id="resRamlu"></div>
                    <div class="res-star" id="resTitle"></div>
                    <div class="res-element" id="resElement"></div>
                </div>
                <div class="res-desc" id="resDesc"></div>
                
                <!-- DIRECT ANSWER INJECTED HERE -->
                <div class="final-answer" id="finalAnswer"></div>
                
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
                <p style="margin-top:20px; font-size:11px;">© 2026 NEURAL ENGINE CLOUD. Deployed on Render.</p>
            </div>
        </div>
    </footer>

    <!-- SECRET ADMIN GATEWAY -->
    <a href="/admin-login" class="gateway">⚙️ System Access</a>

    <script>
        // THE ULTIMATE ABJAD ENGINE
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
            { id: 1, name: "Dariqee", type: "delayed", meaning: "Movement, slow but sure journey." },
            { id: 2, name: "Jama'a", type: "favorable", meaning: "Partnership, community, good for business." },
            { id: 3, name: "Uqba", type: "unfavorable", meaning: "Delays, endings, blockages." },
            { id: 4, name: "Kausaji", type: "spiritual", meaning: "Deceit, something hidden, loss." },
            { id: 5, name: "Dhahika", type: "favorable", meaning: "Joy, success, good news coming." },
            { id: 6, name: "Qabla Kharija", type: "delayed", meaning: "Money leaving, safe travel out." },
            { id: 7, name: "Humra", type: "spiritual", meaning: "Conflict, passion, fire, blood." },
            { id: 8, name: "Inkees", type: "unfavorable", meaning: "Loss, sadness, things turning upside down." },
            { id: 9, name: "Bayaad", type: "favorable", meaning: "Purity, clarity, a good outcome." },
            { id: 10, name: "Nusra Kharija", type: "delayed", meaning: "Victory over distant enemies." },
            { id: 11, name: "Nusra Dakhila", type: "favorable", meaning: "Victory at home, inner peace." },
            { id: 12, name: "Qabla Dakhila", type: "favorable", meaning: "Money arriving, safe return." },
            { id: 13, name: "Ijtima", type: "delayed", meaning: "Meeting of two things, good for marriage." },
            { id: 14, name: "Uqla", type: "unfavorable", meaning: "Tied up, delayed, restricted movement." },
            { id: 15, name: "Kabid Kharija", type: "unfavorable", meaning: "Loss of property, theft." },
            { id: 16, name: "Kabid Dakhila", type: "unfavorable", meaning: "Gaining property, holding tight." }
        ];

        // THE DEEP LOGIC MATRIX
        const logicMatrix = {
            relationship: {
                favorable: { en: "Final Answer: YES. You are highly compatible. This union will bring peace and prosperity.", ha: "Amsar Karshe: EH. Wannan alakar zata kawo alheri sosai.", ar: "الجواب النهائي: نعم. أنتم متوافقون للغاية." },
                delayed: { en: "Final Answer: IT WILL HAPPEN, BUT WITH DELAY. You will face resistance or hurdles first. Patience is required.", ha: "Amsar Karshe: ZAI YIWU, AMMA DA JINKIRI. Za a samu kalubale tukunna.", ar: "الجواب النهائي: سيحدث، ولكن مع التأخير." },
                unfavorable: { en: "Final Answer: NO. The elements clash. Proceeding will bring constant conflict and regret.", ha: "Amsar Karshe: A'A. Dabi'un ku sun saba. Idan akayi za'a samu tashin hankali.", ar: "الجواب النهائي: لا. عناصرك لا تتطابق." },
                spiritual: { en: "Final Answer: BE CAREFUL. There is a third party or Hasad (Evil Eye) trying to block or destroy this union.", ha: "Amsar Karshe: KU KIYAYE. Akwai katsalandan ko hasada daga wani mutum.", ar: "الجواب النهائي: كن حذرا. هناك حسد يحاول عرقلة هذا." }
            },
            wealth: {
                favorable: { en: "Final Answer: YES. Great success is coming. The doors of wealth are open for you right now.", ha: "Amsar Karshe: EH. Babban nasara na zuwa. Kofofin arziki a bude suke.", ar: "الجواب النهائي: نعم. نجاح كبير قادم." },
                delayed: { en: "Final Answer: SUCCESS WILL COME SLOWLY. Keep working hard, your debts and struggles will clear eventually.", ha: "Amsar Karshe: NASARA ZATA ZO A HANKALI. Ka ci gaba da hakuri, komai zai yi kyau.", ar: "الجواب النهائي: النجاح سيأتي ببطء." },
                unfavorable: { en: "Final Answer: NO. There is a high risk of financial loss right now. Do not invest or trust blindly.", ha: "Amsar Karshe: A'A. Akwai hadarin asarar kudi. Kar ka yarda da sabon kasuwanci a yanzu.", ar: "الجواب النهائي: لا. هناك خطر كبير من الخسارة المالية." },
                spiritual: { en: "Final Answer: SPIRITUAL BLOCKAGE. Your wealth is tied down by Sihr or heavy Evil Eye. Give Sadaqah immediately.", ha: "Amsar Karshe: KULLEN ASIRI. Arzikinka yana daure saboda hasada ko sammu. Ka gaggauta fitar da sadaka.", ar: "الجواب النهائي: انسداد روحي. ثروتك مقيدة بالسحر." }
            },
            health_jinn: {
                favorable: { en: "Final Answer: YOU ARE SAFE. The issue is a natural illness, not a spiritual attack. Seek medical help.", ha: "Amsar Karshe: BAKA DA MATSALA TA ALJANU. Ciwon na asibiti ne, ka nemi magani.", ar: "الجواب النهائي: أنت آمن. المشكلة هي مرض طبيعي." },
                delayed: { en: "Final Answer: MILD AFFLICTION. You have been touched by Hasad (Evil Eye). Read protective verses daily.", ha: "Amsar Karshe: TABUWAR HASADA. Akwai kambun baka (Irin). Ka yawaita azkar din safe da yamma.", ar: "الجواب النهائي: أذى خفيف. لقد تأثرت بالحسد." },
                unfavorable: { en: "Final Answer: SEVERE BLOCKAGE. You are experiencing closed doors due to your own past actions or mistakes.", ha: "Amsar Karshe: KULLEWAR AL'AMURA. Kurakuran ka na baya ne suka jawo maka wannan.", ar: "الجواب النهائي: انسداد شديد. أفعالك الماضية هي السبب." },
                spiritual: { en: "Final Answer: JINN/SIHR DETECTED. You are under a direct spiritual attack. You urgently need Ruqyah.", ha: "Amsar Karshe: AKWAI ALJANU KO SAMMU. Ana yimaka aiki a boye. Kana bukatar ayi maka Ruqyah cikin gaggawa.", ar: "الجواب النهائي: تم اكتشاف جن/سحر. أنت بحاجة إلى رقية." }
            },
            timing: {
                favorable: { en: "Final Answer: VERY SOON. Within days or a few weeks.", ha: "Amsar Karshe: NAN KUSA. Cikin yan kwanaki ko makonni kadan.", ar: "الجواب النهائي: قريبا جدا." },
                delayed: { en: "Final Answer: LATER. It will take several months to a year.", ha: "Amsar Karshe: ZAI DAU LOKACI. Zai dauki watanni ko shekara.", ar: "الجواب النهائي: في وقت لاحق." },
                unfavorable: { en: "Final Answer: BLOCKED. It will not happen unless conditions change.", ha: "Amsar Karshe: A RUFE. Ba zai faru ba sai idan ka canza tsari.", ar: "الجواب النهائي: محظور." },
                spiritual: { en: "Final Answer: UNCERTAIN. Spiritual interference is confusing the timeline.", ha: "Amsar Karshe: RASHIN TABBAS. Akwai katsalandan din shaidanu a lokacin.", ar: "الجواب النهائي: غير مؤكد." }
            },
            profiling: {
                favorable: { en: "Final Answer: GOOD CHARACTER. This person is honest, straightforward, and brings peace. You can trust them.", ha: "Amsar Karshe: MUTUMIN KIRKI NE. Mutum ne mai amana da gaskiya. Zaka iya yarda dashi.", ar: "الجواب النهائي: شخصية جيدة. هذا الشخص صادق." },
                delayed: { en: "Final Answer: SECRETIVE. This person hides their true intentions. They are not bad, but they take time to trust others.", ha: "Amsar Karshe: MAI SIRRI NE. Wannan mutumin baya fadar abin da ke ransa. Ana bukatar hakuri dashi.", ar: "الجواب النهائي: كتوم. هذا الشخص يخفي نواياه الحقيقية." },
                unfavorable: { en: "Final Answer: DECEITFUL. Be extremely careful. This person has bad intentions and comes to cause trouble or take from you.", ha: "Amsar Karshe: MAI HA'INCI NE. Ka kiyaye sosai. Wannan mutumin da mugun nufi yazo.", ar: "الجواب النهائي: مخادع. كن حذرا للغاية." },
                spiritual: { en: "Final Answer: UNSTABLE. This person is highly influenced by unseen forces or bad company. They are confused.", ha: "Amsar Karshe: MAI RAUNI NE. Wannan mutumin yana karkashin tasirin kawayen banza ko shaidanu. Yana cikin rudani.", ar: "الجواب النهائي: غير مستقر. يتأثر بقوى غير مرئية." }
            }
        };

        let selectedGate = '';

        function selectQuestion(gate) {
            selectedGate = gate;
            document.getElementById('gates-grid').style.display = 'none';
            document.getElementById('user-form').style.display = 'block';
            
            const titles = {
                'travel': '✈️ Travel & Journey Calculation', 'wealth': '💰 Wealth Calculation', 'business': '🏢 Business Calculation',
                'destiny': '⏳ Destiny Calculation', 'encounter': '👥 Profiling (Who is this person?)', 'marriage': '❤️ Marriage Compatibility',
                'health': '⚕️ Health & Illness', 'timing': '🌙 Auspicious Timing', 'custom': '🔮 Custom Oracle Inquiry'
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

        function determineIntent(gate, query) {
            if (gate === 'marriage') return 'relationship';
            if (gate === 'wealth' || gate === 'business') return 'wealth';
            if (gate === 'timing') return 'timing';
            if (gate === 'encounter') return 'profiling';
            if (gate === 'health') return 'health_jinn';
            
            if (gate === 'custom') {
                const q = query.toLowerCase();
                if (q.includes('marry') || q.includes('wife') || q.includes('husband') || q.includes('love') || q.includes('match') || q.includes('girlfriend') || q.includes('boyfriend')) return 'relationship';
                if (q.includes('money') || q.includes('rich') || q.includes('business') || q.includes('success')) return 'wealth';
                if (q.includes('jinn') || q.includes('magic') || q.includes('sihr') || q.includes('sick') || q.includes('enemy') || q.includes('health') || q.includes('illness')) return 'health_jinn';
                if (q.includes('who') || q.includes('character') || q.includes('nature') || q.includes('person')) return 'profiling';
                if (q.includes('when') || q.includes('time') || q.includes('how long')) return 'timing';
            }
            return 'wealth'; 
        }

        // FLAWLESS CALCULATION TRIGGER (No Camera, Just Math)
        function startCalculation() {
            const n = document.getElementById('uName').value;
            const m = document.getElementById('mName').value;
            const c = document.getElementById('city').value;
            const num = parseInt(document.getElementById('uNum').value);
            const q = document.getElementById('uQuery').value;
            
            if(!n || !m || !c || !num || num < 1 || num > 12) return alert("All fields are required, and number must be 1-12.");
            if(selectedGate === 'custom' && !q) return alert("Please enter your specific question.");

            document.getElementById('user-form').style.display = 'none';
            document.getElementById('oracle-header').style.display = 'none';
            document.getElementById('loading-ui').style.display = 'block';

            fetch('/api/track-scan', {method:'POST'});

            setTimeout(() => {
                document.getElementById('loading-ui').style.display = 'none';
                generateResult(n, m, c, num, q);
            }, 3000); 
        }

        function generateResult(n, m, c, num, q) {
            const lang = document.getElementById('uLang').value;
            
            let baseSum = calculateAbjad(n) + calculateAbjad(m) + calculateAbjad(c);
            let gateVal = calculateAbjad(selectedGate);
            if(selectedGate === 'custom') gateVal += calculateAbjad(q);
            
            let totalSum = baseSum + gateVal + num;

            let starIndex = totalSum % 12; if(starIndex === 0) starIndex = 12;
            const starData = buruj[starIndex - 1];

            let ramlIndex = totalSum % 16; if(ramlIndex === 0) ramlIndex = 16;
            const ramlData = ramlFigures[ramlIndex - 1];

            const intent = determineIntent(selectedGate, q);
            const outcomeType = ramlData.type; 
            
            const finalAnswerObj = logicMatrix[intent][outcomeType];
            const finalAnswer = finalAnswerObj[lang] || finalAnswerObj['en'];

            let resEn = "Based on your Abjad calculation (" + totalSum + "), the star is <strong>" + starData.nameEn + "</strong> and the Raml figure is <strong>" + ramlData.name + "</strong>.<br><br>";
            let resHa = "Bisa lissafin Abjad dinka (" + totalSum + "), tauraron shine <strong>" + starData.nameHa + "</strong> kuma siffar Ramlu itace <strong>" + ramlData.name + "</strong>.<br><br>";
            let resAr = "بناءً على حساب الأبجد الخاص بك (" + totalSum + ")، النجم هو <strong>" + starData.nameAr + "</strong> وشكل الرمل هو <strong>" + ramlData.name + "</strong>.<br><br>";

            if(starData.element === 'Fire') {
                resEn += "The Fire nature brings passion but attracts envy and conflict. "; resHa += "Dabi'ar Wuta tana jawo kishi da farin jini amma akwai fada. "; resAr += "طبيعة النار تجلب العاطفة ولكنها تجذب الحسد. ";
            } else if(starData.element === 'Water') {
                resEn += "The Water nature brings emotion, secrets, and wealth. "; resHa += "Dabi'ar Ruwa tana kawo sanyi, sirri, da arziki. "; resAr += "طبيعة الماء تجلب العاطفة والسرية والثروة. ";
            } else if(starData.element === 'Earth') {
                resEn += "The Earth nature means slow, steady growth and stubbornness. "; resHa += "Dabi'ar Kasa tana nufin girma a hankali da taurin kai. "; resAr += "طبيعة الأرض تعني النمو البطيء والمطرد والعناد. ";
            } else {
                resEn += "The Air nature makes things intelligent, fast, but restless. "; resHa += "Dabi'ar Iska tana kawo basira amma rashin zama wuri daya. "; resAr += "طبيعة الهواء تجعل الأشياء ذكية، سريعة، لكنها لا تهدأ. ";
            }

            document.getElementById('result-ui').style.display = 'block';
            document.getElementById('resRamlu').style.display = 'inline-block';
            document.getElementById('resElement').style.display = 'block';
            document.getElementById('finalAnswer').style.display = 'block';

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
            
            document.getElementById('resTitle').style.color = "var(--gold)";
            document.getElementById('resElement').innerText = "ELEMENT: " + starData.element;
            document.getElementById('finalAnswer').innerHTML = finalAnswer;
        }
    </script>
</body>
</html>
    `);
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

app.get('/admin/reset-scans', checkAdminAuth, (req, res) => {
    const data = getData(); data.stats.totalScans = 0; saveData(data); res.redirect('/super-admin');
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==============================================`);
    console.log(`[SYSTEM] NEURAL ENGINE IS LIVE ON PORT ${PORT}`);
    console.log(`[SYSTEM] Public Terminal Active.`);
    console.log(`[SYSTEM] Secret CEO Gateway: /admin-login`);
    console.log(`==============================================\n`);
});
