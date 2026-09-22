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
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(tickCursor);
  })();

  function addHover(els) {
    els.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('h'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('h'));
      el.addEventListener('mousedown', () => cursor.classList.add('click'));
      el.addEventListener('mouseup',   () => cursor.classList.remove('click'));
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
      top: '24%', left: '16%',
      width: '430px', height: '282px',
      transform: 'rotateX(9deg) rotateY(-17deg) rotateZ(4deg)',
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
    // Animate counter
    ctrEl.style.opacity = '0';
    clearTimeout(ctrEl._t);
    ctrEl._t = setTimeout(() => {
      ctrEl.textContent = String(ai + 1).padStart(2, '0');
      ctrEl.style.opacity = '1';
    }, 180);
    dots.forEach((d, i) => d.classList.toggle('on', i === ai));
  }

  /* ══════════════════════════════════════
     NAVIGATION — Custom cycle
     Slot path: 1(TopRight)→0(Center)→4(BottomLeft)→5(BottomCenter)→3(BottomRight)→2(MidRight)→1
     CYCLE[currentSlot] = nextSlot
  ══════════════════════════════════════ */
  const CYCLE      = [4, 0, 1, 2, 5, 3]; // forward:  0→4, 1→0, 2→1, 3→2, 4→5, 5→3
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
  const MAGNET_RADIUS   = 90;

  magneticEls.forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAGNET_RADIUS) {
        const pull = (1 - dist / MAGNET_RADIUS) * MAGNET_STRENGTH;
        el.style.transform  = `translate(${dx * pull}px, ${dy * pull}px)`;
        el.style.transition = 'transform 0.12s cubic-bezier(.23,1,.32,1)';
      }
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform  = 'translate(0,0)';
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

});
