// Initialize Lucide Icons
lucide.createIcons();

// Mobile Navigation Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on click
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg', 'bg-mountain-blue/95');
        navbar.classList.remove('bg-mountain-blue/80');
    } else {
        navbar.classList.remove('shadow-lg', 'bg-mountain-blue/95');
        navbar.classList.add('bg-mountain-blue/80');
    }
});

// Intersection Observer for Scroll Animations
const setupScrollAnimations = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated if we only want it to happen once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Observe elements
    const elementsToAnimate = document.querySelectorAll('.roll-in-left, .roll-in-right, .roll-in-bottom');
    elementsToAnimate.forEach(el => observer.observe(el));
};

// Start watching on load
document.addEventListener('DOMContentLoaded', setupScrollAnimations);

// Add contact form logic
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Fake submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> <span>Sending...</span>';
        lucide.createIcons(); // Re-render icon

        setTimeout(() => {
            contactForm.reset();
            submitBtn.innerHTML = originalContent;
            lucide.createIcons();
            formSuccess.classList.remove('hidden');

            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
        }, 1500);
    });
}

// Theme Toggle Logic
const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'red') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'red');
        }
    });
});
