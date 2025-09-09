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

function createHeart() {
    const e = document.createElement('div');
    e.className = 'heart';

    // Different heart types for variety
    const heartTypes = ['❤', '💖', '💕', '💗', '💝', '💘', '💞'];
    e.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];

    const s = 12 + Math.random() * 18;
    const d = 6 + Math.random() * 6;
    const x = Math.random() * 100;
    const delay = Math.random() * 2; // Random delay for more natural falling
    const rotation = Math.random() * 360; // Random starting rotation

    e.style.left = x + 'vw';
    e.style.fontSize = s + 'px';
    e.style.animationDuration = d + 's';
    e.style.animationDelay = delay + 's';
    e.style.transform = `rotate(${rotation}deg)`;

    // Add some hearts with different colors
    const colors = ['#ff7aa2', '#ff4d8d', '#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1'];
    e.style.color = colors[Math.floor(Math.random() * colors.length)];

    heartsLayer.appendChild(e);
    setTimeout(() => e.remove(), (d + delay) * 1000 + 200)
}

function startHearts() {
    if (heartsIntervalId) return;
    heartsIntervalId = setInterval(() => {
        for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) createHeart();
    }, 300 + Math.random() * 400); // More random timing
    for (let i = 0; i < 20; i++) setTimeout(createHeart, i * 60)

    // Add floating heart particles
    createFloatingHearts();
}

function createFloatingHearts() {
    setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance every interval
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = ['💖', '💕', '💗'][Math.floor(Math.random() * 3)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * window.innerWidth + 'px';
            heart.style.top = window.innerHeight + 'px';
            heart.style.fontSize = (20 + Math.random() * 15) + 'px';
            heart.style.color = ['#ff7aa2', '#ff4d8d', '#ff69b4'][Math.floor(Math.random() * 3)];
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1';
            heart.style.animation = 'floatUp 8s linear forwards';
            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 8000);
        }
    }, 2000);
}

function showQuote(i) { quoteNodes.forEach((q, idx) => q.classList.toggle('active', idx === i)) }

function nextQuote() {
    currentQuote = (currentQuote + 1) % quoteNodes.length;
    showQuote(currentQuote)
}

function prevQuote() {
    currentQuote = (currentQuote - 1 + quoteNodes.length) % quoteNodes.length;
    showQuote(currentQuote)
}

function autoRotateQuotes() { setInterval(nextQuote, 4000) }

function confettiBurst(cx, cy) {
    const colors = ['#ff4d8d', '#ffd166', '#06d6a0', '#4cc9f0', '#f72585'];
    const count = 120;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.style.position = 'fixed';
        p.style.left = cx + 'px';
        p.style.top = cy + 'px';
        const size = 6 + Math.random() * 6;
        p.style.width = size + 'px';
        p.style.height = (size * 0.6) + 'px';
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.zIndex = 10;
        p.style.transform = 'translate(-50%,-50%)';
        p.style.borderRadius = '2px';
        document.body.appendChild(p);
        let angle = Math.random() * 2 * Math.PI;
        let v = 4 + Math.random() * 8;
        let dx = Math.cos(angle) * v;
        let dy = Math.sin(angle) * v;
        let x = cx,
            y = cy;
        let life = 60 + Math.random() * 40;
        const g = 0.25;
        const spin = (Math.random() * 10 - 5);

        function step() {
            dx *= 0.985;
            dy += g;
            x += dx;
            y += dy;
            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.transform = `translate(-50%,-50%) rotate(${(life*spin)%360}deg)`;
            life -= 1;
            if (life > 0) requestAnimationFrame(step);
            else p.remove()
        }
        requestAnimationFrame(step)
    }
}

function cutCake() {
    if (!cakeArt) return;
    if (!cakeArt.classList.contains('cut')) {
        cakeArt.classList.add('cut');
        const r = cakeArt.getBoundingClientRect();
        confettiBurst(r.left + r.width / 2, r.top + r.height / 3);
        cutCakeBtn.textContent = 'Yay! 🍰';
        setTimeout(() => { cutCakeBtn.textContent = 'Cut again' }, 1800)
    } else {
        cakeArt.classList.remove('cut');
        cutCakeBtn.textContent = 'Cut the cake'
    }
}

// Typewriter love letter (no birthday mention)
const letter = "My love, you are the calm in my chaos, the warmth in every ordinary day. When you laugh, the world softens; when you hold my hand, I feel at home. I am grateful for your patience, your kindness, and the way you see me. Today, tomorrow, and always—I choose you.";
let twIndex = 0;

function typeWriterStep() {
    if (!typewriterEl) return;
    if (twIndex <= letter.length) {
        typewriterEl.textContent = letter.slice(0, twIndex);
        twIndex++;
        setTimeout(typeWriterStep, 38)
    }
}

// Music dock: bind center play caret to audio
(function() {
    const dock = document.getElementById('music-dock');
    const audio = document.getElementById('bgm');
    if (!dock || !audio) return;
    const playIcon = dock.querySelector('.bar .bi-caret-right-fill');
    if (!playIcon) return;
    let playing = false;
    playIcon.style.cursor = 'pointer';
    playIcon.addEventListener('click', async() => {
        try {
            if (!playing) {
                await audio.play();
                playIcon.setAttribute('fill', '#ff4d8d')
            } else {
                audio.pause();
                playIcon.setAttribute('fill', 'currentColor')
            }
            playing = !playing
        } catch (e) { console.warn('Audio failed', e) }
    })
})();

// Dock time badge
(function() {
    const t = document.getElementById('dockTime');
    if (!t) return;

    function pad(n) { return n < 10 ? '0' + n : '' + n }

    function tick() {
        const d = new Date();
        const h = d.getHours();
        const m = d.getMinutes();
        t.textContent = `${pad(h)}:${pad(m)}`
    }
    tick();
    setInterval(tick, 30000)
})();

// Add sparkle effects
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.fontSize = (12 + Math.random() * 8) + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '20';
    sparkle.style.animation = 'sparkle 1.5s ease-out forwards';
    document.body.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1500);
}

// Add sparkle animation to CSS
const style = document.createElement('style');
style.textContent = `
@keyframes sparkle {
    0% { transform: scale(0) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
    100% { transform: scale(0) rotate(360deg); opacity: 0; }
}
`;
document.head.appendChild(style);

// Wire up
startBtn && startBtn.addEventListener('click', () => {
    startHearts();
    document.getElementById('flower').scrollIntoView({ behavior: 'smooth' })
})
nextQuoteBtn && nextQuoteBtn.addEventListener('click', nextQuote)
prevQuoteBtn && prevQuoteBtn.addEventListener('click', prevQuote)
autoRotateQuotes()
cutCakeBtn && cutCakeBtn.addEventListener('click', cutCake)

// Add sparkle effects to flower hover
const flower = document.querySelector('.flower.rose');
if (flower) {
    flower.addEventListener('mouseenter', () => {
        const rect = flower.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createSparkle(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height
                );
            }, i * 100);
        }
    });
}

window.addEventListener('load', () => {
    startHearts();
    typeWriterStep()
})