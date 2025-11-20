/**
 * Form Validation for Tugas 8 - Registration Form
 * Handles real-time validation and submission
 */

document.addEventListener('DOMContentLoaded', function() {
    initFormValidator();
});

function initFormValidator() {
    const form = document.getElementById('registrationForm');
    if (!form) {
        console.log('Registration form not found');
        return;
    }

    // Add validation styles
    addFormStyles();

    // Add real-time validation listeners
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => validateField(input));

        // Clear error on focus
        input.addEventListener('focus', () => clearFieldError(input));

        // Real-time validation for better UX
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', handleFormSubmit);

    // Add password confirmation validation
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    if (passwordInputs.length >= 2) {
        passwordInputs[1].addEventListener('input', () => {
            validatePasswordMatch(passwordInputs[0], passwordInputs[1]);
        });
    }
}

function addFormStyles() {
    if (document.getElementById('form-validator-styles')) return;

    const styles = `
        <style id="form-validator-styles">
            .form-group.error input,
            .form-group.error select,
            .form-group.error textarea {
                border-color: #e74c3c;
                box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
            }

            .form-group.success input,
            .form-group.success select,
            .form-group.success textarea {
                border-color: #27ae60;
                box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.1);
            }

            .error-message {
                color: #e74c3c;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                animation: slideDown 0.3s ease-out;
            }

            .error-message i {
                margin-right: 0.5rem;
            }

            .success-message {
                background-color: #d4edda;
                color: #155724;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                border: 1px solid #c3e6cb;
                display: flex;
                align-items: center;
            }

            .success-message i {
                margin-right: 0.5rem;
                font-size: 1.25rem;
            }

            .field-hint {
                font-size: 0.875rem;
                color: #6c757d;
                margin-top: 0.25rem;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .submit-btn.loading {
                position: relative;
                pointer-events: none;
                opacity: 0.7;
            }

            .submit-btn.loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 1rem;
                height: 1rem;
                margin: -0.5rem 0 0 -0.5rem;
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spinner 0.6s linear infinite;
            }

            @keyframes spinner {
                to { transform: rotate(360deg); }
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const fieldType = field.type;
    const formGroup = field.closest('.form-group');

    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !fieldValue) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} wajib diisi`;
    }

    // Specific field validations
    switch (fieldName) {
        case 'nama':
        case 'name':
            if (fieldValue && fieldValue.length < 3) {
                isValid = false;
                errorMessage = 'Nama minimal 3 karakter';
            } else if (fieldValue && !/^[a-zA-Z\s]+$/.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Nama hanya boleh mengandung huruf dan spasi';
            }
            break;

        case 'email':
            if (fieldValue && !isValidEmail(fieldValue)) {
                isValid = false;
                errorMessage = 'Format email tidak valid';
            }
            break;

        case 'password':
            if (fieldValue && fieldValue.length < 8) {
                isValid = false;
                errorMessage = 'Password minimal 8 karakter';
            } else if (fieldValue && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Password harus mengandung huruf besar, huruf kecil, dan angka';
            }
            break;

        case 'password_confirm':
            const password = document.querySelector('input[name="password"]');
            if (password && password.value !== fieldValue) {
                isValid = false;
                errorMessage = 'Password tidak cocok';
            }
            break;

        case 'telepon':
        case 'phone':
            if (fieldValue && !/^[0-9+\-\s()]+$/.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Format nomor telepon tidak valid';
            } else if (fieldValue && fieldValue.length < 10) {
                isValid = false;
                errorMessage = 'Nomor telepon minimal 10 digit';
            }
            break;

        case 'tanggal_lahir':
        case 'birth_date':
            if (fieldValue) {
                const selectedDate = new Date(fieldValue);
                const today = new Date();
                const age = today.getFullYear() - selectedDate.getFullYear();

                if (age < 17) {
                    isValid = false;
                    errorMessage = 'Usia minimal 17 tahun';
                } else if (selectedDate > today) {
                    isValid = false;
                    errorMessage = 'Tanggal lahir tidak valid';
                }
            }
            break;
    }

    // Update UI based on validation result
    if (isValid) {
        showSuccess(formGroup);
        clearFieldError(field);
    } else {
        showError(formGroup, errorMessage);
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePasswordMatch(passwordField, confirmField) {
    const formGroup = confirmField.closest('.form-group');

    if (passwordField.value !== confirmField.value) {
        showError(formGroup, 'Password tidak cocok');
        return false;
    } else if (confirmField.value) {
        showSuccess(formGroup);
        return true;
    }

    return true;
}

function getFieldLabel(fieldName) {
    const labels = {
        'nama': 'Nama',
        'name': 'Name',
        'email': 'Email',
        'password': 'Password',
        'password_confirm': 'Konfirmasi Password',
        'telepon': 'Nomor Telepon',
        'phone': 'Phone Number',
        'alamat': 'Alamat',
        'address': 'Address',
        'tanggal_lahir': 'Tanggal Lahir',
        'birth_date': 'Birth Date'
    };
    return labels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
}

function showError(formGroup, message) {
    clearMessages(formGroup);

    formGroup.classList.remove('success');
    formGroup.classList.add('error');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;

    formGroup.appendChild(errorDiv);
}

function showSuccess(formGroup) {
    clearMessages(formGroup);

    formGroup.classList.remove('error');
    formGroup.classList.add('success');
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('error');
        clearMessages(formGroup);
    }
}

function clearMessages(formGroup) {
    const errorMessage = formGroup.querySelector('.error-message');
    const successMessage = formGroup.querySelector('.success-message');

    if (errorMessage) errorMessage.remove();
    if (successMessage) successMessage.remove();
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const inputs = form.querySelectorAll('input, select, textarea');

    // Validate all fields
    let isFormValid = true;
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        // Focus on first error field
        const firstError = form.querySelector('.form-group.error input, .form-group.error select');
        if (firstError) {
            firstError.focus();
        }
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Collect form data
    const formData = new FormData(form);
    const formDataObj = {};
    formData.forEach((value, key) => {
        formDataObj[key] = value;
    });

    try {
        // Simulate API call
        await simulateFormSubmission(formDataObj);

        // Show success message
        showSuccessMessage('Pendaftaran berhasil! Data Anda telah tersimpan.');

        // Reset form
        form.reset();
        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            formGroup.classList.remove('success', 'error');
        });

    } catch (error) {
        showErrorMessage('Terjadi kesalahan. Silakan coba lagi nanti.');
        console.error('Form submission error:', error);
    } finally {
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

async function simulateFormSubmission(data) {
    // Simulate network delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                console.log('Form data submitted:', data);
                resolve({ success: true });
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type === 'success' ? 'success-message' : 'error-message'}`;
    messageDiv.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;

    const form = document.getElementById('registrationForm');
    form.parentNode.insertBefore(messageDiv, form);

    // Auto-remove message
    setTimeout(() => {
        messageDiv.style.animation = 'slideDown 0.3s ease-out reverse';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Make functions globally accessible
window.validateField = validateField;
window.validatePasswordMatch = validatePasswordMatch;