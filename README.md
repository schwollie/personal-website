# Lars Personal Website

Personal portfolio website showcasing my background as a Computer Science student at TUM and developer at Vector Informatik.

**Live Site:** [christiansen-lars.de](https://christiansen-lars.de)

## Overview

This website presents my educational background, work experience, technical skills, and musical engagements. Built with vanilla HTML, CSS, and JavaScript for optimal performance and simplicity.

## Key Features

- Responsive design optimized for all devices
- Animated statistics and interactive sections
- Skills showcase with source attribution
- Musical activities and community involvement
- Modern, accessible interface

## Local Development

1. Clone this repository
2.  For local development, navigate to the 
3.  Start a local server using Python:
    ```bash
    python3 -m http.server 8000
    ```
4.  Open the site in your Chrome browser:
    ```bash
    google-chrome http://localhost:8000
    ```

## Content Updates

Personal information is stored in `data/cv-data.json` for easy maintenance. Section content is embedded directly in `index.html`.

## Deployment

Hosted on this server via Docker + the shared Caddy reverse proxy at `https://christiansen-lars.de`.

```bash
chmod +x deploy/redeploy.sh
./deploy/redeploy.sh
```

`deploy/restart.sh` runs the same script.

**Content edits** (`index.html`, `css/`, `js/`, `data/`) are served live from the repo — no redeploy needed. Hard-refresh the browser if you still see old assets.

**Redeploy** when `docker/docker-compose.yml` changes, or to recreate the nginx container.

Requires the `proxy` Docker network from `~/reverse-proxy` first:

```bash
cd ~/reverse-proxy && ./deploy/restart.sh
```

---

*Last updated: June 2026*