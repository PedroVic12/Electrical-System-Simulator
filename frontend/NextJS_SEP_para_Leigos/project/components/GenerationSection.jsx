'use client';

import PowerSystemChart from './PowerSystemChart';
import { useSignals } from '@preact/signals-react/runtime';

export default function GenerationSection({ sources, chartData, selectedTab, onTabChange }) {
  useSignals();

  if (!sources || sources.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Carregando dados de geração...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-slate-200">
      <h3 className="text-3xl font-bold mb-4 text-slate-800">1. Geração de Energia Elétrica</h3>
      <p className="mb-6 text-slate-600">
        Esta é a primeira etapa, onde a energia é produzida a partir de diversas fontes.
        Explore os principais tipos de usinas e veja uma representação de como elas compõem nossa matriz energética.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="flex flex-wrap gap-2 mb-4 border-b pb-2 border-slate-200">
            {sources.map((source, index) => (
              <button
                key={source.id}
                onClick={() => onTabChange(index)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedTab === index
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-slate-200 hover:bg-cyan-500 hover:text-white'
                }`}
              >
                {source.name}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-lg bg-slate-50 min-h-[200px]">
            <p className="text-slate-700 leading-relaxed">
              {sources[selectedTab]?.description || 'Selecione uma fonte de energia para ver a descrição.'}
            </p>
          </div>
        </div>

        <div className="lg:w-1/2 flex flex-col items-center">
          <h4 className="text-xl font-semibold text-center mb-4 text-slate-800">
            Exemplo de Matriz Energética
          </h4>
          <PowerSystemChart data={chartData} />
        </div>
      </div>
    </section>
  );
}
