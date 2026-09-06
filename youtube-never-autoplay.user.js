// ==UserScript==
// @name         YouTube Never Autoplay
// @version      1.0.0
// @description  Prevent YouTube videos from playing until you interact with the player.
// @match        *://www.youtube.com/*
// @run-at       document-start
// @inject-into  content
// @downloadURL  https://raw.githubusercontent.com/martinrusetski/youtube-userscripts/main/youtube-never-autoplay.user.js
// @updateURL    https://raw.githubusercontent.com/martinrusetski/youtube-userscripts/main/youtube-never-autoplay.user.js
// ==/UserScript==

(function () {
  'use strict';

  let playbackAllowed = false;

  function enforce(video) {
    video.autoplay = false;

    if (!playbackAllowed && !video.paused) {
      video.pause();
    }
  }

  function blockVideo(video) {
    if (video.dataset.neverAutoplayAttached) return;
    video.dataset.neverAutoplayAttached = 'true';

    video.addEventListener('play', () => enforce(video), true);
    video.addEventListener('playing', () => enforce(video), true);
    enforce(video);
  }

  function scan(root = document) {
    if (root instanceof HTMLVideoElement) {
      blockVideo(root);
    }

    root.querySelectorAll?.('video').forEach(blockVideo);
  }

  document.addEventListener('pointerdown', (event) => {
    const target = event.target;

    if (target instanceof Element && target.closest('#movie_player')) {
      playbackAllowed = true;
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    const target = event.target;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable
    ) {
      return;
    }

    if (event.code === 'Space' || event.key.toLowerCase() === 'k') {
      playbackAllowed = true;
    }
  }, true);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) scan(node);
      });
    }
  });

  function start() {
    scan();
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  if (document.documentElement) {
    start();
  } else {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  }

  document.addEventListener('yt-navigate-start', () => {
    playbackAllowed = false;
    document.querySelectorAll('video').forEach(enforce);
  });

  document.addEventListener('yt-navigate-finish', () => {
    document.querySelectorAll('video').forEach(enforce);
  });
})();
