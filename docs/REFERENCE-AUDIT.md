# Reference audit — 27 October 2026

The supplied workspace was empty (including hidden files). No existing routes, assets, dependencies, Git repository, deployment configuration or running application were present. The only attachment was the project brief. The venue photo, wedding photos and audio were not included.

## Inspected in Playwright

- Sacred Garden: 390 × 844 and 1440 × 1000; envelope, two intermediate opening frames, hero, introduction, countdown, schedule, venue, map, dress/gift details, RSVP, closing.
- Bride and groom reference builders: checkboxes, section settings and generated query parameters.
- Evidence screenshots are in `output/playwright/reference-*.png`.

## Behavior → implementation plan

| Observed reference | Measured behavior | Local equivalent / limitation |
| --- | --- | --- |
| Envelope | Ivory embossed botanical envelope; burgundy seal; max width 440px | Original generated embossed envelope, layered CSS flaps, H&P seal |
| Opening | Click starts 4.8s proprietary film and music; envelope fades 1.4s; film crossfade starts 0.8s before end | Original CSS seal glow, perspective flap lift, letter rise, 1.4s crossfade beginning at 4s. Timing equivalent; not the same film |
| Hero | Narrow 450px desktop artboard, ornate arch, swan film, gold script | Original garden art; same centered composition. Animated water light instead of proprietary swan footage |
| Hero text | Fade up 30px over 2s, delay 3s | Same values, anchored to visitor opening gesture |
| Floral foreground | 4s loops, rotation +2° / −2°, scales 1.06 / 1.04 | Original floral cutout, identical timing and transforms |
| Scroll cue | 5px bounce, 600ms down + 500ms back | Same keyframes |
| Introduction | 1s fade title; 2s fade paragraph with .2s delay | Blessings/introduction use these entrances |
| Countdown | Rise 100px over 1s | Same; real event dates with explicit India timezone |
| Schedule | Text fades 1.5s, delays 0/.1/.1/.3/.4s; flower scrolls down central timeline | Same pattern adapted to selected functions; scroll progress controls original flower marker |
| Venue | Decorations slide from opposite sides 40px/2s; illustration zoom .9 to 1/3s; labels rise 40px/2s | Same sequence; actual venue photo pending, venue text/directions shown without fabricated venue photo |
| Petals | Individual trajectories 2–9s; rotations −6°/−12°; drift ±27–99px and 73–381px | Six original petals with independent trajectories activated once on entering venue |
| Details panel | Torn parchment edge and botanical corners | Same treatment for additional family/event content |
| RSVP | Seal zoom .9/1.5s with .5s delay; looping cue; RSVP form | No RSVP collection requested by the wedding brief; no invented form/backend |
| Closing | Text fade 1s / rise 40px over 2s; foreground sway 4s | Same motion; supplied family names, venue photo added when provided |
| Gallery | No gallery/lightbox observed in this reference | Optional gallery supported only when real images are configured; not described as a reference effect |
| Audio | Persistent audio, click starts playback, fixed burgundy toggle | One persistent audio element, error-aware accessible control. Exact track pending |
| Builder | Event IDs in URL; section flags; copy/share/preview; no backend | Shared configuration and two side-specific entry points. Validated IDs, live preview, explicit empty-selection handling |

## Approved content decisions

User confirmed retaining both cocktail titles: “The Saga of Love” in a combined invitation and “A Saga of Love” for cocktail-only guests. All supplied family details and relationships remain verbatim, including the groom-side grandson/son wording. Cocktail-only uses a dedicated single-event scene in the shared engine.

## Fidelity boundary

Update: the client supplied the venue image during implementation. It is now integrated as `assets/venue.jpg` in both family invitations. Audio and optional gallery photos remain pending.

Animation parameters were observed in the live reference's rendered animation attributes and opening script, then independently implemented. No reference images, videos, fonts or audio are bundled. Original artwork and open-license typefaces are used. Exact pixel/video identity is not claimed. The original opening film, moving swans, custom font, client venue photograph and supplied audio remain the main visual/media differences.
