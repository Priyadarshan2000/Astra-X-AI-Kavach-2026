# Contributing to ASTRA-X

Thank you for your interest in contributing to ASTRA-X for Kavach 2026.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USER/Astra-X-AI-Kavach-2026.git`
3. Install frontend: `cd frontend && npm install`
4. Copy secrets: `cp backend/config/secrets.example.php backend/config/secrets.php`
5. Run dev server: `npm run dev`

## Development Guidelines

- **Defensive only** — no exploit payloads, offensive tooling, or live targeting code
- Match existing UI patterns: GlassPanel, NeonButton, hud-label typography
- Use React 19 + Vite + Tailwind CSS 4 conventions
- Keep PHP API endpoints JWT-authenticated where required
- Test against live Hostinger API or local `php -S localhost:8000`

## Pull Request Process

1. Create a feature branch from `main`
2. Run `npm run lint` and `npm run build` in `frontend/`
3. Update README if adding routes, API endpoints, or deploy steps
4. Open a PR with a clear description and test plan

## Reporting Issues

Include: steps to reproduce, expected vs actual behavior, browser/OS, and API health status.
