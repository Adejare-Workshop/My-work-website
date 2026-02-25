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
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
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
    for (let i = 0; i < 100; i++) particles.push(new Particle());
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
   TYPING EFFECT & COUNTERS
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
    // Typing Effect Logic (Already established)
    const txtElement = document.querySelector('.txt-type');
    const words = ["Computer Science Graduate", "Data Systems Architect", "Automation Specialist"];
    new TypeWriter(txtElement, words, 2000);
});
