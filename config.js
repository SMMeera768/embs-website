/* ════════════════════════════════════════════════════════════════
   config.js — the ONE place the backend address is configured.

   Every public page and every admin page loads this file before its
   own scripts, so changing the line below repoints the entire site.

   Include no trailing slash. The path must end in /api.
   ════════════════════════════════════════════════════════════════ */

window.EMBS_API_BASE = 'https://embs-website-89fl.onrender.com/api';


/* ── Nothing below here needs editing ───────────────────────── */

/* When the site is opened from a local server, prefer a same-origin
   /api path if one is being proxied. Harmless in production, where
   no such proxy exists and the value above is used unchanged. */
(function () {
  var host = window.location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1';

  if (isLocal && window.EMBS_LOCAL_API_PROXY) {
    window.EMBS_API_BASE = '/api';
  }
})();
