(() => {
  const canvas = document.getElementById("sparkle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  let w = 0, h = 0;

  function resize() {
    w = Math.floor(window.innerWidth);
    h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  // Sparkle particles
  const sparkles = [];
  const MAX = 200;            // increase for more glitter, but don't go insane
  const SPAWN_RATE = 2.2;     

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeSparkle() {
    const size = rand(1.2, 6.5);
    return {
      x: rand(0, w),
      y: rand(-20, -5),
      r: size,
      vy: rand(0.6, 2.0),          // fall speed
      vx: rand(-0.35, 0.35),       // drift
      tw: rand(0, Math.PI * 2),    // twinkle phase
      tws: rand(0.03, 0.09),       // twinkle speed
      rot: rand(0, Math.PI * 2),
      rots: rand(-0.04, 0.04),
      life: rand(240, 520),        
      kind: Math.random() < 0.55 ? "star" : "dot"
    };
  }

  function drawStar(x, y, r, rot, alpha) {
    // 4-point twinkle star (cheap + cute)
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.globalAlpha = alpha;

    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r * 0.35, -r * 0.35);
    ctx.lineTo(r, 0);
    ctx.lineTo(r * 0.35, r * 0.35);
    ctx.lineTo(0, r);
    ctx.lineTo(-r * 0.35, r * 0.35);
    ctx.lineTo(-r, 0);
    ctx.lineTo(-r * 0.35, -r * 0.35);
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.fill();

    // tiny glow
    ctx.globalAlpha = alpha * 0.35;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.stroke();

    ctx.restore();
  }

  function drawDot(x, y, r, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "pink";
    ctx.fill();
    ctx.restore();
  }

  // Fill initial sparkles
  for (let i = 0; i < Math.floor(MAX * 0.75); i++) {
    const s = makeSparkle();
    s.y = rand(0, h);
    sparkles.push(s);
  }

  let spawnAccumulator = 0;

  function tick() {
    // Clear with transparency for crisp movement
    ctx.clearRect(0, 0, w, h);

    // Spawn
    spawnAccumulator += SPAWN_RATE;
    while (spawnAccumulator >= 1 && sparkles.length < MAX) {
      sparkles.push(makeSparkle());
      spawnAccumulator -= 1;
    }

    // Update + draw
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const s = sparkles[i];

      s.x += s.vx;
      s.y += s.vy;
      s.tw += s.tws;
      s.rot += s.rots;
      s.life -= 1;

      // Wrap drift a bit
      if (s.x < -20) s.x = w + 20;
      if (s.x > w + 20) s.x = -20;

      const alpha = 0.25 + 0.7 * (0.5 + 0.5 * Math.sin(s.tw));

      if (s.kind === "star") drawStar(s.x, s.y, s.r, s.rot, alpha);
      else drawDot(s.x, s.y, s.r * 0.65, alpha);

      // Remove if dead
      if (s.y > h + 40 || s.life <= 0) {
        sparkles.splice(i, 1);
      }
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (media?.matches) {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) drawDot(rand(0, w), rand(0, h), rand(0.8, 1.8), 0.25);
  }
})();
