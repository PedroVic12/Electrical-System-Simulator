#!/bin/bash

################################################################################
# INIT NEXT.JS PROJECT - Script de Inicialização Automática
################################################################################
# 
# Cria um projeto Next.js completo com:
# - Estrutura MVC em public/mvc/
# - Tailwind CSS configurado
# - Template inicial criativo
# - Todas as dependências instaladas
#
# Uso: ./init_NEXTJS_project.sh <nome-do-projeto>
# Exemplo: ./init_NEXTJS_project.sh MeuProjetoNextJS
#
################################################################################

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Ícones
ROCKET="🚀"
CHECK="✅"
FOLDER="📁"
FILE="📝"
PACKAGE="📦"
SPARKLES="✨"
WARNING="⚠️"
ERROR="❌"

################################################################################
# FUNÇÕES AUXILIARES
################################################################################

print_header() {
    echo ""
    echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${NC}  ${ROCKET} INIT NEXT.JS PROJECT - Gerador Automático ${ROCKET}        ${CYAN}║${NC}"
    echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}${1}${NC} ${2}"
}

print_success() {
    echo -e "${GREEN}${CHECK}${NC} ${1}"
}

print_warning() {
    echo -e "${YELLOW}${WARNING}${NC} ${1}"
}

print_error() {
    echo -e "${RED}${ERROR}${NC} ${1}"
}

create_dir() {
    mkdir -p "$1"
    print_success "Diretório criado: ${1}"
}

create_file() {
    cat > "$1"
    print_success "Arquivo criado: ${1}"
}

################################################################################
# VALIDAÇÃO DE ARGUMENTOS
################################################################################

if [ $# -eq 0 ]; then
    print_header
    print_error "Nenhum nome de projeto fornecido!"
    echo ""
    echo "Uso:"
    echo "  ./init_NEXTJS_project.sh <nome-do-projeto>"
    echo ""
    echo "Exemplo:"
    echo "  ./init_NEXTJS_project.sh MeuProjetoNextJS"
    echo ""
    exit 1
fi

PROJECT_NAME=$1
PROJECT_DIR=$(pwd)/$PROJECT_NAME

# Verificar se o projeto já existe
if [ -d "$PROJECT_NAME" ]; then
    print_error "Projeto '${PROJECT_NAME}' já existe!"
    exit 1
fi

################################################################################
# INÍCIO DA CRIAÇÃO
################################################################################

print_header
print_step "${ROCKET}" "Criando projeto: ${PROJECT_NAME}"
echo ""

################################################################################
# 1. CRIAR ESTRUTURA DE PASTAS
################################################################################

print_step "${FOLDER}" "Criando estrutura de pastas..."
echo ""

create_dir "$PROJECT_NAME"
create_dir "$PROJECT_NAME/app"
create_dir "$PROJECT_NAME/public"
create_dir "$PROJECT_NAME/public/mvc"
create_dir "$PROJECT_NAME/public/mvc/models"
create_dir "$PROJECT_NAME/public/mvc/models/notes"
create_dir "$PROJECT_NAME/public/mvc/views"
create_dir "$PROJECT_NAME/public/mvc/controllers"
create_dir "$PROJECT_NAME/public/assets"
create_dir "$PROJECT_NAME/public/assets/images"

echo ""

################################################################################
# 2. CRIAR PACKAGE.JSON
################################################################################

print_step "${PACKAGE}" "Criando package.json..."
echo ""

create_file "$PROJECT_NAME/package.json" << 'EOF'
{
  "name": "nextjs-mvc-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "chart.js": "^4.4.0",
    "react-chartjs-2": "^5.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0"
  }
}
EOF

################################################################################
# 3. CRIAR CONFIGURAÇÕES
################################################################################

print_step "${FILE}" "Criando arquivos de configuração..."
echo ""

# Tailwind Config
create_file "$PROJECT_NAME/tailwind.config.js" << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
EOF

# PostCSS Config
create_file "$PROJECT_NAME/postcss.config.js" << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# Next Config
create_file "$PROJECT_NAME/next.config.js" << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
EOF

# .gitignore
create_file "$PROJECT_NAME/.gitignore" << 'EOF'
# dependencies
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
next-env.d.ts
EOF

################################################################################
# 4. CRIAR GLOBALS.CSS
################################################################################

print_step "${FILE}" "Criando globals.css..."
echo ""

create_file "$PROJECT_NAME/app/globals.css" << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primary: #0891b2;
  --color-primary-dark: #0e7490;
  --color-primary-light: #67e8f9;
  --color-secondary: #8b5cf6;
  --color-accent: #f59e0b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
EOF

################################################################################
# 5. CRIAR LAYOUT.JSX
################################################################################

print_step "${FILE}" "Criando layout.jsx..."
echo ""

create_file "$PROJECT_NAME/app/layout.jsx" << 'EOF'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Next.js MVC Project',
  description: 'Projeto Next.js com estrutura MVC e Tailwind CSS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
EOF

################################################################################
# 6. CRIAR PAGE.JSX (TEMPLATE CRIATIVO)
################################################################################

print_step "${SPARKLES}" "Criando page.jsx com template criativo..."
echo ""

create_file "$PROJECT_NAME/app/page.jsx" << 'EOF'
'use client'

import { useState, useEffect } from 'react'
import { Zap, Rocket, Code, Database, Layers, Sparkles, Github, ExternalLink } from 'lucide-react'

// ============================================================================
// DATA MODEL - Integração com MVC
// ============================================================================

const AppDataModel = {
  features: [
    {
      icon: 'Layers',
      title: 'Estrutura MVC',
      description: 'Arquitetura Model-View-Controller organizada em public/mvc/',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: 'Code',
      title: 'Tailwind CSS',
      description: 'Framework CSS utility-first totalmente configurado',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: 'Database',
      title: 'Notas em Markdown',
      description: 'Conteúdo editável em arquivos .md sem tocar no código',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: 'Zap',
      title: 'Responsivo',
      description: 'Design mobile-first com breakpoints otimizados',
      color: 'from-yellow-500 to-orange-500'
    }
  ],
  
  quickLinks: [
    { name: 'Documentação', url: '/docs', icon: 'ExternalLink' },
    { name: 'GitHub', url: 'https://github.com', icon: 'Github' },
    { name: 'Exemplos', url: '/examples', icon: 'Code' }
  ]
}

// ============================================================================
// COMPONENTS
// ============================================================================

function FeatureCard({ icon: IconName, title, description, color }) {
  const iconMap = {
    Layers: Layers,
    Code: Code,
    Database: Database,
    Zap: Zap
  }
  
  const Icon = iconMap[IconName] || Zap
  
  return (
    <div className="card-hover bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function QuickLinkButton({ name, url, icon: IconName }) {
  const iconMap = {
    ExternalLink: ExternalLink,
    Github: Github,
    Code: Code
  }
  
  const Icon = iconMap[IconName] || ExternalLink
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 text-sm font-medium"
    >
      <Icon className="w-4 h-4" />
      {name}
    </a>
  )
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow animation-delay-4000"></div>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 relative z-10">
        {/* Header */}
        <header className="text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-medium mb-6 animate-float">
            <Sparkles className="w-4 h-4" />
            Projeto Criado Automaticamente
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6">
            <span className="gradient-text">Next.js MVC</span>
            <br />
            <span className="text-gray-800">Template Project</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 px-4">
            Projeto Next.js completo com estrutura MVC, Tailwind CSS e template inicial criativo.
            Pronto para desenvolvimento!
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {AppDataModel.quickLinks.map((link, index) => (
              <QuickLinkButton key={index} {...link} />
            ))}
          </div>
        </header>

        {/* Features Grid */}
        <section className="mb-12 sm:mb-16 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
            ✨ Recursos Incluídos
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {AppDataModel.features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Começando
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-500 mb-2 font-medium">1. Instalar dependências</p>
                <code className="block bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-x-auto">
                  npm install
                </code>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-500 mb-2 font-medium">2. Executar em desenvolvimento</p>
                <code className="block bg-gray-900 text-green-400 p-3 rounded-lg text-sm overflow-x-auto">
                  npm run dev
                </code>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-500 mb-2 font-medium">3. Acessar no navegador</p>
                <code className="block bg-gray-900 text-blue-400 p-3 rounded-lg text-sm overflow-x-auto">
                  http://localhost:3000
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Structure */}
        <section className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
            📁 Estrutura do Projeto
          </h2>
          
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl overflow-x-auto">
            <pre className="text-green-400 text-xs sm:text-sm font-mono leading-relaxed">
{`project/
├── app/
│   ├── page.jsx          ✅ Página principal
│   ├── layout.jsx        ✅ Layout raiz
│   └── globals.css       ✅ Estilos globais
│
├── public/
│   ├── mvc/
│   │   ├── models/
│   │   │   ├── AppDataModel.js
│   │   │   └── notes/    ✅ Notas em Markdown
│   │   ├── views/        ✅ Componentes de visualização
│   │   └── controllers/  ✅ Lógica de negócio
│   └── assets/           ✅ Imagens e arquivos
│
├── package.json          ✅ Dependências
├── tailwind.config.js    ✅ Tailwind configurado
├── postcss.config.js     ✅ PostCSS
└── next.config.js        ✅ Next.js config`}
            </pre>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-600 text-sm">
          <p className="mb-2">
            Criado com ❤️ usando <strong>init_NEXTJS_project.sh</strong>
          </p>
          <p className="text-xs text-gray-400">
            Next.js 14 • React 18 • Tailwind CSS 3 • MVC Pattern
          </p>
        </footer>
      </div>
    </div>
  )
}
EOF

################################################################################
# 7. CRIAR ARQUIVOS MVC
################################################################################

print_step "${DATABASE}" "Criando arquivos MVC..."
echo ""

# AppDataModel.js
create_file "$PROJECT_NAME/public/mvc/models/AppDataModel.js" << 'EOF'
// ============================================================================
// APP DATA MODEL - Modelo de dados centralizado
// ============================================================================

const AppDataModel = {
  // Exemplo de dados
  items: [
    { id: 1, name: 'Item 1', description: 'Descrição do item 1' },
    { id: 2, name: 'Item 2', description: 'Descrição do item 2' },
    { id: 3, name: 'Item 3', description: 'Descrição do item 3' }
  ],

  // Métodos de acesso
  getAllItems() {
    return this.items
  },

  getItemById(id) {
    return this.items.find(item => item.id === id)
  },

  addItem(item) {
    this.items.push(item)
  }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppDataModel
}
EOF

# DatabaseController.js
create_file "$PROJECT_NAME/public/mvc/controllers/DatabaseController.js" << 'EOF'
// ============================================================================
// DATABASE CONTROLLER - Controlador de acesso aos dados
// ============================================================================

class DatabaseController {
  constructor() {
    this.cache = new Map()
  }

  async fetchData(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url)
    }

    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Erro: ${response.statusText}`)
      const data = await response.json()
      this.cache.set(url, data)
      return data
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      return null
    }
  }

  clearCache() {
    this.cache.clear()
  }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DatabaseController
}
EOF

# Nota de exemplo
create_file "$PROJECT_NAME/public/mvc/models/notes/exemplo.md" << 'EOF'
# Nota de Exemplo

## Descrição

Este é um exemplo de nota em Markdown que pode ser carregada dinamicamente.

## Como Usar

1. Crie arquivos `.md` nesta pasta
2. Referencie-os no seu `AppDataModel`
3. Use o `DatabaseController` para carregar

## Vantagens

- Conteúdo editável sem tocar no código
- Fácil manutenção
- Suporte a Markdown completo

## Exemplo de Código

```javascript
const nota = await loadMarkdownNote('/mvc/models/notes/exemplo.md')
```
EOF

################################################################################
# 8. CRIAR README.md
################################################################################

print_step "${FILE}" "Criando README.md..."
echo ""

create_file "$PROJECT_NAME/README.md" << EOF
# ${PROJECT_NAME}

Projeto Next.js criado automaticamente com **init_NEXTJS_project.sh**

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

- **Next.js 14** - Framework React
- **React 18** - Biblioteca UI
- **Tailwind CSS 3** - Framework CSS
- **Lucide React** - Ícones
- **Chart.js** - Gráficos (opcional)

## 📁 Estrutura

\`\`\`
${PROJECT_NAME}/
├── app/
│   ├── page.jsx          # Página principal
│   ├── layout.jsx        # Layout raiz
│   └── globals.css       # Estilos globais
├── public/
│   ├── mvc/
│   │   ├── models/       # Modelos de dados
│   │   ├── views/        # Componentes de visualização
│   │   └── controllers/  # Lógica de negócio
│   └── assets/           # Arquivos estáticos
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
\`\`\`

## 🎨 Recursos

- ✅ Estrutura MVC organizada
- ✅ Tailwind CSS configurado
- ✅ Template inicial criativo
- ✅ Responsivo (mobile-first)
- ✅ Animações suaves
- ✅ Notas em Markdown
- ✅ Pronto para produção

## 📝 Próximos Passos

1. Personalize o conteúdo em \`app/page.jsx\`
2. Adicione seus dados em \`public/mvc/models/\`
3. Crie notas em \`public/mvc/models/notes/\`
4. Desenvolva seus componentes
5. Deploy (Vercel, Netlify, etc.)

---

**Criado com ❤️ por init_NEXTJS_project.sh**
EOF

################################################################################
# 9. INSTALAR DEPENDÊNCIAS
################################################################################

print_step "${PACKAGE}" "Instalando dependências..."
echo ""

cd "$PROJECT_NAME"

if command -v npm &> /dev/null; then
    npm install
    print_success "Dependências instaladas com sucesso!"
else
    print_warning "npm não encontrado. Execute 'npm install' manualmente."
fi

cd ..

################################################################################
# 10. FINALIZAÇÃO
################################################################################

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  ${CHECK} PROJETO CRIADO COM SUCESSO! ${CHECK}                          ${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

print_success "Projeto: ${PROJECT_NAME}"
print_success "Localização: ${PROJECT_DIR}"
echo ""

echo -e "${CYAN}📋 Próximos passos:${NC}"
echo ""
echo -e "  ${BLUE}1.${NC} cd ${PROJECT_NAME}"
echo -e "  ${BLUE}2.${NC} npm run dev"
echo -e "  ${BLUE}3.${NC} Abra http://localhost:3000"
echo ""

echo -e "${YELLOW}${SPARKLES} Recursos incluídos:${NC}"
echo -e "  ${CHECK} Estrutura MVC em public/mvc/"
echo -e "  ${CHECK} Tailwind CSS configurado"
echo -e "  ${CHECK} Template inicial criativo"
echo -e "  ${CHECK} Responsividade completa"
echo -e "  ${CHECK} Animações suaves"
echo -e "  ${CHECK} Documentação completa"
echo ""

echo -e "${CYAN}🚀 Bom desenvolvimento!${NC}"
echo ""

exit 0
EOF

print_success "Script criado com sucesso!"
</invoke>
