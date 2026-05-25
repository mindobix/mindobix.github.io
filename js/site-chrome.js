(function () {
  'use strict';

  // ── THEME ──────────────────────────────────────────────────────
  // Apply the saved theme as early as possible. The same logic is also
  // duplicated as an inline <script> in each page's <head> so dark-mode
  // visitors don't get a flash of the light theme on first paint.
  var THEME_KEY = 'mdbx-theme';
  function readTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function writeTheme(t) {
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }
  function applyTheme(t) {
    // Default to dark when nothing is stored — user toggle persists 'light' to opt out.
    var resolved = t === 'light' ? 'light' : 'dark';
    if (resolved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }
  applyTheme(readTheme());

  // Map data-page values to the nav-link selector that should get .active
  const ACTIVE_MAP = {
    'about':         '[data-nav="about"]',
    'analysis':      '[data-nav="analysis"]',
    'mobile':        '[data-nav="mobile"]',
    'api-framework': '[data-nav="api-framework"]',
    'useful-apps':   '[data-nav="useful-apps"]',
    'consulting':    '[data-nav="consulting"]',
    'devtools':      '[data-nav="devtools"]'
  };

  const NAV_HTML =
    '<nav class="site-nav">' +
      '<div class="nav-inner">' +
        '<a href="index.html" class="nav-logo">Mind<span class="dot">Obix</span></a>' +
        '<ul class="nav-links" id="nav-links">' +
          '<li class="nav-dropdown" data-nav="mobile"><a href="#">Mobile Architecture</a><ul class="nav-dropdown-menu"><li><a href="android.html">Android Kotlin Apps</a></li><li><a href="apple.html">Apple Swift Apps</a></li></ul></li>' +
          '<li data-nav="api-framework"><a href="api-framework.html">API Framework</a></li>' +
          '<li data-nav="devtools"><a href="devtools.html">Dev Tools</a></li>' +
          '<li data-nav="useful-apps"><a href="useful-apps.html">Useful Apps</a></li>' +
          '<li data-nav="consulting"><a href="consulting.html">Consulting</a></li>' +
          '<li data-nav="about"><a href="about.html">About</a></li>' +
          '<li data-nav="analysis"><a href="analysis.html" class="nav-ai">✦ AI Analysis</a></li>' +
          '<li><button id="theme-toggle" class="nav-theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">' +
            '<span class="icon-dark" aria-hidden="true">☾</span>' +
            '<span class="icon-light" aria-hidden="true">☀</span>' +
          '</button></li>' +
          '<li><a href="mailto:ganesh@mindobix.com" class="nav-cta">Contact Us</a></li>' +
        '</ul>' +
        '<button class="nav-hamburger" onclick="document.getElementById(\'nav-links\').classList.toggle(\'open\')" aria-label="Menu">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
    '</nav>';

  const SAP_HTML =
    '<div class="sap-band">' +
      '<div class="container">' +
        '<a href="appstore/index.html" class="sap-promo">' +
          '<div class="sap-icon">📦</div>' +
          '<div class="sap-body">' +
            '<span class="sap-eyebrow">Mindobix App Store</span>' +
            '<div class="sap-title">Browse, clone, and run all 14+ apps — in one place.</div>' +
            '<div class="sap-sub">mindobix.com/appstore</div>' +
          '</div>' +
          '<span class="sap-cta">Open App Store <span class="sap-arrow">→</span></span>' +
        '</a>' +
      '</div>' +
    '</div>';

  // ── Top dual-product announcement strip (above the nav on every page) ──
  // Two halves on desktop: Social Stream (purple) + Weekly Options Trader
  // (orange→pink). Stack on mobile. Each half is its own clickable <a>.
  const SSP_TOP_HTML =
    '<div class="mdbx-dual-strip">' +
      '<a href="https://socialstream.media/#/landing" class="ssp-strip mdbx-dual-strip-col" target="_blank" rel="noopener">' +
        '<div class="ssp-strip-inner">' +
          '<span class="ssp-strip-badge">NEW</span>' +
          '<span class="ssp-strip-text">' +
            '<strong>Mindobix Social Stream</strong> — plan, write, schedule &amp; publish to X · LinkedIn · IG · YouTube · TikTok from one app.' +
          '</span>' +
          '<span class="ssp-strip-cta">Try it free <span class="ssp-strip-arrow">→</span></span>' +
        '</div>' +
      '</a>' +
      '<a href="https://wot.socialstream.media/#/landing" class="wotp-strip mdbx-dual-strip-col" target="_blank" rel="noopener">' +
        '<div class="ssp-strip-inner">' +
          '<span class="ssp-strip-badge">ALPHA</span>' +
          '<span class="ssp-strip-text">' +
            '<strong>Weekly Options Trader</strong> — AI-built weekly options plans, delivered before the bell.' +
          '</span>' +
          '<span class="ssp-strip-cta wotp-strip-cta">Start from $1 <span class="ssp-strip-arrow">→</span></span>' +
        '</div>' +
      '</a>' +
    '</div>';

  // ── Bottom dual-product hero band (before the footer on every page) ──
  // Two cards on desktop, stacked on mobile. Each is the full hero-band
  // treatment (icon, eyebrow, title, sub, CTA), just rendered narrower.
  const SSP_HTML =
    '<div class="ssp-band">' +
      '<div class="container">' +
        '<div class="mdbx-dual-band">' +
          '<a href="https://socialstream.media/#/landing" class="ssp-promo mdbx-dual-band-col" target="_blank" rel="noopener">' +
            '<div class="ssp-icon">✦</div>' +
            '<div class="ssp-body">' +
              '<span class="ssp-eyebrow">New · Mindobix Social Stream</span>' +
              '<div class="ssp-title">Stop paying $50–200/month for Hootsuite, Buffer, or Later.</div>' +
              '<div class="ssp-sub">One app to plan, draft, schedule, and publish across X · LinkedIn · Instagram · YouTube · TikTok. AI-assisted, multi-channel, multi-account.</div>' +
              '<div class="ssp-meta">socialstream.media</div>' +
            '</div>' +
            '<span class="ssp-cta">Try Social Stream <span class="ssp-arrow">→</span></span>' +
          '</a>' +
          '<a href="https://wot.socialstream.media/#/landing" class="wotp-promo mdbx-dual-band-col" target="_blank" rel="noopener">' +
            '<div class="wotp-icon">📈</div>' +
            '<div class="ssp-body">' +
              '<span class="wotp-eyebrow">Alpha · Weekly Options Trader</span>' +
              '<div class="ssp-title">AI-built weekly options plans, delivered before the bell.</div>' +
              '<div class="ssp-sub">Sunday weekly setups, daily Market Analysis &amp; Trade Plan at 8:45 ET. Density-peak SR, 16 discipline rules, per-user watchlist. $1 day pass or $20/mo.</div>' +
              '<div class="ssp-meta">wot.socialstream.media</div>' +
            '</div>' +
            '<span class="wotp-cta">Try WOT <span class="ssp-arrow">→</span></span>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  const FOOTER_HTML =
    '<footer class="site-footer">' +
      '<div class="footer-inner">' +
        '<div>' +
          '<div class="footer-logo">Mind<span class="dot">Obix</span></div>' +
          '<div class="footer-tagline">AI-Powered Software Development Consulting<br>Fixed-Bid · Local-First · Vibe Coded</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-nav-label">Navigation</div>' +
          '<nav class="footer-nav">' +
            '<a href="devtools.html">Dev Tools</a>' +
            '<a href="api-framework.html">API Framework</a>' +
            '<a href="useful-apps.html">Useful Apps</a>' +
            '<a href="appstore/index.html">App Store</a>' +
            '<a href="top-apps.html">Top Cloned Apps</a>' +
            '<a href="android.html">Android Kotlin Apps</a>' +
            '<a href="apple.html">Apple Swift Apps</a>' +
            '<a href="consulting.html">Consulting</a>' +
            '<a href="about.html">About Ganesh</a>' +
            '<a href="analysis.html">AI Analysis</a>' +
            '<a href="mailto:ganesh@mindobix.com">Contact</a>' +
          '</nav>' +
        '</div>' +
        '<div>' +
          '<div class="footer-nav-label">Contact</div>' +
          '<a href="mailto:ganesh@mindobix.com" class="footer-email">ganesh@mindobix.com</a>' +
          '<div style="font-size:11px; color:var(--muted); margin-top:6px; line-height:1.6;">Ganesh Subramanian<br>Chief Vibe Coding Officer<br>Cincinnati, Ohio</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span class="footer-copy">© 2026 Mindobix. Built entirely with Claude Code AI Agents.</span>' +
        '<span class="footer-copy">Vibe Coded at the speed of thought.  ·  <a href="privacy.html" style="color:var(--muted); text-decoration:underline;">Privacy Policy</a></span>' +
      '</div>' +
    '</footer>';

  function injectChrome() {
    const page = document.body && document.body.getAttribute('data-page');

    const navMount = document.getElementById('site-nav-mount');
    if (navMount) {
      navMount.outerHTML = SSP_TOP_HTML + NAV_HTML;
      if (page && ACTIVE_MAP[page]) {
        const target = document.querySelector('.nav-links ' + ACTIVE_MAP[page]);
        if (target) {
          const link = target.querySelector('a');
          if (link) link.classList.add('active');
        }
      }
    }
    const footerMount = document.getElementById('site-footer-mount');
    if (footerMount) {
      footerMount.outerHTML = SSP_HTML + (page !== 'useful-apps' ? SAP_HTML : '') + FOOTER_HTML;
    }
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        writeTheme(next);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectChrome);
  } else {
    injectChrome();
  }
})();
