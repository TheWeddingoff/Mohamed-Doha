// Preloader
(function () {
  var pre = document.getElementById('preloader');
  if (!pre) return;
  setTimeout(function () { pre.classList.add('fading'); }, 1800);
  setTimeout(function () { pre.classList.add('hidden'); }, 2600);
})();

// Countdown
(function () {
  var TARGET = new Date('2026-06-04T18:00:00').getTime();
  var nodes = document.querySelectorAll('#countdown .cd-num');
  if (!nodes.length) return;

  function pad(n) { return String(n).padStart(2, '0'); }
  function tick() {
    var diff = Math.max(0, TARGET - Date.now());
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff / 3600000) % 24);
    var m = Math.floor((diff / 60000) % 60);
    var s = Math.floor((diff / 1000) % 60);
    var map = { days: d, hours: h, minutes: m, seconds: s };
    nodes.forEach(function (el) {
      var k = el.getAttribute('data-k');
      el.textContent = pad(map[k]);
    });
  }
  tick();
  setInterval(tick, 1000);
})();

// Reveal on scroll
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in-view'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) { io.observe(el); });
})();

// Playlist form
(function () {
  var form = document.getElementById('playlist-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.elements.namedItem('song');
    if (input && input.value) {
      alert('Thanks for suggesting: ' + input.value);
      input.value = '';
    }
  });
})();

// Guestbook form
(function () {
  var form = document.getElementById('guestbook-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var rsvpInput = document.getElementById('attendance-value');
    if (rsvpInput && !rsvpInput.value) {
      alert('Please let us know if you can join us by selecting an option above.');
      return;
    }
    var btn = form.querySelector('button');
    var status = document.getElementById('form-status');
    var originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate sending
    setTimeout(function () {
      btn.textContent = 'Sent with love';
      if (status) {
        status.textContent = 'Thank you for your beautiful message!';
        status.classList.add('show');
      }
      form.reset();
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        if (status) status.classList.remove('show');
      }, 3000);
    }, 1500);
  });

  // Handle RSVP buttons
  var rsvpBtns = form.querySelectorAll('.rsvp-btn');
  var rsvpInput = document.getElementById('attendance-value');
  rsvpBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      rsvpBtns.forEach(function (b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      if (rsvpInput) rsvpInput.value = btn.classList.contains('yes') ? 'yes' : 'no';
    });
  });
})();

// Hero Video & Content
(function () {
  var video = document.getElementById('hero-video');
  var content = document.getElementById('hero-content');
  if (!video || !content) return;

  function showContent() {
    content.style.opacity = '1';
    // After the fade-in transition (2s), gently scroll 120px into next section
    setTimeout(function () {
      window.scrollBy({ top: 300, behavior: 'smooth' });
    }, 2000);
  }

  video.addEventListener('ended', showContent);

  // Fallback: show after 15 seconds if video is long or stuck
  setTimeout(showContent, 15000);
})();

// Background Music Player
(function () {
  var audio     = document.getElementById('bg-music');
  var btn       = document.getElementById('music-btn');
  var iconPlay  = document.getElementById('music-icon-play');
  var iconPause = document.getElementById('music-icon-pause');
  if (!audio || !btn) return;

  var started = false;
  audio.volume = 0.4;

  function setPlayingUI() {
    btn.classList.add('playing');
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');
  }

  function setPausedUI() {
    btn.classList.remove('playing');
    iconPlay.classList.remove('hidden');
    iconPause.classList.add('hidden');
  }

  function tryPlay() {
    audio.play().then(function () {
      started = true;
      setPlayingUI();
      removeInteractionListeners();
    }).catch(function () {
      // Browser blocked autoplay — wait for first interaction
    });
  }

  function onFirstInteraction() {
    if (started) return;
    tryPlay();
  }

  function removeInteractionListeners() {
    document.removeEventListener('click',      onFirstInteraction);
    document.removeEventListener('touchstart', onFirstInteraction);
    document.removeEventListener('keydown',    onFirstInteraction);
    document.removeEventListener('scroll',     onFirstInteraction);
  }

  // Attempt autoplay immediately on page load
  tryPlay();

  // Fallback: play on first interaction if autoplay was blocked
  document.addEventListener('click',      onFirstInteraction);
  document.addEventListener('touchstart', onFirstInteraction);
  document.addEventListener('keydown',    onFirstInteraction);
  document.addEventListener('scroll',     onFirstInteraction);

  // Toggle play / pause button
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (!started && audio.paused) {
      tryPlay();
      return;
    }
    if (audio.paused) {
      audio.play();
      setPlayingUI();
    } else {
      audio.pause();
      setPausedUI();
    }
  });
})();

