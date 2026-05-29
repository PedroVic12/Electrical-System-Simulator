'use client'
import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export function EquationsSection() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section 
      id="equations" 
      className="rounded-xl shadow-lg p-6 md:p-8 mt-12 mb-12 border-2 animate-on-scroll scroll-mt-20"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-primary-border)',
        color: 'var(--color-text)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-3xl font-bold" style={{ color: 'var(--color-primary-dark)' }}>
          📊 Equações e Modelos Matemáticos de SEP
        </h3>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 rounded-lg hover:bg-gray-100/10 transition-colors"
        >
          {isOpen ? <X size={24} /> : <ChevronDown size={24} className="text-cyan-600" />}
        </button>
      </div>

      <p className="text-base sm:text-lg mb-6">
        Explore as principais equações que governam os Sistemas Elétricos de Potência. 
        Uso de inequações como uma regra de tres investigando o antes e depois de uma sobrecarga em MW como (1800 MW) numa linhas.
      </p>

      {isOpen && (
        <div className="space-y-6">
          <div className="p-6 rounded-lg border-2 border-dashed" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
            <h4 className="text-xl font-bold mb-4">Matriz de Admitância e Fluxo de Potência</h4>
            <p className="mb-4">
              A matriz de Indutancia (Jacobiano) me traz a caracteristica de como a linha se comporta em relação ao valor de P e Q. 
              Com isso posso calcular o valor de P e Q para que a linha não ultrapasse a sua capacidade de transporte.
            </p>
            
            <div className="bg-white/5 p-4 rounded mb-4 overflow-x-auto">
              <p className="font-semibold mb-2">Equação do Fluxo de Potência Ativa:</p>
              <BlockMath math="P_i = \sum_{j=1}^{n} |V_i||V_j|(G_{ij} \cos \theta_{ij} + B_{ij} \sin \theta_{ij})" />
            </div>

            <div className="bg-white/5 p-4 rounded mb-4 overflow-x-auto">
              <p className="font-semibold mb-2">Lei de Ohm em Sistemas de Potência:</p>
              <BlockMath math="V = Z \cdot I" />
            </div>

            <h4 className="text-xl font-bold mb-3 mt-8">Controles em SEP</h4>
            <p className="mb-4">Existe o controle PV (Tensão Controlada) e PQ (Carga) para estabilidade do sistema.</p>
            
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
              <li><strong>Barra PV:</strong> <InlineMath math="P" /> e <InlineMath math="|V|" /> são conhecidos.</li>
              <li><strong>Barra PQ:</strong> <InlineMath math="P" /> e <InlineMath math="Q" /> são conhecidos.</li>
            </ul>

            <div className="mt-8 p-4 bg-gray-900 rounded font-mono text-sm text-green-400 overflow-x-auto">
              <p className="text-gray-500"># Exemplo de modelagem com Python (SymPy):</p>
              <p>import sympy as sp</p>
              <p>V, I, Z = sp.symbols('V I Z')</p>
              <p>ohm_law = sp.Eq(V, I * Z)</p>
              <p>print(sp.solve(ohm_law, I))</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
