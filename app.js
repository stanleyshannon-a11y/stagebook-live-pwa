(() => {
  "use strict";

  const data = window.STAGEBOOK_DATA;
  const app = document.querySelector("#app");
  const songsById = new Map(data.songs.map((song) => [song.id, song]));
  let currentSetlist = null;
  let currentIndex = 0;
  let currentPage = 0;
  let touchStart = null;
  let fontScale = Number(localStorage.getItem("stagebook-font-scale")) || 1;

  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character]);

  function validSongs(setlist) {
    return setlist.songIds.map((id) => songsById.get(id)).filter(Boolean);
  }

  function renderHome() {
    currentSetlist = null;
    document.title = `${data.band.name} · StageBook Live`;
    app.innerHTML = `
      <main class="screen home">
        <header class="brand">
          ${data.band.artwork ? `<img src="${escapeHtml(data.band.artwork)}" alt="${escapeHtml(data.band.name)} artwork">` : ""}
          <div><p class="eyebrow">${escapeHtml(data.band.subtitle || "StageBook Live")}</p><h1>${escapeHtml(data.band.name)}</h1></div>
        </header>
        <section aria-labelledby="setlists-title">
          <p class="eyebrow" id="setlists-title">Choose a setlist</p>
          <div class="setlist-grid">
            ${data.setlists.map((setlist) => `
              <button class="setlist-card" data-setlist="${escapeHtml(setlist.id)}">
                <strong>${escapeHtml(setlist.name)}</strong><span class="muted">${escapeHtml(setlist.detail || `${validSongs(setlist).length} songs`)}</span>
              </button>`).join("")}
          </div>
        </section>
        <p id="offline-status" class="status">Preparing offline mode…</p>
      </main>`;
    app.querySelectorAll("[data-setlist]").forEach((button) => button.addEventListener("click", () => openSetlist(button.dataset.setlist)));
    updateOfflineStatus();
  }

  function openSetlist(id) {
    const selected = data.setlists.find((setlist) => setlist.id === id);
    if (!selected || validSongs(selected).length === 0) return;
    currentSetlist = selected;
    currentIndex = 0;
    currentPage = 0;
    renderSong();
  }

  function renderSong() {
    const songs = validSongs(currentSetlist);
    const song = songs[currentIndex];
    document.title = `${song.title} · ${data.band.name}`;
    app.innerHTML = `
      <main class="screen song-screen">
        <header class="song-header">
          <button class="icon-button" id="back" aria-label="Back to setlists">‹</button>
          <div class="song-heading"><h1>${escapeHtml(song.title)}</h1><p>${escapeHtml(song.note || currentSetlist.name)}</p></div>
          <div class="size-controls" aria-label="Display controls">
            <button class="icon-button fullscreen-button" id="fullscreen" aria-label="Enter full screen">Full</button>
            <button class="icon-button" id="smaller" aria-label="Change lyric size">A−</button>
          </div>
        </header>
        <div class="lyrics-wrap" id="lyrics-wrap">
          <article class="lyrics">
            ${song.artwork ? `<img class="song-art" src="${escapeHtml(song.artwork)}" alt="${escapeHtml(song.title)} artwork">` : ""}
            <pre id="lyrics-text">${escapeHtml(song.lyrics)}</pre>
            <p class="hint">Swipe left or right to change songs</p>
          </article>
        </div>
        <footer class="song-footer">
          <button class="nav-button" id="previous" aria-label="Previous page">←</button>
          <span class="counter"><span id="page-counter">Page 1 / 1</span><br>Song ${currentIndex + 1} / ${songs.length}</span>
          <button class="nav-button" id="next" aria-label="Next page">→</button>
        </footer>
      </main>`;

    applyFontScale();
    document.querySelector("#back").addEventListener("click", renderHome);
    document.querySelector("#previous").addEventListener("click", () => turnStagePage(-1));
    document.querySelector("#next").addEventListener("click", () => turnStagePage(1));
    document.querySelector("#smaller").addEventListener("click", changeFontSize);
    document.querySelector("#fullscreen").addEventListener("click", enterFullscreen);
    const lyrics = document.querySelector("#lyrics-wrap");
    lyrics.addEventListener("touchstart", startSwipe, { passive: true });
    lyrics.addEventListener("touchend", endSwipe, { passive: true });
    requestAnimationFrame(() => { currentPage = 0; updatePageControls(); });
  }

  function previousSong(lastPage = false) {
    if (currentIndex > 0) {
      currentIndex -= 1;
      renderSong();
      if (lastPage) requestAnimationFrame(() => { currentPage = lyricPageCount() - 1; updatePageControls(); });
    }
  }
  function nextSong() { if (currentIndex < validSongs(currentSetlist).length - 1) { currentIndex += 1; currentPage = 0; renderSong(); } }
  function lyricPageSize() {
    const lyrics = document.querySelector("#lyrics-wrap");
    return lyrics ? Math.max(1, lyrics.clientHeight - 28) : 1;
  }
  function lyricPageCount() {
    const lyrics = document.querySelector("#lyrics-wrap");
    if (!lyrics) return 1;
    return Math.max(1, Math.ceil(lyrics.scrollHeight / lyricPageSize()));
  }
  function turnStagePage(direction) {
    const pages = lyricPageCount();
    if (direction > 0) {
      if (currentPage < pages - 1) currentPage += 1;
      else { nextSong(); return; }
    } else {
      if (currentPage > 0) currentPage -= 1;
      else { previousSong(true); return; }
    }
    updatePageControls();
  }
  function updatePageControls() {
    const lyrics = document.querySelector("#lyrics-wrap");
    const counter = document.querySelector("#page-counter");
    const previous = document.querySelector("#previous");
    const next = document.querySelector("#next");
    if (!lyrics || !counter || !previous || !next) return;
    const pages = lyricPageCount();
    currentPage = Math.min(currentPage, pages - 1);
    lyrics.scrollTo({ top: currentPage * lyricPageSize(), behavior: "smooth" });
    counter.textContent = `Page ${currentPage + 1} / ${pages}`;
    previous.disabled = currentIndex === 0 && currentPage === 0;
    next.disabled = currentIndex === validSongs(currentSetlist).length - 1 && currentPage === pages - 1;
  }
  function startSwipe(event) { const t = event.changedTouches[0]; touchStart = { x: t.clientX, y: t.clientY, time: Date.now() }; }
  function endSwipe(event) {
    if (!touchStart) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    const elapsed = Date.now() - touchStart.time;
    touchStart = null;
    if (elapsed < 700 && Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.4) turnStagePage(dx < 0 ? 1 : -1);
  }
  function changeFontSize() {
    const sizes = [0.8, 1, 1.2, 1.4];
    fontScale = sizes[(sizes.findIndex((size) => size >= fontScale) + 1) % sizes.length];
    localStorage.setItem("stagebook-font-scale", fontScale);
    applyFontScale();
  }

  function enterFullscreen() {
    const requestFullscreen =
      document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen;
    if (!requestFullscreen) return;
    requestFullscreen.call(document.documentElement).catch(() => {});
  }
  function applyFontScale() {
    const text = document.querySelector("#lyrics-text");
    if (text) {
      text.style.fontSize = `calc(var(--lyric-size) * ${fontScale})`;
      requestAnimationFrame(updatePageControls);
    }
  }
  function updateOfflineStatus() {
    const status = document.querySelector("#offline-status");
    if (!status) return;
    if (navigator.serviceWorker?.controller) { status.textContent = "✓ Ready for offline use"; status.classList.add("ready"); }
    else status.textContent = "Keep this screen open briefly on first launch to prepare offline mode.";
  }

  window.addEventListener("keydown", (event) => {
    if (!currentSetlist) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); turnStagePage(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); turnStagePage(1); }
    if (event.key === "Escape") renderHome();
  });

  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").then(() => navigator.serviceWorker.ready).then(updateOfflineStatus).catch(() => {
    const status = document.querySelector("#offline-status");
    if (status) status.textContent = "Offline setup needs HTTPS or localhost.";
  });
  renderHome();
})();
