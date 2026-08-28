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
    // Default to light (Apple marketing look) — user toggle persists 'dark' to opt in.
    var resolved = t === 'dark' ? 'dark' : 'light';
    if (resolved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }
  applyTheme(readTheme());

  // Map data-page values to the nav-link selector that should get .active
  const ACTIVE_MAP = {
    'home':          '[data-nav="apps"]',
    'useful-apps':   '[data-nav="apps"]',
    'top-apps':      '[data-nav="top-apps"]',
    'about':         '[data-nav="about"]',
    'articles':      '[data-nav="articles"]',
    'mobile':        '[data-nav="developers"]',
    'api-framework': '[data-nav="developers"]',
    'devtools':      '[data-nav="developers"]',
    'analysis':      '[data-nav="developers"]'
  };

  const NAV_HTML =
    '<nav class="site-nav">' +
      '<div class="nav-inner">' +
        '<a href="index.html" class="nav-logo">Mind<span class="dot">Obix</span></a>' +
        '<ul class="nav-links" id="nav-links">' +
          '<li data-nav="apps"><a href="useful-apps.html">Apps</a></li>' +
          '<li data-nav="top-apps"><a href="top-apps.html">Top Apps</a></li>' +
          '<li data-nav="appstore"><a href="appstore/index.html">App Store</a></li>' +
          '<li class="nav-dropdown" data-nav="developers"><a href="#">For Developers</a><ul class="nav-dropdown-menu">' +
            '<li><a href="devtools.html">Dev Tools</a></li>' +
            '<li><a href="api-framework.html">API Framework</a></li>' +
            '<li><a href="android.html">Android Kotlin</a></li>' +
            '<li><a href="apple.html">Apple Swift</a></li>' +
            '<li><a href="analysis.html">AI Analysis</a></li>' +
          '</ul></li>' +
          '<li class="nav-dropdown" data-nav="articles"><a href="#">Articles</a><ul class="nav-dropdown-menu">' +
            '<li><a href="articles/thetokenfactory/">The Token Factory</a></li>' +
            '<li><a href="articles/thememoryladder/">The Memory Ladder</a></li>' +
            '<li><a href="analysis.html">AI Analysis</a></li>' +
          '</ul></li>' +
          '<li data-nav="about"><a href="about.html">About</a></li>' +
          '<li><button id="theme-toggle" class="nav-theme-toggle" type="button" aria-label="Toggle dark mode" title="Toggle dark mode">' +
            '<span class="icon-dark" aria-hidden="true">☾</span>' +
            '<span class="icon-light" aria-hidden="true">☀</span>' +
          '</button></li>' +
          '<li><a href="mailto:ganesh@mindobix.com" class="nav-cta">Contact</a></li>' +
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
  // Two halves on desktop: Social Stream (purple) + TradeByFire
  // (orange→pink). Stack on mobile. Each half is its own clickable <a>.
  const SSP_TOP_HTML =
    '<div class="mdbx-dual-strip">' +
      '<a href="awakening.html" class="awkp-strip mdbx-dual-strip-col">' +
        '<div class="ssp-strip-inner">' +
          '<span class="ssp-strip-badge">NEW</span>' +
          '<span class="ssp-strip-text">' +
            '<strong>Awakening</strong> — a quiet place to sit and be awake, on iPhone · iPad · Watch · TV.' +
          '</span>' +
          '<span class="ssp-strip-cta awkp-strip-cta">Get the app <span class="ssp-strip-arrow">→</span></span>' +
        '</div>' +
      '</a>' +
      '<a href="https://socialstream.media/#/landing" class="ssp-strip mdbx-dual-strip-col" target="_blank" rel="noopener">' +
        '<div class="ssp-strip-inner">' +
          '<span class="ssp-strip-badge">NEW</span>' +
          '<span class="ssp-strip-text">' +
            '<strong>Mindobix Social Stream</strong> — plan, write, schedule &amp; publish to X · LinkedIn · IG · YouTube · TikTok from one app.' +
          '</span>' +
          '<span class="ssp-strip-cta">Try it free <span class="ssp-strip-arrow">→</span></span>' +
        '</div>' +
      '</a>' +
      '<a href="https://tradebyfire.com/#/landing" class="wotp-strip mdbx-dual-strip-col" target="_blank" rel="noopener">' +
        '<div class="ssp-strip-inner">' +
          '<span class="ssp-strip-badge">ALPHA</span>' +
          '<span class="ssp-strip-text">' +
            '<strong>TradeByFire</strong> — deterministic weekly options plans, forged before the open.' +
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
          '<a href="awakening.html" class="awkp-promo mdbx-dual-band-col">' +
            '<div class="awkp-icon">☾</div>' +
            '<div class="ssp-body">' +
              '<span class="awkp-eyebrow">New · Awakening for iOS</span>' +
              '<div class="ssp-title">A quiet place to sit and be awake.</div>' +
              '<div class="ssp-sub">No streaks, no targets, no noise — just a breathing dot, a daily reflection from the world\'s wisdom traditions, and a calm record of the days you showed up. iPhone · iPad · Apple Watch · Apple TV.</div>' +
              '<div class="ssp-meta">mindobix.com/awakening</div>' +
            '</div>' +
            '<span class="awkp-cta">Get Awakening <span class="ssp-arrow">→</span></span>' +
          '</a>' +
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
          '<a href="https://tradebyfire.com/#/landing" class="wotp-promo mdbx-dual-band-col" target="_blank" rel="noopener">' +
            '<div class="wotp-icon">🔥</div>' +
            '<div class="ssp-body">' +
              '<span class="wotp-eyebrow">Alpha · TradeByFire</span>' +
              '<div class="ssp-title">Deterministic weekly options plans, forged before the open.</div>' +
              '<div class="ssp-sub">Sunday weekly setups, daily Market Analysis &amp; Trade Plan before the bell. Density-peak SR, 16 discipline rules, per-user watchlist. No paid LLM. $1 day pass or $20/mo.</div>' +
              '<div class="ssp-meta">tradebyfire.com</div>' +
            '</div>' +
            '<span class="wotp-cta">Try TradeByFire <span class="ssp-arrow">→</span></span>' +
          '</a>' +
        '</div>' +
      '</div>' +
    '</div>';

  const FOOTER_HTML =
    '<footer class="site-footer">' +
      '<div class="footer-inner">' +
        '<div>' +
          '<div class="footer-logo">Mind<span class="dot">Obix</span></div>' +
          '<div class="footer-tagline">Apps built with Claude Code.<br>Local-first &middot; Private &middot; Free &amp; open source</div>' +
        '</div>' +
        '<div>' +
          '<div class="footer-nav-label">Apps</div>' +
          '<nav class="footer-nav">' +
            '<a href="useful-apps.html">All Apps</a>' +
            '<a href="top-apps.html">Top Apps</a>' +
            '<a href="appstore/index.html">App Store</a>' +
            '<a href="awakening.html">Awakening</a>' +
            '<a href="habitcalendar.html">HabitCalendar</a>' +
            '<a href="app.html?id=socialstream">Social Stream</a>' +
            '<a href="app.html?id=wot">TradeByFire</a>' +
            '<a href="app.html?id=trading-journal">Trading Journal</a>' +
            '<a href="app.html?id=dailywealth">DailyWealth</a>' +
          '</nav>' +
        '</div>' +
        '<div>' +
          '<div class="footer-nav-label">More</div>' +
          '<nav class="footer-nav">' +
            '<a href="devtools.html">Dev Tools</a>' +
            '<a href="api-framework.html">API Framework</a>' +
            '<a href="android.html">Android Kotlin</a>' +
            '<a href="apple.html">Apple Swift</a>' +
            '<a href="about.html">About</a>' +
            '<a href="mailto:ganesh@mindobix.com">Contact</a>' +
          '</nav>' +
        '</div>' +
        '<div>' +
          '<div class="footer-nav-label">Contact</div>' +
          '<a href="mailto:ganesh@mindobix.com" class="footer-email">ganesh@mindobix.com</a>' +
          '<div style="font-size:11px; color:var(--muted); margin-top:6px; line-height:1.6;">Ganesh Subramanian<br>Cincinnati, Ohio</div>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span class="footer-copy">© 2026 Mindobix. Built entirely with Claude Code AI Agents.</span>' +
        '<span class="footer-copy">Vibe Coded at the speed of thought.  ·  <a href="privacy.html" style="color:var(--muted); text-decoration:underline;">Privacy Policy</a></span>' +
      '</div>' +
    '</footer>';

  function injectChrome() {
    const page = document.body && document.body.getAttribute('data-page');

    const topStrip = document.body && document.body.getAttribute('data-top-strip');
    const navMount = document.getElementById('site-nav-mount');
    if (navMount) {
      navMount.outerHTML = (topStrip === 'off' ? '' : SSP_TOP_HTML) + NAV_HTML;
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
