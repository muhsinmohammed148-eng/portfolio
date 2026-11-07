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
// TYPEWRITER EFFECT
// ============================================
const typewriterElement = document.getElementById('typewriter');
const phrases = [
    'Odoo Team Lead & Senior Developer',
    'ERP Architecture Specialist',
    'Python & JavaScript Developer',
    'Flutter Mobile App Developer',
    '30+ Enterprise Projects Delivered'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before next phrase
    }

    setTimeout(typeWriter, typeSpeed);
}

// Start typewriter on load
document.addEventListener('DOMContentLoaded', typeWriter);

// ============================================
// PARTICLE ANIMATION
// ============================================
const particlesContainer = document.getElementById('particles');

function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 6}s`;
        particle.style.animationDuration = `${4 + Math.random() * 4}s`;

        // Random colors
        const colors = ['#6c63ff', '#00d4aa', '#ff6b6b', '#ffd93d'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        // Random sizes
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particlesContainer.appendChild(particle);
    }
}

createParticles();

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
    '.skill-category, .timeline-item, .project-card, .about-grid, .contact-grid'
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
// PROJECT FILTERS
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
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

        // Create mailto link
        const mailtoLink = `mailto:mmusi0634@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        window.location.href = mailtoLink;

        // Show success message
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-text">Opening Email Client...</span> <span class="btn-icon">✅</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
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
// PARALLAX EFFECT ON HERO
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
});

// ============================================
// SKILL TAG HOVER EFFECT
// ============================================
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ============================================
// PAGE LOAD ANIMATION
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

// ============================================
// CURSOR GLOW EFFECT (Desktop only)
// ============================================
if (window.innerWidth > 768) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(108, 99, 255, 0.08) 0%, transparent 70%);
        pointer-events: none;
        z-index: 0;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

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

// Auto-advance carousel every 4 seconds
function startCarousel() {
    carouselInterval = setInterval(nextSlide, 4000);
}

function stopCarousel() {
    clearInterval(carouselInterval);
}

// Event listeners for carousel buttons
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

// Event listeners for carousel dots
carouselDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        goToSlide(index);
        stopCarousel();
        startCarousel();
    });
});

// Pause on hover
const carousel = document.getElementById('aboutCarousel');
if (carousel) {
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);
}

// Touch/swipe support for carousel
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

// Start carousel on load
if (carouselSlides.length > 0) {
    startCarousel();
}

console.log('%c🚀 Portfolio loaded successfully!', 'color: #6c63ff; font-size: 16px; font-weight: bold;');
console.log('%cDesigned & Developed by Mohammed Muhsin', 'color: #00d4aa; font-size: 12px;');
