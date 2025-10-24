import React, { useState, useEffect, useRef, useCallback } from 'react';
import Chart from 'chart.js/auto';

// --- 1. MODELO (Dados e Lógica de Negócio) ---
// Em React, os dados podem ser encapsulados em hooks ou serviços.
// Aqui, mantemos a simplicidade com um objeto para clareza.
const ElectricalSystemModel = {
  generationData: [
    { name: 'Hidrelétricas', description: 'Utilizam a força da água para girar turbinas e geradores. São uma fonte limpa e renovável, mas dependem de recursos hídricos.' },
    { name: 'Termelétricas', description: 'Queimam combustíveis fósseis ou biomassa para aquecer água, produzir vapor e girar turbinas. São flexíveis, mas emitem gases de efeito estufa.' },
    { name: 'Nucleares', description: 'Utilizam a fissão nuclear para gerar calor, que produz vapor para as turbinas. São eficientes e não emitem gases de efeito estufa, mas geram resíduos radioativos.' },
    { name: 'Eólicas', description: 'Convertem a energia do vento em eletricidade através de aerogeradores. São renováveis e limpas, mas intermitentes.' },
    { name: 'Solares', description: 'Convertem a luz do sol em eletricidade, seja por painéis fotovoltaicos (diretamente) ou por usinas termossolares. Também são renováveis e limpas, mas intermitentes.' }
  ],
  componentsData: [
    { name: 'Geradores', description: 'Convertem outras formas de energia (mecânica, térmica, etc.) em energia elétrica. São o coração das usinas.' },
    { name: 'Transformadores', description: 'Alteram os níveis de tensão da eletricidade. Elevam a tensão para a transmissão e a reduzem para a distribuição e consumo.' },
    { name: 'Linhas', description: 'Conduzem a energia através de cabos aéreos ou subterrâneos, formando as redes de transmissão e distribuição.' },
    { name: 'Disjuntores', description: 'Controlam o fluxo de energia e protegem o sistema contra falhas. Atuam como interruptores de grande porte.' },
    { name: 'Relés', description: 'Detectam condições anormais (curtos-circuitos) e acionam os disjuntores para isolar a falha e proteger o resto do sistema.' },
    { name: 'Barramentos', description: 'São barras condutoras que conectam vários circuitos em uma subestação, funcionando como um nó de distribuição de energia.' },
    { name: 'Reativos', description: 'Capacitores e Reatores são usados para controlar a tensão e compensar a potência reativa na rede, melhorando a eficiência e a estabilidade.' }
  ],
  chartData: {
    labels: ['Hidrelétrica', 'Termelétrica', 'Eólica', 'Solar', 'Nuclear & Outras'],
    data: [62, 20, 11, 5, 2],
    colors: ['#06b6d4', '#64748b', '#38bdf8', '#facc15', '#a8a29e']
  },
};

// --- 2. VIEW (Componentes React) ---
// Cada componente tem uma única responsabilidade (SRP).

const StyleInjector = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
            :root {
                --color-primary: #0891b2; --color-primary-dark: #111827; --color-primary-light: #ffffff;
                --color-primary-border: #67e8f9; --color-text-dark: #1f2937; --color-text-medium: #4b5563;
                --color-text-light: #f9fafb; --color-bg-card: #f3f4f6; --color-bg-card-alt: #ffffff;
                --color-border: #e5e7eb; --color-zinc: #a1a1aa;
            }
            body { font-family: 'Inter', sans-serif; background-color: white; transition: background 0.5s ease-out; }
            .animate-on-scroll { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
            .animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
            .main-nav-btn { border-width: 2px; border-color: transparent; transition: all 0.3s ease; }
            .main-nav-btn.active { border-color: var(--color-primary-border); background-color: var(--color-primary-light); transform: scale(1.02); box-shadow: 0 4px 14px 0 rgba(8, 145, 178, 0.25); }
            .tab-btn.active { background-color: var(--color-primary); color: var(--color-text-light); }
            .component-btn.active { background-color: var(--color-primary); color: var(--color-text-light); transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
            .flow-arrow { font-size: 2rem; color: var(--color-zinc); }
        `;
    document.head.appendChild(style);
  }, []);
  return null;
};

const Header = React.memo(({ onNavigate, activeSection }) => (
  <header className="container mx-auto text-center p-4 md:p-8 animate-on-scroll">
    <img src="https://raw.githubusercontent.com/pedro-v-veras/SEP-Interativo/main/public/assets/Logo_ONSInspira_1%201.png" alt="Logo ONS Inspira" className="mx-auto h-40 w-auto mb-4" />
    <h1 className="text-4xl md:text-5xl font-extrabold mb-2" style={{ color: 'var(--color-text-dark)' }}>O Caminho da Energia Elétrica</h1>
    <p className="text-lg max-w-3xl mx-auto mb-8" style={{ color: 'var(--color-text-medium)' }}>Uma jornada interativa sobre como a eletricidade é gerada, transmitida e distribuída até chegar a você.</p>
    <nav className="flex flex-col md:flex-row items-center justify-center text-center">
      {[{ key: 'geracao', title: '⚡ Geração' }, { key: 'transmissao', title: '🗼 Transmissão' }, { key: 'distribuicao', title: '🏠 Distribuição' }].map((item, index, arr) => (
        <React.Fragment key={item.key}>
          <div onClick={() => onNavigate(item.key)} className={`main-nav-btn m-2 cursor-pointer p-4 rounded-lg hover:bg-gray-100 ${activeSection === item.key ? 'active' : ''}`}>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{item.title}</h2>
          </div>
          {index < arr.length - 1 && <div className="flow-arrow hidden md:block mx-4">→</div>}
        </React.Fragment>
      ))}
    </nav>
  </header>
));

const ChartComponent = React.memo(() => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const chart = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ElectricalSystemModel.chartData.labels,
        datasets: [{ data: ElectricalSystemModel.chartData.data, backgroundColor: ElectricalSystemModel.chartData.colors, borderWidth: 3, borderColor: 'var(--color-bg-card)' }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
    return () => chart.destroy();
  }, []);
  return (
    <div className="lg:w-1/2 flex flex-col items-center mt-8 lg:mt-0">
      <h4 className="text-xl font-semibold text-center mb-4">Exemplo de Matriz Energética</h4>
      <div className="relative w-full max-w-sm h-72 md:h-80"><canvas ref={canvasRef}></canvas></div>
    </div>
  );
});

const Section = ({ title, description, children, isActive }) => {
  if (!isActive) return null;
  return (
    <section className="rounded-xl shadow-lg p-6 md:p-8 mb-8 border animate-on-scroll" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <h3 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text-dark)' }}>{title}</h3>
      <p className="mb-6" style={{ color: 'var(--color-text-medium)' }}>{description}</p>
      {children}
    </section>
  );
};

// --- 3. CONTROLLER (Lógica de Estado no Componente Principal) ---
// O estado da UI é centralizado aqui (Single Source of Truth)
function App() {
  const [activeSection, setActiveSection] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeComponent, setActiveComponent] = useState(null);

  const handleNavigate = useCallback((section) => {
    setActiveSection(prev => (prev === section ? null : section));
  }, []);

  // Efeitos de Scroll (Animação e Gradiente)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible'));
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    const handleScrollGradient = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      const r = 255 - 29 * scrollPercent;
      const g = 255 - 23 * scrollPercent;
      const b = 255 - 15 * scrollPercent;
      document.body.style.background = `linear-gradient(180deg, rgb(${r}, ${g}, ${b}) 0%, #f8fafc 100%)`;
    };
    window.addEventListener('scroll', handleScrollGradient, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollGradient);
      observer.disconnect();
    };
  }, [activeSection]); // Re-ativa a observação se a seção mudar e novos elementos aparecerem

  return (
    <>
      <StyleInjector />
      <div className="container mx-auto p-4">
        <Header onNavigate={handleNavigate} activeSection={activeSection} />
        <main>
          <Section title="1. Geração de Energia Elétrica" description="Esta é a primeira etapa, onde a energia é produzida a partir de diversas fontes. Explore os principais tipos de usinas e veja uma representação de como elas compõem nossa matriz energética." isActive={activeSection === 'geracao'}>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <div className="flex flex-wrap gap-2 mb-4 border-b pb-2" style={{ borderColor: 'var(--color-border)' }}>
                  {ElectricalSystemModel.generationData.map((item, index) => (
                    <button key={item.name} onClick={() => setActiveTab(index)} className={`tab-btn px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-gray-200 hover:bg-cyan-500 hover:text-white ${activeTab === index ? 'active' : ''}`}>{item.name}</button>
                  ))}
                </div>
                <div className="p-4 rounded-lg min-h-[150px]" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}>
                  <p>{ElectricalSystemModel.generationData[activeTab]?.description}</p>
                </div>
              </div>
              <ChartComponent />
            </div>
          </Section>

          <Section title="2. Transmissão de Energia Elétrica" description="Após ser gerada, a energia precisa viajar grandes distâncias. Esta seção detalha como esse transporte é feito de forma eficiente e segura." isActive={activeSection === 'transmissao'}>
            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}><strong>Altas Tensões:</strong> Para reduzir perdas, a energia é transmitida em tensões muito elevadas.</div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}><strong>Linhas de Transmissão:</strong> São as grandes torres e cabos que levam a eletricidade por todo o país.</div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}><strong>Subestações:</strong> Usam transformadores para elevar e rebaixar a tensão.</div>
            </div>
          </Section>

          <Section title="3. Distribuição de Energia Elétrica" description="Esta é a etapa final da jornada, onde a energia elétrica é entregue aos consumidores em tensões seguras e utilizáveis." isActive={activeSection === 'distribuicao'}>
            <div className="space-y-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}><strong>Redução de Tensão:</strong> Transformadores reduzem a tensão para níveis seguros.</div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}><strong>Redes de Distribuição:</strong> Cabos e postes nas cidades que levam a energia até os consumidores.</div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-card-alt)' }}><strong>Consumo Final:</strong> A energia chega em residências, comércios e indústrias.</div>
            </div>
          </Section>

          <div className="rounded-xl shadow-lg p-6 md:p-8 mt-12 border animate-on-scroll" style={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--color-text-dark)' }}>4. Componentes Chave</h3>
            <p className="mb-8 text-center max-w-3xl mx-auto" style={{ color: 'var(--color-text-medium)' }}>Clique nos botões para conhecer a função de cada equipamento.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              {ElectricalSystemModel.componentsData.map((item, index) => (
                <button key={item.name} onClick={() => setActiveComponent(index)} className={`component-btn p-3 text-center rounded-lg bg-gray-100 hover:bg-cyan-600 hover:text-white font-semibold transition-all duration-200 ${activeComponent === index ? 'active' : ''}`}>{item.name}</button>
              ))}
            </div>
            <div className="p-6 rounded-lg min-h-[100px]" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-text-dark)' }}>
              {activeComponent !== null ? (
                <div>
                  <h4 className="font-bold text-lg mb-2">{ElectricalSystemModel.componentsData[activeComponent].name}</h4>
                  <p>{ElectricalSystemModel.componentsData[activeComponent].description}</p>
                </div>
              ) : (<p className="text-center text-gray-500">Selecione um componente para ver sua descrição.</p>)}
            </div>
          </div>
        </main>
        <footer className="text-center mt-12 pb-8 text-sm animate-on-scroll" style={{ color: 'var(--color-text-medium)' }}>
          <p>Aplicação Interativa desenvolvida para fins educacionais pela UFF e ONS.</p>
        </footer>
      </div>
    </>
  );
}

export default App;

