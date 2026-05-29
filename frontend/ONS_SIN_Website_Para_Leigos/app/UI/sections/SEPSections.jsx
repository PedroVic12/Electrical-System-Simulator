'use client'
import { useState, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { AppDataModel } from '../../models/AppDataModel'
import { MarkdownPage } from '../components/MarkdownPage'
import { ImgContainer } from '../components/MediaComponents'
import { GenerationChart, CapacityChart } from '../components/Charts'

function TabButton({ index, name, isActive, onClick }) {
  return (
    <button
      className={`tab-btn px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-all duration-200 ${isActive ? 'active' : ''}`}
      style={{
        backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
        color: isActive ? 'white' : 'var(--color-text)',
        borderColor: 'var(--color-border)'
      }}
      onClick={onClick}
    >
      {name}
    </button>
  )
}

export function GenerationSection({ isOpen, onToggle }) {
  const [activeTab, setActiveTab] = useState(0)
  const handleTabClick = useCallback((index) => { setActiveTab(index) }, [])

  return (
    <section
      id="content-geracao"
      className={`content-section shadow-lg p-6 md:p-8 mb-8 border-2 animate-on-scroll scroll-mt-20 ${isOpen ? 'open' : ''}`}
      style={{ borderColor: isOpen ? 'var(--color-primary)' : 'var(--color-border)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
          ⚡ 1. Geração de Energia Elétrica
        </h3>
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-100/10 transition-colors">
          <ChevronDown size={24} className={`text-cyan-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <p className="text-base sm:text-lg mb-6">
        Esta é a primeira etapa, o ONS coordena as usinas geradoras (Hidréltricas, Eólicas, Solares, Nuclear e Térmicas) para enviar eletricidade em alta tensão por mais de 170 mil quilômetros de linhas de tranmissão. Explore os principais tipos de fontes de Usinas e veja uma representação de como elas compõem nossa matriz energética.
      </p>
      {isOpen && (
        <div className="space-y-8">
          <div>
            <div className="flex flex-wrap gap-2 mb-4 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
              {AppDataModel.generationData.map((item, index) => (
                <TabButton key={index} name={item.name} isActive={activeTab === index} onClick={() => handleTabClick(index)} />
              ))}
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <p className="mb-3">{AppDataModel.generationData[activeTab].description}</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                Capacidade admissível: {AppDataModel.generationData[activeTab].capacityMW.toLocaleString()} MW
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <h4 className="text-xl font-semibold mb-4">Matriz Energética (%)</h4>
              <GenerationChart />
            </div>
            <div className="flex flex-col items-center">
              <h4 className="text-xl font-semibold mb-4">Capacidade Instalada (MW)</h4>
              <CapacityChart />
            </div>
          </div>
          <div className="text-center">
            <p className="mb-4">Na imagem abaixo, podemos ver como é feito o planejametno da Matriz energética pelo ONS</p>
            <ImgContainer src="assets/matriz_energetica_2025_ONS.png" alt="Matriz Energética ONS" />
          </div>
          <MarkdownPage filePath="/mvc/models/notes/geracao_eng_eletrica.md" />
        </div>
      )}
    </section>
  )
}

export function TransmissionSection({ isOpen, onToggle }) {
  const transmissionItems = [
    { title: 'Elevação de Tensões', description: 'Para reduzir as perdas, a Energia é transmitida em tensões muito elevadas, permitindo transportar mais energia com menos desperdício. A Energia sai da Usina e passa por subestações elevadoras que usam transformadores para elevar a tensão na saída das usinas e rebaixá-la perto das cidades. Os transformadores aumentam a tensão em 230KV ou 500KV. Isso é necessário para reduzir a corrente elétrica e evitar as perdas de energia por aquecimento em longas distãncias' },
    { title: 'O papel do ONS (Operador Nacional do Sistema Elétrico)', description: 'O ONS funciona como o "Maestro" dessa etapa. As suas principais funções na tranmissão incluem: Despacho centralizado das Usinas, Garantia de Segurança na operação, Intercâmbios Regionais' },
    { title: 'Linhas de Transmissão', description: 'A eletricidade viaja pelas gigantescas Linhas de Tranmissão que são as grandes torres e cabos que levam a eletricidade por todo o país.' },
    { title: 'Subestações, Redução e Distribuição', description: 'Ao chegar ao destino, a energia passam por subestações abaixadoras, que reduzem a tensão para os níveis seguros antes de a energia ser entregue pelas redes de distribuição locais até as tomadas no valor de 110V ou 220V' }
  ]

  return (
    <section
      id="content-transmissao"
      className={`content-section shadow-lg p-6 md:p-8 mb-8 border-2 animate-on-scroll scroll-mt-20 ${isOpen ? 'open' : ''}`}
      style={{ borderColor: isOpen ? 'var(--color-primary)' : 'var(--color-border)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
          🗼 2. Transmissão de Energia Elétrica
        </h3>
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-100/10 transition-colors">
          <ChevronDown size={24} className={`text-cyan-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <p className="text-base sm:text-lg mb-6">
        Após a Energia ser gerada pelas Usinas, a energia precisa viajar quilômetros de distâncias. A transmissão é o elo entrea a geração nas usinas e a distribuição para os consumidores de residências e comércios. O processo ocorre em etapas:
      </p>
      {isOpen && (
        <div className="space-y-6">
          <ul className="space-y-4">
            {transmissionItems.map((item, index) => (
              <li key={index} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
                <strong style={{ color: 'var(--color-primary)' }}>{item.title}:</strong> {item.description}
              </li>
            ))}
          </ul>
          
          <h2 className='text-2xl font-bold mt-8 mb-4' style={{ color: 'var(--color-primary-dark)' }}>
            As Vantagens do SIN
          </h2>
          <p className="text-base sm:text-lg mb-4">
            Por conectar todo o Brasil em uma única malha em paralelo, não é possivel rastrear a origem exata da energai que chega aos consumidores. A energia pode vir de uma Hidrelétrica na Amazônia ou um parque eólico no Nordeste ou de uma térmica no Rio de Janeiro. Então, o SIN possuis algumas vantagens:
          </p>
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
            <p className="mb-4">
              <strong style={{ color: 'var(--color-primary)' }}>Complementaridade Energética: </strong> Permite o uso otimizado de diferentes matrizes. Quando há seca (periodo onde há menor força das águas), o sistema pode despachar masi energias eólicas ou termelétricas, mantendo o sistema estável.
            </p>
            <p>
              <strong style={{ color: 'var(--color-primary)' }}>Economia: </strong> Evita que cada região precise construir usinas superdimensionadas apenas para atender seus picos de consumo, dividindo os custos e recursos entre todo o território brasileiro.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}

export function DistributionSection({ isOpen, onToggle }) {
  const distributionItems = [
    { title: 'Redução de Tensão', description: 'Os Transformadores Trifásicos e Monofásicos em subestações de distribuição reduzem a tensão para níveis utilizáveis e seguros.' },
    { title: 'Redes de Distribuição', description: 'São os cabos e postes nas cidades que levam a energia até os transformadores de rua para a casa dos consumidores.' },
    { title: 'Consumo de Energia para as pesssoas', description: 'A energia chega em residências, comércios e indústrias, pronta para ser utilizada.' }
  ]

  return (
    <section
      id="content-distribuicao"
      className={`content-section shadow-lg p-6 md:p-8 mb-8 border-2 animate-on-scroll scroll-mt-20 ${isOpen ? 'open' : ''}`}
      style={{ borderColor: isOpen ? 'var(--color-primary)' : 'var(--color-border)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
          🏠 3. Distribuição de Energia Elétrica
        </h3>
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-100/10 transition-colors">
          <ChevronDown size={24} className={`text-cyan-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <p className="text-base sm:text-lg mb-6">
        Esta é a etapa final, onde a energia elétrica é entregue aos consumidores em suas casas usando transformadores para reduzir Altas Tensões em tensões seguras e prontas para serem usadas.
      </p>
      {isOpen && (
        <ul className="space-y-4">
          {distributionItems.map((item, index) => (
            <li key={index} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <strong style={{ color: 'var(--color-primary)' }}>{item.title}:</strong> {item.description}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
