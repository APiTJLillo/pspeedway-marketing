/* Proctor Template Fix - Direct override for text colors and background */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for template editor to be fully initialized
    const checkForEditor = setInterval(function() {
        if (window.templateEditor && window.templateEditor.canvas) {
            clearInterval(checkForEditor);
            console.log("Proctor template fix: Editor detected, applying fixes");
            applyProctorTemplateFixes();
        }
    }, 500);
    
    // Timeout after 10 seconds to avoid infinite waiting
    setTimeout(function() {
        clearInterval(checkForEditor);
        console.log("Proctor template fix: Timeout reached, editor not found");
    }, 10000);
    
    function applyProctorTemplateFixes() {
        const canvas = window.templateEditor.canvas;
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('template');
        
        // Only apply fixes to the Proctor template
        if (templateId !== 'race_results_proctor_facebook') {
            console.log("Proctor template fix: Not a Proctor template, skipping");
            return;
        }
        
        console.log("Proctor template fix: Applying fixes to race_results_proctor_facebook template");
        
        // 1. Set background image
        const bgImageUrl = '/assets/images/backgrounds/aerial_track_dark.jpg';
        fabric.Image.fromURL(bgImageUrl, function(img) {
            // Scale image to cover canvas
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            // Calculate scaling to cover the canvas
            const scaleX = canvasWidth / img.width;
            const scaleY = canvasHeight / img.height;
            const scale = Math.max(scaleX, scaleY);
            
            // Center the image
            const left = (canvasWidth - img.width * scale) / 2;
            const top = (canvasHeight - img.height * scale) / 2;
            
            // Apply darkness overlay
            img.filters.push(new fabric.Image.filters.Brightness({
                brightness: -0.3 // Darken by 30%
            }));
            img.applyFilters();
            
            // Set as background
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: scale,
                scaleY: scale,
                left: left,
                top: top,
                originX: 'left',
                originY: 'top'
            });
            
            console.log("Proctor template fix: Background image applied");
        });
        
        // 2. Fix text colors
        canvas.getObjects().forEach(obj => {
            if (obj.type === 'text') {
                if (obj.id === "headline_text") {
                    obj.set("fill", "#FFDD00"); // Yellow
                    console.log("Proctor template fix: Set headline to yellow");
                } else if (obj.id === "division_text") {
                    obj.set("fill", "#C0C0C0"); // Silver
                    console.log("Proctor template fix: Set division to silver");
                } else if (obj.id === "footer_text") {
                    obj.set("fill", "#FFFFFF"); // White
                    console.log("Proctor template fix: Set footer to white");
                } else if (obj.id && (obj.id.includes("place") || obj.id.includes("position"))) {
                    obj.set("fill", "#FFFFFF"); // White
                    console.log("Proctor template fix: Set position text to white");
                } else {
                    obj.set("fill", "#FFFFFF"); // White for all other text
                    console.log("Proctor template fix: Set other text to white");
                }
            }
        });
        
        // 3. Render canvas
        canvas.renderAll();
        console.log("Proctor template fix: All fixes applied and canvas rendered");
    }
});
