/* =========================================
   DATA CONSTELLATION ANIMATION
   ========================================= */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 80; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
        p.update();
        p.draw();
        for (let j = index; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                ctx.strokeStyle = `rgba(0, 229, 255, ${1 - distance / 150})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animate);
}

/* =========================================
   TYPING EFFECT
   ========================================= */
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
    if(this.isDeleting) { this.txt = fullTxt.substring(0, this.txt.length - 1); } 
    else { this.txt = fullTxt.substring(0, this.txt.length + 1); }

    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
    let typeSpeed = 100;
    if(this.isDeleting) { typeSpeed /= 2; }
    if(!this.isDeleting && this.txt === fullTxt) { typeSpeed = this.wait; this.isDeleting = true; } 
    else if(this.isDeleting && this.txt === '') { this.isDeleting = false; this.wordIndex++; typeSpeed = 500; }
    setTimeout(() => this.type(), typeSpeed);
}

/* =========================================
   COUNTERS
   ========================================= */
const runCounters = () => {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / 100;
        if(count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(runCounters, 20);
        } else { counter.innerText = target + "+"; }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
    const txtElement = document.querySelector('.txt-type');
    if(txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        new TypeWriter(txtElement, words, 2000);
    }
    // Intersection Observer for Stats
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.classList.contains('stats-section')) {
                runCounters();
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stats-section').forEach(el => observer.observe(el));
});
