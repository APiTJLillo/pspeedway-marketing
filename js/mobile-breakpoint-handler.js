// Mobile breakpoint display handler
class MobileBreakpointHandler {
    constructor() {
        this.templateEditor = window.templateEditor;
        this.breakpoints = {
            xs: 480,  // Extra small screens
            sm: 640,  // Small screens (match CSS media query)
            md: 1023  // Medium screens
        };
        this.initialized = false;
        this.currentBreakpoint = null;
    }
    
    initialize() {
        if (!this.templateEditor || !this.templateEditor.canvas) {
            console.warn('Template editor not initialized yet');
            return;
        }
        
        this.setupMobileBreakpoints();
        this.setupEventListeners();
        this.initialized = true;
        
        // Initial check
        this.handleBreakpointChange();
    }
    
    setupMobileBreakpoints() {
        // Add necessary classes to canvas container
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.classList.add('responsive-canvas-container');
        }
        
        // Add force-visible class to canvas
        const canvas = document.getElementById('editor-canvas');
        if (canvas) {
            canvas.classList.add('force-visible');
        }
        
        // Create aspect ratio container if it doesn't exist
        this.ensureAspectRatioContainer();
    }
    
    ensureAspectRatioContainer() {
        const canvasWrapper = document.querySelector('.canvas-wrapper');
        if (!canvasWrapper) return;
        
        // Check if aspect ratio container exists
        let aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (!aspectRatioContainer) {
            // Create container
            aspectRatioContainer = document.createElement('div');
            aspectRatioContainer.className = 'aspect-ratio-container';
            
            // Create content container
            const aspectRatioContent = document.createElement('div');
            aspectRatioContent.className = 'aspect-ratio-content';
            
            // Get canvas container
            const canvasContainer = document.querySelector('.canvas-container');
            
            // Rearrange DOM
            if (canvasContainer && canvasContainer.parentNode) {
                // Don't clone the container, just move it to preserve event listeners
                canvasWrapper.appendChild(aspectRatioContainer);
                aspectRatioContainer.appendChild(aspectRatioContent);
                aspectRatioContent.appendChild(canvasContainer);
            }
        }
        
        // Set aspect ratio
        this.updateAspectRatio();
    }
    
    updateAspectRatio() {
        if (!this.templateEditor || !this.templateEditor.templateData) return;
        
        const aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (!aspectRatioContainer) return;
        
        const templateWidth = this.templateEditor.templateData.width || 1200;
        const templateHeight = this.templateEditor.templateData.height || 630;
        
        // Calculate aspect ratio percentage
        const aspectRatio = (templateHeight / templateWidth) * 100;
        
        // Apply aspect ratio - always use the template's actual aspect ratio
        aspectRatioContainer.style.paddingBottom = `${aspectRatio}%`;
        
        // Force visibility
        aspectRatioContainer.style.display = 'block';
        aspectRatioContainer.style.visibility = 'visible';
        aspectRatioContainer.style.opacity = '1';
        
        // Add debug info
        console.log(`Setting aspect ratio to ${aspectRatio}% (${templateWidth}x${templateHeight})`);
    }
    
    setupEventListeners() {
        // Handle window resize
        window.addEventListener('resize', this.handleBreakpointChange.bind(this));
        
        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            // Wait for orientation change to complete
            setTimeout(this.handleBreakpointChange.bind(this), 300);
        });
        
        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.handleBreakpointChange();
            }
        });
    }
    
    handleBreakpointChange() {
        const windowWidth = window.innerWidth;
        let newBreakpoint = 'desktop';
        
        // Determine current breakpoint
        if (windowWidth <= this.breakpoints.xs) {
            newBreakpoint = 'xs';
        } else if (windowWidth <= this.breakpoints.sm) {
            newBreakpoint = 'sm';
        } else if (windowWidth <= this.breakpoints.md) {
            newBreakpoint = 'md';
        }
        
        // Only apply changes if breakpoint changed
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            
            // Apply specific fixes based on breakpoint
            if (newBreakpoint === 'xs') {
                this.applyExtraSmallScreenFixes();
            } else if (newBreakpoint === 'sm') {
                this.applySmallScreenFixes();
            } else if (newBreakpoint === 'md') {
                this.applyMediumScreenFixes();
            } else {
                this.applyDesktopFixes();
            }
            
            console.log(`Breakpoint changed to: ${newBreakpoint}`);
        }
        
        // Always ensure canvas is visible
        this.forceCanvasVisibility();
        
        // Always update aspect ratio to ensure consistency
        this.updateAspectRatio();
        
        // Update canvas size
        if (this.templateEditor && this.templateEditor.handleResize) {
            this.templateEditor.handleResize();
        }
    }
    
    applyExtraSmallScreenFixes() {
        console.log('Applying extra small screen fixes');
        
        // Force minimum height
        const canvasWrapper = document.querySelector('.canvas-wrapper');
        if (canvasWrapper) {
            canvasWrapper.style.minHeight = '200px';
        }
        
        // Ensure canvas is visible
        const canvas = document.getElementById('editor-canvas');
        if (canvas) {
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
            canvas.style.minHeight = '150px';
        }
        
        // Ensure aspect ratio container is properly styled
        const aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (aspectRatioContainer) {
            aspectRatioContainer.style.width = '100%';
            aspectRatioContainer.style.maxWidth = '100%';
            aspectRatioContainer.style.margin = '0 auto';
            
            // Center the container
            aspectRatioContainer.style.display = 'flex';
            aspectRatioContainer.style.justifyContent = 'center';
            aspectRatioContainer.style.alignItems = 'center';
        }
        
        // Ensure aspect ratio content is properly styled
        const aspectRatioContent = document.querySelector('.aspect-ratio-content');
        if (aspectRatioContent) {
            aspectRatioContent.style.width = '100%';
            aspectRatioContent.style.height = '100%';
            aspectRatioContent.style.position = 'absolute';
            aspectRatioContent.style.top = '0';
            aspectRatioContent.style.left = '0';
            aspectRatioContent.style.display = 'flex';
            aspectRatioContent.style.justifyContent = 'center';
            aspectRatioContent.style.alignItems = 'center';
        }
        
        // Simplify UI
        document.querySelectorAll('.hidden-xs').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    applySmallScreenFixes() {
        console.log('Applying small screen fixes');
        
        // Ensure canvas container is properly sized
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.width = '100%';
            canvasContainer.style.height = 'auto';
        }
        
        // Ensure aspect ratio container is properly styled
        const aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (aspectRatioContainer) {
            aspectRatioContainer.style.width = '100%';
            aspectRatioContainer.style.maxWidth = '100%';
            aspectRatioContainer.style.margin = '0 auto';
            
            // Center the container
            aspectRatioContainer.style.display = 'flex';
            aspectRatioContainer.style.justifyContent = 'center';
            aspectRatioContainer.style.alignItems = 'center';
        }
        
        // Ensure aspect ratio content is properly styled
        const aspectRatioContent = document.querySelector('.aspect-ratio-content');
        if (aspectRatioContent) {
            aspectRatioContent.style.width = '100%';
            aspectRatioContent.style.height = '100%';
            aspectRatioContent.style.position = 'absolute';
            aspectRatioContent.style.top = '0';
            aspectRatioContent.style.left = '0';
            aspectRatioContent.style.display = 'flex';
            aspectRatioContent.style.justifyContent = 'center';
            aspectRatioContent.style.alignItems = 'center';
        }
    }
    
    applyMediumScreenFixes() {
        console.log('Applying medium screen fixes');
        
        // Adjust canvas container for tablets
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.width = '100%';
            canvasContainer.style.maxWidth = '800px';
            canvasContainer.style.margin = '0 auto';
        }
        
        // Ensure aspect ratio container is properly styled
        const aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (aspectRatioContainer) {
            aspectRatioContainer.style.width = '100%';
            aspectRatioContainer.style.maxWidth = '800px';
            aspectRatioContainer.style.margin = '0 auto';
        }
    }
    
    applyDesktopFixes() {
        console.log('Applying desktop fixes');
        
        // Reset any mobile-specific styles
        const canvasWrapper = document.querySelector('.canvas-wrapper');
        if (canvasWrapper) {
            canvasWrapper.style.minHeight = '';
        }
        
        // Ensure aspect ratio container is properly styled
        const aspectRatioContainer = document.querySelector('.aspect-ratio-container');
        if (aspectRatioContainer) {
            aspectRatioContainer.style.width = '100%';
            aspectRatioContainer.style.maxWidth = '100%';
            aspectRatioContainer.style.margin = '0 auto';
            
            // Center the container
            aspectRatioContainer.style.display = 'flex';
            aspectRatioContainer.style.justifyContent = 'center';
            aspectRatioContainer.style.alignItems = 'center';
        }
        
        // Ensure aspect ratio content is properly styled
        const aspectRatioContent = document.querySelector('.aspect-ratio-content');
        if (aspectRatioContent) {
            aspectRatioContent.style.width = '100%';
            aspectRatioContent.style.height = '100%';
            aspectRatioContent.style.position = 'absolute';
            aspectRatioContent.style.top = '0';
            aspectRatioContent.style.left = '0';
            aspectRatioContent.style.display = 'flex';
            aspectRatioContent.style.justifyContent = 'center';
            aspectRatioContent.style.alignItems = 'center';
        }
    }
    
    forceCanvasVisibility() {
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
            canvasContainer.style.display = 'block';
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for template editor to initialize first
    const checkEditor = setInterval(() => {
        if (window.templateEditor && window.templateEditor.initialized) {
            clearInterval(checkEditor);
            
            // Initialize mobile breakpoint handler
            const breakpointHandler = new MobileBreakpointHandler();
            breakpointHandler.initialize();
            
            // Make available globally
            window.mobileBreakpointHandler = breakpointHandler;
        }
    }, 100);
});
