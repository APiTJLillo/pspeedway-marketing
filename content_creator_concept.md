# Web-Based Content Creator Concept for Halvor Lines Speedway

## Overview

The Halvor Lines Speedway Marketing Tool will be a GitHub Pages-hosted web application that allows staff to easily create, customize, and export marketing materials based on pre-designed templates. The tool will be entirely client-side, requiring no server infrastructure while providing a user-friendly interface for content creation.

## User Interface Design

### Main Layout
```
+-------------------------------------------------------+
| HALVOR LINES SPEEDWAY MARKETING TOOL                [?] |
+-------------------------------------------------------+
|                                                       |
| +-------------+  +-------------------------------+    |
| | TEMPLATE    |  |                               |    |
| | CATEGORIES  |  |       TEMPLATE BROWSER        |    |
| |             |  |                               |    |
| | - Race      |  | [Template] [Template] [Temp]  |    |
| |   Results   |  |                               |    |
| | - Bus Races |  | [Template] [Template] [Temp]  |    |
| | - Silver    |  |                               |    |
| |   1000      |  | [Template] [Template] [Temp]  |    |
| | - Email     |  |                               |    |
| | - Website   |  |                               |    |
| |             |  |                               |    |
| +-------------+  +-------------------------------+    |
|                                                       |
+-------------------------------------------------------+
```

### Template Editor
```
+-------------------------------------------------------+
| HALVOR LINES SPEEDWAY MARKETING TOOL            [BACK]   |
+-------------------------------------------------------+
| EDITING: Race Results Template                        |
+-------------------------------------------------------+
|                                                       |
| +-------------+  +-------------------------------+    |
| | EDIT        |  |                               |    |
| | CONTROLS    |  |                               |    |
| |             |  |                               |    |
| | Text        |  |                               |    |
| | - Title     |  |         CANVAS PREVIEW        |    |
| | - Date      |  |                               |    |
| | - Winners   |  |                               |    |
| |             |  |                               |    |
| | Colors      |  |                               |    |
| | - Primary   |  |                               |    |
| | - Secondary |  |                               |    |
| |             |  |                               |    |
| | Images      |  |                               |    |
| | - Logo      |  |                               |    |
| | - Photo     |  |                               |    |
| |             |  |                               |    |
| +-------------+  +-------------------------------+    |
|                                                       |
| [RESET]  [PREVIEW]  [DOWNLOAD IMAGE]  [DOWNLOAD PDF]  |
+-------------------------------------------------------+
```

### Strategy Browser
```
+-------------------------------------------------------+
| HALVOR LINES SPEEDWAY MARKETING TOOL                [?] |
+-------------------------------------------------------+
|                                                       |
| +-------------+  +-------------------------------+    |
| | STRATEGY    |  |                               |    |
| | CATEGORIES  |  |       STRATEGY BROWSER        |    |
| |             |  |                               |    |
| | - Social    |  | Social Media Strategy         |    |
| |   Media     |  | ----------------------        |    |
| | - Email     |  | Platform-specific approaches  |    |
| |   Marketing |  | and best practices for        |    |
| | - Website   |  | promoting races and events    |    |
| |   Content   |  |                               |    |
| | - Integrated|  | [VIEW DETAILS]                |    |
| |   Calendar  |  |                               |    |
| |             |  |                               |    |
| +-------------+  +-------------------------------+    |
|                                                       |
+-------------------------------------------------------+
```

## Core Features

### 1. Template Browser
- Categorized display of all available templates
- Visual preview thumbnails
- Filtering by template type (social media, email, website)
- Search functionality by template name or purpose

### 2. Template Editor
- Canvas-based visual editor for each template type
- Text editing with font controls
- Color selection with brand color presets
- Image upload and placement
- Drag-and-drop positioning of elements (where applicable)
- Real-time preview of changes

### 3. Strategy Browser
- Searchable repository of marketing strategies
- Categorized by channel (social, email, website)
- Interactive calendar view for timing recommendations
- Printable/downloadable strategy guides

### 4. Export Options
- Download as image (PNG, JPEG)
- Download as PDF
- Copy HTML (for email templates)
- Direct share to clipboard

## Technical Architecture

### Component Structure
```
Halvor Lines Marketing Tool
├── App Container
│   ├── Navigation
│   ├── Template Browser
│   │   ├── Category Filter
│   │   ├── Template Card
│   │   └── Search
│   ├── Template Editor
│   │   ├── Canvas Component
│   │   ├── Text Controls
│   │   ├── Color Controls
│   │   ├── Image Controls
│   │   └── Export Controls
│   ├── Strategy Browser
│   │   ├── Category Filter
│   │   ├── Strategy Card
│   │   └── Strategy Detail View
│   └── Footer
```

### Data Structure

#### Template Definition
```json
{
  "id": "race_results_facebook",
  "name": "Race Results - Facebook",
  "category": "social_media",
  "subcategory": "race_results",
  "dimensions": {
    "width": 1200,
    "height": 1200
  },
  "elements": [
    {
      "type": "image",
      "id": "background",
      "src": "assets/templates/race_results/background.jpg",
      "x": 0,
      "y": 0,
      "width": 1200,
      "height": 1200,
      "editable": true
    },
    {
      "type": "image",
      "id": "logo",
      "src": "assets/branding/logo.png",
      "x": 50,
      "y": 50,
      "width": 200,
      "height": 100,
      "editable": true
    },
    {
      "type": "text",
      "id": "title",
      "text": "RACE RESULTS",
      "x": 600,
      "y": 200,
      "fontSize": 72,
      "fontFamily": "Racing Sans One",
      "color": "#FFFFFF",
      "alignment": "center",
      "editable": true
    },
    {
      "type": "text",
      "id": "date",
      "text": "JUNE 15, 2025",
      "x": 600,
      "y": 280,
      "fontSize": 36,
      "fontFamily": "Oswald",
      "color": "#FFDD00",
      "alignment": "center",
      "editable": true
    },
    {
      "type": "text",
      "id": "class_name",
      "text": "WISSOTA LATE MODELS",
      "x": 600,
      "y": 350,
      "fontSize": 42,
      "fontFamily": "Oswald",
      "color": "#FFFFFF",
      "alignment": "center",
      "editable": true
    },
    {
      "type": "text",
      "id": "first_place",
      "text": "1ST PLACE: DRIVER NAME #00",
      "x": 600,
      "y": 450,
      "fontSize": 36,
      "fontFamily": "Oswald",
      "color": "#FFFFFF",
      "alignment": "center",
      "editable": true
    },
    // Additional placeholders for 2nd-5th place
  ]
}
```

#### Strategy Content
```json
{
  "id": "social_media_strategy",
  "name": "Social Media Strategy",
  "category": "strategy",
  "content": "path/to/social_media_strategy.md",
  "summary": "Platform-specific approaches and best practices for promoting races and events on social media.",
  "related_templates": ["race_results_facebook", "bus_races_instagram", "silver_1000_twitter"]
}
```

## Implementation Approach

### Phase 1: Basic Structure and Template Viewer
- Set up GitHub Pages repository
- Create basic HTML/CSS/JS structure
- Implement template browser with static data
- Build strategy browser with markdown rendering

### Phase 2: Template Editor Core
- Implement canvas-based editor
- Add text editing functionality
- Add color selection tools
- Create export to image functionality

### Phase 3: Advanced Features
- Add image upload and placement
- Implement template-specific customization options
- Create PDF export functionality
- Add responsive design for mobile use

### Phase 4: Refinement and Documentation
- User testing and feedback
- Performance optimization
- Create comprehensive documentation
- Final deployment and testing

## Technologies

### Core
- HTML5/CSS3/JavaScript
- GitHub Pages for hosting

### Libraries
- **Fabric.js**: Canvas manipulation library for the editor
- **html2canvas**: For capturing designs as images
- **jsPDF**: For PDF generation
- **marked**: For rendering markdown strategy documents
- **FileSaver.js**: For client-side file downloads

### Design
- Tailwind CSS for styling
- Responsive design principles
- Halvor Lines Speedway brand colors and fonts

## User Experience Considerations

### Ease of Use
- Intuitive interface requiring minimal training
- Tooltips and help documentation
- Consistent UI patterns across template types

### Performance
- Optimize image assets for web
- Lazy loading of templates and assets
- Client-side caching where appropriate

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast

## Limitations and Considerations

### Technical Limitations
- All processing must happen client-side
- Limited to browser capabilities for file handling
- No server-side storage of user creations
- Image upload size limitations

### Workarounds
- Clear instructions for saving/exporting work
- Local storage for work-in-progress (with limitations)
- Optimized templates to work within constraints

## Next Steps
1. Create detailed mockups of key screens
2. Develop project structure and repository setup
3. Implement core functionality proof-of-concept
4. Gather feedback on initial implementation

