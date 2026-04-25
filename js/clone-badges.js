(function () {
  'use strict';

  const formatCount = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  };

  const repoFromUrl = (href) => {
    try {
      const url = new URL(href, window.location.origin);
      if (!/github\.com$/.test(url.host)) return null;
      const parts = url.pathname.replace(/^\/+/, '').split('/');
      if (parts.length < 2) return null;
      if (parts[0].toLowerCase() !== 'mindobix') return null;
      return parts[1].replace(/\.git$/, '');
    } catch (_) { return null; }
  };

  const findCardContainer = (link) => {
    let el = link.parentElement;
    let best = null;
    while (el && el.tagName !== 'BODY') {
      if (el.matches('[data-repo-card], .card, article, .feature-card, [class*="-card"], [class*="-tile"]')) {
        return el;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width > 200 && rect.width < 720 && rect.height > 120) {
        best = best || el;
      }
      el = el.parentElement;
    }
    return best;
  };

  const placeBadge = (card, total) => {
    if (!card || !total || total < 1) return;
    if (card.querySelector(':scope > .clone-badge')) return;

    const cs = getComputedStyle(card);
    if (cs.position === 'static') card.style.position = 'relative';
    if (cs.overflow === 'hidden') card.style.overflow = 'visible';

    const badge = document.createElement('div');
    badge.className = 'clone-badge';
    badge.setAttribute('aria-label', `${total.toLocaleString()} all-time git clones`);
    badge.title = `${total.toLocaleString()} all-time git clones`;
    badge.innerHTML =
      '<span class="clone-badge-num">' + formatCount(total) + '</span>' +
      '<span class="clone-badge-label">clones</span>';
    card.appendChild(badge);
  };

  const apply = (data) => {
    if (!data || !data.repos) return;
    const repos = data.repos;

    document.querySelectorAll('[data-repo]').forEach((el) => {
      const repo = el.getAttribute('data-repo');
      if (repos[repo]) placeBadge(el, repos[repo].total);
    });

    document.querySelectorAll('a[href*="github.com/mindobix/"]').forEach((link) => {
      const repo = repoFromUrl(link.href);
      if (!repo || !repos[repo]) return;
      const card = findCardContainer(link);
      if (card) placeBadge(card, repos[repo].total);
    });
  };

  const dataPath = (function () {
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    if (window.location.pathname.endsWith('/')) return 'data/clones.json';
    return 'data/clones.json';
  })();

  fetch(dataPath, { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => apply(data));
      } else {
        apply(data);
      }
    })
    .catch(() => { /* silent */ });
})();
