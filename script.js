/**
 * ADEJARE.AI - Unified Frontend Logic
 * Includes: Neural Background, Typing Effect, Modal Management, 
 * Stats Counters, and Contact Form handling.
 */

// --- 1. DYNAMIC NEURAL NETWORK BACKGROUND ---
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.prepend(canvas);

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '-1';
canvas.style.background = '#050a14';

let particles = [];
const particleCount = 80; 
const connectionDistance = 160;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.init();
    }
    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
            this.x += dx * 0.01;
            this.y += dy * 0.01;
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
        ctx.fill();
    }
}

function setupBackground() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function loopBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectionDistance) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 229, 255, ${1 - dist / connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(loopBackground);
}

/**
 * 1. NEURAL BACKGROUND ANIMATION
 */
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.prepend(canvas);
canvas.style.cssText = "position:fixed; top:0; left:0; z-index:-1; background:#050a14;";

let particles = [];
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
}

function initBG() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    particles = Array.from({length: 80}, () => new Particle());
}

function animateBG() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
        p.update();
        ctx.fillStyle = 'rgba(0, 229, 255, 0.3)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
            const d = Math.hypot(p.x - particles[j].x, p.y - particles[j].y);
            if (d < 150) {
                ctx.strokeStyle = `rgba(0, 229, 255, ${1 - d/150})`;
                ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animateBG);
}

/**
 * 2. CORE UI LOGIC (Typing, Counters, Modals)
 */
const projectData = {
    'cancer': { title: 'Multimodal Cancer Detection', desc: 'B.Sc. Thesis Project: 82.7% accuracy using MedCLIP & TabNet fusion.', link: 'https://github.com/adelugbaadejare034-blip' },
    'polling': { title: 'Polling Unit Scraper', desc: 'Selenium pipeline for 36 Nigerian states. 90% time reduction.', link: 'https://github.com/adejare-dev' },
    'automation': { title: 'Workflow Automation', desc: 'Python/Pandas pipelines for institutional report cleaning.', link: 'https://github.com/adejare-dev' }
};

function openModal(id) {
    const d = projectData[id];
    document.getElementById('modalTitle').innerText = d.title;
    document.getElementById('modalDesc').innerText = d.desc;
    document.getElementById('modalBtn').onclick = () => window.open(d.link, '_blank');
    document.getElementById('projectModal').style.display = 'flex';
}

function closeModal() { document.getElementById('projectModal').style.display = 'none'; }

document.addEventListener('DOMContentLoaded', () => {
    initBG(); animateBG(); window.addEventListener('resize', initBG);

    // Typing Effect
    const typeEl = document.querySelector('.txt-type');
    if(typeEl) {
        const words = JSON.parse(typeEl.dataset.words);
        let idx = 0, txt = '', isDel = false;
        const type = () => {
            const current = idx % words.length;
            txt = isDel ? words[current].substring(0, txt.length - 1) : words[current].substring(0, txt.length + 1);
            typeEl.innerHTML = `<span class="txt">${txt}</span>`;
            let speed = isDel ? 50 : 150;
            if(!isDel && txt === words[current]) { speed = 2000; isDel = true; }
            else if(isDel && txt === '') { isDel = false; idx++; speed = 500; }
            setTimeout(type, speed);
        };
        type();
    }

    // Intersection Observer
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.scroll-animate').forEach(el => obs.observe(el));

    // Form Handling
    const form = document.forms['submit-to-google-sheet'];
    if(form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.innerText = "Sending...";
            fetch('https://script.google.com/macros/s/AKfycbzmSCWrVSrNNRVhTIIkfCzbWU52JWvMFRKdjRyUBY9a5XmlHhmKT60S8QDqR9GiNsdNrQ/exec', { method: 'POST', body: new FormData(form)})
                .then(() => { btn.innerText = "Sent!"; form.reset(); })
                .catch(() => btn.innerText = "Error!");
        });
    }
});

window.openModal = openModal; window.closeModal = closeModal;
