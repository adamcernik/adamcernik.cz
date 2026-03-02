// Theme toggle and image functionality
const themeToggleImg = document.getElementById('theme-toggle-img');
const body = document.body;

// Determine initial dark mode state:
// 1. Explicit user preference in localStorage takes priority
// 2. Otherwise, follow OS preference via prefers-color-scheme
const storedPref = localStorage.getItem('darkMode');
if (storedPref === 'enabled') {
    body.classList.add('dark-mode');
} else if (storedPref === 'disabled') {
    body.classList.remove('dark-mode');
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add('dark-mode');
}

// Listen for OS-level theme changes (only if user hasn't set a manual preference)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode')) return;
    body.classList.toggle('dark-mode', e.matches);
});

// Array of profile images
const images = [
    { src: 'images/adamcernik-yellow-profile@3x.png', alt: 'Adam Černík Profile Picture - Yellow' },
    { src: 'images/adamcernik-red-profile@3x.png', alt: 'Adam Černík Profile Picture - Red' },
    { src: 'images/adamcernik-cyan-profile@3x.png', alt: 'Adam Černík Profile Picture - Cyan' }
];

// Function to load a random image
function loadRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    themeToggleImg.src = images[randomIndex].src;
    themeToggleImg.alt = images[randomIndex].alt;
}

// Load a random image when the page loads
window.addEventListener('load', loadRandomImage);

// Toggle dark mode
function toggleDarkMode() {
    body.classList.toggle('dark-mode');

    // Save explicit preference to localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }

    // Add a subtle animation when toggling
    themeToggleImg.style.transform = 'scale(1.1)';
    setTimeout(() => {
        themeToggleImg.style.transform = 'scale(1)';
    }, 200);
}

// Handle click
themeToggleImg.addEventListener('click', toggleDarkMode);

// Handle keyboard activation (Enter/Space) for accessibility
themeToggleImg.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDarkMode();
    }
});

// Modal functionality
const modalTriggers = document.querySelectorAll('.trigger-modal');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const closeButtons = document.querySelectorAll('.close-btn');

// Track which trigger opened the modal so we can return focus
let lastTrigger = null;

// Open modal
modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modalId = trigger.getAttribute('data-modal-id');
        const modal = document.getElementById(modalId);
        if (modal) {
            lastTrigger = trigger;
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
            // Move focus into the modal
            const closeBtn = modal.querySelector('.close-btn');
            if (closeBtn) {
                closeBtn.focus();
            }
        }
    });
});

// Close modal
function closeModal(modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    // Return focus to the element that opened the modal
    if (lastTrigger) {
        lastTrigger.focus();
        lastTrigger = null;
    }
}

// Close modal with close button
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal-overlay');
        if (modal) {
            closeModal(modal);
        }
    });
});

// Close modal when clicking outside
modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modalOverlays.forEach(overlay => {
            if (overlay.classList.contains('is-open')) {
                closeModal(overlay);
            }
        });
    }
});

// Trap focus inside open modal
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    let openModal = null;
    modalOverlays.forEach(overlay => {
        if (overlay.classList.contains('is-open')) {
            openModal = overlay;
        }
    });
    if (!openModal) return;

    const focusable = openModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Progressive enhancement: fade-in animations only when JS is available.
// Mark body so CSS can target the enhanced state. If JS fails to load,
// sections remain visible (opacity: 1) by default.
body.classList.add('js-loaded');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});