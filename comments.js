/* The Little Dairy: blog comments, hosted by Remarkbox (remarkbox.com).
   Adds the comment box to any page with <div id="remarkbox-div"></div>.
   Threads are keyed to the www address registered with Remarkbox, without any
   query string, so visits with or without "www" (or with Instagram/Facebook
   tracking tags on the link) all share one conversation. */
(function () {
  var box = document.getElementById('remarkbox-div');
  if (!box) return;

  var rb_owner_key = 'f44be5cd-e575-11f1-8000-040140774501';
  var path = window.location.pathname.replace(/\.html$/, '');
  var thread_uri = 'https://www.thelittledairy.co.uk' + path;
  var heading = document.querySelector('article h1');
  var thread_title = heading ? heading.textContent.trim() : document.title;
  var thread_fragment = window.location.hash;

  var rb_src = 'https://my.remarkbox.com/embed' +
    '?rb_owner_key=' + rb_owner_key +
    '&thread_title=' + encodeURIComponent(thread_title) +
    '&thread_uri=' + encodeURIComponent(thread_uri) +
    '&mode=light' +
    thread_fragment;

  var ifrm = document.createElement('iframe');
  ifrm.id = 'remarkbox-iframe';
  ifrm.setAttribute('scrolling', 'no');
  ifrm.setAttribute('src', rb_src);
  ifrm.setAttribute('frameborder', '0');
  ifrm.setAttribute('tabindex', '0');
  ifrm.setAttribute('title', 'Comments');
  ifrm.style.width = '100%';
  ifrm.style.minHeight = '300px';
  ifrm.style.border = 'none';
  box.appendChild(ifrm);

  var s = document.createElement('script');
  s.src = 'https://my.remarkbox.com/static/js/iframe-resizer/iframeResizer.min.js';
  s.onload = function () {
    window.iFrameResize({
      checkOrigin: ['https://my.remarkbox.com'],
      inPageLinks: true,
      initCallback: function (e) { e.iFrameResizer.moveToAnchor(thread_fragment); }
    }, ifrm);
  };
  document.head.appendChild(s);
})();
