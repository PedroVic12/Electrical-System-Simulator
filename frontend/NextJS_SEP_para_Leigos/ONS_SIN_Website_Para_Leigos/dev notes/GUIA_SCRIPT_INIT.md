# 🚀 Guia do Script init_NEXTJS_project.sh

## 📋 O que o Script Faz

O **init_NEXTJS_project.sh** é um script bash completo que cria automaticamente um projeto Next.js com:

✅ **Estrutura MVC** completa em `public/mvc/`
✅ **Tailwind CSS** totalmente configurado
✅ **Template inicial criativo** com animações
✅ **Responsividade** mobile-first
✅ **Dependências instaladas** automaticamente
✅ **Documentação** completa gerada

---

## 🎯 Como Usar

### Uso Básico

```bash
./init_NEXTJS_project.sh <nome-do-projeto>
```

### Exemplos

```bash
# Criar projeto simples
./init_NEXTJS_project.sh MeuProjeto

# Criar projeto com nome composto
./init_NEXTJS_project.sh SistemaEletricoPotencia

# Criar múltiplos projetos
./init_NEXTJS_project.sh Projeto1
./init_NEXTJS_project.sh Projeto2
./init_NEXTJS_project.sh Projeto3
```

---

## 📁 Estrutura Criada

```
MeuProjeto/
├── app/
│   ├── page.jsx          ✅ Página com template criativo
│   ├── layout.jsx        ✅ Layout com Inter font
│   └── globals.css       ✅ Estilos + Tailwind + Animações
│
├── public/
│   ├── mvc/
│   │   ├── models/
│   │   │   ├── AppDataModel.js      ✅ Modelo de dados
│   │   │   └── notes/
│   │   │       └── exemplo.md       ✅ Nota de exemplo
│   │   ├── views/                   ✅ Pasta para views
│   │   └── controllers/
│   │       └── DatabaseController.js ✅ Controller
│   └── assets/
│       └── images/                  ✅ Pasta para imagens
│
├── package.json          ✅ Dependências configuradas
├── tailwind.config.js    ✅ Tailwind + animações customizadas
├── postcss.config.js     ✅ PostCSS configurado
├── next.config.js        ✅ Next.js configurado
├── .gitignore            ✅ Git configurado
└── README.md             ✅ Documentação automática
```

---
