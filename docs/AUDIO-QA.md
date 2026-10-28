# Soundtrack checks — 28 October 2026

Source: client-selected Instagram reel https://www.instagram.com/reel/Dc-jjCstEFO/.
Saved its original audio-only rendition as `assets/audio/wedding-reel.m4a` (164,452 bytes; browser duration 22.382585 seconds). No transcoding or audio edits.

Verified the built site using Playwright Interactive with touch input at 390 × 844:

- Before the opening tap: paused, music control hidden, zero soundtrack requests.
- Opening tap: unmuted playback starts; a single persistent player continues while scrolling.
- Pause/resume: actual playback time stops and resumes; button icon, label and pressed state follow playback.
- Natural end: observed two loop wraps while playback continued.
- Groom and bride builders: live preview and Replay opening contain no audio player, no visible music control and make zero soundtrack requests.
- Failed download: shows the retry message; restoring the request and pressing Play successfully reloads the audio.
- Empty event selection: no player is created.
- Mobile screenshots reviewed for playing, paused and failure states; control stays inside the viewport with no clipping. Builder screenshot confirms no music control.
- No page JavaScript errors during the main playback flow; existing config tests and production build pass.

Screenshots and the coverage inventory are under ignored `output/playwright/audio-*`. Testing used desktop Chrome mobile emulation, not a physical iPhone or Android device. The dedicated test browser was closed afterward; the local preview server remains available.
