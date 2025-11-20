/**
 * IFRAME Controller for Tugas 10 - IFRAME Implementation
 * Manages iframe interactions, loading states, and controls
 */

document.addEventListener('DOMContentLoaded', function() {
    initIframeController();
});

function initIframeController() {
    const iframe = document.getElementById('mainIframe');
    if (!iframe) {
        console.log('IFrame element not found');
        return;
    }

    let iframeVisible = true;
    let isLoading = false;
    let currentUrl = iframe.src;

    // Add loading indicator
    createLoadingIndicator(iframe);

    // Add custom controls
    enhanceIframeControls();

    // Track iframe events
    setupIframeEventListeners(iframe);

    // Add keyboard shortcuts
    setupKeyboardShortcuts();

    // Add responsive handling
    setupResponsiveBehavior();

    // Make functions globally accessible
    window.reloadIframe = () => reloadIframe(iframe);
    window.toggleIframe = () => toggleIframe(iframe);
    window.goFullscreen = () => goFullscreen(iframe);
    window.changeIframeSource = (url) => changeIframeSource(iframe, url);
}

function createLoadingIndicator(iframe) {
    const wrapper = iframe.parentElement;
    wrapper.style.position = 'relative';

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'iframe-loading';
    loadingIndicator.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Memuat konten...</p>
    `;

    // Add loading styles
    const styles = `
        <style id="iframe-loader-styles">
            .iframe-loading {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.9);
                z-index: 10;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .iframe-loading.active {
                opacity: 1;
                visibility: visible;
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .iframe-status {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                font-size: 0.875rem;
                z-index: 5;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .iframe-status.visible {
                opacity: 1;
            }

            .iframe-controls {
                display: flex;
                gap: 0.5rem;
                margin-top: 1rem;
                flex-wrap: wrap;
            }

            .url-input {
                flex: 1;
                min-width: 200px;
                padding: 0.5rem;
                border: 2px solid #e9ecef;
                border-radius: 0.25rem;
                font-size: 0.875rem;
            }

            .url-input:focus {
                outline: none;
                border-color: #667eea;
            }
        </style>
    `;

    if (!document.getElementById('iframe-loader-styles')) {
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    wrapper.appendChild(loadingIndicator);

    // Show loading on iframe events
    iframe.addEventListener('load', () => hideLoading(loadingIndicator));
    iframe.addEventListener('beforeunload', () => showLoading(loadingIndicator));
}

function enhanceIframeControls() {
    const existingControls = document.querySelector('.iframe-controls');
    if (!existingControls) return;

    // Add URL input
    const urlContainer = document.createElement('div');
    urlContainer.className = 'url-container';
    urlContainer.style.cssText = 'margin-bottom: 1rem;';
    urlContainer.innerHTML = `
        <div style="display: flex; gap: 0.5rem;">
            <input type="url" class="url-input" placeholder="Masukkan URL..." id="customUrl">
            <button class="control-btn" onclick="changeIframeSource(document.getElementById('customUrl').value)">
                <i class="fas fa-external-link-alt"></i> Buka
            </button>
        </div>
    `;

    existingControls.parentNode.insertBefore(urlContainer, existingControls);

    // Add screenshot functionality
    const screenshotBtn = document.createElement('button');
    screenshotBtn.className = 'control-btn';
    screenshotBtn.innerHTML = '<i class="fas fa-camera"></i> Screenshot';
    screenshotBtn.onclick = takeScreenshot;
    existingControls.appendChild(screenshotBtn);

    // Add print functionality
    const printBtn = document.createElement('button');
    printBtn.className = 'control-btn';
    printBtn.innerHTML = '<i class="fas fa-print"></i> Print';
    printBtn.onclick = printIframe;
    existingControls.appendChild(printBtn);
}

function setupIframeEventListeners(iframe) {
    const loadingIndicator = document.querySelector('.iframe-loading');
    const statusIndicator = createStatusIndicator();

    // Loading states
    iframe.addEventListener('load', () => {
        hideLoading(loadingIndicator);
        showStatus('Halaman dimuat', 'success');
        updateIframeInfo(iframe);
    });

    iframe.addEventListener('error', () => {
        hideLoading(loadingIndicator);
        showStatus('Error memuat halaman', 'error');
    });

    // Security checks
    iframe.addEventListener('load', () => {
        try {
            // Try to access iframe content (will throw error if cross-origin)
            const iframeContent = iframe.contentWindow || iframe.contentDocument;
            if (iframeContent) {
                showStatus('Konten dapat diakses', 'success');
            }
        } catch (e) {
            showStatus('Konten eksternal (cross-origin)', 'info');
        }
    });
}

function createStatusIndicator() {
    const status = document.createElement('div');
    status.className = 'iframe-status';
    document.body.appendChild(status);
    return status;
}

function showStatus(message, type = 'info') {
    const statusIndicator = document.querySelector('.iframe-status');
    if (!statusIndicator) return;

    statusIndicator.textContent = message;
    statusIndicator.className = `iframe-status visible ${type}`;

    setTimeout(() => {
        statusIndicator.classList.remove('visible');
    }, 3000);
}

function updateIframeInfo(iframe) {
    const info = {
        url: iframe.src,
        title: iframe.contentDocument?.title || 'Unknown',
        domain: new URL(iframe.src).hostname
    };

    console.log('Iframe Info:', info);
    localStorage.setItem('iframe_info', JSON.stringify(info));
}

function showLoading(loadingIndicator) {
    if (loadingIndicator) {
        loadingIndicator.classList.add('active');
    }
}

function hideLoading(loadingIndicator) {
    if (loadingIndicator) {
        loadingIndicator.classList.remove('active');
    }
}

function reloadIframe(iframe) {
    const btn = event.target.closest('.control-btn');
    const originalHTML = btn.innerHTML;

    // Show loading state
    showLoading(document.querySelector('.iframe-loading'));

    // Add visual feedback
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    btn.disabled = true;

    // Force reload
    const currentSrc = iframe.src;
    iframe.src = 'about:blank';
    setTimeout(() => {
        iframe.src = currentSrc;
    }, 100);

    // Restore button after delay
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Reloaded!';
        btn.style.backgroundColor = '#28a745';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.backgroundColor = '';
            btn.disabled = false;
        }, 1000);
    }, 2000);
}

function toggleIframe(iframe) {
    const wrapper = document.querySelector('.iframe-wrapper');
    const btn = event.target.closest('.control-btn');
    const originalHTML = btn.innerHTML;

    if (iframeVisible) {
        // Hide iframe
        iframe.style.display = 'none';
        btn.innerHTML = '<i class="fas fa-eye"></i> Show';

        wrapper.style.minHeight = '200px';
        wrapper.style.background = 'var(--bg-light)';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';
        wrapper.innerHTML = `
            <div style="text-align: center; color: var(--text-light);">
                <i class="fas fa-eye-slash" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>IFRAME disembunyikan</p>
                <button class="control-btn" onclick="toggleIframe(document.getElementById('mainIframe'))" style="margin-top: 1rem;">
                    <i class="fas fa-eye"></i> Tampilkan Kembali
                </button>
            </div>
        `;

        showStatus('IFRAME disembunyikan', 'info');
    } else {
        // Show iframe again
        location.reload();
    }

    iframeVisible = !iframeVisible;
}

function goFullscreen(iframe) {
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
    } else {
        // Fallback: open in new tab
        window.open(iframe.src, '_blank');
        showStatus('Membuka di tab baru', 'info');
    }
}

function changeIframeSource(iframe, url) {
    if (!url) {
        showStatus('URL tidak valid', 'error');
        return;
    }

    // Validate URL
    try {
        const urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            throw new Error('Invalid protocol');
        }
    } catch (e) {
        showStatus('URL tidak valid', 'error');
        return;
    }

    const loadingIndicator = document.querySelector('.iframe-loading');
    showLoading(loadingIndicator);

    // Update iframe source
    iframe.src = url;
    showStatus(`Memuat: ${url}`, 'info');

    // Store in history
    const history = JSON.parse(localStorage.getItem('iframe_history') || '[]');
    history.unshift({ url, timestamp: Date.now() });
    if (history.length > 10) history.pop(); // Keep only last 10
    localStorage.setItem('iframe_history', JSON.stringify(history));
}

function takeScreenshot() {
    showStatus('Fitur screenshot tidak tersedia di browser', 'warning');
    // In a real implementation, you could use html2canvas or similar library
}

function printIframe() {
    const iframe = document.getElementById('mainIframe');
    try {
        iframe.contentWindow.print();
        showStatus('Dialog print dibuka', 'success');
    } catch (e) {
        showStatus('Tidak dapat mencetak konten eksternal', 'error');
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Only when not in input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        const iframe = document.getElementById('mainIframe');

        switch(event.key) {
            case 'F5':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    reloadIframe(iframe);
                }
                break;
            case 'F11':
                event.preventDefault();
                goFullscreen(iframe);
                break;
            case 'Escape':
                toggleIframe(iframe);
                break;
        }
    });
}

function setupResponsiveBehavior() {
    const iframe = document.getElementById('mainIframe');

    function adjustIframeSize() {
        const wrapper = document.querySelector('.iframe-wrapper');
        const maxWidth = wrapper.clientWidth;

        if (window.innerWidth < 768) {
            iframe.style.width = '100%';
            iframe.style.height = '300px';
        } else if (window.innerWidth < 1024) {
            iframe.style.width = '100%';
            iframe.style.height = '500px';
        } else {
            iframe.style.width = '100%';
            iframe.style.height = '600px';
        }
    }

    // Adjust on load and resize
    adjustIframeSize();
    window.addEventListener('resize', adjustIframeSize);

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(adjustIframeSize, 100);
    });
}

// Error handling for iframe loading
window.addEventListener('message', function(event) {
    // Handle messages from iframe if needed
    if (event.data.type === 'iframeError') {
        showStatus(`Error: ${event.data.message}`, 'error');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    const iframe = document.getElementById('mainIframe');
    if (iframe) {
        iframe.src = 'about:blank';
    }
});