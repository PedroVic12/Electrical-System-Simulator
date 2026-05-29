'use client'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

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
        <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-primary)' }}>{siteName}</h3>
        <div className="flex gap-2 mb-4">
          {allowIframe && (
            <button 
              onClick={handleToggleIframe} 
              className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm transition-all ${viewMode === 'iframe' ? 'bg-cyan-600 text-white border-cyan-600' : 'border-cyan-600/30 hover:bg-cyan-600/10'}`}
            >
              📺 Iframe
            </button>
          )}
          <button 
            onClick={handleOpenNewTab} 
            className={`flex-1 px-4 py-2 rounded-lg border-2 text-sm transition-all ${viewMode === 'newtab' ? 'bg-green-600 text-white border-green-600' : 'border-green-600/30 hover:bg-green-600/10'}`}
          >
            🔗 Nova Aba
          </button>
        </div>
        {viewMode === 'iframe' && allowIframe && (
          <div className="iframe-container overflow-hidden rounded-lg border-2" style={{ borderColor: 'var(--color-border)' }}>
            <iframe 
              src={siteUrl} 
              className="w-full h-[450px] bg-white" 
              title={siteName} 
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function ImportantLinksSection() {
  const [activeCategory, setActiveCategory] = useState('mapas')
  const [currentSlide, setCurrentSlide] = useState(0)

  const categories = {
    mapas: [
      { id: 'sin', name: 'SIN Interativo', url: 'https://sig.ons.org.br/app/sinmaps/', color: 'blue-500', iframe: true },
      { id: "pv-plc-control", name: "Meus displays - PIVISION", url: "http://rbvis02.reger.ons/PIVision/#/Displays/23279/PLC---PV-Control", color: "blue-500", iframe: true },
      { id: "sp-440kv", name: "SP 440kV - PIVISION", url: "http://rbvis02.reger.ons/PIVision/#/Displays/23061/Tela-S%C3%A3o-Paulo-440-kV", color: "blue-500", iframe: true },
      { id: "RJ-ES-500KV", name: "Área RJ-ES - PIVISION", url: "http://rbvis02.reger.ons/PIVision/#/Displays/23259/%C3%81rea-RJ-ES--500-345-kV", color: "blue-500", iframe: true },
      { id: 'sinmaps', name: 'Mapas do SIN', url: 'https://www.ons.org.br/paginas/sobre-o-sin/mapas', color: 'blue-500', iframe: false },
      { id: 'ons-plc1', name: 'Procedimentos de Rede', url: 'https://www.ons.org.br/paginas/sobre-o-ons/procedimentos-de-rede/o-que-sao', color: 'blue-700', iframe: false },
      { id: 'ons-plc2', name: 'Resposta em Demanda', url: 'https://www.ons.org.br/paginas/energia-amanha/resposta-da-demanda', color: 'blue-700', iframe: false },
    ],
    dados: [
      { id: 'ons', name: 'ONS - Carga e Geração', url: 'https://www.ons.org.br/paginas/energia-agora/carga-e-geracao', color: 'blue-700', iframe: true },
      { id: "pivision", name: "Usina Complexo Madeira - Dados em tempo Real", url: "http://rbvis02.reger.ons/PIVision/#/Displays/12361/MADEIRA_HVDC", color: "blue-700", iframe: true },
      { id: "sin-pivision", name: "SIN - PIVISION", url: "http://rbvis02.reger.ons/PIVision/#/Displays/12393/SIN-PI-VISION", color: "blue-700", iframe: true }
    ],
    regulacao: [
      { id: 'aneel', name: 'ANEEL', url: 'https://www.gov.br/aneel/pt-br', color: 'blue-600', iframe: false },
      { id: "dados-aneel", name: "Dados Abertos ANEEL", url: "https://leis.org/aneel", color: "blue-600", iframe: false },
      { id: 'docs', name: 'Documentos Publicados', url: 'https://www.ons.org.br/paginas/conhecimento/acervo-digital/documentos-e-publicacoes', color: 'blue-600', iframe: false },
      { id: 'docs-glossario', name: 'Glossário', url: 'https://www.ons.org.br/paginas/conhecimento/glossario', color: 'blue-600', iframe: false }
    ]
  }

  const sites = categories[activeCategory] || []
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sites.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sites.length) % sites.length)

  return (
    <section id="sites" className="mb-8 animate-on-scroll scroll-mt-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">🔗 Links Importantes</h2>
        <p style={{ color: 'var(--color-text-secondary)' }}>Explore os principais órgãos e dados públicos do SIN</p>
      </div>
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {Object.keys(categories).map(cat => (
          <button 
            key={cat} 
            onClick={() => { setActiveCategory(cat); setCurrentSlide(0); }} 
            className={`px-6 py-2 rounded-lg font-bold transition-all border-2 ${activeCategory === cat ? 'bg-cyan-600 text-white border-cyan-600 shadow-lg' : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] opacity-70 hover:opacity-100'}`}
          >
            {cat === 'mapas' ? '🗺️ MAPAS' : cat === 'dados' ? '📊 DADOS' : '⚖️ REGULAÇÃO'}
          </button>
        ))}
      </div>
      <div className="max-w-4xl mx-auto relative">
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {sites.map(site => (
              <div key={site.id} className="w-full flex-shrink-0 px-2">
                <SiteCard siteKey={site.id} siteName={site.name} siteUrl={site.url} siteColor={site.color} allowIframe={site.iframe} />
              </div>
            ))}
          </div>
        </div>
        {sites.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full p-2 shadow-lg z-10 hover:scale-110 transition-transform"><ChevronRight size={24} className="rotate-180" /></button>
            <button onClick={nextSlide} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-full p-2 shadow-lg z-10 hover:scale-110 transition-transform"><ChevronRight size={24} /></button>
          </>
        )}
      </div>
    </section>
  )
}
