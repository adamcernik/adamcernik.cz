// Dark Mode Toggle and Random Image Loader
const toggleImage = document.getElementById('theme-toggle-img'); // This is the same image
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

// Array of objects containing image URLs and corresponding alt text
const images = [
  { src: 'images/adamcernik-yellow-profile@3x.png', alt: 'Adam Černík Profile Picture - Yellow' },
  { src: 'images/adamcernik-red-profile@3x.png', alt: 'Adam Černík Profile Picture - Red' },
  { src: 'images/adamcernik-cyan-profile@3x.png', alt: 'Adam Černík Profile Picture - Cyan' }
];

// Function to load a random image
function loadRandomImage() {
  const randomIndex = Math.floor(Math.random() * images.length); // Generate a random index
  toggleImage.src = images[randomIndex].src; // Set the image source
  toggleImage.alt = images[randomIndex].alt; // Set the alt text
}

// Load a random image when the page loads
window.onload = loadRandomImage;

// Modal Triggers
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