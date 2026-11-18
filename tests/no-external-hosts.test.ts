/**
 * Wache gegen fremde Font-Hosts (Ticket AG-261015-fonts-wache-vorlage-astro-referenz).
 * Hintergrund: Max-Direktive 14.10.2026, keine extern geladenen Schriften, alle Schriften lokal vom eigenen Server.
 *
 * Übernahme in ein Projekt in drei Schritten:
 *   1. Diese Datei unverändert nach tests/no-external-hosts.test.ts kopieren (Vitest muss eingerichtet sein,
 *      siehe vitest.config.ts und die Skripte "test" und "test:watch" in package.json).
 *   2. ERLAUBTE_HOSTS unten auf die eigene Domain setzen (relative Pfade sind immer erlaubt).
 *   3. npm test ausführen. Rot heißt: Fund mit Datei und Zeile, Schrift lokal ablegen und den Verweis umstellen.
 *
 * Geprüft werden src/, public/ und (falls vorhanden) dist/ auf:
 *   - die fest verbotenen Font-Hosts (VERBOTENE_HOSTS),
 *   - @import mit fremdem Host,
 *   - @font-face mit src url(...) auf einem fremden Host.
 * Die Selbsttests ganz unten belegen, dass die Wache bei einem Verstoß wirklich rot wird.
 */
import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/** Eigene Domain(s) des Projekts, zum Beispiel ['example.de']. Unterdomains sind mit erlaubt. */
export const ERLAUBTE_HOSTS: string[] = []

export const VERBOTENE_HOSTS: string[] = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'fonts.bunny.net',
  'use.typekit.net',
  'kit.fontawesome.com',
  'ajax.googleapis.com/ajax/libs/webfont',
]

const VERZEICHNISSE = ['src', 'public', 'dist']
const ENDUNGEN = ['.astro', '.css', '.scss', '.html', '.htm', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.md', '.mdx', '.svg']

export interface Fund {
  zeile: number
  grund: string
}

function zeileVon(text: string, index: number): number {
  return text.slice(0, index).split('\n').length
}

function hostErlaubt(host: string, erlaubt: string[]): boolean {
  const h = host.toLowerCase()
  return erlaubt.some((e) => h === e.toLowerCase() || h.endsWith('.' + e.toLowerCase()))
}

/** Findet Verstöße in einem Text. Reine Funktion, damit sie ohne Dateien testbar ist. */
export function finde(text: string, erlaubt: string[] = ERLAUBTE_HOSTS): Fund[] {
  const funde: Fund[] = []
  const zeilen = text.split('\n')

  zeilen.forEach((z, i) => {
    for (const host of VERBOTENE_HOSTS) {
      if (z.toLowerCase().includes(host)) funde.push({ zeile: i + 1, grund: `verbotener Font-Host ${host}` })
    }
  })

  const importRe = /@import\s+(?:url\(\s*)?['"]?\s*(?:https?:)?\/\/([^/'")\s;]+)/gi
  for (const m of text.matchAll(importRe)) {
    if (!hostErlaubt(m[1], erlaubt)) funde.push({ zeile: zeileVon(text, m.index ?? 0), grund: `@import mit fremdem Host ${m[1]}` })
  }

  const blockRe = /@font-face\s*\{[^}]*\}/gi
  for (const b of text.matchAll(blockRe)) {
    const urlRe = /url\(\s*['"]?\s*(?:https?:)?\/\/([^/'")\s]+)/gi
    for (const u of b[0].matchAll(urlRe)) {
      if (!hostErlaubt(u[1], erlaubt)) {
        funde.push({ zeile: zeileVon(text, (b.index ?? 0) + (u.index ?? 0)), grund: `@font-face mit fremdem Host ${u[1]}` })
      }
    }
  }
  return funde
}

function dateien(verzeichnis: string, liste: string[] = []): string[] {
  for (const name of readdirSync(verzeichnis)) {
    const pfad = join(verzeichnis, name)
    const st = statSync(pfad)
    if (st.isDirectory()) dateien(pfad, liste)
    else if (ENDUNGEN.some((e) => name.toLowerCase().endsWith(e))) liste.push(pfad)
  }
  return liste
}

describe('keine fremden Font-Hosts im Projekt', () => {
  it('src, public und dist enthalten keinen Verstoß', () => {
    const wurzel = process.cwd()
    const meldungen: string[] = []
    for (const v of VERZEICHNISSE) {
      const dir = join(wurzel, v)
      if (!existsSync(dir)) continue
      for (const datei of dateien(dir)) {
        for (const f of finde(readFileSync(datei, 'utf8'))) {
          meldungen.push(`${relative(wurzel, datei)}:${f.zeile} ${f.grund}`)
        }
      }
    }
    expect(meldungen, meldungen.join('\n')).toEqual([])
  })
})

describe('Selbsttest der Wache (muss scheitern können)', () => {
  it('meldet einen Google-Fonts-Link', () => {
    const t = '<link href="https://fonts.googleapis.com/css2?family=Inter" rel="stylesheet">'
    expect(finde(t, []).length).toBeGreaterThan(0)
  })
  it('meldet @font-face mit fremdem Host, mit Zeilennummer', () => {
    const t = 'a {}\n@font-face {\n  font-family: X;\n  src: url(https://cdn.example.org/x.woff2) format("woff2");\n}'
    const f = finde(t, [])
    expect(f.length).toBe(1)
    expect(f[0].zeile).toBe(4)
  })
  it('meldet @import mit fremdem Host', () => {
    expect(finde('@import url("https://cdn.example.org/f.css");', []).length).toBe(1)
  })
  it('lässt relative Schrift-URLs und die eigene Domain durch (kein Fehlalarm)', () => {
    const t = '@font-face { font-family: X; src: url(/fonts/inter-400.woff2) format("woff2"); }'
    expect(finde(t, [])).toEqual([])
    const e = '@font-face { font-family: X; src: url(https://www.example.de/fonts/x.woff2); }'
    expect(finde(e, ['example.de'])).toEqual([])
  })
})
