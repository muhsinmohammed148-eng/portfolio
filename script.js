// ============================================
// CUSTOM CURSOR — MAGNETIC RIBBON TRAIL
// ============================================
const canvas = document.getElementById('cursorCanvas');
const ctx = canvas.getContext('2d');

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

window.addEventListener('resize', () => {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
});

// Mouse tracking
let mouse = { x: canvasWidth / 2, y: canvasHeight / 2 };
let isMouseMoving = false;
let mouseTimeout;
let isHovering = false;
let isClicking = false;

// Trail points history
const trailLength = 60;
const trail = [];
for (let i = 0; i < trailLength; i++) {
    trail.push({ x: canvasWidth / 2, y: canvasHeight / 2 });
}

// Click burst particles
const bursts = [];

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    isMouseMoving = true;
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => { isMouseMoving = false; }, 100);
});

document.addEventListener('mousedown', (e) => {
    isClicking = true;
    // Create burst particles on click
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.5;
        const speed = 2 + Math.random() * 4;
        bursts.push({
            x: mouse.x,
            y: mouse.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: 0.02 + Math.random() * 0.02,
            size: 2 + Math.random() * 3,
            hue: Math.random() > 0.5 ? 0 : 40 // red or pearl white
        });
    }
});

document.addEventListener('mouseup', () => {
    isClicking = false;
});

// Hover detection
const interactiveElements = document.querySelectorAll(
    'a, button, .btn, .filter-btn, .project-card, .domain-tags span, .carousel-btn, .dot, input, textarea, select, .social-link, .contact-method'
);

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => { isHovering = true; });
    el.addEventListener('mouseleave', () => { isHovering = false; });
});

// Hide canvas when mouse leaves window
document.addEventListener('mouseleave', () => {
    canvas.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    canvas.style.opacity = '1';
});

// Easing for smooth trail
let smoothMouse = { x: mouse.x, y: mouse.y };

// Draw the ribbon trail
function drawRibbon() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update smooth mouse position
    smoothMouse.x += (mouse.x - smoothMouse.x) * 0.35;
    smoothMouse.y += (mouse.y - smoothMouse.y) * 0.35;

    // Add current position to trail
    trail.unshift({ x: smoothMouse.x, y: smoothMouse.y });
    if (trail.length > trailLength) {
        trail.pop();
    }

    // Draw the ribbon using bezier curves
    if (trail.length > 3) {
        for (let i = 0; i < trail.length - 2; i++) {
            const progress = i / trail.length;
            const point = trail[i];
            const nextPoint = trail[i + 1];
            const afterPoint = trail[i + 2];

            // Thickness: thick at head, thin at tail
            const baseWidth = isHovering ? 6 : 4;
            const width = baseWidth * (1 - progress * 0.9);

            // Opacity: full at head, fades at tail
            const opacity = (1 - progress) * (isHovering ? 0.9 : 0.6);

            // Color: Rosso Corsa red at head, Pearl White at tail
            const hue = 0 + progress * 40; // 0 (red) -> 40 (pearl white)
            const saturation = isHovering ? 90 : 80;
            const lightness = isHovering ? 60 : 55;

            ctx.beginPath();

            // Smooth curve through points
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            }

            const midX = (point.x + nextPoint.x) / 2;
            const midY = (point.y + nextPoint.y) / 2;
            ctx.quadraticCurveTo(point.x, point.y, midX, midY);

            ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;
            ctx.lineWidth = width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();

            // Glow layer
            if (isHovering || isClicking) {
                ctx.beginPath();
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                }
                ctx.quadraticCurveTo(point.x, point.y, midX, midY);
                ctx.strokeStyle = `hsla(${hue}, 100%, 80%, ${opacity * 0.3})`;
                ctx.lineWidth = width * 3;
                ctx.filter = 'blur(4px)';
                ctx.stroke();
                ctx.filter = 'none';
            }
        }

        // Draw cursor head dot
        const headSize = isClicking ? 3 : (isHovering ? 5 : 4);
        ctx.beginPath();
        ctx.arc(trail[0].x, trail[0].y, headSize, 0, Math.PI * 2);
        ctx.fillStyle = isHovering
            ? `hsla(40, 60%, 85%, 0.9)`
            : `hsla(0, 80%, 55%, 0.8)`;
        ctx.fill();

        // Cursor head glow
        ctx.beginPath();
        ctx.arc(trail[0].x, trail[0].y, headSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isHovering
            ? `hsla(40, 80%, 85%, 0.15)`
            : `hsla(0, 100%, 55%, 0.1)`;
        ctx.fill();
    }

    // Draw burst particles
    for (let i = bursts.length - 1; i >= 0; i--) {
        const p = bursts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= p.decay;

        if (p.life <= 0) {
            bursts.splice(i, 1);
            continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life * 0.8})`;
        ctx.fill();

        // Particle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 80%, ${p.life * 0.2})`;
        ctx.fill();
    }

    requestAnimationFrame(drawRibbon);
}

drawRibbon();

// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Scroll effect for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile navigation toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============================================
// COUNTER ANIMATION
// ============================================
const statNumbers = document.querySelectorAll('.stat-number');
let counted = false;

function animateCounters() {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Trigger counters when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
            counted = true;
            animateCounters();
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const fadeElements = document.querySelectorAll(
    '.skill-group, .timeline-item, .project-card, .about-grid, .contact-grid, .skills-sidebar'
);

fadeElements.forEach(el => {
    el.classList.add('fade-in');
});

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => scrollObserver.observe(el));

// ============================================
// SECTION TITLE REVEAL
// ============================================
const sectionTitles = document.querySelectorAll('.section-title');

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.5 });

sectionTitles.forEach(title => titleObserver.observe(title));

// ============================================
// TIMELINE DRAW ON SCROLL
// ============================================
const timeline = document.querySelector('.timeline');

if (timeline) {
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.2 });

    timelineObserver.observe(timeline);
}

// ============================================
// CURSOR-FOLLOW GLOW ON PROJECT CARDS
// ============================================
const cards = document.querySelectorAll('.project-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ============================================
// FLOATING PARTICLES IN HERO
// ============================================
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'hero-particles';
    hero.appendChild(particlesContainer);

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.opacity = 0;

        // Random color between accent and secondary
        if (Math.random() > 0.5) {
            particle.style.background = 'var(--secondary)';
        }

        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ============================================
// STAGGERED SCROLL REVEAL FOR PROJECT GRID
// ============================================
const projectsGrid = document.querySelector('.projects-grid');
if (projectsGrid) {
    projectsGrid.classList.add('stagger-children');
}

// ============================================
// ABOUT GRID DIRECTIONAL ANIMATIONS
// ============================================
const aboutImage = document.querySelector('.about-image');
const aboutContent = document.querySelector('.about-content');

if (aboutImage) {
    aboutImage.classList.add('fade-in', 'from-left');
    scrollObserver.observe(aboutImage);
}

if (aboutContent) {
    aboutContent.classList.add('fade-in', 'from-right');
    scrollObserver.observe(aboutContent);
}

// ============================================
// SKILLS SIDEBAR SCALE ANIMATION
// ============================================
const skillsSidebar = document.querySelector('.skills-sidebar');
if (skillsSidebar) {
    skillsSidebar.classList.add('scale-in');
}

// ============================================
// PROJECT FILTERS
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.4s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// CONTACT FORM HANDLING
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        const mailtoLink = `mailto:mmusi0634@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        window.location.href = mailtoLink;

        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Opening email client...';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            this.reset();
        }, 3000);
    });
}

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ============================================
// IMAGE CAROUSEL
// ============================================
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselDots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
let currentSlide = 0;
let carouselInterval;

function goToSlide(index) {
    carouselSlides[currentSlide].classList.remove('active');
    carouselDots[currentSlide].classList.remove('active');
    currentSlide = index;
    if (currentSlide >= carouselSlides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = carouselSlides.length - 1;
    carouselSlides[currentSlide].classList.add('active');
    carouselDots[currentSlide].classList.add('active');
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5000);
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopCarousel();
        startCarousel();
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopCarousel();
        startCarousel();
    });
}

carouselDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        goToSlide(index);
        stopCarousel();
        startCarousel();
    });
});

const carousel = document.getElementById('aboutCarousel');
if (carousel) {
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
}

let touchStartX = 0;
let touchEndX = 0;

if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopCarousel();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startCarousel();
    }, { passive: true });
}

if (carouselSlides.length > 0) {
    startCarousel();
}
