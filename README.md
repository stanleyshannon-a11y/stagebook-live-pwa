# StageBook Live PWA

A separate, dependency-free, offline-first lyrics and setlist app designed for fast stage use. It does not connect to or modify the Orange Pi Flask project.

## What is included

- One band with replaceable sample content
- Multiple setlists and large, high-contrast lyrics
- Horizontal swipe, Previous/Next buttons, and keyboard navigation
- One-screen lyric paging with a visible page count and page-turner controls
- Per-song artwork support
- Adjustable lyric size (the `A−` button cycles through four sizes and remembers the choice)
- Installable standalone PWA with all app files cached locally
- No framework, package install, database, or build step

## Run locally

A service worker cannot run by opening `index.html` directly. Serve this folder over HTTP instead.

If Python is installed, open a terminal in this folder and run:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`. For another static server, serve this folder as its web root. There is no build command.

## Install on Android

For a real phone, host this folder on any HTTPS static host (GitHub Pages, Cloudflare Pages, Netlify, or similar), then:

1. Open its HTTPS address in Chrome on Android while online.
2. Wait until the home screen says **Ready for offline use**.
3. Open Chrome's menu and choose **Install app** or **Add to Home screen**.
4. Launch StageBook from the new home-screen icon.
5. Before a show, enable airplane mode and open the app once to confirm the local copy works.

After the first successful load, the app, lyrics, and bundled artwork work without a server or network connection. The HTTPS host is only needed for initial installation and future updates.

## Replace the sample content

Edit `data.js`. It contains the band, songs, lyrics, artwork paths, and setlists, with comments explaining the format.

- Give every song a unique `id`.
- Put song IDs in each setlist's `songIds` array in performance order.
- Use blank lines inside `lyrics` to separate verses.
- Put artwork in `assets/` and refer to it with a relative path such as `assets/my-cover.jpg`.
- Add every new local artwork file to `APP_FILES` in `sw.js`, so it is guaranteed to be available offline.

After changing any deployed file, change `CACHE_NAME` near the top of `sw.js` (for example, from `stagebook-live-v1` to `stagebook-live-v2`). This makes installed copies replace the old cache on their next online launch.

## Stage controls

- Swipe left/right over the lyrics or use the large left/right footer buttons.
- Left/right advances one lyric page; at a song boundary it moves to the adjacent song.
- Keyboard: Right/Left arrows turn pages; Escape returns to setlists.
- Tap `A−` repeatedly to cycle lyric sizes.
- Lyrics scroll vertically without triggering an accidental song change; a swipe must be clearly horizontal.

## Reliability notes

Keep all performance artwork local rather than linking to remote images. Test the exact deployed version in airplane mode before taking it on stage, and leave automatic screen rotation/brightness configured to your preference at the Android system level.
