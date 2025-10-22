'use client';

import { useEffect, useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Settings } from 'lucide-react';
import {
  generationSources,
  systemComponents,
  selectedTab,
  selectedComponent,
  activeSection,
  chartData,
  transmissionContent,
  distributionContent,
  powerSystemActions
} from '@/store/powerSystemStore';
import { GenerationSource } from '@/models/GenerationSource';
import { SystemComponent } from '@/models/SystemComponent';
import NavigationFlow from '@/components/NavigationFlow';
import GenerationSection from '@/components/GenerationSection';
import TransmissionSection from '@/components/TransmissionSection';
import DistributionSection from '@/components/DistributionSection';
import ComponentsSection from '@/components/ComponentsSection';
import AdminPanel from '@/components/AdminPanel';
import { Button } from '@/components/ui/button';

export default function Home() {
  useSignals();
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await powerSystemActions.loadAllData();
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSectionChange = (section) => {
    powerSystemActions.setActiveSection(section);
  };

  const handleTabChange = (index) => {
    powerSystemActions.setSelectedTab(index);
  };

  const handleComponentSelect = (component) => {
    powerSystemActions.setSelectedComponent(component);
  };

  const handleCreateSource = async (data) => {
    const source = new GenerationSource(data);
    await powerSystemActions.createGenerationSource(source);
  };

  const handleUpdateSource = async (id, data) => {
    const source = new GenerationSource(data);
    await powerSystemActions.updateGenerationSource(id, source);
  };

  const handleDeleteSource = async (id) => {
    await powerSystemActions.deleteGenerationSource(id);
  };

  const handleCreateComponent = async (data) => {
    const component = new SystemComponent(data);
    await powerSystemActions.createSystemComponent(component);
  };

  const handleUpdateComponent = async (id, data) => {
    const component = new SystemComponent(data);
    await powerSystemActions.updateSystemComponent(id, component);
  };

  const handleDeleteComponent = async (id) => {
    await powerSystemActions.deleteSystemComponent(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
          <p className="text-slate-600 text-lg">Carregando Sistema Elétrico de Potência...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50">
      <div className="container mx-auto p-4 md:p-8">
        <div className="fixed top-4 right-4 z-40">
          <Button
            onClick={() => setShowAdmin(true)}
            className="bg-slate-800 hover:bg-slate-700 text-white shadow-lg"
          >
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </div>

        <header className="text-center mb-12 pt-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
            Sistema Elétrico de Potência Interativo
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-slate-600 mb-6">
            Uma jornada visual pela geração, transmissão e distribuição da energia elétrica que move nosso mundo.
          </p>
          <p className="text-sm text-slate-500">
            Desenvolvido para fins educacionais pela UFF e ONS
          </p>
        </header>

        <main>
          <NavigationFlow
            activeSection={activeSection.value}
            onSectionChange={handleSectionChange}
          />

          <div className="mt-8 space-y-4">
            {activeSection.value === 'geracao' && (
              <GenerationSection
                sources={generationSources.value}
                chartData={chartData.value}
                selectedTab={selectedTab.value}
                onTabChange={handleTabChange}
              />
            )}

            {activeSection.value === 'transmissao' && (
              <TransmissionSection content={transmissionContent.value} />
            )}

            {activeSection.value === 'distribuicao' && (
              <DistributionSection content={distributionContent.value} />
            )}
          </div>

          <ComponentsSection
            components={systemComponents.value}
            selectedComponent={selectedComponent.value}
            onComponentSelect={handleComponentSelect}
          />
        </main>

        <footer className="text-center mt-12 text-sm text-slate-600 pb-8">
          <p>Aplicação Interativa desenvolvida para fins educacionais pela UFF e ONS.</p>
          <p className="mt-2">Desenvolvido por: Pedro Victor Rodrigues Veras</p>
          <p className="mt-2 text-xs text-slate-500">
            Arquitetura MVC + SOLID | State Management: Preact Signals | Database: Supabase
          </p>
        </footer>
      </div>

      <AdminPanel
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        sources={generationSources.value}
        components={systemComponents.value}
        onCreateSource={handleCreateSource}
        onUpdateSource={handleUpdateSource}
        onDeleteSource={handleDeleteSource}
        onCreateComponent={handleCreateComponent}
        onUpdateComponent={handleUpdateComponent}
        onDeleteComponent={handleDeleteComponent}
      />
    </div>
  );
}
