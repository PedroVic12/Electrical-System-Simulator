// ============================================================================
// APP DATA MODEL - Modelo de dados centralizado da aplicação
// ============================================================================

const AppDataModel = {
  // Dados de geração de energia
  generationData: [
    { 
      id: 'hidreletricas',
      name: 'Hidrelétricas', 
      description: 'Utilizam a força da água para girar turbinas e geradores. São uma fonte limpa e renovável, mas dependem de recursos hídricos.',
      notePath: '/mvc/models/notes/hidreletricas.md'
    },
    { 
      id: 'termeletricas',
      name: 'Termelétricas', 
      description: 'Queimam combustíveis fósseis ou biomassa para aquecer água, produzir vapor e girar turbinas. São flexíveis, mas emitem gases de efeito estufa.',
      notePath: '/mvc/models/notes/termeletricas.md'
    },
    { 
      id: 'nucleares',
      name: 'Nucleares', 
      description: 'Utilizam a fissão nuclear para gerar calor, que produz vapor para as turbinas. São eficientes e não emitem gases de efeito estufa, mas geram resíduos radioativos.',
      notePath: '/mvc/models/notes/nucleares.md'
    },
    { 
      id: 'eolicas',
      name: 'Eólicas', 
      description: 'Convertem a energia do vento em eletricidade através de aerogeradores. São renováveis e limpas, mas intermitentes.',
      notePath: '/mvc/models/notes/eolicas.md'
    },
    { 
      id: 'solares',
      name: 'Solares', 
      description: 'Convertem a luz do sol em eletricidade, seja por painéis fotovoltaicos (diretamente) ou por usinas termossolares. Também são renováveis e limpas, mas intermitentes.',
      notePath: '/mvc/models/notes/solares.md'
    }
  ],

  // Dados de componentes do sistema
  componentsData: [
    { 
      id: 'geradores',
      name: 'Geradores', 
      description: 'Convertem outras formas de energia (mecânica, térmica, etc.) em energia elétrica. São o coração das usinas.' 
    },
    { 
      id: 'transformadores',
      name: 'Transformadores', 
      description: 'Alteram os níveis de tensão da eletricidade. Elevam a tensão para a transmissão e a reduzem para a distribuição e consumo.' 
    },
    { 
      id: 'linhas',
      name: 'Linhas', 
      description: 'Conduzem a energia através de cabos aéreos ou subterrâneos, formando as redes de transmissão e distribuição.' 
    },
    { 
      id: 'disjuntores',
      name: 'Disjuntores', 
      description: 'Controlam o fluxo de energia e protegem o sistema contra falhas. Atuam como interruptores de grande porte.' 
    },
    { 
      id: 'reles',
      name: 'Relés', 
      description: 'Detectam condições anormais (curtos-circuitos) e acionam os disjuntores para isolar a falha e proteger o resto do sistema.' 
    },
    { 
      id: 'barramentos',
      name: 'Barramentos', 
      description: 'São barras condutoras que conectam vários circuitos em uma subestação, funcionando como um nó de distribuição de energia.' 
    },
    { 
      id: 'reativos',
      name: 'Reativos', 
      description: 'Capacitores e Reatores são usados para controlar a tensão e compensar a potência reativa na rede, melhorando a eficiência e a estabilidade.' 
    }
  ],

  // Sites externos
  externalSites: {
    sin: { 
      id: 'sin',
      name: 'SIN', 
      url: 'https://sig.ons.org.br/app/sinmaps/', 
      color: 'blue-500', 
      iframe: true 
    },
    sinmaps: { 
      id: 'sinmaps',
      name: 'SIN Maps', 
      url: 'https://www.ons.org.br/paginas/sobre-o-sin/mapas', 
      color: 'blue-500', 
      iframe: false 
    },
    aneel: { 
      id: 'aneel',
      name: 'ANEEL', 
      url: 'https://www.gov.br/aneel/pt-br', 
      color: 'blue-600', 
      iframe: false 
    },
    ons: { 
      id: 'ons',
      name: 'ONS - Carga e Geração em tempo real', 
      url: 'https://www.ons.org.br/paginas/energia-agora/carga-e-geracao', 
      color: 'blue-700', 
      iframe: true 
    }
  },

  // Dados do gráfico
  chartData: {
    labels: ['Hidrelétrica', 'Termelétrica', 'Eólica', 'Solar', 'Nuclear & Outras'],
    data: [62, 20, 11, 5, 2],
    backgroundColor: ['#06b6d4', '#64748b', '#38bdf8', '#facc15', '#a8a29e']
  },

  // Métodos de acesso
  getGenerationData() {
    return this.generationData
  },

  getGenerationById(id) {
    return this.generationData.find(item => item.id === id)
  },

  getComponentsData() {
    return this.componentsData
  },

  getComponentById(id) {
    return this.componentsData.find(item => item.id === id)
  },

  getExternalSites() {
    return this.externalSites
  },

  getChartData() {
    return this.chartData
  }
}

// Exportar para uso no Node.js ou navegador
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppDataModel
}
