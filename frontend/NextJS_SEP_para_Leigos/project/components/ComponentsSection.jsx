'use client';

import { useSignals } from '@preact/signals-react/runtime';
import * as Icons from 'lucide-react';

export default function ComponentsSection({ components, selectedComponent, onComponentSelect }) {
  useSignals();

  const getIcon = (iconName) => {
    const Icon = Icons[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || Icons.Box;
    return Icon;
  };

  if (!components || components.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Carregando componentes do sistema...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-12 border border-slate-200">
      <h3 className="text-3xl font-bold text-center mb-2 text-slate-800">
        4. Componentes Chave de um Sistema de Potência
      </h3>
      <p className="mb-8 text-center max-w-3xl mx-auto text-slate-600">
        Um sistema de potência é composto por diversos equipamentos.
        Clique nos botões para conhecer a função de cada um.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {components.map((component) => {
          const Icon = getIcon(component.icon);
          const isActive = selectedComponent?.id === component.id;

          return (
            <button
              key={component.id}
              onClick={() => onComponentSelect(component)}
              className={`p-4 text-center rounded-lg font-semibold transition-all duration-200 flex flex-col items-center gap-2 ${
                isActive
                  ? 'bg-cyan-600 text-white shadow-lg transform -translate-y-1'
                  : 'bg-slate-100 hover:bg-cyan-500 hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm">{component.name}</span>
            </button>
          );
        })}
      </div>

      <div className="p-6 rounded-lg bg-cyan-50 min-h-[120px] transition-all duration-300">
        {selectedComponent ? (
          <>
            <h4 className="font-bold text-lg mb-2 text-cyan-900">{selectedComponent.name}</h4>
            <p className="text-slate-700 leading-relaxed">{selectedComponent.description}</p>
          </>
        ) : (
          <p className="text-center text-slate-600">Selecione um componente para ver sua descrição.</p>
        )}
      </div>
    </section>
  );
}
