'use client'
import { useState } from 'react'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

export function NavigationHeader() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleSubMenu = (menuId) => {
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }))
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
      setIsSideMenuOpen(false)
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-sm transition-colors duration-300" style={{ backgroundColor: 'var(--color-header-bg)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo e Toggle */}
            <div className="flex items-center space-x-4">
              <a 
                href="#inicio" 
                onClick={(e) => { e.preventDefault(); scrollToSection('intro'); }} 
                className="rounded-full border p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <img src="/assets/ons_logo.jpg" alt="Logo ONS" width={40} height={40} className="h-10 w-auto rounded-full" />
              </a>
              <ThemeToggle />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-2">
              <button onClick={() => scrollToSection('intro')} className="nav-header-btn">🏠 Início</button>
              
              <div className="relative group">
                <button 
                  onClick={() => scrollToSection('content-geracao')} 
                  className="nav-header-btn flex items-center gap-1"
                >
                  ⚡ Geração <ChevronDown size={14} />
                </button>
                <div className="absolute hidden group-hover:block top-full left-0 border rounded-xl shadow-2xl py-2 w-52 transition-all z-[60]" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
                  {['Hidrelétricas', 'Termelétricas', 'Nucleares', 'Eólicas', 'Solares'].map(item => (
                    <button 
                      key={item}
                      onClick={() => scrollToSection('content-geracao')}
                      className="block w-full text-left px-5 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-medium"
                      style={{ color: 'var(--color-text)' }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => scrollToSection('content-transmissao')} className="nav-header-btn">🗼 Transmissão</button>
              <button onClick={() => scrollToSection('content-distribuicao')} className="nav-header-btn">🏠 Distribuição</button>
              <button onClick={() => scrollToSection('components')} className="nav-header-btn">⚙️ Componentes</button>
              <button onClick={() => scrollToSection('equations')} className="nav-header-btn">📊 Modelagem</button>
              <button onClick={() => scrollToSection('sites')} className="nav-header-btn">🌐 Sites Úteis</button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsSideMenuOpen(!isSideMenuOpen)} 
              className="md:hidden p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: 'var(--color-text)' }}
            >
              {isSideMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Side Menu */}
      <aside 
        className={`fixed top-16 left-0 z-40 w-64 h-screen transition-transform ${isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'} border-r md:hidden`}
        style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <button onClick={() => scrollToSection('intro')} className="flex items-center w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                <span>🏠 Início</span>
              </button>
            </li>
            
            <li>
              <button 
                onClick={() => toggleSubMenu('generation')} 
                className="flex items-center w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-left justify-between"
              >
                <span>⚡ Geração</span>
                {expandedMenus['generation'] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              {expandedMenus['generation'] && (
                <ul className="py-2 space-y-2 pl-6">
                  {['Hidrelétricas', 'Termelétricas', 'Nucleares', 'Eólicas', 'Solares'].map(item => (
                    <li key={item}>
                      <button onClick={() => scrollToSection('content-geracao')} className="flex items-center w-full p-2 rounded-lg hover:bg-white/5 text-sm text-gray-400">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <button onClick={() => scrollToSection('content-transmissao')} className="flex items-center w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                <span>🗼 Transmissão</span>
              </button>
            </li>

            <li>
              <button onClick={() => scrollToSection('content-distribuicao')} className="flex items-center w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                <span>🏠 Distribuição</span>
              </button>
            </li>

            <li>
              <button onClick={() => scrollToSection('components')} className="flex items-center w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                <span>⚙️ Componentes</span>
              </button>
            </li>

            <li>
              <button onClick={() => scrollToSection('equations')} className="flex items-center w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                <span>📊 Modelagem Matemática</span>
              </button>
            </li>

            <li>
              <button onClick={() => scrollToSection('sites')} className="flex items-center w-full p-3 rounded-lg hover:bg-white/5 transition-colors text-left">
                <span>🌐 Sites Úteis</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
      
      {isSideMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsSideMenuOpen(false)} />
      )}
    </>
  )
}
