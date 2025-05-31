/* Halvor Lines Speedway Marketing Tool - UI Enhancer */

function initializeUIEnhancer() {
    const templateEditor = window.templateEditor;
    if (!templateEditor || !templateEditor.initialized) {
        console.error("TemplateEditor not found or not initialized. UI Enhancer cannot initialize.");
        return;
    }
    console.log("UIEnhancer: TemplateEditor found, proceeding with initialization.");

    // --- Color Scheme Presets ---
    const colorSchemeButtons = document.querySelectorAll("[data-color-scheme]");
    if (colorSchemeButtons) {
        colorSchemeButtons.forEach(button => {
            button.addEventListener("click", () => {
                const schemeName = button.dataset.colorScheme;
                applyColorScheme(schemeName);
                colorSchemeButtons.forEach(btn => btn.classList.remove("ring-2", "ring-red-500"));
                button.classList.add("ring-2", "ring-red-500");
            });
        });
    }

    function applyColorScheme(schemeName) {
        console.log(`Applying color scheme: ${schemeName}`);
        let primaryColor, secondaryColor, accentColor, backgroundColor, textColor;

        switch (schemeName) {
            case "proctor-dark":
                primaryColor = "#FFDD00"; // Yellow
                secondaryColor = "#FFFFFF"; // White
                accentColor = "#C0C0C0"; // Silver/Gray
                backgroundColor = "#000000"; // Black (often with image)
                textColor = "#FFFFFF";
                break;
            case "halverson-default": // Corrected to Halvor Lines in other places, should be consistent
                primaryColor = "#D12026"; // Red
                secondaryColor = "#FFFFFF"; // White
                accentColor = "#000000"; // Black
                backgroundColor = "#000000";
                textColor = "#FFFFFF";
                break;
        }
        templateEditor.canvas.getObjects().forEach(obj => {
            if (obj.type === 'text') {
                if (obj.id && obj.id.toLowerCase().includes("headline")) {
                    obj.set("fill", primaryColor);
                } else if (obj.id && obj.id.toLowerCase().includes("date")) {
                    obj.set("fill", secondaryColor);
                } else if (obj.id && obj.id.toLowerCase().includes("division")) {
                    obj.set("fill", accentColor);
                } else if (obj.id && (obj.id.toLowerCase().includes("place") || obj.id.toLowerCase().includes("position"))) {
                    obj.set("fill", secondaryColor); // Make positions white for visibility
                } else {
                    obj.set("fill", textColor);
                }
            }
        });
        templateEditor.canvas.renderAll();
        templateEditor.saveState();
    }

    // --- Quick Layout Options ---
    const quickLayoutButtons = document.querySelectorAll("[data-quick-layout]");
    if (quickLayoutButtons) {
        quickLayoutButtons.forEach(button => {
            button.addEventListener("click", () => {
                const layoutName = button.dataset.quickLayout;
                applyQuickLayout(layoutName);
                quickLayoutButtons.forEach(btn => btn.classList.remove("bg-red-600", "text-white"));
                button.classList.add("bg-red-600", "text-white");
            });
        });
    }

    function applyQuickLayout(layoutName) {
        console.log(`Applying quick layout: ${layoutName}`);
    }

    // --- Mobile Preview Toggle (Placeholder) ---
    const mobilePreviewToggle = document.getElementById("mobile-preview-toggle");
    if (mobilePreviewToggle) {
        mobilePreviewToggle.addEventListener("click", () => {
            const canvasWrapper = document.querySelector(".canvas-wrapper");
            if (canvasWrapper) {
                canvasWrapper.classList.toggle("mobile-view-simulation");
                console.log("Mobile preview toggled");
            }
        });
    }
    
    window.uiEnhancer = {
        applyColorScheme,
        applyQuickLayout
    };
    console.log("UIEnhancer initialized successfully.");
}

// Wait for TemplateEditor to be initialized
window.addEventListener("templateEditorInitialized", () => {
    console.log("UIEnhancer: templateEditorInitialized event received.");
    initializeUIEnhancer();
});