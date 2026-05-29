# ⚡ Guia de Uso: Blog de Engenharia Elétrica & ONS

Bem-vindo à sua base de conhecimento interativa! Este projeto foi estruturado para ser o seu "segundo cérebro" enquanto você navega pelos estudos na faculdade e na sua jornada no **ONS (Operador Nacional do Sistema Elétrico)**.

Este arquivo explica como você pode alimentar este blog de forma profissional e organizada.

---

## 🏗️ Como a Estrutura Funciona

O site está dividido em três grandes pilares (Geração, Transmissão e Distribuição) e uma seção técnica de Modelagem.

### 1. Onde colocar o conhecimento técnico?
Todo o conteúdo textual longo deve ser escrito em arquivos `.md` (Markdown) dentro da pasta:
`public/mvc/models/notes/`

*   **Exemplo:** Se aprendeu algo novo sobre Barra Swing ou Fluxo de Potência, crie um arquivo `fluxo_potencia.md` lá.
*   **Vantagem:** O site carrega esses arquivos automaticamente usando o componente `<MarkdownPage />`.

### 2. Como atualizar os dados (MW, nomes, links)?
Toda a inteligência e os dados do site estão centralizados em:
`app/models/AppDataModel.js`

Edite este arquivo para:
*   Alterar a capacidade instalada das usinas.
*   Adicionar novos links do PIVISION ou mapas do SIN.
*   Atualizar descrições rápidas de equipamentos.

---

## 🎯 Foco nos Estudos de Engenharia (SEP)

Para transformar este blog em uma referência acadêmica e profissional para seus colegas:

### 📊 Equações Matemáticas (LaTeX)
Use a seção de **Modelagem Matemática** para documentar as fórmulas. Como instalamos o `KaTeX`, você pode adicionar equações complexas no arquivo `app/UI/sections/EquationsSection.jsx` usando:

```javascript
<BlockMath math="P_i = |V_i| \sum |V_j| (G_{ij} \cos \theta_{ij} + B_{ij} \sin \theta_{ij})" />
```

### ⚙️ Equipamentos e Operação
Ao descrever a operação, foque no comportamento físico:
*   **Barra Swing (V slack):** Explique como ela absorve as perdas do sistema.
*   **Reatores Shunt:** Documente o controle de sobretensão em vazio ou carga leve (efeito Ferranti).
*   **Capacitores:** Explique o suporte de reativos para elevar o perfil de tensão.

---

## 🗼 Foco na Operação ONS

Documente a forma como o ONS atua como o **Maestro do Sistema**:

*   **Despacho:** Como o ONS escolhe qual usina entra primeiro (mérito econômico vs. segurança).
*   **Intercâmbios:** Documente como a energia flui entre as regiões (Norte -> Sudeste, etc).
*   **Procedimentos de Rede (PR):** Use a seção de "Links Importantes" para deixar os PRs sempre à mão.

---

## 🚀 Dicas para Postar como um Blog Professional

1.  **Imagens Valem Mais que Mil Palavras:** Sempre que ver um gráfico legal no PIVISION ou um diagrama unifilar, salve na pasta `public/assets/` e use o componente `<ImgContainer />` para exibir no site.
2.  **Modo Dark para Sprints:** Lembre-se que o modo Dark (Azul Marinho) foi feito para não cansar a vista enquanto você estuda de madrugada.
3.  **Compartilhe com Colegas:** O design é responsivo. Você pode mostrar seus estudos direto no celular para seus colegas durante as aulas ou no estágio.

---

## 🛠️ Comandos Úteis

*   `npm run dev`: Inicia o site no seu computador (localhost:3000).
*   `npm run build`: Prepara o site para ser publicado na internet.

**Dica de Ouro:** Sempre que aprender um conceito novo em sinais e sistemas ou eletromagnetismo, tente explicar para um "leigo" aqui no blog. Isso vai fixar o conteúdo na sua cabeça para sempre!

---
*Assinado: Gemini CLI - Seu parceiro de desenvolvimento.*
