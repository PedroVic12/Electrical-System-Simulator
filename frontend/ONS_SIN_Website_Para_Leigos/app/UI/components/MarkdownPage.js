'use client'; // Adicione esta linha no topo se estiver usando o App Router do Next.js


import React, { useState, useEffect } from 'react';

const MarkdownViewer = ({ fileName }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileName) return;

    // O componente busca os dados da sua API, que está em /pages/api/markdown.js
    fetch(`/api/markdown?file=${fileName}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erro ao buscar o arquivo: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          setHtmlContent(data.html);
        } else {
          throw new Error(data.error || 'Falha ao carregar o conteúdo.');
        }
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fileName]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-500">Erro: {error}</div>;
  }

  // A div renderiza o HTML que veio do servidor
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  );
};


export default function MarkdownPage(fileName) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Resultado da rota /api fazendo o Fetch do meu arquivo markdown</h1>
      
      {/* 
        Aqui você usa o componente para renderizar um arquivo .md da sua pasta /models/notes
        Basta passar o nome do arquivo como uma prop.
      */}
      <MarkdownViewer fileName={fileName} />

      <hr className="my-8" />



    </div>
  );
}
