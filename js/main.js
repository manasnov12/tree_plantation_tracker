// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {

    // ===== SAFETY: Remove opacity:0 from all elements immediately =====
    // This ensures content is visible even if GSAP fails
    document.querySelectorAll('.gsap-reveal, .gsap-fade-in, .gsap-reveal-left, .gsap-reveal-right, .product-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    // Check if GSAP is available
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded — skipping animations.');
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // ===== Navbar Scroll Effect =====
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ===== Mobile Menu Toggle =====
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('.material-icons');
            if (icon) {
                icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
            }
        });
    }

    // ===== Hero Entrance Animation =====
    const heroH1 = document.querySelector('.hero h1');
    const heroP = document.querySelector('.hero p');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image');

    if (heroH1) {
        const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
        heroTl
            .from(heroH1, { y: 80, opacity: 0 })
            .from(heroP, { opacity: 0, y: 20, duration: 1 }, '-=0.7')
            .from(heroButtons, { opacity: 0, y: 20, duration: 1 }, '-=0.7')
            .from(heroImage, { scale: 0.85, opacity: 0, x: 60, duration: 1.4 }, '-=1');
    }

    // ===== Parallax on Hero Image =====
    if (heroImage) {
        gsap.to(heroImage, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // ===== Feature Cards Stagger Reveal =====
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
        gsap.from(featureCards, {
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });
    }

    // ===== About Section =====
    const aboutImage = document.querySelector('.about-image');
    const aboutText = document.querySelector('.about-text');
    if (aboutImage && aboutText) {
        gsap.from(aboutImage, {
            scrollTrigger: { trigger: '.about-section', start: 'top 80%' },
            x: -80, opacity: 0, duration: 1.2, ease: 'power3.out'
        });
        gsap.from(aboutText, {
            scrollTrigger: { trigger: '.about-section', start: 'top 80%' },
            x: 80, opacity: 0, duration: 1.2, ease: 'power3.out'
        });
    }

    // ===== Product Cards Stagger =====
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0) {
        gsap.from(productCards, {
            scrollTrigger: {
                trigger: '.products-grid',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out'
        });
    }

    // ===== Section Title Reveal =====
    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
        gsap.from(sectionTitle, {
            scrollTrigger: { trigger: sectionTitle, start: 'top 85%' },
            y: 40, opacity: 0, duration: 1, ease: 'power3.out'
        });
    }

    // ===== CTA Section =====
    const ctaCard = document.querySelector('.card-glass');
    if (ctaCard) {
        gsap.from(ctaCard, {
            scrollTrigger: { trigger: ctaCard, start: 'top 85%' },
            scale: 0.95, opacity: 0, duration: 0.8, ease: 'power2.out'
        });
    }
});