// Halverson Speedway Marketing Tool - Image Upload Handler

class ImageUploadHandler {
    constructor(canvas, fabricCanvas) {
        this.canvas = canvas;
        this.fabricCanvas = fabricCanvas;
        this.uploadedImages = {};
    }
    
    initialize() {
        // Create image upload container
        this.createImageUploadContainer();
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    createImageUploadContainer() {
        const controlPanel = document.querySelector('.control-panel');
        
        // Create image upload section
        const imageSection = document.createElement('div');
        imageSection.className = 'mb-6';
        imageSection.innerHTML = `
            <h3 class="font-bold mb-2 font-oswald">Images</h3>
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                <input type="file" id="image-upload" accept="image/*" class="w-full border border-gray-300 rounded p-2">
                <p class="text-xs text-gray-500 mt-1">Recommended size: 1200x1200px or larger</p>
            </div>
            <div id="uploaded-images" class="grid grid-cols-2 gap-2 mb-4">
                <!-- Uploaded images will appear here -->
            </div>
        `;
        
        // Insert before the Actions section
        const actionsSection = controlPanel.querySelector('div:last-child');
        controlPanel.insertBefore(imageSection, actionsSection);
    }
    
    initializeEventListeners() {
        // Image upload handler
        const imageUpload = document.getElementById('image-upload');
        imageUpload.addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files[0]);
        });
    }
    
    handleImageUpload(file) {
        if (!file) return;
        
        // Check file type
        if (!file.type.match('image.*')) {
            alert('Please select an image file.');
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgData = e.target.result;
            
            // Create image element
            fabric.Image.fromURL(imgData, (img) => {
                // Scale image if it's too large
                if (img.width > this.fabricCanvas.width || img.height > this.fabricCanvas.height) {
                    const scale = Math.min(
                        this.fabricCanvas.width / img.width,
                        this.fabricCanvas.height / img.height
                    ) * 0.8; // 80% of max size
                    
                    img.scale(scale);
                }
                
                // Center image on canvas
                img.set({
                    left: this.fabricCanvas.width / 2,
                    top: this.fabricCanvas.height / 2,
                    originX: 'center',
                    originY: 'center'
                });
                
                // Add to canvas
                this.fabricCanvas.add(img);
                this.fabricCanvas.setActiveObject(img);
                this.fabricCanvas.renderAll();
                
                // Add to uploaded images
                const imageId = `img_${Date.now()}`;
                this.uploadedImages[imageId] = {
                    id: imageId,
                    src: imgData,
                    name: file.name
                };
                
                // Add to uploaded images container
                this.addImageToContainer(imageId, imgData, file.name);
            });
        };
        
        reader.readAsDataURL(file);
    }
    
    addImageToContainer(id, src, name) {
        const container = document.getElementById('uploaded-images');
        
        const imageDiv = document.createElement('div');
        imageDiv.className = 'border rounded p-1 relative';
        imageDiv.innerHTML = `
            <img src="${src}" alt="${name}" class="w-full h-16 object-cover">
            <button class="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center" data-id="${id}">×</button>
            <p class="text-xs truncate">${name}</p>
        `;
        
        // Add delete button event listener
        const deleteButton = imageDiv.querySelector('button');
        deleteButton.addEventListener('click', () => {
            this.removeImage(id);
            container.removeChild(imageDiv);
        });
        
        // Add image click event listener to add to canvas
        const img = imageDiv.querySelector('img');
        img.addEventListener('click', () => {
            this.addImageToCanvas(id);
        });
        
        container.appendChild(imageDiv);
    }
    
    removeImage(id) {
        delete this.uploadedImages[id];
    }
    
    addImageToCanvas(id) {
        const imageData = this.uploadedImages[id];
        if (!imageData) return;
        
        fabric.Image.fromURL(imageData.src, (img) => {
            // Scale image if it's too large
            if (img.width > this.fabricCanvas.width || img.height > this.fabricCanvas.height) {
                const scale = Math.min(
                    this.fabricCanvas.width / img.width,
                    this.fabricCanvas.height / img.height
                ) * 0.8; // 80% of max size
                
                img.scale(scale);
            }
            
            // Center image on canvas
            img.set({
                left: this.fabricCanvas.width / 2,
                top: this.fabricCanvas.height / 2,
                originX: 'center',
                originY: 'center'
            });
            
            // Add to canvas
            this.fabricCanvas.add(img);
            this.fabricCanvas.setActiveObject(img);
            this.fabricCanvas.renderAll();
        });
    }
}

// Extend TemplateEditor with image upload functionality
document.addEventListener('DOMContentLoaded', () => {
    // Wait for TemplateEditor to initialize
    const checkEditor = setInterval(() => {
        if (window.templateEditor && window.templateEditor.canvas) {
            clearInterval(checkEditor);
            
            // Initialize image upload handler
            const imageUploadHandler = new ImageUploadHandler(
                document.getElementById('editor-canvas'),
                window.templateEditor.canvas
            );
            imageUploadHandler.initialize();
        }
    }, 100);
});
