/**
 * EMAD KHAN — PORTFOLIO 2026
 * Polished Scroll-Driven Scattered 3D Collage
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════
     CURSOR (Disabled - using standard browser cursor)
  ══════════════════════════════════════ */
  const cursor = document.getElementById('cursor-wrap');
  function addHover(els) {
    if (!cursor) return;
    els.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('h'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('h'));
      el.addEventListener('mousedown', () => cursor.classList.add('click'));
      el.addEventListener('mouseup', () => cursor.classList.remove('click'));
    });
  }


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

  /* ══════════════════════════════════════
     MEINE WORK — FRAMER DEPTH BLUR CAROUSEL (INTERACTIVE SLIDER)
  ══════════════════════════════════════ */
  const depthWrapper = document.getElementById('depthWrapper');
  const depthTrack = document.getElementById('depthTrack');
  const depthPrev = document.getElementById('depthPrev');
  const depthNext = document.getElementById('depthNext');
  const depthDotsContainer = document.getElementById('depthDots');

  if (depthWrapper && depthTrack) {
    const cards = Array.from(depthTrack.querySelectorAll('.depth-card'));
    const totalCards = cards.length;

    let currentPos = 0;      // Current lerp position
    let targetPos = 0;       // Target card position index
    let isDragging = false;
    let dragStartX = 0;
    let dragPosStart = 0;
    let isHovered = false;
    let autoSlideTimer = null;

    function resetAutoSlide() {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
      autoSlideTimer = setInterval(() => {
        if (!isDragging && !isHovered) {
          targetPos = Math.round(targetPos) + 1;
        }
      }, 3000); // Automatically steps to next card every 2.5 seconds
    }

    depthWrapper.addEventListener('mouseenter', () => { isHovered = true; });
    depthWrapper.addEventListener('mouseleave', () => { isHovered = false; resetAutoSlide(); });

    // Create pagination dots
    if (depthDotsContainer) {
      depthDotsContainer.innerHTML = '';
      cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `depth-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
          targetPos = i;
          resetAutoSlide();
        });
        depthDotsContainer.appendChild(dot);
      });
    }

    addHover(cards);

    // Mouse Drag / Touch Swipe
    depthWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragPosStart = targetPos;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const isMobile = window.innerWidth <= 768;
      const cardSpacing = isMobile ? 220 : 340;
      const diffX = (dragStartX - e.clientX) / cardSpacing;
      targetPos = dragPosStart + diffX;
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        targetPos = Math.round(targetPos);
        resetAutoSlide();
      }
    });

    // Touch support for mobile swipe
    depthWrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragPosStart = targetPos;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const isMobile = window.innerWidth <= 768;
      const cardSpacing = isMobile ? 220 : 340;
      const diffX = (dragStartX - e.touches[0].clientX) / cardSpacing;
      targetPos = dragPosStart + diffX;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        targetPos = Math.round(targetPos);
        resetAutoSlide();
      }
    });

    // Nav Arrows Click
    if (depthPrev) depthPrev.addEventListener('click', () => {
      targetPos = Math.round(targetPos) - 1;
      resetAutoSlide();
    });
    if (depthNext) depthNext.addEventListener('click', () => {
      targetPos = Math.round(targetPos) + 1;
      resetAutoSlide();
    });

    // Keyboard Arrow Keys
    window.addEventListener('keydown', (e) => {
      const rect = depthWrapper.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') { targetPos = Math.round(targetPos) - 1; resetAutoSlide(); }
      if (e.key === 'ArrowRight') { targetPos = Math.round(targetPos) + 1; resetAutoSlide(); }
    });

    // Card Click behavior
    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        const activeIdx = (Math.round(currentPos) % totalCards + totalCards) % totalCards;
        if (i !== activeIdx) {
          targetPos = targetPos + (i - activeIdx);
          resetAutoSlide();
        } else {
          // Open Modal
          const d = card.dataset;
          const m = document.getElementById('modal');
          if (!m || !d) return;
          document.getElementById('mImg').src = d.img || '';
          document.getElementById('mNum').textContent = d.num || '';
          document.getElementById('mTitle').textContent = d.title || '';
          document.getElementById('mCat').textContent = d.cat || '';
          document.getElementById('mDesc').textContent = d.desc || '';
          document.getElementById('mStack').textContent = d.stack || '';
          document.getElementById('mLink').href = d.link || '#';
          m.classList.add('open');
          m.setAttribute('aria-hidden', 'false');
        }
      });
    });

    // Start auto slide timer on initialization
    resetAutoSlide();

    // 3D DEPTH BLUR ANIMATION RENDER LOOP (INTERACTIVE LERP, NO AUTO-SCROLLING MOTION)
    function renderFrame() {
      // Smooth lerp towards targetPos
      currentPos += (targetPos - currentPos) * 0.1;

      const isMobile = window.innerWidth <= 768;
      const cardSpacing = isMobile ? 220 : 340;
      const normalizedCurrent = (currentPos % totalCards + totalCards) % totalCards;
      const activeIdx = (Math.round(normalizedCurrent) % totalCards + totalCards) % totalCards;

      cards.forEach((card, i) => {
        let offset = i - normalizedCurrent;

        // Circular Wrap Math
        if (offset > totalCards / 2) offset -= totalCards;
        if (offset < -totalCards / 2) offset += totalCards;

        const absOffset = Math.abs(offset);
        const isCenter = absOffset < 0.35;

        if (isCenter) card.classList.add('active');
        else card.classList.remove('active');

        // Continuous 3D Depth Transforms & Real-time Gaussian Blur
        const translateX = offset * cardSpacing;
        const scale = isCenter
          ? 1.08 - absOffset * 0.1
          : Math.max(0.65, 1 - absOffset * 0.18);
        const blurPx = isCenter ? absOffset * 4 : Math.min(absOffset * 8, 20);
        const opacity = isCenter ? 1 : Math.max(0.2, 1 - absOffset * 0.35);
        const rotateY = offset * -16;
        const zIndex = 100 - Math.round(absOffset * 10);

        card.style.transform = `translate3d(${translateX.toFixed(2)}px, 0, ${isCenter ? (80 - absOffset * 60) : -absOffset * 90}px) scale(${scale.toFixed(3)}) rotateY(${rotateY.toFixed(2)}deg)`;
        card.style.filter = blurPx > 0.1 ? `blur(${blurPx.toFixed(1)}px)` : 'none';
        card.style.opacity = opacity.toFixed(2);
        card.style.zIndex = zIndex;
      });

      // Update Dots
      if (depthDotsContainer) {
        const dots = Array.from(depthDotsContainer.children);
        dots.forEach((dot, idx) => {
          if (idx === activeIdx) dot.classList.add('active');
          else dot.classList.remove('active');
        });
      }

      requestAnimationFrame(renderFrame);
    }

    requestAnimationFrame(renderFrame);
  }

  /* ══════════════════════════════════════
     SOTNICHENKO INTERACTIVE TEXT SURFACE ENGINE (LAG-FREE & SHADOW-FREE)
     Framer Shader Text Surface Distortion for "Meine WORK"
  ══════════════════════════════════════ */
  /* ══════════════════════════════════════
     SOTNICHENKO INTERACTIVE TEXT SURFACE ENGINE (LAG-FREE & SHADOW-FREE)
     Framer Shader Text Surface Distortion for "Meine WORK" and "Meine SKILLS"
  ══════════════════════════════════════ */
  function initInteractiveTextSurface(containerId, serifText = 'Meine', sansText = 'WORK') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'interactive-text-surface-canvas';
    container.appendChild(canvas);

    const defaultHeading = container.querySelector('.wavy-heading');

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: 'high-performance'
    });

    if (!gl) {
      if (defaultHeading) defaultHeading.style.display = 'block';
      return;
    }

    if (defaultHeading) defaultHeading.style.display = 'none';

    const VERTEX_SHADER = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = vec2(aPosition.x * 0.5 + 0.5, 0.5 - aPosition.y * 0.5);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const FRAGMENT_SHADER = `
      precision highp float;
      varying vec2 vUv;

      uniform sampler2D uTexture;
      uniform vec2 uResolution;
      uniform vec2 uPointer;
      uniform vec3 uBackground;
      uniform vec3 uTextColor;
      uniform float uRadius;
      uniform float uDepth;
      uniform float uSoftness;
      uniform float uStrength;

      float bumpProfile(float normalizedDistance) {
        float x = clamp(1.0 - normalizedDistance, 0.0, 1.0);
        float smoothBump = x * x * (3.0 - 2.0 * x);
        return pow(smoothBump, mix(0.7, 2.4, uSoftness));
      }

      float textAlpha(vec2 uv) {
        vec2 insideLow = step(vec2(0.0), uv);
        vec2 insideHigh = step(uv, vec2(1.0));
        float inside = insideLow.x * insideLow.y * insideHigh.x * insideHigh.y;
        return texture2D(uTexture, clamp(uv, 0.0, 1.0)).a * inside;
      }

      void main() {
        vec2 safeResolution = max(uResolution, vec2(1.0));
        vec2 pointerUv = uPointer / safeResolution;
        vec2 deltaPx = (vUv - pointerUv) * safeResolution;
        float distancePx = length(deltaPx);
        float normalizedDistance = distancePx / max(uRadius, 1.0);
        float height = bumpProfile(normalizedDistance) * uStrength;
        vec2 direction = deltaPx / max(distancePx, 0.0001);

        vec2 warpScale = vec2(uRadius) / safeResolution;
        vec2 warpedUv = vUv - direction * warpScale * height * uDepth * 0.105;
        float glyph = textAlpha(warpedUv);

        vec3 color = mix(uBackground, uTextColor, glyph);

        gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
      }
    `;

    function compileShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
      return s;
    }

    const vert = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const locs = {
      resolution: gl.getUniformLocation(prog, 'uResolution'),
      pointer: gl.getUniformLocation(prog, 'uPointer'),
      background: gl.getUniformLocation(prog, 'uBackground'),
      textColor: gl.getUniformLocation(prog, 'uTextColor'),
      radius: gl.getUniformLocation(prog, 'uRadius'),
      depth: gl.getUniformLocation(prog, 'uDepth'),
      softness: gl.getUniformLocation(prog, 'uSoftness'),
      strength: gl.getUniformLocation(prog, 'uStrength'),
      texture: gl.getUniformLocation(prog, 'uTexture')
    };

    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');

    let width = 1, height = 1, ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, strength: 0.0, targetStrength: 0.0 };

    const bgRgb = [0.929, 0.925, 0.902]; // #edece6
    const textRgb = [0.067, 0.067, 0.075]; // #111113

    const uploadTextTexture = () => {
      if (!textCtx) return;
      textCanvas.width = Math.max(1, Math.round(width * ratio));
      textCanvas.height = Math.max(1, Math.round(height * ratio));
      textCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      textCtx.clearRect(0, 0, width, height);

      const vw = window.innerWidth;
      const fontSize = Math.min(Math.max(72, vw * 0.095), 184);

      const fontSerif = `italic 400 ${fontSize}px "Nymph Font", "Nymph", "Nymphe", "Playfair Display", "Bodoni Moda", serif`;
      const fontSans = `700 ${fontSize}px "Space Grotesk", "Inter", sans-serif`;

      textCtx.font = fontSerif;
      const wSerif = textCtx.measureText(serifText + " ").width;
      textCtx.font = fontSans;
      const wSans = textCtx.measureText(sansText).width;
      const totalW = wSerif + wSans;

      const startX = (width - totalW) / 2;
      const startY = height / 2 + fontSize * 0.32;

      textCtx.fillStyle = "#FFFFFF";

      textCtx.font = fontSerif;
      textCtx.fillText(serifText + " ", startX, startY);

      textCtx.font = fontSans;
      textCtx.fillText(sansText, startX + wSerif, startY);

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(rect.width, 1);
      const h = Math.max(rect.height, 1);
      const r = Math.min(window.devicePixelRatio || 1, 1.5);
      width = w; height = h; ratio = r;
      canvas.width = Math.round(w * r);
      canvas.height = Math.round(h * r);
      gl.viewport(0, 0, canvas.width, canvas.height);
      uploadTextTexture();
    };

    const draw = () => {
      gl.useProgram(prog);
      gl.uniform2f(locs.resolution, width, height);
      gl.uniform2f(locs.pointer, pointer.x * width, pointer.y * height);
      gl.uniform3f(locs.background, bgRgb[0], bgRgb[1], bgRgb[2]);
      gl.uniform3f(locs.textColor, textRgb[0], textRgb[1], textRgb[2]);
      gl.uniform1f(locs.radius, Math.min(260, Math.max(width, height) * 0.7));
      gl.uniform1f(locs.depth, 0.95);
      gl.uniform1f(locs.softness, 0.42);
      gl.uniform1f(locs.strength, pointer.strength);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    let animFrame = 0;
    let isMoving = false;

    const animate = () => {
      const dx = pointer.targetX - pointer.x;
      const dy = pointer.targetY - pointer.y;
      const ds = pointer.targetStrength - pointer.strength;

      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005 || Math.abs(ds) > 0.0005) {
        pointer.x += dx * 0.14;
        pointer.y += dy * 0.14;
        pointer.strength += ds * 0.14;
        draw();
        animFrame = requestAnimationFrame(animate);
      } else {
        pointer.x = pointer.targetX;
        pointer.y = pointer.targetY;
        pointer.strength = pointer.targetStrength;
        draw();
        isMoving = false;
        animFrame = 0;
      }
    };

    const requestTick = () => {
      if (!isMoving) {
        isMoving = true;
        animFrame = requestAnimationFrame(animate);
      }
    };

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      pointer.targetY = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
      pointer.targetStrength = 1.0;
      requestTick();
    };

    const onPointerLeave = () => {
      pointer.targetStrength = 0.0;
      requestTick();
    };

    window.addEventListener('resize', () => {
      resize();
      draw();
    }, { passive: true });
    
    // Strict scoping: animation triggers ONLY when mouse hovers over text canvas
    canvas.addEventListener('mousemove', onPointerMove, { passive: true });
    canvas.addEventListener('mouseleave', onPointerLeave, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches[0]) onPointerMove(e.touches[0]);
    }, { passive: true });

    resize();
    draw();

    if (document.fonts) {
      document.fonts.ready.then(() => {
        uploadTextTexture();
        draw();
      });
    }
  }

  // Initialize Interactive Text Surface for both section headings
  initInteractiveTextSurface('workCenterTitle', 'Meine', 'WORK');
  initInteractiveTextSurface('skillsCenterTitle', 'Meine', 'SKILLS');

});


