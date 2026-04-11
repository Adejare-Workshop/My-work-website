// =========================================
// 1. ENHANCED NEURAL BACKGROUND
// =========================================
(function initNeuralBackground() {
    const canvas = document.getElementById("neural-bg");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const particleCount = isMobile ? 45 : 90;
    const connectionDistance = 130;
    const mouseRadius = 160;
    let mouse = { x: null, y: null };
    let animationId;
    let particles = [];
    let time = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { resizeCanvas(); init(); }, 200);
    });
    resizeCanvas();

    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener("mouseout", () => { mouse.x = null; mouse.y = null; });

    class Particle {
        constructor() { this.reset(true); }

        reset(randomY = false) {
            this.x = Math.random() * canvas.width;
            this.y = randomY ? Math.random() * canvas.height : Math.random() * canvas.height;
            this.baseSize = Math.random() * 1.5 + 0.8;
            this.size = this.baseSize;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseOffset = Math.random() * Math.PI * 2;
            this.isHot = Math.random() < 0.08;
        }

        update(t) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.size = this.baseSize + Math.sin(t * this.pulseSpeed + this.pulseOffset) * 0.5;
            const margin = 10;
            if (this.x < -margin) this.x = canvas.width + margin;
            if (this.x > canvas.width + margin) this.x = -margin;
            if (this.y < -margin) this.y = canvas.height + margin;
            if (this.y > canvas.height + margin) this.y = -margin;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseRadius) {
                    const force = (mouseRadius - dist) / mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 2.5;
                    this.y -= Math.sin(angle) * force * 2.5;
                }
            }
        }

        draw() {
            const alpha = this.isHot ? Math.min(this.opacity * 1.8, 0.9) : this.opacity;
            const color = this.isHot ? `rgba(0, 180, 255, ${alpha})` : `rgba(0, 229, 255, ${alpha})`;
            ctx.save();
            if (this.isHot) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(0, 229, 255, 0.6)';
            }
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distSq = dx * dx + dy * dy;
                if (distSq < connectionDistance * connectionDistance) {
                    const dist = Math.sqrt(distSq);
                    const t = 1 - dist / connectionDistance;
                    const isHotLink = particles[a].isHot || particles[b].isHot;
                    const base = isHotLink ? 0.22 : 0.1;
                    const alpha = t * base;
                    const gradient = ctx.createLinearGradient(
                        particles[a].x, particles[a].y, particles[b].x, particles[b].y
                    );
                    gradient.addColorStop(0, `rgba(0, 229, 255, ${alpha})`);
                    gradient.addColorStop(0.5, `rgba(0, 100, 255, ${alpha * 0.6})`);
                    gradient.addColorStop(1, `rgba(0, 229, 255, ${alpha})`);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = isHotLink ? 1.2 : 0.7;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function animate() {
        time++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(time); p.draw(); });
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    init();
    animate();

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
})();

// =========================================
// 2. SCROLL PROGRESS
// =========================================
(function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        bar.style.width = pct + '%';
    }, { passive: true });
})();

// =========================================
// 3. MOBILE MENU
// =========================================
(function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        toggle.setAttribute('aria-expanded', isOpen);
        const spans = toggle.querySelectorAll('span');
        if (isOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });

    navLinks.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            const spans = toggle.querySelectorAll('span');
            spans.forEach(s => s.style.transform = '');
            spans[1].style.opacity = '1';
        });
    });
})();

// =========================================
// 4. TYPING EFFECT
// =========================================
(function initTypeWriter() {
    const el = document.querySelector(".txt-type");
    if (!el) return;

    const words = JSON.parse(el.getAttribute("data-words"));
    const wait = parseInt(el.getAttribute("data-wait")) || 2000;
    let txt = '', wordIndex = 0, isDeleting = false;

    function type() {
        const full = words[wordIndex % words.length];
        txt = isDeleting ? full.substring(0, txt.length - 1) : full.substring(0, txt.length + 1);
        el.innerHTML = txt + '<span class="cursor">|</span>';

        let speed = isDeleting ? 45 : 95;
        if (!isDeleting && txt === full) { speed = wait; isDeleting = true; }
        else if (isDeleting && txt === '') { isDeleting = false; wordIndex++; speed = 500; }

        setTimeout(type, speed);
    }
    type();
})();

// =========================================
// 5. COUNTER ANIMATION (decimal + suffix support)
// =========================================
(function initCounters() {
    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    counters.forEach(c => {
        const suffix  = c.getAttribute("data-suffix") || "";
        const decimal = c.getAttribute("data-decimal") || "";
        c.textContent = "0" + decimal + suffix;
    });

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const counter  = entry.target;
            const target   = parseInt(counter.getAttribute("data-target"));
            const suffix   = counter.getAttribute("data-suffix") || "";
            const decimal  = counter.getAttribute("data-decimal") || "";
            const duration = 1800;
            const startTime = performance.now();

            function step(now) {
                const elapsed  = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 4);
                const value = Math.floor(eased * target);

                if (progress >= 1) {
                    counter.textContent = target + decimal + suffix;
                } else {
                    counter.textContent = value + suffix;
                    requestAnimationFrame(step);
                }
            }
            requestAnimationFrame(step);
            obs.unobserve(counter);
        });
    }, { threshold: 0.4 });

    counters.forEach(c => obs.observe(c));
})();

// =========================================
// 6. SCROLL ANIMATIONS
// =========================================
(function initScrollAnimations() {
    const els = document.querySelectorAll(".scroll-animate, .glow-card, .stat-item, .timeline-item");
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
})();

// =========================================
// 7. CONTACT PAGE — DATA STREAMS ANIMATION
// =========================================
(function initContactPageEffects() {
    if (!document.querySelector('.contact-container')) return;

    const orbsContainer = document.createElement('div');
    orbsContainer.className = 'contact-orbs';
    orbsContainer.innerHTML = `
        <div class="contact-orb contact-orb-1"></div>
        <div class="contact-orb contact-orb-2"></div>
        <div class="contact-orb contact-orb-3"></div>
    `;
    document.body.prepend(orbsContainer);

    const streamsContainer = document.createElement('div');
    streamsContainer.className = 'data-streams';

    const streamCount = 12;
    for (let i = 0; i < streamCount; i++) {
        const stream = document.createElement('div');
        stream.className = 'data-stream';
        stream.style.left = (Math.random() * 100) + '%';
        stream.style.height = (Math.random() * 80 + 60) + 'px';
        stream.style.animationDuration = (Math.random() * 6 + 4) + 's';
        stream.style.animationDelay = (Math.random() * 8) + 's';
        stream.style.opacity = '0';
        streamsContainer.appendChild(stream);
    }
    document.body.prepend(streamsContainer);

    const header = document.querySelector('.page-header h1');
    if (header) {
        header.style.opacity = '0';
        header.style.transform = 'translateY(20px)';
        header.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 300);
    }

    const panels = document.querySelectorAll('.contact-info, .contact-form');
    panels.forEach((panel, i) => {
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(30px)';
        panel.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, 400 + i * 180);
    });

    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) * 0.3;
            const dy = (e.clientY - cy) * 0.3;
            btn.style.transform = `translate(${dx}px, ${dy - 4}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'all 0.4s ease';
        });
    });

    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('focus', () => {
            const group = input.closest('.form-group');
            group.style.transform = 'scale(1.01)';
            group.style.transition = 'transform 0.2s ease';
        });
        input.addEventListener('blur', () => {
            const group = input.closest('.form-group');
            group.style.transform = '';
        });
    });
})();

// =========================================
// 8. SMOOTH SCROLL
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// =========================================
// 9. RADAR CHART
// =========================================
(function initRadarChart() {
    const svg = document.getElementById('radarChart');
    if (!svg) return;

    const cx = 200, cy = 200, R = 150;
    const levels = 5;

    const axes = [
        { label: 'ML / AI',       value: 0.88 },
        { label: 'Data Eng.',     value: 0.82 },
        { label: 'Automation',    value: 0.90 },
        { label: 'SQL / DB',      value: 0.76 },
        { label: 'Python',        value: 0.92 },
        { label: 'Documentation', value: 0.78 },
    ];

    const n = axes.length;
    const angleStep = (Math.PI * 2) / n;
    const startAngle = -Math.PI / 2;

    function polar(angle, r) {
        return {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle)
        };
    }

    function pointsToPath(pts) {
        return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') + ' Z';
    }

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="#00e5ff" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#0066ff" stop-opacity="0.08"/>
        </radialGradient>
        <radialGradient id="radarFillHover" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stop-color="#00e5ff" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#0066ff" stop-opacity="0.15"/>
        </radialGradient>
    `;
    svg.appendChild(defs);

    for (let lvl = 1; lvl <= levels; lvl++) {
        const r = (R / levels) * lvl;
        const pts = axes.map((_, i) => polar(startAngle + i * angleStep, r));
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pointsToPath(pts));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', lvl === levels ? 'rgba(0,229,255,0.15)' : 'rgba(255,255,255,0.05)');
        path.setAttribute('stroke-width', lvl === levels ? '1.2' : '0.8');
        svg.appendChild(path);
    }

    axes.forEach((axis, i) => {
        const angle = startAngle + i * angleStep;
        const tip = polar(angle, R);
        const labelPt = polar(angle, R + 26);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', cx); line.setAttribute('y1', cy);
        line.setAttribute('x2', tip.x.toFixed(2)); line.setAttribute('y2', tip.y.toFixed(2));
        line.setAttribute('stroke', 'rgba(0,229,255,0.12)');
        line.setAttribute('stroke-width', '1');
        svg.appendChild(line);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', labelPt.x.toFixed(2));
        text.setAttribute('y', labelPt.y.toFixed(2));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', '#94a3b8');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-family', 'Plus Jakarta Sans, sans-serif');
        text.setAttribute('font-weight', '600');
        text.textContent = axis.label;
        svg.appendChild(text);
    });

    const dataPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    dataPath.setAttribute('fill', 'url(#radarFill)');
    dataPath.setAttribute('stroke', '#00e5ff');
    dataPath.setAttribute('stroke-width', '1.8');
    dataPath.setAttribute('stroke-linejoin', 'round');
    dataPath.setAttribute('opacity', '0');
    dataPath.style.transition = 'opacity 0.4s';
    svg.appendChild(dataPath);

    const dots = axes.map((axis, i) => {
        const angle = startAngle + i * angleStep;
        const pt = polar(angle, R * axis.value);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', pt.x.toFixed(2));
        circle.setAttribute('cy', pt.y.toFixed(2));
        circle.setAttribute('r', '4');
        circle.setAttribute('fill', '#00e5ff');
        circle.setAttribute('stroke', '#03080f');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('opacity', '0');
        circle.style.transition = `opacity 0.3s ${0.8 + i * 0.05}s`;
        svg.appendChild(circle);
        return circle;
    });

    const centerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    centerDot.setAttribute('cx', cx); centerDot.setAttribute('cy', cy);
    centerDot.setAttribute('r', '3');
    centerDot.setAttribute('fill', 'rgba(0,229,255,0.4)');
    svg.appendChild(centerDot);

    let drawn = false;
    function drawRadar(progress) {
        const pts = axes.map((axis, i) => {
            const angle = startAngle + i * angleStep;
            return polar(angle, R * axis.value * progress);
        });
        dataPath.setAttribute('d', pointsToPath(pts));
    }

    function animateRadar() {
        if (drawn) return;
        drawn = true;
        dataPath.setAttribute('opacity', '1');
        dots.forEach(d => d.setAttribute('opacity', '1'));

        const duration = 1200;
        const start = performance.now();
        function step(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            drawRadar(eased);
            if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    drawRadar(0);

    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateRadar();
            obs.disconnect();
        }
    }, { threshold: 0.3 });
    obs.observe(svg);
})();

// =========================================
// 10. SKILL PROFICIENCY BAR ANIMATION
// =========================================
(function initProficiencyBars() {
    const fills = document.querySelectorAll('.prof-fill');
    if (!fills.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const allFills = entry.target.querySelectorAll('.prof-fill');
                allFills.forEach((fill, i) => {
                    setTimeout(() => fill.classList.add('animate'), i * 80);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const panel = document.querySelector('.proficiency-panel');
    if (panel) obs.observe(panel);
})();
