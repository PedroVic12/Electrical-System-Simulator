const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

// Get the correct path to the notes directory
const NOTES_DIR = path.join(__dirname, '../models/notes');

// Custom renderer to add Tailwind CSS classes
const renderer = new marked.Renderer();

renderer.heading = (text, level) => {
  const classes = {
    1: 'text-4xl font-bold mb-4 border-b pb-2',
    2: 'text-3xl font-bold mb-3 border-b pb-2',
    3: 'text-2xl font-bold mb-2',
    4: 'text-xl font-bold mb-2',
    5: 'text-lg font-bold mb-1',
    6: 'text-base font-bold mb-1',
  };
  return `<h${level} class="${classes[level]}">${text}</h${level}>`;
};

renderer.paragraph = (text) => {
  return `<p class="mb-4 text-base leading-relaxed">${text}</p>`;
};

renderer.list = (body, ordered) => {
  const tag = ordered ? 'ol' : 'ul';
  const classes = ordered ? 'list-decimal list-inside my-4' : 'list-disc list-inside my-4';
  return `<${tag} class="${classes} pl-4">${body}</${tag}>`;
};

renderer.listitem = (text) => {
  return `<li class="mb-2">${text}</li>`;
};

renderer.blockquote = (quote) => {
  return `<blockquote class="border-l-4 border-gray-400 pl-4 italic my-4 bg-gray-50 p-4">${quote}</blockquote>`;
};

renderer.code = (code, language) => {
  // You might want to use a syntax highlighting library here and just add basic styling
  return `<pre><code class="language-${language} bg-gray-800 text-white p-4 rounded-md block overflow-x-auto">${code}</code></pre>`;
};

renderer.link = (href, title, text) => {
  return `<a href="${href}" title="${title}" class="text-blue-600 hover:underline">${text}</a>`;
};

renderer.image = (href, title, text) => {
  return `<img src="${href}" alt="${text}" title="${title}" class="max-w-full h-auto rounded-lg my-4 shadow-md">`;
};

renderer.table = (header, body) => {
  return `<div class="overflow-x-auto"><table class="min-w-full bg-white border border-gray-300"><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
};

renderer.tablerow = (content) => {
  return `<tr class="border-b">${content}</tr>`;
};

renderer.tablecell = (content, flags) => {
  const tag = flags.header ? 'th' : 'td';
  const align = flags.align ? `text-${flags.align}` : '';
  return `<${tag} class="p-2 border-r ${align}">${content}</${tag}>`;
};


marked.setOptions({ renderer });

async function renderMarkdownFile(fileName) {
    try {
        if (!fileName) {
            throw new Error('File name is required');
        }

        // Sanitize fileName to prevent directory traversal
        const safeFileName = path.normalize(fileName).replace(/^(\\.\\.[\/\\\\])+/, '');
        if (safeFileName !== fileName) {
            throw new Error('Invalid file name');
        }

        const filePath = path.join(NOTES_DIR, safeFileName.endsWith('.md') ? safeFileName : `${safeFileName}.md`);

        // Check if the resolved path is within the intended directory
        if (!filePath.startsWith(NOTES_DIR)) {
            throw new Error('Access denied');
        }
        
        const markdown = await fs.readFile(filePath, 'utf8');
        const html = marked.parse(markdown);
        
        return {
            success: true,
            html: `<div class="markdown-content p-4">${html}</div>`, // Wrap in a div with padding
        };

    } catch (error) {
        console.error('Error rendering markdown:', error.message);
        return { 
            success: false, 
            error: `Failed to render ${fileName}.`,
        };
    }
}

module.exports = { renderMarkdownFile };