// DOM Elements
const navbar = document.querySelector('.navbar');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const statNumbers = document.querySelectorAll('.stat-number');
const contactForm = document.getElementById('contactForm');
const productTypeSelect = document.querySelector('select[name="product-type"]');
const quantityInput = document.querySelector('input[type="number"]');

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'white';
        navbar.style.padding = '15px 0';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.padding = '20px 0';
    }
});

// Mobile Menu Toggle
menuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight);
    scrollProgress.style.transform = `scaleX(${scrolled})`;
});

// Enhanced Parallax Effect
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
    
    document.querySelectorAll('.floating-shape').forEach(shape => {
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// Stats Counter Animation with Intersection Observer
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            clearInterval(timer);
            element.textContent = end.toLocaleString();
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Intersection Observer for Stats Animation
const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElements = entry.target.querySelectorAll('.stat-number');
                statElements.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateValue(stat, 0, target, 2000);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

document.querySelector('.stats-container') && 
statsObserver.observe(document.querySelector('.stats-container'));

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
            
            // Update active state
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Quote Calculator
function calculateQuote(quantity, productType) {
    const basePrice = {
        'jerseys': 25,
        'uniforms': 35,
        'athletic': 30,
        'custom': 40
    };
    
    const price = basePrice[productType] || 0;
    const total = price * quantity;
    
    // Apply bulk discounts
    if (quantity >= 100) {
        return total * 0.8; // 20% discount
    } else if (quantity >= 50) {
        return total * 0.9; // 10% discount
    } else if (quantity >= 20) {
        return total * 0.95; // 5% discount
    }
    
    return total;
}

// Update quote on form changes
function updateQuote() {
    const quantity = parseInt(quantityInput.value) || 0;
    const productType = productTypeSelect.value;
    
    if (quantity && productType) {
        const quote = calculateQuote(quantity, productType);
        const quoteElement = document.getElementById('quote-amount');
        
        if (!quoteElement) {
            const div = document.createElement('div');
            div.innerHTML = `
                <div id="quote-amount" class="quote-preview">
                    <h4>Estimated Quote</h4>
                    <p>$${quote.toFixed(2)}</p>
                    <small>* Final price may vary based on design complexity</small>
                </div>
            `;
            contactForm.insertBefore(div, contactForm.querySelector('button'));
        } else {
            quoteElement.querySelector('p').textContent = `$${quote.toFixed(2)}`;
        }
    }
}

productTypeSelect && productTypeSelect.addEventListener('change', updateQuote);
quantityInput && quantityInput.addEventListener('input', updateQuote);

// Form Submission
contactForm && contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('.submit-btn');
    
    try {
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Quote Request Sent!</h3>
            <p>We'll get back to you within 24 hours with a detailed quote.</p>
        `;
        
        contactForm.innerHTML = '';
        contactForm.appendChild(successMessage);
    } catch (error) {
        alert('Oops! Something went wrong. Please try again later.');
        submitBtn.textContent = 'Get Quote';
        submitBtn.disabled = false;
    }
});

// Smooth reveal for elements
const revealElements = document.querySelectorAll(
    '.services-grid, .teams-slider, .about-grid, .features-grid, .service-card, .feature-item'
);

const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px'
};

const revealCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    revealObserver.observe(element);
});

// Enhanced button interactions
document.querySelectorAll('.cta-button').forEach(button => {
    const text = button.textContent;
    button.innerHTML = `<span>${text}</span>`;
    
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', `${x}px`);
        button.style.setProperty('--y', `${y}px`);
    });
});

// Enhanced form interactions
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Service card hover effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (centerY - y) / 10;
        const angleY = (x - centerX) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Process cards hover effect
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
        const image = card.querySelector('.process-image');
        if (image) {
            image.style.transform = 'scale(1.1)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        const image = card.querySelector('.process-image');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    });
});

// Enhanced navigation highlighting
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const heroOverlay = document.querySelector('.hero-overlay');
        const scrolled = window.pageYOffset;
        if (heroOverlay) {
            heroOverlay.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 + scrolled * 0.0005})`;
        }
    });
    
    // Set initial active nav link
    const currentSection = window.location.hash || '#home';
    const activeLink = document.querySelector(`a[href="${currentSection}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Initialize any third-party libraries or additional features
    initializeFeatures();
});

function initializeFeatures() {
    // Add smooth transitions for page loads
    document.body.classList.add('loaded');
    
    // Initialize quote calculator if form exists
    if (document.getElementById('contactForm')) {
        initializeQuoteCalculator();
    }
}

// Quote calculator initialization
function initializeQuoteCalculator() {
    const form = document.getElementById('contactForm');
    const quantityInput = form.querySelector('input[type="number"]');
    const productSelect = form.querySelector('select[name="product-type"]');
    
    if (quantityInput && productSelect) {
        [quantityInput, productSelect].forEach(input => {
            input.addEventListener('change', updateQuote);
            input.addEventListener('input', updateQuote);
        });
    }
} 