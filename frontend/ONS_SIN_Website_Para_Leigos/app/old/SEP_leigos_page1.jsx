'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Importar Chart.js dinamicamente para evitar problemas de SSR
const Chart = dynamic(() => import('chart.js/auto').then((mod) => mod.Chart), { ssr: false })

// ============================================================================
// MVC INTEGRATION - Integração com Model-View-Controller
// ============================================================================

// DATA MODEL - Carregado do arquivo público
const AppDataModel = {
  generationData: [
    { id: 'hidreletricas', name: 'Hidrelétricas', description: 'Utilizam a força da água para girar turbinas e geradores. São uma fonte limpa e renovável, mas dependem de recursos hídricos.', notePath: '/mvc/models/notes/hidreletricas.md' },
    { id: 'termeletricas', name: 'Termelétricas', description: 'Queimam combustíveis fósseis ou biomassa para aquecer água, produzir vapor e girar turbinas. São flexíveis, mas emitem gases de efeito estufa.', notePath: '/mvc/models/notes/termeletricas.md' },
    { id: 'nucleares', name: 'Nucleares', description: 'Utilizam a fissão nuclear para gerar calor, que produz vapor para as turbinas. São eficientes e não emitem gases de efeito estufa, mas geram resíduos radioativos.', notePath: '/mvc/models/notes/nucleares.md' },
    { id: 'eolicas', name: 'Eólicas', description: 'Convertem a energia do vento em eletricidade através de aerogeradores. São renováveis e limpas, mas intermitentes.', notePath: '/mvc/models/notes/eolicas.md' },
    { id: 'solares', name: 'Solares', description: 'Convertem a luz do sol em eletricidade, seja por painéis fotovoltaicos (diretamente) ou por usinas termossolares. Também são renováveis e limpas, mas intermitentes.', notePath: '/mvc/models/notes/solares.md' }
  ],
  componentsData: [
    { id: 'geradores', name: 'Geradores', description: 'Convertem outras formas de energia (mecânica, térmica, etc.) em energia elétrica. São o coração das usinas.' },
    { id: 'transformadores', name: 'Transformadores', description: 'Alteram os níveis de tensão da eletricidade. Elevam a tensão para a transmissão e a reduzem para a distribuição e consumo.' },
    { id: 'linhas', name: 'Linhas', description: 'Conduzem a energia através de cabos aéreos ou subterrâneos, formando as redes de transmissão e distribuição.' },
    { id: 'disjuntores', name: 'Disjuntores', description: 'Controlam o fluxo de energia e protegem o sistema contra falhas. Atuam como interruptores de grande porte.' },
    { id: 'reles', name: 'Relés', description: 'Detectam condições anormais (curtos-circuitos) e acionam os disjuntores para isolar a falha e proteger o resto do sistema.' },
    { id: 'barramentos', name: 'Barramentos', description: 'São barras condutoras que conectam vários circuitos em uma subestação, funcionando como um nó de distribuição de energia.' },
    { id: 'reativos', name: 'Reativos', description: 'Capacitores e Reatores são usados para controlar a tensão e compensar a potência reativa na rede, melhorando a eficiência e a estabilidade.' }
  ],
  externalSites: {
    sin: { id: 'sin', name: 'SIN', url: 'https://sig.ons.org.br/app/sinmaps/', color: 'blue-500', iframe: true },
    sinmaps: { id: 'sinmaps', name: 'SIN Maps', url: 'https://www.ons.org.br/paginas/sobre-o-sin/mapas', color: 'blue-500', iframe: false },
    aneel: { id: 'aneel', name: 'ANEEL', url: 'https://www.gov.br/aneel/pt-br', color: 'blue-600', iframe: false },
    ons: { id: 'ons', name: 'ONS - Carga e Geração em tempo real', url: 'https://www.ons.org.br/paginas/energia-agora/carga-e-geracao', color: 'blue-700', iframe: true }
  },
  chartData: {
    labels: ['Hidrelétrica', 'Termelétrica', 'Eólica', 'Solar', 'Nuclear & Outras'],
    data: [62, 20, 11, 5, 2],
    backgroundColor: ['#06b6d4', '#64748b', '#38bdf8', '#facc15', '#a8a29e']
  }
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

const markdownToHtml = (markdown) => {
  if (!markdown) return ''
  return markdown
    .replace(/^### (.*$)/gim, '<h3 class="text-lg sm:text-xl font-bold mt-3 sm:mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl sm:text-2xl font-bold mt-4 sm:mt-6 mb-2 sm:mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl sm:text-3xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>')
    .replace(/\n\n/g, '</p><p class="mb-3 sm:mb-4 text-sm sm:text-base">')
}

// HEADER COMPONENT - Responsivo
function PageHeader() {
  return (
    <header className="page-header text-center mb-8 sm:mb-10 md:mb-12 px-4 animate-on-scroll">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight" style={{ color: 'var(--color-primary-dark)' }}>
        Sistema Elétrico de Potência Interativo para Leigos e Estudantes
      </h1>
      <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-2" style={{ color: 'var(--color-text-medium)' }}>
        Uma jornada visual pela geração, transmissão e distribuição da energia elétrica que move nosso mundo.
      </p>
      <img 
        src="/assets/Logo_ONSInspira_1 1.png" 
        alt="Logo ONS Inspira" 
        className="mx-auto h-32 sm:h-40 md:h-48 w-auto mb-4 mt-4"
      />
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
              className={`view-mode-btn flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium border-2 text-sm sm:text-base ${
                viewMode === 'iframe' 
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
            className={`view-mode-btn flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium border-2 text-sm sm:text-base ${
              viewMode === 'newtab' 
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

// IMPORTANT LINKS SECTION COMPONENT
function ImportantLinksSection() {
  return (
    <section className="important-links-section mb-12 animate-on-scroll">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-primary-dark)' }}>
          🔗 Links Importantes
        </h2>
        <p className="text-lg" style={{ color: 'var(--color-text-medium)' }}>
          Explore os principais órgãos e sistemas do setor elétrico brasileiro
        </p>
      </div>

      <div className="links-container max-w-4xl mx-auto">
        {Object.entries(AppDataModel.externalSites).map(([key, { name, url, color, iframe }]) => (
          <SiteCard
            key={key}
            siteKey={key}
            siteName={name}
            siteUrl={url}
            siteColor={color}
            allowIframe={iframe}
          />
        ))}
      </div>
    </section>
  )
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

// NAVIGATION BUTTON COMPONENT
function NavigationButton({ id, icon, title, description, isActive, onClick }) {
  return (
    <div 
      id={`btn-${id}`}
      onClick={onClick}
      className={`main-nav-btn m-2 cursor-pointer p-4 rounded-lg hover:bg-cyan-100 transition-all duration-300 ${
        isActive ? 'active' : ''
      }`}
    >
      <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
        {icon} {title}
      </h2>
      <p style={{ color: 'var(--color-text-medium)' }}>{description}</p>
    </div>
  )
}

// MAIN NAVIGATION COMPONENT
function MainNavigation({ activeSection, onSectionChange }) {
  const navigationSections = [
    { id: 'geracao', icon: '⚡', title: 'Geração', description: 'Onde tudo começa' },
    { id: 'transmissao', icon: '🗼', title: 'Transmissão', description: 'Levando energia longe' },
    { id: 'distribuicao', icon: '🏠', title: 'Distribuição', description: 'Energia na sua porta' }
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
            isActive={activeSection === section.id}
            onClick={() => onSectionChange(section.id)}
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
      className={`tab-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        isActive ? 'active' : 'bg-slate-200 hover:bg-cyan-500 hover:text-white'
      }`}
      data-index={index}
      onClick={onClick}
    >
      {name}
    </button>
  )
}

// GENERATION CHART COMPONENT
function GenerationChart() {
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && chartRef.current && !chartInstanceRef.current) {
      import('chart.js/auto').then((ChartModule) => {
        const ChartJS = ChartModule.Chart
        const ctx = chartRef.current.getContext('2d')
        chartInstanceRef.current =  ChartJS(ctx, {
          type: 'doughnut',
          data: {
            labels: AppDataModel.chartData.labels,
            datasets: [{
              label: 'Matriz Energética (%)',
              data: AppDataModel.chartData.data,
              backgroundColor: AppDataModel.chartData.backgroundColor,
              borderColor: 'var(--color-bg-card)',
              borderWidth: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { font: { size: 12, family: 'Inter' } } },
              tooltip: { callbacks: { label: ctx => `${ctx.label || ''}: ${ctx.parsed || 0}%` } }
            }
          }
        })
      })
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className="chart-container relative w-full max-w-sm mx-auto h-72 md:h-80">
      <canvas ref={chartRef} id="generationChart"></canvas>
    </div>
  )
}

// GENERATION SECTION COMPONENT
function GenerationSection({ isActive }) {
  const [activeTab, setActiveTab] = useState(0)
  const handleTabClick = useCallback((index) => { setActiveTab(index) }, [])

  return (
    <section 
      id="content-geracao"
      className={`content-section rounded-xl shadow-lg p-6 md:p-8 mb-8 border animate-on-scroll ${isActive ? 'open' : ''}`}
    >
      <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-primary-dark)' }}>
        1. Geração de Energia Elétrica
      </h3>
      <p className="mb-6" style={{ color: 'var(--color-text-medium)' }}>
        Esta é a primeira etapa, onde a energia é produzida a partir de diversas fontes. 
        Explore os principais tipos de usinas e veja uma representação de como elas compõem nossa matriz energética.
      </p>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div id="tabs-container" className="flex flex-wrap gap-2 mb-4 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
            {AppDataModel.generationData.map((item, index) => (
              <TabButton key={index} index={index} name={item.name} isActive={activeTab === index} onClick={() => handleTabClick(index)} />
            ))}
          </div>
          <div id="tab-content-container" className="p-4 rounded-lg min-h-[200px]" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}>
            <p>{AppDataModel.generationData[activeTab].description}</p>
          </div>
        </div>
        <div className="lg:w-1/2 flex flex-col items-center">
          <h4 className="text-xl font-semibold text-center mb-4">Exemplo de Matriz Energética</h4>
          <GenerationChart />
        </div>
      </div>
    </section>
  )
}

// TRANSMISSION SECTION COMPONENT
function TransmissionSection({ isActive }) {
  const transmissionItems = [
    { title: 'Altas Tensões', description: 'Para reduzir perdas, a energia é transmitida em tensões muito elevadas, permitindo transportar mais energia com menos desperdício.' },
    { title: 'Linhas de Transmissão', description: 'São as grandes torres e cabos que levam a eletricidade por todo o país.' },
    { title: 'Subestações de Transmissão', description: 'Usam transformadores para elevar a tensão na saída das usinas e rebaixá-la perto das cidades.' }
  ]

  return (
    <section 
      id="content-transmissao"
      className={`content-section rounded-xl shadow-lg p-6 md:p-8 mb-8 border animate-on-scroll ${isActive ? 'open' : ''}`}
    >
      <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-primary-dark)' }}>
        2. Transmissão de Energia Elétrica
      </h3>
      <p className="mb-6" style={{ color: 'var(--color-text-medium)' }}>
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
function DistributionSection({ isActive }) {
  const distributionItems = [
    { title: 'Redução de Tensão', description: 'Transformadores em subestações de distribuição reduzem a tensão para níveis utilizáveis e seguros.' },
    { title: 'Redes de Distribuição', description: 'São os cabos e postes nas cidades que levam a energia até os transformadores de rua e, daí, para os consumidores.' },
    { title: 'Consumo Final', description: 'A energia chega em residências, comércios e indústrias, pronta para ser utilizada.' }
  ]

  return (
    <section 
      id="content-distribuicao"
      className={`content-section rounded-xl shadow-lg p-6 md:p-8 mb-8 border animate-on-scroll ${isActive ? 'open' : ''}`}
    >
      <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-primary-dark)' }}>
        3. Distribuição de Energia Elétrica
      </h3>
      <p className="mb-6" style={{ color: 'var(--color-text-medium)' }}>
        Esta é a etapa final da jornada, onde a energia elétrica é entregue aos consumidores 
        em tensões seguras e utilizáveis.
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
      className={`component-btn p-3 text-center rounded-lg font-semibold transition-all duration-200 ${
        isActive ? 'active' : 'bg-slate-100 hover:bg-cyan-600 hover:text-white'
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
  const handleComponentClick = useCallback((index) => { setActiveComponent(index) }, [])

  return (
    <section 
      className="rounded-xl shadow-lg p-6 md:p-8 mt-12 border animate-on-scroll"
      style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
    >
      <h3 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--color-primary-dark)' }}>
        4. Componentes Chave de um Sistema de Potência
      </h3>
      <p className="mb-8 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-medium)' }}>
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
            <h4 className="font-bold text-lg mb-2">{AppDataModel.componentsData[activeComponent].name}</h4>
            <p>{AppDataModel.componentsData[activeComponent].description}</p>
          </>
        ) : (
          <p className="text-center">Selecione um componente para ver sua descrição.</p>
        )}
      </div>
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

  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(prev => prev === sectionId ? null : sectionId)
  }, [])

  return (
    <div className="app-container container mx-auto p-4 md:p-8">
      <PageHeader />
      
      <main className="main-content">
        <ImportantLinksSection />
        
        <MainNavigation 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        
        <div id="content-container" className="mt-4">
          <GenerationSection isActive={activeSection === 'geracao'} />
          <TransmissionSection isActive={activeSection === 'transmissao'} />
          <DistributionSection isActive={activeSection === 'distribuicao'} />
        </div>

        <ComponentsSection />
      </main>

      <PageFooter />
    </div>
  )
}