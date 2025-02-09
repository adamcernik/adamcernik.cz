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