'use client';

import { useSignals } from '@preact/signals-react/runtime';

export default function TransmissionSection({ content }) {
  useSignals();

  if (!content || content.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Carregando conteúdo de transmissão...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-slate-200">
      <h3 className="text-3xl font-bold mb-4 text-slate-800">2. Transmissão de Energia Elétrica</h3>
      <p className="mb-6 text-slate-600">
        Após ser gerada, a energia precisa viajar grandes distâncias.
        Esta seção detalha como esse transporte é feito de forma eficiente e segura.
      </p>

      <ul className="space-y-4">
        {content.map((item) => (
          <li
            key={item.id}
            className="p-4 rounded-lg bg-slate-50 hover:bg-cyan-50 transition-colors duration-200"
          >
            <strong className="text-cyan-700">{item.title}:</strong>{' '}
            <span className="text-slate-700">{item.content}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
