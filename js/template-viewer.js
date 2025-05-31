// Halverson Speedway Marketing Tool - Template Viewer

class TemplateViewer {
    constructor() {
        this.categories = [];
        this.currentCategory = null;
        this.templateContainer = document.getElementById('template-container');
        this.categoryLinks = document.querySelectorAll('.category-link');
    }
    
    async initialize() {
        try {
            // Load template data
            const response = await fetch('/assets/templates/template-data.json');
            if (!response.ok) {
                throw new Error('Failed to load template data');
            }
            
            const data = await response.json();
            this.categories = data.categories;
            
            // Set default category to first category in the list
            if (this.categories.length > 0) {
                this.currentCategory = this.categories[0].id;
            }
            
            // Initialize category links
            this.initializeCategoryLinks();
            
            // Load templates for default category
            this.loadTemplatesByCategory(this.currentCategory);
            
            return true;
        } catch (error) {
            console.error('Error initializing template viewer:', error);
            this.showErrorMessage('Failed to load templates. Please try refreshing the page.');
            return false;
        }
    }
    
    initializeCategoryLinks() {
        this.categoryLinks.forEach(link => {
            const categoryId = link.getAttribute('data-category');
            
            // Check if this category exists in our data
            const categoryExists = this.categories.some(c => c.id === categoryId);
            
            if (categoryExists) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Remove active class from all links
                    this.categoryLinks.forEach(l => {
                        l.classList.remove('bg-red-600', 'text-white');
                        l.classList.add('hover:bg-gray-100');
                    });
                    
                    // Add active class to clicked link
                    link.classList.add('bg-red-600', 'text-white');
                    link.classList.remove('hover:bg-gray-100');
                    
                    // Get category ID from data attribute
                    this.currentCategory = categoryId;
                    
                    // Update page title
                    const categoryName = this.categories.find(c => c.id === categoryId)?.name || 'Templates';
                    document.getElementById('category-title').textContent = `${categoryName} Templates`;
                    
                    // Load templates for selected category
                    this.loadTemplatesByCategory(categoryId);
                });
                
                // If this is the default category, mark it as active
                if (categoryId === this.currentCategory) {
                    link.classList.add('bg-red-600', 'text-white');
                    link.classList.remove('hover:bg-gray-100');
                }
            }
        });
    }
    
    loadTemplatesByCategory(categoryId) {
        if (!this.templateContainer) return;
        
        // Clear template container
        this.templateContainer.innerHTML = '';
        
        // Find the category
        const category = this.categories.find(c => c.id === categoryId);
        if (!category || !category.templates || category.templates.length === 0) {
            this.showNoTemplatesMessage();
            return;
        }
        
        // Update page title
        const categoryTitle = document.getElementById('category-title');
        if (categoryTitle) {
            categoryTitle.textContent = `${category.name} Templates`;
        }
        
        // Create template cards
        category.templates.forEach(template => {
            const card = this.createTemplateCard(template, category);
            this.templateContainer.appendChild(card);
        });
    }
    
    createTemplateCard(template, category) {
        const card = document.createElement('div');
        card.className = 'border rounded-lg overflow-hidden hover:shadow-lg transition-shadow template-card';
        
        // Create preview image with fallback
        const previewHeight = 'h-40';
        const platformText = template.platform ? `${template.platform} Template` : 'Template';
        
        card.innerHTML = `
            <div class="${previewHeight} bg-gray-200 relative">
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center text-white p-4 z-10">
                        <h3 class="font-racing text-xl">${template.name.split(' - ')[0].toUpperCase()}</h3>
                        <p class="font-oswald">${platformText}</p>
                    </div>
                </div>
                <div class="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
            <div class="p-4">
                <h3 class="font-bold mb-2 font-oswald">${template.name}</h3>
                <p class="text-sm text-gray-600 mb-4">${template.description}</p>
                <a href="/editor.html?template=${template.id}" class="inline-block bg-red-600 hover:bg-yellow-400 hover:text-black text-white py-2 px-4 rounded font-oswald customize-button" data-template-id="${template.id}">
                    Customize
                </a>
            </div>
        `;
        
        return card;
    }
    
    showNoTemplatesMessage() {
        this.templateContainer.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-500">No templates found for this category.</p>
            </div>
        `;
    }
    
    showErrorMessage(message) {
        if (this.templateContainer) {
            this.templateContainer.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-red-500">${message}</p>
                </div>
            `;
        }
    }
}

// Initialize template viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const templateViewer = new TemplateViewer();
    templateViewer.initialize().then(success => {
        if (success) {
            console.log('Template viewer initialized successfully');
        } else {
            console.error('Failed to initialize template viewer');
        }
    });
});
