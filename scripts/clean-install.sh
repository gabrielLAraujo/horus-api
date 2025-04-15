#!/bin/bash

echo "Limpando cache e reinstalando dependências..."

# Remover diretórios de cache
rm -rf .next
rm -rf node_modules
rm -rf .turbo

# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

echo "Processo concluído!" 