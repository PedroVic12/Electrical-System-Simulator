import { useState } from 'react';
import { PowerSystemNav } from '@/components/PowerSystemNav';
import { GenerationSection } from '@/components/sections/GenerationSection';
import { TransmissionSection } from '@/components/sections/TransmissionSection';
import { DistributionSection } from '@/components/sections/DistributionSection';
import { ComponentsSection } from '@/components/sections/ComponentsSection';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();

  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <header
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-dark leading-tight">
            Sistema Elétrico de Potência Interativo
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground mb-6 leading-relaxed">
            Uma jornada visual pela geração, transmissão e distribuição da energia elétrica que move nosso mundo.
          </p>
          <p className="text-sm text-muted-foreground">
            Para Leigos e Estudantes | UFF & ONS Inspira
          </p>
        </header>

        {/* Main Navigation */}
        <main>
          <PowerSystemNav
            activeSection={activeSection}
            onSectionClick={handleSectionClick}
          />

          {/* Content Sections */}
          <div className="mt-8">
            {(activeSection === 'geracao' || activeSection === null) && <GenerationSection />}
            {(activeSection === 'transmissao' || activeSection === null) && <TransmissionSection />}
            {(activeSection === 'distribuicao' || activeSection === null) && <DistributionSection />}
            <ComponentsSection />
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-sm text-muted-foreground space-y-2 pb-8">
          <p>Aplicação Interativa desenvolvida para fins educacionais pela UFF e ONS</p>
          <p className="font-medium">Desenvolvido por: Pedro Victor Rodrigues Veras</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
