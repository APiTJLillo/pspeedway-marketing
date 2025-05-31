// Halvor Lines Speedway Marketing Tool - Advanced Text Editor

class AdvancedTextEditor {
    constructor(canvas) {
        this.canvas = canvas;
        this.activeObject = null;
        this.textPresets = {
            'race_results': [
                { name: 'Race Date', text: 'JUNE 15, 2025', style: 'date' },
                { name: 'Class Name', text: 'WISSOTA LATE MODELS', style: 'class' },
                { name: 'Winner', text: 'DRIVER NAME #00', style: 'winner' },
                { name: '2nd Place', text: 'DRIVER NAME #00', style: 'place' },
                { name: '3rd Place', text: 'DRIVER NAME #00', style: 'place' }
            ],
            'bus_races': [
                { name: 'Event Date', text: 'JULY 20, 2025', style: 'date' },
                { name: 'Event Title', text: 'BUS RACES', style: 'title' },
                { name: 'Tagline', text: 'SCHOOL BUS DEMOLITION DERBY', style: 'tagline' },
                { name: 'Time', text: '7:00 PM', style: 'time' },
                { name: 'Admission', text: 'ADULTS $15 • KIDS $5', style: 'admission' }
            ],
            'silver_1000': [
                { name: 'Event Date', text: 'SEPTEMBER 3, 2025', style: 'date' },
                { name: 'Event Title', text: 'SILVER 1000', style: 'title' },
                { name: 'Tagline', text: 'CHAMPIONSHIP RACE', style: 'tagline' },
                { name: 'Prize', text: '$10,000 TO WIN', style: 'prize' },
                { name: 'Admission', text: 'ADULTS $20 • KIDS $10', style: 'admission' }
            ]
        };
    }
    
    initialize() {
        // Create advanced text editor container
        this.createAdvancedTextEditorContainer();
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    createAdvancedTextEditorContainer() {
        const controlPanel = document.querySelector('.control-panel');
        
        // Create text presets section
        const textPresetsSection = document.createElement('div');
        textPresetsSection.className = 'mb-6';
        textPresetsSection.innerHTML = `
            <h3 class="font-bold mb-2 font-oswald">Text Presets</h3>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Add Preset Text</label>
                <select id="text-preset-category" class="w-full border border-gray-300 rounded p-2 mb-2">
                    <option value="race_results">Race Results</option>
                    <option value="bus_races">Bus Races</option>
                    <option value="silver_1000">Silver 1000</option>
                </select>
                <div id="text-presets-container" class="grid grid-cols-1 gap-2">
                    <!-- Text presets will be loaded here -->
                </div>
            </div>
            <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-1">Text Alignment</h4>
                <div class="flex space-x-2">
                    <button id="align-left" class="p-2 border border-gray-300 rounded" title="Align Left">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </button>
                    <button id="align-center" class="p-2 border border-gray-300 rounded" title="Align Center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </button>
                    <button id="align-right" class="p-2 border border-gray-300 rounded" title="Align Right">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="mb-4">
                <h4 class="text-sm font-medium text-gray-700 mb-1">Text Effects</h4>
                <div class="flex space-x-2">
                    <button id="text-shadow" class="p-2 border border-gray-300 rounded" title="Add Shadow">Shadow</button>
                    <button id="text-outline" class="p-2 border border-gray-300 rounded" title="Add Outline">Outline</button>
                    <button id="text-uppercase" class="p-2 border border-gray-300 rounded" title="UPPERCASE">ABC</button>
                </div>
            </div>
        `;
        
        // Insert after the Font section
        const fontSection = controlPanel.querySelector('div:nth-child(3)');
        controlPanel.insertBefore(textPresetsSection, fontSection.nextSibling);
        
        // Load initial presets
        this.loadTextPresets('race_results');
    }
    
    initializeEventListeners() {
        // Text preset category selector
        const presetCategorySelector = document.getElementById('text-preset-category');
        presetCategorySelector.addEventListener('change', () => {
            this.loadTextPresets(presetCategorySelector.value);
        });
        
        // Text alignment buttons
        document.getElementById('align-left').addEventListener('click', () => {
            this.setTextAlignment('left');
        });
        
        document.getElementById('align-center').addEventListener('click', () => {
            this.setTextAlignment('center');
        });
        
        document.getElementById('align-right').addEventListener('click', () => {
            this.setTextAlignment('right');
        });
        
        // Text effects buttons
        document.getElementById('text-shadow').addEventListener('click', () => {
            this.toggleTextShadow();
        });
        
        document.getElementById('text-outline').addEventListener('click', () => {
            this.toggleTextOutline();
        });
        
        document.getElementById('text-uppercase').addEventListener('click', () => {
            this.convertToUppercase();
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
    
    loadTextPresets(category) {
        const container = document.getElementById('text-presets-container');
        container.innerHTML = '';
        
        if (!this.textPresets[category]) {
            container.innerHTML = '<p class="text-sm text-gray-500">No presets available for this category.</p>';
            return;
        }
        
        this.textPresets[category].forEach(preset => {
            const presetButton = document.createElement('button');
            presetButton.className = 'w-full text-left p-2 border border-gray-300 rounded hover:bg-gray-100 mb-1';
            presetButton.innerHTML = `
                <span class="font-bold">${preset.name}:</span> ${preset.text}
            `;
            
            presetButton.addEventListener('click', () => {
                this.addPresetText(preset);
            });
            
            container.appendChild(presetButton);
        });
    }
    
    addPresetText(preset) {
        // Create text properties based on preset style
        const textProps = {
            text: preset.text,
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontFamily: 'Oswald',
            fontSize: 36,
            fill: '#FFFFFF'
        };
        
        // Apply style-specific properties
        switch (preset.style) {
            case 'date':
                textProps.fontSize = 30;
                textProps.fill = '#FFDD00';
                break;
            case 'title':
                textProps.fontSize = 72;
                textProps.fontFamily = 'Racing Sans One';
                textProps.fill = '#D12026';
                break;
            case 'class':
                textProps.fontSize = 42;
                break;
            case 'winner':
                textProps.fontSize = 48;
                textProps.fontWeight = 'bold';
                break;
            case 'place':
                textProps.fontSize = 30;
                break;
            case 'tagline':
                textProps.fontSize = 36;
                break;
            case 'time':
                textProps.fontSize = 36;
                textProps.fill = '#FFDD00';
                break;
            case 'admission':
                textProps.fontSize = 24;
                break;
            case 'prize':
                textProps.fontSize = 48;
                textProps.fill = '#FFDD00';
                textProps.fontWeight = 'bold';
                break;
        }
        
        // Create text object
        const textObj = new fabric.Text(textProps.text, textProps);
        
        // Add to canvas
        this.canvas.add(textObj);
        this.canvas.setActiveObject(textObj);
        this.canvas.renderAll();
    }
    
    setTextAlignment(alignment) {
        if (!this.activeObject || this.activeObject.type !== 'text') return;
        
        this.activeObject.set('textAlign', alignment);
        
        // Update position based on alignment and originX
        if (alignment === 'left') {
            this.activeObject.set('originX', 'left');
        } else if (alignment === 'center') {
            this.activeObject.set('originX', 'center');
        } else if (alignment === 'right') {
            this.activeObject.set('originX', 'right');
        }
        
        this.canvas.renderAll();
    }
    
    toggleTextShadow() {
        if (!this.activeObject || this.activeObject.type !== 'text') return;
        
        if (this.activeObject.shadow) {
            this.activeObject.set('shadow', null);
        } else {
            this.activeObject.set('shadow', new fabric.Shadow({
                color: 'rgba(0,0,0,0.6)',
                blur: 5,
                offsetX: 3,
                offsetY: 3
            }));
        }
        
        this.canvas.renderAll();
    }
    
    toggleTextOutline() {
        if (!this.activeObject || this.activeObject.type !== 'text') return;
        
        if (this.activeObject.stroke) {
            this.activeObject.set('stroke', null);
            this.activeObject.set('strokeWidth', 0);
        } else {
            this.activeObject.set('stroke', '#000000');
            this.activeObject.set('strokeWidth', 1);
        }
        
        this.canvas.renderAll();
    }
    
    convertToUppercase() {
        if (!this.activeObject || this.activeObject.type !== 'text') return;
        
        this.activeObject.set('text', this.activeObject.text.toUpperCase());
        this.canvas.renderAll();
    }
}

// Extend TemplateEditor with advanced text editing functionality
document.addEventListener('DOMContentLoaded', () => {
    // Wait for TemplateEditor to initialize
    const checkEditor = setInterval(() => {
        if (window.templateEditor && window.templateEditor.canvas) {
            clearInterval(checkEditor);
            
            // Initialize advanced text editor
            const advancedTextEditor = new AdvancedTextEditor(window.templateEditor.canvas);
            advancedTextEditor.initialize();
        }
    }, 100);
});
