// pages/api/markdown.js
import { renderMarkdownFile } from './renderMarkdown.js';

export default async function handler(req, res) {
  const { file } = req.query;
  
  if (!file) {
    return res.status(400).json({ 
      success: false, 
      error: 'File parameter is required' 
    });
  }

  try {
    const result = await renderMarkdownFile(file);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ 
        success: false, 
        error: `Markdown file not found or failed to parse: ${file}`
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'An internal server error occurred.'
    });
  }
}