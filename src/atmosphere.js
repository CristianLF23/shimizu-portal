// Small, self-contained 2D layer for the quiet waterline of the hero scene.
// The caller owns the canvas position and reduced-motion policy.
export class AtelierAtmosphere {
  constructor(canvas, scene) {
    this.canvas = canvas;
    this.scene = scene || canvas?.parentElement || null;
    this.ctx = canvas?.getContext?.('2d', { alpha: true }) || null;
    this.enabled = true;
    this.running = false;
    this.frame = 0;
    this.time = 0;
    this.last = 0;
    this.lastDraw = -Infinity;
    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.mobile = typeof matchMedia === 'function' && matchMedia('(max-width: 600px)');
    this.ripples = [];
    this.flecks = [];
    this.mist = [];

    // Fixed seeds keep the first frame composed and repeatable across visits.
    const rippleSeeds = [
      [.14, .80,  .03, 1.00,  .02, 0],
      [.38, .88,  .08, .84, -.01, 1],
      [.62, .76, -.04, .72,  .015, 0],
      [.83, .91,  .02, .94, -.018, 1],
      [.27, .96,  .12, .57,  .01,  1]
    ];
    for (const [x, y, drift, opacity, speed, tone] of rippleSeeds) {
      this.ripples.push({ x, y, drift, opacity, speed, tone, radius: .12 + ((x * 17) % 1) * .22, phase: (x + y) * 4.3 });
    }
    for (let i = 0; i < 18; i++) {
      this.mist.push({
        x: (i * .173) % 1,
        y: .745 + (i % 6) * .035,
        length: .08 + (i % 5) * .027,
        phase: i * 1.71,
        depth: .35 + (i % 4) * .16,
        speed: .08 + (i % 3) * .025
      });
    }

    this._tick = this._tick.bind(this);
    this._onVisibility = () => this._sync();
    this._onPointer = (event) => {
      if (!this.canvas || event.pointerType === 'mouse') return;
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (y >= rect.height * .70) this.burst(x, y);
      else this.burst(x, y, true);
    };
    this._onResize = () => this.resize();
    this.canvas?.addEventListener('pointerdown', this._onPointer, { passive: true });
    document.addEventListener('visibilitychange', this._onVisibility);
    if (typeof ResizeObserver === 'function' && this.canvas) {
      this._observer = new ResizeObserver(this._onResize);
      this._observer.observe(this.canvas);
    } else {
      window.addEventListener('resize', this._onResize, { passive: true });
    }
    this.resize();
    this._draw();
    this._sync();
  }

  resize() {
    if (!this.canvas || !this.ctx) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = Math.max(1, rect.width || this.canvas.clientWidth || 1);
    this.height = Math.max(1, rect.height || this.canvas.clientHeight || 1);
    this.dpr = Math.min(typeof devicePixelRatio === 'number' ? devicePixelRatio : 1, 1.5);
    const pixelWidth = Math.ceil(this.width * this.dpr);
    const pixelHeight = Math.ceil(this.height * this.dpr);
    if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
      this.canvas.width = pixelWidth;
      this.canvas.height = pixelHeight;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this._draw();
    }
  }

  setEnabled(value) {
    this.enabled = Boolean(value);
    this._sync();
  }

  burst(x, y, falling = false) {
    if (!this.width || !this.height) this.resize();
    const nx = Math.max(0, Math.min(1, Number(x) / this.width));
    const ny = Math.max(0, Math.min(1, Number(y) / this.height));
    if (falling) {
      for (let i = 0; i < 5; i++) this.flecks.push({
        x: nx + (i - 2) * .012,
        y: ny + (i % 2) * .015,
        vx: (i - 2) * .018,
        vy: .035 + (i % 3) * .012,
        life: 1,
        size: 1.2 + (i % 3) * .65,
        tone: i % 2
      });
      this.flecks.splice(32);
      return;
    }
    this.ripples.push({ x: nx, y: Math.max(.72, ny), drift: 0, opacity: .95, speed: .34, tone: 0, radius: .01, phase: 0, pulse: true });
    if (this.enabled && !document.hidden && !this.running) this._sync();
  }

  _sync() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.running = false;
    this.last = 0;
    if (this.enabled && !document.hidden) {
      this.running = true;
      this.frame = requestAnimationFrame(this._tick);
    }
  }

  _tick(now) {
    this.frame = 0;
    if (!this.enabled || document.hidden) {
      this.running = false;
      return;
    }
    const dt = this.last ? Math.min((now - this.last) / 1000, .05) : 1 / 60;
    this.last = now;
    this.time += dt;
    for (const ripple of this.ripples) if (ripple.pulse) ripple.radius += ripple.speed * dt;
    this.ripples = this.ripples.filter(ripple => !ripple.pulse || ripple.radius <= .9);
    const drawInterval = this.mobile?.matches ? 33 : 16;
    if (now - this.lastDraw >= drawInterval) {
      this._draw();
      this.lastDraw = now;
    }
    this.frame = requestAnimationFrame(this._tick);
  }

  _draw() {
    if (!this.ctx || !this.width || !this.height) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const t = this.time;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Low, broken mist strokes stay close to the waterline and avoid a foggy overlay.
    for (const m of this.mist) {
      const x = ((m.x + t * m.speed * .006) % 1) * w;
      const y = (m.y + Math.sin(t * .22 + m.phase) * .006) * h;
      const length = m.length * w;
      ctx.beginPath();
      ctx.moveTo(x - length * .5, y);
      ctx.bezierCurveTo(x - length * .18, y - 2, x + length * .15, y + 2, x + length * .5, y - 1);
      ctx.strokeStyle = `rgba(232,224,203,${(.055 + m.depth * .045).toFixed(3)})`;
      ctx.lineWidth = .6 + m.depth * .55;
      ctx.stroke();
    }

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      const age = r.pulse ? r.radius : (r.radius + t * r.speed) % 1.1;
      const fade = r.pulse ? Math.max(0, 1 - (age - .01) / .86) : Math.max(0, 1 - age / 1.1);
      if (r.pulse && age > .9) { this.ripples.splice(i, 1); continue; }
      const x = (r.x + Math.sin(t * .12 + r.phase) * .012 + r.drift * .01) * w;
      const y = Math.max(.72, r.y) * h;
      const rx = w * (.035 + age * .20);
      const ry = Math.max(2, rx * .10);
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = r.tone ? `rgba(183,72,44,${(.10 * fade * r.opacity).toFixed(3)})` : `rgba(235,224,198,${(.15 * fade * r.opacity).toFixed(3)})`;
      ctx.lineWidth = r.pulse ? 1 : .7;
      ctx.stroke();
      if (r.pulse && age > .2) {
        ctx.beginPath();
        ctx.ellipse(x, y + 1, rx * .63, ry * .78, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(183,72,44,${(.08 * fade).toFixed(3)})`;
        ctx.stroke();
      }
    }

    for (let i = this.flecks.length - 1; i >= 0; i--) {
      const f = this.flecks[i];
      f.x += f.vx * (this.mobile?.matches ? .7 : 1);
      f.y += f.vy;
      f.life -= .018;
      if (f.life <= 0 || f.y > 1.1) { this.flecks.splice(i, 1); continue; }
      ctx.fillStyle = f.tone ? `rgba(177,67,42,${(.48 * f.life).toFixed(3)})` : `rgba(235,224,198,${(.52 * f.life).toFixed(3)})`;
      ctx.beginPath();
      ctx.ellipse(f.x * w, f.y * h, f.size, f.size * 1.7, -.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  destroy() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.running = false;
    this.canvas?.removeEventListener('pointerdown', this._onPointer);
    document.removeEventListener('visibilitychange', this._onVisibility);
    this._observer?.disconnect();
    if (!this._observer) window.removeEventListener('resize', this._onResize);
    this.ripples.length = 0;
    this.flecks.length = 0;
    this.mist.length = 0;
  }
}
