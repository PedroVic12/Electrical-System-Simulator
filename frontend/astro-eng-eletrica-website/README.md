# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

Instalar CSS e depedencias

```sh
npm install @astrojs/tailwind @astrojs/mdx

```

## Como funciona:

public/: Para arquivos estáticos (imagens, favicons, etc.) que serão servidos diretamente.

src/pages/: Contém seus arquivos .astro que se tornam páginas do seu site. index.astro será sua página inicial.

src/layouts/: Contém layouts que você pode aplicar às suas páginas para ter uma estrutura consistente (cabeçalho, rodapé, etc.).

src/components/: Contém componentes reutilizáveis (.astro, .jsx, .vue, etc.).

src/content/notes/: Esta é uma convenção que você pode usar para organizar seus arquivos Markdown. O Astro tem um sistema de coleções de conteúdo que facilita a consulta desses arquivos.

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
my-astro-project/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── PowerSystemFlow.astro  # Componente para o fluxo Geração -> Transmissão -> Distribuição
│   │   └── GenerationTabs.astro    # Componente para as abas de geração e o gráfico
│   │   └── KeyComponents.astro     # Componente para os botões e descrição dos componentes
│   ├── layouts/
│   │   └── BaseLayout.astro        # Layout base para todas as páginas
│   ├── pages/
│   │   └── index.astro            # Sua página principal
│   └── content/
│       └── notes/                  # Pasta para seus arquivos Markdown
│           ├── geracao.md
│           ├── transmissao.md
│           ├── distribuicao.md
│           └── componentes.md
├── astro.config.mjs
├── package.json
└── tsconfig.json
```
Observações Importantes:

- Conteúdo Estático vs. Interativo: O Astro renderiza o HTML no servidor por padrão. Para a interatividade (como as abas, o gráfico Chart.js e os botões de componentes), você precisa garantir que o JavaScript seja executado no navegador. Isso é feito usando a diretiva client:load (ou client:only se o componente só funcionar no cliente) em componentes Astro que encapsulam essa lógica, ou colocando o script diretamente na página com is:inline como fiz no exemplo acima.

- CSS: O Tailwind CSS é carregado via CDN no BaseLayout.astro, o que já garante o estilo.

- Estrutura de Conteúdo: O Astro permite que você renderize o conteúdo Markdown diretamente usando <Content /> (onde Content é o componente retornado pela coleção de conteúdo). Isso é super prático!

- Dados para Interatividade: Os dados para o gráfico e para as descrições das abas e componentes ainda precisam estar no JavaScript, pois são eles que alimentam a lógica interativa. No exemplo, eles foram mantidos no script is:inline para simplicidade. Se a aplicação crescer, você pode mover esses dados para arquivos .js separados e importá-los.


To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
