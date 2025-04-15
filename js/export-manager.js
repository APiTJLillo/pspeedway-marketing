// Halverson Speedway Marketing Tool - Export Functionality

class ExportManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.exportFormats = [
            { id: 'png', name: 'PNG Image', description: 'Best for social media posts' },
            { id: 'jpg', name: 'JPG Image', description: 'Smaller file size, good for web' },
            { id: 'pdf', name: 'PDF Document', description: 'Best for printing' },
            { id: 'svg', name: 'SVG Vector', description: 'Scalable vector format' }
        ];
    }
    
    initialize() {
        // Initialize export buttons
        this.initializeExportButtons();
        
        // Add save template functionality
        this.initializeSaveTemplate();
        
        // Create export modal
        this.createExportModal();
    }
    
    initializeExportButtons() {
        // Download Image button
        document.getElementById('download-image-button').addEventListener('click', () => {
            this.showExportModal('image');
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
    
    initializeSaveTemplate() {
        // Save Template button
        document.getElementById('save-template-button').addEventListener('click', () => {
            this.saveTemplate();
        });
    }
    
    createExportModal() {
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'export-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white rounded-lg p-6 max-w-md w-full';
        
        // Create modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'flex justify-between items-center mb-4';
        modalHeader.innerHTML = `
            <h2 class="text-xl font-bold text-red-600 font-racing">Export Options</h2>
            <button id="close-export-modal" class="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        
        // Create modal body
        const modalBody = document.createElement('div');
        modalBody.className = 'mb-4';
        
        // Add format options
        let formatOptionsHTML = '<div class="mb-4"><label class="block text-sm font-medium text-gray-700 mb-2">Select Format</label>';
        
        this.exportFormats.forEach(format => {
            formatOptionsHTML += `
                <div class="flex items-center mb-2">
                    <input type="radio" id="format-${format.id}" name="export-format" value="${format.id}" class="mr-2" ${format.id === 'png' ? 'checked' : ''}>
                    <label for="format-${format.id}" class="flex flex-col">
                        <span class="font-medium">${format.name}</span>
                        <span class="text-xs text-gray-500">${format.description}</span>
                    </label>
                </div>
            `;
        });
        
        formatOptionsHTML += '</div>';
        
        // Add quality option for JPG
        formatOptionsHTML += `
            <div id="jpg-quality-container" class="mb-4 hidden">
                <label class="block text-sm font-medium text-gray-700 mb-2">Image Quality</label>
                <input type="range" id="jpg-quality" min="10" max="100" value="90" class="w-full">
                <div class="flex justify-between text-xs text-gray-500">
                    <span>Lower Quality</span>
                    <span>Higher Quality</span>
                </div>
            </div>
        `;
        
        // Add size options
        formatOptionsHTML += `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Image Size</label>
                <select id="export-size" class="w-full border border-gray-300 rounded p-2">
                    <option value="1">Original Size</option>
                    <option value="2">2x Size</option>
                    <option value="0.75">75% Size</option>
                    <option value="0.5">50% Size</option>
                </select>
            </div>
        `;
        
        // Add filename option
        formatOptionsHTML += `
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Filename</label>
                <input type="text" id="export-filename" class="w-full border border-gray-300 rounded p-2" value="halverson_speedway_design">
            </div>
        `;
        
        modalBody.innerHTML = formatOptionsHTML;
        
        // Create modal footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'flex justify-end';
        modalFooter.innerHTML = `
            <button id="cancel-export" class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded font-oswald mr-2">
                Cancel
            </button>
            <button id="confirm-export" class="bg-red-600 hover:bg-yellow-400 hover:text-black text-white py-2 px-4 rounded font-oswald">
                Export
            </button>
        `;
        
        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modal.appendChild(modalContent);
        
        // Add modal to document
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('close-export-modal').addEventListener('click', () => {
            this.hideExportModal();
        });
        
        document.getElementById('cancel-export').addEventListener('click', () => {
            this.hideExportModal();
        });
        
        document.getElementById('confirm-export').addEventListener('click', () => {
            this.processExport();
        });
        
        // Show/hide JPG quality based on format selection
        const formatRadios = document.querySelectorAll('input[name="export-format"]');
        formatRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const jpgQualityContainer = document.getElementById('jpg-quality-container');
                if (radio.value === 'jpg') {
                    jpgQualityContainer.classList.remove('hidden');
                } else {
                    jpgQualityContainer.classList.add('hidden');
                }
            });
        });
        
        // Close modal when clicking outside content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideExportModal();
            }
        });
    }
    
    showExportModal(type) {
        const modal = document.getElementById('export-modal');
        modal.classList.remove('hidden');
        
        // Set default format based on type
        if (type === 'image') {
            document.getElementById('format-png').checked = true;
        } else if (type === 'pdf') {
            document.getElementById('format-pdf').checked = true;
        }
        
        // Set default filename
        const templateName = document.getElementById('editor-title').textContent.replace('Editing: ', '').trim();
        document.getElementById('export-filename').value = templateName.toLowerCase().replace(/\s+/g, '_');
    }
    
    hideExportModal() {
        const modal = document.getElementById('export-modal');
        modal.classList.add('hidden');
    }
    
    processExport() {
        // Get selected format
        const formatRadios = document.querySelectorAll('input[name="export-format"]');
        let selectedFormat;
        formatRadios.forEach(radio => {
            if (radio.checked) {
                selectedFormat = radio.value;
            }
        });
        
        // Get other options
        const size = parseFloat(document.getElementById('export-size').value);
        const filename = document.getElementById('export-filename').value || 'halverson_speedway_design';
        
        // Process export based on format
        switch (selectedFormat) {
            case 'png':
                this.downloadImage('png', size, filename);
                break;
            case 'jpg':
                const quality = parseInt(document.getElementById('jpg-quality').value) / 100;
                this.downloadImage('jpeg', size, filename, quality);
                break;
            case 'pdf':
                this.downloadPDF(size, filename);
                break;
            case 'svg':
                this.downloadSVG(filename);
                break;
        }
        
        // Hide modal
        this.hideExportModal();
    }
    
    downloadImage(format, scale = 1, filename = 'halverson_speedway_design', quality = 1) {
        // Create a temporary canvas with the desired scale
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        
        // Set dimensions
        tempCanvas.width = this.canvas.width * scale;
        tempCanvas.height = this.canvas.height * scale;
        
        // Draw scaled canvas
        tempContext.scale(scale, scale);
        tempContext.drawImage(this.canvas.toCanvas(), 0, 0);
        
        // Convert to data URL
        const dataURL = tempCanvas.toDataURL({
            format: format,
            quality: quality
        });
        
        // Create download link
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = `${filename}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success notification
        this.showNotification(`Image downloaded as ${filename}.${format}`);
    }
    
    downloadPDF(scale = 1, filename = 'halverson_speedway_design') {
        // Create a temporary canvas with the desired scale
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
        
        // Set dimensions
        tempCanvas.width = this.canvas.width * scale;
        tempCanvas.height = this.canvas.height * scale;
        
        // Draw scaled canvas
        tempContext.scale(scale, scale);
        tempContext.drawImage(this.canvas.toCanvas(), 0, 0);
        
        // Convert to data URL
        const dataURL = tempCanvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: this.canvas.width > this.canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [tempCanvas.width, tempCanvas.height]
        });
        
        pdf.addImage(dataURL, 'PNG', 0, 0, tempCanvas.width, tempCanvas.height);
        pdf.save(`${filename}.pdf`);
        
        // Show success notification
        this.showNotification(`PDF downloaded as ${filename}.pdf`);
    }
    
    downloadSVG(filename = 'halverson_speedway_design') {
        // Convert canvas to SVG
        const svg = this.canvas.toSVG();
        
        // Create blob
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        
        // Create download link
        saveAs(blob, `${filename}.svg`);
        
        // Show success notification
        this.showNotification(`SVG downloaded as ${filename}.svg`);
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
            
            // Show success notification
            this.showNotification('Image copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy image to clipboard:', err);
            this.showNotification('Failed to copy image to clipboard. Your browser may not support this feature.', 'error');
        }
    }
    
    saveTemplate() {
        // Get canvas data
        const canvasData = JSON.stringify(this.canvas.toJSON());
        
        // Get template name
        const templateName = document.getElementById('editor-title').textContent.replace('Editing: ', '').trim();
        const filename = templateName.toLowerCase().replace(/\s+/g, '_');
        
        // Create template object
        const template = {
            name: templateName,
            data: canvasData,
            timestamp: new Date().toISOString()
        };
        
        // Get existing saved templates
        let savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
        
        // Add new template or update existing
        const existingIndex = savedTemplates.findIndex(t => t.name === templateName);
        if (existingIndex >= 0) {
            savedTemplates[existingIndex] = template;
        } else {
            savedTemplates.push(template);
        }
        
        // Save to localStorage
        localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
        
        // Show success notification
        this.showNotification(`Template "${templateName}" saved successfully!`);
    }
    
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded shadow-lg z-50 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`;
        notification.innerHTML = message;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// Initialize export manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for TemplateEditor to initialize
    const checkEditor = setInterval(() => {
        if (window.templateEditor && window.templateEditor.canvas) {
            clearInterval(checkEditor);
            
            // Initialize export manager
            const exportManager = new ExportManager(window.templateEditor.canvas);
            exportManager.initialize();
        }
    }, 100);
});
