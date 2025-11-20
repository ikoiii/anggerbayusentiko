/**
 * Modal functionality for Tugas 7 - Wisata Indonesia
 * Handles image modal display
 */

document.addEventListener('DOMContentLoaded', function() {
    initModal();
});

function initModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('imageModal')) {
        createModal();
    }

    // Add click listeners to gallery images
    const galleryImages = document.querySelectorAll('.gallery-image img');
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function() {
            openModal(this.src);
        });
    });
}

function createModal() {
    const modalHTML = `
        <div id="imageModal" class="image-modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img id="modalImage" src="" alt="Destination Image">
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add modal styles
    const modalStyles = `
        <style id="modal-styles">
            .image-modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.9);
                align-items: center;
                justify-content: center;
            }

            .modal-content {
                position: relative;
                max-width: 90%;
                max-height: 90%;
            }

            .modal-content img {
                width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(255,255,255,0.3);
            }

            .close-modal {
                position: absolute;
                top: 15px;
                right: 35px;
                color: #f1f1f1;
                font-size: 40px;
                font-weight: bold;
                cursor: pointer;
                transition: 0.3s;
            }

            .close-modal:hover {
                color: #bbb;
                transform: scale(1.1);
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', modalStyles);

    // Add close functionality
    const closeBtn = document.querySelector('.close-modal');
    const modal = document.getElementById('imageModal');

    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');

    modalImg.src = imageSrc;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    // Add fade-in effect
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.opacity = '0';

    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scroll
    }, 300);
}

// Make functions globally accessible
window.openModal = openModal;
window.closeModal = closeModal;