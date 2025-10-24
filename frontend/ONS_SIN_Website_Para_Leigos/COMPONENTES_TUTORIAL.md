# 📚 Tutorial: Construindo Componentes Web do Zero

Este guia explica como construir os principais componentes do site ONS SIN manualmente, para você aprender a criar seu próprio template de website.

---

## 🎯 Índice
1. [Header Fixo com Navegação](#1-header-fixo-com-navegação)
2. [Sidemenu Multi-level](#2-sidemenu-multi-level)
3. [Sistema de Tabs](#3-sistema-de-tabs)
4. [Carousel de Conteúdo](#4-carousel-de-conteúdo)
5. [Navegação Suave (Smooth Scroll)](#5-navegação-suave-smooth-scroll)

---

## 1. Header Fixo com Navegação

### Conceito
Um header que permanece no topo da página enquanto o usuário rola o conteúdo.

### HTML/JSX Estrutura
```jsx
<header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/logo.png" alt="Logo" className="h-10" />
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden md:flex space-x-4">
        <button onClick={() => scrollToSection('section1')}>Seção 1</button>
        <button onClick={() => scrollToSection('section2')}>Seção 2</button>
      </nav>

      {/* Menu Hamburguer - Mobile */}
      <button className="md:hidden">
        <MenuIcon />
      </button>
    </div>
  </div>
</header>
```

### CSS Essencial
```css
/* Header fixo */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

/* Compensar altura do header no body */
body {
  padding-top: 64px; /* altura do header */
}
```

### JavaScript/React
```javascript
function NavigationHeader() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    // ... JSX acima
  )
}
```

---

## 2. Sidemenu Multi-level

### Conceito
Menu lateral que desliza da esquerda, com submenus expansíveis (accordion).

### HTML/JSX Estrutura
```jsx
function SideMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleSubMenu = (menuId) => {
    setExpandedMenus(prev => ({ 
      ...prev, 
      [menuId]: !prev[menuId] 
    }))
  }

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 z-40 w-64 h-screen transition-transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-white border-r`}>
        <ul>
          {/* Menu simples */}
          <li>
            <button onClick={() => navigate('home')}>
              🏠 Início
            </button>
          </li>

          {/* Menu com submenu */}
          <li>
            <button onClick={() => toggleSubMenu('category1')}>
              <span>📁 Categoria 1</span>
              {expandedMenus['category1'] ? <ChevronDown /> : <ChevronRight />}
            </button>
            
            {/* Submenu */}
            {expandedMenus['category1'] && (
              <ul className="pl-6">
                <li>
                  <button>📄 Subitem 1</button>
                </li>
                <li>
                  <button>📄 Subitem 2</button>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
```

### CSS Essencial
```css
/* Transição suave do menu */
.transition-transform {
  transition: transform 0.3s ease-in-out;
}

/* Menu escondido */
.-translate-x-full {
  transform: translateX(-100%);
}

/* Menu visível */
.translate-x-0 {
  transform: translateX(0);
}

/* Overlay */
.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}
```

---

## 3. Sistema de Tabs

### Conceito
Navegação por abas que mostra diferentes conteúdos sem recarregar a página.

### HTML/JSX Estrutura
```jsx
function TabSystem() {
  const [activeTab, setActiveTab] = useState('tab1')

  const tabs = [
    { id: 'tab1', label: '🗺️ Mapas', content: <MapasContent /> },
    { id: 'tab2', label: '📊 Dados', content: <DadosContent /> },
    { id: 'tab3', label: '⚖️ Regulação', content: <RegulacaoContent /> }
  ]

  return (
    <div>
      {/* Tab Buttons */}
      <div className="flex gap-4 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-cyan-600 text-white' 
                : 'bg-gray-200 hover:bg-cyan-500 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  )
}
```

### CSS Essencial
```css
/* Botão ativo */
.tab-btn.active {
  background-color: #0891b2;
  color: white;
  transform: scale(1.05);
}

/* Transição suave */
.tab-btn {
  transition: all 0.2s ease;
}

.tab-btn:hover {
  transform: translateY(-2px);
}
```

---

## 4. Carousel de Conteúdo

### Conceito
Slider que permite navegar entre múltiplos itens com animação suave.

### HTML/JSX Estrutura
```jsx
function Carousel({ items }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length)
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 px-2">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Botões de Navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
      >
        →
      </button>

      {/* Indicadores */}
      <div className="flex justify-center gap-2 mt-4">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? 'bg-cyan-600 w-8' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
```

### CSS Essencial
```css
/* Container do carousel */
.overflow-hidden {
  overflow: hidden;
}

/* Slides */
.flex-shrink-0 {
  flex-shrink: 0;
}

/* Animação suave */
.transition-transform {
  transition: transform 0.5s ease-in-out;
}

/* Posicionamento dos botões */
.absolute {
  position: absolute;
}

.top-1/2 {
  top: 50%;
}

.-translate-y-1/2 {
  transform: translateY(-50%);
}
```

### JavaScript Lógica
```javascript
// Cálculo do slide atual
const slideWidth = 100 // porcentagem
const translateX = currentSlide * slideWidth

// Navegação circular
const nextIndex = (current + 1) % totalItems
const prevIndex = (current - 1 + totalItems) % totalItems
```

---

## 5. Navegação Suave (Smooth Scroll)

### Conceito
Scroll animado ao clicar em links de navegação.

### HTML Estrutura
```html
<!-- Seções com IDs -->
<section id="intro">...</section>
<section id="about">...</section>
<section id="contact">...</section>
```

### CSS Global
```css
/* Scroll suave nativo */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* compensar header fixo */
}

/* Margem de scroll para cada seção */
.scroll-mt-20 {
  scroll-margin-top: 5rem;
}
```

### JavaScript Avançado
```javascript
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  
  if (element) {
    // Altura do header fixo
    const headerOffset = 80
    
    // Posição do elemento
    const elementPosition = element.getBoundingClientRect().top
    
    // Posição final considerando o offset
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
    
    // Scroll animado
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
```

---

## 🎨 Dicas de Design

### 1. Responsividade
```jsx
// Mobile-first approach
className="text-sm sm:text-base md:text-lg lg:text-xl"

// Breakpoints Tailwind:
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
```

### 2. Transições Suaves
```css
/* Sempre adicionar transições */
.element {
  transition: all 0.3s ease;
}

/* Ou específico */
.element {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
```

### 3. Estados Interativos
```css
/* Hover */
.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Active */
.button:active {
  transform: translateY(0);
}

/* Focus (acessibilidade) */
.button:focus {
  outline: 2px solid #0891b2;
  outline-offset: 2px;
}
```

---

## 🚀 Próximos Passos

1. **Pratique cada componente separadamente** em um projeto teste
2. **Combine componentes** para criar layouts complexos
3. **Adicione animações** com CSS ou bibliotecas como Framer Motion
4. **Teste em diferentes dispositivos** e navegadores
5. **Otimize performance** com lazy loading e code splitting

---

## 📖 Recursos Adicionais

- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **React Hooks**: https://react.dev/reference/react
- **MDN Web Docs**: https://developer.mozilla.org
- **CSS Tricks**: https://css-tricks.com

---

**Desenvolvido por**: Pedro Victor Rodrigues Veras  
**Projeto**: ONS SIN Website Para Leigos  
**Data**: 2025
