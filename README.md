# ASTRA-X

**Autonomous Security Tactical Reasoning Agent** — a defence-grade cybersecurity command platform for Kavach 2026.

ASTRA-X looks and feels like a military cyber operations deck: glass HUD panels, neon telemetry, a holographic shield, live threat radar, and a full mission loop from source ingest to certified report.

The product is **defensive**. It detects unsafe coding patterns, proposes hardened rewrites, and runs a **lab-only** fuzz / regression simulation. It does not generate exploits or target live systems.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion, GSAP, React Three Fiber, Recharts |
| Backend | PHP 8 REST API, PDO, JWT (HS256) |
| Database | MySQL 8 |

## Quick start (demo UI)

The command deck is fully usable without PHP. Login falls back to a local demo session if the API is offline.

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Demo login (pre-filled):

- Clearance ID: `operator@astra.mil`
- Passphrase: `AstraX#2026`

## Mission loop

1. **Launch Mission** → operator login  
2. **Digital Twin** → pick a contested system  
3. **Scan** → drop source or load a sample  
4. **Patch** → split-screen secure rewrite  
5. **Fuzz** → before / after defence simulation  
6. **Tests** → five tactical suites go green  
7. **Reports** → restricted after-action dossier  

## Backend (XAMPP or PHP CLI)

1. Create the database:

```bash
mysql -u root < database/schema.sql
```

2. Copy secrets:

```bash
cp backend/config/secrets.example.php backend/config/secrets.php
```

3. Seed the demo operator (requires PHP):

```bash
php database/seed.php
```

4. Serve the API (PHP built-in server):

```bash
cd backend
php -S localhost:8000
```

Vite already proxies `/api/*` to `http://localhost:8000`.

### XAMPP

- Copy `backend/` into `htdocs/astra-x/`
- Import `database/schema.sql` via phpMyAdmin
- Set `VITE_API_URL=http://localhost/astra-x` in `frontend/.env`

## API

| Method | Endpoint | Auth |
| --- | --- | --- |
| POST | `/register.php` | public |
| POST | `/login.php` | public |
| POST | `/upload.php` | JWT |
| POST | `/scan.php` | JWT |
| POST | `/patch.php` | JWT |
| POST | `/fuzz.php` | JWT |
| POST | `/regression.php` | JWT |
| GET/POST | `/reports.php` | JWT |

All mutating queries use PDO prepared statements.

## Project layout

```
backend/          PHP REST API
database/         schema.sql + seed.php
frontend/         React command deck
```

## Scripts

```bash
cd frontend
npm run dev      # command deck
npm run build    # production bundle
npm run preview  # serve the build
```

## Design

Ultra-dark void `#050816`, electric cyan `#00E5FF`, violet `#7C4DFF`. Typography: Orbitron, Space Grotesk, Inter. Motion: GSAP magnetic controls, Framer page transitions, canvas particles, SVG radar and attack fabric, React Three Fiber holographic shield.
