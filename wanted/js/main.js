document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("hUdCH3u0SC6LkmOaD");
    
    // Logo click handler to scroll to top
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send the email using EmailJS
            emailjs.sendForm('service_y9eokla', 'template_07bfz5o', this)
                .then(function() {
                    // Success message
                    submitBtn.textContent = 'Message Sent!';
                    contactForm.reset();
                    
                    // Reset button after delay
                    setTimeout(() => {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    }, 3000);
                })
                .catch(function(error) {
                    // Error handling
                    console.error('EmailJS error:', error);
                    submitBtn.textContent = 'Failed to Send';
                    
                    // Reset button after delay
                    setTimeout(() => {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    }, 3000);
                });
        });
    }
    
    // Load timeline content from external file
    const timelineTrack = document.getElementById('timeline-track');
    if (timelineTrack) {
        fetch('includes/timeline.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                timelineTrack.innerHTML = html;
                // Initialize timeline scroll functionality after content is loaded
                initTimelineScroll();
            })
            .catch(error => {
                console.error('Error loading timeline content:', error);
                timelineTrack.innerHTML = '<p class="timeline-error">Failed to load timeline content.</p>';
            });
    }
    
    // Timeline scroll functionality
    function initTimelineScroll() {
        const timelineContainer = document.querySelector('.timeline-scroll-container');
        if (timelineContainer) {
            // Simplified wheel event handling
            timelineContainer.addEventListener('wheel', function(e) {
                // If shift key is pressed or deltaX is significantly larger than deltaY, use horizontal scroll
                if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    e.preventDefault();
                    timelineContainer.scrollLeft += e.deltaX || e.deltaY;
                }
                // For horizontal scrolling with vertical wheel (when deltaY is present)
                else if (Math.abs(e.deltaY) > 0 && e.altKey) {
                    e.preventDefault();
                    timelineContainer.scrollLeft += e.deltaY;
                }
                // Otherwise, let the default vertical scrolling happen
            }, { passive: false });
            
            // Add basic drag-to-scroll functionality
            let isDown = false;
            let startX;
            let scrollLeft;
            
            timelineContainer.addEventListener('mousedown', (e) => {
                isDown = true;
                timelineContainer.style.cursor = 'grabbing';
                startX = e.pageX - timelineContainer.offsetLeft;
                scrollLeft = timelineContainer.scrollLeft;
                e.preventDefault(); // Prevent text selection during drag
            });
            
            timelineContainer.addEventListener('mouseleave', () => {
                isDown = false;
                timelineContainer.style.cursor = 'grab';
            });
            
            timelineContainer.addEventListener('mouseup', () => {
                isDown = false;
                timelineContainer.style.cursor = 'grab';
            });
            
            timelineContainer.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                const x = e.pageX - timelineContainer.offsetLeft;
                const walk = (x - startX) * 1.5; // Scroll speed multiplier
                timelineContainer.scrollLeft = scrollLeft - walk;
            });
            
            // Initialize cursor style
            timelineContainer.style.cursor = 'grab';
            
            // Touch scrolling support for mobile
            let touchStartX = 0;
            let touchStartY = 0;
            
            timelineContainer.addEventListener('touchstart', function(e) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            timelineContainer.addEventListener('touchmove', function(e) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                const diffX = touchStartX - touchX;
                const diffY = touchStartY - touchY;
                
                // If clearly horizontal movement
                if (Math.abs(diffX) > Math.abs(diffY)) {
                    e.preventDefault();
                    timelineContainer.scrollLeft += diffX;
                    touchStartX = touchX;
                }
            }, { passive: false });
        }
    }
    
    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const html = document.documentElement;
    
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileNav.classList.toggle('active');
            html.classList.toggle('mobile-menu-open');
        });
    }
    
    // Language Selector Toggle
    const languageSelects = document.querySelectorAll('.language-select');
    
    languageSelects.forEach(select => {
        const languageCurrent = select.querySelector('.language-current');
        const languageDropdown = select.querySelector('.language-dropdown');
        const languageOptions = select.querySelectorAll('.language-option');
        
        if (languageCurrent && languageDropdown) {
            // Toggle dropdown on button click
            languageCurrent.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                
                // Toggle display property
                languageDropdown.style.display = isExpanded ? 'none' : 'block';
            });
            
            // Language option selection
            languageOptions.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent event bubbling
                    const lang = this.dataset.lang;
                    const langText = lang.toUpperCase();
                    
                    languageCurrent.querySelector('span').textContent = langText;
                    languageCurrent.setAttribute('aria-expanded', 'false');
                    languageDropdown.style.display = 'none';
                    
                    // You would add code here to change the site language
                });
            });
        }
    });
    
    // Close language dropdown when clicking outside
    document.addEventListener('click', function() {
        const dropdowns = document.querySelectorAll('.language-dropdown');
        const buttons = document.querySelectorAll('.language-current');
        
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        
        buttons.forEach(button => {
            button.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Set initial language based on browser preference
    const browserLang = navigator.language.split('-')[0];
    const availableLangs = ['en', 'cz', 'de', 'fr', 'pl', 'hu'];
    const defaultLang = availableLangs.includes(browserLang) ? browserLang : 'en';
    
    document.documentElement.lang = defaultLang;
    document.querySelectorAll('.language-current span').forEach(span => {
        span.textContent = defaultLang.toUpperCase();
    });
    document.querySelectorAll(`[data-lang="${defaultLang}"]`).forEach(el => {
        el.classList.add('active');
    });
    
    // Service Modal Functionality
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('service-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalBody = document.getElementById('modal-body');
    
    // Modal content data
    const modalData = {
        'service-01': {
            title: 'Print & design',
            subtitle: 'Professional printing and design services for various media',
            image: 'images/services/01.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Signs</li>
                        <li>City lights view (CLV)</li>
                        <li>Flags</li>
                        <li>Honeycomb prints</li>
                        <li>Banners</li>
                        <li>Large format printing</li>
                        <li>3D print</li>
                        <li>Acrylic & plexiglass</li>
                        <li>Expo frames</li>
                    </ul>
                </div>
            `
        },
        'service-02': {
            title: 'Corporate Identities',
            subtitle: 'Comprehensive brand identity development and implementation',
            image: 'images/services/02.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Brand strategy development</li>
                        <li>Visual identity design</li>
                        <li>Brand guidelines creation</li>
                        <li>Identity implementation</li>
                        <li>Brand consistency management</li>
                    </ul>
                </div>
            `
        },
        'service-03': {
            title: 'Furniture',
            subtitle: 'Custom furniture design and manufacturing solutions',
            image: 'images/services/03.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Custom furniture design</li>
                        <li>Commercial furniture</li>
                        <li>Film set furniture</li>
                        <li>Exhibition furniture</li>
                        <li>Interior solutions</li>
                    </ul>
                </div>
            `
        },
        'service-04': {
            title: 'Production',
            subtitle: 'Full-scale production services and project management',
            image: 'images/services/04.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Project management</li>
                        <li>Production planning</li>
                        <li>Quality control</li>
                        <li>Timeline management</li>
                        <li>Resource coordination</li>
                    </ul>
                </div>
            `
        },
        'service-05': {
            title: 'Crafts',
            subtitle: 'Specialized craftsmanship including glass work and custom solutions',
            image: 'images/services/05.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Glass work and design</li>
                        <li>Custom craftsmanship</li>
                        <li>Artisanal solutions</li>
                        <li>Specialized finishes</li>
                        <li>Unique custom pieces</li>
                    </ul>
                </div>
            `
        },
        'service-06': {
            title: 'Film Props & Decorations',
            subtitle: 'Custom props and set decorations for film and television',
            image: 'images/services/06.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Custom prop creation</li>
                        <li>Set decoration</li>
                        <li>Period-accurate items</li>
                        <li>Special effects props</li>
                        <li>Production design support</li>
                    </ul>
                </div>
            `
        },
        'service-07': {
            title: 'Logistics',
            subtitle: 'Comprehensive logistics and transportation services',
            image: 'images/services/07.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Transportation management</li>
                        <li>Warehouse solutions</li>
                        <li>Inventory control</li>
                        <li>Route optimization</li>
                        <li>Delivery coordination</li>
                    </ul>
                </div>
            `
        },
        'service-08': {
            title: 'Documentation',
            subtitle: 'Professional documentation and project documentation services',
            image: 'images/services/08.jpg',
            content: `
                <div class="modal-section">
                    <ul class="modal-list two-columns">
                        <li>Project documentation</li>
                        <li>Technical documentation</li>
                        <li>Process documentation</li>
                        <li>Quality documentation</li>
                        <li>Compliance documentation</li>
                    </ul>
                </div>
            `
        }
    };
    
    // Function to open modal
    function openModal(modalId) {
        const data = modalData[modalId];
        if (!data) return;
        
        // Populate modal content
        modalImage.src = data.image;
        modalImage.alt = data.title;
        modalTitle.textContent = data.title;
        modalSubtitle.textContent = data.subtitle;
        modalBody.innerHTML = data.content;
        
        // Show modal
        modalOverlay.classList.add('active');
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Accessibility
        modal.setAttribute('aria-hidden', 'false');
        modalClose.focus();
    }
    
    // Function to close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        // Accessibility
        modal.setAttribute('aria-hidden', 'true');
        
        // Clear content after transition is complete
        setTimeout(() => {
            modalImage.src = '';
            modalImage.alt = '';
        }, 400);
    }
    
    // Add click event listeners to service tiles
    document.querySelectorAll('.service-tile[data-modal]').forEach(tile => {
        tile.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    // Close modal when clicking the close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside of it (on the overlay)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Project Slider Functionality
    const projectSlides = document.querySelectorAll('.project-slide');
    const projectDots = document.querySelectorAll('.project-dot');
    const projectBackgrounds = document.querySelectorAll('.project-slide-bg');
    
    // Function to go to specific slide
    function goToProjectSlide(index) {
        // Hide all slides
        projectSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Show selected slide
        projectSlides[index].classList.add('active');
        
        // Hide all backgrounds
        projectBackgrounds.forEach(bg => {
            bg.classList.remove('active');
        });
        
        // Show selected background
        projectBackgrounds[index].classList.add('active');
        
        // Update dots
        projectDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Add click handlers to dots
    projectDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToProjectSlide(index);
        });
    });
    
    // Auto slide rotation
    let currentProjectSlide = 0;
    const projectInterval = setInterval(() => {
        currentProjectSlide = (currentProjectSlide + 1) % projectSlides.length;
        goToProjectSlide(currentProjectSlide);
    }, 7000);
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        clearInterval(projectInterval);
    });
    
    // Movie Grid Image Fading
    function fadeMovies() {
        const items = document.querySelectorAll('.movie-item');
        items.forEach(item => {
            const images = item.querySelectorAll('img');
            if (images.length < 2) return; // Skip if not enough images
            
            let currentIndex = 0;
            const interval = 15000 + Math.random() * 5000; // Longer interval between transitions (15-20 seconds)
            
            // Preload images
            images.forEach(img => {
                const preload = new Image();
                preload.src = img.src;
            });
            
            const fadeInterval = setInterval(() => {
                images[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % images.length;
                images[currentIndex].classList.add('active');
            }, interval);
 
            // Cleanup on page hide/unload
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    clearInterval(fadeInterval);
                } else {
                    fadeMovies();
                }
            });
        });
    }
    
    fadeMovies();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Close mobile menu if open
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                mobileNav.classList.remove('active');
                html.classList.remove('mobile-menu-open');
            }
            
            const headerHeight = header.offsetHeight;
            
            window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        });
    });
});