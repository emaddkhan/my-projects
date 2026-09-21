/**
 * EMAD KHAN — PORTFOLIO 2026
 * Polished Scroll-Driven Scattered 3D Collage
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════
     CURSOR — smooth magnetic feel
  ══════════════════════════════════════ */
  const cursor = document.getElementById('cursor');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function tickCursor() {
    cx += (mx - cx) * .115;
    cy += (my - cy) * .115;
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
      top: '24%', left: '16%',
      width: '430px', height: '282px',
      transform: 'rotateX(9deg) rotateY(-17deg) rotateZ(4deg)',
      zIndex: 20, opacity: 1
    },
    // SLOT 1 — TOP RIGHT (small, far)
    {
      top: '7%', left: '63%',
      width: '268px', height: '172px',
      transform: 'rotateX(22deg) rotateY(-27deg) rotateZ(14deg)',
      zIndex: 15, opacity: 0.92
    },
    // SLOT 2 — MID RIGHT (medium)
    {
      top: '38%', left: '70%',
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
      top: '58%', left: '-2%',
      width: '316px', height: '200px',
      transform: 'rotateX(17deg) rotateY(-12deg) rotateZ(-9deg)',
      zIndex: 13, opacity: 0.80
    },
    // SLOT 5 — BOTTOM CENTER
    {
      top: '66%', left: '37%',
      width: '242px', height: '152px',
      transform: 'rotateX(13deg) rotateY(-9deg) rotateZ(4deg)',
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

    card.style.cssText = `
      top: ${s.top};
      left: ${s.left};
      width: ${s.width};
      height: ${s.height};
      transform: ${s.transform};
      z-index: ${s.zIndex};
      opacity: ${s.opacity};
    `;
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
    view.classList.add('fade');

    clearTimeout(feat._t);
    feat._t = setTimeout(() => {
      const d = cards[activeIdx()].dataset;
      document.getElementById('flNum').textContent = d.num || '';
      document.getElementById('flTitle').textContent = d.title || '';
      document.getElementById('flCat').textContent = d.cat || '';
      document.getElementById('flStack').textContent = d.stack || '';
      feat.classList.remove('fade');
      view.classList.remove('fade');
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
     NAVIGATION
  ══════════════════════════════════════ */
  function rotate(dir) {
    // Shift all slot assignments by dir
    slotOf = slotOf.map(s => ((s - dir) + N) % N);
    render();
  }

  function goNext() {
    if (busy) return;
    busy = true;
    rotate(1);
    setTimeout(() => busy = false, 750);
  }
  function goPrev() {
    if (busy) return;
    busy = true;
    rotate(-1);
    setTimeout(() => busy = false, 750);
  }
  function goTo(cardIdx) {
    if (busy || slotOf[cardIdx] === 0) return;
    busy = true;
    const steps = slotOf[cardIdx];
    slotOf = slotOf.map(s => ((s - steps) + N) % N);
    render();
    setTimeout(() => busy = false, 850);
  }

  /* ── Scroll wheel ── */
  let sbuf = 0, stimer = null;
  document.addEventListener('wheel', e => {
    e.preventDefault();
    sbuf += e.deltaY;
    clearTimeout(stimer);
    stimer = setTimeout(() => {
      if (sbuf > 40) goNext();
      if (sbuf < -40) goPrev();
      sbuf = 0;
    }, 55);
  }, { passive: false });

  /* ── Keyboard ── */
  document.addEventListener('keydown', e => {
    if (['ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); goNext(); }
    if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); goPrev(); }
  });

  /* ── Touch swipe ── */
  let tx = 0, ty = 0;
  document.addEventListener('touchstart', e => {
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy < -40) goNext(); else if (dy > 40) goPrev();
    } else {
      if (dx < -40) goNext(); else if (dx > 40) goPrev();
    }
  }, { passive: true });

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
    card.style.transition = 'none';
    card.style.opacity = '0';
    setTimeout(() => {
      card.style.transition = '';
      card.style.opacity = SLOTS[slotOf[i]].opacity.toString();
    }, 100 + i * 80);
  });

});
