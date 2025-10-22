'use client';

import { Zap, Radio, Home } from 'lucide-react';

export default function NavigationFlow({ activeSection, onSectionChange }) {
  const sections = [
    { id: 'geracao', icon: Zap, title: 'Geração', subtitle: 'Onde tudo começa' },
    { id: 'transmissao', icon: Radio, title: 'Transmissão', subtitle: 'Levando energia longe' },
    { id: 'distribuicao', icon: Home, title: 'Distribuição', subtitle: 'Energia na sua porta' }
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center text-center mb-8">
      {sections.map((section, index) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <div key={section.id} className="flex items-center">
            <div
              onClick={() => onSectionChange(section.id)}
              className={`m-2 cursor-pointer p-6 rounded-lg transition-all duration-300 border-2 ${
                isActive
                  ? 'bg-cyan-50 border-cyan-300 transform scale-105 shadow-lg'
                  : 'bg-white border-transparent hover:bg-cyan-50 hover:border-cyan-200'
              }`}
            >
              <div className="flex flex-col items-center">
                <Icon className={`w-12 h-12 mb-2 ${isActive ? 'text-cyan-600' : 'text-cyan-500'}`} />
                <h2 className={`text-2xl font-bold ${isActive ? 'text-cyan-600' : 'text-cyan-500'}`}>
                  {section.title}
                </h2>
                <p className="text-slate-600">{section.subtitle}</p>
              </div>
            </div>

            {index < sections.length - 1 && (
              <>
                <div className="hidden md:block text-4xl text-zinc-400 mx-4">→</div>
                <div className="block md:hidden text-4xl text-zinc-400 my-2">↓</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
