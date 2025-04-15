// Halverson Speedway Marketing Tool - Main JavaScript

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Template category selection
    const categoryLinks = document.querySelectorAll('.category-sidebar a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all links
            categoryLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            // Update templates display (to be implemented)
            // loadTemplatesByCategory(this.dataset.category);
        });
    });
    
    // Template customization buttons
    const customizeButtons = document.querySelectorAll('button.customize');
    customizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateId = this.dataset.templateId;
            // Navigate to editor page with template ID (to be implemented)
            // window.location.href = `editor.html?template=${templateId}`;
            console.log(`Customize template: ${templateId}`);
        });
    });
});

// Template Data Management
class TemplateManager {
    constructor() {
        this.templates = [];
        this.categories = [];
    }
    
    async loadTemplates() {
        try {
            // In a real implementation, this would load from a JSON file
            // For now, we'll use placeholder data
            this.templates = [
                {
                    id: 'race_results_facebook',
                    name: 'Race Results - Facebook',
                    category: 'race_results',
                    platform: 'facebook',
                    thumbnail: 'assets/templates/race_results_facebook_thumb.jpg',
                    description: 'Square format optimized for Facebook posts with space for top 5 finishers.'
                },
                {
                    id: 'race_results_instagram',
                    name: 'Race Results - Instagram',
                    category: 'race_results',
                    platform: 'instagram',
                    thumbnail: 'assets/templates/race_results_instagram_thumb.jpg',
                    description: 'Square format optimized for Instagram with winner spotlight.'
                },
                {
                    id: 'race_results_twitter',
                    name: 'Race Results - Twitter',
                    category: 'race_results',
                    platform: 'twitter',
                    thumbnail: 'assets/templates/race_results_twitter_thumb.jpg',
                    description: 'Landscape format optimized for Twitter with concise results.'
                }
            ];
            
            this.categories = [
                { id: 'race_results', name: 'Race Results' },
                { id: 'bus_races', name: 'Bus Races' },
                { id: 'silver_1000', name: 'Silver 1000' },
                { id: 'email', name: 'Email Templates' },
                { id: 'website', name: 'Website Content' }
            ];
            
            return true;
        } catch (error) {
            console.error('Error loading templates:', error);
            return false;
        }
    }
    
    getTemplatesByCategory(categoryId) {
        return this.templates.filter(template => template.category === categoryId);
    }
    
    getTemplateById(templateId) {
        return this.templates.find(template => template.id === templateId);
    }
    
    getAllCategories() {
        return this.categories;
    }
}

// Canvas Editor (Placeholder for future implementation)
class CanvasEditor {
    constructor(canvasId) {
        this.canvas = null;
        this.canvasId = canvasId;
    }
    
    initialize() {
        // Initialize Fabric.js canvas
        this.canvas = new fabric.Canvas(this.canvasId);
        this.canvas.setWidth(800);
        this.canvas.setHeight(800);
        this.canvas.setBackgroundColor('#ffffff', this.canvas.renderAll.bind(this.canvas));
        
        return this;
    }
    
    loadTemplate(templateData) {
        // Clear existing canvas
        this.canvas.clear();
        
        // Load template elements (to be implemented)
        console.log('Loading template:', templateData);
        
        // Example placeholder text
        const title = new fabric.Text('RACE RESULTS', {
            left: 400,
            top: 100,
            fontFamily: 'Racing Sans One',
            fontSize: 48,
            fill: '#D12026',
            originX: 'center',
            originY: 'center'
        });
        
        this.canvas.add(title);
        this.canvas.renderAll();
    }
    
    exportImage(format = 'png') {
        return this.canvas.toDataURL({
            format: format,
            quality: 1
        });
    }
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

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Initialize application when script is loaded
const templateManager = new TemplateManager();
templateManager.loadTemplates().then(success => {
    if (success) {
        console.log('Templates loaded successfully');
        // Additional initialization can go here
    }
});

// Responsive handling
window.addEventListener('resize', debounce(function() {
    // Handle responsive adjustments if needed
    console.log('Window resized');
}, 250));
