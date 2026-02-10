# Astro Kunden-Template — Claude Code Anweisungen

> **Repo:** astro-template-example
> **Zweck:** Wiederverwendbares Template fuer poliSYS Kundenprojekte
> **Stack:** Astro 5.x + Tailwind CSS 3.x + TypeScript

---

## Zentrale Konfiguration

**Alle kundenspezifischen Werte stehen in einer einzigen Datei:**

`src/config/site.config.ts`

Dort werden Name, Domain, Farben, Navigation, Social Links, SEO-Defaults und Feature-Flags gesetzt. Alle Komponenten (Navigation, Footer, Layout) lesen daraus.

---

## Befehle

```bash
npm run dev              # Entwicklungsserver
npm run build            # Produktions-Build
npm run preview          # Build-Vorschau
npm run optimize-images  # WebP-Varianten generieren (Sharp)
```

---

## Regeln

### Vor jeder Aenderung
1. `npm run build` muss erfolgreich durchlaufen
2. Keine TypeScript Errors
3. Alle Links mit `${baseUrl}` prefix

### Code-Konventionen
1. **Kundenspezifische Werte** nur in `site.config.ts` — NICHT in Komponenten hardcoden
2. **baseUrl-Pattern** in jeder Datei: `const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');`
3. **Self-hosted Fonts** — Kein Google Fonts (DSGVO)
4. **Kein Tracking** — Kein Google Analytics, keine Cookies
5. **Mobile-first** — Tailwind responsive Klassen (md:, lg:)
6. **Bilder** — Immer width, height, alt, loading="lazy" (Hero: loading="eager" + fetchpriority="high")

### Verboten
- Hardcoded Kundennamen in Komponenten
- Google Fonts oder externe CSS/JS
- Cookies oder Tracking-Scripts
- Secrets in Code commiten

---

## Dateistruktur

| Pfad | Beschreibung |
|------|-------------|
| `src/config/site.config.ts` | **Zentrale Konfiguration** — hier alles anpassen |
| `src/components/Navigation.astro` | Sticky Header, Pill-Nav, Mobile-Menu (aus Config) |
| `src/components/Footer.astro` | 3-Spalten Footer mit Social Icons (aus Config) |
| `src/components/OptimizedImage.astro` | WebP srcset (480w/960w/1440w) |
| `src/components/YouTubeFacade.astro` | Lazy YouTube Embed (optional) |
| `src/layouts/Layout.astro` | SEO-Meta, Fonts, HTML-Geruest (aus Config) |
| `src/content/config.ts` | Blog-Schema (Astro 5 Content Layer API) |
| `src/styles/global.css` | Tailwind + Shared Utilities |
| `scripts/optimize-images.mjs` | Sharp WebP-Konvertierung |
| `.github/workflows/deploy.yml` | FTP/SFTP Deploy via GitHub Actions |
| `tailwind.config.mjs` | Akzentfarben anpassen (parallel zu site.config) |
| `astro.config.mjs` | Site-URL anpassen |

---

## Neuen Kunden einrichten

1. Repo klonen: `git clone ... neuer-kunde && cd neuer-kunde && rm -rf .git && git init`
2. `site.config.ts` ausfuellen (Name, Domain, Farben, Navigation, Social)
3. `tailwind.config.mjs` Akzentfarben anpassen (muss mit site.config uebereinstimmen)
4. `astro.config.mjs` Site-URL setzen
5. Texte in den Seiten anpassen
6. Bilder in `public/images/` ablegen, `npm run optimize-images`
7. Impressum + Datenschutz personalisieren
8. `robots.txt` Sitemap-URL anpassen
9. `.htaccess` www-Redirect Domain anpassen
10. GitHub Secrets setzen: FTP_HOST, FTP_USER, FTP_PASSWORD
11. `npm run build` testen, pushen

---

## CSS-Komponenten

| Klasse | Verwendung |
|--------|-----------|
| `.btn-primary` | Akzentfarbe Pill-Button |
| `.btn-secondary` | Weisser Pill-Button mit Border |
| `.btn-outline` | Akzentfarbe Outline Pill-Button |
| `.subheadline` | Uppercase, grau, Tracking |
| `.section` | Vertikaler Rhythmus (py-20 md:py-32) |
| `.container-narrow` | max-w-4xl zentriert |
| `.container-wide` | max-w-6xl zentriert |
| `.card` | Karte mit Hover-Shadow |
| `.highlight` | Akzentfarbe als Hintergrund |
| `.link` | Akzentfarbe Link mit Underline |
| `.fade-in` | Einblende-Animation |

---

## Feature-Flags

In `site.config.ts` unter `features`:

| Flag | Default | Beschreibung |
|------|---------|-------------|
| `blog` | false | Blog mit Content Collections |
| `youtubeEmbeds` | false | YouTubeFacade-Komponente |
| `optimizedImages` | true | WebP srcset System |

---

*Basiert auf: FragYvonne.de (PageSpeed 97-100) + Teleschmiede (teleschmie.de)*
