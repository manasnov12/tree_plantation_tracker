// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        const icon = mobileMenu.querySelector('.material-icons');
        if (icon) {
            icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileMenu.contains(e.target)) {
            navLinks.classList.remove('active');
            const icon = mobileMenu.querySelector('.material-icons');
            if (icon) icon.textContent = 'menu';
        }
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenu.querySelector('.material-icons');
            if (icon) icon.textContent = 'menu';
        });
    });
}

gsap.registerPlugin(ScrollTrigger);
const heroTL = gsap.timeline({ defaults: { ease: "power3.out" } });

heroTL.from(".left h1, .left h2, .left h3", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
});
heroTL.from("#plant", {
    x: 50,
    opacity: 0,
    duration: 1.5,
}, "<0.2");

heroTL.from(".p1, #B1, #B2", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.2,
}, "<0.5");

gsap.from(".card", {
    opacity: 0,
    y: 50,
    scale: 0.8,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".two",
        start: "top 80%",
        end: "bottom 80%",
        scrub: 1,
        toggleActions: "play reverse play reverse"
    }
});

gsap.from("#paade", {
    x: -100,
    opacity: 0,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".three",
        start: "top 70%",
        end: "bottom 50%",
        scrub: 1.5,
        toggleActions: "play reverse play reverse"
    }
});


gsap.from(".right-con h2, #P2", {
    x: 30,
    opacity: 0,
    stagger: 0.3,
    ease: "power2.out",
    scrollTrigger: {
        trigger: ".right-con",
        start: "top 80%",
        end: "bottom 50%",
        scrub: 1.5,
        toggleActions: "play reverse play reverse"
    }
});

const serviceCards = gsap.utils.toArray("#T");

serviceCards.forEach((card, i) => {
    gsap.from(card, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        ease: "power3.out",
        scrollTrigger: {
            trigger: card,
            start: "top 95%",
            end: "bottom 80%",
            scrub: 0.6,
            toggleActions: "play reverse play reverse",

        }
    });
});