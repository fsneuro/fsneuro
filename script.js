document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    
    // Force all sections to be visible immediately
    const sections = document.querySelectorAll('section');
    console.log("Found sections:", sections.length);
    
    // Make ALL sections visible immediately - no scroll required
    sections.forEach(section => {
        section.classList.add('appear');
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
        console.log("Made section visible:", section.id || "(unnamed section)");
    });
    
    // Add this after making sections visible
    document.querySelectorAll('.scroll-animation').forEach(element => {
        element.classList.add('appear');
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
        console.log("Made scroll animation element visible");
    });
    
    // Create stacked background images for parallax
    const createStackedParallaxBackground = () => {
        // Remove any existing parallax background
        const existingBg = document.querySelector('.continuous-parallax-bg');
        if (existingBg) {
            existingBg.remove();
        }
        
        // Create container for stacked images
        const parallaxContainer = document.createElement('div');
        parallaxContainer.className = 'continuous-parallax-bg';
        
        // Create 3 stacked image layers
        const imageCount = 5;
        for (let i = 0; i < imageCount; i++) {
            const imgLayer = document.createElement('div');
            imgLayer.className = 'parallax-layer';
            imgLayer.style.backgroundImage = "url('newbie_retreat.png')";
            imgLayer.style.top = `${i * 100}vh`; // Stack images vertically
            imgLayer.style.opacity = 0.8; // Reduce opacity with blur
            imgLayer.dataset.speed = (0.3 + (i * 0.1)).toString(); // Different speeds for each layer
            parallaxContainer.appendChild(imgLayer);
        }
        
        document.body.prepend(parallaxContainer);
        return parallaxContainer;
    };
    
    // Create the stacked background
    const parallaxBackground = createStackedParallaxBackground();
    
    // Animation on scroll for sections - keeping this for future scrolling
    function checkScroll() {
        const windowHeight = window.innerHeight;
        const scrollPosition = window.pageYOffset;
        
        // Make sure sections are visible
        sections.forEach(section => {
            section.classList.add('appear');
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        });
        
        // Handle stacked parallax background effect
        if (parallaxBackground) {
            // Get all layers and animate each one at different speeds
            const layers = parallaxBackground.querySelectorAll('.parallax-layer');
            
            layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed || "0.3");
                layer.style.transform = `translateY(${-scrollPosition * speed}px)`;
            });
        }
        
        // Parallax effect for sections with parallax-bg class - IMPROVED VERSION
        document.querySelectorAll('.parallax-bg').forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrollPosition;
            const elementBottom = rect.bottom + scrollPosition;
            
            // Calculate distance from middle of viewport to middle of element
            const viewportMiddle = scrollPosition + windowHeight / 2;
            const elementMiddle = elementTop + (rect.height / 2);
            const distanceFromCenter = (elementMiddle - viewportMiddle) * 0.15;
            
            // Calculate how far the element is through the viewport as a percentage
            const inViewPercentage = (windowHeight - rect.top) / (windowHeight + rect.height);
            const speed = element.dataset.speed || 0.2;
            
            // Apply a smoother transform that gradually increases and decreases
            if (rect.top < windowHeight && rect.bottom > 0) {
                // Use translateY with a smaller value for more subtle movement
                element.style.transform = `translateY(${-distanceFromCenter * speed}px)`;
            }
        });
    }

    // Initial check and scroll event listener
    checkScroll();
    window.addEventListener('scroll', checkScroll);

    // Animation for the scroll event
    function smoothScrollTo(element) {
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000; // ms
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const scrollY = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, scrollY);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        // Easing function
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) smoothScrollTo(targetElement);
        });
    });

    // Force multiple recalculations to ensure sections become visible
    setTimeout(checkScroll, 100);
    setTimeout(checkScroll, 500);
    setTimeout(checkScroll, 1000);
    
    console.log("Script completed execution");
});

// Backup to ensure script runs even if DOMContentLoaded fails
window.onload = function() {
    console.log("Window loaded - backup execution");
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
    });
};