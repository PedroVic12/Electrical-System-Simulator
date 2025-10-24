#!/usr/bin/env node

/**
 * ============================================================================
 * CREATE NEXT.JS FROM HTML - Script Gerador de Projetos Next.js
 * ============================================================================
 * 
 * Este script cria um projeto Next.js completo a partir de um arquivo HTML
 * 
 * Uso:
 *   node create-nextjs-from-html.js <arquivo.html> <nome-do-projeto>
 * 
 * Exemplo:
 *   node create-nextjs-from-html.js index.html MeuProjetoNextJS
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

const TEMPLATE_CONFIG = {
  nextVersion: '^14.2.0',
  reactVersion: '^18.3.0',
  tailwindVersion: '^3.4.0',
  chartjsVersion: '^4.4.0'
}

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m'  // Yellow
  }
  const reset = '\x1b[0m'
  const icon = {
    info: 'ℹ',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }
  
  console.log(`${colors[type]}${icon[type]} ${message}${reset}`)
}

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    log(`Diretório criado: ${dirPath}`, 'success')
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8')
  log(`Arquivo criado: ${filePath}`, 'success')
}

// ============================================================================
// TEMPLATES DE ARQUIVOS
// ============================================================================

const templates = {
  packageJson: (projectName) => `{
  "name": "${projectName.toLowerCase().replace(/\s+/g, '-')}",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "${TEMPLATE_CONFIG.nextVersion}",
    "react": "${TEMPLATE_CONFIG.reactVersion}",
    "react-dom": "${TEMPLATE_CONFIG.reactVersion}",
    "chart.js": "${TEMPLATE_CONFIG.chartjsVersion}",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "${TEMPLATE_CONFIG.tailwindVersion}"
  }
}`,

  tailwindConfig: () => `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,

  postcssConfig: () => `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

  nextConfig: () => `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`,

  globalsCss: () => `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #0891b2;
  --color-primary-dark: #000000;
  --color-primary-light: #ffffff;
  --color-primary-border: #67e8f9;
  --color-text-dark: #4476c8;
  --color-text-medium: #475569;
  --color-text-light: #f8fafc;
  --color-bg-card: #dadada;
  --color-bg-card-alt: #f8fafc;
  --color-bg-body-start: #ffffff;
  --color-bg-body-end: #424fb0;
  --color-border: #e2e8f0;
  --color-zinc: #a1a1aa;
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--color-text-dark);
  background-color: var(--color-bg-body-start);
  transition: background 0.7s ease-out;
}

.content-section {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 0.9s ease-in-out, max-height 0.9s ease-in-out;
  background-color: var(--color-bg-card);
  border-color: var(--color-border);
}

.content-section.open {
  opacity: 1;
  max-height: 5000px;
}

.main-nav-btn {
  border-width: 2px;
  border-color: transparent;
  transition: all 0.3s ease;
}

.main-nav-btn.active {
  border-color: var(--color-primary-border);
  background-color: var(--color-primary-light);
  transform: scale(1.02);
}

.tab-btn.active {
  background-color: var(--color-primary);
  color: var(--color-text-light);
}

.component-btn.active {
  background-color: var(--color-primary);
  color: var(--color-text-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.flow-arrow {
  font-size: 2rem;
  color: var(--color-zinc);
}

.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.7s ease-out;
  transition-delay: 0.3s;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.toggle-btn.active {
  background-color: var(--color-primary);
  color: white;
}

.site-card {
  background-color: var(--color-bg-card-alt);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.site-card:hover {
  border-color: var(--color-primary-border);
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.15);
}

.view-mode-btn {
  transition: all 0.2s ease;
}

.view-mode-btn.active {
  background-color: var(--color-primary);
  color: white;
  transform: scale(1.05);
}

.square-iframe {
  width: 600px;
  height: 600px;
  max-width: 100%;
  aspect-ratio: 1 / 1;
}`,

  layout: () => `import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Projeto Next.js',
  description: 'Criado a partir de HTML',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,

  gitignore: () => `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts`,

  readme: (projectName) => `# ${projectName}

Projeto Next.js criado automaticamente a partir de HTML.

## 🚀 Como Executar

\`\`\`bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
\`\`\`

## 📦 Tecnologias

- Next.js ${TEMPLATE_CONFIG.nextVersion}
- React ${TEMPLATE_CONFIG.reactVersion}
- Tailwind CSS ${TEMPLATE_CONFIG.tailwindVersion}
- Chart.js ${TEMPLATE_CONFIG.chartjsVersion}

## 📁 Estrutura

\`\`\`
${projectName}/
├── app/
│   ├── page.jsx
│   ├── layout.jsx
│   └── globals.css
├── public/
│   └── mvc/
│       ├── models/
│       ├── views/
│       └── controllers/
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
\`\`\`

---

Criado com ❤️ pelo gerador automático de projetos Next.js
`
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

async function createNextJSProject(htmlFilePath, projectName) {
  try {
    log('🚀 Iniciando criação do projeto Next.js...', 'info')
    
    // Verificar se o arquivo HTML existe
    if (!fs.existsSync(htmlFilePath)) {
      log(`Arquivo HTML não encontrado: ${htmlFilePath}`, 'error')
      process.exit(1)
    }

    // Criar diretório do projeto
    const projectPath = path.join(process.cwd(), projectName)
    if (fs.existsSync(projectPath)) {
      log(`Projeto já existe: ${projectName}`, 'error')
      process.exit(1)
    }

    createDirectory(projectPath)

    // Criar estrutura de pastas
    log('📁 Criando estrutura de pastas...', 'info')
    createDirectory(path.join(projectPath, 'app'))
    createDirectory(path.join(projectPath, 'public'))
    createDirectory(path.join(projectPath, 'public/mvc'))
    createDirectory(path.join(projectPath, 'public/mvc/models'))
    createDirectory(path.join(projectPath, 'public/mvc/models/notes'))
    createDirectory(path.join(projectPath, 'public/mvc/views'))
    createDirectory(path.join(projectPath, 'public/mvc/controllers'))
    createDirectory(path.join(projectPath, 'public/assets'))

    // Criar arquivos de configuração
    log('📝 Criando arquivos de configuração...', 'info')
    writeFile(path.join(projectPath, 'package.json'), templates.packageJson(projectName))
    writeFile(path.join(projectPath, 'tailwind.config.js'), templates.tailwindConfig())
    writeFile(path.join(projectPath, 'postcss.config.js'), templates.postcssConfig())
    writeFile(path.join(projectPath, 'next.config.js'), templates.nextConfig())
    writeFile(path.join(projectPath, '.gitignore'), templates.gitignore())
    writeFile(path.join(projectPath, 'README.md'), templates.readme(projectName))

    // Criar arquivos da aplicação
    log('⚛️  Criando arquivos da aplicação...', 'info')
    writeFile(path.join(projectPath, 'app/globals.css'), templates.globalsCss())
    writeFile(path.join(projectPath, 'app/layout.jsx'), templates.layout())

    // Ler e converter HTML para JSX (simplificado)
    log('🔄 Convertendo HTML para JSX...', 'info')
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8')
    
    // Criar page.jsx básico (você pode expandir a conversão)
    const pageJsx = `'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        ${projectName}
      </h1>
      <p className="text-center text-gray-600">
        Projeto criado a partir de HTML. Personalize este arquivo em app/page.jsx
      </p>
      
      {/* TODO: Adicione seus componentes aqui */}
      {/* O HTML original está disponível para referência */}
    </div>
  )
}

// HTML Original (comentado para referência):
/*
${htmlContent.replace(/\*\//g, '* /')}
*/`

    writeFile(path.join(projectPath, 'app/page.jsx'), pageJsx)

    // Sucesso!
    log(`\n✅ Projeto criado com sucesso: ${projectName}`, 'success')
    log('\n📋 Próximos passos:', 'info')
    log(`   cd ${projectName}`, 'info')
    log('   npm install', 'info')
    log('   npm run dev', 'info')
    log('\n🌐 Acesse: http://localhost:3000\n', 'info')

  } catch (error) {
    log(`Erro ao criar projeto: ${error.message}`, 'error')
    process.exit(1)
  }
}

// ============================================================================
// EXECUÇÃO
// ============================================================================

const args = process.argv.slice(2)

if (args.length < 2) {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  CREATE NEXT.JS FROM HTML - Gerador de Projetos Next.js      ║
╚═══════════════════════════════════════════════════════════════╝

Uso:
  node create-nextjs-from-html.js <arquivo.html> <nome-do-projeto>

Exemplo:
  node create-nextjs-from-html.js index.html MeuProjetoNextJS

Opções:
  <arquivo.html>      - Caminho para o arquivo HTML de referência
  <nome-do-projeto>   - Nome do projeto Next.js a ser criado
  `)
  process.exit(1)
}

const [htmlFile, projectName] = args

createNextJSProject(htmlFile, projectName)
