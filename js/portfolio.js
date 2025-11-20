// Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFilter();
    initPortfolioModal();
    initPortfolioAnimations();
    initPortfolioHoverEffects();
});

// Portfolio Filter Functionality
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    // Show item with animation
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease-out';

                    // Stagger animation for better visual effect
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    // Hide item with animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Portfolio Modal/Lightbox
function initPortfolioModal() {
    const modal = createPortfolioModal();
    const portfolioLinks = document.querySelectorAll('.portfolio-link');
    let currentModal = null;

    portfolioLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const portfolioItem = this.closest('.portfolio-item');
            const img = portfolioItem.querySelector('img');
            const title = portfolioItem.querySelector('.portfolio-overlay h3').textContent;
            const description = portfolioItem.querySelector('.portfolio-overlay p').textContent;

            openPortfolioModal(img.src, title, description);
        });
    });

    function createPortfolioModal() {
        const modal = document.createElement('div');
        modal.className = 'portfolio-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <div class="modal-body">
                        <img src="" alt="" class="modal-image">
                        <div class="modal-info">
                            <h3 class="modal-title"></h3>
                            <p class="modal-description"></p>
                            <div class="modal-details">
                                <h4>Project Details</h4>
                                <div class="modal-tech-stack"></div>
                                <div class="modal-links">
                                    <a href="#" class="btn btn-primary modal-demo" target="_blank">
                                        <i class="fas fa-external-link-alt"></i> Live Demo
                                    </a>
                                    <a href="#" class="btn btn-secondary modal-github" target="_blank">
                                        <i class="fab fa-github"></i> View Code
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .portfolio-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease-out;
            }

            .portfolio-modal.active {
                opacity: 1;
                visibility: visible;
            }

            .modal-overlay {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }

            .modal-content {
                background: var(--bg-white);
                border-radius: 1rem;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                transform: scale(0.8);
                transition: transform 0.3s ease-out;
            }

            .portfolio-modal.active .modal-content {
                transform: scale(1);
            }

            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: var(--text-light);
                z-index: 1;
                transition: color 0.3s ease-out;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }

            .modal-close:hover {
                color: var(--text-dark);
                background: var(--border-color);
            }

            .modal-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }

            .modal-image {
                width: 100%;
                height: auto;
                border-radius: 0.5rem;
                object-fit: cover;
            }

            .modal-info {
                padding: 2rem;
            }

            .modal-title {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                color: var(--text-dark);
            }

            .modal-description {
                color: var(--text-light);
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }

            .modal-details h4 {
                font-size: 1.1rem;
                margin-bottom: 1rem;
                color: var(--text-dark);
            }

            .modal-tech-stack {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
            }

            .tech-tag {
                background: var(--primary-color);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 1rem;
                font-size: 0.875rem;
                font-weight: 500;
            }

            .modal-links {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }

            @media (max-width: 768px) {
                .modal-body {
                    grid-template-columns: 1fr;
                }

                .modal-content {
                    margin: 1rem;
                }

                .modal-info {
                    padding: 1rem;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Modal close functionality
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        return modal;
    }

    function openPortfolioModal(imageSrc, title, description) {
        const modal = document.querySelector('.portfolio-modal');
        const modalImage = modal.querySelector('.modal-image');
        const modalTitle = modal.querySelector('.modal-title');
        const modalDescription = modal.querySelector('.modal-description');

        // Project details (you can customize this)
        const projectDetails = getProjectDetails(title);

        modalImage.src = imageSrc;
        modalImage.alt = title;
        modalTitle.textContent = title;
        modalDescription.textContent = description;

        // Add tech stack
        const techStack = modal.querySelector('.modal-tech-stack');
        techStack.innerHTML = '';
        projectDetails.techStack.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'tech-tag';
            tag.textContent = tech;
            techStack.appendChild(tag);
        });

        // Add project links
        const demoLink = modal.querySelector('.modal-demo');
        const githubLink = modal.querySelector('.modal-github');

        demoLink.href = projectDetails.demoLink;
        githubLink.href = projectDetails.githubLink;

        // Disable links if not available
        if (!projectDetails.demoLink) {
            demoLink.style.display = 'none';
        }
        if (!projectDetails.githubLink) {
            githubLink.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function getProjectDetails(title) {
        const projects = {
            'Project Title 1': {
                techStack: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
                demoLink: '#',
                githubLink: 'https://github.com'
            },
            'Project Title 2': {
                techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
                demoLink: '#',
                githubLink: 'https://github.com'
            },
            'Project Title 3': {
                techStack: ['Figma', 'Adobe XD', 'UI/UX Design'],
                demoLink: '#',
                githubLink: '#'
            },
            'Project Title 4': {
                techStack: ['Vue.js', 'Firebase', 'CSS3'],
                demoLink: '#',
                githubLink: 'https://github.com'
            }
        };

        return projects[title] || {
            techStack: ['HTML', 'CSS', 'JavaScript'],
            demoLink: '#',
            githubLink: 'https://github.com'
        };
    }
}

// Portfolio Animations
function initPortfolioAnimations() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    portfolioItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        observer.observe(item);
    });
}

// Portfolio Hover Effects
function initPortfolioHoverEffects() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        const img = item.querySelector('img');
        const overlay = item.querySelector('.portfolio-overlay');
        const links = item.querySelectorAll('.portfolio-link');

        // Image zoom effect
        item.addEventListener('mouseenter', function() {
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
            if (overlay) {
                overlay.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95))';
            }
        });

        item.addEventListener('mouseleave', function() {
            if (img) {
                img.style.transform = 'scale(1)';
            }
            if (overlay) {
                overlay.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))';
            }
        });

        // Link hover effects
        links.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.1)';
            });

            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    });
}

// Portfolio Search Functionality (Optional)
function initPortfolioSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search projects...';
    searchInput.className = 'portfolio-search';

    const portfolioSection = document.querySelector('.portfolio');
    const portfolioContainer = portfolioSection.querySelector('.container');

    // Add search styles
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        .portfolio-search {
            width: 100%;
            max-width: 400px;
            margin: 0 auto 2rem;
            padding: 0.75rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: border-color 0.3s ease-out;
        }

        .portfolio-search:focus {
            outline: none;
            border-color: var(--primary-color);
        }
    `;
    document.head.appendChild(searchStyles);

    // Insert search input before filter buttons
    const filterContainer = portfolioSection.querySelector('.portfolio-filter');
    filterContainer.parentNode.insertBefore(searchInput, filterContainer);

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        portfolioItems.forEach(item => {
            const title = item.querySelector('.portfolio-overlay h3').textContent.toLowerCase();
            const description = item.querySelector('.portfolio-overlay p').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Portfolio Statistics (Optional)
function updatePortfolioStats() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const totalProjects = portfolioItems.length;

    // Create stats container
    const statsContainer = document.createElement('div');
    statsContainer.className = 'portfolio-stats';
    statsContainer.innerHTML = `
        <div class="stat-item">
            <span class="stat-number">${totalProjects}</span>
            <span class="stat-label">Projects</span>
        </div>
    `;

    // Add styles for stats
    const statsStyles = document.createElement('style');
    statsStyles.textContent = `
        .portfolio-stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .stat-item {
            text-align: center;
            padding: 1rem 2rem;
            background: var(--bg-white);
            border-radius: 0.5rem;
            box-shadow: 0 5px 15px var(--shadow-light);
        }

        .stat-number {
            display: block;
            font-size: 2rem;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 0.25rem;
        }

        .stat-label {
            color: var(--text-light);
            font-weight: 500;
        }
    `;
    document.head.appendChild(statsStyles);

    // Insert stats before portfolio grid
    const portfolioGrid = document.querySelector('.portfolio-grid');
    portfolioGrid.parentNode.insertBefore(statsContainer, portfolioGrid);
}

// Portfolio Lazy Loading
function initPortfolioLazyLoading() {
    const images = document.querySelectorAll('.portfolio-img img');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.animation = 'fadeInUp 0.5s ease-out';
        });

        imageObserver.observe(img);
    });
}

// Initialize all portfolio features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Uncomment to enable search functionality
    // initPortfolioSearch();

    // Uncomment to enable statistics
    // updatePortfolioStats();

    // Initialize lazy loading
    initPortfolioLazyLoading();
});

// Portfolio keyboard navigation
document.addEventListener('keydown', function(e) {
    const modal = document.querySelector('.portfolio-modal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'ArrowLeft') {
        // Navigate to previous project
        navigatePortfolio('prev');
    } else if (e.key === 'ArrowRight') {
        // Navigate to next project
        navigatePortfolio('next');
    }
});

function navigatePortfolio(direction) {
    const portfolioItems = Array.from(document.querySelectorAll('.portfolio-item'));
    const modal = document.querySelector('.portfolio-modal');

    if (!modal || !modal.classList.contains('active')) return;

    const currentImg = modal.querySelector('.modal-image');
    const currentIndex = portfolioItems.findIndex(item =>
        item.querySelector('img').src === currentImg.src
    );

    let newIndex;
    if (direction === 'prev') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : portfolioItems.length - 1;
    } else {
        newIndex = currentIndex < portfolioItems.length - 1 ? currentIndex + 1 : 0;
    }

    const newItem = portfolioItems[newIndex];
    const img = newItem.querySelector('img');
    const title = newItem.querySelector('.portfolio-overlay h3').textContent;
    const description = newItem.querySelector('.portfolio-overlay p').textContent;

    // Update modal with new content
    currentImg.style.animation = 'fadeOut 0.3s ease-out';

    setTimeout(() => {
        currentImg.src = img.src;
        currentImg.alt = title;
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-description').textContent = description;
        currentImg.style.animation = 'fadeInUp 0.3s ease-out';
    }, 300);
}