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
            
            // Track mouse position for
