/**
 * EMAD KHAN — PORTFOLIO 2026
 * Polished Scroll-Driven Scattered 3D Collage
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════
     CURSOR — Rotating text ring
  ══════════════════════════════════════ */
  const cursor = document.getElementById('cursor-wrap');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function tickCursor() {
    cx += (mx - cx) * .09;   // lag for elegant trailing effect
    cy += (my - cy) * .09;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(tickCursor);
  })();

  function addHover(els) {
    els.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('h'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('h'));
      el.addEventListener('mousedown', () => cursor.classList.add('click'));
      el.addEventListener('mouseup', () => cursor.classList.remove('click'));
    });
  }
  addHover(document.querySelectorAll('.card, button, a, .dot'));


  /* ══════════════════════════════════════
     SLOT DEFINITIONS
     6 fixed positions matching reference image.
     Cards cycle through these slots on scroll.
  ══════════════════════════════════════ */
  const SLOTS = [
    // SLOT 0 — FRONT CENTER (large, prominent)
    {
      top: '30%', left: '22%',
      width: '445px', height: '290px',
      transform: 'rotateX(9deg) rotateY(-17deg) rotateZ(8deg)',
      zIndex: 20, opacity: 1
    },
    // SLOT 1 — TOP RIGHT (small, far)
    {
      top: '12%', left: '56%',
      width: '255px', height: '166px',
      transform: 'rotateX(22deg) rotateY(-27deg) rotateZ(18deg)',
      zIndex: 15, opacity: 0.92
    },
    // SLOT 2 — MID RIGHT (medium)
    {
      top: '35%', left: '71%',
      width: '305px', height: '194px',
      transform: 'rotateX(20deg) rotateY(-23deg) rotateZ(12deg)',
      zIndex: 16, opacity: 0.86
    },
    // SLOT 3 — BOTTOM RIGHT (small)
    {
      top: '64%', left: '68%',
      width: '245px', height: '154px',
      transform: 'rotateX(15deg) rotateY(-20deg) rotateZ(9deg)',
      zIndex: 14, opacity: 0.82
    },
    // SLOT 4 — BOTTOM LEFT (partially off-screen)
    {
      top: '70%', left: '25%',
      width: '270px', height: '170px',
      transform: 'rotateX(17deg) rotateY(-12deg) rotateZ(8deg)',
      zIndex: 13, opacity: 0.80
    },
    // SLOT 5 — BOTTOM CENTER
    {
      top: '76%', left: '48%',
      width: '242px', height: '152px',
      transform: 'rotateX(13deg) rotateY(0deg) rotateZ(7deg)',
      zIndex: 12, opacity: 0.78
    }
  ];

  /* Label positions relative to each slot */
  const LABEL_POS = [
    null,                                // slot 0 — featured label used
    { top: '-52px', left: '0' },         // slot 1 — above card
    { top: '-54px', left: '0' },         // slot 2 — above card
    { top: '-48px', left: '0' },         // slot 3 — above card
    { top: '-50px', left: '0' },         // slot 4 — above card
    { top: '-48px', left: '0' },         // slot 5 — above card
  ];

  /* ══════════════════════════════════════
     CARDS & STATE
  ══════════════════════════════════════ */
  const cards = Array.from(document.querySelectorAll('.card'));
  const labels = Array.from(document.querySelectorAll('.card-label'));
  const N = cards.length;

  // slotOf[i] = which slot card[i] is in
  let slotOf = cards.map((_, i) => i);
  let busy = false;

  /* ── Apply slot to card ── */
  function applySlot(cardIdx, slotIdx) {
    const card = cards[cardIdx];
    const label = labels[cardIdx];
    const s = SLOTS[slotIdx];
    const lp = LABEL_POS[slotIdx];

    card.style.top = s.top;
    card.style.left = s.left;
    card.style.width = s.width;
    card.style.height = s.height;
    card.style.transform = s.transform;
    card.style.zIndex = s.zIndex;
    card.style.opacity = s.opacity;
    card.className = `card s${slotIdx}`;

    if (lp) {
      label.style.top = lp.top || 'auto';
      label.style.left = lp.left || 'auto';
      label.style.right = lp.right || 'auto';
      label.style.bottom = 'auto';
    }
    label.classList.toggle('visible', slotIdx !== 0);
  }

  /* ── Render all slots ── */
  function render() {
    cards.forEach((_, i) => applySlot(i, slotOf[i]));
    updateFeatLabel();
    updateMeta();
  }

  /* ── Which card is at front (slot 0)? ── */
  function activeIdx() { return slotOf.indexOf(0); }

  /* ── Featured label ── */
  function updateFeatLabel() {
    const feat = document.getElementById('featLabel');
    const view = document.getElementById('featView');
    feat.classList.add('fade');
    if (view) view.classList.add('fade');

    clearTimeout(feat._t);
    feat._t = setTimeout(() => {
      const d = cards[activeIdx()].dataset;
      document.getElementById('flNum').textContent = d.num || '';
      document.getElementById('flTitle').textContent = d.title || '';
      document.getElementById('flCat').textContent = d.cat || '';
      document.getElementById('flStack').textContent = d.stack || '';
      feat.classList.remove('fade');
      if (view) view.classList.remove('fade');
    }, 240);
  }

  /* ── Dots + counter ── */
  const dotsEl = document.getElementById('dots');
  const ctrEl = document.getElementById('ctrC');
  const dots = [];

  cards.forEach((card, i) => {
    const d = document.createElement('button');
    d.className = 'dot';
    d.setAttribute('aria-label', `Project ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
    dots.push(d);
  });
  addHover(dots);

  function updateMeta() {
    const ai = activeIdx();
    // Animate counter (guard in case element is absent from HTML)
    if (ctrEl) {
      ctrEl.style.opacity = '0';
      clearTimeout(ctrEl._t);
      ctrEl._t = setTimeout(() => {
        ctrEl.textContent = String(ai + 1).padStart(2, '0');
        ctrEl.style.opacity = '1';
      }, 180);
    }
    dots.forEach((d, i) => d.classList.toggle('on', i === ai));
  }

  /* ══════════════════════════════════════
     NAVIGATION — Custom cycle
     Slot path: 1(TopRight)→0(Center)→4(BottomLeft)→5(BottomCenter)→3(BottomRight)→2(MidRight)→1
     CYCLE[currentSlot] = nextSlot
  ══════════════════════════════════════ */
  const CYCLE = [4, 0, 1, 2, 5, 3]; // forward:  0→4, 1→0, 2→1, 3→2, 4→5, 5→3
  const CYCLE_BACK = [1, 2, 3, 5, 0, 4]; // reverse (inverse permutation)

  function rotateNext() {
    slotOf = slotOf.map(s => CYCLE[s]);
    render();
  }

  function goNext() {
    if (busy) return;
    busy = true;
    rotateNext();
    setTimeout(() => busy = false, 750);
  }

  function goTo(cardIdx) {
    if (busy || slotOf[cardIdx] === 0) return;
    busy = true;
    // Step forward through cycle until target card reaches slot 0
    let guard = 0;
    while (slotOf[cardIdx] !== 0 && guard++ < N) {
      slotOf = slotOf.map(s => CYCLE[s]);
    }
    render();
    setTimeout(() => busy = false, 850);
  }

  /* ── Auto-rotate every 1.5s ── */
  setInterval(goNext, 1500);




  /* ── Card click ── */
  const modal = document.getElementById('modal');
  const mcX = document.getElementById('mcX');

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (slotOf[i] !== 0) { goTo(i); return; }
      const d = card.dataset;
      document.getElementById('mImg').src = d.img || '';
      document.getElementById('mNum').textContent = d.num || '';
      document.getElementById('mTitle').textContent = d.title || '';
      document.getElementById('mCat').textContent = d.cat || '';
      document.getElementById('mDesc').textContent = d.desc || '';
      document.getElementById('mStack').textContent = d.stack || '';
      document.getElementById('mLink').href = d.link || '#';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
  mcX.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ── Menu ── */
  const nav = document.getElementById('navOverlay');
  document.getElementById('menuBtn').addEventListener('click', () => {
    nav.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
  });
  document.getElementById('navClose').addEventListener('click', () => {
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
  });
  const aboutNavBtn = document.getElementById('aboutNavBtn');
  if (aboutNavBtn) {
    aboutNavBtn.addEventListener('click', () => {
      nav.classList.remove('open');
      nav.setAttribute('aria-hidden', 'true');
    });
  }

  /* ── Audio ── */
  const audioBtn = document.getElementById('audioBtn');
  let aon = false, actx, osc;
  audioBtn.addEventListener('click', () => {
    aon = !aon;
    audioBtn.classList.toggle('on', aon);
    audioBtn.innerHTML = `<span class="adot"></span> AUDIO ${aon ? 'ON' : 'OFF'}`;
    if (aon) {
      try {
        actx = new (window.AudioContext || window.webkitAudioContext)();
        osc = actx.createOscillator();
        const g = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(396, actx.currentTime);
        g.gain.setValueAtTime(0.028, actx.currentTime);
        osc.connect(g); g.connect(actx.destination); osc.start();
      } catch (e) { }
    } else { try { osc.stop(); } catch (e) { } }
  });

  /* ══════════════════════════════════════
     MOUSE PARALLAX — subtle scene tilt
  ══════════════════════════════════════ */
  const scene = document.getElementById('scene');
  let ptx = 0, pty = 0, plx = 0, ply = 0;

  document.addEventListener('mousemove', e => {
    ptx = (e.clientX / window.innerWidth - .5) * 2;
    pty = (e.clientY / window.innerHeight - .5) * 2;
  });

  (function tickParallax() {
    plx += (ptx - plx) * .04;
    ply += (pty - ply) * .04;
    scene.style.transform = `rotateY(${plx * 2.2}deg) rotateX(${-ply * 1.4}deg)`;
    requestAnimationFrame(tickParallax);
  })();

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  render();

  /* Staggered card entrance animation */
  cards.forEach((card, i) => {
    const targetOpacity = SLOTS[slotOf[i]].opacity;
    card.style.opacity = '0';
    card.style.transform = card.style.transform + ' translateY(20px)';
    setTimeout(() => {
      card.style.opacity = targetOpacity.toString();
      card.style.transform = SLOTS[slotOf[i]].transform;
    }, 120 + i * 90);
  });

  /* ══════════════════════════════════════
     MAGNETIC BUTTONS
  ══════════════════════════════════════ */
  const magneticEls = document.querySelectorAll('button, .hb, .nov-links a, .mi-btn');
  const MAGNET_STRENGTH = 0.32;
  const MAGNET_RADIUS = 90;

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAGNET_RADIUS) {
        const pull = (1 - dist / MAGNET_RADIUS) * MAGNET_STRENGTH;
        el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        el.style.transition = 'transform 0.12s cubic-bezier(.23,1,.32,1)';
      }
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0,0)';
      el.style.transition = 'transform 0.55s cubic-bezier(.23,1,.32,1)';
    });
  });

  /* ══════════════════════════════════════
     EDITORIAL INTRO — scroll reveal
  ══════════════════════════════════════ */
  const editorialSection = document.getElementById('editorialIntro');
  if (editorialSection) {
    const reveal = () => editorialSection.classList.add('revealed');

    const revealObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          revealObs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    revealObs.observe(editorialSection);

    /* Fallback: if scroll is blocked, reveal after user interaction */
    window.addEventListener('scroll', function onScroll() {
      const rect = editorialSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        reveal();
        window.removeEventListener('scroll', onScroll);
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════
     EDITORIAL PARAGRAPH — Scroll-Driven Character Reveal
  ══════════════════════════════════════ */
  const eiPara = document.querySelector('.ei-para');
  if (eiPara) {
    // ── 1. Split raw text into per-character spans ──
    const rawText = eiPara.textContent.trim();
    let splitHTML = '';
    for (let i = 0; i < rawText.length; i++) {
      splitHTML += rawText[i] === ' '
        ? '<span class="char char-space">&nbsp;</span>'
        : `<span class="char">${rawText[i]}</span>`;
    }
    eiPara.innerHTML = splitHTML;

    const chars = Array.from(eiPara.querySelectorAll('.char'));
    const N = chars.length;
    const eiSection = document.getElementById('editorialIntro');

    // ── 2. Force every char to dimmed state via inline style ──
    chars.forEach(c => { c.style.opacity = '0.15'; });

    // ── 3. Progress → opacity calculator ──
    //   Each char has a staggered window of the global 0→1 progress.
    //   First char lights up at p=0, last char lights up at p=0.65.
    //   Each char's own transition spans 35% of the total progress range.
    function applyProgress(p) {
      chars.forEach((c, i) => {
        const lo = (i / N) * 0.65;           // when this char starts
        const hi = lo + 0.35;                 // when this char finishes
        const cp = Math.max(0, Math.min(1, (p - lo) / (hi - lo)));
        c.style.opacity = (0.15 + cp * 0.85).toFixed(3);
      });
    }

    // ── 4. Drive via GSAP ScrollTrigger (onUpdate → full control) ──
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: eiSection,
        start: 'top 88%',         // start when section enters viewport
        end: 'bottom bottom',     // end when section bottom reaches viewport bottom
        onUpdate: self => applyProgress(self.progress),
        onLeave: () => applyProgress(1),   // ← fully reveal when scrolled past end
        onLeaveBack: () => applyProgress(0)    // reset when scrolled above start
      });

      setTimeout(() => ScrollTrigger.refresh(), 400);

    } else {
      // ── 4b. Pure-JS fallback (if GSAP CDN fails to load) ──
      let ticking = false;

      function scrollReveal() {
        if (!eiSection) return;
        const rect = eiSection.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.88;
        const end = -(eiSection.offsetHeight * 0.2);
        const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
        applyProgress(p);
      }

      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => { scrollReveal(); ticking = false; });
          ticking = true;
        }
      }, { passive: true });

      window.addEventListener('resize', scrollReveal, { passive: true });
      scrollReveal(); // initial state on load
    }
  }

  /* ══════════════════════════════════════
     HERO PARALLAX DEPTH ON SCROLL
  ══════════════════════════════════════ */
  const pageHero = document.querySelector('.page');
  function updateHeroParallax() {
    if (!pageHero) return;
    const scrollY = window.scrollY;
    const H = window.innerHeight;
    if (scrollY <= H) {
      const p = scrollY / H;
      pageHero.style.transform = `scale(${1 - p * 0.05}) translateY(${p * 24}px)`;
      pageHero.style.opacity = (1 - p * 0.3).toString();
    }
  }

  window.addEventListener('scroll', updateHeroParallax, { passive: true });


  /* ══════════════════════════════════════
     SKILLS SECTION — Scroll Reveal & Filtering
  ══════════════════════════════════════ */
  const skillsSec = document.getElementById('skillsSection');
  if (skillsSec) {
    const revealSkills = () => skillsSec.classList.add('sk-revealed');

    const skObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealSkills();
          skObs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    skObs.observe(skillsSec);

    window.addEventListener('scroll', function onSkScroll() {
      const rect = skillsSec.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        revealSkills();
        window.removeEventListener('scroll', onSkScroll);
      }
    }, { passive: true });
  }



  /* ══════════════════════════════════════
     FRAMER WAVY TICKER (Sine-Wave Motion Engine)
     Direct mathematical implementation of Framer's official WavyTicker
  ══════════════════════════════════════ */
  function createWavyTicker(containerId, itemsList, direction = 'left') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Framer WavyTicker parameters
    const speed = 48;             // speed px/sec
    const waveAmplitude = 22;     // wave amplitude (px)
    const waveFrequency = 0.006;  // wave frequency
    const gap = 20;               // gap between items (px)
    const slowdownOnHover = 0.2;  // hover slowdown multiplier

    let isHovered = false;
    container.addEventListener('mouseenter', () => isHovered = true);
    container.addEventListener('mouseleave', () => isHovered = false);

    // Repeat items sufficiently to ensure totalLoopWidth > window.innerWidth + 800px
    const rawItems = itemsList;
    const repeats = Math.max(5, Math.ceil((window.innerWidth * 3) / Math.max(rawItems.length * 120, 1)) + 3);
    const allItemsData = [];
    for (let r = 0; r < repeats; r++) {
      allItemsData.push(...rawItems);
    }

    container.innerHTML = '';

    const itemNodes = allItemsData.map((item) => {
      const el = document.createElement('div');
      el.className = 'wavy-item';
      el.innerHTML = `<img src="${item.icon}" alt="${item.name}" class="wavy-item-img" width="34" height="34" loading="eager" /><span class="wavy-item-name">${item.name}</span>`;
      container.appendChild(el);
      return { el, width: 0, xOffset: 0 };
    });

    // Measure widths and start requestAnimationFrame loop
    requestAnimationFrame(() => {
      let accumX = 0;
      itemNodes.forEach((node) => {
        const w = node.el.offsetWidth || 150;
        node.width = w;
        node.xOffset = accumX;
        accumX += w + gap;
      });

      const totalLoopWidth = accumX;
      let offset = 0;
      let lastTime = performance.now();

      function tickWavy(time) {
        const delta = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        const effectiveSpeed = isHovered ? speed * slowdownOnHover : speed;
        offset += effectiveSpeed * delta;

        itemNodes.forEach((node) => {
          let pos;
          if (direction === 'left') {
            // Left movement: x position decreases
            let raw = (node.xOffset - offset) % totalLoopWidth;
            if (raw < -node.width) {
              raw += totalLoopWidth;
            }
            pos = raw;
          } else {
            // Right movement: x position increases smoothly
            let raw = ((node.xOffset + offset) % totalLoopWidth + totalLoopWidth) % totalLoopWidth;
            const wrapThreshold = Math.min(window.innerWidth + node.width, totalLoopWidth - node.width);
            if (raw > wrapThreshold) {
              raw -= totalLoopWidth;
            }
            pos = raw;
          }

          // Exact Sine Wave vertical displacement formula from Framer WavyTicker:
          // waveY = Math.sin((pos + offset) * waveFrequency) * waveAmplitude
          const waveY = Math.sin((pos + (direction === 'left' ? offset : -offset)) * waveFrequency) * waveAmplitude;

          node.el.style.transform = `translate3d(${pos.toFixed(2)}px, calc(-50% + ${waveY.toFixed(2)}px), 0)`;
        });

        requestAnimationFrame(tickWavy);
      }

      requestAnimationFrame(tickWavy);
      addHover(container.querySelectorAll('.wavy-item'));
    });
  }

  // Row 1: Frontend & Animation Skills with local PNG/SVG Tech Logos
  const row1Skills = [
    { name: 'HTML', icon: 'images/icons/html.svg' },
    { name: 'CSS', icon: 'images/icons/css.svg' },
    { name: 'JavaScript', icon: 'images/icons/javascript.svg' },
    { name: 'React.js', icon: 'images/icons/react.svg' },
    { name: 'React Native', icon: 'images/icons/react-native.svg' },
    { name: 'Tailwind CSS', icon: 'images/icons/tailwind.svg' },
    { name: 'GSAP', icon: 'images/icons/gsap.svg' },
    { name: 'Framer Motion', icon: 'images/icons/framer-motion.svg' },
    { name: 'Locomotive Scroll', icon: 'images/icons/locomotive.svg' },
    { name: 'Node.js', icon: 'images/icons/nodejs.svg' },
    { name: 'Express.js', icon: 'images/icons/express.svg' }
  ];

  // Row 2: Backend, Database & Developer Tools with local PNG/SVG Tech Logos
  const row2Skills = [
    { name: 'MongoDB', icon: 'images/icons/mongodb.svg' },
    { name: 'Mongoose', icon: 'images/icons/mongoose.svg' },
    { name: 'EJS', icon: 'images/icons/ejs.svg' },
    { name: 'REST API', icon: 'images/icons/rest-api.svg' },
    { name: 'Java', icon: 'images/icons/java.svg' },
    { name: 'XML', icon: 'images/icons/xml.svg' },
    { name: 'Firebase', icon: 'images/icons/firebase.svg' },
    { name: 'Git', icon: 'images/icons/git.svg' },
    { name: 'GitHub', icon: 'images/icons/github.svg' },
    { name: 'Postman', icon: 'images/icons/postman.svg' },
    { name: 'Vite', icon: 'images/icons/vite.svg' }
  ];

  createWavyTicker('wavyTickerContainerRow1', row1Skills, 'left');
  createWavyTicker('wavyTickerContainerRow2', row2Skills, 'right');

});


