/* Halvor Lines Speedway Marketing Tool - Template Editor */

class TemplateEditor {
    constructor() {
        this.canvas = null;
        this.selectedObject = null;
        this.canvasContainer = document.querySelector(".canvas-container");
        this.templateData = null;
        this.templateId = null;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistorySteps = 20;
        this.initialized = false;
        this.canvasScale = 1;
        this.aspectRatio = 1;
    }

    initialize() {
        // Get template ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.templateId = urlParams.get("template");
        
        if (!this.templateId) {
            alert("No template specified");
            return;
        }
        
        // Load template data
        this.loadTemplateData()
            .then(() => {
                this.initializeCanvas();
                this.setupEventListeners();
                this.initialized = true;
                window.templateEditor = this; // Make available globally
                // Dispatch a custom event to signal initialization is complete
                const event = new CustomEvent("templateEditorInitialized");
                window.dispatchEvent(event);
                console.log("TemplateEditor initialized and event dispatched.");
            })
            .catch(error => {
                console.error("Error initializing editor:", error);
                alert("Failed to initialize editor");
            });
    }
    
    async loadTemplateData() {
        try {
            const response = await fetch("/assets/templates/template-data.json");
            const data = await response.json();
            
            // Find the template by ID
            let template = null;
            
            // Search through all categories
            for (const category of data.categories) {
                const found = category.templates.find(t => t.id === this.templateId);
                if (found) {
                    template = found;
                    break;
                }
            }
            
            if (!template) {
                throw new Error("Template not found");
            }
            
            this.templateData = template;
            
            // Update page title and description
            document.getElementById("editor-title").textContent = `Editing: ${template.name}`;
            document.getElementById("editor-description").textContent = template.description;
            
            return template;
        } catch (error) {
            console.error("Error loading template data:", error);
            throw error;
        }
    }
    
    initializeCanvas() {
        const templateWidth = this.templateData.width || 800;
        const templateHeight = this.templateData.height || 600;
        
        // Calculate aspect ratio
        this.aspectRatio = templateHeight / templateWidth;
        
        // Create fabric.js canvas with original dimensions
        this.canvas = new fabric.Canvas("editor-canvas", {
            backgroundColor: "#000000", // Default black background
            width: templateWidth,
            height: templateHeight,
            preserveObjectStacking: true,
            selection: true // Allow selection of multiple objects
        });
        
        // Update canvas dimensions display
        document.getElementById("canvas-dimensions").textContent = 
            `${templateWidth} × ${templateHeight}px`;
        
        // Load template elements
        this.loadTemplateElements();
        
        // Apply proper scaling to maintain aspect ratio
        this.handleResize();
        
        // Save initial state
        this.saveState();
    }
    
    applyCanvasScaling() {
        const templateWidth = this.templateData.width || 800;
        const templateHeight = this.templateData.height || 600;
        
        // Get the canvas wrapper and container
        const canvasWrapper = document.querySelector(".canvas-wrapper");
        
        if (canvasWrapper) {
            // Set the wrapper to be a flex container for centering
            canvasWrapper.style.display = "flex";
            canvasWrapper.style.justifyContent = "center";
            canvasWrapper.style.alignItems = "center";
            canvasWrapper.style.width = "100%";
            canvasWrapper.style.minHeight = "300px"; // Minimum height to ensure visibility
            canvasWrapper.style.height = "auto";
            canvasWrapper.style.overflow = "hidden";
            
            // Calculate the scaled dimensions
            const scaledWidth = Math.floor(templateWidth * this.canvasScale);
            const scaledHeight = Math.floor(templateHeight * this.canvasScale);
            
            // Set the canvas container to maintain aspect ratio
            this.canvasContainer.style.position = "relative";
            this.canvasContainer.style.width = `${scaledWidth}px`;
            this.canvasContainer.style.height = `${scaledHeight}px`;
            this.canvasContainer.style.margin = "auto"; // Center horizontally
            
            // Ensure the canvas element itself is properly sized
            const canvasElement = document.getElementById("editor-canvas");
            if (canvasElement) {
                canvasElement.style.width = "100%";
                canvasElement.style.height = "100%";
                canvasElement.style.display = "block";
            }
            
            // Update the canvas size for fabric.js
            this.canvas.setDimensions({
                width: scaledWidth,
                height: scaledHeight
            });
            
            // Set the zoom level to match the scale
            this.canvas.setZoom(this.canvasScale);
            
            // Ensure the canvas container is visible
            this.canvasContainer.style.visibility = "visible";
            this.canvasContainer.style.opacity = "1";
            this.canvasContainer.style.display = "block";
        }
    }
    
    loadTemplateElements() {
        if (!this.templateData.elements) {
            return;
        }
        
        // Get template dimensions
        const templateWidth = this.templateData.width || 800;
        const templateHeight = this.templateData.height || 600;
        
        // Apply background from template data if available
        if (this.templateData.background) {
            console.log("Found background in template data:", this.templateData.background);
            if (this.templateData.background.type === "image" && this.templateData.background.url) {
                console.log("Setting background image from template data:", this.templateData.background.url);
                this.setBackgroundImage(this.templateData.background.url, this.templateData.background.darkness || 0.3);
            } else if (this.templateData.background.type === "color" && this.templateData.background.color) {
                this.canvas.setBackgroundColor(this.templateData.background.color, this.canvas.renderAll.bind(this.canvas));
            }
        }
        
        // Process each element
        this.templateData.elements.forEach(element => {
            switch (element.type) {
                case "text":
                    this.addTextElement(element);
                    break;
                case "image":
                    this.addImageElement(element);
                    break;
                case "shape":
                    this.addShapeElement(element, templateWidth, templateHeight);
                    break;
                case "background":
                    // this.setBackground(element, templateWidth, templateHeight); // Handled by BackgroundImageHandler
                    if (window.templateEditor && window.templateEditor.applyBackgroundFromData) {
                        window.templateEditor.applyBackgroundFromData(element.backgroundDetails || { type: "color", color: "#000000" });
                    }
                    break;
                default:
                    console.warn("Unknown element type:", element.type);
            }
        });
        
        // Apply Proctor color scheme for this template
        if (this.templateId === "race_results_proctor_facebook") {
            console.log("Applying Proctor color scheme for race_results_proctor_facebook template");
            this.canvas.getObjects().forEach(obj => {
                if (obj.type === 'text') {
                    if (obj.id === "headline_text") {
                        obj.set("fill", "#FFDD00"); // Yellow
                    } else if (obj.id === "division_text") {
                        obj.set("fill", "#C0C0C0"); // Silver
                    } else if (obj.id === "footer_text") {
                        obj.set("fill", "#FFFFFF"); // White
                    } else {
                        obj.set("fill", "#FFFFFF"); // White for all other text
                    }
                }
            });
        }
        
        // Render canvas
        this.canvas.renderAll();
        
        // Ensure all elements are properly positioned
        this.adjustElementsToFillCanvas();
    }
    
    adjustElementsToFillCanvas() {
        // Get template dimensions
        const templateWidth = this.templateData.width || 800;
        const templateHeight = this.templateData.height || 600;
        
        // Get all objects on the canvas
        const objects = this.canvas.getObjects();
        
        // Check if we have header and footer elements
        const headerBg = objects.find(obj => obj.id === "header_bg");
        const footerBg = objects.find(obj => obj.id === "footer_bg");
        
        if (headerBg && footerBg) {
            // Ensure header and footer span full width
            headerBg.set({
                width: templateWidth,
                scaleX: 1,
                left: 0
            });
            
            footerBg.set({
                width: templateWidth,
                scaleX: 1,
                left: 0
            });
        }
        
        // Ensure all elements are within canvas bounds
        objects.forEach(obj => {
            // Skip background elements
            if (obj.id === "header_bg" || obj.id === "footer_bg") return;
            
            // Ensure element is within canvas bounds
            if (obj.left < 0) obj.set({ left: 0 });
            if (obj.top < 0) obj.set({ top: 0 });
            if (obj.left + obj.width > templateWidth) obj.set({ left: templateWidth - obj.width });
            if (obj.top + obj.height > templateHeight) obj.set({ top: templateHeight - obj.height });
        });
        
        // Render canvas
        this.canvas.renderAll();
    }
    
    addTextElement(element) {
        // Determine text alignment and adjust origin accordingly
        let originX = "left";
        if (element.textAlign === "center") {
            originX = "center";
        } else if (element.textAlign === "right") {
            originX = "right";
        }
        
        // Create text options
        const textOptions = {
            left: element.left,
            top: element.top,
            fontFamily: element.fontFamily || "Racing Sans One",
            fontSize: element.fontSize || 36,
            fill: element.fill || "#000000", // Use fill instead of color to match template-data.json
            fontWeight: element.bold ? "bold" : "normal",
            fontStyle: element.italic ? "italic" : "normal",
            underline: element.underline || false,
            textAlign: element.textAlign || "left",
            originX: originX,
            originY: "center",
            id: element.id || "text_" + Math.random().toString(36).substr(2, 9)
        };
        
        // Create text object
        const text = new fabric.Text(element.text || "Edit this text", textOptions);
        
        // Add custom properties
        text.toObject = (function(toObject) {
            return function() {
                return fabric.util.object.extend(toObject.call(this), {
                    id: this.id
                });
            };
        })(text.toObject);
        
        this.canvas.add(text);
        return text;
    }
    
    addImageElement(element) {
        fabric.Image.fromURL(element.src || "/assets/images/placeholder.jpg", img => {
            img.set({
                left: element.left,
                top: element.top,
                originX: "left",
                originY: "top",
                scaleX: element.scaleX || 1,
                scaleY: element.scaleY || 1,
                angle: element.angle || 0,
                opacity: element.opacity || 1,
                id: element.id || "image_" + Math.random().toString(36).substr(2, 9)
            });
            
            // Add custom properties
            img.toObject = (function(toObject) {
                return function() {
                    return fabric.util.object.extend(toObject.call(this), {
                        id: this.id
                    });
                };
            })(img.toObject);
            
            this.canvas.add(img);
            this.canvas.renderAll();
        });
    }
    
    addShapeElement(element, canvasWidth, canvasHeight) {
        let shape;
        
        // Common options for all shapes
        const shapeOptions = {
            left: element.left,
            top: element.top,
            originX: "left",
            originY: "top",
            fill: element.fill || "#D12026",
            stroke: element.stroke || "",
            strokeWidth: element.strokeWidth || 0,
            angle: element.angle || 0,
            opacity: element.opacity || 1,
            id: element.id || "shape_" + Math.random().toString(36).substr(2, 9)
        };
        
        // Special handling for header and footer backgrounds
        if (element.id === "header_bg" || element.id === "footer_bg") {
            // Ensure they span the full width
            element.width = canvasWidth;
            element.left = 0;
        }
        
        switch (element.shape) {
            case "rect":
                shape = new fabric.Rect({
                    ...shapeOptions,
                    width: element.width || 100,
                    height: element.height || 100,
                    rx: element.rx || 0,
                    ry: element.ry || 0
                });
                break;
                
            case "circle":
                shape = new fabric.Circle({
                    ...shapeOptions,
                    radius: element.radius || 50
                });
                break;
                
            case "triangle":
                shape = new fabric.Triangle({
                    ...shapeOptions,
                    width: element.width || 100,
                    height: element.height || 100
                });
                break;
                
            case "line":
                shape = new fabric.Line([
                    element.x1 || 0, 
                    element.y1 || 0, 
                    element.x2 || 100, 
                    element.y2 || 100
                ], {
                    ...shapeOptions,
                    stroke: element.stroke || "#D12026",
                    strokeWidth: element.strokeWidth || 2
                });
                break;
                
            default:
                console.warn("Unknown shape type:", element.shape);
                return;
        }
        
        // Add custom properties
        shape.toObject = (function(toObject) {
            return function() {
                return fabric.util.object.extend(toObject.call(this), {
                    id: this.id
                });
            };
        })(shape.toObject);
        
        this.canvas.add(shape);
        return shape;
    }
    
    // Modified setBackgroundImage to be used by BackgroundImageHandler
    setBackgroundImage(imageUrl, darkness = 0.3) {
        fabric.Image.fromURL(imageUrl, (img) => {
            const canvasWidth = this.templateData.width || 800;
            const canvasHeight = this.templateData.height || 600;

            const imgAspectRatio = img.height / img.width;
            let newWidth, newHeight;

            if (this.aspectRatio > imgAspectRatio) {
                newHeight = canvasHeight;
                newWidth = canvasHeight / imgAspectRatio;
            } else {
                newWidth = canvasWidth;
                newHeight = canvasWidth * imgAspectRatio;
            }

            img.set({
                originX: "center",
                originY: "center",
                left: canvasWidth / 2,
                top: canvasHeight / 2,
                scaleX: newWidth / img.width,
                scaleY: newHeight / img.height,
            });

            this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
                // Apply darkness overlay if needed
                // This is a simplified approach; a more robust solution might involve a separate overlay rect
            });

            // Apply darkness overlay
            this.applyDarknessOverlay(darkness);
            this.canvas.renderAll();
        });
    }

    applyDarknessOverlay(darkness) {
        // Remove existing overlay
        const existingOverlay = this.canvas.getObjects().find(obj => obj.id === "darknessOverlay");
        if (existingOverlay) {
            this.canvas.remove(existingOverlay);
        }

        if (darkness > 0) {
            const overlay = new fabric.Rect({
                width: this.templateData.width || 800,
                height: this.templateData.height || 600,
                left: 0,
                top: 0,
                fill: `rgba(0,0,0,${darkness})`,
                selectable: false,
                evented: false,
                id: "darknessOverlay"
            });
            this.canvas.add(overlay);
            overlay.moveTo(0); // Send to back, but above background image
        }
        this.canvas.renderAll();
    }

    setupEventListeners() {
        // Canvas selection events
        this.canvas.on("selection:created", this.handleSelectionChange.bind(this));
        this.canvas.on("selection:updated", this.handleSelectionChange.bind(this));
        this.canvas.on("selection:cleared", this.handleSelectionCleared.bind(this));
        
        // Canvas modification events
        this.canvas.on("object:modified", this.handleObjectModified.bind(this));
        
        // Text controls
        document.getElementById("font-family")?.addEventListener("change", this.handleFontFamilyChange.bind(this));
        document.getElementById("font-size")?.addEventListener("input", this.handleFontSizeChange.bind(this));
        document.getElementById("bold-button")?.addEventListener("click", this.handleBoldClick.bind(this));
        document.getElementById("italic-button")?.addEventListener("click", this.handleItalicClick.bind(this));
        document.getElementById("underline-button")?.addEventListener("click", this.handleUnderlineClick.bind(this));
        
        // Color controls
        document.querySelectorAll("[data-color]").forEach(button => {
            button.addEventListener("click", this.handleColorChange.bind(this));
        });
        document.getElementById("custom-color")?.addEventListener("input", this.handleCustomColorChange.bind(this));
        
        // Action buttons
        document.getElementById("reset-button")?.addEventListener("click", this.handleReset.bind(this));
        document.getElementById("download-image-button")?.addEventListener("click", this.handleDownloadImage.bind(this));
        document.getElementById("download-pdf-button")?.addEventListener("click", this.handleDownloadPdf.bind(this));
        document.getElementById("copy-image-button")?.addEventListener("click", this.handleCopyImage.bind(this));
        document.getElementById("save-template-button")?.addEventListener("click", this.handleSaveTemplate.bind(this));
        
        // Text preset selection
        document.getElementById("text-preset")?.addEventListener("change", this.handleAddTextPreset.bind(this));
        
        // Window resize event
        window.addEventListener("resize", this.handleResize.bind(this));
    }
    
    handleSelectionChange(event) {
        this.selectedObject = event.selected[0];
        this.updateTextControls();
    }
    
    handleSelectionCleared() {
        this.selectedObject = null;
        this.updateTextControls();
    }
    
    handleObjectModified() {
        this.saveState();
    }
    
    updateTextControls() {
        const textControls = document.getElementById("text-controls");
        if (!textControls) return;

        if (this.selectedObject && this.selectedObject.type === "text") {
            textControls.innerHTML = `
                <div class="mb-2">
                    <label for="text-input" class="block text-sm font-medium text-gray-700">Text Content</label>
                    <textarea id="text-input" class="w-full border border-gray-300 rounded p-2 touch-friendly-input" rows="3">${this.selectedObject.text}</textarea>
                </div>
            `;
            document.getElementById("text-input").addEventListener("input", (e) => {
                this.selectedObject.set("text", e.target.value);
                this.canvas.renderAll();
                this.saveState();
            });
            // Update font family, size, style controls based on selected text
            const fontFamilySelect = document.getElementById("font-family");
            if (fontFamilySelect) fontFamilySelect.value = this.selectedObject.fontFamily || "Racing Sans One";
            
            const fontSizeInput = document.getElementById("font-size");
            const fontSizeValue = document.getElementById("font-size-value");
            if (fontSizeInput && fontSizeValue) {
                fontSizeInput.value = this.selectedObject.fontSize || 36;
                fontSizeValue.textContent = `${this.selectedObject.fontSize || 36}px`;
            }

        } else {
            textControls.innerHTML = 
                `<p class="text-gray-500 text-sm">Select a text element on the canvas to edit</p>`;
        }
    }
    
    handleFontFamilyChange(event) {
        if (this.selectedObject && this.selectedObject.type === "text") {
            this.selectedObject.set("fontFamily", event.target.value);
            this.canvas.renderAll();
            this.saveState();
        }
    }
    
    handleFontSizeChange(event) {
        if (this.selectedObject && this.selectedObject.type === "text") {
            const newSize = parseInt(event.target.value);
            this.selectedObject.set("fontSize", newSize);
            document.getElementById("font-size-value").textContent = `${newSize}px`;
            this.canvas.renderAll();
            this.saveState();
        }
    }
    
    handleBoldClick() {
        if (this.selectedObject && this.selectedObject.type === "text") {
            const currentWeight = this.selectedObject.fontWeight;
            this.selectedObject.set("fontWeight", currentWeight === "bold" ? "normal" : "bold");
            this.canvas.renderAll();
            this.saveState();
        }
    }
    
    handleItalicClick() {
        if (this.selectedObject && this.selectedObject.type === "text") {
            const currentStyle = this.selectedObject.fontStyle;
            this.selectedObject.set("fontStyle", currentStyle === "italic" ? "normal" : "italic");
            this.canvas.renderAll();
            this.saveState();
        }
    }
    
    handleUnderlineClick() {
        if (this.selectedObject && this.selectedObject.type === "text") {
            this.selectedObject.set("underline", !this.selectedObject.underline);
            this.canvas.renderAll();
            this.saveState();
        }
    }
    
    handleColorChange(event) {
        if (this.selectedObject && this.selectedObject.type === "text") {
            this.selectedObject.set("fill", event.target.dataset.color);
            this.canvas.renderAll();
            this.saveState();
        }
    }
    
    handleCustomColorChange(event) {
        if (this.selectedObject && this.selectedObject.type === "text") {
            this.selectedObject.set("fill", event.target.value);
            this.canvas.renderAll();
            this.saveState();
        }
    }
    
    handleAddTextPreset(event) {
        const presetValue = event.target.value;
        if (!presetValue) return;

        let textContent = "";
        let fontSize = 36;
        let id = "preset_" + presetValue;

        switch (presetValue) {
            case "race_results":
                textContent = "RACE RESULTS";
                fontSize = 60;
                break;
            case "race_date":
                textContent = "Race Date: JUNE 15, 2025";
                fontSize = 30;
                break;
            case "class_name":
                textContent = "Class Name: WISSOTA LATE MODELS";
                fontSize = 40;
                break;
            case "winner":
                textContent = "Winner: DRIVER NAME #00";
                fontSize = 36;
                break;
        }

        this.addTextElement({
            text: textContent,
            left: 50,
            top: this.canvas.height / 2, // Center vertically initially
            fontSize: fontSize,
            fontFamily: "Racing Sans One",
            color: "#FFFFFF",
            id: id
        });
        this.canvas.renderAll();
        this.saveState();
        event.target.value = ""; // Reset select
    }

    handleReset() {
        if (confirm("Are you sure you want to reset the template to its original state?")) {
            this.canvas.clear();
            this.initializeCanvas(); // Reloads original elements and background
            this.saveState();
        }
    }
    
    handleDownloadImage() {
        const dataURL = this.canvas.toDataURL({
            format: "png",
            quality: 1.0,
            multiplier: 2 // For higher resolution
        });
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `${this.templateId || "template"}.png`;
        link.click();
    }
    
    async handleDownloadPdf() {
        const { jsPDF } = window.jspdf;
        const imgData = this.canvas.toDataURL({
            format: "jpeg", // PDF prefers JPEG
            quality: 0.9,
            multiplier: 2
        });
        
        const pdf = new jsPDF({
            orientation: this.canvas.width > this.canvas.height ? "landscape" : "portrait",
            unit: "px",
            format: [this.canvas.width, this.canvas.height]
        });
        
        pdf.addImage(imgData, "JPEG", 0, 0, this.canvas.width, this.canvas.height);
        pdf.save(`${this.templateId || "template"}.pdf`);
    }
    
    async handleCopyImage() {
        try {
            const dataURL = this.canvas.toDataURL({ format: "png", quality: 1.0 });
            const blob = await (await fetch(dataURL)).blob();
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            alert("Image copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy image: ", err);
            alert("Failed to copy image. Your browser may not support this feature or it was blocked.");
        }
    }
    
    handleSaveTemplate() {
        // This is a placeholder for actual save functionality
        // In a real application, this would send the template data to a server
        const templateJson = this.canvas.toJSON(["id"]); // Include custom ID property
        console.log("Saving template:", templateJson);
        alert("Template saved (see console for data). This is a demo feature.");
        // localStorage.setItem(`saved_${this.templateId}`, JSON.stringify(templateJson));
    }
    
    handleResize() {
        if (!this.canvasContainer || !this.templateData) return;

        const containerWidth = this.canvasContainer.parentElement.clientWidth;
        const templateWidth = this.templateData.width || 800;
        const templateHeight = this.templateData.height || 600;
        this.aspectRatio = templateHeight / templateWidth;

        let newCanvasWidth = containerWidth;
        // Ensure canvas does not exceed original template width unless container is larger
        if (newCanvasWidth > templateWidth && containerWidth < templateWidth) {
             newCanvasWidth = templateWidth;
        }

        let newCanvasHeight = newCanvasWidth * this.aspectRatio;

        // If calculated height is too large for the viewport, scale by height instead
        // This is a simplified approach; more robust viewport height detection might be needed
        const maxContainerHeight = window.innerHeight * 0.7; // Example: 70% of viewport height
        if (newCanvasHeight > maxContainerHeight) {
            newCanvasHeight = maxContainerHeight;
            newCanvasWidth = newCanvasHeight / this.aspectRatio;
        }
        
        this.canvasScale = newCanvasWidth / templateWidth;
        this.applyCanvasScaling();
    }

    saveState() {
        if (this.history.length >= this.maxHistorySteps) {
            this.history.shift(); // Remove oldest state
        }
        this.history.push(this.canvas.toJSON(["id"]));
        this.historyIndex = this.history.length - 1;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.loadState(this.history[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.loadState(this.history[this.historyIndex]);
        }
    }

    loadState(state) {
        this.canvas.loadFromJSON(state, () => {
            this.canvas.renderAll();
            // Re-apply background if it was part of the state or handled separately
            // This might need adjustment based on how background is stored/restored
        });
    }
}

// Initialize the editor when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const editor = new TemplateEditor();
    editor.initialize();
});

