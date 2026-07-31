#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# deploy.sh — Pull latest code and restart services on the production server
# Usage: ./deploy.sh
# ─────────────────────────────────────────────────────────────────────────────
set -e

echo "🔄 Pulling latest code from main..."
git pull origin main

echo "🏗️  Building and starting containers..."
docker compose -f docker-compose.prod.yml up -d --build

echo "🧹 Removing unused Docker images..."
docker image prune -f

echo "🔍 Running database migrations..."
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

echo ""
echo "✅ Deployment complete! Site is live at https://stefmat.net"
