// ── Topographic contour background ──────────────────────────────────
// One deliberate hero moment: a slowly drifting field of contour lines,
// generated from layered noise, evoking an elevation/terrain map.
(function () {
  const canvas = document.getElementById('contours');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  let w, h, t = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // Simple layered sine field standing in for elevation noise —
  // cheap to compute, no dependencies, reads as topography at this scale.
  function elevation(x, y, t) {
    return (
      Math.sin(x * 0.004 + t * 0.05) * Math.cos(y * 0.004 - t * 0.03) +
      Math.sin(x * 0.011 - y * 0.006 + t * 0.02) * 0.5
    );
  }

  const levels = 14;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#8FBC8F';
    ctx.lineWidth = 1;

    const step = 10;
    for (let lvl = 0; lvl < levels; lvl++) {
      const threshold = (lvl / levels) * 2 - 1;
      ctx.globalAlpha = 0.10 + (lvl / levels) * 0.12;
      ctx.beginPath();
      for (let x = 0; x < w; x += step) {
        let started = false;
        for (let y = 0; y < h; y += step) {
          const e = elevation(x, y, t);
          if (Math.abs(e - threshold) < 0.02) {
            if (!started) { ctx.moveTo(x, y); started = true; }
            else ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }

    t += 1;
    requestAnimationFrame(draw);
  }

  draw();
})();

// ── Visitor field log ────────────────────────────────────────────────
// Uses a public, no-signup counting API (CountAPI-compatible). The key
// is unique to this site to avoid colliding with anyone else's counter.
(function () {
  const el = document.getElementById('visitor-log');
  if (!el) return;

  fetch('https://countapi.mileshilliard.com/api/v1/hit/williams-adaji-agbane-portfolio')
    .then((res) => res.json())
    .then((data) => {
      const n = data.value;
      el.textContent = `Visitor No. ${String(n).padStart(6, '0')}. Welcome to the field log.`;
    })
    .catch(() => {
      el.textContent = 'Welcome to the field log.';
    });
})();