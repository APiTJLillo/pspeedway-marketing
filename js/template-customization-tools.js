// Halverson Speedway Marketing Tool - Template Customization Tools

class TemplateCustomizationTools {
    constructor(canvas) {
        this.canvas = canvas;
        this.activeObject = null;
        this.templateType = this.getTemplateTypeFromURL() || 'race_results';
        this.customizationOptions = {
            'race_results': {
                backgrounds: [
                    { name: 'Dark Track', color: '#000000', image: null },
                    { name: 'Red Accent', color: '#D12026', image: null },
                    { name: 'Checkered Flag', color: '#333333', image: 'assets/templates/backgrounds/checkered.jpg' }
                ],
                layouts: [
                    { name: 'Standard', id: 'standard' },
                    { name: 'Winner Focus', id: 'winner_focus' },
                    { name: 'Top 3 Only', id: 'top_3' }
                ]
            },
            'bus_races': {
                backgrounds: [
                    { name: 'Dark Track', color: '#000000', image: null },
                    { name: 'Yellow Accent', color: '#FFDD00', image: null },
                    { name: 'Bus Silhouette', color: '#333333', image: 'assets/templates/backgrounds/bus.jpg' }
                ],
                layouts: [
                    { name: 'Standard', id: 'standard' },
                    { name: 'Event Focus', id: 'event_focus' },
                    { name: 'Family Friendly', id: 'family' }
                ]
            },
            'silver_1000': {
                backgrounds: [
                    { name: 'Dark Track', color: '#000000', image: null },
                    { name: 'Silver Accent', color: '#C0C0C0', image: null },
                    { name: 'Trophy Cup', color: '#333333', image: 'assets/templates/backgrounds/trophy.jpg' }
                ],
                layouts: [
                    { name: 'Standard', id: 'standard' },
                    { name: 'Championship', id: 'championship' },
                    { name: 'Prize Money', id: 'prize' }
                ]
            }
        };
    }
    
    initialize() {
        // Create template customization container
        this.createCustomizationContainer();
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    getTemplateTypeFromURL() {
        // Extract template type from URL or localStorage
        const templateData = localStorage.getItem('selectedTemplate');
        if (templateData) {
            try {
                const template = JSON.parse(templateData);
                return template.category;
            } catch (e) {
                console.error('Error parsing template data:', e);
            }
        }
        return null;
    }
    
    createCustomizationContainer() {
        const controlPanel = document.querySelector('.control-panel');
        
        // Create template customization section
        const customizationSection = document.createElement('div');
        customizationSection.className = 'mb-6';
        customizationSection.innerHTML = `
            <h3 class="font-bold mb-2 font-oswald">Template Options</h3>
            <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-1">Background</h4>
                <div id="background-options" class="grid grid-cols-3 gap-2 mb-2">
                    <!-- Background options will be loaded here -->
                </div>
            </div>
            <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-1">Layout</h4>
                <div id="layout-options" class="grid grid-cols-1 gap-2">
                    <!-- Layout options will be loaded here -->
                </div>
            </div>
            <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-1">Theme Colors</h4>
                <div class="flex space-x-2">
                    <button class="w-8 h-8 bg-red-600 border border-gray-300 rounded" data-theme="red"></button>
                    <button class="w-8 h-8 bg-yellow-400 border border-gray-300 rounded" data-theme="yellow"></button>
                    <button class="w-8 h-8 bg-blue-600 border border-gray-300 rounded" data-theme="blue"></button>
                    <button class="w-8 h-8 bg-green-600 border border-gray-300 rounded" data-theme="green"></button>
                    <button class="w-8 h-8 bg-purple-600 border border-gray-300 rounded" data-theme="purple"></button>
                </div>
            </div>
        `;
        
        // Insert at the beginning of the control panel
        controlPanel.insertBefore(customizationSection, controlPanel.firstChild);
        
        // Load options for the current template type
        this.loadCustomizationOptions();
    }
    
    loadCustomizationOptions() {
        // Load background options
        this.loadBackgroundOptions();
        
        // Load layout options
        this.loadLayoutOptions();
    }
    
    loadBackgroundOptions() {
        const container = document.getElementById('background-options');
        container.innerHTML = '';
        
        if (!this.customizationOptions[this.templateType]) {
            container.innerHTML = '<p class="text-sm text-gray-500">No options available.</p>';
            return;
        }
        
        this.customizationOptions[this.templateType].backgrounds.forEach(bg => {
            const bgButton = document.createElement('button');
            bgButton.className = 'h-12 border border-gray-300 rounded overflow-hidden';
            
            if (bg.image) {
                bgButton.innerHTML = `<div class="h-full bg-cover bg-center" style="background-image: url('${bg.image}')"></div>`;
            } else {
                bgButton.style.backgroundColor = bg.color;
            }
            
            bgButton.setAttribute('title', bg.name);
            bgButton.setAttribute('data-background', JSON.stringify(bg));
            
            bgButton.addEventListener('click', () => {
                this.applyBackground(bg);
            });
            
            container.appendChild(bgButton);
        });
    }
    
    loadLayoutOptions() {
        const container = document.getElementById('layout-options');
        container.innerHTML = '';
        
        if (!this.customizationOptions[this.templateType]) {
            container.innerHTML = '<p class="text-sm text-gray-500">No options available.</p>';
            return;
        }
        
        this.customizationOptions[this.templateType].layouts.forEach(layout => {
            const layoutButton = document.createElement('button');
            layoutButton.className = 'w-full text-left p-2 border border-gray-300 rounded hover:bg-gray-100 mb-1';
            layoutButton.innerHTML = layout.name;
            layoutButton.setAttribute('data-layout', layout.id);
            
            layoutButton.addEventListener('click', () => {
                this.applyLayout(layout);
            });
            
            container.appendChild(layoutButton);
        });
    }
    
    initializeEventListeners() {
        // Theme color buttons
        const themeButtons = document.querySelectorAll('[data-theme]');
        themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.getAttribute('data-theme');
                this.applyTheme(theme);
            });
        });
        
        // Listen for selection changes on canvas
        this.canvas.on('selection:created', (e) => {
            this.activeObject = e.selected[0];
        });
        
        this.canvas.on('selection:updated', (e) => {
            this.activeObject = e.selected[0];
        });
        
        this.canvas.on('selection:cleared', () => {
            this.activeObject = null;
        });
    }
    
    applyBackground(background) {
        // Find background rectangle
        const bgObject = this.canvas.getObjects().find(obj => 
            obj.type === 'rect' && (obj.id === 'background' || obj.width === this.canvas.width && obj.height === this.canvas.height)
        );
        
        if (bgObject) {
            // Update existing background
            bgObject.set('fill', background.color);
            
            // If there's an image, load it as pattern
            if (background.image) {
                fabric.Image.fromURL(background.image, (img) => {
                    img.scaleToWidth(this.canvas.width);
                    
                    bgObject.set('fill', new fabric.Pattern({
                        source: img.getElement(),
                        repeat: 'repeat'
                    }));
                    
                    this.canvas.renderAll();
                });
            } else {
                this.canvas.renderAll();
            }
        } else {
            // Create new background if none exists
            const rect = new fabric.Rect({
                left: this.canvas.width / 2,
                top: this.canvas.height / 2,
                width: this.canvas.width,
                height: this.canvas.height,
                fill: background.color,
                originX: 'center',
                originY: 'center',
                selectable: false,
                id: 'background'
            });
            
            // If there's an image, load it as pattern
            if (background.image) {
                fabric.Image.fromURL(background.image, (img) => {
                    img.scaleToWidth(this.canvas.width);
                    
                    rect.set('fill', new fabric.Pattern({
                        source: img.getElement(),
                        repeat: 'repeat'
                    }));
                    
                    this.canvas.add(rect);
                    this.canvas.sendToBack(rect);
                    this.canvas.renderAll();
                });
            } else {
                this.canvas.add(rect);
                this.canvas.sendToBack(rect);
                this.canvas.renderAll();
            }
        }
    }
    
    applyLayout(layout) {
        // In a real implementation, this would rearrange elements based on layout
        // For now, we'll just show a notification
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded shadow-lg z-50';
        notification.innerHTML = `Layout changed to: ${layout.name}`;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
        
        // Example layout changes for race results
        if (this.templateType === 'race_results') {
            const textObjects = this.canvas.getObjects().filter(obj => obj.type === 'text');
            
            if (layout.id === 'winner_focus') {
                // Find title and winner text
                const title = textObjects.find(obj => obj.text.includes('RACE RESULTS') || obj.text.includes('WINNER'));
                const winner = textObjects.find(obj => obj.text.includes('1ST PLACE') || obj.text.includes('DRIVER NAME'));
                
                if (title) {
                    title.set({
                        fontSize: title.fontSize * 1.2,
                        top: title.top - 20
                    });
                }
                
                if (winner) {
                    winner.set({
                        fontSize: winner.fontSize * 1.5,
                        top: this.canvas.height / 2,
                        fontWeight: 'bold'
                    });
                }
                
                // Hide or minimize other placements
                textObjects.forEach(obj => {
                    if (obj.text.includes('2ND PLACE') || obj.text.includes('3RD PLACE')) {
                        obj.set({
                            opacity: 0.7,
                            fontSize: obj.fontSize * 0.8
                        });
                    }
                });
            } else if (layout.id === 'top_3') {
                // Emphasize top 3 only
                textObjects.forEach(obj => {
                    if (obj.text.includes('1ST PLACE') || obj.text.includes('2ND PLACE') || obj.text.includes('3RD PLACE')) {
                        obj.set({
                            fontSize: obj.fontSize * 1.2,
                            fontWeight: 'bold'
                        });
                    }
                });
            }
            
            this.canvas.renderAll();
        }
    }
    
    applyTheme(theme) {
        // Get all text objects
        const textObjects = this.canvas.getObjects().filter(obj => obj.type === 'text');
        
        // Define theme colors
        let primaryColor, secondaryColor;
        switch (theme) {
            case 'red':
                primaryColor = '#D12026';
                secondaryColor = '#FFDD00';
                break;
            case 'yellow':
                primaryColor = '#FFDD00';
                secondaryColor = '#D12026';
                break;
            case 'blue':
                primaryColor = '#0066CC';
                secondaryColor = '#FFFFFF';
                break;
            case 'green':
                primaryColor = '#00AA55';
                secondaryColor = '#FFFFFF';
                break;
            case 'purple':
                primaryColor = '#9900CC';
                secondaryColor = '#FFFFFF';
                break;
            default:
                primaryColor = '#D12026';
                secondaryColor = '#FFDD00';
        }
        
        // Apply colors to text objects based on their role
        textObjects.forEach(obj => {
            // Title or header text (usually larger)
            if (obj.fontSize >= 48) {
                obj.set('fill', primaryColor);
            } 
            // Subtitle or date text (usually medium)
            else if (obj.fontSize >= 30 && obj.fontSize < 48) {
                obj.set('fill', secondaryColor);
            }
            // Keep other text white for readability
        });
        
        this.canvas.renderAll();
    }
}

// Extend TemplateEditor with customization tools
document.addEventListener('DOMContentLoaded', () => {
    // Wait for TemplateEditor to initialize
    const checkEditor = setInterval(() => {
        if (window.templateEditor && window.templateEditor.canvas) {
            clearInterval(checkEditor);
            
            // Initialize template customization tools
            const customizationTools = new TemplateCustomizationTools(window.templateEditor.canvas);
            customizationTools.initialize();
        }
    }, 100);
});
