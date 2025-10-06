# granjadelsol.com

Static, multilingual website hosted via **GitHub Pages**.

**Live:** [https://granjadelsol.com](https://granjadelsol.com)

## Structure

* `/de/`, `/en/`, `/es/`, `/pt/` – language versions
* `/index.html` – root redirect via JS to the preferred language
* `/404.html` – fallback redirect for deep URLs
* `/assets/` – CSS/JS/images
* `CNAME`, `.nojekyll` – for Pages

## Contact form

* Frontend: **htmx** (`hx-post` + `json-enc`), optional **Alpine.js** for UI state
* Endpoint: `https://api.granjadelsol.com/contact`
* CORS (server): allow `POST, OPTIONS` and relevant **HX** headers
* Anti-spam: **Honeypot** + **Honeytime** (`_elapsed_ms`)

## Legal / Licenses

* Own content (images, text): © André Plöger, **all rights reserved**.
* Third-party components: see `THIRD_PARTY_LICENSES.md`.
