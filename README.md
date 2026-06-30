# Lars Personal Website

Personal portfolio website showcasing my background as a Computer Science student at TUM and developer at Vector Informatik.

**Live Site:** [christiansen-lars.de](https://christiansen-lars.de)

## Overview

This website presents my educational background, work experience, technical skills, and musical engagements. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4, exported as static HTML for fast nginx hosting.

## Tech Stack

- Next.js 16 (static export)
- React 19 + TypeScript
- Tailwind CSS v4
- Inter font + Font Awesome icons
- Content in `src/data/*.json`

## Local Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Content Updates

Edit JSON files in `src/data/`:

- `education.json` — degrees, timeline, thesis link
- `experience.json` — work history
- `skills.json` — skill categories and sources
- `engagement.json` — music and community activities

Static assets (images, PDFs) live in `public/`.

After editing content, rebuild for production:

```bash
npm run build
```

## Deployment

Hosted on this server via Docker + the shared Caddy reverse proxy at `https://christiansen-lars.de`.

```bash
chmod +x deploy/redeploy.sh
./deploy/redeploy.sh
```

`deploy/restart.sh` runs the same script.

The deploy script runs `npm ci`, `npm run build`, and recreates the nginx container serving `out/`.

Requires the `proxy` Docker network from `~/reverse-proxy` first:

```bash
cd ~/reverse-proxy && ./deploy/restart.sh
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build static export to `out/` |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript check |
| `npm run ci` | lint + typecheck + build |

---

*Last updated: June 2026*
