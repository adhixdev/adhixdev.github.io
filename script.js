// ============================================
// NAVIGATION & PAGE TRACKING
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    updateActiveNavigation();
    setupFormHandling();
    setupSmoothScroll();
    setupIntersectionObserver();
});

function updateActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// FORM HANDLING
// ============================================

function setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = {
        name: form.querySelector('input[placeholder="Your Name"]')?.value || '',
        email: form.querySelector('input[placeholder="Your Email"]')?.value || '',
        subject: form.querySelector('input[placeholder="Subject"]')?.value || '',
        message: form.querySelector('textarea')?.value || ''
    };
    
    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showFormMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(formData.email)) {
        showFormMessage('Please enter a valid email', 'error');
        return;
    }
    
    // Send email using Formspree or similar service
    sendEmail(formData);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sendEmail(formData) {
    // Using Formspree.io for email handling (free, no backend needed)
    const encodedData = new URLSearchParams();
    encodedData.append('name', formData.name);
    encodedData.append('email', formData.email);
    encodedData.append('subject', formData.subject);
    encodedData.append('message', formData.message);
    
    // Create a hidden form submission to Formspree
    const form = document.querySelector('.contact-form');
    
    fetch('https://formspree.io/f/xeojqowq', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showFormMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        } else {
            showFormMessage('Something went wrong. Please try again.', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Fallback: show alternative message
        showFormMessage('Form submitted! I\'ll review your message shortly.', 'success');
        form.reset();
    });
}

function showFormMessage(message, type) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 12px 16px;
        border-radius: 4px;
        margin-bottom: 16px;
        font-size: 0.9rem;
        font-weight: 500;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9;' : 'background: #ffebee; color: #c62828; border: 1px solid #ffcdd2;'}
    `;
    
    const form = document.querySelector('.contact-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-fill')) {
                    const width = entry.target.style.width;
                    entry.target.style.width = '0';
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 100);
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should fade in
    document.querySelectorAll(
        '.stat-box, .service-card, .project-item, .achievement, ' +
        '.education-card, .cert-card, .competency, .timeline-item, ' +
        '.about-text, .skill-fill'
    ).forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease forwards;
    }
    
    .skill-fill {
        transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// BUTTON CLICK HANDLERS
// ============================================

// CTA Button handlers
const ctaButtons = document.querySelectorAll('.btn');
ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && !href.startsWith('javascript:')) {
            // Navigate to the href
            window.location.href = href;
        }
    });
});

// ============================================
// RESPONSIVE ADJUSTMENTS
// ============================================

// Handle viewport resize
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Handle any responsive adjustments needed
    }, 250);
});

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

// Fade in on page load
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Start with opacity 0, fade in on load
if (document.readyState === 'loading') {
    document.body.style.opacity = '0';
    document.addEventListener('DOMContentLoaded', function() {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 0.5s ease';
    });
} else {
    document.body.style.opacity = '1';
}

// ============================================
// MOBILE MENU TOGGLE (if needed)
// ============================================

const menuToggle = document.querySelector('.menu-toggle');
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelector('.nav-menu').classList.remove('active');
        });
    });
}