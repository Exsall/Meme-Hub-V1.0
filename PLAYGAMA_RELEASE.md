# Meme Hub V2.0 — Playgama release

Meme Hub V2.0 uses Playgama Bridge v2 as its portal SDK layer.

## Runtime integration

- SDK: `https://bridge.playgama.com/v2/stable/playgama-bridge.js`
- Configuration: `playgama-bridge-config.json` beside `index.html`
- Initialization: `bridge.initialize()`
- Ready signal: `bridge.platform.sendMessage('game_ready')`
- Gameplay lifecycle: `gameplay_started` / `gameplay_stopped`
- Save data: `bridge.storage.get/set`
- Rewarded ads: `bridge.advertisement.showRewarded(...)`
- Interstitial ads: `bridge.advertisement.showInterstitial(...)`

Rewarded game rewards are granted only after Playgama reports the `rewarded` state. Full-screen advertisements pause game audio and gameplay until the ad closes or fails.

## Build

Run:

```bash
npm ci
npm run build:playgama
```

Upload the contents of `dist/` as one ZIP with `index.html` and `playgama-bridge-config.json` at the archive root.

GitHub Actions automatically creates `meme-hub-v2.0.zip` for every push to `main`.

## Release QA

Check the uploaded build in the Playgama Developer Cabinet / QA environment:

1. Game starts and sends `game_ready`.
2. Territory backgrounds and all local assets load.
3. Existing progress loads and new progress persists through Bridge storage.
4. 10,000-coin rewarded ad grants exactly one reward and starts the one-hour cooldown.
5. Booster rewarded ads activate the requested booster only after a completed rewarded ad.
6. Wheel rewarded ad adds exactly one wheel spin and respects the one-hour cooldown.
7. Closing/skipping a rewarded ad without a reward event grants nothing.
8. Gameplay and sound pause while full-screen ads are open and resume afterward.
9. Interstitial and rewarded availability are handled by Playgama Bridge; no third-party ad SDK is embedded.
10. Admin and analytics debug panels remain disabled in production.
