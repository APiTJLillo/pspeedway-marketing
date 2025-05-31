// Mobile-specific aspect ratio handling
class MobileAspectRatioHandler {
    constructor() {
        this.templateEditor = window.templateEditor;
        this.mobileBreakpoint = 640; // Match the CSS media query
        this.initialized = false;
        this.lastAspectRatio = null;
    }
    
    initialize() {
        if (!this.templateEditor || !this.templateEditor.canvas) {
            console.warn('Template editor not initialized yet');
            return;
        }
        
        this.setupMobileLayout();
        this.setupEventListeners();
        this.initialized = true;
    }
    
    setupMobileLayout() {
        // Get the canvas wrapper and container
        const canvasWrapper = document.querySelector('.canvas-wrapper');
        
        if (!canvasWrapper) return;
        
        // Create aspect ratio container if it doesn't exist
        let aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (!aspectRatioContainer) {
            aspectRatioContainer = document.createElement('div');
            aspectRatioContainer.className = 'aspect-ratio-container';
            
            // Create content container
            const aspectRatioContent = document.createElement('div');
            aspectRatioContent.className = 'aspect-ratio-content';
            
            // Move canvas container inside aspect ratio container
            const canvasContainer = document.querySelector('.canvas-container');
            if (canvasContainer) {
                // Rearrange DOM
                canvasWrapper.appendChild(aspectRatioContainer);
                aspectRatioContainer.appendChild(aspectRatioContent);
                
                // Move canvas container
                if (canvasContainer.parentNode) {
                    aspectRatioContent.appendChild(canvasContainer);
                }
            }
        }
        
        // Add CSS to ensure proper centering and scaling
        this.addResponsiveStyles();
        
        // Set the correct aspect ratio based on template dimensions
        this.updateAspectRatio();
    }
    
    addResponsiveStyles() {
        // Check if our style element already exists
        let styleEl = document.getElementById('mobile-aspect-ratio-styles');
        
        if (!styleEl) {
            // Create style element
            styleEl = document.createElement('style');
            styleEl.id = 'mobile-aspect-ratio-styles';
            document.head.appendChild(styleEl);
            
            // Add responsive styles
            styleEl.textContent = `
                .aspect-ratio-container {
                    position: relative;
                    width: 100%;
                    max-width: 100%;
                    margin: 0 auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                }
                
                .aspect-ratio-content {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .canvas-container {
                    width: 100% !important;
                    height: 100% !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                }
                
                /* Force canvas visibility */
                #editor-canvas {
                    visibility: visible !important;
                    opacity: 1 !important;
                    display: block !important;
                }
                
                /* Ensure canvas is centered */
                .canvas-wrapper {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                }
                
                /* Mobile-specific styles */
                @media (max-width: 640px) {
                    .aspect-ratio-container {
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                }
            `;
        }
    }
    
    updateAspectRatio() {
        if (!this.templateEditor || !this.templateEditor.templateData) return;
        
        const aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (!aspectRatioContainer) return;
        
        const templateWidth = this.templateEditor.templateData.width || 800;
        const templateHeight = this.templateEditor.templateData.height || 600;
        
        // Calculate aspect ratio percentage
        const aspectRatio = (templateHeight / templateWidth) * 100;
        
        // Only update if the aspect ratio has changed
        if (this.lastAspectRatio !== aspectRatio) {
            this.lastAspectRatio = aspectRatio;
            
            // Apply aspect ratio
            aspectRatioContainer.style.paddingBottom = `${aspectRatio}%`;
            
            // Remove any preset ratio classes
            aspectRatioContainer.classList.remove('ratio-4-3', 'ratio-1-1', 'ratio-16-9');
            
            // Log the aspect ratio change
            console.log(`Mobile aspect ratio set to ${aspectRatio.toFixed(2)}% (${templateWidth}x${templateHeight})`);
        }
        
        // Ensure visibility
        this.forceVisibility();
    }
    
    forceVisibility() {
        // Force canvas to be visible
        const canvas = document.getElementById('editor-canvas');
        if (canvas) {
            canvas.style.visibility = 'visible';
            canvas.style.opacity = '1';
            canvas.style.display = 'block';
        }
        
        // Force canvas container to be visible
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.visibility = 'visible';
            canvasContainer.style.opacity = '1';
            canvasContainer.style.display = 'flex';
        }
        
        // Force aspect ratio container to be visible
        const aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (aspectRatioContainer) {
            aspectRatioContainer.style.visibility = 'visible';
            aspectRatioContainer.style.opacity = '1';
            aspectRatioContainer.style.display = 'flex';
        }
        
        // Force aspect ratio content to be visible
        const aspectRatioContent = document.querySelector('.aspect-ratio-content');
        if (aspectRatioContent) {
            aspectRatioContent.style.visibility = 'visible';
            aspectRatioContent.style.opacity = '1';
            aspectRatioContent.style.display = 'flex';
        }
    }
    
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            // Wait for orientation change to complete
            setTimeout(this.handleResize.bind(this), 300);
        });
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.handleResize();
            }
        });
    }
    
    handleResize() {
        // Check if we're in mobile view
        const isMobile = window.innerWidth <= this.mobileBreakpoint;
        
        // Update aspect ratio container
        this.updateAspectRatio();
        
        // Ensure canvas is properly sized within the container
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.width = '100%';
            canvasContainer.style.height = '100%';
            canvasContainer.style.display = 'flex';
            canvasContainer.style.justifyContent = 'center';
            canvasContainer.style.alignItems = 'center';
        }
        
        // Let the main editor handle canvas scaling
        if (this.templateEditor && this.templateEditor.handleResize) {
            this.templateEditor.handleResize();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for template editor to initialize first
    const checkEditor = setInterval(() => {
        if (window.templateEditor && window.templateEditor.initialized) {
            clearInterval(checkEditor);
            
            // Initialize mobile aspect ratio handler
            const mobileHandler = new MobileAspectRatioHandler();
            mobileHandler.initialize();
            
            // Make available globally
            window.mobileAspectRatioHandler = mobileHandler;
        }
    }, 100);
});
