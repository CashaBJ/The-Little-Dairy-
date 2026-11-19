/* The Little Dairy: cookie consent and Google Analytics.
   Google Analytics only loads after a visitor clicks "Accept".
   "Decline" is as easy as "Accept", the choice is remembered, and the
   "Cookie settings" link in the footer lets people change their mind. */
(function () {
  var GA_ID = 'G-9Y9ELCXMSN'; // Google Analytics 4 measurement ID goes here
  var KEY = 'tld-cookie-consent'; // stores "accepted" or "declined" (no tracking)

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setChoice(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  function loadAnalytics() {
    if (window.__tldGaLoaded || !/^G-[A-Z0-9]+$/.test(GA_ID) || GA_ID === 'G-XXXXXXXXXX') return;
    window.__tldGaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    gtag('js', new Date());
    gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function clearAnalyticsCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  function hideBanner() {
    var b = document.getElementById('cookie-banner');
    if (b) b.remove();
  }

  function showBanner() {
    if (document.getElementById('cookie-banner')) return;
    var b = document.createElement('div');
    b.id = 'cookie-banner';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Cookie choices');
    b.innerHTML =
      '<p>We\'d like to use Google Analytics cookies to count visits and see which pages are read, so we can improve the site. ' +
      'We won\'t set them unless you agree. <a href="privacy.html">Privacy and cookies</a></p>' +
      '<div class="cookie-buttons">' +
      '<button type="button" data-choice="declined">Decline</button>' +
      '<button type="button" data-choice="accepted">Accept</button>' +
      '</div>';
    b.addEventListener('click', function (e) {
      var choice = e.target.getAttribute && e.target.getAttribute('data-choice');
      if (!choice) return;
      setChoice(choice);
      hideBanner();
      if (choice === 'accepted') {
        loadAnalytics();
      } else {
        clearAnalyticsCookies();
        if (window.__tldGaLoaded) location.reload();
      }
    });
    document.body.appendChild(b);
  }

  function init() {
    if (GA_ID === 'G-XXXXXXXXXX') return; // not switched on until the real ID is added
    var choice = getChoice();
    if (choice === 'accepted') loadAnalytics();
    else if (choice !== 'declined') showBanner();
    document.querySelectorAll('[data-cookie-settings]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); showBanner(); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
