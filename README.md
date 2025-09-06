# granjadelsol.com

Statische, mehrsprachige Website, gehostet via **GitHub Pages**.

**Live:** https://granjadelsol.com

## Struktur
- `/de/`, `/en/`, `/es/`, `/pt/` – Sprachversionen
- `/index.html` – Root-Redirect per JS in bevorzugte Sprache
- `/404.html` – Fallback-Redirect für tiefe URLs
- `/assets/` – CSS/JS/Bilder
- `CNAME`, `.nojekyll` – für Pages

## Kontaktformular
- Frontend: **htmx** (`hx-post` + `json-enc`), optional **Alpine.js** für UI-Status
- Endpoint: `https://api.granjadelsol.com/contact`
- CORS (Server): erlaubt `POST, OPTIONS` und relevante **HX-Header**
- Anti-Spam: **Honeypot** + **Honeytime** (`_elapsed_ms`)

## Lokal entwickeln
```bash
# statisch serven
python3 -m http.server 8080
# dann im Browser: http://localhost:8080/de/ (oder en/es/pt)
```

## Deploy
- **Settings → Pages** → Source: `main` / `(root)`
- **Custom Domain:** `granjadelsol.com` (legt die Datei `CNAME` an)
- **Enforce HTTPS** aktivieren

## SEO
- `sitemap.xml` im Repo-Root
- Auf jeder Sprach-Startseite: `<link rel="alternate" hreflang="…">` gegenseitig setzen + `canonical`
- `404.html`: `noindex,follow`
- `robots.txt` verweist auf die Sitemap

## Rechtliches / Lizenzen
- Eigene Inhalte (Bilder, Texte): © André Plöger, **alle Rechte vorbehalten**.
- Drittkomponenten siehe `THIRD_PARTY_LICENSES.md`.
