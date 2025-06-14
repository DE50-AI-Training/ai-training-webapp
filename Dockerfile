# Utilise l'image officielle Node.js 18 Alpine (légère)
FROM node:18-alpine AS base

# Installe les dépendances nécessaires pour certains packages npm
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage pour installer les dépendances
FROM base AS deps
# Copie les fichiers de configuration des packages
COPY package.json package-lock.json* ./
# Installe toutes les dépendances (dev + prod) pour le build
RUN npm ci

# Stage pour le build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build l'application Next.js
RUN npm run build

# Stage de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Crée un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copie les fichiers publics
COPY --from=builder /app/public ./public

# Copie les fichiers buildés avec les bonnes permissions
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Démarre l'application
CMD ["npm", "start"]
