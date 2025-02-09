// Get the toggle button and body element
const toggleButton = document.getElementById('mode-toggle');
const body = document.body;

// Check if dark mode is enabled in localStorage
const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

// Apply dark mode if it was previously enabled
if (isDarkMode) {
    body.classList.add('dark-mode');
    toggleButton.textContent = 'Switch to Light Mode';
}

// Toggle between light and dark modes
toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    // Update button text and save preference to localStorage
    if (body.classList.contains('dark-mode')) {
        toggleButton.textContent = 'Switch to Light Mode';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        toggleButton.textContent = 'Switch to Dark Mode';
        localStorage.setItem('darkMode', 'disabled');
    }
});