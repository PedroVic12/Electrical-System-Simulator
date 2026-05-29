'use client'
import { useState, useCallback } from 'react'
import { AppDataModel } from '../../models/AppDataModel'
import { MarkdownPage } from '../components/MarkdownPage'

function ComponentButton({ index, name, isActive, onClick }) {
  return (
    <button
      className={`component-btn p-3 text-center rounded-lg font-semibold transition-all duration-200 ${isActive ? 'active' : ''}`}
      style={{
        backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
        color: isActive ? 'white' : 'var(--color-text)',
        borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)'
      }}
      onClick={onClick}
    >
      {name}
    </button>
  )
}

export function ComponentsSection() {
  const [activeComponent, setActiveComponent] = useState(null)
  const handleComponentClick = useCallback((index) => { setActiveComponent(prev => prev === index ? null : index) }, [])

  return (
    <section 
      id="components" 
      className="rounded-xl shadow-lg p-6 md:p-8 mt-12 border animate-on-scroll scroll-mt-20"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text)'
      }}
    >
      <h3 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--color-primary-dark)' }}>
        4. Componentes Chave de um Sistema de Potência
      </h3>
      <p className="text-center mb-8" style={{ color: 'var(--color-text-secondary)' }}>
        Um sistema de potência é composto por diversos equipamentos. Clique nos botões para conhecer a função de cada um.
      </p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
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
        className="p-6 rounded-lg transition-all duration-300 min-h-[150px]" 
        style={{ 
          backgroundColor: 'var(--color-bg-secondary)', 
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)'
        }}
      >
        {activeComponent !== null ? (
          <>
            <h4 className="font-bold text-xl mb-2" style={{ color: 'var(--color-primary)' }}>
              {AppDataModel.componentsData[activeComponent].name}
            </h4>
            <p className="mb-4">{AppDataModel.componentsData[activeComponent].description}</p>
            {AppDataModel.componentsData[activeComponent].name === "Linhas de Transmissão" && (
              <div className="mt-4 p-4 rounded-lg bg-black/5">
                <p className="mb-4">Pedro Victor tem que estudar SEP, CA, Eletromag, Circuitos Digitais e Sinais e Sistemas para entender melhor o que é a transmissão de energia elétrica.</p>
                <MarkdownPage filePath="/mvc/models/notes/linhas_transmissao.md" />
                <a 
                  href="https://www.mundodaeletrica.com.br/o-que-sao-linhas-de-transmissao-caracteristicas-curiosidades/"
                  className="text-cyan-600 hover:underline mt-4 inline-block font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leia mais sobre Linhas de Transmissão
                </a>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-lg italic" style={{ color: 'var(--color-text-secondary)' }}>
            Selecione um elemento do Sistema Elétrico para saber mais.
          </p>
        )}
      </div>
    </section>
  )
}
