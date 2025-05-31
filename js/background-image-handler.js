/* Halvor Lines Speedway Marketing Tool - Background Image Handler */

function initializeBackgroundImageHandler() {
    const templateEditor = window.templateEditor;
    if (!templateEditor || !templateEditor.initialized) {
        console.error("TemplateEditor not found or not initialized. Background Image Handler cannot initialize.");
        return;
    }
    console.log("BackgroundImageHandler: TemplateEditor found, proceeding with initialization.");

    const backgroundTypeButtons = document.querySelectorAll("[data-background-type]");
    const backgroundLibraryContainer = document.getElementById("background-library-container");
    const backgroundDarknessSlider = document.getElementById("background-darkness-slider");
    const backgroundDarknessValue = document.getElementById("background-darkness-value");
    const customBackgroundUpload = document.getElementById("custom-background-upload");

    let currentBackgroundType = "aerial-track"; // Default type
    let currentDarkness = 0.3; // Default darkness

    const defaultBackgrounds = {
        "aerial-track": [
            { name: "Aerial Track Dark", url: "/assets/images/backgrounds/aerial_track_dark.jpg" },
            { name: "Aerial Track Dusk", url: "/assets/images/backgrounds/aerial_track_dusk.jpg" },
            { name: "Checkered Flag Dark", url: "/assets/images/backgrounds/checkered_flag_dark.jpg" }
        ],
        "texture": [
            { name: "Dark Texture 1", url: "/assets/images/backgrounds/texture_dark_1.jpg" },
            { name: "Metal Plate", url: "/assets/images/backgrounds/texture_metal_plate.jpg" }
        ],
        "solid-color": [
            { name: "Black", color: "#000000" },
            { name: "Halvor Lines Red", color: "#D12026" },
            { name: "Dark Gray", color: "#333333" }
        ]
    };

    function renderBackgroundLibrary() {
        if (!backgroundLibraryContainer) return;
        backgroundLibraryContainer.innerHTML = "";
        const backgrounds = defaultBackgrounds[currentBackgroundType] || [];

        backgrounds.forEach(bg => {
            const thumb = document.createElement("img");
            thumb.classList.add("bg-thumbnail", "w-16", "h-10", "object-cover", "rounded", "cursor-pointer", "border-2", "border-transparent", "hover:border-red-500");
            thumb.alt = bg.name;
            if (bg.url) {
                thumb.src = bg.url;
                thumb.addEventListener("click", () => {
                    templateEditor.setBackgroundImage(bg.url, currentDarkness);
                    updateSelectedThumbnail(thumb);
                });
            } else if (bg.color) {
                thumb.style.backgroundColor = bg.color;
                thumb.src = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`; // Transparent pixel
                thumb.addEventListener("click", () => {
                    templateEditor.canvas.setBackgroundColor(bg.color, templateEditor.canvas.renderAll.bind(templateEditor.canvas));
                    templateEditor.canvas.setBackgroundImage(null, templateEditor.canvas.renderAll.bind(templateEditor.canvas)); // Clear image bg
                    updateSelectedThumbnail(thumb);
                });
            }
            backgroundLibraryContainer.appendChild(thumb);
        });
    }

    function updateSelectedThumbnail(selectedThumb) {
        document.querySelectorAll(".bg-thumbnail.selected").forEach(t => t.classList.remove("selected", "border-red-500"));
        if (selectedThumb) {
            selectedThumb.classList.add("selected", "border-red-500");
        }
    }

    if (backgroundTypeButtons) {
        backgroundTypeButtons.forEach(button => {
            button.addEventListener("click", () => {
                currentBackgroundType = button.dataset.backgroundType;
                backgroundTypeButtons.forEach(btn => btn.classList.remove("bg-red-600", "text-white"));
                button.classList.add("bg-red-600", "text-white");
                renderBackgroundLibrary();
            });
        });
    }

    if (backgroundDarknessSlider && backgroundDarknessValue) {
        backgroundDarknessSlider.value = currentDarkness * 100;
        backgroundDarknessValue.textContent = `${Math.round(currentDarkness * 100)}%`;
        backgroundDarknessSlider.addEventListener("input", (event) => {
            currentDarkness = parseFloat(event.target.value) / 100;
            backgroundDarknessValue.textContent = `${event.target.value}%`;
            const currentBgImage = templateEditor.canvas.backgroundImage;
            if (currentBgImage && currentBgImage.getSrc) {
                 templateEditor.setBackgroundImage(currentBgImage.getSrc(), currentDarkness);
            } else if (templateEditor.canvas.backgroundColor && currentBackgroundType === "solid-color") {
                // Solid colors don't use darkness overlay in this implementation
            } else {
                const selectedThumb = backgroundLibraryContainer ? backgroundLibraryContainer.querySelector(".bg-thumbnail.selected") : null;
                if(selectedThumb && selectedThumb.src && !selectedThumb.src.startsWith("data:image")){
                    templateEditor.setBackgroundImage(selectedThumb.src, currentDarkness);
                }
            }
        });
    }

    if (customBackgroundUpload) {
        customBackgroundUpload.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    templateEditor.setBackgroundImage(e.target.result, currentDarkness);
                    updateSelectedThumbnail(null); // Clear library selection
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Initial render of the default background type
    if (backgroundTypeButtons.length > 0) {
        const defaultTypeButton = Array.from(backgroundTypeButtons).find(btn => btn.dataset.backgroundType === currentBackgroundType);
        if (defaultTypeButton) defaultTypeButton.click();
        else backgroundTypeButtons[0].click(); // Fallback to first button
    } else {
        renderBackgroundLibrary();
    }

    // Expose a function to TemplateEditor to set background from loaded template data
    templateEditor.applyBackgroundFromData = function(backgroundDetails) {
        if (!backgroundDetails) return;
        console.log("Applying background from data:", backgroundDetails);

        if (backgroundDetails.type === "image" && backgroundDetails.url) {
            currentBackgroundType = "aerial-track"; // Assume image is aerial for now
            currentDarkness = backgroundDetails.darkness !== undefined ? backgroundDetails.darkness : 0.3;
            if (backgroundDarknessSlider) backgroundDarknessSlider.value = currentDarkness * 100;
            if (backgroundDarknessValue) backgroundDarknessValue.textContent = `${Math.round(currentDarkness * 100)}%`;
            
            // Update UI for background type
            backgroundTypeButtons.forEach(btn => {
                btn.classList.remove("bg-red-600", "text-white");
                if(btn.dataset.backgroundType === currentBackgroundType) btn.classList.add("bg-red-600", "text-white");
            });
            renderBackgroundLibrary(); // Re-render library for the correct type
            
            this.setBackgroundImage(backgroundDetails.url, currentDarkness);
            // Try to find and select the thumbnail if it's in the default list
            const matchingThumb = Array.from(backgroundLibraryContainer.querySelectorAll(".bg-thumbnail")).find(t => t.src === backgroundDetails.url);
            updateSelectedThumbnail(matchingThumb);

        } else if (backgroundDetails.type === "color" && backgroundDetails.color) {
            currentBackgroundType = "solid-color";
            this.canvas.setBackgroundColor(backgroundDetails.color, this.canvas.renderAll.bind(this.canvas));
            this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
            
            // Update UI for background type
            backgroundTypeButtons.forEach(btn => {
                btn.classList.remove("bg-red-600", "text-white");
                if(btn.dataset.backgroundType === currentBackgroundType) btn.classList.add("bg-red-600", "text-white");
            });
            renderBackgroundLibrary(); // Re-render library for the correct type
            const matchingThumb = Array.from(backgroundLibraryContainer.querySelectorAll(".bg-thumbnail")).find(t => t.style.backgroundColor === backgroundDetails.color);
            updateSelectedThumbnail(matchingThumb);
        }
    };
    console.log("BackgroundImageHandler initialized successfully.");
}

// Wait for TemplateEditor to be initialized
window.addEventListener("templateEditorInitialized", () => {
    console.log("BackgroundImageHandler: templateEditorInitialized event received.");
    initializeBackgroundImageHandler();
});

