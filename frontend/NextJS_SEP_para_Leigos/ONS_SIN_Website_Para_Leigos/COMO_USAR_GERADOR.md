# 🤖 Como Usar o Gerador de Projetos Next.js

## 📋 Pré-requisitos

- Node.js instalado (versão 18+)
- npm ou yarn
- Arquivo HTML de referência

---

## 🚀 Uso Básico

### 1. Executar o Script

```bash
node create-nextjs-from-html.js <arquivo.html> <nome-do-projeto>
```

### 2. Exemplo Prático

```bash
# Criar projeto a partir do index.html
node create-nextjs-from-html.js ../../../index.html MeuProjetoEletrico

# Ou com caminho absoluto
node create-nextjs-from-html.js /caminho/completo/index.html NovoSistemaEletrico
```

### 3. Instalar Dependências

```bash
cd MeuProjetoEletrico
npm install
```

### 4. Executar

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 📁 O que é Criado

```
MeuProjetoEletrico/
├── app/
│   ├── page.jsx          ✅ Página principal (com HTML original comentado)
│   ├── layout.jsx        ✅ Layout com Inter font
│   └── globals.css       ✅ Estilos completos + Tailwind
│
├── public/
│   ├── mvc/
│   │   ├── models/
│   │   │   ├── AppDataModel.js
│   │   │   └── notes/    ✅ Pasta para notas .md
│   │   ├── views/        ✅ Pasta para views
│   │   └── controllers/
│   │       └── DatabaseController.js
│   └── assets/           ✅ Pasta para imagens/arquivos
│
├── package.json          ✅ Dependências configuradas
├── tailwind.config.js    ✅ Tailwind configurado
├── postcss.config.js     ✅ PostCSS configurado
├── next.config.js        ✅ Next.js configurado
├── .gitignore            ✅ Git configurado
└── README.md             ✅ Documentação automática
```

---

## 🎯 Fluxo de Trabalho

### Passo 1: Criar Projeto

```bash
node create-nextjs-from-html.js index.html MeuProjeto
```

**Saída:**
```
ℹ 🚀 Iniciando criação do projeto Next.js...
✅ Diretório criado: MeuProjeto
ℹ 📁 Criando estrutura de pastas...
✅ Diretório criado: MeuProjeto/app
✅ Diretório criado: MeuProjeto/public
✅ Diretório criado: MeuProjeto/public/mvc
...
ℹ 📝 Criando arquivos de configuração...
✅ Arquivo criado: MeuProjeto/package.json
✅ Arquivo criado: MeuProjeto/tailwind.config.js
...
✅ Projeto criado com sucesso: MeuProjeto

📋 Próximos passos:
   cd MeuProjeto
   npm install
   npm run dev

🌐 Acesse: http://localhost:3000
```

### Passo 2: Instalar

```bash
cd MeuProjeto
npm install
```

**Aguarde a instalação** (~150 pacotes)

### Passo 3: Personalizar

Edite `app/page.jsx` com seus componentes React.

O HTML original está comentado no final do arquivo para referência!

### Passo 4: Adicionar Notas

Crie arquivos `.md` em `public/mvc/models/notes/`:

```bash
# Exemplo
echo "# Minha Nota\n\nConteúdo da nota..." > public/mvc/models/notes/minha-nota.md
```

### Passo 5: Executar

```bash
npm run dev
```

---

## 🔧 Customizações

### Alterar Versões das Dependências

Edite o script `create-nextjs-from-html.js`:

```javascript
const TEMPLATE_CONFIG = {
  nextVersion: '^14.2.0',      // ← Altere aqui
  reactVersion: '^18.3.0',     // ← Altere aqui
  tailwindVersion: '^3.4.0',   // ← Altere aqui
  chartjsVersion: '^4.4.0'     // ← Altere aqui
}
```

### Adicionar Mais Dependências

No template `packageJson`:

```javascript
packageJson: (projectName) => `{
  ...
  "dependencies": {
    "next": "${TEMPLATE_CONFIG.nextVersion}",
    "react": "${TEMPLATE_CONFIG.reactVersion}",
    "react-dom": "${TEMPLATE_CONFIG.reactVersion}",
    "chart.js": "${TEMPLATE_CONFIG.chartjsVersion}",
    "react-chartjs-2": "^5.2.0",
    "axios": "^1.6.0",          // ← Adicione aqui
    "lodash": "^4.17.21"        // ← Adicione aqui
  },
  ...
}`
```

### Customizar Estilos Globais

Edite o template `globalsCss` no script.

### Adicionar Mais Pastas

No código principal:

```javascript
createDirectory(path.join(projectPath, 'components'))
createDirectory(path.join(projectPath, 'lib'))
createDirectory(path.join(projectPath, 'utils'))
```

---

## 📚 Exemplos de Uso

### Exemplo 1: Projeto Simples

```bash
node create-nextjs-from-html.js landing.html LandingPage
cd LandingPage
npm install
npm run dev
```

### Exemplo 2: Sistema Complexo

```bash
node create-nextjs-from-html.js sistema-completo.html SistemaEletrico
cd SistemaEletrico
npm install

# Adicionar notas
echo "# Hidrelétricas..." > public/mvc/models/notes/hidreletricas.md
echo "# Eólicas..." > public/mvc/models/notes/eolicas.md

# Copiar assets
cp -r ../assets/* public/assets/

npm run dev
```

### Exemplo 3: Múltiplos Projetos

```bash
# Criar vários projetos de uma vez
node create-nextjs-from-html.js projeto1.html Projeto1
node create-nextjs-from-html.js projeto2.html Projeto2
node create-nextjs-from-html.js projeto3.html Projeto3

# Instalar todos
for dir in Projeto*; do
  cd $dir
  npm install
  cd ..
done
```

---

## 🐛 Troubleshooting

### Erro: "Projeto já existe"

**Solução**: Escolha outro nome ou delete o projeto existente

```bash
rm -rf MeuProjeto
node create-nextjs-from-html.js index.html MeuProjeto
```

### Erro: "Arquivo HTML não encontrado"

**Solução**: Verifique o caminho do arquivo

```bash
# Use caminho absoluto
node create-nextjs-from-html.js /caminho/completo/index.html MeuProjeto

# Ou relativo correto
node create-nextjs-from-html.js ../../../index.html MeuProjeto
```

### Erro: "npm install falhou"

**Solução**: Limpe cache e tente novamente

```bash
npm cache clean --force
cd MeuProjeto
npm install
```

### Erro: "Port 3000 já em uso"

**Solução**: Use outra porta

```bash
npm run dev -- -p 3001
```

---

## 🎨 Boas Práticas

### 1. Organize Seus HTMLs

```
html-sources/
├── landing.html
├── dashboard.html
├── sistema.html
└── admin.html
```

### 2. Use Nomes Descritivos

```bash
# ❌ Ruim
node create-nextjs-from-html.js index.html proj1

# ✅ Bom
node create-nextjs-from-html.js sistema-eletrico.html SistemaEletricoPotencia
```

### 3. Documente Suas Alterações

Após criar o projeto, edite o `README.md` gerado!

### 4. Versionamento

```bash
cd MeuProjeto
git init
git add .
git commit -m "Projeto inicial criado pelo gerador"
```

### 5. Backup do HTML Original

O script já inclui o HTML original comentado em `page.jsx`!

---

## 🚀 Próximos Passos

Após criar o projeto:

1. ✅ Instalar dependências
2. ✅ Copiar assets para `public/assets/`
3. ✅ Criar notas em `public/mvc/models/notes/`
4. ✅ Personalizar `app/page.jsx`
5. ✅ Testar responsividade
6. ✅ Deploy (Vercel, Netlify, etc.)

---

## 📊 Comparação

| Método | Tempo | Complexidade | Resultado |
|--------|-------|--------------|-----------|
| Manual | ~30min | Alta | Personalizado |
| **Script** | **~2min** | **Baixa** | **Padronizado** |
| create-next-app | ~5min | Média | Básico |

---

## 💡 Dicas

### Dica 1: Crie um Alias

Adicione ao seu `.bashrc` ou `.zshrc`:

```bash
alias create-next='node /caminho/para/create-nextjs-from-html.js'
```

Uso:

```bash
create-next index.html MeuProjeto
```

### Dica 2: Script em PATH

```bash
# Tornar executável
chmod +x create-nextjs-from-html.js

# Mover para /usr/local/bin
sudo mv create-nextjs-from-html.js /usr/local/bin/create-next

# Usar de qualquer lugar
create-next index.html MeuProjeto
```

### Dica 3: Automatize com Shell Script

Crie `criar-multiplos.sh`:

```bash
#!/bin/bash

for html in *.html; do
  nome=$(basename "$html" .html)
  node create-nextjs-from-html.js "$html" "$nome-nextjs"
done
```

---

## 🎉 Conclusão

O gerador de projetos Next.js:

✅ **Economiza tempo** (2min vs 30min)  
✅ **Padroniza estrutura** (MVC + Tailwind)  
✅ **Facilita manutenção** (tudo organizado)  
✅ **Inclui boas práticas** (responsividade, SEO)  
✅ **Pronto para produção** (build otimizado)  

**Use e abuse! 🚀**
