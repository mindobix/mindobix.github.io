(function () {
  'use strict';

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
          '<li><a href="mailto:ganesh@mindobix.com" class="nav-cta" onclick="return (typeof gtag_report_conversion === \'function\') ? gtag_report_conversion(\'mailto:ganesh@mindobix.com\') : true;">Contact Us</a></li>' +
        '</ul>' +
        '<button class="nav-hamburger" onclick="document.getElementById(\'nav-links\').classList.toggle(\'open\')" aria-label="Menu">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
    '</nav>';

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
    const navMount = document.getElementById('site-nav-mount');
    if (navMount) {
      navMount.outerHTML = NAV_HTML;
      const page = document.body && document.body.getAttribute('data-page');
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
      footerMount.outerHTML = FOOTER_HTML;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectChrome);
  } else {
    injectChrome();
  }
})();
