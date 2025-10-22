#!/bin/bash

echo "🚀 Iniciando ONS SIN Website Para Leigos..."
echo ""
echo "📦 Verificando dependências..."

if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules não encontrado. Instalando dependências..."
    npm install
fi

echo ""
echo "✅ Dependências OK!"
echo ""
echo "🔥 Iniciando servidor de desenvolvimento..."
echo "📍 Acesse: http://localhost:3000"
echo ""
echo "⚠️  IMPORTANTE: Copie o logo para public/assets/ se ainda não fez!"
echo ""

npm run dev
