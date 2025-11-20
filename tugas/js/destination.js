/**
 * Destination switching functionality for Tugas 7 - Wisata Indonesia
 * Handles dynamic content switching for different destinations
 */

document.addEventListener('DOMContentLoaded', function() {
    initDestinationSwitcher();
});

function initDestinationSwitcher() {
    const destinations = document.querySelectorAll('.destinations-list li');
    const destHeader = document.querySelector('.destination-header h2');
    const destImage = document.querySelector('.destination-image');
    const destDescription = document.querySelector('.destination-description');

    // Check if required elements exist
    if (!destinations.length || !destHeader || !destImage || !destDescription) {
        console.log('Destination switcher elements not found');
        return;
    }

    console.log('Destination switcher initialized with', destinations.length, 'destinations');

    // Destination data from local assets
    const destinationData = {
        'bali': {
            title: '<i class="fas fa-umbrella-beach"></i> Wisata Bali',
            image: '../assets/images/bali.jpg',
            description: 'Bali merupakan salah satu pulau paling terkenal di dunia karena keindahan alam, budaya, dan keramahan penduduknya. Dikenal sebagai Pulau Dewata, Bali menawarkan berbagai destinasi menarik seperti Pantai Kuta, Ubud, Tanah Lot, dan Nusa Penida. Pengunjung dapat menikmati seni tari, kuliner khas, serta pemandangan matahari terbenam yang menakjubkan.'
        },
        'yogya': {
            title: '<i class="fas fa-monument"></i> Wisata Yogyakarta',
            image: '../assets/images/jogja.jpg',
            description: 'Yogyakarta adalah kota budaya dan pendidikan yang kaya akan warisan sejarah. Terkenal dengan Keraton Yogyakarta, Candi Borobudur, dan Candi Prambanan. Kota ini juga menjadi pusat seni tradisional seperti batik, wayang kulit, dan seni tari klasik Jawa.'
        },
        'lombok': {
            title: '<i class="fas fa-mountain"></i> Wisata Lombok',
            image: '../assets/images/lombok.jpg',
            description: 'Lombok adalah pulau yang menakjubkan dengan pantai-pantai eksotis, Gunung Rinjani yang megah, dan Gili Islands yang mempesona. Pulau ini menawarkan kombinasi sempurna antara petualangan alam, wisata bahari, dan budaya Sasak yang autentik.'
        },
        'rajaampat': {
            title: '<i class="fas fa-water"></i> Wisata Raja Ampat',
            image: '../assets/images/rajaampat.jpg',
            description: 'Raja Ampat adalah surga bagi pecinta diving dengan keanekaragaman hayati laut terkaya di dunia. Kepulauan ini menawarkan pantai-pantai berpasir putih, karang yang spektakuler, dan pemandangan yang menakjubkan. Surga tersembunyi di ujung timur Indonesia.'
        },
        'danautoba': {
            title: '<i class="fas fa-ship"></i> Wisata Danau Toba',
            image: '../assets/images/danautoba.jpg',
            description: 'Danau Toba adalah danau vulkanik terbesar di dunia dengan pulau Samosir di tengahnya. Terletak di Sumatera Utara, destinasi ini menawarkan pemandangan alam yang spektakuler, budaya Batak yang kaya, dan kenyamanan yang sempurna untuk liburan.'
        }
    };

    // Set first destination as active by default
    if (destinations.length > 0) {
        destinations[0].classList.add('active');
        const firstDest = destinations[0].dataset.destination;
        if (firstDest && destinationData[firstDest]) {
            updateDestination(firstDest, destinationData[firstDest]);
        }
    }

    // Add click listeners to destination items
    destinations.forEach(dest => {
        dest.addEventListener('click', function(event) {
            event.preventDefault();

            // Get destination key from onclick attribute if it exists
            const onclickAttr = this.getAttribute('onclick');
            let destKey = '';

            if (onclickAttr) {
                // Extract key from onclick="switchDestination('key')"
                const match = onclickAttr.match(/switchDestination\('([^']+)'\)/);
                if (match) {
                    destKey = match[1];
                }
            }

            // Fallback: use data-destination or text content
            if (!destKey) {
                destKey = this.dataset.destination ||
                         this.textContent.toLowerCase()
                               .replace(/\s+/g, '')
                               .replace('yogyakarta', 'yogja') // Normalize Yogyakarta to yogja
                               .replace('danau', ''); // Remove 'danau' from danautoba
            }

            // Map alternative keys to main keys
            const keyMapping = {
                'yogyakarta': 'yogya',
                'yogja': 'yogya',
                'rajaampat': 'rajaampat',
                'lombok': 'lombok',
                'bali': 'bali',
                'toba': 'danautoba',
                'danautoba': 'danautoba'
            };

            const normalizedKey = keyMapping[destKey] || destKey;

            // Remove active class from all
            destinations.forEach(d => d.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');

            // Update content if data exists
            if (destinationData[normalizedKey]) {
                console.log('Switching to destination:', normalizedKey, destinationData[normalizedKey]);
                updateDestination(normalizedKey, destinationData[normalizedKey]);
            } else {
                console.error('Destination data not found for key:', normalizedKey);
                console.log('Available keys:', Object.keys(destinationData));
            }
        });
    });

    function updateDestination(destKey, data) {
        // Add fade-out effect
        const currentElements = [destHeader, destImage, destDescription];
        currentElements.forEach(el => {
            el.style.transition = 'opacity 0.3s ease-out';
            el.style.opacity = '0';
        });

        // Update content after fade-out
        setTimeout(() => {
            destHeader.innerHTML = data.title;
            destImage.src = data.image;
            destImage.alt = `Gambar ${data.title.replace(/<[^>]*>/g, '')}`;
            destDescription.textContent = data.description;

            // Fade-in new content
            currentElements.forEach(el => {
                el.style.opacity = '1';
            });
        }, 300);
    }

    // Add keyboard navigation
    document.addEventListener('keydown', function(event) {
        const activeDest = document.querySelector('.destinations-list li.active');
        if (!activeDest) return;

        const destArray = Array.from(destinations);
        const currentIndex = destArray.indexOf(activeDest);
        let newIndex;

        switch(event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : destinations.length - 1;
                destArray[newIndex].click();
                break;
            case 'ArrowRight':
                event.preventDefault();
                newIndex = currentIndex < destinations.length - 1 ? currentIndex + 1 : 0;
                destArray[newIndex].click();
                break;
        }
    });

    // Add auto-switch functionality (optional)
    let autoSwitchInterval;
    function startAutoSwitch() {
        autoSwitchInterval = setInterval(() => {
            const activeDest = document.querySelector('.destinations-list li.active');
            const destArray = Array.from(destinations);
            const currentIndex = destArray.indexOf(activeDest);
            const nextIndex = currentIndex < destinations.length - 1 ? currentIndex + 1 : 0;
            destArray[nextIndex].click();
        }, 5000);
    }

    function stopAutoSwitch() {
        if (autoSwitchInterval) {
            clearInterval(autoSwitchInterval);
        }
    }

    // Pause auto-switch on hover
    const destContainer = document.querySelector('.destinations-container');
    if (destContainer) {
        destContainer.addEventListener('mouseenter', stopAutoSwitch);
        destContainer.addEventListener('mouseleave', startAutoSwitch);
        // Start auto-switch initially
        // startAutoSwitch(); // Uncomment to enable auto-switching
    }
}

// Make function globally accessible for inline onclick handlers
window.switchDestination = function(dest) {
    const destinations = document.querySelectorAll('.destinations-list li');

    // Find the destination element with matching onclick attribute or text
    const targetDest = Array.from(destinations).find(d => {
        const onclickAttr = d.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/switchDestination\('([^']+)'\)/);
            return match && match[1] === dest;
        }
        return false;
    });

    if (targetDest) {
        targetDest.click();
    } else {
        // Fallback: try to find by text content
        const fallbackDest = Array.from(destinations).find(d =>
            d.textContent.toLowerCase().includes(dest.toLowerCase())
        );
        if (fallbackDest) {
            fallbackDest.click();
        } else {
            console.error('Destination not found:', dest);
        }
    }
};