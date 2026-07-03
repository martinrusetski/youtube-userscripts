// ==UserScript==
// @name         YouTube Cinema Mode
// @match        *://www.youtube.com/*
// @run-at       document-idle
// ==/UserScript==

// Only run on watch pages
function isWatchPage() {
  return location.pathname === '/watch';
}

function forceTheater() {
  if (!isWatchPage()) return;

  const flexy = document.querySelector('ytd-watch-flexy');
  if (!flexy) return;

  // 'theater' attribute is present when wide/cinema mode is active
  if (flexy.hasAttribute('theater')) return;

  // Clicking the size button only toggles once we've confirmed we're not
  // already in theater mode, so this won't bounce us back to default view
  const sizeButton = document.querySelector('.ytp-size-button');
  if (sizeButton) sizeButton.click();
}

// Re-apply on navigation (YouTube is an SPA), giving the player time to mount
document.addEventListener('yt-navigate-finish', () => {
  setTimeout(forceTheater, 500);
});

// Retry a few times on initial load until the player is ready
let attempts = 0;
const initial = setInterval(() => {
  forceTheater();
  const flexy = document.querySelector('ytd-watch-flexy');
  if ((flexy && flexy.hasAttribute('theater')) || ++attempts > 20) {
    clearInterval(initial);
  }
}, 500);
