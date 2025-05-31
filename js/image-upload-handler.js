/* Halverson Speedway Marketing Tool - Image Upload Handler */

class ImageUploadHandler {
    constructor(editor) {
        this.editor = editor;
        this.uploadedImages = [];
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        this.initialized = false;
    }
    
    initialize() {
        // Create image upload controls
        this.createImageControls();
        
        // Load previously uploaded images from storage
        this.loadSavedImages();
        
        this.initialized = true;
    }
    
    createImageControls() {
        // Find the control panel
        const controlPanel = document.querySelector('.control-panel');
        if (!controlPanel) return;
        
        // Create image section after font section
        const fontSection = controlPanel.querySelector('div:nth-child(3)');
        if (!fontSection) return;
        
        // Create image section
        const imageSection = document.createElement('div');
        imageSection.className = 'mb-6';
        imageSection.innerHTML = `
            <h3 class="font-bold mb-2 font-oswald">Images</h3>
            <div id="image-controls">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                    <div class="flex items-center">
                        <label class="flex flex-col items-center px-4 py-2 bg-white text-red-600 rounded-lg border border-red-600 cursor-pointer hover:bg-red-600 hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                            </svg>
                            <span class="mt-1 text-sm">Select Image</span>
                            <input id="image-upload" type="file" class="hidden" accept="image/*" />
                        </label>
                    </div>
                </div>
                
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Your Images</label>
                    <div id="image-library" class="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-100 rounded">
                        <p class="text-gray-500 text-sm col-span-3">No images uploaded yet</p>
                    </div>
                </div>
                
                <div id="selected-image-controls" class="hidden">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Selected Image</label>
                    <div class="flex items-center space-x-2">
                        <button id="add-selected-image" class="px-2 py-1 bg-red-600 text-white text-sm rounded">
                            Add to Canvas
                        </button>
                        <button id="remove-selected-image" class="px-2 py-1 bg-gray-200 text-gray-800 text-sm rounded">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after font section
        fontSection.after(imageSection);
        
        // Add event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Image upload
        const imageUpload = document.getElementById('image-upload');
        if (imageUpload) {
            imageUpload.addEventListener('change', this.handleImageUpload.bind(this));
        }
        
        // Add selected image button
        const addSelectedImage = document.getElementById('add-selected-image');
        if (addSelectedImage) {
            addSelectedImage.addEventListener('click', this.addSelectedImageToCanvas.bind(this));
        }
        
        // Remove selected image button
        const removeSelectedImage = document.getElementById('remove-selected-image');
        if (removeSelectedImage) {
            removeSelectedImage.addEventListener('click', this.removeSelectedImage.bind(this));
        }
    }
    
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Check file size
        if (file.size > this.maxFileSize) {
            notifications.show('Image is too large. Maximum size is 5MB.', 'error');
            return;
        }
        
        // Check file type
        if (!this.allowedTypes.includes(file.type)) {
            notifications.show('Invalid file type. Please upload a JPEG, PNG, or GIF image.', 'error');
            return;
        }
        
        // Read file
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = {
                id: utils.generateId('img'),
                name: file.name,
                src: event.target.result,
                type: file.type,
                size: file.size,
                date: new Date().toISOString()
            };
            
            // Add to uploaded images
            this.uploadedImages.push(imageData);
            
            // Save to storage
            this.saveImagesToStorage();
            
            // Update image library
            this.updateImageLibrary();
            
            // Reset file input
            e.target.value = '';
            
            // Show notification
            notifications.show('Image uploaded successfully', 'success');
        };
        
        reader.readAsDataURL(file);
    }
    
    updateImageLibrary() {
        const imageLibrary = document.getElementById('image-library');
        if (!imageLibrary) return;
        
        // Clear library
        imageLibrary.innerHTML = '';
        
        if (this.uploadedImages.length === 0) {
            imageLibrary.innerHTML = '<p class="text-gray-500 text-sm col-span-3">No images uploaded yet</p>';
            return;
        }
        
        // Add images to library
        this.uploadedImages.forEach(image => {
            const imageElement = document.createElement('div');
            imageElement.className = 'image-item relative cursor-pointer border hover:border-red-600';
            imageElement.dataset.id = image.id;
            imageElement.innerHTML = `
                <img src="${image.src}" alt="${image.name}" class="w-full h-16 object-cover">
            `;
            
            // Add click event
            imageElement.addEventListener('click', () => {
                // Remove selected class from all images
                document.querySelectorAll('.image-item').forEach(item => {
                    item.classList.remove('border-red-600');
                    item.classList.add('border-gray-300');
                });
                
                // Add selected class to clicked image
                imageElement.classList.remove('border-gray-300');
                imageElement.classList.add('border-red-600');
                
                // Show selected image controls
                const selectedImageControls = document.getElementById('selected-image-controls');
                if (selectedImageControls) {
                    selectedImageControls.classList.remove('hidden');
                }
                
                // Set selected image
                this.selectedImageId = image.id;
            });
            
            imageLibrary.appendChild(imageElement);
        });
    }
    
    addSelectedImageToCanvas() {
        if (!this.selectedImageId) {
            notifications.show('Please select an image first', 'error');
            return;
        }
        
        // Find selected image
        const image = this.uploadedImages.find(img => img.id === this.selectedImageId);
        if (!image) return;
        
        // Add image to canvas
        fabric.Image.fromURL(image.src, img => {
            // Scale image to fit within canvas
            const canvas = this.editor.canvas;
            const maxWidth = canvas.width * 0.8;
            const maxHeight = canvas.height * 0.8;
            
            if (img.width > maxWidth || img.height > maxHeight) {
                const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                img.scale(scale);
            }
            
            // Center image
            img.set({
                left: canvas.width / 2 - (img.width * img.scaleX) / 2,
                top: canvas.height / 2 - (img.height * img.scaleY) / 2,
                id: utils.generateId('canvas_img')
            });
            
            // Add custom properties
            img.toObject = (function(toObject) {
                return function() {
                    return fabric.util.object.extend(toObject.call(this), {
                        id: this.id
                    });
                };
            })(img.toObject);
            
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            
            // Save state
            this.editor.saveState();
            
            // Show notification
            notifications.show('Image added to canvas', 'success');
        });
    }
    
    removeSelectedImage() {
        if (!this.selectedImageId) {
            notifications.show('Please select an image first', 'error');
            return;
        }
        
        // Confirm deletion
        if (confirm('Are you sure you want to remove this image from your library?')) {
            // Remove from uploaded images
            this.uploadedImages = this.uploadedImages.filter(img => img.id !== this.selectedImageId);
            
            // Save to storage
            this.saveImagesToStorage();
            
            // Update image library
            this.updateImageLibrary();
            
            // Hide selected image controls
            const selectedImageControls = document.getElementById('selected-image-controls');
            if (selectedImageControls) {
                selectedImageControls.classList.add('hidden');
            }
            
            // Clear selected image
            this.selectedImageId = null;
            
            // Show notification
            notifications.show('Image removed from library', 'success');
        }
    }
    
    saveImagesToStorage() {
        // Save only the last 10 images to prevent storage issues
        const imagesToSave = this.uploadedImages.slice(-10);
        storageManager.save('uploadedImages', imagesToSave);
    }
    
    loadSavedImages() {
        const savedImages = storageManager.load('uploadedImages');
        if (savedImages && Array.isArray(savedImages)) {
            this.uploadedImages = savedImages;
            this.updateImageLibrary();
        }
    }
}

// Initialize image upload handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for TemplateEditor to initialize
    const checkEditor = setInterval(() => {
        if (window.templateEditor && window.templateEditor.initialized) {
            clearInterval(checkEditor);
            
            // Initialize image upload handler
            const imageUploadHandler = new ImageUploadHandler(window.templateEditor);
            imageUploadHandler.initialize();
        }
    }, 100);
});
