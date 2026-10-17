// BEN 10 — OMNITRIX EXPERIENCE MAIN INTERACTION CONTROLLER

import { ALIENS_DATA } from './aliensData.js';
import { ParticleEngine } from './particles.js';
import { audioEngine } from './audio.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize Particle VFX Canvas
const canvas = document.getElementById('vfx-canvas');
const particleEngine = new ParticleEngine(canvas);
particleEngine.start();

// Current active alien index (-1 while still in the hero intro)
let currentAlienIndex = -1;
let hasShownDial = false;
let hasOpenedDial = false;
let isAutoScrolling = false;
let heroST = null; // the intro's ScrollTrigger (its end is where the alien stage takes over)

// Intro: Ben (frame_01) on the right; where his Omnitrix is in the frame (fractions)
const BEN_WATCH = { x: 0.70, y: 0.53 };
// Intro-timeline time of the flash cut from Ben to the big Omnitrix
const WATCH_CUT = 0.2;

// Live faceplate (index.html #omni-face-live). Pattern units: face radius = 88 (drawn scaled
// down to the watch face, radius 58 of the 100-unit dial).
// In the pattern's own frame (rotated 45deg) two green corner blocks meet at +/-q:
//   q < 0  they overlap  -> hourglass (closed Omnitrix)
//   q = 0  corners touch -> cross
//   q > 0  they part     -> the square between them grows; at Q_OPEN the corner blocks have
//                           left the face and only the diamond remains
const Q_CLOSED = -11;
const Q_OPEN = 63;
const FACE_FAR = 140; // well outside the face circle
const faceA = document.querySelectorAll('.omni-p-a');
const faceB = document.querySelectorAll('.omni-p-b');
const faceSq = document.querySelectorAll('.omni-p-sq');
// Opening keyframes on the intro timeline (timeline time): hourglass -> cross, then -> diamond
const FACE_TO_CROSS = { start: 0.42, end: 0.52, ease: gsap.parseEase('power1.inOut') };
const FACE_TO_DIAMOND = { start: 0.55, end: 0.68, ease: gsap.parseEase('power2.out') };

// q at a given intro-timeline time. Derived from the time (not tweened) so the face can never
// fall out of sync with the timeline, e.g. after ScrollTrigger re-renders it on refresh.
function faceQAt(t) {
  const k = (seg) => seg.ease(gsap.utils.clamp(0, 1, (t - seg.start) / (seg.end - seg.start)));
  if (t < FACE_TO_DIAMOND.start) return Q_CLOSED + (0 - Q_CLOSED) * k(FACE_TO_CROSS);
  return Q_OPEN * k(FACE_TO_DIAMOND);
}

function drawFace(q = Q_CLOSED) {
  const R = FACE_FAR;
  const pts = (arr) => arr.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const a = pts([[-R, -R], [-q, -R], [-q, -q], [-R, -q]]);
  const b = pts([[q, q], [R, q], [R, R], [q, R]]);
  const sq = q > 0 ? pts([[-q, -q], [q, -q], [q, q], [-q, q]]) : '0,0 0,0 0,0 0,0';
  faceA.forEach(el => el.setAttribute('points', a));
  faceB.forEach(el => el.setAttribute('points', b));
  faceSq.forEach(el => el.setAttribute('points', sq));
}
const DIAL_STEP = 360 / ALIENS_DATA.length;

// DOM Elements
const dialModal = document.getElementById('dial-modal');
const dialModalBackdrop = document.getElementById('dial-modal-backdrop');
const modalCloseBtn = document.getElementById('modal-close-btn');
const orbitingSlots = document.getElementById('orbiting-alien-slots');
const wheelCore = document.getElementById('wheel-core');
const wheelCoreImg = document.getElementById('wheel-core-img');

const heroStoryPin = document.getElementById('hero-story-pin');
const introPanel = document.getElementById('intro-panel');
const introBen = introPanel.querySelector('.intro-frame');
const introFlash = document.getElementById('intro-flash');
const openingHeroText = document.getElementById('opening-hero-text');
const scrollCue = document.getElementById('scroll-cue');
const transformFlash = document.getElementById('transformation-flash');

const omniMacroLayer = document.getElementById('omnitrix-macro-layer');
const omniDevice = document.getElementById('omnitrix-device-container');
const omniChassis = document.getElementById('omnitrix-chassis');
const silhouetteWrap = document.getElementById('select-silhouette-wrap');
const omniGlowShape = document.getElementById('omni-live-glow-shape');
const selectRing = document.getElementById('select-ring');
const selectSilhouette = document.getElementById('select-silhouette');
const dialRotator = document.getElementById('dial-rotator-overlay');
const omniGlowCore = document.getElementById('omni-glow-core');
const holoEmitter = document.getElementById('hologram-emitter');
const pistonLeft = document.getElementById('piston-left');
const pistonRight = document.getElementById('piston-right');

const aliensListContainer = document.getElementById('aliens-list');
const alienNodesCarousel = document.getElementById('alien-nodes-carousel');
const prevAlienBtn = document.getElementById('prev-alien-btn');
const nextAlienBtn = document.getElementById('next-alien-btn');
const currentAlienNum = document.getElementById('current-alien-num');
const stickyNav = document.getElementById('alien-sticky-nav');

// ==============================================================
// 1. RENDER ALIEN SHOWCASE PAGES & NAVIGATION
// ==============================================================
function renderAliens() {
  aliensListContainer.innerHTML = '';
  alienNodesCarousel.innerHTML = '';

  const statKeys = [
    { key: 'strength', label: 'STRENGTH' },
    { key: 'speed', label: 'SPEED' },
    { key: 'durability', label: 'DURABILITY' },
    { key: 'energy', label: 'ENERGY' },
    { key: 'intellect', label: 'INTELLECT' }
  ];

  ALIENS_DATA.forEach((alien, index) => {
    const pageEl = document.createElement('section');
    pageEl.className = 'alien-showcase-page';
    pageEl.id = `alien-section-${alien.id}`;
    pageEl.setAttribute('data-index', index);
    pageEl.setAttribute('aria-label', `${alien.name} Showcase`);

    const statsHtml = statKeys.map(s => {
      const val = alien.stats[s.key] || 50;
      return `
        <div class="stat-row">
          <span class="stat-name">${s.label}</span>
          <div class="stat-bar-track">
            <div class="stat-bar-fill" style="background: ${alien.themeColor}; color: ${alien.accentColor};" data-target-width="${val}%"></div>
          </div>
          <span class="stat-value">${val}</span>
        </div>
      `;
    }).join('');

    const powersHtml = alien.powers.map(p => `
      <div class="power-tag" style="border-color: ${alien.themeColor}44">
        <span>${p}</span>
      </div>
    `).join('');

    pageEl.innerHTML = `
      <div class="alien-bg-aura" style="background: ${alien.bgHaze};"></div>

      <div class="alien-content-grid">
        <!-- Left: space reserved for the docked Omnitrix dial -->
        <div class="dial-dock-spacer" aria-hidden="true"></div>

        <!-- Right: Photo + Canonical Lore & Combat Data -->
        <div class="alien-data-column">
          <div class="alien-meta-header">
            <span class="alien-index-pill" style="color: ${alien.accentColor}; border-color: ${alien.themeColor}; background: ${alien.themeColor}22;">
              ALIEN ${alien.number}
            </span>
            <span class="alien-species-label">${alien.species.toUpperCase()} // ${alien.homePlanet.toUpperCase()}</span>
          </div>

          <h2 class="alien-name-title" style="color: #ffffff; text-shadow: 0 0 25px ${alien.themeColor}aa;">
            ${alien.name}
          </h2>

          <div class="alien-hero-row">
            <div class="alien-visual-column">
              <div class="alien-poster-frame" style="background: radial-gradient(circle at 50% 45%, ${alien.themeColor}40 0%, ${alien.themeColor}10 45%, rgba(5, 8, 5, 0.96) 75%); box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 45px ${alien.glowColor}; border-color: ${alien.themeColor}55;">
                <img src="${alien.image}" alt="${alien.name} character artwork" class="alien-character-img" decoding="async" style="filter: drop-shadow(0 0 22px ${alien.glowColor});">
                <div class="alien-frame-overlay"></div>
                <div class="alien-dna-hologram-tag" style="border-color: ${alien.themeColor}88;">
                  <span class="tag-badge" style="color: ${alien.accentColor};">${alien.badge}</span>
                  <span class="tag-status">DNA LOCKED</span>
                </div>
              </div>
            </div>

            <div class="alien-side-stack">
            <div class="alien-details-box" style="border-color: ${alien.themeColor}44;">
              <div class="detail-item">
                <span class="detail-label">SPECIES</span>
                <span class="detail-val" style="color: ${alien.accentColor};">${alien.species}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">HOME PLANET</span>
                <span class="detail-val">${alien.homePlanet}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">OMNITRIX CODE</span>
                <span class="detail-val" style="color: var(--omni-green);">${alien.badge}</span>
              </div>
              <span class="alien-quote-pill" style="border-color: ${alien.themeColor};">${alien.voiceQuote}</span>
            </div>

            <div class="stats-matrix" style="border-color: ${alien.themeColor}33;">
              <span class="stats-matrix-title">GALVAN COMBAT PERFORMANCE MATRIX</span>
              ${statsHtml}
            </div>
            </div>
          </div>

          <p class="alien-description-text">
            ${alien.description}
          </p>

          <div class="powers-container">
            <span class="powers-heading" style="color: ${alien.accentColor};">SIGNATURE ABILITIES & POWERS</span>
            <div class="powers-tags-wrap">
              ${powersHtml}
            </div>
          </div>

          <div class="alien-action-footer">
            <button class="transform-now-btn" data-transform-index="${index}" style="background: ${alien.themeColor}; box-shadow: 0 0 25px ${alien.glowColor};">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>ENGAGE ${alien.name}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    aliensListContainer.appendChild(pageEl);

    // Sticky Nav Node
    const nodeBtn = document.createElement('button');
    nodeBtn.className = 'alien-nav-node';
    nodeBtn.setAttribute('data-target-index', index);
    nodeBtn.setAttribute('title', alien.name);
    nodeBtn.setAttribute('aria-label', `Navigate to ${alien.name}`);
    nodeBtn.innerText = alien.number;
    nodeBtn.addEventListener('click', () => scrollToAlien(index));
    alienNodesCarousel.appendChild(nodeBtn);
  });

  document.querySelectorAll('.transform-now-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      triggerAlienTransform(parseInt(btn.getAttribute('data-transform-index'), 10));
    });
  });
}

// Render Orbiting Dial Selector in Modal
function renderModalDial() {
  orbitingSlots.innerHTML = '';
  const total = ALIENS_DATA.length;
  const radius = window.innerWidth < 600 ? 120 : 160;

  ALIENS_DATA.forEach((alien, idx) => {
    const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const slotBtn = document.createElement('button');
    slotBtn.className = 'orbit-slot-btn';
    slotBtn.style.left = `calc(50% + ${x}px)`;
    slotBtn.style.top = `calc(50% + ${y}px)`;
    slotBtn.style.borderColor = alien.themeColor;
    slotBtn.innerText = alien.number;
    slotBtn.setAttribute('title', alien.name);

    slotBtn.addEventListener('click', () => {
      audioEngine.playDialClick();
      closeModal();
      scrollToAlien(idx);
    });

    orbitingSlots.appendChild(slotBtn);
  });
}

// ==============================================================
// 2. OMNITRIX DIAL: SILHOUETTE + DOCK POSITION
// ==============================================================
function setSilhouette(idx) {
  const url = `url("${ALIENS_DATA[idx].image}")`;
  selectSilhouette.style.webkitMaskImage = url;
  selectSilhouette.style.maskImage = url;
}

// Turn the dial to an alien: ring clicks round, silhouette swaps
let silhouetteSwap = null;
function turnDialTo(idx, animate = true) {
  // Cancel any in-flight swap so its pending silhouette change can't land late
  if (silhouetteSwap) silhouetteSwap.kill();
  if (!animate) {
    gsap.killTweensOf(selectRing);
    gsap.set(selectRing, { rotation: idx * DIAL_STEP });
    gsap.set(selectSilhouette, { scale: 1, opacity: 1 });
    setSilhouette(idx);
    return;
  }
  gsap.to(selectRing, { rotation: idx * DIAL_STEP, duration: 0.5, ease: 'back.out(2)', overwrite: true });
  silhouetteSwap = gsap.timeline()
    .to(selectSilhouette, { scale: 0.6, opacity: 0, duration: 0.14, ease: 'power2.in' })
    .call(() => setSilhouette(idx))
    .to(selectSilhouette, { scale: 1, opacity: 1, duration: 0.32, ease: 'back.out(2)' });
}

// Where the dial rests during the alien showcase, relative to the viewport centre
function getDock() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dial = omniDevice.offsetWidth;
  if (w < 900) {
    // Small watch docked in the bottom-right corner
    const size = Math.min(110, w * 0.28);
    return { x: w / 2 - size / 2 - 16, y: h / 2 - size / 2 - 16, scale: size / dial };
  }
  // Centre of the reserved left column, below the sticky nav
  const spacer = document.querySelector('.dial-dock-spacer');
  const r = spacer.getBoundingClientRect();
  const navH = stickyNav.offsetHeight;
  // The face is ~58% of the watch, so the watch docks a little larger than the old bare dial
  const size = Math.min(r.width * 0.95, (h - navH) * 0.74, 520);
  return { x: r.left + r.width / 2 - w / 2, y: navH / 2, scale: size / dial };
}

function dialScreenCenter() {
  return {
    x: window.innerWidth / 2 + gsap.getProperty(omniMacroLayer, 'x'),
    y: window.innerHeight / 2 + gsap.getProperty(omniMacroLayer, 'y')
  };
}

// ==============================================================
// 3. GSAP SCROLL STORYTELLING TIMELINE (HERO)
// ==============================================================

// Ben's Omnitrix on screen while he is still the portrait on the right
function benWatchOnScreen() {
  return {
    x: introPanel.offsetLeft + BEN_WATCH.x * introPanel.offsetWidth,
    y: introPanel.offsetTop + BEN_WATCH.y * introPanel.offsetHeight
  };
}

function returnToHero() {
  if (currentAlienIndex !== -1) undockWatch();
  currentAlienIndex = -1;
  particleEngine.setMode('omnitrix', '#00ff66', '#88ffaa');
  turnDialTo(0, false);
  document.querySelectorAll('.alien-nav-node').forEach(node => {
    node.classList.remove('active');
    node.style.background = '';
    node.style.boxShadow = '';
  });
}

function initHeroScrollAnimation() {
  drawFace();
  gsap.set(selectRing, { svgOrigin: '0 0' }); // dial ring turns around the watch centre

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: heroStoryPin,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const t = tl.time();

        // Energy aura: on Ben's wrist, then on the watch
        if (t < WATCH_CUT) {
          const w = benWatchOnScreen();
          particleEngine.setDialProgress(Math.min(self.progress * 3, 0.8), w.x, w.y);
        } else {
          const c = dialScreenCenter();
          particleEngine.setDialProgress(0.8, c.x, c.y);
        }

        if (!hasShownDial && t > WATCH_CUT) {
          hasShownDial = true;
          audioEngine.playHolo();
        } else if (hasShownDial && t < WATCH_CUT - 0.05) {
          hasShownDial = false;
        }

        if (!hasOpenedDial && t > FACE_TO_CROSS.start) {
          hasOpenedDial = true;
          audioEngine.playActivate();
        } else if (hasOpenedDial && t < FACE_TO_CROSS.start - 0.08) {
          hasOpenedDial = false;
        }

        // (Returning to the intro from the aliens is handled where the page actually leaves
        // the alien section — see the stage's entry/gate triggers. Not here: this callback
        // also fires mid-refresh, while ScrollTrigger temporarily moves the scroll to measure.)
      }
    }
  });

  heroST = tl.scrollTrigger;

  // Redraw the live face whenever the timeline renders, and after every refresh
  const syncFace = () => drawFace(faceQAt(tl.time()));
  tl.eventCallback('onUpdate', syncFace);
  ScrollTrigger.addEventListener('refresh', syncFace);

  // Phase 1: Title out
  tl.to(openingHeroText, { opacity: 0, y: -40, duration: 0.06, ease: 'power2.out' }, 0);
  tl.to(scrollCue, { opacity: 0, scale: 0.8, duration: 0.04, ease: 'power2.out' }, 0);

  // Phase 2: Flash cut from Ben to the Omnitrix. The light bursts from Ben's wrist, the shot
  // jumps at its peak to the big watch (closed: hourglass), which settles into place.
  tl.set(introFlash, {
    '--fx': () => `${(benWatchOnScreen().x / window.innerWidth) * 100}%`,
    '--fy': () => `${(benWatchOnScreen().y / window.innerHeight) * 100}%`
  }, 0);
  tl.fromTo(introFlash, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: 'power2.in', immediateRender: false }, WATCH_CUT - 0.05);
  tl.to(introBen, { scale: 1.06, duration: 0.05, ease: 'power1.in' }, WATCH_CUT - 0.05);
  tl.set(introPanel, { opacity: 0 }, WATCH_CUT);
  tl.set(introFlash, { '--fx': '50%', '--fy': '50%' }, WATCH_CUT);
  tl.set(omniMacroLayer, { opacity: 1, x: 0, y: 0, scale: 1.25 }, WATCH_CUT);
  tl.to(omniMacroLayer, { scale: 1, duration: 0.08, ease: 'power2.out' }, WATCH_CUT);
  tl.to(introFlash, { opacity: 0, duration: 0.08, ease: 'power2.out' }, WATCH_CUT);

  tl.to(dialRotator, { rotation: 180, duration: 0.1, ease: 'power2.inOut' }, 0.22);
  tl.fromTo(omniGlowCore, { scale: 1, opacity: 0.6 }, { scale: 1.8, opacity: 1, duration: 0.05 }, 0.24);
  tl.fromTo(holoEmitter, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1.05, duration: 0.06, ease: 'back.out(1.5)' }, 0.26);
  tl.to(omniGlowCore, { scale: 1, opacity: 0, duration: 0.04 }, 0.36);

  // Phase 3: The Omnitrix opens, like the show — pistons pop, the black lines slide from the
  // hourglass into a cross, the centre square grows and pushes the corner pieces off the face
  // until one green diamond is left, which lights up with the alien's DNA silhouette
  // (the face itself is drawn from the timeline time — see faceQAt / syncFace above)
  tl.to(pistonLeft, { x: -14, duration: 0.03, ease: 'power2.out' }, FACE_TO_CROSS.start);
  tl.to(pistonRight, { x: 14, duration: 0.03, ease: 'power2.out' }, FACE_TO_CROSS.start);
  tl.to(omniGlowShape, { opacity: 0.85, duration: 0.03 }, FACE_TO_DIAMOND.end - 0.02);
  tl.to(silhouetteWrap, { opacity: 1, duration: 0.03 }, FACE_TO_DIAMOND.end);

  // Hold on the opened watch for a moment. Docking is not scrubbed: it plays together with the
  // jump to Alien 01 (see dockWatch), so the watch and the profile arrive at the same time.
  tl.to({}, { duration: 0.1 }, FACE_TO_DIAMOND.end + 0.03);
}

// Slide the opened watch to its dock beside the alien profile (or back to centre stage)
function dockWatch(instant = false) {
  const d = getDock();
  const vars = { x: d.x, y: d.y, scale: d.scale };
  // On phones the docked watch is tiny, so the halo rings would swamp the content
  const halo = { opacity: window.innerWidth < 900 ? 0 : 0.35 };
  if (instant) {
    gsap.set(omniMacroLayer, vars);
    gsap.set(holoEmitter, halo);
    return;
  }
  // A fast scroll can arrive while the intro's scrub is still catching up; finish it first so
  // its "watch settles to full size" tween can't fire after (and fight) the dock
  if (heroST) {
    const catchUp = heroST.getTween();
    if (catchUp) catchUp.progress(1);
    heroST.animation.progress(1);
  }
  // overwrite: a quick back-and-forth cancels the opposite slide instead of fighting it
  gsap.to(omniMacroLayer, { ...vars, duration: 0.7, ease: 'power3.inOut', overwrite: 'auto' });
  gsap.to(holoEmitter, { ...halo, duration: 0.5, overwrite: 'auto' });
}

function undockWatch() {
  gsap.to(omniMacroLayer, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
  gsap.to(holoEmitter, { opacity: 1, duration: 0.5, overwrite: 'auto' });
}

// Keep the docked watch in place when the layout changes
ScrollTrigger.addEventListener('refresh', () => {
  if (currentAlienIndex >= 0) dockWatch(true);
});

// ==============================================================
// 4. ALIEN SHOWCASE: ONE ALIEN PER DIAL CLICK
// ==============================================================
// Desktop ("stage"): the section pins and every wheel/swipe turns the dial exactly one
// alien, with a transformation flash. Phones/short screens ("flow"): normal scrolling,
// same transformation when a new alien reaches mid-screen.
const aliensSection = document.getElementById('aliens-viewport-section');
const alienPages = () => [...document.querySelectorAll('.alien-showcase-page')];

let alienMode = null; // { scrollYFor(idx), onChange(prev, next) }

// Fresh reveal of an alien's content every time it is transformed into
function revealAlien(page) {
  const tl = gsap.timeline();
  tl.fromTo(page.querySelector('.alien-name-title'),
    { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, 0.1);
  tl.fromTo(page.querySelector('.alien-poster-frame'),
    { scale: 1.15, opacity: 0, filter: 'blur(10px)' },
    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out', clearProps: 'filter' }, 0.05);
  tl.fromTo(page.querySelectorAll('.power-tag'),
    { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.04, duration: 0.3, ease: 'back.out(2)' }, 0.25);
  tl.fromTo(page.querySelectorAll('.stat-bar-fill'),
    { width: '0%' },
    { width: (i, el) => el.getAttribute('data-target-width'), stagger: 0.05, duration: 0.6, ease: 'power2.out' }, 0.3);
  return tl;
}

function initAlienStage() {
  aliensSection.classList.add('is-stage');
  const pages = alienPages();
  const N = pages.length;
  let shown = -1;
  let locked = false;

  // Stage = viewport below the nav; each alien's content is scaled down if it would overflow
  const sizeStage = () => {
    const available = window.innerHeight - stickyNav.offsetHeight;
    aliensListContainer.style.height = `${available}px`;
    pages.forEach(page => {
      const col = page.querySelector('.alien-data-column');
      col.style.transform = '';
      const fit = Math.min(1, (available - 24) / col.offsetHeight);
      col.style.transform = fit < 1 ? `scale(${fit.toFixed(3)})` : '';
    });
  };
  sizeStage();
  ScrollTrigger.addEventListener('refreshInit', sizeStage);

  gsap.set(pages, { autoAlpha: 0 });

  // One gesture = one alien (created first: the stage trigger below toggles it).
  // lastGestureAt tracks the latest wheel/touch event so a lock can outlast trackpad momentum.
  let lastGestureAt = 0;
  const observer = Observer.create({
    target: window,
    type: 'wheel,touch',
    wheelSpeed: -1,
    tolerance: 12,
    preventDefault: true,
    onChange: () => { lastGestureAt = performance.now(); },
    onUp: () => step(1),
    onDown: () => step(-1)
  });
  observer.disable();

  const st = ScrollTrigger.create({
    trigger: aliensSection,
    start: 'top top',
    end: () => `+=${(N - 1) * window.innerHeight}`,
    pin: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    // Scrollbar drags / keyboard land on a whole alien too
    snap: { snapTo: 1 / (N - 1), duration: { min: 0.2, max: 0.5 }, delay: 0.05, ease: 'power2.inOut' },
    onUpdate: (self) => {
      // Only while the stage is really on screen (also fires once when leaving it)
      if (isAutoScrolling || !self.isActive) return;
      const idx = Math.round(self.progress * (N - 1));
      if (idx !== currentAlienIndex) activateAlienSection(idx);
    }
  });

  // Heatblast is already on stage as the section slides up under the docked dial.
  // From here to the end of the stage, gestures step the dial (inclusive of the
  // snapped first position, where the pin itself doesn't count as active yet).
  const entry = ScrollTrigger.create({
    trigger: aliensSection,
    start: 'top 55%',
    end: () => st.end,
    // Activate the alien that matches where the page actually is (a reload or a scrollbar
    // drag can land mid-stage), not always Heatblast
    onEnter: () => activateAlienSection(window.scrollY > st.start ? Math.round(st.progress * (N - 1)) : 0),
    onLeaveBack: returnToHero,
    onToggle: (self) => (self.isActive ? observer.enable() : observer.disable())
  });

  const scrollYFor = (idx) => st.start + (idx / (N - 1)) * (st.end - st.start);

  // Ignore further gestures while a jump plays (and while trackpad momentum dies down)
  // A trackpad flick keeps sending momentum events for 1-2 s after the fingers lift; without
  // this, the tail of one flick would count as a second step. Unlock only once the events have
  // gone quiet (and never sooner than the transformation takes).
  const MIN_LOCK = 0.7;
  const QUIET_MS = 200;
  const lockGestures = () => {
    locked = true;
    const tryUnlock = () => {
      if (performance.now() - lastGestureAt >= QUIET_MS) locked = false;
      else gsap.delayedCall(0.1, tryUnlock);
    };
    gsap.delayedCall(MIN_LOCK, tryUnlock);
  };

  // No scrolling gap between the intro and the stage: leaving the intro jumps straight to
  // Alien 01 (the entry trigger above transforms it), and going back up from the stage jumps
  // straight back to the end of the intro — like any other dial click
  const gate = ScrollTrigger.create({
    start: () => heroST.end + 1,
    end: () => st.start - 1,
    // Only when the page actually sits in the gap (a single jump right over it fires these too)
    onEnter: () => {
      if (window.scrollY >= st.start) return;
      lockGestures();
      window.scrollTo(0, st.start);
    },
    onEnterBack: () => {
      if (window.scrollY <= heroST.end) return;
      window.scrollTo(0, heroST.end - 1);
      returnToHero();
    }
  });

  // Locked through the animation plus trackpad inertia
  function step(dir) {
    if (locked) return;
    const target = currentAlienIndex + dir;
    if (target < 0) {
      // Past Heatblast going up: jump back to the end of the intro
      observer.disable();
      window.scrollTo(0, heroST.end - 1);
      returnToHero();
      return;
    }
    if (target >= N) return;
    lockGestures();
    scrollToAlien(target);
  }

  alienMode = {
    scrollYFor,
    onChange: (prev, next) => {
      const outPage = shown >= 0 ? pages[shown] : null;
      const inPage = pages[next];
      shown = next;
      if (outPage && outPage !== inPage) {
        gsap.to(outPage, { autoAlpha: 0, scale: 0.94, filter: 'blur(8px)', duration: 0.25, ease: 'power2.in', overwrite: true,
          onComplete: () => gsap.set(outPage, { clearProps: 'filter,scale' }) });
      }
      gsap.fromTo(inPage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, delay: outPage ? 0.12 : 0, overwrite: true });
      revealAlien(inPage).delay(outPage ? 0.12 : 0);
    }
  };

  return () => {
    observer.kill();
    entry.kill();
    gate.kill();
    ScrollTrigger.removeEventListener('refreshInit', sizeStage);
    aliensSection.classList.remove('is-stage');
    aliensListContainer.style.height = '';
    pages.forEach(page => { page.querySelector('.alien-data-column').style.transform = ''; });
    gsap.set(pages, { clearProps: 'all' });
    alienMode = null;
  };
}

function initAlienFlow() {
  const pages = alienPages();
  pages.forEach((section, idx) => {
    // Exactly one section is "active" at a time: the one crossing mid-screen
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive && !isAutoScrolling) activateAlienSection(idx);
      },
      // Scrolling back up above the first alien re-arms the intro
      onLeaveBack: idx === 0 ? returnToHero : undefined
    });
  });

  alienMode = {
    scrollYFor: (idx) => pages[idx].getBoundingClientRect().top + window.scrollY,
    onChange: (prev, next) => { revealAlien(pages[next]); }
  };
  return () => { alienMode = null; };
}

function initAlienShowcaseAnimations() {
  const mm = gsap.matchMedia();
  mm.add({
    stage: '(min-width: 900px) and (min-height: 620px)',
    flow: '(max-width: 899px), (max-height: 619px)'
  }, (ctx) => (ctx.conditions.stage ? initAlienStage() : initAlienFlow()));
}

// The Omnitrix transformation between aliens: green flash, dial slam, shockwave
function playTransformation(alien) {
  audioEngine.playTransform();
  gsap.fromTo(transformFlash,
    { opacity: 0.8, backgroundColor: '#39ff14' },
    { opacity: 0, duration: 0.5, ease: 'power2.out', overwrite: true });
  gsap.fromTo(omniChassis, { scale: 1.12 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
  const c = dialScreenCenter();
  particleEngine.addShockwave(c.x, c.y, '#39ff14');
  particleEngine.addShockwave(c.x, c.y, alien.themeColor);
}

function activateAlienSection(idx) {
  if (currentAlienIndex === idx) return;
  const prev = currentAlienIndex;
  currentAlienIndex = idx;
  // Arriving from the intro: the watch docks as the first profile appears
  if (prev === -1) dockWatch();
  const alien = ALIENS_DATA[idx];

  currentAlienNum.innerText = alien.number;
  currentAlienNum.style.color = alien.accentColor;

  document.querySelectorAll('.alien-nav-node').forEach((node, i) => {
    if (i === idx) {
      node.classList.add('active');
      node.style.background = alien.themeColor;
      node.style.boxShadow = `0 0 15px ${alien.glowColor}`;
    } else {
      node.classList.remove('active');
      node.style.background = '#0d140f';
      node.style.boxShadow = 'none';
    }
  });

  // Turn the docked Omnitrix to this alien's DNA and transform
  turnDialTo(idx);
  particleEngine.setMode(alien.particleType, alien.themeColor, alien.accentColor);
  playTransformation(alien);
  if (alienMode) alienMode.onChange(prev, idx);
}

// ==============================================================
// 5. NAVIGATION & QUICK TRANSFORMATION CONTROLS
// ==============================================================

// Jump straight to an alien. It transforms immediately; the scroll catches up silently
// (no flicker through the aliens in between).
function scrollToAlien(idx, onArrive) {
  if (idx < 0 || idx >= ALIENS_DATA.length || !alienMode) return;
  const y = alienMode.scrollYFor(idx);
  const duration = gsap.utils.clamp(0.5, 1.4, Math.abs(y - window.scrollY) / 2500);

  activateAlienSection(idx);
  isAutoScrolling = true;
  gsap.to(window, {
    scrollTo: { y, autoKill: false },
    duration,
    ease: 'power2.inOut',
    overwrite: true,
    onComplete: () => {
      isAutoScrolling = false;
      if (onArrive) onArrive();
    },
    onInterrupt: () => {
      isAutoScrolling = false;
    }
  });
}

function triggerAlienTransform(idx) {
  const alien = ALIENS_DATA[idx];
  playTransformation(alien);
  const page = alienPages()[idx];
  const poster = page && page.querySelector('.alien-poster-frame');
  if (poster) {
    gsap.fromTo(poster, { scale: 1.08 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
  }
}

prevAlienBtn.addEventListener('click', () => {
  if (currentAlienIndex > 0) scrollToAlien(currentAlienIndex - 1);
});

nextAlienBtn.addEventListener('click', () => {
  scrollToAlien(Math.min(currentAlienIndex + 1, ALIENS_DATA.length - 1));
});

// Unlock Web Audio on the first real user gesture (scroll does not count as one)
['pointerdown', 'touchstart', 'keydown'].forEach(evt => {
  window.addEventListener(evt, () => audioEngine.init(), { once: true, passive: true });
});

// Interactive Dial Modal Controls
const dialBtn = document.getElementById('dial-modal-toggle');
if (dialBtn) {
  dialBtn.addEventListener('click', () => {
    audioEngine.playHolo();
    dialModal.classList.add('open');
    dialModal.setAttribute('aria-hidden', 'false');
  });
}

function closeModal() {
  dialModal.classList.remove('open');
  dialModal.setAttribute('aria-hidden', 'true');
}

modalCloseBtn.addEventListener('click', closeModal);
dialModalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dialModal.classList.contains('open')) closeModal();
});

wheelCore.addEventListener('click', () => {
  audioEngine.playActivate();
  gsap.to(wheelCoreImg, {
    rotation: '+=360',
    duration: 0.8,
    ease: 'power3.out',
    onComplete: () => {
      const randomIdx = Math.floor(Math.random() * ALIENS_DATA.length);
      closeModal();
      scrollToAlien(randomIdx);
    }
  });
});

// Mouse Parallax for Desktop Posters — moves the poster's wrapper so it never
// fights the GSAP transforms on the poster itself
const parallaxSetters = new Map();
function getParallaxSetter(col) {
  if (!parallaxSetters.has(col)) {
    parallaxSetters.set(col, {
      x: gsap.quickTo(col, 'x', { duration: 0.6, ease: 'power3.out' }),
      y: gsap.quickTo(col, 'y', { duration: 0.6, ease: 'power3.out' })
    });
  }
  return parallaxSetters.get(col);
}

document.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 1024 || currentAlienIndex < 0) return;
  const col = document.querySelector(`.alien-showcase-page[data-index="${currentAlienIndex}"] .alien-visual-column`);
  if (!col) return;
  const setter = getParallaxSetter(col);
  setter.x((e.clientX / window.innerWidth - 0.5) * 10);
  setter.y((e.clientY / window.innerHeight - 0.5) * 10);
});

// Keep trigger positions accurate once fonts/images change layout
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderModalDial, 200);
});
window.addEventListener('load', () => ScrollTrigger.refresh());
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

// Initialize (module scripts run after the DOM is parsed)
renderAliens();
renderModalDial();
turnDialTo(0, false);
initHeroScrollAnimation();
initAlienShowcaseAnimations();
