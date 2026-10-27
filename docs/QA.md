# Browser verification

27 October 2026. Playwright CLI with desktop Chromium. Mobile viewport emulation is not a physical iPhone/Android device test.

## Passed

- Six configuration tests, including all 16 event-selection combinations and repository-subpath URLs.
- Production build (`npm run build`).
- 42 browser assertions: both family invitations at 360, 390, 768 and 1440px; no horizontal overflow; four general event cards; cocktail-only content; optional sections removed; excluded venue removed; filtered links survive refresh; safe invalid-event state; clear/select-all; family switching; live preview; generated URL; clipboard copy; WhatsApp URL; and audio controls.
- Real browser audio playback/pause/resume/loop and persistence across scrolling, using a test-only WAV routed into configuration. This verifies the player implementation, not the missing client recording.
- Normal-motion opening captured at 1.2s and 2.7s, followed by the final hero. Reference captured at the same 390 × 844 viewport and timings.
- Reference and local desktop captures at 1440px. Side-by-side review covered composition, envelope, hero, typography, blessings, family text, schedule, supplied venue artwork and closing names.
- Self-hosted fonts loaded. Application JavaScript produced no errors during the 42-check browser run.
- A further 12 production checks passed under `/dist/`: image/font readiness in the live preview; clipboard failure fallback; real new-tab opening; replay; deployment subpaths; filtered venue exclusion; normal-motion opening completion; measured hero durations/delay; supplied photo loading; and no failed local asset requests. Total: 54 browser assertions.

## Differences and outstanding inputs

- The reference’s opening is a proprietary 4.8-second film. The local implementation recreates the glow, flap opening, letter reveal and crossfade in CSS; it is not frame-identical.
- Original generated illustrations differ from the reference. Hero swans are in the original still artwork with a water-light effect; they are not the reference’s moving swan footage.
- Great Vibes / Cormorant Garamond are licensed replacements for the reference’s custom fonts.
- Venue photograph was supplied during implementation and is integrated in both families' location/closing sections. The original image, including its existing markings, is preserved.
- Exact background audio and optional couple/gallery photos have not been supplied. The audio control and gallery stay hidden rather than exposing broken media.
- Google Maps embeds rely on the external service and may load slowly or be blocked. Independent “Open in Google Maps” links remain available. No map provider imagery is bundled.
- No live public deployment exists; local preview and production files are provided.

## Evidence

See `output/playwright/` for `reference-*.png`, `local-*.png`, family-specific venue/closing captures and builder desktop/mobile captures. `scripts/browser-qa.mjs` is the repeatable interaction check; run it through Playwright CLI as documented in the README.
