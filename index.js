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

// ✅ FIX: MISSING USER REGISTRATION & LOGIN ROUTES ADDED BACK
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const data = getData();
    
    if (data.users.find(u => u.email === email)) {
        return res.send('<script>alert("Email already registered! Please login."); window.location="/auth";</script>');
    }
    
    const user = { 
        id: Date.now(), 
        name, 
        email, 
        pass: bcrypt.hashSync(password, 10), 
        joined: new Date().toISOString() 
    };
    
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
        video { width: 100%; height: 100%; object-fit: cover; filter: sepia(100%) hue-rotate(250deg) brightness(80%); transform: scaleX(-1); }
        .scan-line { position: absolute; width: 100%; height: 3px; background: #ffcc00; top: 0; animation: scan 2.5s linear infinite; box-shadow: 0 0 20px #ffcc00, 0 0 40px #ffcc00; }
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
        .res-desc { line-height:1.8; color:#ccc; margin-bottom:30px; font-size:15px; text-align:justify;}

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

        <h2 class="section-title" id="seerah">📜 Seerah (History of Prophets)</h2>
        <div class="grid">${renderCards(seerah)}</div>

        <h2 class="section-title" id="jinn">👁️ Jinn & The Unseen World</h2>
        <div class="grid">${renderCards(jinn)}</div>

        <h2 class="section-title" id="medicine">🌿 Traditional Islamic Medicine</h2>
        <div class="grid">${renderCards(medicine)}</div>

        <h2 class="section-title" id="history">🌍 World & African History</h2>
        <div class="grid">${renderCards(history)}</div>

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

    <a href="/super-admin" class="gateway">⚙️ System Access</a>

    <script>
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

        const video = document.getElementById('webcam');
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { video.srcObject = stream; })
            .catch(err => { console.log("Camera access denied or unavailable."); });
        }

        function calculateAbjad(str) {
            let total = 0;
            str = str.toLowerCase().replace(/\\s/g, '');
            for(let char of str) { total += (abjad[char] || 1); }
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
            document.getElementById('resTitle').innerHTML = "<span style='animation:pulseGlow 1s infinite;'>ANALYZING BIOMETRICS & ABJAD DATA...</span>";

            fetch('/api/track-scan', {method:'POST'});

            setTimeout(() => {
                const sum = calculateAbjad(n) + calculateAbjad(m);
                let starIndex = sum % 12;
                if(starIndex === 0) starIndex = 12;
                
                const starData = buruj[starIndex - 1];
                const isFire = starData.element.includes('Fire');
                const isWater = starData.element.includes('Water');
                const isEarth = starData.element.includes('Earth');

                let readingEn = "Based on the calculation of your Abjad frequency (" + sum + "), your star is " + starData.nameEn + " and your governing element is " + starData.element + ".<br><br>";
                let readingHa = "Bisa lissafin Abjad dinka (" + sum + "), tauraronka shine " + starData.nameHa + " kuma asalin dabi'arka itace " + starData.element + ".<br><br>";

                if(isFire) {
                    readingEn += "You possess strong leadership qualities and intense energy. Be careful of anger and making hasty decisions. Spiritual enemies often attack your temperament. Charity (Sadaqah) involving cooling things or feeding others is recommended for you.";
                    readingHa += "Kana da dabi'ar shugabanci da karfin jiki. Ka kiyaye fushi da gaggawa. Makiya suna amfani da fushinka don cutar da kai. Ana so ka yawaita sadaka da abubuwa masu sanyi ko ciyarwa.";
                } else if(isWater) {
                    readingEn += "You have a deep, emotional, and intuitive spirit. Success flows to you naturally like water, but you absorb negative energies easily. Avoid keeping bad company, and protect your secrets. Water-based spiritual cleansing is highly beneficial.";
                    readingHa += "Ruhinka mai sanyi ne kuma mai zurfi. Nasara tana zuwa maka a saukake kamar ruwa, amma kana saurin daukar mummunan kallo (Irin). Ka kiyaye sirrinka da kawayen banza. Wankan addu'a zai taimake ka matuka.";
                } else if(isEarth) {
                    readingEn += "You are grounded, practical, and destined to build lasting wealth. Patience is your greatest tool. However, you may suffer from spiritual heaviness or blockage in movement. Give charity to the earth (planting trees, feeding ground animals).";
                    readingHa += "Kai mutum ne mai hakuri da rikon amana, kuma an halicce ka don gina arziki mai dorewa. Amma wani lokacin kana fuskantar nauyi ko tsayawar al'amura. Sadakar shuka bishiya ko ciyar da dabbobi zata bude maka kofofi.";
                } else {
                    readingEn += "You are an intellect. Your mind moves fast like the wind. You adapt easily and travel far, but you lack focus and leave projects unfinished. Guard against whispers (Waswas). Reciting protective verses daily keeps your mind clear.";
                    readingHa += "Mai kaifin basira. Tunaninka yana tafiya da sauri kamar iska. Kana saurin sabawa da waje, amma baka cika karasa abin da ka fara ba. Ka kiyaye waswasi ta hanyar yawaita azkar na kariya kullum.";
                }

                document.getElementById('resTitle').innerText = "⭐ " + (lang === 'ha' ? starData.nameHa : starData.nameEn);
                document.getElementById('resElement').innerText = "ELEMENT: " + starData.element;
                document.getElementById('resDesc').innerHTML = lang === 'ha' ? readingHa : readingEn;

            }, 4500); 
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
        .sidebar a { display:block; padding:10px; color:#888; text-decoration:none; cursor:pointer; margin-bottom:5px;}
        .sidebar a:hover, .sidebar a.active { color:#ffcc00; background:#222; border-left:2px solid #ffcc00;}
        .main { flex:1; padding:40px; overflow-y:auto; }
        .panel { display:none; } .panel.active { display:block; }
        h3 { color:#4b0082; border-bottom:1px solid #333; padding-bottom:10px;}
        input, textarea, select { width:100%; padding:10px; margin-bottom:15px; background:#000; border:1px solid #333; color:#ffcc00; box-sizing:border-box;}
        button { background:#ffcc00; color:#000; border:none; padding:12px 20px; font-weight:bold; cursor:pointer; }
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
        <a onclick="show('article')">📜 Write Article</a>
        <a onclick="show('audio')">🎧 Upload Audio</a>
        <a onclick="show('users')">👥 User Database</a>
        <a onclick="show('sec')">🛡️ Security</a>
        <a href="/" target="_blank" style="margin-top:30px; color:#4b0082;">🌐 View Website</a>
        <a href="/logout" style="color:red;">🚪 Logout</a>
    </div>

    <div class="main">
        <div id="dash" class="panel active">
            <h3>System Status</h3>
            <div class="grid">
                <div style="background:#111; padding:20px; border:1px solid #333;">
                    <h4 style="color:#ffcc00;">Total Oracle Scans</h4>
                    <p style="font-size:30px; margin:0;">${data.stats.totalScans}</p>
                </div>
                <div style="background:#111; padding:20px; border:1px solid #333;">
                    <h4 style="color:#ffcc00;">Registered Souls</h4>
                    <p style="font-size:30px; margin:0;">${data.users.length}</p>
                </div>
            </div>
        </div>

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
                <textarea name="content" rows="10" placeholder="Manuscript Content (HTML allowed)" required></textarea>
                <label style="color:#888; font-size:12px;">Upload Image:</label>
                <input type="file" name="image" accept="image/*">
                <button type="submit">Encrypt to Database</button>
            </form>
            
            <h3 style="margin-top:40px;">Manage Manuscripts</h3>
            <table>
                <tr><th>Title</th><th>Category</th><th>Action</th></tr>
                ${data.posts.map(p=>`<tr><td>${p.title}</td><td>${p.category}</td><td><a href="/admin/delete-post/${p.id}" style="color:red;">Delete</a></td></tr>`).join('')}
            </table>
        </div>

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
                ${data.audios.map(a=>`<tr><td>${a.title}</td><td>${a.category}</td><td><a href="/admin/delete-audio/${a.id}" style="color:red;">Delete</a></td></tr>`).join('')}
            </table>
        </div>

        <div id="users" class="panel">
            <h3>Registered Souls Database</h3>
            <table>
                <tr><th>Name</th><th>Email</th><th>Date Joined</th></tr>
                ${data.users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td>${new Date(u.joined).toLocaleDateString()}</td></tr>`).join('')}
            </table>
        </div>

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
