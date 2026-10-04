// Footer year
document.getElementById('yr').textContent = new Date().getFullYear();

// Twinkling starfield
(function () {
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  let w, h, stars = [];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = c.width = innerWidth;
    h = c.height = innerHeight;
    stars = Array.from({ length: Math.min(160, Math.floor(w * h / 9000)) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      p: Math.random() * Math.PI * 2,
      s: Math.random() * 0.02 + 0.005
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.p += s.s;
      ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(s.p));
      ctx.fillStyle = '#F4D68A';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, 6.283);
      ctx.fill();
    }
    if (!still) requestAnimationFrame(draw);
  }

  addEventListener('resize', resize);
  resize();
  draw();
})();

// Soft light that follows the pointer
addEventListener('pointermove', e => {
  const g = document.querySelector('.glow');
  g.style.setProperty('--x', e.clientX + 'px');
  g.style.setProperty('--y', e.clientY + 'px');
});

// Tap-to-flip for touch screens
document.querySelectorAll('.card').forEach(card =>
  card.addEventListener('click', () => card.classList.toggle('flipped'))
);

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.section h2, .sub, .price, .plain, .aura, .moons').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// "Buy now" buttons open WhatsApp with a ready message
document.querySelectorAll('[data-service]').forEach(a => {
  const msg = 'I want to buy ' + a.dataset.service + ', could I have more details?';
  a.href = 'https://wa.me/917678577007?text=' + encodeURIComponent(msg);
  a.target = '_blank';
  a.rel = 'noopener';
});

// Vibration frequency player (Web Audio, generated in the browser, no audio files)
(function () {
  const dock = document.getElementById('dock');
  const play = document.getElementById('play');
  const txt = document.getElementById('playTxt');
  const chips = document.querySelectorAll('.chip');
  const ratios = [1, 2, 1.5], levels = [1, 0.25, 0.1];
  let ctx, node = null, freq = 432;

  function start() {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    ctx.resume();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.14, ctx.currentTime + 2);
    master.connect(ctx.destination);
    const oscs = ratios.map((r, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq * r; g.gain.value = levels[i];
      o.connect(g); g.connect(master); o.start();
      return o;
    });
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = 0.15; lg.gain.value = 0.03;
    lfo.connect(lg); lg.connect(master.gain); lfo.start();
    node = { master, oscs, lfo };
  }

  function stop() {
    const n = node; node = null;
    n.master.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    setTimeout(() => { n.oscs.forEach(o => o.stop()); n.lfo.stop(); }, 1500);
  }

  play.addEventListener('click', () => {
    const on = !node;
    on ? start() : stop();
    dock.classList.toggle('playing', on);
    play.setAttribute('aria-pressed', on);
    txt.textContent = on ? 'Stop' : 'Play';
  });

  chips.forEach(c => c.addEventListener('click', () => {
    freq = +c.dataset.f;
    chips.forEach(x => x.setAttribute('aria-pressed', x === c));
    if (node) node.oscs.forEach((o, i) => o.frequency.setTargetAtTime(freq * ratios[i], ctx.currentTime, 0.4));
  }));
})();
