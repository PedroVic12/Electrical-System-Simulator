# 🔌 ONS SIN Website Para Leigos

Sistema Elétrico de Potência Interativo - Versão Next.js

## 📋 Sobre o Projeto

Aplicação educacional interativa desenvolvida para explicar o funcionamento do Sistema Elétrico de Potência brasileiro, desde a geração até a distribuição de energia.

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca JavaScript para interfaces
- **Tailwind CSS** - Framework CSS utility-first
- **Chart.js** - Biblioteca para gráficos interativos
- **JavaScript (JSX)** - Sem TypeScript, apenas JS puro

## 🎯 Funcionalidades

### 1. Links Importantes

- **4 sites principais**: SIN, SIN Maps, ANEEL, ONS
- Principais funcionamentos de como funciona Redes Elétricas num pais de tamanho continental, como o Brasil. Entenda como Energia chega em sua casa e entenda o papel de um operador no planejamento desta rede garantindo segurança e estabilidade.
- **Dois modos de visualização**:
  - 📺 Ver no Iframe (600x600px quadrado)
  - 🔗 Abrir em Nova Aba
- **Controle inteligente**: Alguns sites permitem iframe, outros apenas nova aba

### 2. Navegação Principal

- ⚡ **Geração** - Tipos de usinas e matriz energética
- 🗼 **Transmissão** - Linhas de alta tensão
- 🏠 **Distribuição** - Entrega ao consumidor final

### 3. Seção de Geração

- Tabs interativas com 5 tipos de usinas
- Gráfico Chart.js com matriz energética brasileira
- Descrições detalhadas de cada fonte

### 4. Componentes do Sistema

- 7 componentes principais explicados
- Interface interativa com seleção de componentes
- Descrições técnicas simplificadas

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Passo a Passo

1. **Instalar dependências**:

```bash
npm install
```

2. **Copiar logo** (se necessário):

```bash
# Copie o arquivo Logo_ONSInspira_1 1.png para public/assets/
```

3. **Executar em desenvolvimento**:

```bash
npm run dev
```

4. **Abrir no navegador**:

```
http://localhost:3000
```

## 📦 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linter
```

## 🎨 Customização

### Cores (CSS Variables)

As cores estão definidas em `app/globals.css`:

```css
:root {
  --color-primary: #0891b2;        /* Cyan-600 */
  --color-primary-dark: #000000;   /* Preto */
  --color-primary-light: #ffffff;  /* Branco */
  --color-text-dark: #4476c8;      /* Azul escuro */
  --color-text-medium: #475569;    /* Slate-600 */
  /* ... */
}
```

### Dados do Modelo

Todos os dados estão centralizados em `AppDataModel` no arquivo `page.jsx`:

```javascript
const AppDataModel = {
  generationData: [...],    // Tipos de geração
  componentsData: [...],    // Componentes do sistema
  externalSites: {...},     // Links externos
  chartData: {...}          // Dados do gráfico
}
```

## 🧩 Componentes React

Todos os componentes estão no arquivo `app/page.jsx`:

1. **PageHeader** - Cabeçalho da página
2. **SiteCard** - Card individual de site externo
3. **ImportantLinksSection** - Seção de links
4. **FlowArrow** - Setas de fluxo
5. **NavigationButton** - Botão de navegação
6. **MainNavigation** - Navegação principal
7. **TabButton** - Botão de aba
8. **GraficoLinhas** - Gráfico Chart.js
9. **GenerationSection** - Seção de geração
10. **TransmissionSection** - Seção de transmissão
11. **DistributionSection** - Seção de distribuição
12. **ComponentButton** - Botão de componente
13. **ComponentsSection** - Seção de componentes
14. **PageFooter** - Rodapé
15. **Home** (default export) - Componente principal

## 🎭 Animações

- **Scroll Gradient**: Fundo muda gradualmente ao rolar
- **Intersection Observer**: Elementos aparecem ao entrar na viewport
- **Transições CSS**: Todas as interações têm transições suaves
- **Hover Effects**: Efeitos visuais ao passar o mouse

## 📱 Responsividade

- **Mobile First**: Design otimizado para mobile
- **Breakpoints Tailwind**:
  - `sm:` 640px
  - `md:` 768px
  - `lg:` 1024px
  - `xl:` 1280px

## 🔧 Configurações Importantes

### Iframe Quadrado

```css
.square-iframe {
  width: 600px;
  height: 600px;
  max-width: 100%;
  aspect-ratio: 1 / 1;
}
```

### Client Component

O arquivo `page.jsx` usa `'use client'` no topo para habilitar hooks e interatividade.

### Chart.js Dinâmico

Chart.js é importado dinamicamente para evitar problemas de SSR:

```javascript
const Chart = dynamic(() => import('chart.js/auto'), { ssr: false })
```

## 👨‍💻 Desenvolvedor

**Pedro Victor Rodrigues Veras**

## 📄 Licença

Projeto educacional desenvolvido para UFF e ONS.

## 📚 Recursos Adicionais

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Chart.js](https://www.chartjs.org/docs)
- [React Hooks](https://react.dev/reference/react)

---

**Data de Criação**: 24 de Outubro de 2025
**Versão**: 3.1.2
