// =========================================
// 1. NEURAL BACKGROUND
// =========================================

const canvas = document.getElementById("neural-bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];
const particleCount = 90;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 2;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            this.x -= dx / 25;
            this.y -= dy / 25;
        }
    }

    draw() {
        ctx.fillStyle = "rgba(0, 229, 255, 0.8)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = dx * dx + dy * dy;

            if (distance < 12000) {
                ctx.strokeStyle = "rgba(0, 229, 255, 0.15)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();


// =========================================
// 2. TYPING EFFECT
// =========================================

class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        this.txt = this.isDeleting
            ? fullTxt.substring(0, this.txt.length - 1)
            : fullTxt.substring(0, this.txt.length + 1);

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const txtElement = document.querySelector(".txt-type");
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute("data-words"));
        const wait = txtElement.getAttribute("data-wait");
        new TypeWriter(txtElement, words, wait);
    }
});


// =========================================
// 3. COUNTER ANIMATION
// =========================================

const counters = document.querySelectorAll(".counter");

function runCounters() {
    counters.forEach(counter => {
        const target = +counter.getAttribute("data-target");
        let count = +counter.innerText;
        const increment = target / 200;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(runCounters, 20);
        } else {
            counter.innerText = target + "+";
        }
    });
}


// =========================================
// 4. SCROLL OBSERVER
// =========================================

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            if (entry.target.classList.contains("stats-section")) {
                runCounters();
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(".scroll-animate, .stats-section")
    .forEach(el => observer.observe(el));


// =========================================
// 5. MODAL
// =========================================

window.openModal = function (id) {
    const d = projectData[id];
    if (d) {
        document.getElementById("modalTitle").innerText = d.title;
        document.getElementById("modalDescription").innerHTML = d.desc;
        document.getElementById("modalLink").href = d.link;
        document.getElementById("modalCodeBlock").innerText = d.code;
        document.getElementById("projectModal").style.display = "flex";
    }
};

window.closeModal = function () {
    document.getElementById("projectModal").style.display = "none";
};

window.onclick = function (e) {
    if (e.target === document.getElementById("projectModal")) {
        closeModal();
    }
};
