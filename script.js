// Get the toggle button and body element
const toggleButton = document.getElementById('mode-toggle');
const body = document.body;

// Function to check system preference for dark mode
function checkSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Function to set the initial mode based on system preference or localStorage
function setInitialMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    const systemPrefersDark = checkSystemPreference();

    // If no preference is saved in localStorage, use system preference
    if (localStorage.getItem('darkMode') === null) {
        if (systemPrefersDark) {
            body.classList.add('dark-mode');
            toggleButton.textContent = 'Switch to Light Mode';
        } else {
            body.classList.remove('dark-mode');
            toggleButton.textContent = 'Switch to Dark Mode';
        }
    } else {
        // Use the saved preference from localStorage
        if (isDarkMode) {
            body.classList.add('dark-mode');
            toggleButton.textContent = 'Switch to Light Mode';
        } else {
            body.classList.remove('dark-mode');
            toggleButton.textContent = 'Switch to Dark Mode';
        }
    }
}

// Set the initial mode when the page loads
setInitialMode();

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