# 🎯 MVC + Responsividade - Documentação Completa

## ✅ O que foi implementado

### 1. 📁 Estrutura MVC em `public/mvc/`

```
public/mvc/
├── models/
│   ├── AppDataModel.js          # Modelo de dados centralizado
│   └── notes/                   # Notas em Markdown
│       ├── hidreletricas.md
│       ├── termeletricas.md
│       ├── nucleares.md
│       ├── eolicas.md
│       └── solares.md
├── views/                       # (Futuro: componentes de visualização)
└── controllers/
    └── DatabaseController.js    # Controlador de acesso aos dados
```

### 2. 📱 Responsividade Completa com Tailwind

Todos os componentes foram otimizados com breakpoints:

- **Mobile** (< 640px): Layout vertical, textos menores
- **Tablet** (640px - 768px): Layout intermediário
- **Desktop** (> 768px): Layout completo

### 3. 🤖 Script Gerador de Projetos

Arquivo: `create-nextjs-from-html.js`

Cria projetos Next.js automaticamente a partir de HTML!

---

## 📚 Como Usar o MVC

### Estrutura do Model

O arquivo `public/mvc/models/AppDataModel.js` contém todos os dados:

```javascript
const AppDataModel = {
  generationData: [
    { 
      id: 'hidreletricas',
      name: 'Hidrelétricas', 
      description: 'Descrição curta...',
      notePath: '/mvc/models/notes/hidreletricas.md'  // ✅ Caminho para nota MD
    },
    // ...
  ],
  // Métodos de acesso
  getGenerationData() { return this.generationData },
  getGenerationById(id) { /* ... */ }
}
```

### Notas em Markdown

Cada tipo de geração tem uma nota detalhada em `.md`:

**Exemplo: `hidreletricas.md`**

```markdown
# Hidrelétricas

## Descrição
Utilizam a força da água...

## Detalhes Técnicos
As usinas hidrelétricas aproveitam...

## Vantagens
- Fonte renovável
- Não emite gases

## Desvantagens
- Dependência de recursos hídricos
- Alto investimento inicial
```

### Controller para Carregar Notas

O `DatabaseController.js` gerencia o carregamento:

```javascript
class DatabaseController {
  async fetchNoteContent(notePath) {
    // Busca o arquivo .md
    const response = await fetch(notePath)
    return await response.text()
  }

  markdownToHtml(markdown) {
    // Converte MD para HTML
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      // ...
  }

  async getGenerationWithNote(id) {
    const generation = this.model.getGenerationById(id)
    const noteContent = await this.fetchNoteContent(generation.notePath)
    const noteHtml = this.markdownToHtml(noteContent)
    
    return { ...generation, noteContent, noteHtml }
  }
}
```

### Usando no React

No `page.jsx`:

```javascript
// Carregar nota
const [noteContent, setNoteContent] = useState('')

useEffect(() => {
  const loadNote = async () => {
    const content = await loadMarkdownNote('/mvc/models/notes/hidreletricas.md')
    const html = markdownToHtml(content)
    setNoteContent(html)
  }
  loadNote()
}, [])

// Renderizar
<div dangerouslySetInnerHTML={{ __html: noteContent }} />
```

---

## 📱 Responsividade Implementada

### Breakpoints Tailwind

| Breakpoint | Tamanho | Uso |
|-----------|---------|-----|
| `sm:` | ≥ 640px | Tablet pequeno |
| `md:` | ≥ 768px | Tablet |
| `lg:` | ≥ 1024px | Desktop |
| `xl:` | ≥ 1280px | Desktop grande |

### Componentes Responsivos

#### 1. PageHeader

```jsx
<header className="px-4 animate-on-scroll">
  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
    {/* Mobile: 2xl, Tablet: 3xl, Desktop: 4xl, Grande: 5xl */}
  </h1>
  <img className="h-32 sm:h-40 md:h-48" />
  {/* Mobile: 32, Tablet: 40, Desktop: 48 */}
</header>
```

#### 2. SiteCard

```jsx
<div className="site-card mb-4 sm:mb-6">
  {/* Mobile: mb-4, Desktop: mb-6 */}
  
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
    {/* Mobile: vertical, Desktop: horizontal */}
    
    <button className="px-3 sm:px-4 py-2 text-sm sm:text-base">
      {/* Mobile: px-3 text-sm, Desktop: px-4 text-base */}
      <span className="hidden sm:inline">📺 Ver no Iframe</span>
      <span className="sm:hidden">📺 Iframe</span>
      {/* Mobile: texto curto, Desktop: texto completo */}
    </button>
  </div>
  
  <iframe className="w-full sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px]" />
  {/* Mobile: 100% x 400px, Tablet: 500x500, Desktop: 600x600 */}
</div>
```

#### 3. NavigationButton

```jsx
<div className="m-2 p-4">
  <h2 className="text-xl sm:text-2xl">
    {/* Mobile: xl, Desktop: 2xl */}
  </h2>
  <p className="text-sm sm:text-base">
    {/* Mobile: sm, Desktop: base */}
  </p>
</div>
```

#### 4. GenerationSection

```jsx
<section className="p-4 sm:p-6 md:p-8">
  {/* Mobile: p-4, Tablet: p-6, Desktop: p-8 */}
  
  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
    {/* Mobile: vertical, Desktop: horizontal */}
    
    <div className="lg:w-1/2">
      {/* Desktop: 50% width */}
    </div>
  </div>
</section>
```

### Classes Utilitárias Responsivas

```css
/* Espaçamento */
mb-4 sm:mb-6 md:mb-8        /* Margin bottom progressivo */
p-2 sm:p-4 md:p-6           /* Padding progressivo */
gap-2 sm:gap-3 md:gap-4     /* Gap progressivo */

/* Tipografia */
text-sm sm:text-base md:text-lg    /* Tamanho de fonte */
text-xl sm:text-2xl md:text-3xl    /* Títulos */

/* Layout */
flex-col sm:flex-row        /* Vertical no mobile, horizontal no desktop */
hidden sm:block             /* Esconde no mobile, mostra no desktop */
sm:hidden                   /* Mostra no mobile, esconde no desktop */

/* Dimensões */
w-full sm:w-auto            /* 100% no mobile, auto no desktop */
h-32 sm:h-40 md:h-48        /* Altura progressiva */
```

---

## 🤖 Script Gerador de Projetos

### Como Usar

```bash
# Sintaxe
node create-nextjs-from-html.js <arquivo.html> <nome-do-projeto>

# Exemplo
node create-nextjs-from-html.js index.html MeuNovoProjetoNextJS
```

### O que o Script Faz

1. ✅ Cria estrutura de pastas Next.js
2. ✅ Gera `package.json` com dependências
3. ✅ Configura Tailwind CSS
4. ✅ Cria estrutura MVC em `public/mvc/`
5. ✅ Gera arquivos de configuração
6. ✅ Cria `README.md` automático
7. ✅ Adiciona `.gitignore`
8. ✅ Converte HTML para JSX (básico)

### Estrutura Criada

```
MeuNovoProjetoNextJS/
├── app/
│   ├── page.jsx          # Página principal
│   ├── layout.jsx        # Layout raiz
│   └── globals.css       # Estilos globais
├── public/
│   ├── mvc/
│   │   ├── models/
│   │   │   └── notes/    # Notas em Markdown
│   │   ├── views/
│   │   └── controllers/
│   └── assets/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── .gitignore
└── README.md
```

### Após Criar o Projeto

```bash
cd MeuNovoProjetoNextJS
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## 📝 Editando as Notas

### 1. Adicionar Nova Nota

Crie um arquivo `.md` em `public/mvc/models/notes/`:

```markdown
# Minha Nova Fonte

## Descrição
Descrição da fonte de energia...

## Vantagens
- Vantagem 1
- Vantagem 2

## Desvantagens
- Desvantagem 1
```

### 2. Atualizar o Model

Em `AppDataModel`:

```javascript
generationData: [
  // ...
  { 
    id: 'minha-nova-fonte',
    name: 'Minha Nova Fonte', 
    description: 'Descrição curta',
    notePath: '/mvc/models/notes/minha-nova-fonte.md'
  }
]
```

### 3. A Nota Será Carregada Automaticamente

O controller busca e renderiza o conteúdo do `.md` quando necessário!

---

## 🎨 Customizando Estilos Responsivos

### Adicionar Novos Breakpoints

Em `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    screens: {
      'xs': '480px',    // Extra small
      'sm': '640px',    // Small
      'md': '768px',    // Medium
      'lg': '1024px',   // Large
      'xl': '1280px',   // Extra large
      '2xl': '1536px',  // 2X large
    }
  }
}
```

### Usar no Componente

```jsx
<div className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
  Texto responsivo em todos os tamanhos!
</div>
```

---

## 🚀 Próximos Passos

### 1. Expandir o MVC

- Criar mais notas em Markdown
- Adicionar imagens nas notas
- Criar views reutilizáveis
- Implementar cache de notas

### 2. Melhorar Responsividade

- Testar em mais dispositivos
- Adicionar animações responsivas
- Otimizar imagens para mobile
- Implementar lazy loading

### 3. Usar o Script Gerador

- Criar novos projetos rapidamente
- Customizar templates
- Adicionar mais conversões HTML→JSX
- Automatizar deploy

---

## 📊 Checklist de Responsividade

- [x] Header responsivo (mobile → desktop)
- [x] Cards responsivos com botões adaptáveis
- [x] Iframe com tamanhos progressivos
- [x] Navegação principal responsiva
- [x] Seções de conteúdo adaptáveis
- [x] Gráfico Chart.js responsivo
- [x] Footer responsivo
- [x] Textos com tamanhos progressivos
- [x] Espaçamentos progressivos
- [x] Imagens com tamanhos adaptativos

---

## 🎯 Resumo

✅ **MVC Implementado**: Dados em `models/`, lógica em `controllers/`, notas em `.md`  
✅ **Responsividade Completa**: Breakpoints Tailwind em todos os componentes  
✅ **Script Gerador**: Cria projetos Next.js automaticamente  
✅ **Notas em Markdown**: Conteúdo editável sem tocar no código  
✅ **Documentação Completa**: Tudo explicado e pronto para uso  

**Projeto pronto para produção! 🎊**
