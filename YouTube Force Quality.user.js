// ==UserScript==
// @name         YouTube Force Quality
// @match        *://www.youtube.com/*
// @run-at       document-idle
// ==/UserScript==

// Set your desired quality here:
// 'tiny' (144p), 'small' (240p), 'medium' (360p), 'large' (480p),
// 'hd720' (720p), 'hd1080' (1080p), 'hd1440' (1440p), 'hd2160' (4K)
const TARGET_QUALITY = 'hd1440';

function getPlayer() {
  return document.querySelector('#movie_player');
}

function forceQuality() {
  const player = getPlayer();
  if (!player || typeof player.setPlaybackQualityRange !== 'function') return;

  try {
    const available = player.getAvailableQualityLevels?.() || [];
    // Only apply if the target quality is actually available for this video
    const quality = available.includes(TARGET_QUALITY) ? TARGET_QUALITY : available[0];

    if (quality) {
      player.setPlaybackQualityRange(quality, quality);
      player.setPlaybackQuality(quality);
    }
  } catch (e) {
    // Player API not ready yet, ignore and retry on next tick
  }
}

// Re-apply periodically, since YouTube's adaptive bitrate
// will try to silently downgrade on a bad connection
setInterval(forceQuality, 2000);

// Also re-apply on navigation (YouTube is an SPA)
document.addEventListener('yt-navigate-finish', () => {
  setTimeout(forceQuality, 1000);
});// ==UserScript==
// @name        NewScript-1ponqsxt
// @description This is your new file, start writing code
// @match       *://*/*
// ==/UserScript==