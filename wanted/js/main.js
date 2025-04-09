document.addEventListener('DOMContentLoaded', function() {
    // Initialize the project slider
    initProjectSlider();
    
    // Initialize EmailJS
    emailjs.init("hUdCH3u0SC6LkmOaD");
    
    // Function to initialize and control the project slider
    function initProjectSlider() {
        const slider = document.querySelector('.project-slider-tile');
        if (!slider) return;
        
        const backgrounds = slider.querySelectorAll('.project-slide-bg');
        const slides = slider.querySelectorAll('.project-slide');
        const dots = slider.querySelectorAll('.project-dot');
        const slidesWrapper = slider.querySelector('.project-slides-wrapper');
        
        let currentIndex = 0;
        let autoplayInterval;
        let startX, startY, moveX, isSwiping = false;
        
        // Start autoplay
        startAutoplay();
        
        // Set up event listeners
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.getAttribute('data-slide'));
                if (slideIndex !== currentIndex) {
                    goToSlide(slideIndex);
                    resetAutoplay();
                }
            });
        });
        
        // Touch events for mobile swiping
        slidesWrapper.addEventListener('touchstart', handleTouchStart, { passive: true });
        slidesWrapper.addEventListener('touchmove', handleTouchMove, { passive: true });
        slidesWrapper.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Mouse enter/leave to pause/resume autoplay
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            startAutoplay();
        });
        
        // Functions
        function startAutoplay() {
            clearInterval(autoplayInterval);
            autoplayInterval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % backgrounds.length;
                goToSlide(nextIndex);
            }, 5000); // Change slides every 5 seconds
        }
        
        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }
        
        function goToSlide(index) {
            // Update active classes
            backgrounds.forEach((bg, i) => {
                bg.classList.toggle('active', i === index);
            });
            
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentIndex = index;
        }
        
        function handleTouchStart(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = true;
        }
        
        function handleTouchMove(e) {
            if (!isSwiping) return;
            
            moveX = e.touches[0].clientX;
            const moveY = e.touches[0].clientY;
            
            // Detect horizontal vs vertical scrolling
            const diffX = Math.abs(moveX - startX);
            const diffY = Math.abs(moveY - startY);
            
            // If more vertical than horizontal movement, exit
            if (diffY > diffX) {
                isSwiping = false;
                return;
            }
        }
        
        function handleTouchEnd() {
            if (!isSwiping) return;
            
            const diff = moveX - startX;
            const threshold = 50; // Minimum swipe distance
            
            if (diff > threshold) {
                // Swiped right, go to previous slide
                const prevIndex = (currentIndex - 1 + backgrounds.length) % backgrounds.length;
                goToSlide(prevIndex);
                resetAutoplay();
            } else if (diff < -threshold) {
                // Swiped left, go to next slide
                const nextIndex = (currentIndex + 1) % backgrounds.length;
                goToSlide(nextIndex);
                resetAutoplay();
            }
            
            isSwiping = false;
        }
    }
    
    // Add loaded class to mobile services to enable swipe hint
    const mobileServices = document.querySelector('.mobile-only-services');
    if (mobileServices) {
        // Add loaded class after a short delay to enable the swipe hint animation
        setTimeout(() => {
            mobileServices.classList.add('loaded');
        }, 1000);
    }
    
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
    
    // Initialize timeline with direct content creation
    initTimeline();
    
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
    
    // Shared scrolling utility function for both services and timeline
    function setupNaturalScrolling(container, options = {}) {
        if (!container) return;
        
        const config = {
            resistance: 0.5,           // Higher = more resistance when scrolling
            deceleration: 0.85,        // Lower = faster stop (0.9 = smooth, 0.8 = quick stop)
            minSwipeDistance: 5,       // Minimum distance to consider a swipe (not a tap)
            snapToItems: false,        // Whether to snap to items
            itemSelector: null,        // Selector for items to snap to
            overscrollEnabled: true,   // Whether to allow overscroll effect
            overscrollResistance: 0.3, // Higher = less overscroll stretch (0-1)
            overscrollReturnDelay: 500, // Time in ms to hold the overscroll before returning
            ...options
        };
        
        // State variables
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let startScrollLeft = 0;
        let lastX = 0;
        let lastY = 0;
        let lastTimestamp = 0;
        let velocityX = 0;
        let momentumID = null;
        let lastDeltaX = 0;
        let isTap = true;
        let scrollDistanceTraveled = 0;
        let isOverscrolling = false;
        let overscrollAmount = 0;
        let overscrollReturnTimeoutId = null;
        
        // Get the scrollable track element (first child of container)
        const getTrack = () => container.querySelector(':scope > div');
        
        // Touch start event
        function onTouchStart(e) {
            cancelMomentumTracking();
            clearOverscrollReturn();
            
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            lastX = startX;
            lastY = startY;
            startScrollLeft = container.scrollLeft;
            lastTimestamp = Date.now();
            velocityX = 0;
            lastDeltaX = 0;
            isTap = true;
            scrollDistanceTraveled = 0;
            isDragging = true;
            isOverscrolling = false;
            overscrollAmount = 0;
            
            // Reset any existing transform on the track
            const track = getTrack();
            if (track) {
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
            }
        }
        
        // Touch move event
        function onTouchMove(e) {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const currentX = touch.clientX;
            const currentY = touch.clientY;
            const deltaX = lastX - currentX;
            const deltaY = lastY - currentY;
            const timestamp = Date.now();
            const elapsed = timestamp - lastTimestamp;
            
            // Calculate total distance traveled (for tap detection)
            scrollDistanceTraveled += Math.abs(deltaX);
            
            // Check for isTap - if movement exceeds threshold, it's not a tap
            if (scrollDistanceTraveled > config.minSwipeDistance) {
                isTap = false;
            }
            
            // Only prevent default and apply horizontal scroll if the movement is 
            // significantly more horizontal than vertical (1.5x more horizontal)
            if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
                e.preventDefault();
                
                // Check if we're at the edge of scrolling and should apply overscroll effect
                const isAtLeftEdge = container.scrollLeft <= 0;
                const isAtRightEdge = container.scrollLeft + container.offsetWidth >= container.scrollWidth;
                
                if (config.overscrollEnabled && ((isAtLeftEdge && deltaX < 0) || (isAtRightEdge && deltaX > 0))) {
                    // We're at an edge and trying to scroll beyond it - apply overscroll effect
                    isOverscrolling = true;
                    
                    // Calculate overscroll amount with progressive resistance
                    const resistedDeltaX = -deltaX * config.overscrollResistance;
                    overscrollAmount += resistedDeltaX;
                    
                    // Apply a maximum limit to overscroll amount (25% of container width)
                    const maxOverscroll = container.offsetWidth * 0.25;
                    overscrollAmount = Math.max(
                        Math.min(overscrollAmount, maxOverscroll), 
                        -maxOverscroll
                    );
                    
                    // Apply transform to the track element for visual feedback
                    const track = getTrack();
                    if (track) {
                        track.style.transform = `translateX(${overscrollAmount}px)`;
                    }
                } else {
                    // Normal scrolling
                    isOverscrolling = false;
                    
                    // Special case for timeline: check if the container is the timeline
                    const isTimeline = container.classList.contains('timeline-scroll-container');
                    
                    // Apply resistance factor to make scrolling feel natural
                    // Use lower resistance for timeline to make it faster
                    const resistedDeltaX = deltaX * (isTimeline ? config.resistance * 1.8 : config.resistance);
                    container.scrollLeft += resistedDeltaX;
                    
                    // Calculate velocity (pixels per millisecond)
                    if (elapsed > 0) {
                        // Smooth velocity calculation with boost for timeline
                        const velocityWeight = isTimeline ? 0.4 : 0.2; // Higher weight for timeline
                        velocityX = (1 - velocityWeight) * velocityX + velocityWeight * (deltaX / elapsed);
                    }
                }
                
                lastDeltaX = deltaX;
            } else {
                // If more vertical than horizontal (or close to equal),
                // let the browser handle vertical scrolling normally
                // and reset our horizontal velocity tracking
                velocityX = 0;
            }
            
            lastX = currentX;
            lastY = currentY;
            lastTimestamp = timestamp;
        }
        
        // Handle returning from overscroll state
        function returnFromOverscroll(immediate = false) {
            clearTimeout(overscrollReturnTimeoutId);
            
            const track = getTrack();
            if (!track) return;
            
            if (immediate) {
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
                overscrollAmount = 0;
                return;
            }
            
            // Apply smooth transition back with shorter animation time
            // Faster spring curve that still feels natural but doesn't linger
            track.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.05)';
            track.style.transform = 'translateX(0)';
            
            // Reset overscroll amount
            overscrollAmount = 0;
            
            // Clear transition after it completes (shorter time)
            setTimeout(() => {
                if (track) track.style.transition = 'none';
            }, 350);
        }
        
        function clearOverscrollReturn() {
            if (overscrollReturnTimeoutId) {
                clearTimeout(overscrollReturnTimeoutId);
                overscrollReturnTimeoutId = null;
            }
        }
        
        // Touch end event
        function onTouchEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            // If overscrolling, return to normal position with minimal delay
            if (isOverscrolling && overscrollAmount !== 0) {
                // Calculate delay based on device type and amount of overscroll
                // Desktop gets faster return, mobile slightly longer for better feel
                const isMobile = 'ontouchstart' in window;
                const maxDelay = isMobile ? 250 : 150; // Much shorter delays
                
                const delay = Math.abs(overscrollAmount) > container.offsetWidth * 0.1 ? 
                              Math.min(Math.abs(overscrollAmount), maxDelay) : 0;
                
                overscrollReturnTimeoutId = setTimeout(() => {
                    returnFromOverscroll();
                }, delay);
                return;
            }
            
            // If it's just a tap, don't apply momentum
            if (isTap) return;
            
            // Check if this is the timeline
            const isTimeline = container.classList.contains('timeline-scroll-container');
            
            // For services, use custom snap behavior instead of momentum for more immediate stopping
            if (config.customSnapBehavior) {
                // Use the custom snap behavior which will position items directly without momentum
                config.customSnapBehavior(container, config);
            } else if (Math.abs(velocityX) > 0.1) {
                // Apply momentum only if there's enough velocity and no custom snap behavior
                // Use higher amplification for timeline to make it move faster
                const amplifier = isTimeline ? 25 : 15; // Much higher boost for timeline
                const initialVelocity = velocityX * amplifier;
                
                startMomentumTracking(initialVelocity);
            } else if (config.snapToItems) {
                // Default snap behavior for other components
                snapToNearestItem();
            }
        }
        
        // Momentum scrolling
        function startMomentumTracking(initialVelocity) {
            let velocity = initialVelocity;
            let totalScrolled = 0;
            
            const scroll = () => {
                // Apply deceleration
                velocity *= config.deceleration;
                
                // Calculate how much to scroll on this frame
                const delta = velocity;
                totalScrolled += Math.abs(delta);
                
                // If movement is very small, stop animation and snap if needed
                if (Math.abs(delta) < 0.1) {
                    cancelMomentumTracking();
                    if (config.snapToItems) {
                        snapToNearestItem();
                    }
                    return;
                }
                
                // Check if we're at the edge of scrolling and should apply overscroll effect
                const wasAtLeftEdge = container.scrollLeft <= 0;
                const wasAtRightEdge = container.scrollLeft + container.offsetWidth >= container.scrollWidth;
                
                // Apply the movement
                container.scrollLeft += delta;
                
                // Check if we hit an edge after applying scroll
                const isAtLeftEdge = container.scrollLeft <= 0;
                const isAtRightEdge = container.scrollLeft + container.offsetWidth >= container.scrollWidth;
                
                // If we just hit an edge and overscroll is enabled, apply bounce effect
                if (config.overscrollEnabled && 
                    ((isAtLeftEdge && !wasAtLeftEdge && velocity < 0) || 
                     (isAtRightEdge && !wasAtRightEdge && velocity > 0))) {
                    // Cancel momentum and apply bounce
                    cancelMomentumTracking();
                    
                    // Calculate overscroll amount based on remaining velocity with reduced effect
                    const momentumFactor = Math.min(Math.abs(totalScrolled) / 500, 1);
                    const isMobile = 'ontouchstart' in window;
                    const velocityMultiplier = isMobile ? 10 : 6; // Enhanced bounce effect
                    
                    overscrollAmount = velocity * velocityMultiplier * momentumFactor;
                    
                    // Apply maximum limit - adjusted for better visual feedback
                    const maxOverscroll = container.offsetWidth * (isMobile ? 0.07 : 0.04) + (momentumFactor * 0.06);
                    overscrollAmount = Math.max(
                        Math.min(overscrollAmount, maxOverscroll), 
                        -maxOverscroll
                    );
                    
                    // Apply transform with minimal transition
                    const track = getTrack();
                    if (track) {
                        // No transition for instant effect
                        track.style.transition = 'none';
                        track.style.transform = `translateX(${overscrollAmount}px)`;
                        
                        // Return after a very short delay - slightly extended for better feel
                        const returnDelay = isMobile ? 
                            Math.min(Math.abs(overscrollAmount) * 1.8, 180) : // Mobile has slightly longer delay (max 180ms)
                            Math.min(Math.abs(overscrollAmount) * 1.2, 100);  // Desktop has short delay (max 100ms)
                            
                        overscrollReturnTimeoutId = setTimeout(() => {
                            returnFromOverscroll();
                        }, returnDelay);
                    }
                    
                    return;
                }
                
                // Continue animation
                momentumID = requestAnimationFrame(scroll);
            };
            
            momentumID = requestAnimationFrame(scroll);
        }
        
        // Cancel momentum scrolling
        function cancelMomentumTracking() {
            if (momentumID) {
                cancelAnimationFrame(momentumID);
                momentumID = null;
            }
        }
        
        // Snap to nearest item
        function snapToNearestItem() {
            if (!config.itemSelector) return;
            
            // If there's a custom snap behavior, use it
            if (config.customSnapBehavior) {
                config.customSnapBehavior(container, config);
                return;
            }
            
            // Otherwise use the default smooth snap behavior
            const scrollPosition = container.scrollLeft;
            const containerWidth = container.offsetWidth;
            const items = Array.from(container.querySelectorAll(config.itemSelector));
            
            if (items.length === 0) return;
            
            let closestItem = null;
            let closestDistance = Infinity;
            
            items.forEach(item => {
                const itemLeft = item.offsetLeft;
                const itemCenter = itemLeft + (item.offsetWidth / 2);
                const distanceToCenter = Math.abs(scrollPosition + (containerWidth / 2) - itemCenter);
                
                if (distanceToCenter < closestDistance) {
                    closestDistance = distanceToCenter;
                    closestItem = item;
                }
            });
            
            if (closestItem) {
                const targetPosition = closestItem.offsetLeft - (containerWidth - closestItem.offsetWidth) / 2;
                
                container.scrollTo({
                    left: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
        
        // Add event listeners
        container.addEventListener('touchstart', onTouchStart, { passive: true });
        container.addEventListener('touchmove', onTouchMove, { passive: false });
        container.addEventListener('touchend', onTouchEnd, { passive: true });
        
        // Mouse events (for desktop testing)
        container.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.pageX;
            startY = e.pageY;
            lastX = startX;
            lastY = startY;
            startScrollLeft = container.scrollLeft;
            lastTimestamp = Date.now();
            velocityX = 0;
            lastDeltaX = 0;
            isTap = true;
            scrollDistanceTraveled = 0;
            isDragging = true;
            isOverscrolling = false;
            overscrollAmount = 0;
            container.style.cursor = 'grabbing';
            
            // Reset any existing transform on the track
            const track = getTrack();
            if (track) {
                track.style.transition = 'none';
                track.style.transform = 'translateX(0)';
            }
            
            cancelMomentumTracking();
            clearOverscrollReturn();
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.pageX;
            const currentY = e.pageY;
            const deltaX = lastX - currentX;
            const deltaY = lastY - currentY;
            const timestamp = Date.now();
            const elapsed = timestamp - lastTimestamp;
            
            // Calculate total distance traveled
            scrollDistanceTraveled += Math.abs(deltaX);
            
            // Check for isTap
            if (scrollDistanceTraveled > config.minSwipeDistance) {
                isTap = false;
            }
            
            // Check if we're at the edge of scrolling and should apply overscroll effect
            const isAtLeftEdge = container.scrollLeft <= 0;
            const isAtRightEdge = container.scrollLeft + container.offsetWidth >= container.scrollWidth;
            
            if (config.overscrollEnabled && ((isAtLeftEdge && deltaX < 0) || (isAtRightEdge && deltaX > 0))) {
                // We're at an edge and trying to scroll beyond it - apply overscroll effect
                isOverscrolling = true;
                
                // Calculate overscroll amount with progressive resistance
                const resistedDeltaX = -deltaX * config.overscrollResistance;
                overscrollAmount += resistedDeltaX;
                
                // Apply a maximum limit to overscroll amount (25% of container width)
                const maxOverscroll = container.offsetWidth * 0.25;
                overscrollAmount = Math.max(
                    Math.min(overscrollAmount, maxOverscroll), 
                    -maxOverscroll
                );
                
                // Apply transform to the track element for visual feedback
                const track = getTrack();
                if (track) {
                    track.style.transform = `translateX(${overscrollAmount}px)`;
                }
            } else {
                // Normal scrolling
                isOverscrolling = false;
                
                // Apply movement with resistance
                const resistedDeltaX = deltaX * config.resistance;
                container.scrollLeft += resistedDeltaX;
                
                // Calculate velocity
                if (elapsed > 0) {
                    velocityX = 0.8 * velocityX + 0.2 * (deltaX / elapsed);
                }
            }
            
            lastX = currentX;
            lastY = currentY;
            lastTimestamp = timestamp;
            lastDeltaX = deltaX;
        });
        
        function onMouseUp() {
            if (!isDragging) return;
            isDragging = false;
            container.style.cursor = 'grab';
            
            // If overscrolling, return to normal position after a delay
            if (isOverscrolling && overscrollAmount !== 0) {
                overscrollReturnTimeoutId = setTimeout(() => {
                    returnFromOverscroll();
                }, config.overscrollReturnDelay);
                return;
            }
            
            // Use custom snap behavior instead of momentum if available
            if (config.customSnapBehavior) {
                config.customSnapBehavior(container, config);
            }
            // Only apply momentum if it's not a tap and has velocity
            else if (!isTap && Math.abs(velocityX) > 0.1) {
                const amplifier = 15; // Boost initial velocity
                const initialVelocity = velocityX * amplifier;
                
                startMomentumTracking(initialVelocity);
            } else if (config.snapToItems) {
                snapToNearestItem();
            }
        }
        
        container.addEventListener('mouseup', onMouseUp);
        container.addEventListener('mouseleave', onMouseUp);
        
        // Wheel event for horizontal scrolling
        container.addEventListener('wheel', (e) => {
            // If shift key is pressed or it's a trackpad horizontal scroll
            if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                
                // Cancel existing momentum scrolling
                cancelMomentumTracking();
                clearOverscrollReturn();
                
                // Check if at edge and apply overscroll
                const isAtLeftEdge = container.scrollLeft <= 0;
                const isAtRightEdge = container.scrollLeft + container.offsetWidth >= container.scrollWidth;
                
                if (config.overscrollEnabled && 
                    ((isAtLeftEdge && e.deltaX < 0) || (isAtRightEdge && e.deltaX > 0))) {
                    // Calculate overscroll amount
                    overscrollAmount += e.deltaX * -0.1; // Scale for visual effect
                    
                    // Apply maximum limit
                    const maxOverscroll = container.offsetWidth * 0.1;
                    overscrollAmount = Math.max(
                        Math.min(overscrollAmount, maxOverscroll), 
                        -maxOverscroll
                    );
                    
                    // Apply transform to the track element
                    const track = getTrack();
                    if (track) {
                        track.style.transform = `translateX(${overscrollAmount}px)`;
                        
                        // Return after a delay
                        clearTimeout(overscrollReturnTimeoutId);
                        overscrollReturnTimeoutId = setTimeout(() => {
                            returnFromOverscroll();
                        }, 150);
                    }
                } else {
                    // Normal scrolling
                    const wheelDelta = e.deltaX || e.deltaY;
                    container.scrollLeft += wheelDelta;
                }
                
                // Add gentle momentum for wheel scrolling
                clearTimeout(container._wheelTimeout);
                container._wheelTimeout = setTimeout(() => {
                    if (config.snapToItems) {
                        snapToNearestItem();
                    }
                }, 150);
            }
        }, { passive: false });
        
        // Set initial cursor style
        container.style.cursor = 'grab';
        
        // Return public methods
        return {
            snapToNearestItem,
            cancelMomentumTracking,
            returnFromOverscroll
        };
    }
    
    // Services scroll functionality (for mobile)
    function initServicesScroll() {
        // Get the basic services container
        const basicServicesScroll = document.getElementById('basic-services-scroll');
        if (!basicServicesScroll) return;
        
        // Check for mobile viewport
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            console.log('Setting up basic mobile services');
            
            // Set up basic variables to track scrolling vs clicking
            let isScrolling = false;
            let startX = 0;
            let startTime = 0;
            
            // When the user starts touching the container
            basicServicesScroll.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startTime = Date.now();
                isScrolling = false;
            }, { passive: true });
            
            // When the user moves their finger
            basicServicesScroll.addEventListener('touchmove', function() {
                isScrolling = true;
            }, { passive: true });
            
            // Clean up click handlers for all service tiles
            const serviceTiles = basicServicesScroll.querySelectorAll('.basic-service-tile');
            
            serviceTiles.forEach(tile => {
                // Override the onclick attribute with a proper event listener
                tile.removeAttribute('onclick');
                
                tile.addEventListener('click', function(e) {
                    // If the user was scrolling, don't trigger the modal
                    if (isScrolling) {
                        e.preventDefault();
                        return false;
                    }
                    
                    // Extract the modal ID from the original onclick attribute
                    const modalId = this.getAttribute('data-target') || 
                                   this.onclick?.toString().match(/openModal\(['"]([^'"]+)['"]\)/)?.[1];
                    
                    if (modalId) {
                        console.log('Opening modal:', modalId);
                        openModal(modalId);
                    }
                });
                
                // Store the modal ID as a data attribute
                const onclickStr = tile.getAttribute('onclick') || '';
                const modalMatch = onclickStr.match(/openModal\(['"]([^'"]+)['"]\)/);
                if (modalMatch && modalMatch[1]) {
                    tile.setAttribute('data-target', modalMatch[1]);
                }
            });
            
            console.log('Basic mobile services setup complete');
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
                        <li>Unique custom pieces</li>
                        <li>Set decoration</li>
                        <li>Period-accurate items</li>
                        <li>Special effect props</li>
                        <li>Production design support</li>
                        <li>Custom craftsmanship</li>
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
    
    // Initialize timeline with services-like scrolling
    function initTimeline() {
        const timelineContainer = document.getElementById('history');
        const timelineScroll = document.getElementById('timeline-basic-scroll');
        
        if (!timelineContainer || !timelineScroll) return;
        
        // Timeline data with actual content from timeline.md
        const timelineData = [
            {
                year: '2025',
                events: [
                    'Dacia New Visual Identity across 9 European countries',
                    'Renault Store NewR',
                    'FBI International S4 CZ',
                ]
            },
            {
                year: '2024',
                events: [
                    'The Wheel of Time / Season 3 / South Africa',
                    'Dacia New Visual Identity across 9 European countries',
                    'Renault Store / New One / Rebranding',
                    'Renault Alpine Store',
                    'Renault Care Service / Rebranding'
                ]
            },
            {
                year: '2023',
                events: [
                    'The Wheel of Time / Season 3 / Czechia / Slovenia',
                    'The Crow / Yellow Flower',
                    'Dacia New Visual Identity / New Project',
                    'Renault Store / Rebranding',
                    'MG Since 1924 / New Graphics Expo Frame'
                ]
            },
            {
                year: '2022',
                events: [
                    'The Crow / Yellow Flower',
                    'The Wheel of Time / Season 2',
                    'Renault Alpine Store / Interior',
                    'Renault Store Rebranding / Interior',
                    'Dacia New Identity / Pilot Store / Interior'
                ]
            },
            {
                year: '2021',
                events: [
                    'Wheel of Time - Amazon',
                    'Hanna Season 3',
                    'Dangerous Liaisons',
                    'Renault Store CZ/SK',
                    'PVA Auto Show Praha - Renault'
                ]
            },
            {
                year: '2020',
                events: [
                    'Hanna Season 3',
                    'Wheel of Time - Amazon',
                    'Jeep Commercial',
                    'LYNK & Co Commercial',
                    'Renault Store CZ/SK'
                ]
            },
            {
                year: '2019',
                events: [
                    'Wheel of Time - Amazon',
                    'Zátopek',
                    'Oblivious / Bez Vědomí',
                    'Jojo Rabbit',
                    'The Painted Bird'
                ]
            },
            {
                year: '2016-18',
                events: [
                    'Jojo Rabbit',
                    'The Painted Bird',
                    'Catcher Was A Spy',
                    'The Pleasure Principle',
                    'Renault Store CZ/SK/HU'
                ]
            },
            {
                year: '2013-15',
                events: [
                    'The Zookeeper\'s Wife',
                    'The Musketeers',
                    'Vinaři - TV Prima',
                    'LG Zone - MFF Karlovy Vary',
                    'Renault Store - CZ/SK/HU'
                ]
            },
            {
                year: '2010-12',
                events: [
                    'The Snowpiercer',
                    'Last Knights',
                    'Mission Impossible 4',
                    'Lidice',
                    'Die Deutschen - ZDF'
                ]
            },
            {
                year: '2008-09',
                events: [
                    'Bathory',
                    'Red Tails',
                    'Kajínek',
                    'Oliver Twist',
                    'Letopisy Narnie: Princ Kaspian'
                ]
            }
        ];
        
        // Clear container first
        timelineScroll.innerHTML = '';
        
        // Create timeline tiles based on the data
        timelineData.forEach(item => {
            // Create new timeline tile
            const newTile = document.createElement('div');
            newTile.className = 'timeline-tile';
            
            // Create year label
            const yearLabel = document.createElement('div');
            yearLabel.className = 'timeline-year';
            yearLabel.textContent = item.year;
            
            // Create content container
            const content = document.createElement('div');
            content.className = 'timeline-content';
            
            // Create list
            const list = document.createElement('ul');
            list.className = 'timeline-event-list';
            
            // Add list items
            item.events.forEach(text => {
                const li = document.createElement('li');
                li.textContent = text;
                list.appendChild(li);
            });
            
            // Assemble the tile
            content.appendChild(list);
            newTile.appendChild(yearLabel);
            newTile.appendChild(content);
            
            // Add to container
            timelineScroll.appendChild(newTile);
        });
        
        // Set up direct scrolling for all devices
        console.log('Setting up services-style scrolling for timeline');
        
        // Set up basic variables to track scrolling vs clicking
        let isScrolling = false;
        let startX = 0;
        let startTime = 0;
        
        // When the user starts touching the container
        timelineScroll.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startTime = Date.now();
            isScrolling = false;
        }, { passive: true });
        
        // When the user moves their finger
        timelineScroll.addEventListener('touchmove', function() {
            isScrolling = true;
        }, { passive: true });
        
        // Make the scroll container scroll properly with momentum
        // This directly uses the browser's native scrolling with momentum
        timelineScroll.style.webkitOverflowScrolling = 'touch';
        timelineScroll.style.overflowX = 'auto';
        timelineScroll.style.overflowY = 'hidden';
        
        // Fix for some mobile browsers that need a repaint to enable smooth scrolling
        setTimeout(function() {
            const parent = timelineScroll.parentNode;
            const next = timelineScroll.nextSibling;
            parent.removeChild(timelineScroll);
            parent.insertBefore(timelineScroll, next);
            console.log('Timeline scroll container initialized for smooth scrolling');
        }, 100);
        
        // Add loaded class after a short delay to enable the swipe hint animation
        setTimeout(() => {
            timelineContainer.classList.add('loaded');
        }, 1000);
    }
    
    // Debug script to check services loading
    function checkServicesLoading() {
        console.log('Loading services check - HTML loaded');
        const servicesTrack = document.getElementById('services-track');
        console.log('Services track exists:', !!servicesTrack);
        if (servicesTrack) {
            console.log('Services track HTML:', servicesTrack.innerHTML);
        }
        
        // Force loading services if needed
        if (servicesTrack && !servicesTrack.children.length) {
            console.log('Attempting to manually load services');
            fetch('includes/services.html')
                .then(response => response.text())
                .then(html => {
                    servicesTrack.innerHTML = html;
                    console.log('Services manually loaded');
                })
                .catch(error => console.error('Manual services load failed:', error));
        }
    }
    
    // iOS-specific scrolling fix
    function applyIOSScrollingFix() {
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
            // Create a style element for critical iOS fixes
            const style = document.createElement('style');
            style.textContent = `
                .services-scroll-container {
                    -webkit-overflow-scrolling: touch !important;
                    overflow-x: scroll !important;
                }
                .services-track {
                    display: flex !important;
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
            
            // Apply direct DOM fixes when loaded
            const container = document.querySelector('.services-scroll-container');
            if (container) {
                // Force redraw to trigger proper iOS scroll behavior
                container.style.display = 'none';
                setTimeout(() => {
                    container.style.display = 'block';
                }, 10);
            }
        }
    }
    
    // Basic services scrolling helper - ensures scrolling works on all devices
    function initBasicServicesScroll() {
        const basicServicesScroll = document.getElementById('basic-services-scroll');
        
        if (basicServicesScroll) {
            console.log('Applying basic services scrolling fixes');
            
            // Force optimal settings for mobile scrolling
            if (window.innerWidth <= 768) {
                // Force mobile optimizations
                basicServicesScroll.style.webkitOverflowScrolling = 'touch';
                basicServicesScroll.style.overflowX = 'auto';
                basicServicesScroll.style.overflowY = 'hidden';
                
                // Fix for some mobile browsers that need a repaint
                setTimeout(function() {
                    const parent = basicServicesScroll.parentNode;
                    const next = basicServicesScroll.nextSibling;
                    parent.removeChild(basicServicesScroll);
                    parent.insertBefore(basicServicesScroll, next);
                    console.log('Basic services scroll container reinitialized');
                }, 100);
            }
            
            // Add direct click handlers that won't conflict with scrolling
            const serviceTiles = basicServicesScroll.querySelectorAll('.basic-service-tile');
            
            serviceTiles.forEach(tile => {
                // Track if the user is scrolling or tapping
                let startX, startTime, isScrolling = false;
                
                tile.addEventListener('touchstart', e => {
                    startX = e.touches[0].clientX;
                    startTime = Date.now();
                    isScrolling = false;
                }, { passive: true });
                
                tile.addEventListener('touchmove', () => {
                    isScrolling = true;
                }, { passive: true });
                
                tile.addEventListener('click', e => {
                    if (isScrolling) {
                        e.preventDefault();
                        return;
                    }
                    
                    const modalId = tile.getAttribute('data-target');
                    if (modalId) {
                        e.preventDefault();
                        e.stopPropagation();
                        openModal(modalId);
                    }
                });
            });
        }
    }
    
    // Call these new functions when the DOM is loaded
    checkServicesLoading();
    applyIOSScrollingFix();
    initBasicServicesScroll();
});