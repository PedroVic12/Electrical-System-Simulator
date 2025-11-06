'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Menu, X, ChevronDown, ChevronRight, LucideFileSignature } from 'lucide-react'
import { MarkdownPage } from './UI/components/MarkdownPage'

// Componentes dinâmicos
const ThemeToggle = dynamic(() => import('./UI/components/ThemeToggle'), { ssr: false })
const Chart = dynamic(() => import('chart.js/auto').then((mod) => mod.Chart), { ssr: false })


// ============================================================================
// Nextjs with tailwind and MVC componentes in one file with renderMarkdown files from directory notes
// ============================================================================

//     https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app

//! npm install react-markdown remark-gfm

// ==================================================================================



// widgets UI tags components - HTML
function NextJSComponenetTemplate() {
  return (
    <div>

      <h2>   Start building with Next.js  </h2>
      Go from beginner to expert by learning the foundations of Next.js and building a fully functional demo website that uses all the latest features.
    </div>



  )
}

// components/ImgContainer.jsx
function ImgContainer({ src, alt, className = "", ...props }) {
  // Handle both relative and absolute paths
  const imagePath = src.startsWith('/') ? src : `/${src}`;

  return (
    <div className={`relative w-full ${className}`}>
      <img
        src={imagePath}
        alt={alt || "Image"}
        className="w-full h-auto object-contain"
        loading="lazy"
        {...props}
      />
    </div>
  );
}

// DATABASE CONTROLLER - Funções para carregar notas MD
const loadMarkdownNote = async (notePath) => {
  try {
    const response = await fetch(notePath)
    if (!response.ok) return null
    return await response.text()
  } catch (error) {
    console.error('Erro ao carregar nota:', error)
    return null
  }
}

// FLOW ARROW COMPONENT
function FlowArrow() {
  return (
    <>
      <div className="flow-arrow hidden md:block mx-4">→</div>
      <div className="flow-arrow block md:hidden my-2">↓</div>
    </>
  )
}

// new fucntion for animations
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll')
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  })

  elements.forEach(element => observer.observe(element))
}

// const markdownToHtml = (markdown) => {
//   if (!markdown) return '';

//   // Separa o markdown em blocos por linhas em branco
//   const blocks = markdown.split(/\n\n/);

//   const htmlBlocks = blocks.map(block => {
//     const trimmedBlock = block.trim();

//     // Converte blocos de lista (começando com "- ")
//     if (trimmedBlock.startsWith('- ')) {
//       const items = trimmedBlock.split('\n').map(item => {
//         const content = item.replace(/^\s*-\s*/, '');
//         // Aplica negrito dentro dos itens da lista
//         const boldedContent = content.replace(/\*\*(.*?)\*\*/gim, '<strong 
//       class= "font-semibold" > $1</strong > ');
//             return `<li class="ml-4 mb-1">• ${boldedContent}</li>`;
//       }).join('');
//       return `<ul class="list-disc pl-5 mt-2 space-y-1">${items}</ul>`;
//     }

//     // Converte cabeçalhos
//     if (trimmedBlock.startsWith('#')) {
//       if (trimmedBlock.startsWith('### ')) {
//         return `<h3 class="text-lg sm:text-xl font-bold mt-3 sm:mt-4 mb-2">
//       ${trimmedBlock.replace('### ', '')}</h3>`;
//       }
//       if (trimmedBlock.startsWith('## ')) {
//         return `<h2 class="text-xl sm:text-2xl font-bold mt-4 sm:mt-6 mb-2 
//       sm:mb-3">${trimmedBlock.replace('## ', '')}</h2>`;
//       }
//       if (trimmedBlock.startsWith('# ')) {
//         return `<h1 class="text-2xl sm:text-3xl font-bold mt-6 sm:mt-8 mb-3 
//       sm:mb-4">${trimmedBlock.replace('# ', '')}</h1>`;
//       }
//     }

//     // Se não for lista ou cabeçalho, trata como parágrafo
//     if (trimmedBlock) {
//       // Aplica negrito dentro dos parágrafos
//       const boldedBlock = trimmedBlock.replace(/\*\*(.*?)\*\*/gim, '<strong 
//       class= "font-semibold" > $1</strong > ');
//           return `<p class="mb-3 sm:mb-4 text-sm sm:text-base">${boldedBlock}</p>`;
//     }

//     return ''; // Retorna string vazia para blocos vazios
//   });

//   return htmlBlocks.join('');
// };



function VideoContainer({
  path_video,
  width = "500px",  // Default to pixel values
  height = "300px", // Default to pixel values
  objectFit = "cover",
  className = "",
  ...props
}) {
  return (
    <video
      className={className}
      style={{
        width: width,
        height: height,
        objectFit: objectFit,
        display: 'block' // Ensures no extra space around
      }}
      autoPlay
      loop
      muted
      playsInline
      {...props}
    >
      <source src={path_video} type="video/mp4" />
    </video>
  );
}

// ==================================================================================
// MVC INTEGRATION - Integração com Model-View-Controller


// DATA MODEL - Carregado do arquivo público
const AppDataModel = {
  generationData: [
    { id: 'hidreletricas', name: 'Hidrelétricas', description: 'Utilizam a força da água para girar turbinas e geradores. São uma fonte limpa e renovável, mas dependem de recursos hídricos.', notePath: '/mvc/models/notes/hidreletricas.md', capacityMW: 48645.5  },
    { id: 'termeletricas', name: 'Termelétricas', description: 'Queimam combustíveis fósseis ou biomassa para aquecer água, produzir vapor e girar turbinas. São flexíveis, mas emitem gases de efeito estufa.', notePath: '/mvc/models/notes/termeletricas.md', capacityMW: 12786.0  },
    { id: 'nucleares', name: 'Nucleares', description: 'Utilizam a fissão nuclear para gerar calor, que produz vapor para as turbinas. São eficientes e não emitem gases de efeito estufa, mas geram resíduos radioativos.', notePath: '/mvc/models/notes/nucleares.md', capacityMW: 5015 },
    { id: 'eolicas', name: 'Eólicas', description: 'Convertem a energia do vento em eletricidade através de aerogeradores. São renováveis e limpas, mas intermitentes.', notePath: '/mvc/models/notes/eolicas.md', capacityMW: 12056.4 },
    { id: 'solares', name: 'Solares', description: 'Convertem a luz do sol em eletricidade, seja por painéis fotovoltaicos (diretamente) ou por usinas termossolares. Também são renováveis e limpas, mas intermitentes.', notePath: '/mvc/models/notes/solares.md', capacityMW: 15000 }
  ],
  componentsData: [
    { id: 'geradores', name: 'Geradores', description: 'Convertem outras formas de energia (mecânica, térmica, etc.) em energia elétrica. São o coração das usinas.' },
    { id: 'transformadores', name: 'Transformadores', description: 'Podem ser em Fase ou em Série. Alteram os níveis de tensão da eletricidade. Elevam a tensão para a transmissão e a reduzem para a distribuição e consumo.' },
    { id: 'linhas', name: 'Linhas de Transmissão', description: 'Conduzem a energia através de cabos aéreos ou subterrâneos, formando as redes de transmissão e distribuição.' },
    { id: 'disjuntores', name: 'Disjuntores', description: 'Controlam o fluxo de energia e protegem o sistema contra falhas. Atuam como interruptores de grande porte em Substações' },
    { id: 'reles', name: 'Relés', description: 'Detectam condições anormais (curtos-circuitos) e acionam os disjuntores para isolar a falha e proteger o resto do sistema. Hoje em dia é possivel controlar os relés remotamente utilizando IEEds e IOT.' },
    { id: 'barramentos', name: 'Barras', description: 'São barras condutoras que conectam vários circuitos em uma subestação, funcionando como um nó de distribuição de energia.' },
    { id: 'reativos', name: 'Reatores', description: 'Reatores são usados para controlar a tensão e compensar a potência reativa na rede, melhorando a eficiência e a estabilidade.' }
  ],
  externalSites: {
    sin: { id: 'sin', name: 'SIN', url: 'https://sig.ons.org.br/app/sinmaps/', color: 'blue-500', iframe: true },
    sinmaps: { id: 'sinmaps', name: 'SIN Maps', url: 'https://www.ons.org.br/paginas/sobre-o-sin/mapas', color: 'blue-500', iframe: false },
    aneel: { id: 'aneel', name: 'ANEEL', url: 'https://www.gov.br/aneel/pt-br', color: 'blue-600', iframe: false },
    ons: { id: 'ons', name: 'ONS - Carga e Geração em tempo real', url: 'https://www.ons.org.br/paginas/energia-agora/carga-e-geracao', color: 'blue-700', iframe: true },
    tempo: {id: "clima-tempo", name:"Clima Tempo ao vivo", url: "https://www.climatempo.com.br/previsao-do-tempo/15-dias/cidade/4952/campogrande-rj", color: "blue-700", iframe: true}
  },
  chartData: {
    labels: ['Hidrelétrica', 'Termelétrica', 'Eólica', 'Solar', 'Nuclear & Outras'],
    data: [62, 20, 11, 5, 2],
    backgroundColor: ['#06b6d4', '#64748b', '#38bdf8', '#facc15', '#a8a29e']
  }
}



// NAVIGATION HEADER - Header fixo com navegação
function NavigationHeader({ onNavigate }) {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})
  // Inside your NavigationHeader component:
  const [showVideo, setShowVideo] = useState(false);

  const toggleSubMenu = (menuId) => {
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }))
  }

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
      setIsSideMenuOpen(false)
    }
  }

  return (
    <>
      {/* Header Fixo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1226] border-b border-gray-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Video Container */}
            <div className="flex items-center space-x-4">
              {/* Logo Image */}
                <div className="flex items-center space-x-4">
                  {/* Logo como link para a página inicial */}
                  <a 
                    href="#inicio" 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('intro');
                    }}
                    className="rounded-full border border-primary-border p-1 transition-colors hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Ir para o início"
                  >
                    <img
                      src="/assets/Logo_ONSInspira.png"
                      alt="Logo ONS - Voltar ao início"
                      width={40}
                      height={40}
                      className="h-10 w-auto"
                      loading="lazy"
                    />
                  </a>

                  {/* Alternador de tema - visível apenas em telas médias para cima */}
                  <div className="hidden md:block">
                    <ThemeToggle />
                  </div>
                </div>
            </div>

            {/* Navigation Buttons - Desktop */}
            <nav className="hidden md:flex space-x-4 ">
              <button onClick={() => scrollToSection('intro')} className="nav-header-btn">Início</button>
              <button onClick={() => scrollToSection('generation')} className="nav-header-btn">Geração</button>
              <button onClick={() => scrollToSection('components')} className="nav-header-btn">Componentes</button>
              <button onClick={() => scrollToSection('sites')} className="nav-header-btn">Sites Úteis</button>
            </nav>

            {/* Menu Hamburguer - Mobile */}
            <button
              onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isSideMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Side Menu - Multi-level */}
      <aside className={`fixed top-16 left-0 z-40 w-64 h-screen transition-transform ${isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 md:hidden`}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {/* Início */}
            <li>
              <button
                onClick={() => scrollToSection('intro')}
                className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <span className="ml-3">🏠 Início</span>
              </button>
            </li>

            {/* Geração - Multi-level */}
            <li>
              <button
                onClick={() => toggleSubMenu('generation')}
                className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <span className="flex-1 ml-3 text-left">⚡ Geração</span>
                {expandedMenus['generation'] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              {expandedMenus['generation'] && (
                <ul className="py-2 space-y-2 pl-6">
                  <li>
                    <button onClick={() => scrollToSection('generation')} className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                      💧 Hidrelétricas
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('generation')} className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                      🔥 Termelétricas
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('generation')} className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                      ☢️ Nucleares
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('generation')} className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                      🌬️ Eólicas
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('generation')} className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                      ☀️ Solares
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Componentes - Multi-level */}
            <li>
              <button
                onClick={() => toggleSubMenu('components')}
                className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <span className="flex-1 ml-3 text-left">🔧 Componentes</span>
                {expandedMenus['components'] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              {expandedMenus['components'] && (
                <ul className="py-2 space-y-2 pl-6">
                  <li>
                    <button onClick={() => scrollToSection('components')} className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                      ⚙️ Geradores
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('components')} className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                      🔄 Transformadores
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('components')} className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                      📡 Linhas de Transmissão
                    </button>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('components')} className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100 text-sm">
                      🔌 Disjuntores
                    </button>
                  </li>
                </ul>
              )}
            </li>


            {/* Sites Úteis */}
            <li>
              <button
                onClick={() => scrollToSection('sites')}
                className="flex items-center w-full p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <span className="ml-3">🌐 Sites Úteis</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Overlay para fechar o menu */}
      {isSideMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSideMenuOpen(false)}
        />
      )}
    </>
  )
}

// PAGE HEADER - Banner principal
function PageHeader() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <header id="intro" className="page-header text-center mb-8 sm:mb-10 md:mb-12 px-4 animate-on-scroll pt-20">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-5 leading-tight" style={{ color: 'var(--color-primary-dark)' }}>
        Sistema Elétrico de Potência Interativo para Leigos e Estudantes
      </h1>
      <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-2" style={{ color: 'var(--color-text-medium)' }}>
        Uma jornada visual pela geração, transmissão e distribuição da energia elétrica que abastece nosso mundo.
      </p>
      <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto px-2 mb-6" style={{ color: 'var(--color-text-medium)' }}>
        Simulação de Sistemas Elétricos de Potência ao alcance de um clique.
      </p>

      {/* Image/Video Container */}
      <div
        className="relative mx-auto w-48 sm:w-64 md:w-80 h-32 sm:h-40 md:h-48 cursor-pointer"
        onClick={() => setShowVideo(!showVideo)}
        onMouseEnter={() => setShowVideo(true)}
        onMouseLeave={() => setShowVideo(false)}
      >
        {/* Logo Image - shown by default */}
        <img
          src="/assets/Logo_ONSInspira.png"
          alt="Logo ONS Inspira"
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${showVideo ? 'opacity-0' : 'opacity-100'
            }`}
        />        


        {/* Video - shown on hover/click */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'
          }`}>
          <VideoContainer
            path_video="/assets/Animação_Logo_ONS_INOVAE.mp4"
            width="300px"
            height="300px"
            objectFit="cover"
          />
        </div>
      </div>
    </header>
  )
}

// SITE CARD COMPONENT - Responsivo
function SiteCard({ siteKey, siteName, siteUrl, siteColor, allowIframe }) {
  const [viewMode, setViewMode] = useState(null)

  const handleOpenNewTab = () => {
    window.open(siteUrl, '_blank', 'noopener,noreferrer')
    setViewMode('newtab')
    setTimeout(() => setViewMode(null), 2000)
  }

  const handleToggleIframe = () => {
    setViewMode(prev => prev === 'iframe' ? null : 'iframe')
  }

  return (
    <div className="site-card mb-4 sm:mb-6">
      <div className="flex flex-col">
        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3" style={{ color: 'var(--color-primary)' }}>
          {siteName}
        </h3>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
          {allowIframe && (
            <button
              onClick={handleToggleIframe}
              className={`view-mode-btn flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium border-2 text-sm sm:text-base ${viewMode === 'iframe'
                ? 'active border-transparent'
                : `border-${siteColor} text-${siteColor} hover:bg-${siteColor} hover:text-white`
                }`}
            >
              <span className="hidden sm:inline">📺 Ver no Iframe</span>
              <span className="sm:hidden">📺 Iframe</span>
            </button>
          )}

          <button
            onClick={handleOpenNewTab}
            className={`view-mode-btn flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium border-2 text-sm sm:text-base ${viewMode === 'newtab'
              ? 'active border-transparent'
              : `border-${siteColor} text-${siteColor} hover:bg-${siteColor} hover:text-white`
              }`}
          >
            <span className="hidden sm:inline">🔗 Abrir em Nova Aba</span>
            <span className="sm:hidden">🔗 Nova Aba</span>
          </button>
        </div>

        {viewMode === 'iframe' && allowIframe && (
          <div className="iframe-container flex justify-center mt-2 sm:mt-4">
            <iframe
              id={`iframe-${siteKey}`}
              src={siteUrl}
              className="w-full sm:w-[500px] md:w-[600px] h-[400px] sm:h-[500px] md:h-[600px] border-2 sm:border-4 rounded-lg shadow-lg"
              style={{ borderColor: 'var(--color-primary-border)', aspectRatio: '1/1' }}
              frameBorder="0"
              allowFullScreen
              title={`${siteName} Iframe`}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// IMPORTANT LINKS SECTION COMPONENT - Com Tabs e Carousel
function ImportantLinksSection() {
  const [activeCategory, setActiveCategory] = useState('mapas')
  const [currentSlide, setCurrentSlide] = useState(0)

  // Organizar sites por categoria
  const categories = {
    mapas: [
      { id: 'sin', name: 'SIN Interativo', url: 'https://sig.ons.org.br/app/sinmaps/', color: 'blue-500', iframe: true },
      { id: 'sinmaps', name: 'Mapas do SIN', url: 'https://www.ons.org.br/paginas/sobre-o-sin/mapas', color: 'blue-500', iframe: false },
      { id: 'ons-plc1', name: 'Procedimentos de Rede', url: 'https://www.ons.org.br/paginas/sobre-o-ons/procedimentos-de-rede/o-que-sao', color: 'blue-700', iframe: false },
      { id: 'ons-plc2', name: 'Resposta em Demanda', url: 'https://www.ons.org.br/paginas/energia-amanha/resposta-da-demanda', color: 'blue-700', iframe: false },

    ],
    dados: [
      { id: 'ons', name: 'ONS - Carga e Geração', url: 'https://www.ons.org.br/paginas/energia-agora/carga-e-geracao', color: 'blue-700', iframe: true }
    ],
    regulacao: [
      { id: 'aneel', name: 'ANEEL', url: 'https://www.gov.br/aneel/pt-br', color: 'blue-600', iframe: false },
      { id: 'docs', name: 'Documentos Publicados', url: 'https://www.ons.org.br/paginas/conhecimento/acervo-digital/documentos-e-publicacoes', color: 'blue-600', iframe: false },
      { id: 'docs-glossario', name: 'Glossário', url: 'https://www.ons.org.br/paginas/conhecimento/glossario', color: 'blue-600', iframe: false }
    ]
  }

  const currentCategorySites = categories[activeCategory] || []

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % currentCategorySites.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + currentCategorySites.length) % currentCategorySites.length)
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setCurrentSlide(0)
  }

  return (
    <section id="sites" className="mb-8 sm:mb-12 md:mb-16 animate-on-scroll scroll-mt-20">
      <div className="text-center mb-8 mt-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ color: 'var(--color-primary-dark)' }}>
          🔗 Links Importantes
        </h2>
        <p className="text-base sm:text-lg md:text-xl" style={{ color: 'var(--color-text-medium)' }}>
          Explore os principais órgãos e sistemas do setor elétrico brasileiro
        </p>
      </div>

      {/* Tabs de Categorias */}
      <div className="flex justify-center gap-2 sm:gap-4 mb-6 flex-wrap">
        <button
          onClick={() => handleCategoryChange('mapas')}
          className={`tab-btn px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${activeCategory === 'mapas' ? 'active' : 'bg-slate-200 hover:bg-cyan-500 hover:text-white'
            }`}
        >
          🗺️ Mapas
        </button>
        <button
          onClick={() => handleCategoryChange('dados')}
          className={`tab-btn px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${activeCategory === 'dados' ? 'active' : 'bg-slate-200 hover:bg-cyan-500 hover:text-white'
            }`}
        >
          📊 Dados em Tempo Real
        </button>
        <button
          onClick={() => handleCategoryChange('regulacao')}
          className={`tab-btn px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all ${activeCategory === 'regulacao' ? 'active' : 'bg-slate-200 hover:bg-cyan-500 hover:text-white'
            }`}
        >
          ⚖️ Regulação
        </button>
      </div>

      {/* Carousel Container */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Carousel Content */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {currentCategorySites.map((site) => (
                <div key={site.id} className="w-full flex-shrink-0 px-2">
                  <SiteCard
                    siteKey={site.id}
                    siteName={site.name}
                    siteUrl={site.url}
                    siteColor={site.color}
                    allowIframe={site.iframe}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Controls */}
          {currentCategorySites.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
                aria-label="Anterior"
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all"
                aria-label="Próximo"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Indicators */}
          {currentCategorySites.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {currentCategorySites.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${currentSlide === index ? 'bg-cyan-600 w-8' : 'bg-gray-300'
                    }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}



// NAVIGATION BUTTON COMPONENT - Agora apenas informativo
function NavigationButton({ id, icon, title, description, onClick }) {
  return (
    <div
      id={`btn-${id}`}
      onClick={onClick}
      className="main-nav-btn m-2 cursor-pointer p-6 rounded-xl hover:bg-cyan-100 transition-all duration-300 shadow-md hover:shadow-lg bg-white"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            {icon} {title}
          </h2>
          <p className="text-base sm:text-lg" style={{ color: 'var(--color-text-medium)' }}>{description}</p>
        </div>
        <div className="ml-4 flex items-center">
          <ChevronDown size={32} className="text-cyan-600" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-500 italic">👆 Clique para ver</p>
      </div>
    </div>
  )
}

// MAIN NAVIGATION COMPONENT
function MainNavigation({ onNavigate }) {
  const navigationSections = [
    { id: 'geracao', sectionId: 'content-geracao', icon: '⚡', title: 'Geração', description: 'Onde tudo começa convertendo outras fontes de energia' },
    { id: 'transmissao', sectionId: 'content-transmissao', icon: '🗼', title: 'Transmissão', description: 'Transportando a energia para todo o Brasil' },
    { id: 'distribuicao', sectionId: 'content-distribuicao', icon: '🏠', title: 'Distribuição', description: 'Quando a Energia chega na sua casa e na sua cidade' }
  ]

  return (
    <div className="main-navigation flex flex-col md:flex-row items-center justify-center text-center mb-8 animate-on-scroll">
      {navigationSections.map((section, index) => (
        <div key={section.id} className="flex items-center">
          {index > 0 && <FlowArrow />}
          <NavigationButton
            id={section.id}
            icon={section.icon}
            title={section.title}
            description={section.description}
            onClick={() => onNavigate(section.id, section.sectionId)}
          />
        </div>
      ))}
    </div>
  )
}

// TAB BUTTON COMPONENT
function TabButton({ index, name, isActive, onClick }) {
  return (
    <button
      className={`tab-btn px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-all duration-200 ${isActive ? 'active' : 'bg-slate-200 hover:bg-cyan-500 hover:text-white'
        }`}
      data-index={index}
      onClick={onClick}
    >
      {name}
    </button>
  )
}



// GENERATION CHART COMPONENT - Matriz Energética (%)
function ReusableChart({ chartId, type, data, options, deps = [] }) {
  const canvasRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      const { Chart } = await import('chart.js/auto')

      // Destruir gráfico existente associado a este canvas (se houver)
      const existing = Chart.getChart(canvasRef.current)
      if (existing) existing.destroy()
      if (instanceRef.current) {
        instanceRef.current.destroy()
        instanceRef.current = null
      }

      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx || cancelled) return

      instanceRef.current = new Chart(ctx, { type, data, options })
    }
    init()

    return () => {
      cancelled = true
      const cleanup = async () => {
        const { Chart } = await import('chart.js/auto')
        const existing = Chart.getChart(canvasRef.current)
        if (existing) existing.destroy()
        if (instanceRef.current) {
          instanceRef.current.destroy()
          instanceRef.current = null
        }
      }
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return (
    <div className="chart-container relative w-full max-w-sm mx-auto h-72 md:h-80">
      <canvas id={chartId} ref={canvasRef} />
    </div>
  )
}

// GENERATION CHART COMPONENT - Matriz Energética (%)
function GenerationChart() {
  const data = {
    labels: AppDataModel.chartData.labels,
    datasets: [{
      label: 'Matriz Energética (%)',
      data: AppDataModel.chartData.data,
      backgroundColor: AppDataModel.chartData.backgroundColor,
      borderColor: '#ffffff',
      borderWidth: 3
    }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { size: 12, family: 'Inter' } } },
      tooltip: { callbacks: { label: ctx => `${ctx.label || ''}: ${ctx.parsed || 0}%` } }
    }
  }
  return (
    <ReusableChart
      chartId="generationPercentChart"
      type="doughnut"
      data={data}
      options={options}
      deps={[JSON.stringify(data)]}
    />
  )
}

// CAPACITY CHART COMPONENT - Capacidade Instalada (MW)
function CapacityChart() {
  const capacityData = AppDataModel.generationData.map(item => item.capacityMW)
  const labels = AppDataModel.generationData.map(item => item.name)

  const data = {
    labels,
    datasets: [{
      label: 'Capacidade admissivel (MW)',
      data: capacityData,
      backgroundColor: AppDataModel.chartData.backgroundColor,
      borderColor: AppDataModel.chartData.backgroundColor.map(color => color),
      borderWidth: 2
    }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            try { return Number(value).toLocaleString() + ' MW' } catch { return value + ' MW' }
          }
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => `${ctx.parsed.y.toLocaleString()} MW` } }
    }
  }

  return (
    <ReusableChart
      chartId="capacityMWChart"
      type="bar"
      data={data}
      options={options}
      deps={[JSON.stringify(data)]}
    />
  )
}

// GENERATION SECTION COMPONENT
function GenerationSection({ isOpen, onToggle }) {
  const [activeTab, setActiveTab] = useState(0)
  const handleTabClick = useCallback((index) => { setActiveTab(index) }, [])

  return (
    <section
      id="content-geracao"
      className={`content-section rounded-xl shadow-lg p-6 md:p-8 mb-8 border-2 animate-on-scroll scroll-mt-20 ${isOpen ? 'open' : ''}`}
      style={{
        borderColor: isOpen ? 'var(--color-primary-border)' : 'var(--color-border)',
        minHeight: isOpen ? 'auto' : '180px'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
          ⚡ 1. Geração de Energia Elétrica
        </h3>
        <button
          onClick={onToggle}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-all"
          aria-label={isOpen ? 'Recolher seção' : 'Expandir seção'}
        >
          <ChevronDown
            size={24}
            className={`text-cyan-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </button>
      </div>
      <p className="text-base sm:text-lg mb-6" style={{ color: 'var(--color-text-medium)' }}>
        Esta é a primeira etapa, onde a energia é produzida de diversas Usinas.
        Explore os principais tipos de fontes de Usinas e veja uma representação de como elas compõem nossa matriz energética.
      </p>
      <div className="space-y-8">
        {/* Tabs e Descrição */}
        <div>
          <div id="tabs-container" className="flex flex-wrap gap-2 mb-4 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
            {AppDataModel.generationData.map((item, index) => (
              <TabButton key={index} index={index} name={item.name} isActive={activeTab === index} onClick={() => handleTabClick(index)} />
            ))}
          </div>
          <div id="tab-content-container" className="p-4 rounded-lg min-h-[200px]" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}>
            <p className="mb-3">{AppDataModel.generationData[activeTab].description}</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              Capacidade admissível: {AppDataModel.generationData[activeTab].capacityMW.toLocaleString()} MW
            </p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div id="chart-percent" className="flex flex-col items-center scroll-mt-20">
            <h4 className="text-xl sm:text-2xl font-semibold text-center mb-4">Matriz Energética (%)</h4>
            <GenerationChart />
          </div>
          <div id="chart-capacity" className="flex flex-col items-center scroll-mt-20">
            <h4 className="text-xl sm:text-2xl font-semibold text-center mb-4">Capacidade Instalada (MW)</h4>
            <CapacityChart />
          </div>

          <ImgContainer src="assets/matriz_energetica_2025_ONS.png" alt="Matriz Energética ONS" />
        </div>

        <MarkdownPage filePath="/mvc/models/notes/geracao_eng_eletrica.md" />

      </div>
    </section>
  )
}

// TRANSMISSION SECTION COMPONENT
function TransmissionSection({ isOpen, onToggle }) {
  const transmissionItems = [
    { title: 'Altas Tensões', description: 'Para reduzir perdas, a energia é transmitida em tensões muito elevadas, permitindo transportar mais energia com menos desperdício.' },
    { title: 'Linhas de Transmissão', description: 'São as grandes torres e cabos que levam a eletricidade por todo o país.' },
    { title: 'Subestações de Transmissão', description: 'Usam transformadores para elevar a tensão na saída das usinas e rebaixá-la perto das cidades.' }
  ]

  return (
    <section
      id="content-transmissao"
      className={`content-section rounded-xl shadow-lg p-6 md:p-8 mb-8 border-2 animate-on-scroll scroll-mt-20 ${isOpen ? 'open' : ''}`}
      style={{
        borderColor: isOpen ? 'var(--color-primary-border)' : 'var(--color-border)',
        minHeight: isOpen ? 'auto' : '180px'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
          🗼 2. Transmissão de Energia Elétrica
        </h3>
        <button
          onClick={onToggle}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-all"
          aria-label={isOpen ? 'Recolher seção' : 'Expandir seção'}
        >
          <ChevronDown
            size={24}
            className={`text-cyan-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </button>
      </div>
      <p className="text-base sm:text-lg mb-6" style={{ color: 'var(--color-text-medium)' }}>
        Após ser gerada, a energia precisa viajar grandes distâncias.
        Esta seção detalha como esse transporte é feito de forma eficiente e segura.
      </p>
      <ul className="space-y-4">
        {transmissionItems.map((item, index) => (
          <li key={index} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}>
            <strong>{item.title}:</strong> {item.description}
          </li>
        ))}
      </ul>
    </section>
  )
}

// DISTRIBUTION SECTION COMPONENT
function DistributionSection({ isOpen, onToggle }) {
  const distributionItems = [
    { title: 'Redução de Tensão', description: 'Transformadores em subestações de distribuição reduzem a tensão para níveis utilizáveis e seguros.' },
    { title: 'Redes de Distribuição', description: 'São os cabos e postes nas cidades que levam a energia até os transformadores de rua e, daí, para os consumidores.' },
    { title: 'Consumo Final', description: 'A energia chega em residências, comércios e indústrias, pronta para ser utilizada.' }
  ]

  return (
    <section
      id="content-distribuicao"
      className={`content-section rounded-xl shadow-lg p-6 md:p-8 mb-8 border-2 animate-on-scroll scroll-mt-20 ${isOpen ? 'open' : ''}`}
      style={{
        borderColor: isOpen ? 'var(--color-primary-border)' : 'var(--color-border)',
        minHeight: isOpen ? 'auto' : '180px'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
          🏠 3. Distribuição de Energia Elétrica
        </h3>
        <button
          onClick={onToggle}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-all"
          aria-label={isOpen ? 'Recolher seção' : 'Expandir seção'}
        >
          <ChevronDown
            size={24}
            className={`text-cyan-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </button>
      </div>
      <p className="text-base sm:text-lg mb-6" style={{ color: 'var(--color-text-medium)' }}>
        Esta é a etapa final, onde a energia elétrica é entregue aos consumidores em suas casas usando transformadores para reduzir Altas Tensões em tensões seguras e prontas para serem usadas.
      </p>
      <ul className="space-y-4">
        {distributionItems.map((item, index) => (
          <li key={index} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}>
            <strong>{item.title}:</strong> {item.description}
          </li>                

        ))}
      </ul>
    </section>
  )
}

// COMPONENT BUTTON
function ComponentButton({ index, name, isActive, onClick }) {
  return (
    <button
      className={`component-btn p-3 text-center rounded-lg font-semibold transition-all duration-200 ${isActive ? 'active' : 'bg-slate-100 hover:bg-cyan-600 hover:text-white'
        }`}
      data-index={index}
      onClick={onClick}
    >
      {name}
    </button>
  )
}

// COMPONENTS SECTION
function ComponentsSection() {
  const [activeComponent, setActiveComponent] = useState(null)
  const handleComponentClick = useCallback((index) => {
    setActiveComponent(prev => prev === index ? null : index) // Toggle selection
  }, [])

  // Check if the active component is "Linhas de Transmissão"
  const isTransmissionLine = activeComponent !== null &&
    AppDataModel.componentsData[activeComponent].name === "Linhas de Transmissão";



  return (
    <section
      id="components"
      className="rounded-xl shadow-lg p-6 md:p-8 mt-12 border animate-on-scroll scroll-mt-20"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
    >
      <h3 className="text-3xl sm:text-4xl font-bold text-center mb-2" style={{ color: 'var(--color-primary-dark)' }}>
        4. Componentes Chave de um Sistema de Potência
      </h3>
      <p className="text-base sm:text-lg mb-8 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-medium)' }}>
        Um sistema de potência é composto por diversos equipamentos.
        Clique nos botões para conhecer a função de cada um.
      </p>
      <div id="components-btn-container" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {AppDataModel.componentsData.map((component, index) => (
          <ComponentButton
            key={index}
            index={index}
            name={component.name}
            isActive={activeComponent === index}
            onClick={() => handleComponentClick(index)}
          />
        ))}
      </div>
      <div
        id="component-content-display"
        className="p-6 rounded-lg min-h-[100px] transition-all duration-300"
        style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}
      >
        {activeComponent !== null ? (
          <>
            <h4 className="font-bold text-lg sm:text-xl mb-2">
              {AppDataModel.componentsData[activeComponent].name}
            </h4>
            <p className="text-base sm:text-lg mb-4">
              {AppDataModel.componentsData[activeComponent].description}
            </p>

            {/* Conditional content for Transmission Lines */}
            {isTransmissionLine && (

              <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg">
                <h5 className="font-semibold mb-2">Sobre as Linhas de Transmissão:</h5>
                <p className="text-sm sm:text-base">
                  As linhas de transmissão são fundamentais para o SIN (Sistema Interligado Nacional),
                  conectando as usinas geradoras aos centros de consumo. Elas operam em diferentes níveis
                  de tensão, desde as linhas de transmissão de alta tensão (AT) até as de extra-alta tensão (EAT).
                  <br /><br />
                  Principais características:
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Operam em tensões a partir de 230 kV</li>
                    <li>São monitoradas 24/7 pelo ONS</li>
                    <li>Podem ser aéreas ou subterrâneas</li>
                    <li>Utilizam torres de aço ou concreto para suporte</li>
                  </ul>
                </p>
                <br />
                <p>Pedro Victor tem que estudar SEP, CA, Eletromag, Circuitos Digitais e Sinais e Sistemas para entender melhor o que é a transmissão de energia elétrica.</p>

                <MarkdownPage filePath="/mvc/models/notes/linhas_transmissao.md" />


                <a href="https://www.mundodaeletrica.com.br/o-que-sao-linhas-de-transmissao-caracteristicas-curiosidades/">Leia mais sobre Linhas de Transmissão</a>

              </div>
            )}
          </>
        ) : (
          <p className="text-center text-base sm:text-lg">
            Selecione um elemento do Sistema Elétrico para saber mais.
          </p>
        )}
      </div>
    </section>
  )
}

// EQUATIONS SECTION COMPONENT - Placeholder para futuro
function InequacoesSectionPLC() {
  return (
    <section>
      <h3>Inequações para controle de Reativo do Sistema</h3>
      <p>Uso de inequações como uma regra de tres investigando o antes e depois de uma sobrecarga em MW como (1800 MW) numa linhas</p>
      <p>A matriz de Indutancia (Jacobiano) me traz a caracteristica de como a linha se comporta em relação ao valor de P e Q. </p>
      <p>Com isso posso calcular o valor de P e Q para que a linha não ultrapasse a sua capacidade de transporte.</p>
      <p>Existe o PV e PQ para controles em SEP</p>
    </section>
  )
}


function EquationsSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section
      id="equations"
      className="rounded-xl shadow-lg p-6 md:p-8 mt-12 mb-12 border-2 animate-on-scroll scroll-mt-20"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-primary-border)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
          📊 Equações e Modelos Matemáticos de SEP
        </h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-all"
          aria-label={isOpen ? 'Recolher seção' : 'Expandir seção'}
        >
          {isOpen ? (
            <X size={24} className="text-gray-600" />
          ) : (
            <ChevronDown size={24} className="text-cyan-600" />
          )}
        </button>
      </div>

      <p className="text-base sm:text-lg mb-6" style={{ color: 'var(--color-text-medium)' }}>
        Explore as principais equações que governam os Sistemas Elétricos de Potência.
        Esta seção será expandida com equações em LaTeX e implementações em Python com SymPy.
      </p>

      {isOpen && (
        <div className="space-y-6">
          {/* Placeholder para conteúdo futuro */}
          <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h4 className="text-xl font-bold mb-3 text-gray-700">
              🚧 Em Desenvolvimento
            </h4>
            <p className="text-gray-600 mb-4">
              Esta seção incluirá:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Lei de Ohm:</strong> V = R × I</li>
              <li><strong>Potência Elétrica:</strong> P = V × I × cos(φ)</li>
              <li><strong>Fluxo de Potência:</strong> Equações de Newton-Raphson</li>
              <li><strong>Curto-Circuito:</strong> Cálculos de corrente de falta</li>
              <li><strong>Estabilidade:</strong> Equações de swing</li>
              <li><strong>Implementações em Python:</strong> Códigos com SymPy e NumPy</li>
            </ul>
            <div className="mt-4 p-4 bg-gray-50 rounded font-mono text-sm">
              <p className="text-gray-500"># Exemplo futuro:</p>
              <p className="text-blue-600">import sympy as sp</p>
              <p className="text-green-600">V, I, R = sp.symbols('V I R')</p>
              <p className="text-purple-600">ohms_law = sp.Eq(V, I * R)</p>
            </div>
          </div>
        </div>
      )}

      <InequacoesSectionPLC />

    </section>
  )
}

// FOOTER COMPONENT
function PageFooter() {
  return (
    <footer className="page-footer text-center mt-12 text-sm animate-on-scroll" style={{ color: 'var(--color-text-medium)' }}>
      <p>Aplicação Interativa desenvolvida para fins educacionais pela UFF e ONS.</p>
      <p>Desenvolvido por: Pedro Victor Rodrigues Veras</p>
    </footer>
  )
}

// MAIN APP COMPONENT
export default function Home() {
  const [activeSection, setActiveSection] = useState(null)

  // Hook para animações de gradiente no scroll
  useEffect(() => {
    const handleScrollGradient = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollableHeight <= 0) return

      const scrollTop = window.scrollY
      const scrollPercent = scrollTop / scrollableHeight

      const startColor = { r: 240, g: 249, b: 255 }
      const endColor = { r: 224, g: 242, b: 254 }

      const r = Math.round(startColor.r + (endColor.r - startColor.r) * scrollPercent)
      const g = Math.round(startColor.g + (endColor.g - startColor.g) * scrollPercent)
      const b = Math.round(startColor.b + (endColor.b - startColor.b) * scrollPercent)

      document.body.style.background = `linear-gradient(180deg, rgb(${r}, ${g}, ${b}) 0%, var(--color-bg-card-alt) 100%)`
    }

    window.addEventListener('scroll', handleScrollGradient, { passive: true })
    handleScrollGradient()

    return () => {
      window.removeEventListener('scroll', handleScrollGradient)
    }
  }, [])

  // Hook para intersection observer (animações de entrada)
  useEffect(() => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    if (!animatedElements.length) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })

    animatedElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [activeSection])

  const [openSections, setOpenSections] = useState({
    geracao: false,
    transmissao: false,
    distribuicao: false
  })

  const handleNavigate = useCallback((sectionKey, sectionId) => {
    // Expandir o card
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: true
    }))

    // Fazer scroll após um pequeno delay para garantir que o card expandiu
    setTimeout(() => {
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
    }, 500)
  }, [])

  const toggleSection = useCallback((sectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }, [])

  return (
    <div className="min-h-screen">
      <NavigationHeader />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <PageHeader />

        <main className="main-content">
          <ImportantLinksSection />

          <ImgContainer
            src="assets/geracao_transmissao_distribuicao_ONS.jpeg"
            alt="Sistema de Transmissão ONS"
            width="400"    // Largura em pixels
            height="300"   // Altura em pixels
            className="my-4" // optional
          />

          <MainNavigation
            onNavigate={handleNavigate}
          />
          

          <ImgContainer src="assets/energia_jurassic_wolrd.jpg" alt="Operador Jurassic World" width="400" height="300" className="my-4" />
          
          

          <div id="content-container" className="mt-4">
            <GenerationSection
              isOpen={openSections.geracao}
              onToggle={() => toggleSection('geracao')}
            />
            <TransmissionSection
              isOpen={openSections.transmissao}
              onToggle={() => toggleSection('transmissao')}
            />
            Imagem de Linhas de Transmissão aqui
            <DistributionSection
              isOpen={openSections.distribuicao}
              onToggle={() => toggleSection('distribuicao')}
            />
          </div>

          <ComponentsSection />

          <EquationsSection />
        </main>
        <NextJSComponenetTemplate />
        <PageFooter />
      </div>
    </div>
  )
}
