// High performance Canvas VFX Particle & Energy Engine for Ben 10

export class ParticleEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.waves = [];
    this.mode = 'omnitrix'; // 'omnitrix' or alien particle type
    this.color = '#00ff66';
    this.accent = '#88ffaa';
    this.running = false;
    this.width = 0;
    this.height = 0;
    this.dialProgress = 0; // 0 to 1 scroll activation progress
    this.dialX = 0;
    this.dialY = 0;

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setMode(mode, color = '#00ff66', accent = '#88ffaa') {
    if (mode === this.mode && color === this.color) return;
    this.mode = mode;
    this.color = color;
    this.accent = accent;
    // Cross-fade: let the current particles fade out instead of vanishing
    this.particles.forEach(p => { p.dying = true; });
    this.initModeParticles();
  }

  setDialProgress(p, x = this.width * 0.5, y = this.height * 0.5) {
    this.dialProgress = p;
    this.dialX = x;
    this.dialY = y;
    // Emit green shockwave bursts while the dial is charging
    if (this.mode === 'omnitrix' && p > 0.45 && p < 0.9 && Math.random() < 0.1) {
      this.addShockwave(x, y, this.color);
    }
  }

  addShockwave(x, y, color) {
    if (this.waves.length > 8) return;
    this.waves.push({
      x,
      y,
      radius: 10,
      maxRadius: Math.max(this.width, this.height) * 0.7,
      color: color || this.color,
      alpha: 0.9,
      speed: 12 + Math.random() * 8
    });
  }

  initModeParticles() {
    const count = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const p = {
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.7 + 0.2,
      maxLife: Math.random() * 150 + 60,
      life: 0,
      color: this.color,
      mode: this.mode,
      dying: false,
      dyingFade: 1
    };

    switch (this.mode) {
      case 'fire':
        p.y = this.height * 0.9 + Math.random() * (this.height * 0.1);
        p.vy = -Math.random() * 3.5 - 1.5;
        p.vx = (Math.random() - 0.5) * 2;
        p.size = Math.random() * 4 + 1.5;
        p.color = Math.random() > 0.4 ? '#ff5500' : '#ffcc00';
        break;
      case 'shockwave':
        // Heavy embers drifting up from impacts
        p.y = this.height * 0.8 + Math.random() * this.height * 0.2;
        p.vy = -Math.random() * 1.6 - 0.4;
        p.vx = (Math.random() - 0.5) * 0.8;
        p.size = Math.random() * 3 + 2;
        p.color = Math.random() > 0.5 ? this.color : this.accent;
        break;
      case 'speed':
        p.vx = -Math.random() * 8 - 4;
        p.vy = (Math.random() - 0.5) * 0.8;
        p.size = Math.random() * 2 + 1;
        p.color = Math.random() > 0.3 ? '#00c3ff' : '#ffffff';
        break;
      case 'tech':
        p.vx = 0;
        p.vy = Math.random() * 3 + 1.5;
        p.size = Math.random() * 2.5 + 1;
        p.color = '#00ff66';
        break;
      case 'crystal':
        p.vx = (Math.random() - 0.5) * 1.2;
        p.vy = (Math.random() - 0.5) * 1.2;
        p.rot = Math.random() * Math.PI * 2;
        p.rotSpeed = (Math.random() - 0.5) * 0.05;
        p.color = '#00e5a3';
        break;
      case 'spore':
        // Slow, wandering motes
        p.vx = (Math.random() - 0.5) * 0.6;
        p.vy = (Math.random() - 0.5) * 0.6;
        p.wobble = Math.random() * Math.PI * 2;
        p.maxLife = Math.random() * 220 + 120;
        p.color = Math.random() > 0.5 ? this.color : this.accent;
        break;
      case 'kinetic': {
        // Bursting outward from the center of the screen
        const a = Math.random() * Math.PI * 2;
        const v = Math.random() * 2.5 + 1;
        p.x = this.width * 0.5 + Math.cos(a) * 40;
        p.y = this.height * 0.5 + Math.sin(a) * 40;
        p.vx = Math.cos(a) * v;
        p.vy = Math.sin(a) * v;
        p.color = Math.random() > 0.4 ? this.color : this.accent;
        break;
      }
      case 'dna':
        // Rising helix strands
        p.baseX = Math.random() * this.width;
        p.y = this.height + Math.random() * 40;
        p.vy = -Math.random() * 1.2 - 0.6;
        p.vx = 0;
        p.phase = Math.random() * Math.PI * 2;
        p.size = Math.random() * 2 + 1;
        p.maxLife = Math.random() * 300 + 200;
        p.color = Math.random() > 0.5 ? this.color : this.accent;
        break;
      case 'acid':
        // Falling droplets
        p.y = -Math.random() * 40;
        p.vy = Math.random() * 2.5 + 1;
        p.vx = (Math.random() - 0.5) * 0.4;
        p.size = Math.random() * 2.5 + 1.5;
        p.maxLife = Math.random() * 250 + 150;
        p.color = Math.random() > 0.3 ? this.accent : this.color;
        break;
      case 'abyss':
        p.y = this.height + Math.random() * 20;
        p.vy = -Math.random() * 1.8 - 0.5;
        p.vx = Math.sin(Math.random() * Math.PI) * 0.8;
        p.size = Math.random() * 5 + 2;
        p.color = 'rgba(0, 200, 255, 0.4)';
        break;
    }

    return p;
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.initModeParticles();
      requestAnimationFrame(this.loop);
    }
  }

  stop() {
    this.running = false;
  }

  loop() {
    if (!this.running) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Render waves
    for (let i = this.waves.length - 1; i >= 0; i--) {
      const w = this.waves[i];
      w.radius += w.speed;
      w.alpha *= 0.94;
      if (w.alpha < 0.01 || w.radius > w.maxRadius) {
        this.waves.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.strokeStyle = w.color;
      ctx.globalAlpha = w.alpha;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = w.color;
      ctx.stroke();
      ctx.restore();
    }

    // Render particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.mode === 'spore') {
        p.wobble += 0.03;
        p.x += p.vx + Math.sin(p.wobble) * 0.4;
        p.y += p.vy + Math.cos(p.wobble * 0.8) * 0.3;
      } else if (p.mode === 'dna') {
        p.y += p.vy;
        p.x = p.baseX + Math.sin(p.y * 0.02 + p.phase) * 24;
      } else {
        p.x += p.vx;
        p.y += p.vy;
      }
      p.life++;

      if (p.dying) {
        p.dyingFade -= 0.035;
        if (p.dyingFade <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
      }

      if (p.life > p.maxLife || p.x < -40 || p.x > this.width + 40 || p.y < -40 || p.y > this.height + 40) {
        if (p.dying) {
          this.particles.splice(i, 1);
        } else {
          this.particles[i] = this.createParticle();
        }
        continue;
      }

      const fade = Math.sin((p.life / p.maxLife) * Math.PI) * p.dyingFade;
      const alpha = p.alpha * fade;
      ctx.globalAlpha = alpha;

      if (p.mode === 'speed') {
        // Streaks
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 6, p.y);
        ctx.stroke();
      } else if (p.mode === 'crystal') {
        // Diamond shapes
        p.rot += p.rotSpeed;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 2);
        ctx.lineTo(p.size, 0);
        ctx.lineTo(0, p.size * 2);
        ctx.lineTo(-p.size, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (p.mode === 'acid') {
        // Elongated droplets
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 3, p.y - p.vy * 3);
        ctx.stroke();
      } else {
        // Glowing orbs: soft halo + bright core (much cheaper than shadowBlur)
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // Extra Omnitrix activation high-energy aura in opening mode
    if (this.mode === 'omnitrix' && this.dialProgress > 0.2) {
      ctx.save();
      const cx = this.dialX;
      const cy = this.dialY;
      const glowGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 250 * this.dialProgress);
      glowGrad.addColorStop(0, `rgba(0, 255, 102, ${0.4 * this.dialProgress})`);
      glowGrad.addColorStop(0.5, `rgba(0, 255, 102, ${0.15 * this.dialProgress})`);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }

    requestAnimationFrame(this.loop);
  }
}
