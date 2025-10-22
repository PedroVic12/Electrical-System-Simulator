/*
  # Sistema Elétrico de Potência - Database Schema

  ## Descrição
  Este schema cria as tabelas necessárias para gerenciar um sistema interativo
  de educação sobre sistemas elétricos de potência, incluindo geração, transmissão,
  distribuição e componentes do sistema.

  ## 1. Novas Tabelas
  
  ### `generation_sources`
  Armazena os diferentes tipos de fontes de geração de energia
  - `id` (uuid, primary key) - Identificador único
  - `name` (text) - Nome da fonte (ex: Hidrelétricas, Eólicas)
  - `description` (text) - Descrição detalhada da fonte
  - `percentage` (numeric) - Porcentagem na matriz energética
  - `color` (text) - Cor para visualização em gráficos
  - `order_position` (integer) - Ordem de exibição
  - `created_at` (timestamptz) - Data de criação
  - `updated_at` (timestamptz) - Data de atualização

  ### `system_components`
  Armazena os componentes-chave do sistema de potência
  - `id` (uuid, primary key) - Identificador único
  - `name` (text) - Nome do componente (ex: Geradores, Transformadores)
  - `description` (text) - Descrição da função do componente
  - `category` (text) - Categoria (generation, transmission, distribution)
  - `icon` (text) - Nome do ícone para UI
  - `order_position` (integer) - Ordem de exibição
  - `created_at` (timestamptz) - Data de criação
  - `updated_at` (timestamptz) - Data de atualização

  ### `educational_content`
  Armazena conteúdo educacional sobre transmissão e distribuição
  - `id` (uuid, primary key) - Identificador único
  - `section` (text) - Seção (transmission, distribution)
  - `title` (text) - Título do conteúdo
  - `content` (text) - Conteúdo detalhado
  - `order_position` (integer) - Ordem de exibição
  - `created_at` (timestamptz) - Data de criação
  - `updated_at` (timestamptz) - Data de atualização

  ## 2. Segurança
  - Habilita RLS em todas as tabelas
  - Políticas de leitura pública para acesso educacional
  - Políticas de escrita restritas para usuários autenticados

  ## 3. Dados Iniciais
  - Popula as tabelas com dados padrão do sistema educacional
*/

-- Criação da tabela generation_sources
CREATE TABLE IF NOT EXISTS generation_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  percentage numeric(5,2) DEFAULT 0,
  color text DEFAULT '#06b6d4',
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criação da tabela system_components
CREATE TABLE IF NOT EXISTS system_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text DEFAULT 'general',
  icon text DEFAULT 'box',
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criação da tabela educational_content
CREATE TABLE IF NOT EXISTS educational_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  order_position integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE generation_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança: Leitura Pública (conteúdo educacional)
CREATE POLICY "Permitir leitura pública de fontes de geração"
  ON generation_sources FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir leitura pública de componentes"
  ON system_components FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Permitir leitura pública de conteúdo educacional"
  ON educational_content FOR SELECT
  TO public
  USING (true);

-- Políticas de Escrita: Apenas Usuários Autenticados
CREATE POLICY "Usuários autenticados podem inserir fontes"
  ON generation_sources FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar fontes"
  ON generation_sources FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar fontes"
  ON generation_sources FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir componentes"
  ON system_components FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar componentes"
  ON system_components FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar componentes"
  ON system_components FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir conteúdo"
  ON educational_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar conteúdo"
  ON educational_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar conteúdo"
  ON educational_content FOR DELETE
  TO authenticated
  USING (true);

-- Inserir dados iniciais: Fontes de Geração
INSERT INTO generation_sources (name, description, percentage, color, order_position) VALUES
('Hidrelétricas', 'Utilizam a força da água para girar turbinas e geradores. São uma fonte limpa e renovável, mas dependem de recursos hídricos.', 62.00, '#06b6d4', 1),
('Termelétricas', 'Queimam combustíveis fósseis ou biomassa para aquecer água, produzir vapor e girar turbinas. São flexíveis, mas emitem gases de efeito estufa.', 20.00, '#64748b', 2),
('Eólicas', 'Convertem a energia do vento em eletricidade através de aerogeradores. São renováveis e limpas, mas intermitentes.', 11.00, '#38bdf8', 3),
('Solares', 'Convertem a luz do sol em eletricidade, seja por painéis fotovoltaicos (diretamente) ou por usinas termossolares. Também são renováveis e limpas, mas intermitentes.', 5.00, '#facc15', 4),
('Nuclear & Outras', 'Utilizam a fissão nuclear para gerar calor, que produz vapor para as turbinas. São eficientes e não emitem gases de efeito estufa, mas geram resíduos radioativos.', 2.00, '#a8a29e', 5)
ON CONFLICT DO NOTHING;

-- Inserir dados iniciais: Componentes do Sistema
INSERT INTO system_components (name, description, category, icon, order_position) VALUES
('Geradores', 'Convertem outras formas de energia (mecânica, térmica, etc.) em energia elétrica. São o coração das usinas.', 'generation', 'zap', 1),
('Transformadores', 'Alteram os níveis de tensão da eletricidade. Elevam a tensão para a transmissão e a reduzem para a distribuição e consumo.', 'transmission', 'repeat', 2),
('Linhas', 'Conduzem a energia através de cabos aéreos ou subterrâneos, formando as redes de transmissão e distribuição.', 'transmission', 'cable', 3),
('Disjuntores', 'Controlam o fluxo de energia e protegem o sistema contra falhas. Atuam como interruptores de grande porte.', 'distribution', 'power', 4),
('Relés', 'Detectam condições anormais (curtos-circuitos) e acionam os disjuntores para isolar a falha e proteger o resto do sistema.', 'distribution', 'shield', 5),
('Barramentos', 'São barras condutoras que conectam vários circuitos em uma subestação, funcionando como um nó de distribuição de energia.', 'transmission', 'git-branch', 6),
('Reativos', 'Capacitores e Reatores são usados para controlar a tensão e compensar a potência reativa na rede, melhorando a eficiência e a estabilidade.', 'transmission', 'activity', 7)
ON CONFLICT DO NOTHING;

-- Inserir dados iniciais: Conteúdo Educacional
INSERT INTO educational_content (section, title, content, order_position) VALUES
('transmission', 'Altas Tensões', 'Para reduzir perdas, a energia é transmitida em tensões muito elevadas, permitindo transportar mais energia com menos desperdício.', 1),
('transmission', 'Linhas de Transmissão', 'São as grandes torres e cabos que levam a eletricidade por todo o país.', 2),
('transmission', 'Subestações de Transmissão', 'Usam transformadores para elevar a tensão na saída das usinas e rebaixá-la perto das cidades.', 3),
('distribution', 'Redução de Tensão', 'Transformadores em subestações de distribuição reduzem a tensão para níveis utilizáveis e seguros.', 1),
('distribution', 'Redes de Distribuição', 'São os cabos e postes nas cidades que levam a energia até os transformadores de rua e, daí, para os consumidores.', 2),
('distribution', 'Consumo Final', 'A energia chega em residências, comércios e indústrias, pronta para ser utilizada.', 3)
ON CONFLICT DO NOTHING;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_generation_sources_order ON generation_sources(order_position);
CREATE INDEX IF NOT EXISTS idx_system_components_order ON system_components(order_position);
CREATE INDEX IF NOT EXISTS idx_system_components_category ON system_components(category);
CREATE INDEX IF NOT EXISTS idx_educational_content_section ON educational_content(section, order_position);