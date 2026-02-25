// =========================================
// SINGLE JAVASCRIPT FILE WITH ALL FUNCTIONALITY
// Includes: Neural Network Background, Typing Effect, Counters, Smooth Scroll, Form Handler
// =========================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // =========================================
    // 1. NEURAL NETWORK BACKGROUND ANIMATION
    // =========================================
    
    class NeuralNetwork {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.nodes = [];
            this.nodeCount = 80;
            this.connectionDistance = 150;
            this.mouseX = null;
            this.mouseY = null;
            this.mouseInfluence = 100;
            
            this.init();
            this.setupEventListeners();
            this.animate();
        }
        
        init() {
            this.resize();
            
            // Create nodes
            for (let i = 0; i < this.nodeCount; i++) {
                this.nodes.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 2 + 1.5,
                    pulse: Math.random() * Math.PI * 2
                });
            }
        }
        
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        setupEventListeners() {
            window.addEventListener('resize', () => this.resize());
            
            // Track mouse position for interactive effect
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });
            
            document.addEventListener('mouseleave', () => {
                this.mouseX = null;
                this.mouseY = null;
            });
        }
        
        updateNodes() {
            for (let node of this.nodes) {
                // Update position
                node.x += node.vx;
                node.y += node.vy;
                
                // Bounce off edges
                if (node.x < 0 || node.x > this.canvas.width) {
                    node.vx *= -1;
                    node.x = Math.max(0, Math.min(this.canvas.width, node.x));
                }
                if (node.y < 0 || node.y > this.canvas.height) {
                    node.vy *= -1;
                    node.y = Math.max(0, Math.min(this.canvas.height, node.y));
                }
                
                // Mouse repulsion
                if (this.mouseX !== null && this.mouseY !== null) {
                    const dx = node.x - this.mouseX;
                    const dy = node.y - this.mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.mouseInfluence) {
                        const angle = Math.atan2(dy, dx);
                        const force = (this.mouseInfluence - distance) / this.mouseInfluence * 0.5;
                        node.x += Math.cos(angle) * force;
                        node.y += Math.sin(angle) * force;
                    }
                }
                
                // Update pulse
                node.pulse += 0.02;
            }
        }
        
        drawConnections() {
            for (let i = 0; i < this.nodes.length; i++) {
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const node1 = this.nodes[i];
                    const node2 = this.nodes[j];
                    
                    const dx = node1.x - node2.x;
                    const dy = node1.y - node2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.connectionDistance) {
                        const opacity = 1 - (distance / this.connectionDistance);
                        
                        this.ctx.beginPath();
                        this.ctx.moveTo(node1.x, node1.y);
                        this.ctx.lineTo(node2.x, node2.y);
                        
                        // Cyan color with opacity
                        this.ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.3})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    }
                }
            }
        }
        
        drawNodes() {
            for (let node of this.nodes) {
                // Pulse effect
                const pulseFactor = 0.8 + Math.sin(node.pulse) * 0.2;
                const radius = node.radius * pulseFactor;
                
                // Glow effect
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 229, 255, 0.1)`;
                this.ctx.fill();
                
                // Core node
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 229, 255, 0.8)`;
                this.ctx.fill();
                
                // Inner highlight
                this.ctx.beginPath();
                this.ctx.arc(node.x - 1, node.y - 1, radius * 0.4, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, 0.8)`;
                this.ctx.fill();
            }
        }
        
        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.updateNodes();
            this.drawConnections();
            this.drawNodes();
            
            requestAnimationFrame(() => this.animate());
        }
    }

    // Initialize neural network background
    const canvas = document.getElementById('neural-bg');
    if (canvas) {
        new NeuralNetwork(canvas);
    }

    // =========================================
    // 2. TYPING EFFECT
    // =========================================

    class TypeWriter {
        constructor(txtElement, words, wait = 2000) {
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

            if (this.isDeleting) {
                this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
                this.txt = fullTxt.substring(0, this.txt.length + 1);
            }

            this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

            let typeSpeed = 100;

            if (this.isDeleting) {
                typeSpeed /= 2;
            }

            if (!this.isDeleting && this.txt === fullTxt) {
                typeSpeed = this.wait;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.wordIndex++;
                typeSpeed = 300;
            }

            setTimeout(() => this.type(), typeSpeed);
        }
    }

    // Initialize typing effect
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }

    // =========================================
    // 3. COUNTER ANIMATION FOR STATISTICS
    // =========================================

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const current = parseInt(element.innerText);
        const increment = target / 50; // Divide animation into steps
        
        if (current < target) {
            element.innerText = Math.ceil(current + increment);
            setTimeout(() => animateCounter(element), 20);
        } else {
            element.innerText = target;
        }
    }

    // Use Intersection Observer to trigger counters when visible
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = counter.getAttribute('data-target');
                    if (target !== '0') { // Only animate non-zero values
                        counter.innerText = '0';
                        animateCounter(counter);
                    }
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // =========================================
    // 4. SMOOTH SCROLLING FOR NAVIGATION
    // =========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav item
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Update active nav item on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    });

    // =========================================
    // 5. SCROLL DOWN BUTTON
    // =========================================

    const scrollDown = document.querySelector('.scroll-down');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            const aboutSection = document.querySelector('#about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // =========================================
    // 6. FORM HANDLER (Prevent default for demo)
    // =========================================

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! This is a demo form. In production, you would connect this to a backend service.');
            contactForm.reset();
        });
    }

    // =========================================
    // 7. ADD GLASS EFFECT TO NAV ON SCROLL
    // =========================================

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(15, 23, 42, 0.98)';
            nav.style.backdropFilter = 'blur(15px)';
        } else {
            nav.style.background = 'rgba(15, 23, 42, 0.95)';
            nav.style.backdropFilter = 'blur(10px)';
        }
    });

    // =========================================
    // 8. PARALLAX EFFECT FOR PROFILE PIC
    // =========================================

    const profilePic = document.querySelector('.profile-pic');
    if (profilePic) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            profilePic.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px) scale(1.02)`;
        });
        
        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
            profilePic.style.transform = 'translate(0, 0) scale(1)';
        });
    }

    // =========================================
    // 9. INITIALIZE ANY ADDITIONAL EFFECTS
    // =========================================

    console.log('✅ Portfolio initialized with Neural Network background and Glassmorphism effects!');
});
