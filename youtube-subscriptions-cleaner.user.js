// ==UserScript==
// @name         YouTube Subscriptions Cleaner
// @version      1.0.0
// @match        *://www.youtube.com/*
// @run-at       document-idle
// @downloadURL  https://raw.githubusercontent.com/martinrusetski/youtube-userscripts/main/youtube-subscriptions-cleaner.user.js
// @updateURL    https://raw.githubusercontent.com/martinrusetski/youtube-userscripts/main/youtube-subscriptions-cleaner.user.js
// ==/UserScript==

function clean() {
  // Hide "Most relevant" section
  document.querySelectorAll('ytd-rich-section-renderer').forEach(el => {
    if (el.textContent.includes('Most relevant')) {
      el.style.display = 'none';
    }
  });

  // Hide Shorts rows/shelves
  document.querySelectorAll('[is-shorts], ytd-reel-shelf-renderer').forEach(el => {
    el.style.display = 'none';
  });

  // Remove live, premieres and upcoming streams from DOM entirely
  document.querySelectorAll('ytd-rich-item-renderer').forEach(el => {
    const badge = el.querySelector('badge-shape .ytBadgeShapeText');
    if (badge && ['LIVE', 'PREMIERING', 'UPCOMING'].includes(badge.textContent.trim().toUpperCase())) {
      el.remove();
    }
  });
}

const observer = new MutationObserver(clean);
observer.observe(document.documentElement, { childList: true, subtree: true });
clean();