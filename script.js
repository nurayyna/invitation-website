// ── GSAP setup ───────────────────────────────────────
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  if (typeof SplitText !== 'undefined') gsap.registerPlugin(SplitText);
}

// ── Remove white background from seal image ──────────

function removeWhiteBg(imgEl, threshold) {
  threshold = threshold || 235;

  function process() {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    ctx.drawImage(imgEl, 0, 0);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (r > threshold && g > threshold && b > threshold) {
          const brightness = Math.max(r, g, b);
          d[i + 3] = Math.round(255 * (1 - (brightness - threshold) / (255 - threshold)));
        }
      }

      ctx.putImageData(imageData, 0, 0);
      imgEl.src = canvas.toDataURL('image/png');
    } catch (e) {
      // Skip silently if canvas is blocked (won't happen on same origin)
    }
  }

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    process();
  } else {
    imgEl.addEventListener('load', process);
  }
}

const sealImg = document.getElementById('waxSeal');
if (sealImg) removeWhiteBg(sealImg);

// ── Remove black background from lace frame ───────────

function removeBlackBg(imgEl, threshold) {
  threshold = threshold || 40;

  function process() {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    ctx.drawImage(imgEl, 0, 0);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const brightness = Math.max(d[i], d[i + 1], d[i + 2]);
        if (brightness < threshold) {
          // Smooth fade: pure black = fully transparent, at threshold = fully opaque
          d[i + 3] = Math.round(255 * brightness / threshold);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      imgEl.src = canvas.toDataURL('image/png');
    } catch (e) {
      // Skip silently if canvas is blocked
    }
  }

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    process();
  } else {
    imgEl.addEventListener('load', process);
  }
}

const laceFrame = document.querySelector('.lace-frame');
if (laceFrame) removeBlackBg(laceFrame);


document.querySelectorAll('.lace-deco').forEach(function (el) {
  removeBlackBg(el, 60);
});


function removeNeutralBg(imgEl) {
  function process() {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = imgEl.naturalWidth;
    canvas.height = imgEl.naturalHeight;
    ctx.drawImage(imgEl, 0, 0);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const saturation = max - min;
        const brightness = max;

        if (brightness > 120 && saturation < 65) {
          const t = (brightness - 120) / (255 - 120);
          d[i + 3] = Math.round(255 * (1 - t));
        }
      }

      ctx.putImageData(imageData, 0, 0);
      imgEl.src = canvas.toDataURL('image/png');
    } catch (e) {}
  }

  if (imgEl.complete && imgEl.naturalWidth > 0) {
    process();
  } else {
    imgEl.addEventListener('load', process);
  }
}

// ── Background music ─────────────────────────────────

const bgMusic  = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');

if (bgMusic) bgMusic.volume = 0.6;

// Music is started from the intro screen "Begin" click

function toggleMusic() {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.classList.remove('muted');
    musicBtn.querySelector('.music-icon').textContent = '♪';
  } else {
    bgMusic.pause();
    musicBtn.classList.add('muted');
    musicBtn.querySelector('.music-icon').textContent = '♩';
  }
}

if (musicBtn) musicBtn.addEventListener('click', toggleMusic);

// ── Envelope entrance (called after intro screen dismisses) ──
function playEntranceAnimations() {
  if (typeof gsap === 'undefined') return;

  var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  document.querySelectorAll('.organza-drape').forEach(function (el, i) {
    tl.from(el, { opacity: 0, scale: 0.88, duration: 1.4 }, 0.1 + i * 0.2);
  });

  var eyebrowEl = document.querySelector('.envelope-eyebrow');
  if (eyebrowEl) {
    if (typeof SplitText !== 'undefined') {
      var splitEyebrow = new SplitText(eyebrowEl, { type: 'chars' });
      tl.from(splitEyebrow.chars, { opacity: 0, y: 14, stagger: 0.035, duration: 0.65 }, 0.5);
    } else {
      tl.from(eyebrowEl, { opacity: 0, y: 14, duration: 0.65 }, 0.5);
    }
  }

  var envWrapper = document.getElementById('envelope');
  if (envWrapper) {
    tl.from(envWrapper, { opacity: 0, y: 60, duration: 1.1 }, 0.25);
  }

  var coupleEl = document.querySelector('.env-couple');
  if (coupleEl) {
    if (typeof SplitText !== 'undefined') {
      var splitCouple = new SplitText(coupleEl, { type: 'chars' });
      tl.from(splitCouple.chars, { opacity: 0, y: 10, stagger: 0.04, duration: 0.6 }, 1.1);
    } else {
      tl.from(coupleEl, { opacity: 0, y: 10, duration: 0.6 }, 1.1);
    }
  }

  var envDateEl = document.querySelector('.env-wedding-date');
  if (envDateEl) tl.from(envDateEl, { opacity: 0, y: 8, duration: 0.55 }, 1.55);

  var hintEl = document.getElementById('hint');
  if (hintEl) tl.from(hintEl, { opacity: 0, duration: 0.6 }, 1.85);
}

// ── Intro screen ──────────────────────────────────────
var introScreen = document.getElementById('intro');
var introBtn    = document.getElementById('introBtn');

if (typeof gsap !== 'undefined' && introScreen) {
  document.fonts.ready.then(function () {
    var itl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    var introEyebrowEl = document.querySelector('.intro-eyebrow');
    var introNamesEl   = document.querySelector('.intro-names');
    var introRuleEl    = document.querySelector('.intro-rule');
    var introDateEl    = document.querySelector('.intro-date');

    if (introEyebrowEl) itl.from(introEyebrowEl, { opacity: 0, y: 10, duration: 0.6 }, 0.3);

    if (introNamesEl) {
      if (typeof SplitText !== 'undefined') {
        var splitIntro = new SplitText(introNamesEl, { type: 'chars' });
        itl.from(splitIntro.chars, { opacity: 0, y: 22, stagger: 0.04, duration: 0.85 }, 0.5);
      } else {
        itl.from(introNamesEl, { opacity: 0, y: 22, duration: 0.85 }, 0.5);
      }
    }

    if (introRuleEl) itl.from(introRuleEl, { scaleX: 0, transformOrigin: 'center', duration: 0.5 }, 1.0);
    if (introDateEl) itl.from(introDateEl, { opacity: 0, duration: 0.5 }, 1.2);
    // Note: introBtn is NOT animated — it stays visible so users can always see/click it
  });
}

// Whole intro screen is clickable, not just the button
if (introScreen) {
  introScreen.addEventListener('click', function () {
    // Start music — guaranteed to work after a real click
    if (bgMusic) {
      bgMusic.play().catch(function () {});
      if (musicBtn) {
        musicBtn.classList.remove('muted');
        musicBtn.querySelector('.music-icon').textContent = '♪';
      }
    }

    // Fade out intro then reveal envelope section
    if (typeof gsap !== 'undefined') {
      gsap.to(introScreen, {
        opacity: 0,
        duration: 0.9,
        ease: 'power2.inOut',
        onComplete: function () {
          introScreen.style.display = 'none';
          playEntranceAnimations();
        }
      });
    } else {
      introScreen.style.display = 'none';
    }
  });
}

// ── Scroll-triggered envelope opening ────────────────

var envelope    = document.getElementById('envelope');
var letterCard  = document.getElementById('letterCard');
var hint        = document.getElementById('hint');
var mainNav     = document.getElementById('mainNav');
var homeSection = document.getElementById('home');

if (typeof gsap !== 'undefined' && envelope) {

  // Give GSAP ownership of letter card centering from the start
  if (letterCard) gsap.set(letterCard, { xPercent: -50, yPercent: -50 });

  // Stop the CSS float animation immediately so GSAP owns the transform
  gsap.set(envelope, { scale: 1 });

  var letterContentPlayed = false;

  // ── Letter content stagger animation (fires once, non-scrubbed) ──
  function animateLetterContent() {
    var ltl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    var ornamentEl = document.querySelector('.letter-ornament');
    var lineEls    = document.querySelectorAll('.letter-line');
    var namesEl    = document.querySelector('.letter-names');
    var dateEl     = document.querySelector('.letter-date');
    var scrollHint = document.querySelector('.letter-hint');

    if (ornamentEl) ltl.from(ornamentEl, { opacity: 0, y: 10, duration: 0.45 }, 0);
    if (lineEls.length) ltl.from(lineEls, { scaleX: 0, transformOrigin: 'center', duration: 0.45, stagger: 0.15 }, 0.15);

    if (namesEl) {
      if (typeof SplitText !== 'undefined') {
        var splitNames = new SplitText(namesEl, { type: 'chars' });
        ltl.from(splitNames.chars, { opacity: 0, y: 16, stagger: 0.04, duration: 0.65 }, 0.3);
      } else {
        ltl.from(namesEl, { opacity: 0, y: 16, duration: 0.65 }, 0.3);
      }
    }
    if (dateEl)     ltl.from(dateEl,     { opacity: 0, y: 8,  duration: 0.45 }, 0.8);
    if (scrollHint) ltl.from(scrollHint, { opacity: 0,        duration: 0.45 }, 1.0);
  }

  // ── Pinned scroll timeline ────────────────────────────
  var openTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: '+=120%',        // 1.2 viewport heights of scroll space while pinned
      pin: true,
      scrub: 1.5,           // smooth lag behind scroll position
      anticipatePin: 1,
      onUpdate: function (self) {
        // Fire letter content animations once letter card is fully in
        if (!letterContentPlayed && self.progress >= 0.72) {
          letterContentPlayed = true;
          animateLetterContent();
        }
      }
    }
  });

  // Phase 1 — Instantly fade peripheral elements as scroll begins
  openTl.to(['.envelope-eyebrow', '#hint', '.env-names', '.organza-drape'],
    { opacity: 0, duration: 0.18 }, 0);

  // Phase 2 — Envelope zooms in, filling then overflowing viewport
  openTl.to(envelope, {
    scale: 7,
    duration: 0.52,
    ease: 'power2.in'
  }, 0);

  // Phase 3 — Envelope fades as it reaches maximum zoom
  openTl.to(envelope, {
    opacity: 0,
    duration: 0.22
  }, 0.46);

  // Phase 4 — Letter card rises up behind the dissolving envelope
  openTl.fromTo(letterCard,
    { opacity: 0, y: 65 },
    { opacity: 1, y: 0,  duration: 0.35 },
    0.55
  );

}

// ── Nav: show after scrolling past envelope section ───

function updateNav() {
  if (!mainNav || !homeSection) return;
  const bottom = homeSection.getBoundingClientRect().bottom;
  if (bottom <= 0) {
    mainNav.classList.add('nav-visible');
  } else {
    mainNav.classList.remove('nav-visible');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── Scroll spy: highlight active nav link ─────────────

const spySections = ['invitation', 'events', 'rsvp'];

const spyObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-links a').forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.3 });

spySections.forEach(function (id) {
  const el = document.getElementById(id);
  if (el) spyObserver.observe(el);
});

// ── Countdown timer ───────────────────────────────────

function updateCountdown() {
  const wrap = document.getElementById('countdown');
  if (!wrap) return;

  const target = new Date('2027-07-02T13:00:00');
  const now    = new Date();
  const diff   = target - now;

  if (diff <= 0) {
    wrap.innerHTML = '<p style="font-family:var(--font-serif);font-style:italic;font-size:1.5rem;color:var(--maroon);">The day has arrived!</p>';
    return;
  }

  const days    = Math.floor(diff / 864e5);
  const hours   = Math.floor((diff % 864e5) / 36e5);
  const minutes = Math.floor((diff % 36e5) / 6e4);
  const seconds = Math.floor((diff % 6e4) / 1000);

  const set = function (id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val).padStart(2, '0');
  };

  set('cd-days',    days);
  set('cd-hours',   hours);
  set('cd-minutes', minutes);
  set('cd-seconds', seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);
