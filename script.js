/**
 * ADEJARE.AI - Refactored Production Script
 */

// 1. NEURAL BACKGROUND ENGINE (Fixed & Optimized)
const BackgroundEngine = (() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    const init = () => {
        document.body.prepend(canvas);
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        resize();
        createParticles();
        animate();
    };

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    const createParticles = () => {
        particles = [];
        const count = Math.min(window.innerWidth / 15, 100);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 2 + 1
            });
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
        
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(0, 229, 255, ${1 - dist / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y); ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    };

    return { init, resize };
})();

// 2. PROJECT DATA
const PROJECT_STORAGE = {
    'cancer': {
        title: 'Multimodal Cancer Detection',
        desc: 'Final Year Thesis: Fused Ultrasound (MedCLIP) with clinical data (TabNet) to hit 82.7% accuracy.',
        tags: ['PyTorch', 'MedCLIP', 'AI'],
        link: 'https://github.com/adelugbaadejare034-blip'
    },
    'scraper': {
        title: 'Electoral Data Pipeline',
        desc: 'Selenium-based scraper for 36 Nigerian states. Automated collection for Kontemporary Konsulting.',
        tags: ['Selenium', 'Python', 'Excel'],
        link: 'https://github.com/adejare-dev'
    }
};

// 3. UI INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    BackgroundEngine.init();
    window.addEventListener('resize', BackgroundEngine.resize);

    // Typing Effect Logic
    const typeTarget = document.querySelector('.txt-type');
    if (typeTarget) {
        const words = JSON.parse(typeTarget.dataset.words);
        let wordIdx = 0, charIdx = 0, isDeleting = false;
        
        const type = () => {
            const current = words[wordIdx % words.length];
            typeTarget.textContent = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
            
            let speed = isDeleting ? 50 : 150;
            if (!isDeleting && charIdx === current.length + 1) { speed = 2000; isDeleting = true; }
            if (isDeleting && charIdx === 0) { isDeleting = false; wordIdx++; speed = 500; }
            setTimeout(type, speed);
        };
        type();
    }

    // Scroll Reveal
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Form Handling
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            btn.textContent = "Processing...";
            // Add your Google Sheets Fetch call here
            btn.textContent = "Message Sent!";
            form.reset();
        });
    }
});

// Modal Helpers
window.openProject = (id) => {
    const data = PROJECT_STORAGE[id];
    if (!data) return;
    document.getElementById('m-title').textContent = data.title;
    document.getElementById('m-desc').textContent = data.desc;
    document.getElementById('m-link').href = data.link;
    document.getElementById('project-modal').style.display = 'flex';
};

window.closeModal = () => document.getElementById('project-modal').style.display = 'none';
