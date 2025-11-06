'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownPage = ({ filePath }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filePath) {
      setError('Nenhum caminho de arquivo fornecido');
      setLoading(false);
      return;
    }

    const fetchMarkdown = async () => {
      setLoading(true);
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Erro ao carregar o arquivo: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar o Markdown:', err);
        setError(`Erro ao carregar o conteúdo: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [filePath]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>;
  }

  return (
    <div className="markdown-content p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export { MarkdownPage };