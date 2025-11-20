// Contact Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initContactAnimations();
    initContactValidation();
    initContactMap();
});

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (validateContactForm(form)) {
                // Show loading state
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                try {
                    // Simulate form submission (replace with actual backend call)
                    await simulateFormSubmission();

                    // Show success message
                    showContactMessage('success', 'Message sent successfully! I\'ll get back to you soon.');
                    form.reset();

                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;

                    // Track form submission
                    trackFormSubmission();

                } catch (error) {
                    // Show error message
                    showContactMessage('error', 'Failed to send message. Please try again.');

                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    }
}

// Form Validation
function initContactValidation() {
    const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');

    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('input', function() {
            validateField(this);
        });

        // Blur validation
        input.addEventListener('blur', function() {
            validateField(this);
        });

        // Focus effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }

    // Email validation
    if (fieldType === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }

    // Name validation
    if (fieldName === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'Name must be at least 2 characters long';
    }

    // Subject validation
    if (fieldName === 'subject' && value && value.length < 3) {
        isValid = false;
        errorMessage = 'Subject must be at least 3 characters long';
    }

    // Message validation
    if (fieldName === 'message' && value && value.length < 10) {
        isValid = false;
        errorMessage = 'Message must be at least 10 characters long';
    }

    // Show or hide error
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(field, message) {
    clearFieldError(field);

    field.style.borderColor = '#e53e3e';
    field.parentElement.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e53e3e;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: fadeInUp 0.3s ease-out;
    `;

    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    field.parentElement.classList.remove('error');

    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function validateContactForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Simulate form submission (replace with actual backend)
async function simulateFormSubmission() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (90% success rate for demo)
            if (Math.random() > 0.1) {
                resolve({ success: true });
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

// Contact Messages
function showContactMessage(type, message) {
    // Remove existing messages
    const existingMessage = document.querySelector('.contact-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `contact-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="message-close">&times;</button>
        </div>
    `;

    // Add message styles
    const messageStyles = document.createElement('style');
    messageStyles.textContent = `
        .contact-message {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
        }

        .message-content {
            background: ${type === 'success' ? '#48bb78' : '#e53e3e'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            min-width: 300px;
            max-width: 400px;
        }

        .message-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        }

        .contact-message.hide {
            animation: slideOutRight 0.5s ease-out forwards;
        }

        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;

    if (!document.querySelector('style[data-contact-styles]')) {
        messageStyles.setAttribute('data-contact-styles', 'true');
        document.head.appendChild(messageStyles);
    }

    document.body.appendChild(messageDiv);

    // Auto-hide after 5 seconds
    const autoHideTimer = setTimeout(() => {
        hideContactMessage(messageDiv);
    }, 5000);

    // Manual close
    const closeBtn = messageDiv.querySelector('.message-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoHideTimer);
        hideContactMessage(messageDiv);
    });

    // Click outside to close
    messageDiv.addEventListener('click', (e) => {
        if (e.target === messageDiv) {
            clearTimeout(autoHideTimer);
            hideContactMessage(messageDiv);
        }
    });
}

function hideContactMessage(messageDiv) {
    messageDiv.classList.add('hide');
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 500);
}

// Contact Form Animations
function initContactAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;

                if (element.classList.contains('contact-info')) {
                    element.style.animation = 'fadeInLeft 0.8s ease-out';
                } else if (element.classList.contains('contact-form')) {
                    element.style.animation = 'fadeInRight 0.8s ease-out';
                }

                observer.unobserve(element);
            }
        });
    }, observerOptions);

    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form');

    if (contactInfo) {
        contactInfo.style.opacity = '0';
        observer.observe(contactInfo);
    }

    if (contactForm) {
        contactForm.style.opacity = '0';
        observer.observe(contactForm);
    }
}

// Character Counter
function initCharacterCounter() {
    const messageField = document.getElementById('message');
    const maxLength = 500;

    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: var(--text-lighter);
            margin-top: 0.25rem;
        `;

        messageField.parentElement.appendChild(counter);
        updateCharacterCounter();

        messageField.addEventListener('input', updateCharacterCounter);

        function updateCharacterCounter() {
            const currentLength = messageField.value.length;
            counter.textContent = `${currentLength} / ${maxLength}`;

            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#e53e3e';
            } else if (currentLength > maxLength * 0.7) {
                counter.style.color = '#ed8936';
            } else {
                counter.style.color = 'var(--text-lighter)';
            }
        }
    }
}

// Contact Map (Optional)
function initContactMap() {
    const mapContainer = document.querySelector('.contact-map');

    if (mapContainer) {
        // Create a simple map placeholder
        mapContainer.innerHTML = `
            <div class="map-placeholder">
                <i class="fas fa-map-marked-alt"></i>
                <h4>Location</h4>
                <p>Your City, Country</p>
                <a href="https://maps.google.com" target="_blank" class="btn btn-secondary">
                    <i class="fas fa-external-link-alt"></i> Open in Maps
                </a>
            </div>
        `;

        // Add map styles
        const mapStyles = document.createElement('style');
        mapStyles.textContent = `
            .contact-map {
                grid-column: 1 / -1;
                background: var(--bg-light);
                border-radius: 1rem;
                overflow: hidden;
                margin-top: 2rem;
            }

            .map-placeholder {
                height: 300px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                text-align: center;
            }

            .map-placeholder i {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .map-placeholder h4 {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
            }

            .map-placeholder .btn {
                margin-top: 1rem;
                background: rgba(255, 255, 255, 0.2);
                border-color: rgba(255, 255, 255, 0.3);
            }

            .map-placeholder .btn:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        `;

        document.head.appendChild(mapStyles);
    }
}

// Social Share Links
function initSocialShare() {
    const shareContainer = document.createElement('div');
    shareContainer.className = 'contact-share';
    shareContainer.innerHTML = `
        <h4>Connect With Me</h4>
        <div class="share-links">
            <a href="#" class="share-link" data-platform="twitter">
                <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="share-link" data-platform="linkedin">
                <i class="fab fa-linkedin"></i>
            </a>
            <a href="#" class="share-link" data-platform="github">
                <i class="fab fa-github"></i>
            </a>
            <a href="#" class="share-link" data-platform="instagram">
                <i class="fab fa-instagram"></i>
            </a>
        </div>
    `;

    // Add share styles
    const shareStyles = document.createElement('style');
    shareStyles.textContent = `
        .contact-share {
            text-align: center;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid var(--border-color);
        }

        .contact-share h4 {
            margin-bottom: 1rem;
            color: var(--text-dark);
        }

        .share-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
        }

        .share-link {
            width: 45px;
            height: 45px;
            background: var(--bg-white);
            border: 2px solid var(--border-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--text-light);
            transition: all 0.3s ease-out;
        }

        .share-link:hover {
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: white;
            transform: translateY(-3px);
        }
    `;

    document.head.appendChild(shareStyles);

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.appendChild(shareContainer);
    }

    // Add click handlers for share links
    shareContainer.addEventListener('click', function(e) {
        const link = e.target.closest('.share-link');
        if (link) {
            e.preventDefault();
            const platform = link.dataset.platform;
            openSocialLink(platform);
        }
    });
}

function openSocialLink(platform) {
    const urls = {
        twitter: 'https://twitter.com/yourusername',
        linkedin: 'https://linkedin.com/in/yourusername',
        github: 'https://github.com/yourusername',
        instagram: 'https://instagram.com/yourusername'
    };

    if (urls[platform]) {
        window.open(urls[platform], '_blank');
    }
}

// Analytics and Tracking
function trackFormSubmission() {
    // Track form submission events
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            event_category: 'contact',
            event_label: 'contact_form'
        });
    }

    // Local storage for tracking
    const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    submissions.push({
        timestamp: new Date().toISOString(),
        type: 'contact_form'
    });
    localStorage.setItem('contact_submissions', JSON.stringify(submissions));
}

// Form Auto-save (Optional)
function initFormAutoSave() {
    const form = document.getElementById('contactForm');
    const formFields = ['name', 'email', 'subject', 'message'];

    // Load saved data
    loadSavedFormData();

    // Auto-save on input
    formFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('input', debounce(() => {
                saveFormData();
            }, 1000));
        }
    });

    function saveFormData() {
        const formData = {};
        formFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field && field.value.trim()) {
                formData[fieldName] = field.value;
            }
        });

        localStorage.setItem('contact_form_draft', JSON.stringify(formData));
    }

    function loadSavedFormData() {
        const savedData = localStorage.getItem('contact_form_draft');
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                formFields.forEach(fieldName => {
                    const field = document.getElementById(fieldName);
                    if (field && formData[fieldName]) {
                        field.value = formData[fieldName];
                    }
                });
            } catch (e) {
                console.error('Failed to load saved form data:', e);
            }
        }
    }

    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem('contact_form_draft');
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize all contact features
document.addEventListener('DOMContentLoaded', function() {
    // Uncomment to enable features
    // initCharacterCounter();
    // initSocialShare();
    // initFormAutoSave();
});