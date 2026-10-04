// Footer year
document.getElementById('yr').textContent = new Date().getFullYear();

// Starfield: tinted twinkling stars, slow upward drift, sparkle crosses and shooting stars
(function () {
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tints = ['#F4D68A', '#FFFFFF', '#E7A3C8', '#B79CFF'];
  let w, h, stars = [], shoots = [], next = 150;

  function resize() {
    w = c.width = innerWidth;
    h = c.height = innerHeight;
    stars = Array.from({ length: Math.min(170, Math.floor(w * h / 9000)) }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 1.5 + 0.2, p: Math.random() * 6.28,
      s: Math.random() * 0.025 + 0.005, v: Math.random() * 0.12 + 0.02,
      c: tints[Math.floor(Math.random() * tints.length)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.p += s.s; s.y -= s.v;
      if (s.y < -6) { s.y = h + 6; s.x = Math.random() * w; }
      ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(s.p));
      ctx.fillStyle = s.c; ctx.strokeStyle = s.c;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      if (s.r > 1.3) {
        ctx.lineWidth = 0.6; ctx.beginPath();
        ctx.moveTo(s.x - s.r * 4, s.y); ctx.lineTo(s.x + s.r * 4, s.y);
        ctx.moveTo(s.x, s.y - s.r * 4); ctx.lineTo(s.x, s.y + s.r * 4);
        ctx.stroke();
      }
    }
    if (--next <= 0) { shoots.push({ x: w * (0.3 + Math.random() * 0.7), y: Math.random() * h * 0.4, l: 0 }); next = 220 + Math.random() * 320; }
    shoots = shoots.filter(t => t.l < 60);
    for (const t of shoots) {
      t.l++;
      const x = t.x - t.l * 9, y = t.y + t.l * 5;
      const g = ctx.createLinearGradient(x + 90, y - 50, x, y);
      g.addColorStop(0, 'rgba(244,214,138,0)');
      g.addColorStop(1, 'rgba(255,241,194,' + (1 - t.l / 60) + ')');
      ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x + 90, y - 50); ctx.lineTo(x, y); ctx.stroke();
    }
    if (!still) requestAnimationFrame(draw);
  }

  addEventListener('resize', resize);
  resize();
  draw();
})();

// Rising sparks around the healing orb
(function () {
  const en = document.querySelector('.energy');
  if (!en) return;
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('i');
    s.className = 'spark';
    s.style.setProperty('--x', 15 + Math.random() * 70 + '%');
    s.style.setProperty('--d', 4 + Math.random() * 4 + 's');
    s.style.setProperty('--l', -Math.random() * 8 + 's');
    en.appendChild(s);
  }
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
