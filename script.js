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

// --- 2. TYPING EFFECT ---
const TypeWriter = function(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
}

TypeWriter.prototype.type = function() {
    const current = this.wordIndex % this.words.length;
    const fullTxt = this.words[current];
    this.txt = this.isDeleting ? fullTxt.substring(0, this.txt.length - 1) : fullTxt.substring(0, this.txt.length + 1);
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
    let typeSpeed = this.isDeleting ? 50 : 100;
    if(!this.isDeleting && this.txt === fullTxt) { typeSpeed = this.wait; this.isDeleting = true; }
    else if(this.isDeleting && this.txt === '') { this.isDeleting = false; this.wordIndex++; typeSpeed = 500; }
    setTimeout(() => this.type(), typeSpeed);
}

// --- 3. PROJECT DATA & MODALS ---
const projectData = {
    'cancer_fusion': {
        title: 'Multimodal Breast Cancer Detection',
        desc: 'B.Sc. Thesis Project. Fused Ultrasound Images (MedCLIP) with Clinical Data (TabNet) using Early Fusion. Resulted in 82.7% Accuracy and 87.1% ROC-AUC.',
        code: 'fusion_vector = torch.cat((image_emb, tabular_emb), dim=1)\noutput = self.classifier(fusion_vector)',
        link: 'https://github.com/adelugbaadejare034-blip/Breast_cancer_detention_using_muilt_modal_analysis'
    },
    'polling': {
        title: 'Polling Unit Scraper',
        desc: 'Selenium-based data pipeline extracting results across all 36 Nigerian states. Reduced manual collection time by 90%.',
        code: 'driver.get(url)\ndata = driver.find_elements(By.CLASS, "unit")',
        link: 'https://github.com/adejare-dev'
    },
    'automation': {
        title: 'TETFund Workflow Automation',
        desc: 'Developed Python pipelines to parse, clean, and classify institutional reports, eliminating manual bottlenecks.',
        code: 'df = pd.read_excel("report.xlsx")\nprocessed = clean_data(df)',
        link: 'https://github.com/adejare-dev'
    },
    'salary': {
        title: 'Global Tech Salary Prediction',
        desc: 'Regression model forecasting tech salaries based on location and experience levels.',
        code: 'model = RandomForestRegressor(n_estimators=100)\nmodel.fit(X_train, y_train)',
        link: 'https://github.com/adelugbaadejare034-blip/Salary-Prediction-Using-Global-Tech-Job-Metadata-Regression-Model-'
    }
    // Add other project IDs (har, heart, bac, calc) similarly using projectData from your uploaded files.
};

function openModal(id) {
    const d = projectData[id];
    if(d) {
        document.getElementById('modalTitle').innerText = d.title;
        document.getElementById('modalDescription').innerHTML = d.desc;
        const codeBlock = document.getElementById('modalCodeBlock');
        if(codeBlock) codeBlock.innerText = d.code;
        const linkBtn = document.getElementById('modalLink');
        if(linkBtn) linkBtn.href = d.link;
        document.getElementById('projectModal').style.display = 'flex';
    }
}

function closeModal() {
    const modal = document.getElementById('projectModal');
    if(modal) modal.style.display = 'none';
}

// --- 4. STATS COUNTER LOGIC ---
function runCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const updateCount = () => {
            const count = +counter.innerText.replace('+', '');
            const inc = target / 100;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCount();
    });
}

// --- 5. INITIALIZATION & SCROLL OBSERVER ---
document.addEventListener('DOMContentLoaded', () => {
    // Canvas Background
    setupBackground();
    loopBackground();
    window.addEventListener('resize', setupBackground);

    // Typewriter (Index page only)
    const txtElement = document.querySelector('.txt-type');
    if(txtElement) {
        new TypeWriter(txtElement, JSON.parse(txtElement.getAttribute('data-words')), 2000);
    }

    // Scroll Animations & Counters
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stats-section')) {
                    runCounters();
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate, .stats-section').forEach(el => observer.observe(el));

    // --- 6. FORM SUBMISSION (Contact page only) ---
    const contactForm = document.forms['submit-to-google-sheet'];
    if(contactForm) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbzmSCWrVSrNNRVhTIIkfCzbWU52JWvMFRKdjRyUBY9a5XmlHhmKT60S8QDqR9GiNsdNrQ/exec';
        const msg = document.getElementById("msg");
        const btn = document.getElementById("submitBtn");

        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            fetch(scriptURL, { method: 'POST', body: new FormData(contactForm)})
                .then(response => {
                    msg.style.display = "block";
                    msg.innerText = "Message sent successfully!";
                    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                    btn.disabled = false;
                    setTimeout(() => { msg.style.display = "none"; contactForm.reset(); }, 5000);
                })
                .catch(error => {
                    msg.style.display = "block";
                    msg.style.color = "#ff4d4d";
                    msg.innerText = "Error! Please check your internet.";
                    btn.disabled = false;
                });
        });
    }
});

// Global helpers for modals
window.openModal = openModal;
window.closeModal = closeModal;
window.onclick = (e) => { if(e.target == document.getElementById('projectModal')) closeModal(); };
