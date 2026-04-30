console.log("JS Loaded");
//add5ace001b83f4d66ef704f864c0fed
console.log("JS Loaded");

async function register() {
    console.log("Button Clicked");

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log("Data:", name, email, password);

    try {
        const res = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        console.log("Response:", data);
        alert(data.message);

    } catch (err) {
        console.error("ERROR:", err);
    }
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://127.0.0.1:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
        localStorage.setItem('token', data.token);

        // 🔥 CONNECT HERE
        window.location.href = "index3.html";
    } else {
        alert(data.message);
    }
}
async function getProfile() {
    console.log("Function started");

    const token = localStorage.getItem('token');
    console.log("Token:", token);

    try {
        const res = await fetch('http://127.0.0.1:5000/auth/profile', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });

        console.log("Response received");

        const data = await res.json();
        console.log("Data:", data);
        return data;
    } catch (err) {
        console.error("ERROR:", err);
    }
}

async function addLog() {
    const token = localStorage.getItem('token');

    const crop = document.getElementById('crop').value;
    const expense = document.getElementById('expense').value;
    const profit = document.getElementById('profit').value;
    const irrigationDate = document.getElementById('irrigationDate').value;
    const sprayDate = document.getElementById('sprayDate').value;
    const notes = document.getElementById('notes').value;

    try {
        const res = await fetch('http://127.0.0.1:5000/logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                crop,
                expense,
                profit,
                irrigationDate,
                sprayDate,
                notes
            })
        });

        const data = await res.json();
        alert("Log added");

        getLogs(); // refresh list

    } catch (err) {
        console.error(err);
    }
}

async function getLogs() {
    const token = localStorage.getItem('token');

    const res = await fetch('http://127.0.0.1:5000/logs', {
        headers: {
            'Authorization': token
        }
    });

    const logs = await res.json();

const container = document.getElementById('logsContainer');

if (!container) return;

container.innerHTML = "";
    let totalExpense = 0;
    let totalProfit = 0;

    logs.forEach(log => {
        totalExpense += log.expense;
        totalProfit += log.profit;

        container.innerHTML += `
            <div class="card">
                <h3>${log.crop}</h3>
                <p>Expense: ${log.expense}</p>
                <p>Profit: ${log.profit}</p>
                <p>Irrigation: ${new Date(log.irrigationDate).toLocaleDateString()}</p>
                <p>Spray: ${new Date(log.sprayDate).toLocaleDateString()}</p>
                <p>${log.notes}</p>

                <button onclick="deleteLog(${log.id})">Delete</button>
                <button onclick="editLog(${log.id}, '${log.crop}', ${log.expense}, ${log.profit})">Edit</button>
            </div>
        `;
    });

    document.getElementById('totalExpense').innerText = totalExpense;
    document.getElementById('totalProfit').innerText = totalProfit;
}

async function deleteLog(id) {
    const token = localStorage.getItem('token');

    await fetch(`http://127.0.0.1:5000/logs/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': token
        }
    });

    alert("Deleted");
    getLogs();
}
function goToLogs() {
    window.location.href = "index4.html";
}

function goToScan() {
    window.location.href = "index5.html";
}
async function editLog(id, oldCrop, oldExpense, oldProfit) {
    const token = localStorage.getItem('token');

    const crop = prompt("Crop:", oldCrop);
    const expense = prompt("Expense:", oldExpense);
    const profit = prompt("Profit:", oldProfit);

    await fetch(`http://127.0.0.1:5000/logs/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({ crop, expense, profit })
    });

    alert("Updated");
    getLogs();
}

getLogs();

function checkAuth() {
    const token = localStorage.getItem('token');

    let currentPage = window.location.pathname.split("/").pop();

    // 🛠 fix empty path issue
    if (!currentPage) currentPage = "index.html";

    const publicPages = ["index.html", "index1.html", "index2.html"];

    // ✅ allow public pages
    if (publicPages.includes(currentPage)) return;

    // 🔒 protect private pages
    if (!token) {
        window.location.href = "index1.html";
    }
}

checkAuth();

function logout() {
    localStorage.removeItem('token');
    window.location.href = "index1.html";
}

async function getWeatherByLocation() {
    const apiKey = "add5ace001b83f4d66ef704f864c0fed";

    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );

            const data = await res.json();
            if (data.weather[0].main === "Rain") {
            alert("Rain expected 🌧 — avoid spraying today");
            }
            const box = document.getElementById('weatherBox');
            if (!box) return;

            box.innerHTML = `
                <p><b>Location:</b> ${data.name}</p>
                <p><b>Temperature:</b> ${data.main.temp} °C</p>
                <p><b>Humidity:</b> ${data.main.humidity}%</p>
                <p><b>Condition:</b> ${data.weather[0].main}</p>
            `;

        } catch (err) {
            console.error(err);
        }

    }, (error) => {
        console.log("Location denied");
        document.getElementById('weatherBox').innerHTML =
            "<p>Location access denied. Using default city.</p>";
    });
}
if (document.getElementById('weatherBox')) {
    getWeatherByLocation();
}

async function scanImage() {
    const file = document.getElementById('imageInput').files[0];

    if (!file) {
        alert("Select image");
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    const box = document.getElementById('resultBox');
    const chatBox = document.getElementById('messages');
    box.innerHTML = "Scanning... ⏳";
    chatBox.innerHTML = "Analyzing.....";

    try {
        const res = await fetch('http://127.0.0.1:5000/scan', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        console.log("SCAN RESPONSE:", data);

        // ✅ Show scan result
        const disease = data.disease || "Not detected";
const confidenceValue = data.confidence || 0;
const confidence = (confidenceValue * 100).toFixed(1);

box.innerHTML = `
    <h3>🧪 Scan Result</h3>
    <p><b>Disease:</b> ${disease}</p>
    <p><b>Confidence:</b> ${confidence}%</p>
`;

// color indicator
if (confidenceValue > 0.7) {
    box.style.borderLeft = "6px solid green";
} else {
    box.style.borderLeft = "6px solid orange";
}

        // 🤖 Show AI response automatically
        chatBox.innerHTML = `<p class="bot">${data.ai}</p>`;

        if (!data.disease || data.confidence < 0.3) {
    chatBox.innerHTML += `<p class="bot">Try describing the problem manually for better help.</p>`;
}
    } catch (err) {
        console.error(err);
        box.innerHTML = "❌ Scan failed";
    }
}
window.onload = function () {
    const input = document.getElementById('imageInput');

    if (input) {
        input.addEventListener('change', function () {
            const file = this.files[0];
            const preview = document.getElementById('preview');

            if (file && preview) {
                preview.src = URL.createObjectURL(file);
                preview.style.display = "block";
            }
        });
    }
};
async function sendMessage() {
    const input = document.getElementById('userInput');
    const messages = document.getElementById('messages');

    const userText = input.value;
    if (!userText) return;

    messages.innerHTML += `<p class="user">You: ${userText}</p>`;
    input.value = "";

    try {
        const outputLang = document.getElementById('outputLang').value;

        // ✅ FIRST define res
        const res = await fetch('http://127.0.0.1:5000/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ 
             message: userText,
            lang: outputLang
            })
        });

        // ✅ THEN use res
        const data = await res.json();

        messages.innerHTML += `<p class="bot">AI: ${data.reply}</p>`;

        // 🔊 voice
        const isVoiceOn = document.getElementById('voiceToggle').checked;

if (isVoiceOn) {
    speak(data.reply);
}

    } catch (err) {
        console.error("ERROR:", err);
    }
}//OEDKOyL4g6JgetR9qpQIuBnpacLubF4xaTa5DE3kmP74m8aCdR

function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    const lang = document.getElementById('lang').value;

    if (lang === "hi") recognition.lang = "hi-IN";
    else if (lang === "bn") recognition.lang = "bn-IN";
    else recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById('userInput').value = text;
    };

    recognition.onerror = (err) => {
        console.error(err);
    };
}

// ==============================
// 🔊 speak() — routes through your own backend to avoid CORS
// ==============================

function speak(text) {
    const lang = document.getElementById('outputLang')?.value 
              || document.getElementById('lang')?.value 
              || 'en';

    const langCodeMap = { en: 'en', hi: 'hi', bn: 'bn' };
    const ttsLang = langCodeMap[lang] || 'en';

    // ✅ Strip markdown before sending
    const cleanText = text
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/#/g, '')
        .replace(/[-•]/g, '')
        .replace(/\n+/g, ' ')
        .trim();

    if (!cleanText) return;

    // ✅ Stop any playing audio
    if (window._ttsAudio) {
        window._ttsAudio.pause();
        window._ttsAudio = null;
    }

    // ✅ Call YOUR backend (avoids CORS block)
    const url = `http://127.0.0.1:5000/api/tts?text=${encodeURIComponent(cleanText)}&lang=${ttsLang}`;
    const audio = new Audio(url);
    window._ttsAudio = audio;

    audio.play().catch(err => {
        console.error('TTS play error:', err);
    });
}

// ==============================
// ⏹️ Stop speaking
// ==============================
function stopSpeaking() {
    if (window._ttsAudio) {
        window._ttsAudio.pause();
        window._ttsAudio = null;
    }
}