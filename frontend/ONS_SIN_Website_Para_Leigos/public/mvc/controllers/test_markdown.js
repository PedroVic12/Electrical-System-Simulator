const { renderMarkdownFile } = require('./renderMarkdown.js');

async function runTest() {
  // IMPORTANTE: Troque pelo nome de um arquivo .md que realmente exista na sua pasta /models/notes/
  const fileName = 'linhas_transmissao.md'; 
  
  console.log(`Testing renderMarkdownFile with: ${fileName}`);
  
  const result = await renderMarkdownFile(fileName);
  
  if (result.success) {
    console.log('✅ Teste bem-sucedido!');
    console.log('--- Saída HTML ---');
    console.log(result.html);
    console.log('--------------------');
  } else {
    console.error('❌ Teste falhou!');
    console.error('Erro:', result.error);
  }
}

runTest();
