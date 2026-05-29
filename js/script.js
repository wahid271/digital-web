/**
 * Ahmad Portfolio - Main JavaScript
 * Modern, performant, and clean vanilla JavaScript
 */

(function () {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroParticles = document.getElementById('heroParticles');
    const statNumbers = document.querySelectorAll('.stat-number');
    const revealElements = document.querySelectorAll(
        '.service-card, .portfolio-card, .feature-card, .testimonial-card, .about-image-wrapper, .about-content'
    );

    // ============================================
    // Mobile Navigation
    // ============================================
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ============================================
    // Hero Particles
    // ============================================
    function createParticles() {
        if (!heroParticles) return;
        
        const particleCount = 50;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 3 + 1;
            const left = Math.random() * 100;
            const delay = Math.random() * 6;
            const duration = Math.random() * 6 + 4;
            const opacity = Math.random() * 0.5 + 0.1;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
                opacity: ${opacity};
            `;
            
            fragment.appendChild(particle);
        }
        
        heroParticles.appendChild(fragment);
    }

    // ============================================
    // Counter Animation
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        function updateCounter() {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }

        updateCounter();
    }

    // ============================================
    // Intersection Observer for Reveal Animations
    // ============================================
    function setupRevealObserver() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });

        return observer;
    }

    // ============================================
    // Counter Observer (animate when visible)
    // ============================================
    function setupCounterObserver() {
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(num => animateCounter(num));
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            observer.observe(heroStats);
        }
    }

    // ============================================
    // Smooth Scroll for Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Active Nav Link on Scroll
    // ============================================
    function handleActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }

    // Add active-link styles dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .nav-link.active-link {
            color: #ffffff !important;
            background: rgba(16, 185, 129, 0.1);
        }
    `;
    document.head.appendChild(styleSheet);

    // ============================================
    // Scroll Event (Throttled)
    // ============================================
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleNavbarScroll();
                handleActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    // ============================================
    // Performance: Passive Scroll Listener
    // ============================================
    window.addEventListener('scroll', onScroll, { passive: true });

    // ============================================
    // Initialization
    // ============================================
    function init() {
        createParticles();
        setupRevealObserver();
        setupCounterObserver();
        handleNavbarScroll();
        handleActiveNavLink();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // Keyboard Accessibility
    // ============================================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

})();
