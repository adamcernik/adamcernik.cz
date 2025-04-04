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
    
    // Load services content from external file
    const servicesTrack = document.getElementById('services-track');
    if (servicesTrack) {
        console.log('Services track found, attempting to load content...');
        fetch('includes/services.html')
            .then(response => {
                console.log('Services fetch response:', response.status);
                if (!response.ok) {
                    throw new Error(`Network response not ok: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                console.log('Services content loaded successfully');
                servicesTrack.innerHTML = html;
                
                // Initialize services scroll functionality after content is loaded
                initServicesScroll();
                
                // Add click event listeners to service tiles in the scrollable container
                const mobileTiles = servicesTrack.querySelectorAll('.service-tile[data-modal]');
                console.log(`Found ${mobileTiles.length} mobile service tiles to add click events to`);
                
                mobileTiles.forEach(tile => {
                    // Use direct click handler for mobile tiles to avoid issues with function references
                    tile.addEventListener('click', function(event) {
                        // Direct check for scroll action
                        if (event._isScroll) {
                            console.log('Ignoring click because it was part of a scroll action');
                            return;
                        }
                        
                        const modalId = this.getAttribute('data-modal');
                        console.log(`Opening mobile modal: ${modalId}`);
                        openModal(modalId);
                    });
                });
            })
            .catch(error => {
                console.error('Error loading services content:', error);
                servicesTrack.innerHTML = '<p class="services-error">Failed to load services content.</p>';
            });
    } else {
        console.warn('Services track element not found in the DOM');
    }
    
    // Timeline scroll functionality
    function initTimelineScroll() {
        const timelineContainer = document.querySelector('.timeline-scroll-container');
        if (timelineContainer) {
            // Variables for momentum scrolling
            let touchStartX = 0;
            let touchStartY = 0;
            let lastTouchX = 0;
            let lastTouchTime = 0;
            let velocity = 0;
            let momentum = null;
            let touchMoved = false;
            
            // Touch start handler
            timelineContainer.addEventListener('touchstart', function(e) {
                // Stop any ongoing momentum scrolling
                if (momentum) {
                    cancelAnimationFrame(momentum);
                    momentum = null;
                }
                
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                lastTouchX = touchStartX;
                lastTouchTime = Date.now();
                velocity = 0;
                touchMoved = false;
            }, { passive: true });
            
            // Touch move handler
            timelineContainer.addEventListener('touchmove', function(e) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                const diffX = Math.abs(touchStartX - touchX);
                const diffY = Math.abs(touchStartY - touchY);
                const now = Date.now();
                const elapsed = now - lastTouchTime;
                
                // Calculate velocity (pixels per millisecond)
                if (elapsed > 0) {
                    velocity = (lastTouchX - touchX) / elapsed;
                }
                
                // If user has moved their finger by more than 10px, consider it a scroll, not a tap
                if (diffX > 10 || diffY > 10) {
                    touchMoved = true;
                }
                
                // If clearly horizontal movement
                if (diffX > diffY) {
                    e.preventDefault();
                    timelineContainer.scrollLeft += (lastTouchX - touchX);
                }
                
                // Update last position and time
                lastTouchX = touchX;
                lastTouchTime = now;
            }, { passive: false });
            
            // Touch end handler
            timelineContainer.addEventListener('touchend', function() {
                // Apply momentum scrolling
                if (touchMoved && Math.abs(velocity) > 0.1) {
                    // Start with current velocity
                    let currentVelocity = velocity * 800; // Scale up for better feeling
                    
                    // Friction factor (lower = more slippery)
                    const friction = 0.95;
                    
                    // Apply momentum with requestAnimationFrame
                    const applyMomentum = () => {
                        // Apply velocity with friction
                        timelineContainer.scrollLeft += currentVelocity;
                        currentVelocity *= friction;
                        
                        // Stop when velocity becomes very small
                        if (Math.abs(currentVelocity) > 0.5) {
                            momentum = requestAnimationFrame(applyMomentum);
                        } else {
                            momentum = null;
                        }
                    };
                    
                    momentum = requestAnimationFrame(applyMomentum);
                }
            }, { passive: true });
            
            // Mouse-based scrolling with momentum
            let isDown = false;
            let startX, scrollLeft;
            let mouseVelocity = 0;
            let lastMouseX = 0;
            let lastMouseTime = 0;
            let mouseMomentum = null;
            
            timelineContainer.addEventListener('mousedown', (e) => {
                isDown = true;
                timelineContainer.style.cursor = 'grabbing';
                startX = e.pageX;
                scrollLeft = timelineContainer.scrollLeft;
                lastMouseX = startX;
                lastMouseTime = Date.now();
                mouseVelocity = 0;
                
                // Stop any ongoing momentum scrolling
                if (mouseMomentum) {
                    cancelAnimationFrame(mouseMomentum);
                    mouseMomentum = null;
                }
                
                e.preventDefault();
            });
            
            timelineContainer.addEventListener('mouseleave', () => {
                if (isDown) {
                    isDown = false;
                    timelineContainer.style.cursor = 'grab';
                    
                    // Apply momentum when mouse leaves while dragging
                    applyMouseMomentum();
                }
            });
            
            timelineContainer.addEventListener('mouseup', () => {
                if (isDown) {
                    isDown = false;
                    timelineContainer.style.cursor = 'grab';
                    
                    // Apply momentum when mouse is released
                    applyMouseMomentum();
                }
            });
            
            timelineContainer.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                const x = e.pageX;
                const now = Date.now();
                const elapsed = now - lastMouseTime;
                
                // Calculate current velocity
                if (elapsed > 0) {
                    mouseVelocity = (lastMouseX - x) / elapsed;
                }
                
                // Move the scrollLeft based on mouse movement
                const walk = x - startX;
                timelineContainer.scrollLeft = scrollLeft - walk;
                
                // Update tracking variables
                lastMouseX = x;
                lastMouseTime = now;
            });
            
            function applyMouseMomentum() {
                if (Math.abs(mouseVelocity) > 0.1) {
                    // Start with current velocity
                    let currentVelocity = mouseVelocity * 800; // Scale up for better feeling
                    const friction = 0.95; // Friction factor
                    
                    // Apply momentum with requestAnimationFrame
                    const applyMomentum = () => {
                        timelineContainer.scrollLeft += currentVelocity;
                        currentVelocity *= friction;
                        
                        if (Math.abs(currentVelocity) > 0.5) {
                            mouseMomentum = requestAnimationFrame(applyMomentum);
                        } else {
                            mouseMomentum = null;
                        }
                    };
                    
                    mouseMomentum = requestAnimationFrame(applyMomentum);
                }
            }
            
            // Wheel event handling for horizontal scrolling
            timelineContainer.addEventListener('wheel', function(e) {
                // If shift key is pressed or deltaX is significant, use horizontal scroll
                if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                    e.preventDefault();
                    
                    // If momentum from wheel already active, cancel it
                    if (mouseMomentum) {
                        cancelAnimationFrame(mouseMomentum);
                        mouseMomentum = null;
                    }
                    
                    timelineContainer.scrollLeft += e.deltaX || e.deltaY;
                    
                    // Calculate velocity from wheel event
                    mouseVelocity = (e.deltaX || e.deltaY) * 0.01;
                    
                    // Apply gentle momentum for wheel scrolling
                    clearTimeout(timelineContainer.wheelTimeout);
                    timelineContainer.wheelTimeout = setTimeout(() => {
                        applyMouseMomentum();
                    }, 50);
                }
            }, { passive: false });
            
            // Initialize cursor style
            timelineContainer.style.cursor = 'grab';
        }
    }
    
    // Services scroll functionality (for mobile) with momentum-based scrolling
    function initServicesScroll() {
        const servicesContainer = document.querySelector('.services-scroll-container');
        if (servicesContainer && window.innerWidth <= 768) {
            // Variables for momentum scrolling
            let touchStartX = 0;
            let touchStartY = 0;
            let lastTouchX = 0;
            let lastTouchTime = 0;
            let velocity = 0;
            let momentum = null;
            let touchMoved = false;
            
            // Touch start handler
            servicesContainer.addEventListener('touchstart', function(e) {
                // Stop any ongoing momentum scrolling
                if (momentum) {
                    cancelAnimationFrame(momentum);
                    momentum = null;
                }
                
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                lastTouchX = touchStartX;
                lastTouchTime = Date.now();
                velocity = 0;
                touchMoved = false;
            }, { passive: true });
            
            // Touch move handler
            servicesContainer.addEventListener('touchmove', function(e) {
                const touchX = e.touches[0].clientX;
                const touchY = e.touches[0].clientY;
                const diffX = Math.abs(touchStartX - touchX);
                const diffY = Math.abs(touchStartY - touchY);
                const now = Date.now();
                const elapsed = now - lastTouchTime;
                
                // Calculate velocity (pixels per millisecond)
                if (elapsed > 0) {
                    velocity = (lastTouchX - touchX) / elapsed;
                }
                
                // If user has moved their finger by more than 10px, consider it a scroll, not a tap
                if (diffX > 10 || diffY > 10) {
                    touchMoved = true;
                }
                
                // If clearly horizontal movement
                if (diffX > diffY) {
                    e.preventDefault();
                    servicesContainer.scrollLeft += (lastTouchX - touchX);
                }
                
                // Update last position and time
                lastTouchX = touchX;
                lastTouchTime = now;
            }, { passive: false });
            
            // Touch end handler
            servicesContainer.addEventListener('touchend', function(e) {
                // If touch moved, add a flag to identify any immediate click as a scroll
                if (touchMoved) {
                    const preventNextClick = (e) => {
                        e._isScroll = true;
                        document.removeEventListener('click', preventNextClick, true);
                    };
                    document.addEventListener('click', preventNextClick, true);
                    
                    // Apply momentum scrolling
                    if (Math.abs(velocity) > 0.1) {
                        // Start with current velocity
                        let currentVelocity = velocity * 800; // Scale up for better feeling
                        
                        // Friction factor (lower = more slippery)
                        const friction = 0.95;
                        
                        // Apply momentum with requestAnimationFrame
                        const applyMomentum = () => {
                            // Apply velocity with friction
                            servicesContainer.scrollLeft += currentVelocity;
                            currentVelocity *= friction;
                            
                            // Stop when velocity becomes very small
                            if (Math.abs(currentVelocity) > 0.5) {
                                momentum = requestAnimationFrame(applyMomentum);
                            } else {
                                momentum = null;
                            }
                        };
                        
                        momentum = requestAnimationFrame(applyMomentum);
                    }
                }
            }, { passive: true });
            
            // Mouse-based scrolling with momentum
            let isDown = false;
            let startX, scrollLeft;
            let mouseVelocity = 0;
            let lastMouseX = 0;
            let lastMouseTime = 0;
            let mouseMomentum = null;
            
            servicesContainer.addEventListener('mousedown', (e) => {
                isDown = true;
                servicesContainer.style.cursor = 'grabbing';
                startX = e.pageX;
                scrollLeft = servicesContainer.scrollLeft;
                lastMouseX = startX;
                lastMouseTime = Date.now();
                mouseVelocity = 0;
                
                // Stop any ongoing momentum scrolling
                if (mouseMomentum) {
                    cancelAnimationFrame(mouseMomentum);
                    mouseMomentum = null;
                }
                
                e.preventDefault();
            });
            
            servicesContainer.addEventListener('mouseleave', () => {
                if (isDown) {
                    isDown = false;
                    servicesContainer.style.cursor = 'grab';
                    
                    // Apply momentum when mouse leaves while dragging
                    applyMouseMomentum();
                }
            });
            
            servicesContainer.addEventListener('mouseup', () => {
                if (isDown) {
                    isDown = false;
                    servicesContainer.style.cursor = 'grab';
                    
                    // Apply momentum when mouse is released
                    applyMouseMomentum();
                }
            });
            
            servicesContainer.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                const x = e.pageX;
                const now = Date.now();
                const elapsed = now - lastMouseTime;
                
                // Calculate current velocity
                if (elapsed > 0) {
                    mouseVelocity = (lastMouseX - x) / elapsed;
                }
                
                // Move the scrollLeft based on mouse movement
                const walk = x - startX;
                servicesContainer.scrollLeft = scrollLeft - walk;
                
                // Update tracking variables
                lastMouseX = x;
                lastMouseTime = now;
            });
            
            function applyMouseMomentum() {
                if (Math.abs(mouseVelocity) > 0.1) {
                    // Start with current velocity
                    let currentVelocity = mouseVelocity * 800; // Scale up for better feeling
                    const friction = 0.95; // Friction factor
                    
                    // Apply momentum with requestAnimationFrame
                    const applyMomentum = () => {
                        servicesContainer.scrollLeft += currentVelocity;
                        currentVelocity *= friction;
                        
                        if (Math.abs(currentVelocity) > 0.5) {
                            mouseMomentum = requestAnimationFrame(applyMomentum);
                        } else {
                            mouseMomentum = null;
                        }
                    };
                    
                    mouseMomentum = requestAnimationFrame(applyMomentum);
                    
                    // Prevent clicks after momentum scrolling
                    const preventNextClick = (e) => {
                        e._isScroll = true;
                        document.removeEventListener('click', preventNextClick, true);
                    };
                    document.addEventListener('click', preventNextClick, true);
                }
            }
            
            // Initialize cursor style
            servicesContainer.style.cursor = 'grab';
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
    
    // Initialize services scroll when window is resized
    window.addEventListener('resize', function() {
        initServicesScroll();
    });
    
    // Add click event listeners to desktop service tiles
    document.querySelectorAll('.bento-grid .service-tile[data-modal]').forEach(tile => {
        // Remove any existing click event listeners first to avoid duplicates
        tile.removeEventListener('click', handleServiceTileClick);
        // Add click event listener
        tile.addEventListener('click', handleServiceTileClick);
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('.desktop-menu a, .mobile-menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            const mobileNav = document.querySelector('.mobile-nav');
            const mobileToggle = document.querySelector('.mobile-toggle');
            const html = document.documentElement;
            
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                mobileToggle.classList.remove('active');
                html.classList.remove('mobile-menu-open');
            }
            
            // Get the target element
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Special handling for services on mobile
                if (targetId === 'services-container' && window.innerWidth <= 768) {
                    console.log('Scrolling to services container on mobile');
                    // Ensure services are loaded before scrolling
                    if (servicesTrack && !servicesTrack.children.length) {
                        console.log('Services not loaded yet, loading before scrolling');
                        fetch('includes/services.html')
                            .then(response => response.text())
                            .then(html => {
                                servicesTrack.innerHTML = html;
                                setTimeout(() => {
                                    targetElement.scrollIntoView({ behavior: 'smooth' });
                                }, 100);
                            })
                            .catch(error => console.error('Error loading services:', error));
                    } else {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Function to handle service tile clicks
    function handleServiceTileClick(event) {
        // Prevent horizontal scrolling from triggering modal
        if (window.innerWidth <= 768 && event._isScroll) {
            return;
        }
        
        const modalId = this.getAttribute('data-modal');
        console.log(`Opening modal from ${window.innerWidth <= 768 ? 'mobile' : 'desktop'} view: ${modalId}`);
        openModal(modalId);
    }
    
    // Add debugging for clicks on services container
    const debugServiceClicks = () => {
        const servicesContainer = document.querySelector('.services-scroll-container');
        if (servicesContainer) {
            servicesContainer.addEventListener('click', function(e) {
                console.log('Click detected on services container', {
                    target: e.target,
                    isScroll: e._isScroll,
                    clientX: e.clientX,
                    clientY: e.clientY
                });
                
                // If click is on a service tile or its child elements
                let targetTile = e.target.closest('.service-tile');
                if (targetTile && !e._isScroll) {
                    const modalId = targetTile.getAttribute('data-modal');
                    if (modalId) {
                        console.log('Manual click handling for service tile:', modalId);
                        openModal(modalId);
                    }
                }
            });
        }
    };
    
    // Run after a short delay to ensure everything is loaded
    setTimeout(debugServiceClicks, 1000);
});