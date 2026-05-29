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
    // AI Robot - Eye & Head Tracking
    // ============================================
    function initRobotTracking() {
        const robotHead = document.getElementById('robotHead');
        const leftPupil = document.getElementById('leftPupil');
        const rightPupil = document.getElementById('rightPupil');
        const aiRobotWrapper = document.getElementById('aiRobotWrapper');
        
        if (!robotHead || !leftPupil || !rightPupil) return;
        
        // Mouse move tracking
        document.addEventListener('mousemove', (e) => {
            // Head tracking
            if (robotHead) {
                const headRect = robotHead.getBoundingClientRect();
                const headCenterX = headRect.left + headRect.width / 2;
                const headCenterY = headRect.top + headRect.height / 2;
                
                const deltaX = e.clientX - headCenterX;
                const deltaY = e.clientY - headCenterY;
                
                // Limit head rotation
                const maxRotation = 15;
                const rotateY = Math.max(-maxRotation, Math.min(maxRotation, deltaX / 20));
                const rotateX = Math.max(-maxRotation, Math.min(maxRotation, -deltaY / 20));
                
                robotHead.style.transform = `translateX(-50%) perspective(600px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            }
            
            // Eye pupil tracking
            if (leftPupil && rightPupil) {
                const leftEye = leftPupil.parentElement;
                const rightEye = rightPupil.parentElement;
                
                const leftEyeRect = leftEye.getBoundingClientRect();
                const rightEyeRect = rightEye.getBoundingClientRect();
                
                // Calculate pupil offset
                const maxPupilOffset = 4; // Maximum pixels the pupil can move
                
                // Left eye
                const leftEyeCenterX = leftEyeRect.left + leftEyeRect.width / 2;
                const leftEyeCenterY = leftEyeRect.top + leftEyeRect.height / 2;
                const leftDeltaX = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, (e.clientX - leftEyeCenterX) / 15));
                const leftDeltaY = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, (e.clientY - leftEyeCenterY) / 15));
                
                leftPupil.style.transform = `translate(calc(-50% + ${leftDeltaX}px), calc(-50% + ${leftDeltaY}px))`;
                
                // Right eye
                const rightEyeCenterX = rightEyeRect.left + rightEyeRect.width / 2;
                const rightEyeCenterY = rightEyeRect.top + rightEyeRect.height / 2;
                const rightDeltaX = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, (e.clientX - rightEyeCenterX) / 15));
                const rightDeltaY = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, (e.clientY - rightEyeCenterY) / 15));
                
                rightPupil.style.transform = `translate(calc(-50% + ${rightDeltaX}px), calc(-50% + ${rightDeltaY}px))`;
            }
        });
        
        // Reset position when mouse leaves
        document.addEventListener('mouseleave', () => {
            if (robotHead) {
                robotHead.style.transform = 'translateX(-50%) perspective(600px) rotateY(0deg) rotateX(0deg)';
            }
            if (leftPupil && rightPupil) {
                leftPupil.style.transform = 'translate(-50%, -50%)';
                rightPupil.style.transform = 'translate(-50%, -50%)';
            }
        });
        
        // Touch tracking for mobile
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            if (!touch) return;
            
            if (robotHead) {
                const headRect = robotHead.getBoundingClientRect();
                const headCenterX = headRect.left + headRect.width / 2;
                const headCenterY = headRect.top + headRect.height / 2;
                
                const deltaX = touch.clientX - headCenterX;
                const deltaY = touch.clientY - headCenterY;
                
                const maxRotation = 10;
                const rotateY = Math.max(-maxRotation, Math.min(maxRotation, deltaX / 25));
                const rotateX = Math.max(-maxRotation, Math.min(maxRotation, -deltaY / 25));
                
                robotHead.style.transform = `translateX(-50%) perspective(600px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            }
            
            if (leftPupil && rightPupil) {
                const maxPupilOffset = 3;
                
                const leftEye = leftPupil.parentElement;
                const leftEyeRect = leftEye.getBoundingClientRect();
                const leftEyeCenterX = leftEyeRect.left + leftEyeRect.width / 2;
                const leftEyeCenterY = leftEyeRect.top + leftEyeRect.height / 2;
                const leftDeltaX = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, (touch.clientX - leftEyeCenterX) / 18));
                const leftDeltaY = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, (touch.clientY - leftEyeCenterY) / 18));
                leftPupil.style.transform = `translate(calc(-50% + ${leftDeltaX}px), calc(-50% + ${leftDeltaY}px))`;
                
                const rightEye = rightPupil.parentElement;
                const rightEyeRect = rightEye.getBoundingClientRect();
                const rightEyeCenterX = rightEyeRect.left + rightEyeRect.width / 2;
                const rightEyeCenterY = rightEyeRect.top + rightEyeRect.height / 2;
                const rightDeltaX = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, (touch.clientX - rightEyeCenterX) / 18));
                const rightDeltaY = Math.max(-maxPupilOffset, Math.min(maxPupilOffset, (touch.clientY - rightEyeCenterY) / 18));
                rightPupil.style.transform = `translate(calc(-50% + ${rightDeltaX}px), calc(-50% + ${rightDeltaY}px))`;
            }
        }, { passive: true });
        
        // Click interaction - robot "blink" effect
        const robotFace = document.querySelector('.robot-face');
        if (robotFace && aiRobotWrapper) {
            aiRobotWrapper.addEventListener('click', () => {
                // Add blink class
                robotFace.style.transition = 'transform 0.1s ease';
                robotFace.style.transform = 'scale(0.95)';
                
                // Eyes close temporarily
                const eyes = document.querySelectorAll('.eye');
                eyes.forEach(eye => {
                    eye.style.transition = 'transform 0.15s ease';
                    eye.style.transform = 'scaleY(0.1)';
                });
                
                // Reset after blink
                setTimeout(() => {
                    robotFace.style.transform = 'scale(1)';
                    eyes.forEach(eye => {
                        eye.style.transform = 'scaleY(1)';
                    });
                }, 200);
            });
        }
        
        // Periodic random eye movement (when idle)
        setInterval(() => {
            if (!leftPupil || !rightPupil) return;
            
            // Only do random movement if user is idle (no mouse movement for a while)
            // Random small movement
            const randomX = (Math.random() - 0.5) * 4;
            const randomY = (Math.random() - 0.5) * 3;
            
            leftPupil.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px))`;
            rightPupil.style.transform = `translate(calc(-50% + ${randomX}px), calc(-50% + ${randomY}px))`;
            
            // Reset after short delay
            setTimeout(() => {
                if (leftPupil && rightPupil) {
                    leftPupil.style.transform = 'translate(-50%, -50%)';
                    rightPupil.style.transform = 'translate(-50%, -50%)';
                }
            }, 500 + Math.random() * 500);
        }, 4000 + Math.random() * 3000);
    }

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
        initRobotTracking(); // Initialize AI Robot tracking
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
