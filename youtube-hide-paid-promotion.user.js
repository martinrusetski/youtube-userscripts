// ==UserScript==
// @name         YouTube Hide Paid Promotion
// @version      1.0.0
// @match        *://www.youtube.com/*
// @run-at       document-start
// @downloadURL  https://raw.githubusercontent.com/martinrusetski/youtube-userscripts/main/youtube-hide-paid-promotion.user.js
// @updateURL    https://raw.githubusercontent.com/martinrusetski/youtube-userscripts/main/youtube-hide-paid-promotion.user.js
// ==/UserScript==

// The "Includes paid promotion" disclosure on hover-preview thumbnails is a
// <ytm-paid-content-overlay-renderer> whose only child is an <a> linking to a
// support.google.com help page. It lives inside the inline player's
// ytInlinePlayerControlsTopLeftControls container, so clicking a thumbnail near
// it opens the help page in a new tab instead of playing the video.
//
// A plain CSS rule is enough: it applies to nodes YouTube injects later, so we
// don't need a MutationObserver. pointer-events is a belt-and-suspenders guard
// in case the overlay ever renders without display:none taking effect.
const css = `
  ytm-paid-content-overlay-renderer,
  .ytmPaidContentOverlayHost,
  .ytmPaidContentOverlayLink {
    display: none !important;
    pointer-events: none !important;
  }
`;

const style = document.createElement('style');
style.textContent = css;

// At document-start <head> may not exist yet; documentElement always does.
(document.head || document.documentElement).appendChild(style);
