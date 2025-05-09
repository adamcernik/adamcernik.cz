// Theme toggle and image functionality
const themeToggleImg = document.getElementById('theme-toggle-img');
const body = document.body;

// Check if dark mode is enabled in localStorage
const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

// Apply dark mode if it was previously enabled
if (isDarkMode) {
    body.classList.add('dark-mode');
}

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
window.onload = loadRandomImage;

// Toggle dark mode and handle image click
themeToggleImg.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
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
});

// Modal functionality
const modalTriggers = document.querySelectorAll('.trigger-modal');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const closeButtons = document.querySelectorAll('.close-btn');

// Open modal
modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modalId = trigger.getAttribute('data-modal-id');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    });
});

// Close modal
function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
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
            if (overlay.style.display === 'flex') {
                closeModal(overlay);
            }
        });
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

// Add intersection observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for fade-in animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(section);
});