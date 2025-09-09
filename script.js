const heartsLayer = document.getElementById('hearts-layer');
const startBtn = document.getElementById('startExperience');
const cutCakeBtn = document.getElementById('cutCake');
const cakeArt = document.getElementById('cakeArt');
const prevQuoteBtn = document.getElementById('prevQuote');
const nextQuoteBtn = document.getElementById('nextQuote');
const quoteNodes = Array.from(document.querySelectorAll('.quote'));
const typewriterEl = document.getElementById('typewriter');

let heartsIntervalId = null;
let currentQuote = 0;

function createHeart() { const e = document.createElement('div');
    e.className = 'heart';
    e.textContent = '❤'; const s = 12 + Math.random() * 18; const d = 6 + Math.random() * 6; const x = Math.random() * 100;
    e.style.left = x + 'vw';
    e.style.fontSize = s + 'px';
    e.style.animationDuration = d + 's';
    heartsLayer.appendChild(e);
    setTimeout(() => e.remove(), d * 1000 + 200) }

function startHearts() { if (heartsIntervalId) return;
    heartsIntervalId = setInterval(() => { for (let i = 0; i < 3; i++) createHeart(); }, 520); for (let i = 0; i < 20; i++) setTimeout(createHeart, i * 60) }

function showQuote(i) { quoteNodes.forEach((q, idx) => q.classList.toggle('active', idx === i)) }

function nextQuote() { currentQuote = (currentQuote + 1) % quoteNodes.length;
    showQuote(currentQuote) }

function prevQuote() { currentQuote = (currentQuote - 1 + quoteNodes.length) % quoteNodes.length;
    showQuote(currentQuote) }

function autoRotateQuotes() { setInterval(nextQuote, 4000) }

function confettiBurst(cx, cy) { const colors = ['#ff4d8d', '#ffd166', '#06d6a0', '#4cc9f0', '#f72585']; const count = 120; for (let i = 0; i < count; i++) { const p = document.createElement('div');
        p.style.position = 'fixed';
        p.style.left = cx + 'px';
        p.style.top = cy + 'px'; const size = 6 + Math.random() * 6;
        p.style.width = size + 'px';
        p.style.height = (size * 0.6) + 'px';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.zIndex = 10;
        p.style.transform = 'translate(-50%,-50%)';
        p.style.borderRadius = '2px';
        document.body.appendChild(p); let angle = Math.random() * 2 * Math.PI; let v = 4 + Math.random() * 8; let dx = Math.cos(angle) * v; let dy = Math.sin(angle) * v; let x = cx,
            y = cy; let life = 60 + Math.random() * 40; const g = 0.25; const spin = (Math.random() * 10 - 5);

        function step() { dx *= 0.985;
            dy += g;
            x += dx;
            y += dy;
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.transform = `translate(-50%,-50%) rotate(${(life*spin)%360}deg)`;
            life -= 1; if (life > 0) requestAnimationFrame(step);
            else p.remove() }
        requestAnimationFrame(step) } }

function cutCake() { if (!cakeArt) return; if (!cakeArt.classList.contains('cut')) { cakeArt.classList.add('cut'); const r = cakeArt.getBoundingClientRect();
        confettiBurst(r.left + r.width / 2, r.top + r.height / 3);
        cutCakeBtn.textContent = 'Yay! 🍰';
        setTimeout(() => { cutCakeBtn.textContent = 'Cut again' }, 1800) } else { cakeArt.classList.remove('cut');
        cutCakeBtn.textContent = 'Cut the cake' } }

// Typewriter love letter (no birthday mention)
const letter = "My love, you are the calm in my chaos, the warmth in every ordinary day. When you laugh, the world softens; when you hold my hand, I feel at home. I am grateful for your patience, your kindness, and the way you see me. Today, tomorrow, and always—I choose you.";
let twIndex = 0;

function typeWriterStep() { if (!typewriterEl) return; if (twIndex <= letter.length) { typewriterEl.textContent = letter.slice(0, twIndex);
        twIndex++;
        setTimeout(typeWriterStep, 38) } }

// Music dock: bind center play caret to audio
(function() { const dock = document.getElementById('music-dock'); const audio = document.getElementById('bgm'); if (!dock || !audio) return; const playIcon = dock.querySelector('.bar .bi-caret-right-fill'); if (!playIcon) return; let playing = false;
    playIcon.style.cursor = 'pointer';
    playIcon.addEventListener('click', async() => { try { if (!playing) { await audio.play();
                playIcon.setAttribute('fill', '#ff4d8d') } else { audio.pause();
                playIcon.setAttribute('fill', 'currentColor') }
            playing = !playing } catch (e) { console.warn('Audio failed', e) } }) })();

// Dock time badge
(function() { const t = document.getElementById('dockTime'); if (!t) return;

    function pad(n) { return n < 10 ? '0' + n : '' + n }

    function tick() { const d = new Date(); const h = d.getHours(); const m = d.getMinutes();
        t.textContent = `${pad(h)}:${pad(m)}` }
    tick();
    setInterval(tick, 30000) })();

// Wire up
startBtn && startBtn.addEventListener('click', () => { startHearts();
    document.getElementById('flower').scrollIntoView({ behavior: 'smooth' }) })
nextQuoteBtn && nextQuoteBtn.addEventListener('click', nextQuote)
prevQuoteBtn && prevQuoteBtn.addEventListener('click', prevQuote)
autoRotateQuotes()
cutCakeBtn && cutCakeBtn.addEventListener('click', cutCake)
window.addEventListener('load', () => { startHearts();
    typeWriterStep() })