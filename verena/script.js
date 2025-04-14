/**
 * Verena Müller - Portfolio JavaScript
 * Interactive features and animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functions when DOM is fully loaded
  initCustomCursor();
  initScrollAnimation();
  initHeaderScroll();
  initProjectCards();
  initRevealAnimation();
  initFormSubmission();
  initMobileMenu();
  
  // Create a typing animation for the hero intro text
  const introText = document.querySelector('.intro');
  if (introText) {
    createTypingEffect(introText);
  }
});

// Mobile menu functionality
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link');
  const body = document.body;
  
  if (!hamburger || !mobileNav) return;
  
  // Toggle menu when hamburger is clicked
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    body.classList.toggle('nav-open');
  });
  
  // Close menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      body.classList.remove('nav-open');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('active') && 
        !e.target.closest('.mobile-nav') && 
        !e.target.closest('.hamburger-menu')) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('active');
      body.classList.remove('nav-open');
    }
  });
}

// Custom cursor effect
function initCustomCursor() {
  const cursor = document.querySelector('.cursor');
  
  if (!cursor) return;
  
  // Show cursor only on desktop devices
  if (window.innerWidth > 768) {
    setTimeout(() => {
      cursor.style.opacity = 1;
    }, 1000);
    
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
    
    // Add hover effect to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, input, textarea');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
        cursor.style.mixBlendMode = 'difference';
        cursor.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.mixBlendMode = 'normal';
        cursor.style.backgroundColor = 'transparent';
      });
    });
  } else {
    // Hide cursor on mobile
    cursor.style.display = 'none';
  }
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('header');
  
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Scroll animation for elements
function initScrollAnimation() {
  // Add animation to elements when they come into view
  const animateElements = document.querySelectorAll('.about-content, .process-step, .project-card, .contact-content');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  animateElements.forEach(el => {
    observer.observe(el);
    // Add delay classes to children elements
    if (el.children.length > 1) {
      Array.from(el.children).forEach((child, index) => {
        if (index > 0) {
          child.classList.add(`animate-delay-${index > 3 ? 3 : index}`);
        }
      });
    }
  });
}

// Text reveal animation
function initRevealAnimation() {
  const revealElements = document.querySelectorAll('.reveal-text');
  
  revealElements.forEach(el => {
    // Create wrapper around text
    const textContent = el.textContent;
    el.textContent = '';
    
    // Create a wrapper
    const wrapper = document.createElement('span');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    wrapper.textContent = textContent;
    
    // Create overlay
    const overlay = document.createElement('span');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = '#ff6b6b';
    overlay.style.transformOrigin = 'left';
    
    // Add to DOM
    wrapper.appendChild(overlay);
    el.appendChild(wrapper);
    
    // Create animation for reveals
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          overlay.style.transition = 'transform 0.6s ease-in-out';
          overlay.style.transform = 'scaleX(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    observer.observe(el);
  });
}

// Project cards modal functionality
function initProjectCards() {
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.querySelector('.project-modal');
  const modalBody = document.querySelector('.modal-body');
  const closeModal = document.querySelector('.close-modal');
  
  if (!modal || !modalBody || !closeModal) return;
  
  // Project content templates
  const projectContent = {
    'nordica': {
      title: 'Nordica Banking App',
      client: 'Nordica Bank',
      year: '2023',
      description: 'A complete redesign of the banking experience for millennials at Nordica Bank. This project focused on simplifying complex financial processes while maintaining security and trust.',
      challenge: 'The main challenge was to create a user-friendly banking application that simplifies complex banking operations while maintaining security and trust, and appealing to a younger demographic.',
      solution: 'I created a minimalist, intuitive interface with clear visual hierarchies and step-by-step guidance for complex operations. The redesign introduced personalized financial insights and goal-setting features that resonated with younger users.',
      results: 'The redesigned app saw a 37% increase in daily active users and a 28% improvement in task completion rates. User satisfaction scores improved from 3.2/5 to 4.7/5.',
      images: [
        'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ]
    },
    'eco': {
      title: 'EcoTrack Sustainability App',
      client: 'GreenFuture Initiative',
      year: '2022',
      description: 'A mobile application designed to help users track and reduce their carbon footprint through daily activities and consumption choices.',
      challenge: 'The main challenge was to design an intuitive way for users to track complex environmental impact data without becoming overwhelming or discouraging.',
      solution: 'I developed a simple point system that translates complex carbon calculations into an accessible format. The app uses gamification elements to encourage sustainable choices and provides personalized recommendations.',
      results: 'Users reported a 22% average reduction in their carbon footprint after 3 months of app usage. The app has maintained a 4.8/5 rating on app stores.',
      images: [
        'https://images.unsplash.com/photo-1556742205-e10c9486e506?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ]
    },
    'foodie': {
      title: 'Foodie Recipe Platform',
      client: 'Foodie Inc.',
      year: '2022',
      description: 'A recipe discovery platform that connects home chefs with personalized recipes based on their preferences, skill level, and available ingredients.',
      challenge: 'Creating an algorithm-driven recipe recommendation system that feels personalized and intuitive, while accommodating diverse user needs and dietary preferences.',
      solution: 'I designed an onboarding process that collects key preference data in an engaging way, and created an adaptive interface that evolves based on user behavior and explicit feedback.',
      results: 'The platform achieved 78% user retention after 6 months, compared to industry average of 32%. Users reported finding suitable recipes in 60% less time compared to competitor platforms.',
      images: [
        'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ]
    },
    'vienna': {
      title: 'Vienna Tourism Website',
      client: 'Vienna Tourism Board',
      year: '2021',
      description: 'A complete redesign of the official Vienna Tourism website, focusing on inspiring travelers while providing practical information for trip planning.',
      challenge: 'Balancing the needs of first-time visitors, returning tourists, and locals while showcasing Vienna\'s rich cultural heritage and modern attractions in an accessible format.',
      solution: 'I developed a content strategy that layered information based on user needs, with a visually-driven interface for inspiration and discovery, combined with well-structured practical information.',
      results: 'The redesigned website saw a 45% increase in average session duration and a 28% increase in trip planning tool usage. Mobile conversion rate improved by 59%.',
      images: [
        'https://images.unsplash.com/photo-1519677584237-752f8853252e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1516550893885-7b92a975c667?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ]
    }
  };
  
  // Add click event to project cards
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.getAttribute('data-project');
      const project = projectContent[projectId];
      
      if (project) {
        // Generate modal content
        let content = `
          <div class="modal-header-img">
            <img src="${project.images[0]}" alt="${project.title}">
          </div>
          <div class="modal-project-content">
            <div class="modal-project-info">
              <h2>${project.title}</h2>
              <div class="project-meta">
                <div class="meta-item">
                  <span class="meta-label">Client</span>
                  <span class="meta-value">${project.client}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Year</span>
                  <span class="meta-value">${project.year}</span>
                </div>
              </div>
              <div class="project-description">
                <p>${project.description}</p>
              </div>
            </div>
            
            <div class="project-challenge-solution">
              <div class="challenge">
                <h3>The Challenge</h3>
                <p>${project.challenge}</p>
              </div>
              <div class="solution">
                <h3>The Solution</h3>
                <p>${project.solution}</p>
              </div>
              <div class="results">
                <h3>The Results</h3>
                <p>${project.results}</p>
              </div>
            </div>
            
            <div class="project-gallery">
              <h3>Project Gallery</h3>
              <div class="gallery-grid">
        `;
        
        // Add images to gallery
        project.images.forEach(img => {
          content += `<div class="gallery-item"><img src="${img}" alt="${project.title}"></div>`;
        });
        
        content += `
              </div>
            </div>
          </div>
        `;
        
        // Set modal content and show modal
        modalBody.innerHTML = content;
        modal.classList.add('active');
        setTimeout(() => {
          document.querySelector('.modal-content').style.opacity = 1;
        }, 10);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
      }
    });
  });
  
  // Close modal on button click
  closeModal.addEventListener('click', () => {
    document.querySelector('.modal-content').style.opacity = 0;
    setTimeout(() => {
      modal.classList.remove('active');
      // Restore body scrolling
      document.body.style.overflow = '';
    }, 400);
  });
  
  // Close modal on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.querySelector('.modal-content').style.opacity = 0;
      setTimeout(() => {
        modal.classList.remove('active');
        // Restore body scrolling
        document.body.style.overflow = '';
      }, 400);
    }
  });
  
  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      document.querySelector('.modal-content').style.opacity = 0;
      setTimeout(() => {
        modal.classList.remove('active');
        // Restore body scrolling
        document.body.style.overflow = '';
      }, 400);
    }
  });
}

// Typing effect animation
function createTypingEffect(element) {
  const text = element.textContent;
  element.textContent = '';
  
  let i = 0;
  const speed = 30; // Typing speed in milliseconds
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  // Add a small delay before starting
  setTimeout(() => {
    type();
  }, 800);
}

// Form submission handler with validation
function initFormSubmission() {
  const form = document.querySelector('.contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple validation
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    let isValid = true;
    
    if (!name.value.trim()) {
      isValid = false;
      name.style.borderColor = 'var(--color-primary)';
    } else {
      name.style.borderColor = 'var(--color-gray-light)';
    }
    
    if (!email.value.trim() || !isValidEmail(email.value)) {
      isValid = false;
      email.style.borderColor = 'var(--color-primary)';
    } else {
      email.style.borderColor = 'var(--color-gray-light)';
    }
    
    if (!message.value.trim()) {
      isValid = false;
      message.style.borderColor = 'var(--color-primary)';
    } else {
      message.style.borderColor = 'var(--color-gray-light)';
    }
    
    if (isValid) {
      // Normally we would submit the form data to a server here
      // For this example, we'll simulate success
      const submitButton = form.querySelector('.submit-button');
      const originalText = submitButton.textContent;
      
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
      
      setTimeout(() => {
        // Reset form fields
        form.reset();
        
        // Update button to show success
        submitButton.textContent = 'Message Sent!';
        submitButton.style.backgroundColor = '#4ecdc4';
        
        // Reset button after some time
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
          submitButton.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    }
  });
}

// Helper function to validate email
function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Add some magic 3D tilt effect to project cards
(() => {
  // Add tilt effect only on desktop
  if (window.innerWidth > 768) {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const tiltX = (y - centerY) / 20;
        const tiltY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
})(); 