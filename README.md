# Harshit & Pritanshi — wedding invitation system

A static, shared invitation engine with bride/groom builders, original garden artwork, the supplied venue image and measured Sacred Garden animation timings. No framework, installation step, database or server API is required in production. Node 20+ is used for the local server, tests and packaging only.

## Run

```powershell
npm run dev
```

Open `http://127.0.0.1:8000/`. If port 8000 is already occupied, use `$env:PORT='8001'` before running the command.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Family entry point |
| `groom-invite-builder.html` | Harshit’s builder |
| `bride-invite-builder.html` | Pritanshi’s builder |
| `builder.html?side=harshit` | Shared builder entry |
| `groom.html` / `bride.html` | General invitations |
| `invite.html?side=harshit` | Shared invitation engine |
| `invite.html?side=pritanshi&e=cocktail` | Cocktail-only guest invitation |

Both builders share the same source and configuration. Choose functions, optional sections, then copy/open/share the link. WhatsApp opens an encoded message draft; it does not send automatically. No guest names, numbers or lists are stored.

An absent `e` parameter means all functions. An explicit empty or wholly invalid `e` means none. Unknown IDs are ignored and never enable additional events. Duplicate IDs are normalized. Supported IDs: `haldi`, `cocktail`, `anand-karaj`, `lunch`. Hidden sections use `hide=blessings,countdown,summary,venues,gallery`. Link configuration is intended for personalization, not access control; guests can change query parameters.

## Content and assets

Edit **`src/config.js`** for family names, blessings, dates, venues, titles, optional sections and media. Dates use ISO timestamps with `+05:30`; display formatting uses Asia/Kolkata regardless of the visitor’s timezone. Event groups and date ranges derive from selected events.

- `assets/venue.jpg` is the supplied JB Innovations artwork, used on its location panel. The closing family page has no venue photograph.
- `assets/ashiyana-gurudwara.png` is the supplied Ashiyana Gurudwara location artwork. Its printed “Location” title is preserved, with the address and directions button beneath it.
- The four supplied `assets/event-*` illustrations are mapped to the matching events in `src/config.js`. The original files are preserved; CSS sizes them and blends their light backgrounds into the parchment.
- **Background music:** `assets/audio/wedding-reel.m4a` is the original audio track extracted from the client-selected Instagram reel `Dc-jjCstEFO`. It starts when a guest opens the invitation, loops continuously while they scroll, and can be paused/resumed with the music button. Both builder previews, including “Replay opening,” remain silent and do not load the track. To replace it, change `assets.audio` in `src/config.js`. Failed playback produces a retry message.
- Original garden, envelope and floral PNG source artwork is retained. Optimized `.webp` copies are used by the website, totaling about 1.2 MB. Prompts and provenance are in `docs/ASSET-PROMPTS.md`.
- Fonts are self-hosted in `assets/fonts/` with their SIL Open Font Licenses. No Google Fonts connection is needed by the published pages.
- Add real photos to `assets.gallery` as `{src, alt}` entries to enable the optional gallery and keyboard-closeable lightbox. No substitute couple photos are supplied.
- `assets.openingVideo` and `assets.heroVideo` can point to authorized replacement videos. The default opening is original CSS animation, not the reference’s proprietary video. Only original media, licensed fonts, and the client’s supplied image are bundled.

## Build and deploy

```powershell
npm test
npm run build
npm run preview
```

Publish the **contents of `dist/`** to a static host. All application and asset paths are relative, so repository subpaths work. No SPA rewrite is needed; these are real HTML entry points.

For GitHub Pages, create a repository and upload this source. Use a Pages Actions workflow that checks out the repository, sets up Node 20+, runs `npm test` and `npm run build`, uploads `dist` with `actions/upload-pages-artifact`, then deploys with `actions/deploy-pages`. Alternatively upload `dist/` to another static host directly. There is no configured Git remote or hosting account in this workspace, and no public deployment is claimed.

After deployment, open the **hosted** builder to generate shareable guest links. A localhost link only works on the computer running the preview. Static builder pages are not password-protected; guest pages contain no administration controls.

## Validation

`npm test` covers every event-selection combination, repository subpaths, invalid inputs, title variants, timezone formatting and countdown boundaries.

The browser checks use the requested Playwright CLI, not Playwright Test specs:

```powershell
npx --yes --package @playwright/cli playwright-cli -s=weddinglocal open http://127.0.0.1:8001/ --headed
npx --yes --package @playwright/cli playwright-cli -s=weddinglocal run-code --filename scripts/browser-qa.mjs
```

Start the local server on port 8001 first. Audio QA uses the small WAV fixture in `output/playwright/qa-tone.wav`, generated by `node scripts/qa-audio-fixture.mjs`. This is test-only media and is never configured in the actual invitation. Screenshots are saved under `output/playwright/`. See `docs/QA.md` and `docs/REFERENCE-AUDIT.md` for results and remaining fidelity differences.
