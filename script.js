document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animation On Scroll)
    initAOS();
    
    // Handle header scroll effect
    handleHeaderScroll();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // PWA installation prompt
    initPWAPrompt();
    
    // Update copyright year
    updateCopyrightYear();
    
    // Parallax effect for glass shapes
    initParallax();
});

// Initialize AOS-like animation
function initAOS() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            } else {
                if (window.innerWidth > 768) {
                    entry.target.classList.remove('aos-animate');
                }
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
        
        // Add delay if specified
        if (element.dataset.aosDelay) {
            element.style.transitionDelay = `${parseInt(element.dataset.aosDelay)}ms`;
        }
    });
}

// Handle header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on navigation links
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// PWA installation prompt
function initPWAPrompt() {
    // Show install prompt based on user agent and localStorage
    const promptContainer = document.querySelector('.pwa-install-prompt');
    const installButton = document.getElementById('install-pwa');
    const closeButton = document.getElementById('close-prompt');
    
    // Check if the app is already installed or if the user has dismissed the prompt
    const isPromptDismissed = localStorage.getItem('pwaPromptDismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone || 
                         document.referrer.includes('android-app://');
    
    // Determine if the device can install PWAs (simplified check)
    const canInstallPWA = 
        (navigator.userAgent.includes('Chrome') || 
         navigator.userAgent.includes('Edge') || 
         navigator.userAgent.includes('Safari')) && 
        !isStandalone && 
        !isPromptDismissed;
    
    if (canInstallPWA) {
        // Show the prompt after a slight delay
        setTimeout(() => {
            promptContainer.classList.add('show');
        }, 3000);
    }
    
    // Handle close button
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            promptContainer.classList.remove('show');
            localStorage.setItem('pwaPromptDismissed', 'true');
        });
    }
    
    // Handle install button (basic functionality)
    if (installButton) {
        installButton.addEventListener('click', () => {
            // Add to homescreen guidance
            alert('To install this app, add it to your home screen from your browser menu.');
            promptContainer.classList.remove('show');
        });
    }
    
    // Try to use the Web App Install API if available
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Store the event for later use
        deferredPrompt = e;
        
        // Show install button functionality
        if (installButton) {
            installButton.addEventListener('click', async () => {
                if (deferredPrompt) {
                    // Show the install prompt
                    deferredPrompt.prompt();
                    // Wait for the user to respond to the prompt
                    const { outcome } = await deferredPrompt.userChoice;
                    // We no longer need the prompt
                    deferredPrompt = null;
                    // Hide our UI regardless of outcome
                    promptContainer.classList.remove('show');
                }
            });
        }
    });
}

// Update copyright year
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Parallax effect for glass shapes
function initParallax() {
    const glassElements = document.querySelectorAll('.hero-glass-shape, .features-glass-shape, .about-glass-shape, .cta-glass-shape');
    
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        glassElements.forEach(element => {
            const speed = 30;
            const xPos = (0.5 - x) * speed;
            const yPos = (0.5 - y) * speed;
            
            element.style.transform = `translate(${xPos}px, ${yPos}px) rotate(-15deg)`;
        });
    });
}

// Check if service worker is supported (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}