'use client';

import { useSignals } from '@preact/signals-react/runtime';

export default function DistributionSection({ content }) {
  useSignals();

  if (!content || content.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        Carregando conteúdo de distribuição...
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-slate-200">
      <h3 className="text-3xl font-bold mb-4 text-slate-800">3. Distribuição de Energia Elétrica</h3>
      <p className="mb-6 text-slate-600">
        Esta é a etapa final da jornada, onde a energia elétrica é entregue aos consumidores
        em tensões seguras e utilizáveis.
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
