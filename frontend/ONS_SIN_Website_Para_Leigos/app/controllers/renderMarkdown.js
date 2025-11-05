// renderMarkdown.js
const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');



// npm install marked

async function renderMarkdownFile(folderPath, fileName, containerId = 'markdown-container') {
    try {
        // Validate input
        if (!folderPath || !fileName) {
            throw new Error('Folder path and file name are required');
        }

        // Ensure the file has .md extension
        if (!fileName.endsWith('.md')) {
            fileName += '.md';
        }

        // Create full file path
        const filePath = path.join(folderPath, fileName);
        
        // Read the markdown file
        const markdown = await fs.readFile(filePath, 'utf8');
        
        // Convert markdown to HTML
        const html = marked.parse(markdown);
        
        // Create a container with the HTML
        const container = document.createElement('div');
        container.id = containerId;
        container.className = 'markdown-container';
        container.innerHTML = html;

        // Add some basic styling
        const style = document.createElement('style');
        style.textContent = `
            .markdown-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .markdown-container h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            .markdown-container h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
            .markdown-container h3 { font-size: 1.25em; }
            .markdown-container pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
            .markdown-container code { background: rgba(27, 31, 35, 0.05); padding: 0.2em 0.4em; border-radius: 3px; }
            .markdown-container pre code { background: none; padding: 0; }
            .markdown-container a { color: #0366d6; text-decoration: none; }
            .markdown-container a:hover { text-decoration: underline; }
            .markdown-container blockquote { 
                border-left: 4px solid #dfe2e5; 
                color: #6a737d;
                padding: 0 1em;
                margin: 0 0 16px 0;
            }
            .markdown-container table { 
                border-collapse: collapse; 
                width: 100%;
                margin-bottom: 16px;
                display: block;
                overflow-x: auto;
            }
            .markdown-container th, .markdown-container td { 
                border: 1px solid #dfe2e5; 
                padding: 6px 13px; 
            }
            .markdown-container tr { background-color: #fff; border-top: 1px solid #c6cbd1; }
            .markdown-container tr:nth-child(2n) { background-color: #f6f8fa; }
        `;
        document.head.appendChild(style);

        // Add the container to the document
        document.body.appendChild(container);
        
        return { success: true, element: container };
    } catch (error) {
        console.error('Error rendering markdown:', error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'markdown-error';
        errorDiv.textContent = `Error loading markdown: ${error.message}`;
        document.body.appendChild(errorDiv);
        return { success: false, error: error.message };
    }
}

// Example usage:
// renderMarkdownFile('/path/to/your/markdown/files', 'example')
//   .then(result => console.log('Rendered markdown:', result))
//   .catch(console.error);

module.exports = renderMarkdownFile;