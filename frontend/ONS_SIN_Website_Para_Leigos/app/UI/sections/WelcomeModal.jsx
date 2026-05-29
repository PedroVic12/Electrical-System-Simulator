'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { VideoContainer } from '../components/MediaComponents'

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem('welcomeModalSeen')
    if (!hasVisited) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('welcomeModalSeen', 'true')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div 
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300 border"
        style={{ 
          backgroundColor: 'var(--color-bg-card)', 
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)'
        }}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 hover:bg-white/10 transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <X size={24} />
        </button>

        <div className="p-8 text-center">
          <header className="mb-8">
            <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl" style={{ color: 'var(--color-primary)' }}>
              SEP Interativo para Leigos e Estudantes
            </h1>
            <p className="mx-auto max-w-lg text-lg" style={{ color: 'var(--color-text-secondary)' }}>
              Uma jornada pelos estudos de Engenharia Elétrica passando pela Geração, Transmissão e Distribuição da Energia Elétrica que abastece nosso mundo e todo Brasil.
            </p>
          </header>

          <div className="mb-8 flex flex-col items-center">
            <p className="mb-6 text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
              Entenda como funciona os Estudos de Simulação, Planejamento de Curto Prazo e Modelagem Matemática de Sistemas Elétricos de Potência ao alcance de um clique.
            </p>
            
            <p className="mb-6 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Este site é feito em parceria ao projeto ONS Inspira, um projeto social que estimula jovens e talentos promissores contra a evasão escolar.
            </p>

            <div
              className="relative h-40 w-64 cursor-pointer overflow-hidden rounded-xl shadow-lg border-2"
              style={{ borderColor: 'var(--color-primary-border)' }}
              onMouseEnter={() => setShowVideo(true)}
              onMouseLeave={() => setShowVideo(false)}
              onClick={() => setShowVideo(!showVideo)}
            >
              <img
                src="/assets/Logo_ONSInspira.png"
                alt="Logo ONS Inspira"
                className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 bg-white p-2 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
              />
              <div className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
                <VideoContainer
                  path_video="/assets/Animação_Logo_ONS_INOVAE.mp4"
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-full px-10 py-4 font-bold text-white transition-all hover:scale-105 hover:shadow-xl active:scale-95"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Iniciar Jornada
          </button>
        </div>
      </div>
    </div>
  )
}
