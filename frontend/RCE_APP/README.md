# UFF RCE WebApp

## 🚀 Melhorias Implementadas

### ✅ Casos de Teste IEEE
- **IEEE 14-Bus**: Rede padrão IEEE com 14 barras
- **IEEE 30-Bus**: Rede padrão IEEE com 30 barras
- **Rede Simples**: Caso de teste básico
- **Seleção dinâmica**: Troque entre casos em tempo real
- **Otimização específica**: Cada caso tem parâmetros otimizados

### ✅ Prints Detalhados da Otimização
- **Logs em tempo real**: Acompanhe cada geração
- **Métricas detalhadas**: Fitness, perdas, desvio de tensão
- **Progress tracking**: Barra de progresso com logs
- **Resultados finais**: Resumo completo da otimização

### ✅ Drawer Nativo do Reflex
- **Drawer nativo**: Implementado usando `rx.drawer` para comportamento mais robusto
- **Controle de estado**: `DrawerState` dedicado para gerenciar o drawer
- **Animações nativas**: Transições suaves e responsivas
- **Overlay automático**: Backdrop blur e overlay nativo
- **Modal behavior**: Comportamento modal para melhor UX

### ✅ Sidebar Responsiva com Drawer
- **Drawer funcional**: Sidebar que abre/fecha com animações suaves
- **Botão de abrir/fechar**: Implementado botão "☰" no header e "✕" na sidebar
- **Responsividade**: Sidebar se adapta a diferentes tamanhos de tela
- **Overlay mobile**: Em telas pequenas, overlay escuro quando sidebar está aberta
- **Animações suaves**: Transições CSS para melhor experiência do usuário

### ✅ Controle de Paletas de Cores
- **5 paletas disponíveis**: Azul, Verde, Roxo, Laranja, Vermelho
- **Seleção dinâmica**: Mude a paleta de cores em tempo real
- **Aplicação automática**: Cores se aplicam a botões, badges e elementos
- **Interface intuitiva**: Botões com emojis para fácil identificação

### ✅ Dark e Light Mode
- **Toggle de tema**: Switch para alternar entre dark e light mode
- **Aplicação automática**: Tema se aplica a toda a interface
- **Transições suaves**: Mudança de tema com animações
- **Cores adaptativas**: Elementos se adaptam ao tema selecionado

### ✅ Controller de State Separado
- **FrameworkRCEState**: Controller específico para a página Framework RCE
- **DrawerState**: Controller dedicado para o drawer nativo
- **Gerenciamento de estado**: Controle independente de parâmetros e resultados
- **Progress tracking**: Barra de progresso durante execução da otimização
- **Error handling**: Tratamento de erros com feedback visual

### ✅ Interface Melhorada
- **Cards responsivos**: Layout em cards com efeitos hover
- **Inputs tipados**: Campos numéricos com validação
- **Feedback visual**: Spinner durante execução e badges de status
- **Design moderno**: Interface limpa e profissional

### ✅ Funcionalidades da Página Framework RCE
- **Configuração de parâmetros**: Gerações, população, probabilidades
- **Otimização genética**: Algoritmo genético com Pandapower + DEAP
- **Resultados em tempo real**: Exibição dos melhores resultados
- **Progress tracking**: Barra de progresso animada

## 🛠️ Como Usar

### Executar a Aplicação
```bash
cd Electrical-System-Simulator/frontend/RCE_APP
reflex run
```

### Navegação
- **Desktop**: Botão "☰" no header para abrir drawer
- **Mobile/Tablet**: Botão "☰" no header para abrir drawer
- **Overlay**: Clique fora do drawer para fechar
- **Botão "✕"**: Dentro do drawer para fechar

### Controles de Tema
- **Toggle de tema**: Clique no botão 🌙/☀️ no header
- **Paletas de cores**: Selecione na sidebar em "🎨 Personalização"
- **Aplicação automática**: Mudanças se aplicam instantaneamente

### Configuração da Otimização
1. **Selecione o caso de teste**: IEEE 14-Bus, IEEE 30-Bus ou Rede Simples
2. **Ajuste os parâmetros** nos cards de configuração
3. **Clique em "Rodar Otimização"**
4. **Acompanhe os logs** em tempo real
5. **Visualize os resultados** no card de resultados

## 📁 Estrutura do Projeto

```
RCE_APP/
├── RCE_APP/
│   ├── backend/
│   │   └── appState.py          # Estado global + DrawerState
│   ├── core/
│   │   └── UI/
│   │       ├── components/
│   │       │   └── sidebar.py   # Drawer nativo do Reflex
│   │       └── pages/
│   │           └── framework_rce.py  # Página com controller próprio
│   └── RCE_APP.py              # Aplicação principal
├── assets/
│   └── custom.css              # CSS personalizado
├── test_drawer.py              # Script de teste do drawer
└── rxconfig.py                 # Configuração do Reflex
```

## 🎨 Recursos Visuais

### CSS Personalizado
- **Transições suaves**: Animações para drawer e botões
- **Efeitos hover**: Cards e botões com feedback visual
- **Scrollbar customizada**: Design consistente
- **Responsividade**: Adaptação para mobile, tablet e desktop
- **Tema escuro**: Suporte completo para dark mode
- **Drawer nativo**: Animações e comportamentos otimizados

### Componentes
- **Drawer nativo**: Implementado com `rx.drawer` para melhor UX
- **Header sticky**: Sempre visível com botão de menu e controles
- **Cards interativos**: Efeitos hover e animações
- **Progress bar**: Animação durante execução
- **Switch de tema**: Toggle para dark/light mode
- **Paletas de cores**: 5 opções de cores disponíveis

## 🔧 Tecnologias Utilizadas

- **Reflex**: Framework Python para aplicações web
- **Pandapower**: Análise de sistemas elétricos
- **DEAP**: Algoritmos evolutivos
- **Tailwind CSS**: Estilização responsiva
- **React Icons**: Ícones modernos

## 📱 Responsividade

- **Mobile (< 768px)**: Drawer modal com overlay
- **Tablet (768px - 1024px)**: Drawer modal adaptativo
- **Desktop (> 1024px)**: Drawer modal com largura fixa

## 🎨 Paletas de Cores Disponíveis

- **🔵 Azul**: Tema padrão, profissional
- **🟢 Verde**: Tema natural, calmo
- **🟣 Roxo**: Tema criativo, moderno
- **🟠 Laranja**: Tema energético, vibrante
- **🔴 Vermelho**: Tema intenso, focado

## 🌙 Modos de Tema

### Light Mode
- **Background**: Branco/cinza claro
- **Textos**: Preto/cinza escuro
- **Cards**: Branco com sombras suaves

### Dark Mode
- **Background**: Cinza escuro/preto
- **Textos**: Branco/cinza claro
- **Cards**: Cinza escuro com sombras

## 📊 Casos de Teste IEEE

### IEEE 14-Bus
- **14 barras** com diferentes níveis de tensão
- **5 geradores** incluindo slack bus
- **11 cargas** distribuídas
- **20 linhas** de transmissão
- **Otimização**: Fatores de carga das barras de carga

### IEEE 30-Bus
- **30 barras** com diferentes níveis de tensão
- **6 geradores** incluindo slack bus
- **21 cargas** distribuídas
- **41 linhas** de transmissão
- **Otimização**: Fatores de carga das barras de carga

### Rede Simples
- **2 barras** para teste básico
- **1 gerador** (slack bus)
- **1 carga** para otimização
- **1 linha** de transmissão
- **Otimização**: Valor da carga

## 📝 Logs da Otimização

### Informações Exibidas
- **🎯 Caso selecionado** e parâmetros
- **📊 Configurações** do algoritmo genético
- **🔄 Progresso** por geração
- **📈 Melhor fitness** de cada geração
- **✅ Resultados finais** com métricas
- **❌ Erros** se ocorrerem

### Métricas Calculadas
- **Perdas totais** em MW
- **Desvio de tensão** em pu
- **Fitness** do melhor indivíduo
- **Tempo de execução**

## 🚀 Próximos Passos

- [ ] Implementar outras páginas (Simulação IEEE, Agendamento)
- [ ] Adicionar gráficos interativos
- [ ] Implementar persistência de dados
- [ ] Adicionar mais algoritmos de otimização
- [ ] Implementar exportação de resultados
- [ ] Adicionar mais opções de personalização
- [ ] Implementar temas sazonais
- [ ] Adicionar animações mais complexas
- [ ] Implementar drawer para desktop também
- [ ] Adicionar gestos de swipe para mobile
- [ ] Implementar mais casos IEEE (57, 118, 300-bus)
- [ ] Adicionar visualização de rede
- [ ] Implementar análise de contingência 