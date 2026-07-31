# Stef-Mat — Web Aplikacija

Web aplikacija za Stef-Mat, izgrađena na NestJS backendu i React/Vite frontendu.

---

## 📁 Struktura projekta

```
├── backend/          # NestJS API server
├── frontend/         # React + Vite SPA
├── nginx/            # Nginx reverse proxy konfiguracija
├── docker-compose.prod.yml  # Production Docker setup
├── deploy.sh         # Deployment skripta
```

---

## 🔧 Lokalni razvoj

### Preduslovi
- Node.js 20+
- PostgreSQL 16+
- npm

### Backend

```bash
cd backend
cp .env.example .env       # Popuni DATABASE_URL i JWT_SECRET
npm install
npx prisma migrate dev     # Pokreni migracije
npx prisma db seed         # (opcionalno) Seed podaci
npm run start:dev          # Pokreni dev server na :3000
```

### Frontend

```bash
cd frontend
cp .env.example .env.local # Postavi VITE_API_URL=http://localhost:3000
npm install
npm run dev                # Pokreni dev server na :5173
```

---

## 🚀 Produkcijski deployment (server: 77.42.74.124 | stefmat.net)

### Preduslovi na serveru
- Docker & Docker Compose
- Git

### 1. Kloniraj repozitorijum

```bash
git clone https://github.com/goraan03/Stef-Met.git /opt/stefmat
cd /opt/stefmat
```

### 2. Kreiranje environment fajla

```bash
cp backend/.env.example backend/.env
nano backend/.env
```

Popuni:
```env
DATABASE_URL="postgresql://postgres:TVOJA_LOZINKA@postgres:5432/stefmat?schema=public"
JWT_SECRET="dugacak-random-string-min-32-karaktera"
```

Kreiraj i `.env` fajl za docker-compose u root-u projekta:

```bash
nano .env
```

Sadržaj:
```env
POSTGRES_PASSWORD=TVOJA_LOZINKA
JWT_SECRET=dugacak-random-string-min-32-karaktera
VITE_API_URL=https://stefmat.net/api
```

### 3. Pokretanje (bez SSL-a — prve minute)

Privremeno edituj `nginx/conf.d/stefmat.conf` da sluša samo na HTTP dok ne dobiješ certifikat, ili pokreni:

```bash
docker compose -f docker-compose.prod.yml up -d postgres backend frontend nginx-proxy
```

### 4. Dobijanje SSL certifikata (Let's Encrypt)

DNS mora biti usmjeren na 77.42.74.124 prije ovog koraka!

```bash
docker compose -f docker-compose.prod.yml run --rm certbot
```

### 5. Restartuj nginx

```bash
docker compose -f docker-compose.prod.yml restart nginx-proxy
```

### 6. Pokretanje baze (inicijalne migracije)

```bash
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

---

## 🔄 Ažuriranje (deploy nove verzije)

```bash
cd /opt/stefmat
./deploy.sh
```

Skripta automatski:
1. Povlači novi kod (`git pull origin main`)
2. Rebuilda Docker kontejnere
3. Pokreće Prisma migracije

---

## 🌿 Git workflow

| Grana | Svrha |
|-------|-------|
| `main` | Produkcija — deployuje se na stefmat.net |
| `dev` | Razvoj — merge u main kada je feature gotov |

```bash
# Rad na novoj funkcionalnosti
git checkout dev
git checkout -b feature/naziv-featura

# Merge u dev
git checkout dev
git merge feature/naziv-featura

# Merge u main (produkcija)
git checkout main
git merge dev
git push origin main
```

---

## 📦 Tech Stack

| Sloj | Tehnologija |
|------|------------|
| Backend | NestJS + Prisma ORM |
| Baza | PostgreSQL 16 |
| Frontend | React 18 + Vite + TypeScript |
| Stilovi | Tailwind CSS |
| Auth | JWT |
| Proxy | Nginx |
| SSL | Let's Encrypt (Certbot) |
| Kontejneri | Docker + Docker Compose |
