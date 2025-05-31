# GitHub Pages Research Findings for Halvor Lines Speedway Marketing Tool

## GitHub Pages Capabilities and Limitations

### Basic Capabilities
- Static site hosting service that serves HTML, CSS, and JavaScript files
- Files are served directly from a GitHub repository
- Supports custom domains
- Free hosting with HTTPS support
- Integrates with GitHub Actions for build processes

### Key Limitations
- Cannot execute server-side code (PHP, Node.js, Python, etc.)
- 1GB repository size limit
- 1GB published site size limit
- 100GB monthly bandwidth soft limit
- 10 builds per hour limit (unless using custom GitHub Actions workflow)

### Client-Side JavaScript Capabilities
- Full support for modern JavaScript features
- Can use client-side frameworks (React, Vue, etc.)
- Access to browser APIs (localStorage, sessionStorage, etc.)
- Can make API calls to external services
- No server-side processing or database capabilities

## Potential Technologies for Content Creation Tool

### HTML5 Canvas
- Powerful for creating graphics and visual content
- Can be used to create custom designs with JavaScript
- Supports image manipulation and drawing
- Can export to image formats (PNG, JPEG)

### Client-Side Libraries
- **html2pdf.js**: Converts HTML elements to PDF entirely client-side
- **html2canvas**: Captures screenshots of webpage elements
- **jsPDF**: Client-side PDF generation
- **Konva.js**: Canvas-based drawing and design editor
- **FileSaver.js**: Client-side file saving

### Data Storage Options
- Browser localStorage/sessionStorage for temporary data
- Client-side export to files (no server storage)
- Could integrate with external services via API (with user credentials)

### Template Management
- Templates can be stored as JSON or HTML structures
- Can be loaded dynamically from repository files
- User customizations can be handled in-browser

## Feasible Approach for Halvor Lines Speedway Tool

### Architecture
1. Static GitHub Pages site with HTML, CSS, and JavaScript
2. Client-side JavaScript application (possibly using a framework like React)
3. Templates stored as structured data (JSON)
4. Canvas-based editor for visual customization
5. Client-side export functionality for finished marketing materials

### User Flow
1. User browses available marketing templates
2. Selects a template to customize
3. Edits content, colors, and images in browser
4. Previews the final result
5. Exports to desired format (image, PDF, or HTML)

### Technical Considerations
- All processing must happen client-side
- No user data will persist between sessions unless exported
- Templates must be pre-defined in the repository
- Image handling will require client-side processing
- Export options limited to what browsers support

### Integration with Existing Templates
- Convert existing markdown templates to JSON format
- Structure templates with editable regions
- Define customization parameters for each template
- Create preview renderers for each template type

## Next Steps
1. Design the web-based content creator concept
2. Create a detailed project structure
3. Implement template viewing functionality
4. Build content creation tools
5. Add export capabilities
6. Deploy and document the solution

