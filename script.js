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

// ── Background music ─────────────────────────────────

const bgMusic  = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');

if (bgMusic) bgMusic.volume = 0.6;

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

// ── Envelope opening animation ───────────────────────

// Lock scroll until the envelope is opened
document.documentElement.style.overflow = 'hidden';

const envelope    = document.getElementById('envelope');
const letterCard  = document.getElementById('letterCard');
const hint        = document.getElementById('hint');
const mainNav     = document.getElementById('mainNav');
const homeSection = document.getElementById('home');

if (envelope) {
  envelope.addEventListener('click', openEnvelope);
}

function openEnvelope() {
  if (envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  if (hint) hint.classList.add('hidden');

  if (bgMusic) bgMusic.play().catch(function () {});

  setTimeout(function () {
    if (letterCard) letterCard.classList.add('visible');
    document.documentElement.style.overflow = '';
  }, 700);
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
