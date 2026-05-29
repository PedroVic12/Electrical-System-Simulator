'use client'
import { useState, useEffect, useCallback } from 'react'

// Layout & UI Sections
import { NavigationHeader } from './UI/sections/NavigationHeader'
import WelcomeModal from './UI/sections/WelcomeModal'
import { ImportantLinksSection } from './UI/sections/ImportantLinksSection'
import { MainNavigation } from './UI/sections/MainNavigation'
import { GenerationSection, TransmissionSection, DistributionSection } from './UI/sections/SEPSections'
import { ComponentsSection } from './UI/sections/ComponentsSection'
import { EquationsSection } from './UI/sections/EquationsSection'
import { PageFooter } from './UI/sections/PageFooter'

// Components
import { ImgContainer } from './UI/components/MediaComponents'

// Utils
import { animateOnScroll } from './lib/utils'

export default function Home() {
  const [openSections, setOpenSections] = useState({
    geracao: false,
    transmissao: false,
    distribuicao: false
  })

  // Hook para intersection observer (animações de entrada)
  useEffect(() => {
    animateOnScroll()
  }, [])

  const handleNavigate = useCallback((sectionKey, sectionId) => {
    setOpenSections(prev => ({ ...prev, [sectionKey]: true }))

    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      }
    }, 300)
  }, [])

  const toggleSection = useCallback((sectionKey) => {
    setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }))
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* O Modal de boas-vindas */}
      <WelcomeModal />

      <NavigationHeader />

      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8 pt-32">
        <main className="main-content">
          <ImportantLinksSection />

          <div className="my-12 text-center">
            <p className="text-lg mb-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Conheça cada etapa da jornada da Energia Elétrica:
            </p>
            <ImgContainer
              src="assets/geracao_transmissao_distribuicao_ONS.jpeg"
              alt="Fluxo do Sistema Elétrico: Geração -> Transmissão -> Distribuição"
              className="max-w-4xl mx-auto rounded-xl shadow-lg border-2"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <MainNavigation onNavigate={handleNavigate} />

          <div className="my-12 text-center">
            <p className="text-lg mb-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Na imagem abaixo, podemos ver a representação do processo de Transmissão de Energia Elétrica em um jogo
            </p>
            <ImgContainer 
              src="assets/energia_jurassic_wolrd.jpg" 
              alt="Operador SEP de Jurassic World Evolution" 
              className="max-w-4xl mx-auto rounded-xl shadow-lg border-2" 
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div id="content-container" className="space-y-4">
            <GenerationSection
              isOpen={openSections.geracao}
              onToggle={() => toggleSection('geracao')}
            />
            <TransmissionSection
              isOpen={openSections.transmissao}
              onToggle={() => toggleSection('transmissao')}
            />
            
            <div className="text-center my-8">
              <p className="text-lg mb-4 font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                Na imagem abaixo, podemos ver como é representado uma Rede Elétrica com suas altas tensões de suas linhas de transmissão
              </p>
              <ImgContainer 
                src="assets/rede_eletrica_draw.jpg" 
                alt="Rede Elétrica" 
                className="max-w-4xl mx-auto rounded-xl shadow-lg border-2" 
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>

            <DistributionSection
              isOpen={openSections.distribuicao}
              onToggle={() => toggleSection('distribuicao')}
            />
          </div>

          <ComponentsSection />
          <EquationsSection />
        </main>

        <PageFooter />
      </div>
    </div>
  )
}
