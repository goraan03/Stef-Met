# Stef-Mat Tehnička Dokumentacija

Ovaj dokument sadrži pregled tehnologija, strukture baze podataka i glavnih komponenti sistema.

---

## 🛠 Tehnologije

Sistem se sastoji od odvojenog Backend (API) i Frontend (SPA) dijela, upakovanog pomoću Docker-a.

### Backend (API)
- **Framework:** NestJS (v10) - moderan, skalabilan Node.js framework baziran na TypeScript-u.
- **Baza podataka:** PostgreSQL (relaciona baza) kojom upravlja **Prisma ORM** (Object-Relational Mapper).
- **Autentifikacija:** JWT (JSON Web Tokens) u kombinaciji sa Passport.js i `bcrypt` (sada `bcryptjs`) za bezbjedno hesiranje lozinki.
- **Slanje emailova:** Nodemailer (koristi se za prosljeđivanje upita sa kontakt forme na admin email).
- **Upload fajlova:** Multer (obrađuje multipart/form-data za slike i dokumente).
- **Jezik:** TypeScript

### Frontend (Klijent)
- **Biblioteka:** React 18 sa Vite bundler-om za brzi development i build.
- **Jezik:** TypeScript
- **Stilizovanje:** Tailwind CSS (utility-first CSS)
- **Ruting:** React Router DOM (v6)
- **Upravljanje stanjem (State Management):** Zustand (za globalno stanje, npr. autentifikacija) i React Query (TanStack Query v5) za data-fetching, keširanje i sinhronizaciju sa backendom.
- **Forme i Validacija:** React Hook Form u kombinaciji sa Zod bibliotekom za strogu validaciju unosa.
- **Animacije i Ikone:** Framer Motion (glatke tranzicije) i Lucide React (minimalističke SVG ikone).

### Infrastruktura / Deployment
- **Docker & Docker Compose:** Aplikacija je potpuno kontejnerizovana (`postgres`, `backend`, `frontend`).
- Multi-stage build u Dockerfile-ovima osigurava male i optimizovane image za produkciju.

---

## 🗄 Struktura Baze Podataka (Prisma Schema)

Baza se sastoji od sljedećih modela (tabela):

1. **User (Administratori)**
   - `id`, `email`, `passwordHash`, `name`, `createdAt`, `updatedAt`
   - *Svrha:* Za prijavljivanje na Admin panel i upravljanje sadržajem.

2. **Category (Kategorije proizvoda)**
   - `id`, `name`, `slug` (unikatno za URL), `order` (za sortiranje), `createdAt`, `updatedAt`
   - *Relacije:* Jedna kategorija može imati više proizvoda (1:N).

3. **Product (Proizvodi/Oprema)**
   - `id`, `name`, `slug`, `description`, `categoryId`, `images` (niz stringova), `videoUrl` (YouTube embed URL), `visible` (boolean), `order`
   - *Svrha:* Glavni proizvodi. Sadrži relaciju ka Category. Podržava više slika i opcioni video.

4. **Announcement (Objave - Aktuelno / Hitno)**
   - `id`, `type` (Enum: CURRENT ili URGENT), `title`, `slug`, `content`, `excerpt`, `imageUrl`, `videoUrl`, `visible`, `publishedAt`, `expiresAt`
   - *Svrha:* Vijesti ili hitne rasprodaje opreme. Može imati datum isteka i video.

5. **Message (Poruke sa kontakt forme)**
   - `id`, `name`, `email`, `phone`, `message`, `isRead` (boolean)
   - *Svrha:* Čuvanje svih upita iz kontakt forme u bazi, a koji se istovremeno šalju na email pomoću Nodemailer-a.

6. **Setting (Sistemska podešavanja)**
   - `id`, `key`, `value`, `type`, `description`
   - *Svrha:* Za čuvanje dinamičkih postavki sajta u budućnosti (npr. radno vrijeme, kontakt telefoni u footeru, itd.).

---

## 🔌 Glavni Endpoints (API Rute)

Backend je podijeljen u module. Svaki modul izlaže REST API endpointe. Rute koje kreiraju, mijenjaju ili brišu podatke su zaštićene JWT tokenom (`@UseGuards(JwtAuthGuard)`).

### 1. Auth Modul (`/api/auth`)
- `POST /auth/login` - Prijava administratora. Vraća JWT token.
- `GET /auth/me` - Vraća podatke o trenutno prijavljenom korisniku.

### 2. Categories Modul (`/api/categories`)
- `GET /categories` - Lista svih kategorija (javno dostupan, sa opcionim sortiranjem).
- `GET /categories/:slug` - Detalji jedne kategorije.
- `POST /categories` - (Admin) Kreiranje nove kategorije.
- `PATCH /categories/:id` - (Admin) Ažuriranje kategorije.
- `DELETE /categories/:id` - (Admin) Brisanje kategorije.

### 3. Products Modul (`/api/products`)
- `GET /products` - Lista proizvoda. Podržava filtriranje po `categoryId` i `visible` statusu. (Javno dostupno)
- `GET /products/:slug` - Prikaz detalja jednog proizvoda (javno dostupno).
- `POST /products` - (Admin) Kreiranje proizvoda.
- `PATCH /products/:id` - (Admin) Izmjena proizvoda (naziv, slike, video, kategorija).
- `DELETE /products/:id` - (Admin) Brisanje proizvoda.

### 4. Announcements Modul (`/api/announcements`)
- `GET /announcements` - Lista objava. Podržava filtriranje po `type` (CURRENT/URGENT) i `visible` statusu.
- `GET /announcements/:slug` - Detalji objave.
- `POST /announcements` - (Admin) Kreiranje objave.
- `PATCH /announcements/:id` - (Admin) Ažuriranje.
- `DELETE /announcements/:id` - (Admin) Brisanje.

### 5. Messages Modul (`/api/messages`)
- `POST /messages` - Klijent šalje poruku (javno dostupno). Upisuje se u bazu i šalje se email na `infostefmat@gmail.com`.
- `GET /messages` - (Admin) Lista svih poruka.
- `PATCH /messages/:id/read` - (Admin) Označavanje poruke kao pročitane.
- `DELETE /messages/:id` - (Admin) Brisanje poruke.

### 6. Uploads Modul (`/api/uploads`)
- `POST /uploads` - (Admin) Endpoint za slanje slika (`multipart/form-data`). Koristi Multer, čuva slike u folder `/uploads` i vraća URL putanju do slike koju Frontend poslije upisuje u Products/Announcements tabelu.

---

## ⚙️ Rad i Održavanje na Produkciji

**Environment Varijable:**
Na produkciji, Docker Compose čita varijable iz `/opt/stefmat/.env`. Tu su definisane konekcije za bazu, tajni ključevi (JWT) i SMTP podešavanja za email.

**Baza podataka (Prisma):**
Kada god se u `schema.prisma` napravi izmjena (npr. dodavanje `videoUrl` kolone), migracija baze na produkciji se mora primijeniti prije dizanja novog koda, pomoću komande:
`docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy`
