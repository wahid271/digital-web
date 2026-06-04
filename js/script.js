(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroParticles = document.getElementById('heroParticles');
    const statNumbers = document.querySelectorAll('.stat-number');
    const revealElements = document.querySelectorAll('.service-card, .portfolio-card, .feature-card, .testimonial-card, .about-image-wrapper, .about-content');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }
    hamburger.addEventListener('click', toggleMenu);
    navLinks.forEach(link => { link.addEventListener('click', () => { if (navMenu.classList.contains('active')) toggleMenu(); }); });
    document.addEventListener('click', (e) => { if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) toggleMenu(); });

    function handleNavbarScroll() { if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled'); }

    function createParticles() {
        if (!heroParticles) return;
        const particleCount = 50;
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 3 + 1;
            const left = Math.random() * 100;
            const delay = Math.random() * 6;
            const duration = Math.random() * 6 + 4;
            const opacity = Math.random() * 0.5 + 0.1;
            particle.style.cssText = `width:${size}px;height:${size}px;left:${left}%;animation-delay:${delay}s;animation-duration:${duration}s;opacity:${opacity};`;
            fragment.appendChild(particle);
        }
        heroParticles.appendChild(fragment);
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        function updateCounter() {
            current += step;
            if (current < target) { element.textContent = Math.floor(current) + '+'; requestAnimationFrame(updateCounter); }
            else { element.textContent = target + '+'; }
        }
        updateCounter();
    }

    function setupRevealObserver() {
        const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); } }); }, observerOptions);
        revealElements.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
        return observer;
    }

    function setupCounterObserver() {
        const observerOptions = { threshold: 0.5 };
        const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { statNumbers.forEach(num => animateCounter(num)); observer.unobserve(entry.target); } }); }, observerOptions);
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) observer.observe(heroStats);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' }); }
        });
    });

    function handleActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => { link.classList.remove('active-link'); if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active-link'); });
            }
        });
    }
    const styleSheet = document.createElement('style');
    styleSheet.textContent = '.nav-link.active-link{color:#ffffff!important;background:rgba(16,185,129,0.1);}';
    document.head.appendChild(styleSheet);

    /* ============================================
       EVE ROBOT 2D HEAD TRACKING
       ============================================ */
    function initEveRobot() {
        const eveHeadWrapper = document.getElementById('eveHeadWrapper');
        const eveLeftArm = document.getElementById('eveLeftArm');
        const eveRightArm = document.getElementById('eveRightArm');
        const eveContainer = document.getElementById('eveContainer');
        if (!eveHeadWrapper || !eveContainer) return;
        let mouseX = 0, mouseY = 0;
        let currentRotateX = 0, currentRotateY = 0;
        let targetRotateX = 0, targetRotateY = 0;
        let isDesktop = window.innerWidth > 768;

        function updateDesktopStatus() { isDesktop = window.innerWidth > 768; }
        window.addEventListener('resize', updateDesktopStatus);

        document.addEventListener('mousemove', function(e) {
            if (!isDesktop) return;
            const headRect = eveHeadWrapper.getBoundingClientRect();
            const headCenterX = headRect.left + headRect.width / 2;
            const headCenterY = headRect.top + headRect.height / 2;
            mouseX = e.clientX;
            mouseY = e.clientY;
            const deltaX = mouseX - headCenterX;
            const deltaY = mouseY - headCenterY;
            const maxRotate = 18;
            targetRotateY = Math.max(-maxRotate, Math.min(maxRotate, deltaX / 25));
            targetRotateX = Math.max(-maxRotate, Math.min(maxRotate, -deltaY / 25));
            if (eveLeftArm) { const armRotate = targetRotateY * 0.3; eveLeftArm.style.transform = `rotate(${-6 + armRotate}deg) translateY(-8px)`; }
            if (eveRightArm) { const armRotate = targetRotateY * 0.3; eveRightArm.style.transform = `rotate(${6 + armRotate}deg) translateY(-8px)`; }
        });

        document.addEventListener('mouseleave', function() {
            targetRotateX = 0; targetRotateY = 0;
            if (eveLeftArm) eveLeftArm.style.transform = '';
            if (eveRightArm) eveRightArm.style.transform = '';
        });

        document.addEventListener('touchmove', function(e) { if (isDesktop) return; targetRotateX = 0; targetRotateY = 0; }, { passive: true });
        document.addEventListener('touchend', function() { targetRotateX = 0; targetRotateY = 0; });

        function animateHead() {
            currentRotateX += (targetRotateX - currentRotateX) * 0.08;
            currentRotateY += (targetRotateY - currentRotateY) * 0.08;
            if (Math.abs(currentRotateX) < 0.01) currentRotateX = 0;
            if (Math.abs(currentRotateY) < 0.01) currentRotateY = 0;
            eveHeadWrapper.style.transform = `translateX(-50%) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
            requestAnimationFrame(animateHead);
        }
        animateHead();

        if (eveContainer) {
            eveContainer.addEventListener('click', function() {
                eveHeadWrapper.style.transition = 'transform 0.1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                eveHeadWrapper.style.transform = 'translateX(-50%) scale(0.9)';
                setTimeout(function() {
                    eveHeadWrapper.style.transform = 'translateX(-50%) scale(1.08)';
                    setTimeout(function() {
                        eveHeadWrapper.style.transform = 'translateX(-50%) scale(1)';
                        eveHeadWrapper.style.transition = 'transform 0.15s ease-out';
                    }, 120);
                }, 120);
            });
        }
    }

    let ticking = false;
    function onScroll() { if (!ticking) { requestAnimationFrame(function() { handleNavbarScroll(); handleActiveNavLink(); ticking = false; }); ticking = true; } }
    window.addEventListener('scroll', onScroll, { passive: true });

    function init() {
        createParticles();
        setupRevealObserver();
        setupCounterObserver();
        handleNavbarScroll();
        handleActiveNavLink();
        initEveRobot();
    }
    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
    else { init(); }

    document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && navMenu.classList.contains('active')) toggleMenu(); });
})();
