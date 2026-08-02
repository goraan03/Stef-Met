# ---- Build stage ----
FROM node:20-slim AS builder

# Install OpenSSL and build tools for Prisma + native modules (bcrypt)
RUN apt-get update -y && apt-get install -y openssl python3 make g++

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Production stage ----
FROM node:20-slim AS production

# Install OpenSSL for Prisma at runtime
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built app, all node_modules (already compiled) and prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
COPY package*.json ./

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "dist/main"]
