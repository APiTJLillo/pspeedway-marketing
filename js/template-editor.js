// Halverson Speedway Marketing Tool - Template Editor

class TemplateEditor {
    constructor() {
        this.canvas = null;
        this.template = null;
        this.originalTemplate = null;
        this.activeObject = null;
        this.canvasContainer = document.querySelector('.canvas-container');
    }
    
    async initialize() {
        try {
            // Get template data from localStorage
            const templateData = localStorage.getItem('selectedTemplate');
            if (!templateData) {
                this.showError('No template selected. Please go back and select a template.');
                return false;
            }
            
            this.template = JSON.parse(templateData);
            this.originalTemplate = JSON.parse(templateData); // Keep a copy for reset
            
            // Update page title and description
            document.getElementById('editor-title').textContent = `Editing: ${this.template.name}`;
            document.getElementById('editor-description').textContent = this.template.description;
            
            // Initialize canvas
            this.initializeCanvas();
            
            // Load template elements
            await this.loadTemplateElements();
            
            // Initialize controls
            this.initializeControls();
            
            // Initialize export buttons
            this.initializeExportButtons();
            
            return true;
        } catch (error) {
            console.error('Error initializing template editor:', error);
            this.showError('Failed to initialize editor. Please try again.');
            return false;
        }
    }
    
    initializeCanvas() {
        // Create Fabric.js canvas
        this.canvas = new fabric.Canvas('editor-canvas');
        
        // Set canvas dimensions based on template
        const { width, height } = this.template.dimensions;
        this.canvas.setWidth(width);
        this.canvas.setHeight(height);
        
        // Update dimensions display
        document.getElementById('canvas-dimensions').textContent = `${width} × ${height}px`;
        
        // Make canvas responsive
        this.makeCanvasResponsive();
        
        // Set up selection event
        this.canvas.on('selection:created', this.handleSelectionChange.bind(this));
        this.canvas.on('selection:updated', this.handleSelectionChange.bind(this));
        this.canvas.on('selection:cleared', this.handleSelectionCleared.bind(this));
    }
    
    makeCanvasResponsive() {
        // Calculate scale factor to fit canvas in container
        const containerWidth = this.canvasContainer.clientWidth;
        const { width } = this.template.dimensions;
        
        if (containerWidth < width) {
            const scaleFactor = containerWidth / width;
            this.canvas.setZoom(scaleFactor);
            this.canvas.setWidth(width * scaleFactor);
            this.canvas.setHeight(this.template.dimensions.height * scaleFactor);
        }
        
        // Update on window resize
        window.addEventListener('resize', () => {
            const newContainerWidth = this.canvasContainer.clientWidth;
            if (newContainerWidth < width) {
                const newScaleFactor = newContainerWidth / width;
                this.canvas.setZoom(newScaleFactor);
                this.canvas.setWidth(width * newScaleFactor);
                this.canvas.setHeight(this.template.dimensions.height * newScaleFactor);
            } else {
                this.canvas.setZoom(1);
                this.canvas.setWidth(width);
                this.canvas.setHeight(this.template.dimensions.height);
            }
        });
    }
    
    async loadTemplateElements() {
        // Clear canvas
        this.canvas.clear();
        
        // Load each element from template
        for (const element of this.template.elements) {
            await this.addElementToCanvas(element);
        }
        
        this.canvas.renderAll();
    }
    
    async addElementToCanvas(element) {
        switch (element.type) {
            case 'text':
                this.addTextElement(element);
                break;
            case 'image':
                await this.addImageElement(element);
                break;
            case 'rectangle':
                this.addRectangleElement(element);
                break;
            default:
                console.warn(`Unknown element type: ${element.type}`);
        }
    }
    
    addTextElement(element) {
        const textObj = new fabric.Text(element.text, {
            left: element.left,
            top: element.top,
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
            fill: element.fill,
            originX: element.originX || 'left',
            originY: element.originY || 'top',
            selectable: element.editable !== false,
            id: element.id
        });
        
        this.canvas.add(textObj);
    }
    
    async addImageElement(element) {
        // In a real implementation, this would load from the actual image path
        // For now, we'll create a placeholder
        const rect = new fabric.Rect({
            left: element.x || element.left,
            top: element.y || element.top,
            width: element.width,
            height: element.height,
            fill: '#cccccc',
            stroke: '#999999',
            strokeWidth: 1,
            selectable: element.editable !== false,
            id: element.id
        });
        
        // Add a placeholder text
        const text = new fabric.Text('Image Placeholder', {
            left: (element.x || element.left) + element.width / 2,
            top: (element.y || element.top) + element.height / 2,
            fontSize: 16,
            fontFamily: 'Arial',
            fill: '#666666',
            originX: 'center',
            originY: 'center',
            selectable: false
        });
        
        this.canvas.add(rect);
        this.canvas.add(text);
    }
    
    addRectangleElement(element) {
        const rect = new fabric.Rect({
            left: element.left,
            top: element.top,
            width: element.width,
            height: element.height,
            fill: element.fill,
            stroke: element.stroke,
            strokeWidth: element.strokeWidth || 0,
            originX: element.originX || 'left',
            originY: element.originY || 'top',
            selectable: element.editable !== false,
            id: element.id
        });
        
        this.canvas.add(rect);
    }
    
    initializeControls() {
        // Text controls are initialized when text is selected
        
        // Color buttons
        const colorButtons = document.querySelectorAll('[data-color]');
        colorButtons.forEach(button => {
            const color = button.getAttribute('data-color');
            button.style.backgroundColor = color;
            
            button.addEventListener('click', () => {
                if (this.activeObject && this.activeObject.type === 'text') {
                    this.activeObject.set('fill', color);
                    this.canvas.renderAll();
                }
            });
        });
        
        // Custom color picker
        const customColorPicker = document.getElementById('custom-color');
        customColorPicker.addEventListener('input', () => {
            if (this.activeObject && this.activeObject.type === 'text') {
                this.activeObject.set('fill', customColorPicker.value);
                this.canvas.renderAll();
            }
        });
        
        // Font family selector
        const fontFamilySelector = document.getElementById('font-family');
        fontFamilySelector.addEventListener('change', () => {
            if (this.activeObject && this.activeObject.type === 'text') {
                this.activeObject.set('fontFamily', fontFamilySelector.value);
                this.canvas.renderAll();
            }
        });
        
        // Font size slider
        const fontSizeSlider = document.getElementById('font-size');
        fontSizeSlider.addEventListener('input', () => {
            if (this.activeObject && this.activeObject.type === 'text') {
                this.activeObject.set('fontSize', parseInt(fontSizeSlider.value));
                this.canvas.renderAll();
            }
        });
        
        // Font style buttons
        document.getElementById('bold-button').addEventListener('click', () => {
            if (this.activeObject && this.activeObject.type === 'text') {
                this.activeObject.set('fontWeight', this.activeObject.fontWeight === 'bold' ? 'normal' : 'bold');
                this.canvas.renderAll();
            }
        });
        
        document.getElementById('italic-button').addEventListener('click', () => {
            if (this.activeObject && this.activeObject.type === 'text') {
                this.activeObject.set('fontStyle', this.activeObject.fontStyle === 'italic' ? 'normal' : 'italic');
                this.canvas.renderAll();
            }
        });
        
        document.getElementById('underline-button').addEventListener('click', () => {
            if (this.activeObject && this.activeObject.type === 'text') {
                this.activeObject.set('underline', !this.activeObject.underline);
                this.canvas.renderAll();
            }
        });
        
        // Reset button
        document.getElementById('reset-button').addEventListener('click', () => {
            this.resetTemplate();
        });
        
        // Preview button
        document.getElementById('preview-button').addEventListener('click', () => {
            this.previewTemplate();
        });
    }
    
    handleSelectionChange(e) {
        this.activeObject = e.selected[0];
        
        if (this.activeObject.type === 'text') {
            this.updateTextControls();
        }
    }
    
    handleSelectionCleared() {
        this.activeObject = null;
        document.getElementById('text-controls').innerHTML = '<p class="text-gray-500 text-sm">Select a text element on the canvas to edit</p>';
    }
    
    updateTextControls() {
        const textControls = document.getElementById('text-controls');
        const text = this.activeObject;
        
        textControls.innerHTML = `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
                <textarea id="text-content" class="w-full border border-gray-300 rounded p-2" rows="3">${text.text}</textarea>
            </div>
        `;
        
        // Add event listener to textarea
        document.getElementById('text-content').addEventListener('input', (e) => {
            text.set('text', e.target.value);
            this.canvas.renderAll();
        });
        
        // Update other controls to match selected text
        document.getElementById('font-family').value = text.fontFamily;
        document.getElementById('font-size').value = text.fontSize;
        document.getElementById('custom-color').value = text.fill;
    }
    
    resetTemplate() {
        if (confirm('Are you sure you want to reset all changes?')) {
            // Reload original template
            this.template = JSON.parse(JSON.stringify(this.originalTemplate));
            this.loadTemplateElements();
        }
    }
    
    previewTemplate() {
        // Create a modal to show preview
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white rounded-lg p-6 max-w-3xl max-h-screen overflow-auto';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'absolute top-4 right-4 text-gray-500 hover:text-gray-700';
        closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold mb-4 text-red-600 font-racing';
        title.textContent = 'Preview';
        
        const previewImage = document.createElement('img');
        previewImage.className = 'max-w-full h-auto';
        previewImage.src = this.canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        modalContent.appendChild(closeButton);
        modalContent.appendChild(title);
        modalContent.appendChild(previewImage);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    initializeExportButtons() {
        // Download Image button
        document.getElementById('download-image-button').addEventListener('click', () => {
            this.downloadImage();
        });
        
        // Download PDF button
        document.getElementById('download-pdf-button').addEventListener('click', () => {
            this.downloadPDF();
        });
        
        // Copy to Clipboard button
        document.getElementById('copy-image-button').addEventListener('click', () => {
            this.copyToClipboard();
        });
    }
    
    downloadImage() {
        const dataURL = this.canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${this.template.name.replace(/\s+/g, '_').toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    downloadPDF() {
        const dataURL = this.canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: this.template.dimensions.width > this.template.dimensions.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [this.template.dimensions.width, this.template.dimensions.height]
        });
        
        pdf.addImage(dataURL, 'PNG', 0, 0, this.template.dimensions.width, this.template.dimensions.height);
        pdf.save(`${this.template.name.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    }
    
    async copyToClipboard() {
        try {
            const dataURL = this.canvas.toDataURL({
                format: 'png',
                quality: 1
            });
            
            // Convert dataURL to Blob
            const res = await fetch(dataURL);
            const blob = await res.blob();
            
            // Copy to clipboard
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);
            
            alert('Image copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy image to clipboard:', err);
            alert('Failed to copy image to clipboard. Your browser may not support this feature.');
        }
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4';
        errorDiv.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${message}</span>
        `;
        
        const container = document.querySelector('main .container');
        container.insertBefore(errorDiv, container.firstChild);
    }
}

// Initialize editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const editor = new TemplateEditor();
    editor.initialize().then(success => {
        if (success) {
            console.log('Template editor initialized successfully');
        } else {
            console.error('Failed to initialize template editor');
        }
    });
});
