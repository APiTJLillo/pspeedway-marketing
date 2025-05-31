/* Mobile Editor Functionality for Halverson Speedway Marketing Tool */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile-specific functionality
    initMobileUI();
    syncDesktopAndMobileControls();
    setupMobileTouchInteractions();
    setupMobileCanvasScaling();
});

/**
 * Initialize mobile UI components and event listeners
 */
function initMobileUI() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Mobile tabs functionality
    const mobileTabs = document.querySelectorAll('.mobile-tab');
    const mobileTabContents = document.querySelectorAll('.mobile-controls');
    
    mobileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab
            mobileTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            mobileTabContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            if (tabName !== 'canvas') {
                const tabContent = document.getElementById(`${tabName}-tab-content`);
                if (tabContent) {
                    tabContent.classList.remove('hidden');
                    tabContent.classList.add('slide-up');
                }
            }
        });
    });
    
    // Mobile controls toggle button
    const mobileControlsToggle = document.getElementById('mobile-controls-toggle');
    
    if (mobileControlsToggle) {
        mobileControlsToggle.addEventListener('click', function() {
            // Find the currently active tab content
            const activeTabContent = document.querySelector('.mobile-controls:not(.hidden)');
            
            if (activeTabContent) {
                activeTabContent.classList.add('hidden');
            } else {
                // If no tab is active, show the text tab by default
                const textTabContent = document.getElementById('text-tab-content');
                if (textTabContent) {
                    textTabContent.classList.remove('hidden');
                    textTabContent.classList.add('slide-up');
                    
                    // Also update the active tab
                    mobileTabs.forEach(t => t.classList.remove('active'));
                    const textTab = document.querySelector('[data-tab="text"]');
                    if (textTab) textTab.classList.add('active');
                }
            }
        });
    }
    
    // Connect mobile action buttons to their desktop counterparts
    connectMobileToDesktopButtons();
}

/**
 * Connect mobile buttons to their desktop counterparts
 */
function connectMobileToDesktopButtons() {
    // Map of mobile button IDs to desktop button IDs
    const buttonPairs = {
        'mobile-reset-button': 'reset-button',
        'mobile-preview-button': 'preview-button',
        'mobile-bold-button': 'bold-button',
        'mobile-italic-button': 'italic-button',
        'mobile-underline-button': 'underline-button'
    };
    
    // Connect each pair
    for (const [mobileId, desktopId] of Object.entries(buttonPairs)) {
        const mobileButton = document.getElementById(mobileId);
        const desktopButton = document.getElementById(desktopId);
        
        if (mobileButton && desktopButton) {
            mobileButton.addEventListener('click', function() {
                // Trigger click on the desktop button
                desktopButton.click();
                
                // Also update the mobile button state to match desktop
                if (desktopButton.classList.contains('bg-gray-400')) {
                    mobileButton.classList.add('bg-red-600');
                    mobileButton.classList.add('text-white');
                } else {
                    mobileButton.classList.remove('bg-red-600');
                    mobileButton.classList.remove('text-white');
                }
            });
        }
    }
    
    // Connect mobile color picker to desktop
    const mobileCustomColor = document.getElementById('mobile-custom-color');
    const desktopCustomColor = document.getElementById('custom-color');
    
    if (mobileCustomColor && desktopCustomColor) {
        mobileCustomColor.addEventListener('input', function() {
            desktopCustomColor.value = this.value;
            // Trigger change event on desktop color picker
            const event = new Event('input');
            desktopCustomColor.dispatchEvent(event);
        });
    }
    
    // Connect mobile font family to desktop
    const mobileFontFamily = document.getElementById('mobile-font-family');
    const desktopFontFamily = document.getElementById('font-family');
    
    if (mobileFontFamily && desktopFontFamily) {
        mobileFontFamily.addEventListener('change', function() {
            desktopFontFamily.value = this.value;
            // Trigger change event on desktop select
            const event = new Event('change');
            desktopFontFamily.dispatchEvent(event);
        });
    }
    
    // Connect mobile font size to desktop
    const mobileFontSize = document.getElementById('mobile-font-size');
    const desktopFontSize = document.getElementById('font-size');
    
    if (mobileFontSize && desktopFontSize) {
        mobileFontSize.addEventListener('input', function() {
            desktopFontSize.value = this.value;
            // Trigger input event on desktop range
            const event = new Event('input');
            desktopFontSize.dispatchEvent(event);
        });
    }
    
    // Connect mobile color buttons to desktop
    const mobileColorButtons = document.querySelectorAll('#colors-tab-content [data-color]');
    
    mobileColorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            const desktopColorButton = document.querySelector(`#desktop-controls [data-color="${color}"]`);
            
            if (desktopColorButton) {
                desktopColorButton.click();
            } else {
                // If no matching desktop button, set the color directly
                if (window.templateEditor && window.templateEditor.selectedObject) {
                    window.templateEditor.setTextColor(color);
                }
            }
        });
    });
}

/**
 * Keep desktop and mobile controls in sync
 */
function syncDesktopAndMobileControls() {
    // When text is selected on canvas, update both desktop and mobile controls
    if (window.templateEditor && window.templateEditor.canvas) {
        const originalHandleSelectionChange = window.templateEditor.handleSelectionChange;
        
        window.templateEditor.handleSelectionChange = function(e) {
            // Call the original method first
            originalHandleSelectionChange.call(window.templateEditor, e);
            
            // Then update mobile controls
            updateMobileTextControls(e.selected[0]);
        };
        
        const originalHandleSelectionCleared = window.templateEditor.handleSelectionCleared;
        
        window.templateEditor.handleSelectionCleared = function() {
            // Call the original method first
            originalHandleSelectionCleared.call(window.templateEditor);
            
            // Then update mobile controls
            clearMobileTextControls();
        };
    }
}

/**
 * Update mobile text controls when text is selected
 */
function updateMobileTextControls(textObject) {
    if (!textObject || (textObject.type !== 'text' && textObject.type !== 'i-text' && textObject.type !== 'textbox')) {
        return;
    }
    
    const mobileTextControls = document.getElementById('mobile-text-controls');
    if (!mobileTextControls) return;
    
    // Clear existing controls
    mobileTextControls.innerHTML = '';
    
    // Create text input
    const textInput = document.createElement('div');
    textInput.className = 'mb-4';
    textInput.innerHTML = `
        <label class="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
        <textarea id="mobile-text-content" class="w-full border border-gray-300 rounded p-3 touch-friendly-input" rows="4">${textObject.text}</textarea>
    `;
    mobileTextControls.appendChild(textInput);
    
    // Add event listener to text input
    document.getElementById('mobile-text-content').addEventListener('input', (e) => {
        if (window.templateEditor && window.templateEditor.selectedObject) {
            window.templateEditor.selectedObject.set('text', e.target.value);
            window.templateEditor.canvas.renderAll();
            
            // Also update desktop text input if it exists
            const desktopTextContent = document.getElementById('text-content');
            if (desktopTextContent) {
                desktopTextContent.value = e.target.value;
            }
        }
    });
    
    // Update mobile font controls to match selected text
    const mobileFontFamily = document.getElementById('mobile-font-family');
    const mobileFontSize = document.getElementById('mobile-font-size');
    const mobileBoldButton = document.getElementById('mobile-bold-button');
    const mobileItalicButton = document.getElementById('mobile-italic-button');
    const mobileUnderlineButton = document.getElementById('mobile-underline-button');
    const mobileCustomColor = document.getElementById('mobile-custom-color');
    
    if (mobileFontFamily) mobileFontFamily.value = textObject.fontFamily;
    if (mobileFontSize) mobileFontSize.value = textObject.fontSize;
    
    // Update style buttons
    if (mobileBoldButton) {
        mobileBoldButton.classList.toggle('bg-red-600', textObject.fontWeight === 'bold');
        mobileBoldButton.classList.toggle('text-white', textObject.fontWeight === 'bold');
    }
    
    if (mobileItalicButton) {
        mobileItalicButton.classList.toggle('bg-red-600', textObject.fontStyle === 'italic');
        mobileItalicButton.classList.toggle('text-white', textObject.fontStyle === 'italic');
    }
    
    if (mobileUnderlineButton) {
        mobileUnderlineButton.classList.toggle('bg-red-600', textObject.underline);
        mobileUnderlineButton.classList.toggle('text-white', textObject.underline);
    }
    
    // Update color picker
    if (mobileCustomColor) mobileCustomColor.value = textObject.fill;
    
    // Show the text tab
    const textTab = document.querySelector('[data-tab="text"]');
    if (textTab && !textTab.classList.contains('active')) {
        textTab.click();
    }
}

/**
 * Clear mobile text controls when no text is selected
 */
function clearMobileTextControls() {
    const mobileTextControls = document.getElementById('mobile-text-controls');
    if (mobileTextControls) {
        mobileTextControls.innerHTML = '<p class="text-gray-500 text-sm">Select a text element on the canvas to edit</p>';
    }
}

/**
 * Setup mobile touch interactions for the canvas
 */
function setupMobileTouchInteractions() {
    if (!window.templateEditor || !window.templateEditor.canvas) {
        // If templateEditor isn't available yet, try again in 500ms
        setTimeout(setupMobileTouchInteractions, 500);
        return;
    }
    
    const canvas = window.templateEditor.canvas;
    
    // Enable touch events on canvas
    canvas.allowTouchScrolling = true;
    
    // Detect mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Adjust selection tolerance for touch
        canvas.selectionLineWidth = 2;
        canvas.selectionColor = 'rgba(209, 32, 38, 0.3)';
        canvas.selectionBorderColor = '#D12026';
        canvas.selectionDashArray = [5, 5];
        
        // Increase corner size for easier touch manipulation
        fabric.Object.prototype.cornerSize = 20;
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = '#D12026';
        fabric.Object.prototype.cornerStrokeColor = '#ffffff';
        
        // Refresh canvas to apply changes
        canvas.renderAll();
    }
    
    // Handle pinch-zoom on mobile
    let lastDistance = 0;
    let isZooming = false;
    let zoomStartScale = 1;
    
    // Add touch event listeners to canvas container
    const canvasContainer = document.querySelector('.canvas-container');
    
    if (canvasContainer) {
        canvasContainer.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) {
                isZooming = true;
                zoomStartScale = window.templateEditor.canvasScale || 1;
                lastDistance = getDistance(e.touches[0], e.touches[1]);
                e.preventDefault();
            }
        });
        
        canvasContainer.addEventListener('touchmove', function(e) {
            if (isZooming && e.touches.length === 2) {
                const distance = getDistance(e.touches[0], e.touches[1]);
                const scale = zoomStartScale * (distance / lastDistance);
                
                // Limit scale to reasonable bounds
                const limitedScale = Math.min(Math.max(0.5, scale), 3);
                
                // Apply scale to canvas container
                canvasContainer.style.transform = `scale(${limitedScale})`;
                canvasContainer.style.transformOrigin = 'center center';
                
                e.preventDefault();
            }
        });
        
        canvasContainer.addEventListener('touchend', function(e) {
            if (isZooming) {
                isZooming = false;
                e.preventDefault();
            }
        });
    }
    
    // Helper function to calculate distance between two touch points
    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

/**
 * Setup mobile canvas scaling to ensure proper display across all screen sizes
 */
function setupMobileCanvasScaling() {
    // Add CSS to ensure proper mobile scaling
    let styleEl = document.getElementById('mobile-editor-styles');
    
    if (!styleEl) {
        // Create style element
        styleEl = document.createElement('style');
        styleEl.id = 'mobile-editor-styles';
        document.head.appendChild(styleEl);
        
        // Add responsive styles
        styleEl.textContent = `
            /* Mobile-specific editor styles */
            @media (max-width: 640px) {
                /* Ensure editor container is properly sized */
                #editor-container {
                    width: 100%;
                    padding: 0;
                    margin: 0;
                    overflow: hidden;
                }
                
                /* Ensure canvas wrapper is properly sized */
                .canvas-wrapper {
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 200px;
                }
                
                /* Ensure aspect ratio container is visible */
                .aspect-ratio-container {
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }
                
                /* Ensure canvas is visible */
                #editor-canvas {
                    visibility: visible !important;
                    opacity: 1 !important;
                    display: block !important;
                }
                
                /* Improve touch targets */
                .touch-friendly-input {
                    font-size: 16px !important;
                    min-height: 44px;
                }
                
                /* Ensure mobile tabs are properly sized */
                .mobile-tab {
                    min-height: 44px;
                    min-width: 44px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        `;
    }
    
    // Add resize event listener
    window.addEventListener('resize', handleMobileResize);
    
    // Initial resize handling
    handleMobileResize();
}

/**
 * Handle mobile resize events
 */
function handleMobileResize() {
    const isMobile = window.innerWidth <= 640;
    
    if (isMobile) {
        // Force canvas visibility
        const canvas = document.getElementById('editor-canvas');
        if (canvas) {
            canvas.style.visibility = 'visible';
            canvas.style.opacity = '1';
            canvas.style.display = 'block';
        }
        
        // Force aspect ratio container visibility
        const aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (aspectRatioContainer) {
            aspectRatioContainer.style.visibility = 'visible';
            aspectRatioContainer.style.opacity = '1';
            aspectRatioContainer.style.display = 'flex';
        }
        
        // Ensure canvas container is properly sized
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.width = '100%';
            canvasContainer.style.height = '100%';
            canvasContainer.style.display = 'flex';
            canvasContainer.style.justifyContent = 'center';
            canvasContainer.style.alignItems = 'center';
            canvasContainer.style.visibility = 'visible';
            canvasContainer.style.opacity = '1';
        }
    }
}

/**
 * Detect orientation changes and adjust UI accordingly
 */
window.addEventListener('orientationchange', function() {
    // Wait for orientation change to complete
    setTimeout(function() {
        // Refresh canvas scaling
        if (window.templateEditor && window.templateEditor.handleResize) {
            window.templateEditor.handleResize();
        }
        
        // Reset any transforms on canvas container
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.transform = '';
        }
        
        // Force visibility after orientation change
        const canvas = document.getElementById('editor-canvas');
        if (canvas) {
            canvas.style.visibility = 'visible';
            canvas.style.opacity = '1';
            canvas.style.display = 'block';
        }
        
        // Force aspect ratio container visibility
        const aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (aspectRatioContainer) {
            aspectRatioContainer.style.visibility = 'visible';
            aspectRatioContainer.style.opacity = '1';
            aspectRatioContainer.style.display = 'flex';
        }
    }, 300);
});

/**
 * Handle viewport resizing for mobile devices
 */
function handleMobileViewport() {
    // Fix for iOS Safari viewport issues
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        // Force redraw of viewport on orientation change
        viewportMeta.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Adjust for iOS Safari address bar
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        
        window.addEventListener('resize', () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        });
    }
}

// Initialize mobile viewport handling
handleMobileViewport();
