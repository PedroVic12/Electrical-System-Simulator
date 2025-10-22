// MODEL - Dados do Sistema Elétrico (SOLID - Single Responsibility)

export interface GenerationType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ComponentType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
  borderColor: string;
  borderWidth: number;
}

// Dados de Geração
export const generationTypes: GenerationType[] = [
  {
    id: 'hidro',
    name: 'Hidrelétricas',
    description: 'Utilizam a força da água para girar turbinas e geradores. São uma fonte limpa e renovável, mas dependem de recursos hídricos.',
    icon: '💧'
  },
  {
    id: 'termo',
    name: 'Termelétricas',
    description: 'Queimam combustíveis fósseis ou biomassa para aquecer água, produzir vapor e girar turbinas. São flexíveis, mas emitem gases de efeito estufa.',
    icon: '🔥'
  },
  {
    id: 'nuclear',
    name: 'Nucleares',
    description: 'Utilizam a fissão nuclear para gerar calor, que produz vapor para as turbinas. São eficientes e não emitem gases de efeito estufa, mas geram resíduos radioativos.',
    icon: '⚛️'
  },
  {
    id: 'eolica',
    name: 'Eólicas',
    description: 'Convertem a energia do vento em eletricidade através de aerogeradores. São renováveis e limpas, mas intermitentes.',
    icon: '💨'
  },
  {
    id: 'solar',
    name: 'Solares',
    description: 'Convertem a luz do sol em eletricidade, seja por painéis fotovoltaicos (diretamente) ou por usinas termossolares. Também são renováveis e limpas, mas intermitentes.',
    icon: '☀️'
  }
];

// Dados de Componentes
export const componentTypes: ComponentType[] = [
  {
    id: 'geradores',
    name: 'Geradores',
    description: 'Convertem outras formas de energia (mecânica, térmica, etc.) em energia elétrica. São o coração das usinas.',
    icon: '⚡'
  },
  {
    id: 'transformadores',
    name: 'Transformadores',
    description: 'Alteram os níveis de tensão da eletricidade. Elevam a tensão para a transmissão e a reduzem para a distribuição e consumo.',
    icon: '🔌'
  },
  {
    id: 'linhas',
    name: 'Linhas',
    description: 'Conduzem a energia através de cabos aéreos ou subterrâneos, formando as redes de transmissão e distribuição.',
    icon: '📡'
  },
  {
    id: 'disjuntores',
    name: 'Disjuntores',
    description: 'Controlam o fluxo de energia e protegem o sistema contra falhas. Atuam como interruptores de grande porte.',
    icon: '🔄'
  },
  {
    id: 'reles',
    name: 'Relés',
    description: 'Detectam condições anormais (curtos-circuitos) e acionam os disjuntores para isolar a falha e proteger o resto do sistema.',
    icon: '🎯'
  },
  {
    id: 'barramentos',
    name: 'Barramentos',
    description: 'São barras condutoras que conectam vários circuitos em uma subestação, funcionando como um nó de distribuição de energia.',
    icon: '⚙️'
  },
  {
    id: 'reativos',
    name: 'Reativos',
    description: 'Capacitores e Reatores são usados para controlar a tensão e compensar a potência reativa na rede, melhorando a eficiência e a estabilidade.',
    icon: '🔋'
  }
];

// Dados do Gráfico de Matriz Energética
export const matrixChartData = {
  labels: ['Hidrelétrica', 'Termelétrica', 'Eólica', 'Solar', 'Nuclear & Outras'],
  datasets: [
    {
      label: 'Matriz Energética (%)',
      data: [62, 20, 11, 5, 2],
      backgroundColor: [
        'hsl(188, 78%, 41%)',  // Cyan
        'hsl(215, 20%, 40%)',  // Slate
        'hsl(199, 89%, 48%)',  // Sky
        'hsl(48, 96%, 53%)',   // Yellow
        'hsl(24, 6%, 44%)'     // Stone
      ],
      borderColor: 'hsl(var(--card))',
      borderWidth: 3
    }
  ]
};

// Dados de Transmissão
export const transmissionData = [
  {
    title: 'Altas Tensões',
    description: 'Para reduzir perdas, a energia é transmitida em tensões muito elevadas, permitindo transportar mais energia com menos desperdício.',
    icon: '⚡'
  },
  {
    title: 'Linhas de Transmissão',
    description: 'São as grandes torres e cabos que levam a eletricidade por todo o país.',
    icon: '🗼'
  },
  {
    title: 'Subestações de Transmissão',
    description: 'Usam transformadores para elevar a tensão na saída das usinas e rebaixá-la perto das cidades.',
    icon: '🏭'
  }
];

// Dados de Distribuição
export const distributionData = [
  {
    title: 'Redução de Tensão',
    description: 'Transformadores em subestações de distribuição reduzem a tensão para níveis utilizáveis e seguros.',
    icon: '🔌'
  },
  {
    title: 'Redes de Distribuição',
    description: 'São os cabos e postes nas cidades que levam a energia até os transformadores de rua e, daí, para os consumidores.',
    icon: '🏘️'
  },
  {
    title: 'Consumo Final',
    description: 'A energia chega em residências, comércios e indústrias, pronta para ser utilizada.',
    icon: '🏠'
  }
];
