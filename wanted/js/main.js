document.addEventListener('DOMContentLoaded', function() {
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
                        <li>Manufacturing and production</li>
                        <li>Interior furnishings</li>
                        <li>Commercial furniture</li>
                        <li>Specialized furniture solutions</li>
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
            slide.style.opacity = '0';
        });
        
        // Show selected slide
        projectSlides[index].style.opacity = '1';
        
        // Hide all backgrounds
        projectBackgrounds.forEach(bg => {
            bg.style.opacity = '0';
        });
        
        // Show selected background
        projectBackgrounds[index].style.opacity = '1';
        
        // Update dots
        projectDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
                dot.style.opacity = '1';
            } else {
                dot.classList.remove('active');
                dot.style.opacity = '0.7';
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
            const interval = 7000 + Math.random() * 3000; // Longer interval between transitions
            
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