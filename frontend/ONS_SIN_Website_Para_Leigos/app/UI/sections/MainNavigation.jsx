'use client'
import { ChevronDown } from 'lucide-react'
import { FlowArrow } from '../components/MediaComponents'

function NavigationButton({ icon, title, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="main-nav-btn m-2 cursor-pointer p-6 transition-all duration-300 flex flex-col items-center text-center group"
      style={{ minWidth: '250px' }}
    >
      <div className="flex items-center justify-between w-full mb-4">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
          {icon} {title}
        </h2>
        <ChevronDown size={28} className="text-cyan-600 transition-transform group-hover:translate-y-1" />
      </div>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{description}</p>
      <div className="mt-4 pt-4 border-t w-full" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-xs italic" style={{ color: 'var(--color-text-secondary)' }}>👆 Clique para expandir</p>
      </div>
    </div>
  )
}

export function MainNavigation({ onNavigate }) {
  const sections = [
    { id: 'geracao', sectionId: 'content-geracao', icon: '⚡', title: 'Geração', description: 'Usinas despacham diversas fontes de energia diferentes' },
    { id: 'transmissao', sectionId: 'content-transmissao', icon: '🗼', title: 'Transmissão', description: 'Transportando e Operando a Energia para todo o Brasil' },
    { id: 'distribuicao', sectionId: 'content-distribuicao', icon: '🏠', title: 'Distribuição', description: 'Quando a Energia chega na sua casa e na sua cidade' }
  ]

  return (
    <div className="flex flex-col md:flex-row items-center justify-center mb-12 animate-on-scroll">
      {sections.map((section, index) => (
        <div key={section.id} className="flex flex-col md:flex-row items-center">
          {index > 0 && <FlowArrow />}
          <NavigationButton
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
