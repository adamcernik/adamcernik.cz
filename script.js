// Get the toggle image and body element
const toggleImage = document.getElementById('theme-toggle-img');
const body = document.body;

// Check if dark mode is enabled in localStorage
const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

// Apply dark mode if it was previously enabled
if (isDarkMode) {
    body.classList.add('dark-mode');
}

// Toggle between light and dark modes when the image is clicked
toggleImage.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Save preference to localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});



// Get all trigger elements
const triggers = document.querySelectorAll('.trigger-modal');
const closeButtons = document.querySelectorAll('.close-btn');

// Add click event to all trigger elements
triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
        const modalId = trigger.getAttribute('data-modal-id'); // Get the modal ID
        const modal = document.getElementById(modalId); // Find the modal
        modal.style.display = 'flex'; // Show the modal
    });
});

// Add click event to all close buttons
closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal-overlay'); // Find the parent modal
        modal.style.display = 'none'; // Hide the modal
    });
});

// Close modal when clicking outside
document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none'; // Hide the modal
        }
    });
});