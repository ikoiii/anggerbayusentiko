/**
 * List Manager for Tugas 6 - Multi-Level List
 * Handles interactive features and animations for hierarchical lists
 */

document.addEventListener('DOMContentLoaded', function() {
    initListManager();
});

function initListManager() {
    initCategoryInteractions();
    initScrollAnimations();
    initKeyboardNavigation();
    initListExpandCollapse();
    initSearchFilter();
    addListStyles();
}

function initCategoryInteractions() {
    // Add click animation to main categories
    const mainCategories = document.querySelectorAll('.main-category');
    mainCategories.forEach(category => {
        category.style.cursor = 'pointer';
        category.addEventListener('click', function() {
            animateCategoryClick(this);
            toggleSubList(this);
        });

        // Add hover effects
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(3px)';
            this.style.boxShadow = '2px 0 8px rgba(0,0,0,0.1)';
        });

        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Add hover effects to sub-categories
    const subCategories = document.querySelectorAll('.sub-category');
    subCategories.forEach(sub => {
        sub.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
        });

        sub.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.backgroundColor = 'transparent';
        });
    });

    // Add click tracking for analytics
    mainCategories.forEach(category => {
        category.addEventListener('click', function() {
            trackCategoryClick(this.textContent.trim());
        });
    });
}

function animateCategoryClick(element) {
    element.style.transform = 'scale(0.98)';
    element.style.transition = 'transform 0.1s ease';

    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
}

function toggleSubList(mainCategory) {
    const subList = mainCategory.nextElementSibling;
    const expandIcon = mainCategory.querySelector('.expand-icon') || createExpandIcon(mainCategory);

    if (subList && subList.tagName === 'UL' || subList && subList.tagName === 'OL') {
        const isExpanded = subList.style.display !== 'none';

        if (isExpanded) {
            collapseSubList(subList, expandIcon);
        } else {
            expandSubList(subList, expandIcon);
        }
    }
}

function createExpandIcon(category) {
    const icon = document.createElement('i');
    icon.className = 'fas fa-chevron-right expand-icon';
    icon.style.cssText = `
        margin-left: auto;
        font-size: 0.75rem;
        transition: transform 0.3s ease;
        opacity: 0.7;
    `;
    category.style.display = 'flex';
    category.style.alignItems = 'center';
    category.style.justifyContent = 'space-between';
    category.appendChild(icon);
    return icon;
}

function expandSubList(subList, icon) {
    subList.style.display = 'block';
    subList.style.animation = 'slideDown 0.3s ease-out';
    subList.style.opacity = '1';

    if (icon) {
        icon.style.transform = 'rotate(90deg)';
    }

    // Animate sub-items
    const subItems = subList.querySelectorAll('li');
    subItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            item.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 50);
    });
}

function collapseSubList(subList, icon) {
    subList.style.opacity = '0';
    subList.style.animation = 'slideUp 0.3s ease-out';

    if (icon) {
        icon.style.transform = 'rotate(0deg)';
    }

    setTimeout(() => {
        subList.style.display = 'none';
    }, 300);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateListEntry(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all list items
    const listItems = document.querySelectorAll('.computer-components li');
    listItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        observer.observe(item);
    });
}

function animateListEntry(element) {
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
}

function initKeyboardNavigation() {
    const listItems = document.querySelectorAll('.computer-components li');
    let currentIndex = -1;

    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowDown':
                event.preventDefault();
                currentIndex = Math.min(currentIndex + 1, listItems.length - 1);
                focusListItem(listItems[currentIndex]);
                break;

            case 'ArrowUp':
                event.preventDefault();
                currentIndex = Math.max(currentIndex - 1, 0);
                focusListItem(listItems[currentIndex]);
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                if (currentIndex >= 0 && listItems[currentIndex]) {
                    listItems[currentIndex].click();
                }
                break;

            case 'Home':
                event.preventDefault();
                currentIndex = 0;
                focusListItem(listItems[currentIndex]);
                break;

            case 'End':
                event.preventDefault();
                currentIndex = listItems.length - 1;
                focusListItem(listItems[currentIndex]);
                break;
        }
    });

    function focusListItem(item) {
        if (!item) return;

        // Remove previous focus
        listItems.forEach(li => li.classList.remove('keyboard-focus'));

        // Add focus to current item
        item.classList.add('keyboard-focus');
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function initSearchFilter() {
    // Create search box
    const listContainer = document.querySelector('.computer-components');
    if (!listContainer) return;

    const searchBox = document.createElement('div');
    searchBox.className = 'list-search';
    searchBox.innerHTML = `
        <i class="fas fa-search"></i>
        <input type="text" placeholder="Cari komponen..." id="listSearchInput">
    `;

    listContainer.parentNode.insertBefore(searchBox, listContainer);

    const searchInput = document.getElementById('listSearchInput');
    searchInput.addEventListener('input', function() {
        filterList(this.value.toLowerCase());
    });

    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            this.value = '';
            filterList('');
            this.blur();
        }
    });
}

function filterList(searchTerm) {
    const allItems = document.querySelectorAll('.computer-components li');
    let visibleCount = 0;

    allItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const parentList = item.parentElement;

        if (text.includes(searchTerm) || searchTerm === '') {
            item.style.display = '';
            item.style.animation = '';
            visibleCount++;

            // Show parent list if it has visible items
            if (parentList) {
                parentList.style.display = '';
            }
        } else {
            item.style.display = 'none';
        }
    });

    // Hide empty parent lists
    const parentLists = document.querySelectorAll('.computer-components ul');
    parentLists.forEach(list => {
        const visibleItems = list.querySelectorAll('li:not([style*="display: none"])');
        if (visibleItems.length === 0) {
            list.style.display = 'none';
        } else {
            list.style.display = '';
        }
    });

    // Show no results message
    showNoResultsMessage(visibleCount === 0 && searchTerm !== '');
}

function showNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results-message');

    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.innerHTML = `
            <i class="fas fa-search"></i>
            <p>Tidak ada komponen yang ditemukan</p>
        `;
        document.querySelector('.computer-components').appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
        noResultsMsg.remove();
    }
}

function addListStyles() {
    if (document.getElementById('list-manager-styles')) return;

    const styles = `
        <style id="list-manager-styles">
            .list-search {
                margin-bottom: 1.5rem;
                position: relative;
                max-width: 400px;
            }

            .list-search i {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #6c757d;
            }

            .list-search input {
                width: 100%;
                padding: 0.75rem 1rem 0.75rem 2.5rem;
                border: 2px solid #e9ecef;
                border-radius: 0.5rem;
                font-size: 1rem;
                transition: all 0.3s ease;
            }

            .list-search input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .no-results-message {
                text-align: center;
                padding: 2rem;
                color: #6c757d;
            }

            .no-results-message i {
                font-size: 2rem;
                margin-bottom: 1rem;
                display: block;
            }

            .keyboard-focus {
                background-color: rgba(102, 126, 234, 0.1) !important;
                border-left: 3px solid #667eea;
                outline: none;
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    max-height: 0;
                }
                to {
                    opacity: 1;
                    max-height: 1000px;
                }
            }

            @keyframes slideUp {
                from {
                    opacity: 1;
                    max-height: 1000px;
                }
                to {
                    opacity: 0;
                    max-height: 0;
                }
            }

            /* Print-friendly styles */
            @media print {
                .list-search,
                .expand-icon {
                    display: none !important;
                }

                .computer-components ul {
                    display: block !important;
                }
            }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', styles);
}

function trackCategoryClick(categoryName) {
    // Simple analytics tracking
    const clicks = JSON.parse(localStorage.getItem('category_clicks') || '{}');
    clicks[categoryName] = (clicks[categoryName] || 0) + 1;
    localStorage.setItem('category_clicks', JSON.stringify(clicks));

    console.log(`Category "${categoryName}" clicked ${clicks[categoryName]} times`);
}

// Export functions for global access
window.toggleSubList = toggleSubList;
window.filterList = filterList;