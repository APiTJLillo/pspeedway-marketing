# Proctor-Style Template Implementation Guide

This guide provides step-by-step instructions for implementing the Proctor Speedway-inspired templates into your Halverson Speedway Marketing Tool editor.

## Overview

The Proctor Speedway marketing materials feature a distinctive visual style with:
- Dark backgrounds with aerial track photos
- Yellow-to-red gradient logos
- Three-tier color hierarchy (yellow headlines, white secondary text, silver accents)
- Clean, minimalist layouts with strong visual impact

This guide will help you implement these design elements in your existing editor.

## 1. File Structure Updates

### New Files to Add

1. **Background Image Handler**
   - File: `/js/background-image-handler.js`
   - Purpose: Manages background image uploads and application to templates

2. **Proctor-Style Templates**
   - File: `/assets/templates/proctor-templates.json`
   - Purpose: Contains template definitions for the new Proctor-style templates

3. **Default Background Images**
   - Directory: `/assets/images/backgrounds/`
   - Files to include:
     - `aerial_track_dark.jpg`
     - `aerial_track_dusk.jpg`
     - `checkered_flag_dark.jpg`
     - `solid_black.jpg`

### Files to Modify

1. **Main HTML Files**
   - `editor.html`: Add script reference to background-image-handler.js
   - `index.html`: Update template thumbnails to include new Proctor-style templates

2. **Template Data**
   - `template-data.json`: Add new Proctor-style templates or merge with proctor-templates.json

3. **CSS Styles**
   - `styles.css`: Add new styles for background controls

## 2. Background Image Implementation

### Step 1: Create Background Images Directory

```bash
mkdir -p /assets/images/backgrounds
```

### Step 2: Add Default Background Images

Obtain aerial track photos and add them to the backgrounds directory. Ensure they have dark overlays or are naturally dark for good text contrast.

### Step 3: Include Background Image Handler

Add the following script tag to `editor.html` before the closing `</body>` tag:

```html
<script src="/js/background-image-handler.js"></script>
```

## 3. Template JSON Structure

Add the following templates to your `template-data.json` file under the appropriate categories:

### Race Results Template (Proctor Style)

```json
{
  "id": "race_results_proctor",
  "name": "Race Results - Proctor Style",
  "description": "Clean, dark template for posting race results with aerial track background",
  "platform": "Facebook",
  "width": 1200,
  "height": 630,
  "thumbnail": "/assets/images/templates/race_results_proctor.jpg",
  "elements": [
    {
      "type": "background",
      "src": "/assets/images/backgrounds/aerial_track_dark.jpg"
    },
    {
      "type": "shape",
      "shape": "rect",
      "left": 0,
      "top": 0,
      "width": 1200,
      "height": 100,
      "fill": "#000000",
      "opacity": 0.7,
      "id": "header_overlay"
    },
    {
      "type": "text",
      "text": "PROCTOR SPEEDWAY",
      "left": 600,
      "top": 50,
      "fontFamily": "Racing Sans One",
      "fontSize": 60,
      "color": "#FFDD00",
      "textAlign": "center",
      "id": "header_text"
    },
    {
      "type": "text",
      "text": "RACE RESULTS",
      "left": 600,
      "top": 200,
      "fontFamily": "Racing Sans One",
      "fontSize": 80,
      "color": "#FFDD00",
      "textAlign": "center",
      "id": "title_text"
    },
    {
      "type": "text",
      "text": "APRIL 15, 2025",
      "left": 600,
      "top": 280,
      "fontFamily": "Oswald",
      "fontSize": 40,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "date_text"
    },
    {
      "type": "text",
      "text": "LATE MODEL DIVISION",
      "left": 600,
      "top": 350,
      "fontFamily": "Racing Sans One",
      "fontSize": 50,
      "color": "#C0C0C0",
      "textAlign": "center",
      "id": "division_text"
    },
    {
      "type": "text",
      "text": "1st Place: John Smith #42",
      "left": 600,
      "top": 420,
      "fontFamily": "Oswald",
      "fontSize": 36,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "first_place"
    },
    {
      "type": "text",
      "text": "2nd Place: Mike Johnson #17",
      "left": 600,
      "top": 470,
      "fontFamily": "Oswald",
      "fontSize": 36,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "second_place"
    },
    {
      "type": "text",
      "text": "3rd Place: Sarah Williams #88",
      "left": 600,
      "top": 520,
      "fontFamily": "Oswald",
      "fontSize": 36,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "third_place"
    },
    {
      "type": "shape",
      "shape": "rect",
      "left": 0,
      "top": 580,
      "width": 1200,
      "height": 50,
      "fill": "#D12026",
      "id": "footer_bg"
    },
    {
      "type": "text",
      "text": "HALVERSON SPEEDWAY",
      "left": 600,
      "top": 605,
      "fontFamily": "Racing Sans One",
      "fontSize": 36,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "footer_text"
    }
  ]
}
```

### Silver 1000 Template (Proctor Style)

```json
{
  "id": "silver_1000_proctor",
  "name": "Silver 1000 - Proctor Style",
  "description": "Premium template for promoting the Silver 1000 event with aerial track background",
  "platform": "Facebook",
  "width": 1200,
  "height": 630,
  "thumbnail": "/assets/images/templates/silver_1000_proctor.jpg",
  "elements": [
    {
      "type": "background",
      "src": "/assets/images/backgrounds/aerial_track_dark.jpg"
    },
    {
      "type": "shape",
      "shape": "rect",
      "left": 0,
      "top": 0,
      "width": 1200,
      "height": 100,
      "fill": "#000000",
      "opacity": 0.7,
      "id": "header_overlay"
    },
    {
      "type": "text",
      "text": "HOME OF THE SILVER 1000",
      "left": 600,
      "top": 50,
      "fontFamily": "Racing Sans One",
      "fontSize": 40,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "header_text"
    },
    {
      "type": "text",
      "text": "SILVER 1000",
      "left": 600,
      "top": 250,
      "fontFamily": "Racing Sans One",
      "fontSize": 100,
      "color": "#FFDD00",
      "textAlign": "center",
      "id": "title_text"
    },
    {
      "type": "text",
      "text": "SEPTEMBER 26, 2025",
      "left": 600,
      "top": 350,
      "fontFamily": "Oswald",
      "fontSize": 50,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "date_text"
    },
    {
      "type": "text",
      "text": "WISSOTA LATE MODELS",
      "left": 600,
      "top": 430,
      "fontFamily": "Oswald",
      "fontSize": 40,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "division_text_1"
    },
    {
      "type": "text",
      "text": "WISSOTA MODIFIEDS",
      "left": 600,
      "top": 480,
      "fontFamily": "Oswald",
      "fontSize": 40,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "division_text_2"
    },
    {
      "type": "shape",
      "shape": "rect",
      "left": 0,
      "top": 580,
      "width": 1200,
      "height": 50,
      "fill": "#D12026",
      "id": "footer_bg"
    },
    {
      "type": "text",
      "text": "HALVERSON SPEEDWAY",
      "left": 600,
      "top": 605,
      "fontFamily": "Racing Sans One",
      "fontSize": 36,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "footer_text"
    }
  ]
}
```

### Event Announcement Template (Proctor Style)

```json
{
  "id": "event_announcement_proctor",
  "name": "Event Announcement - Proctor Style",
  "description": "Clean template for announcing upcoming races with aerial track background",
  "platform": "Facebook",
  "width": 1200,
  "height": 630,
  "thumbnail": "/assets/images/templates/event_announcement_proctor.jpg",
  "elements": [
    {
      "type": "background",
      "src": "/assets/images/backgrounds/aerial_track_dark.jpg"
    },
    {
      "type": "shape",
      "shape": "rect",
      "left": 0,
      "top": 0,
      "width": 1200,
      "height": 100,
      "fill": "#000000",
      "opacity": 0.7,
      "id": "header_overlay"
    },
    {
      "type": "text",
      "text": "HALVERSON SPEEDWAY",
      "left": 600,
      "top": 50,
      "fontFamily": "Racing Sans One",
      "fontSize": 60,
      "color": "#FFDD00",
      "textAlign": "center",
      "id": "header_text"
    },
    {
      "type": "text",
      "text": "RACE DAY",
      "left": 600,
      "top": 200,
      "fontFamily": "Racing Sans One",
      "fontSize": 100,
      "color": "#FFDD00",
      "textAlign": "center",
      "id": "title_text"
    },
    {
      "type": "text",
      "text": "APRIL 15, 2025",
      "left": 600,
      "top": 300,
      "fontFamily": "Oswald",
      "fontSize": 50,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "date_text"
    },
    {
      "type": "text",
      "text": "GATES OPEN AT 4:00 PM",
      "left": 600,
      "top": 380,
      "fontFamily": "Oswald",
      "fontSize": 36,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "gates_text"
    },
    {
      "type": "text",
      "text": "HOT LAPS 6:30 PM",
      "left": 600,
      "top": 430,
      "fontFamily": "Oswald",
      "fontSize": 36,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "hotlaps_text"
    },
    {
      "type": "text",
      "text": "RACING 7:00 PM",
      "left": 600,
      "top": 480,
      "fontFamily": "Oswald",
      "fontSize": 36,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "racing_text"
    },
    {
      "type": "text",
      "text": "TICKETS $25 | 12 & UNDER $5",
      "left": 600,
      "top": 530,
      "fontFamily": "Oswald",
      "fontSize": 36,
      "color": "#FFFFFF",
      "textAlign": "center",
      "id": "tickets_text"
    },
    {
      "type": "shape",
      "shape": "rect",
      "left": 0,
      "top": 580,
      "width": 1200,
      "height": 50,
      "fill": "#D12026",
      "id": "footer_bg"
    }
  ]
}
```

## 4. HTML Updates

### Update editor.html

Add the following code to include the background image handler:

```html
<!-- Add this before the closing </body> tag -->
<script src="/js/background-image-handler.js"></script>
```

### Update index.html

Add the new templates to the template selection page:

```html
<!-- Add these to the appropriate template category sections -->
<div class="template-card">
  <img src="/assets/images/templates/race_results_proctor.jpg" alt="Race Results - Proctor Style">
  <div class="template-info">
    <h3>Race Results - Proctor Style</h3>
    <p>Clean, dark template with aerial track background</p>
    <a href="/editor.html?template=race_results_proctor" class="btn">Edit Template</a>
  </div>
</div>

<div class="template-card">
  <img src="/assets/images/templates/silver_1000_proctor.jpg" alt="Silver 1000 - Proctor Style">
  <div class="template-info">
    <h3>Silver 1000 - Proctor Style</h3>
    <p>Premium template with aerial track background</p>
    <a href="/editor.html?template=silver_1000_proctor" class="btn">Edit Template</a>
  </div>
</div>

<div class="template-card">
  <img src="/assets/images/templates/event_announcement_proctor.jpg" alt="Event Announcement - Proctor Style">
  <div class="template-info">
    <h3>Event Announcement - Proctor Style</h3>
    <p>Clean template with aerial track background</p>
    <a href="/editor.html?template=event_announcement_proctor" class="btn">Edit Template</a>
  </div>
</div>
```

## 5. CSS Updates

Add the following styles to your CSS file:

```css
/* Background controls styling */
#background-controls {
  margin-bottom: 1.5rem;
}

.background-item {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.background-item:hover {
  transform: scale(1.05);
}

.background-item.selected {
  border: 2px solid #D12026;
}

#background-darkness {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  outline: none;
}

#background-darkness::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #D12026;
  cursor: pointer;
}

#background-darkness::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #D12026;
  cursor: pointer;
  border: none;
}
```

## 6. Creating Template Thumbnails

1. Launch your editor with each new template
2. Design the template with appropriate content
3. Use the "Download Image" feature to save the template
4. Resize the image to 300x200px for thumbnails
5. Save to `/assets/images/templates/` with the appropriate filename

## 7. Testing Your Implementation

1. Ensure all files are in the correct locations
2. Open the editor in your browser
3. Verify that the background image controls appear
4. Test uploading a custom background image
5. Test applying different backgrounds to templates
6. Test the darkness slider functionality
7. Create and save templates with the new backgrounds

## 8. Troubleshooting

### Common Issues

1. **Background images not loading**
   - Check file paths in template-data.json
   - Verify images exist in the backgrounds directory
   - Check browser console for errors

2. **Controls not appearing**
   - Verify background-image-handler.js is included in editor.html
   - Check if the script is loading after the editor is initialized

3. **Templates not showing in selection page**
   - Verify template IDs match between HTML and JSON files
   - Check thumbnail image paths

## 9. Next Steps

After implementing these changes, consider:

1. Creating additional Proctor-style templates for other platforms
2. Adding more background image options
3. Implementing a gradient generator for custom logo colors
4. Creating a template preview feature to show different background options

By following this guide, you'll successfully implement Proctor-style templates with enhanced background image functionality in your Halverson Speedway Marketing Tool.
