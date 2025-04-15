FROM node:18-alpine AS base

# Instalar dependências apenas necessárias para produção
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Instalar dependências baseadas no package.json
COPY package.json package-lock.json* ./
RUN npm ci

# Reconstruir o código fonte apenas quando necessário
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Próximo.js coleta telemetria anônima sobre o uso geral.
# Saiba mais aqui: https://nextjs.org/telemetry
# Desative a telemetria durante o build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Produção, copie todos os arquivos e execute o próximo
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Definir a permissão correta para o diretório .next
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiar automaticamente o output gerado para substituir o .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 