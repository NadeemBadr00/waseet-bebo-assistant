# Bebo v4 — verification
Date: 2026-09-29

- 78 animation checks passed: original drag/walk/jump/laptop; all six PNG atlases; slower speaking frame cadence, silence and pause; scratching; dancing; fly orbit → catch → chewing → idle; interruption and reduced motion; laugh/cry/plead, falling-tear pause, paired cat/robot movement, bounds and edge turns, resize, safe interruption, cleanup and inline mode.
- 31 chat lifecycle checks passed using mock SpeechRecognition, playback and API responses: compact input, popup, full-history view, safe text rendering, dialect and history forwarding, four new emotion/chase commands, audio stop/replay, permission/unsupported-browser errors, stale response cancellation and cleanup.
- 12 Node integration suites passed: dialect detection, safe commands, brief replies, WAV response variants, actual proxy request contract, rejected origins/hosts/private files, input bounds, upstream errors, rate limit, and request cancellation.
- Live Waseet API: Egyptian chat response HTTP 200; Saudi/Kore speech HTTP 200, WAV at 24 kHz (182,706 bytes, about 3.81 s). Browser chat and audio playback also verified.
- Mobile layout checked in a 390×560 CSS-pixel iframe; popup, dock and composer remain inside the content viewport. Full browser viewport restored afterward.
- SpeechRecognition was simulated in tests; actual user microphone capture was not started. Browser support, permission and network service availability affect dictation.
- Mouth animation follows smoothed audio energy with a fallback frame cycle. This is not phoneme-level lip synchronization.
- No production website was deployed or changed. Secret configuration remains outside the distributable/public folder.
